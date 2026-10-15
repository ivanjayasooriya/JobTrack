export interface ApplicationMetricSource {
  id: number;
  status: string;
  applicationDate?: string | null;
  createdAt?: Date | null;
}

export interface MetricSummary {
  total: number;
  wishlist: number;
  applied: number;
  assessment: number;
  interview: number;
  offer: number;
  rejected: number;
  accepted: number;
  withdrawn: number;
  activeCount: number;
  responseRate: number; // Percentage 0 - 100
  interviewRate: number; // Percentage 0 - 100
  offerRate: number; // Percentage 0 - 100
}

/**
 * Calculates hiring funnel statistics with strict zero-guarding
 */
export function calculateFunnelMetrics(applications: ApplicationMetricSource[]): MetricSummary {
  const total = applications.length;
  if (total === 0) {
    return {
      total: 0,
      wishlist: 0,
      applied: 0,
      assessment: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      accepted: 0,
      withdrawn: 0,
      activeCount: 0,
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
    };
  }

  let wishlist = 0;
  let applied = 0;
  let assessment = 0;
  let interview = 0;
  let offer = 0;
  let rejected = 0;
  let accepted = 0;
  let withdrawn = 0;

  for (const app of applications) {
    switch (app.status) {
      case 'Wishlist':
      case 'Preparing':
        wishlist++;
        break;
      case 'Applied':
        applied++;
        break;
      case 'Assessment':
        assessment++;
        break;
      case 'Interview':
      case 'Technical Interview':
      case 'Final Interview':
        interview++;
        break;
      case 'Offer':
        offer++;
        break;
      case 'Accepted':
        accepted++;
        break;
      case 'Rejected':
        rejected++;
        break;
      case 'Withdrawn':
        withdrawn++;
        break;
      default:
        applied++;
        break;
    }
  }

  // Denominator: Total applications that have actually been submitted (beyond Wishlist/Preparing)
  const submittedCount = total - wishlist;

  // If none submitted yet, rates are 0%
  if (submittedCount <= 0) {
    return {
      total,
      wishlist,
      applied,
      assessment,
      interview,
      offer,
      rejected,
      accepted,
      withdrawn,
      activeCount: total - (rejected + accepted + withdrawn),
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
    };
  }

  // Response count includes any stage where company interacted or completed
  const respondedCount = assessment + interview + offer + accepted + rejected;
  const interviewedTotal = interview + offer + accepted;
  const offeredTotal = offer + accepted;

  const responseRate = Math.min(100, Math.round((respondedCount / submittedCount) * 1000) / 10);
  const interviewRate = Math.min(100, Math.round((interviewedTotal / submittedCount) * 1000) / 10);
  const offerRate = Math.min(100, Math.round((offeredTotal / submittedCount) * 1000) / 10);
  const activeCount = total - (rejected + accepted + withdrawn);

  return {
    total,
    wishlist,
    applied,
    assessment,
    interview,
    offer,
    rejected,
    accepted,
    withdrawn,
    activeCount,
    responseRate,
    interviewRate,
    offerRate,
  };
}
