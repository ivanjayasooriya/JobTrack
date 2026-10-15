import { describe, it, expect } from 'vitest';
import { calculateFunnelMetrics, ApplicationMetricSource } from './calculations.ts';
import { createApplicationSchema } from '../schemas/application.schema.ts';

describe('Analytics & Math Calculations', () => {
  it('handles empty dataset safely without division by zero', () => {
    const emptyResult = calculateFunnelMetrics([]);
    expect(emptyResult.total).toBe(0);
    expect(emptyResult.responseRate).toBe(0);
    expect(emptyResult.interviewRate).toBe(0);
    expect(emptyResult.offerRate).toBe(0);
    expect(emptyResult.activeCount).toBe(0);
    expect(Number.isNaN(emptyResult.responseRate)).toBe(false);
  });

  it('handles dataset where all applications are in Wishlist / Preparing', () => {
    const apps: ApplicationMetricSource[] = [
      { id: 1, status: 'Wishlist' },
      { id: 2, status: 'Preparing' },
    ];
    const result = calculateFunnelMetrics(apps);
    expect(result.total).toBe(2);
    expect(result.wishlist).toBe(2);
    expect(result.responseRate).toBe(0);
    expect(result.interviewRate).toBe(0);
    expect(result.offerRate).toBe(0);
    expect(result.activeCount).toBe(2);
  });

  it('calculates conversion rates accurately for mixed hiring funnel', () => {
    const apps: ApplicationMetricSource[] = [
      { id: 1, status: 'Applied' },
      { id: 2, status: 'Assessment' },
      { id: 3, status: 'Interview' },
      { id: 4, status: 'Technical Interview' },
      { id: 5, status: 'Offer' },
      { id: 6, status: 'Rejected' },
      { id: 7, status: 'Wishlist' },
    ];

    const result = calculateFunnelMetrics(apps);
    expect(result.total).toBe(7);
    expect(result.wishlist).toBe(1);

    // Submitted = 6 (Total 7 - Wishlist 1)
    // Responded = 5 (Assessment 1 + Interview 2 + Offer 1 + Rejected 1)
    // Response rate = (5 / 6) * 100 = 83.3%
    expect(result.responseRate).toBe(83.3);

    // Interviewed total = 3 (Interview 1 + Tech Interview 1 + Offer 1)
    // Interview rate = (3 / 6) * 100 = 50.0%
    expect(result.interviewRate).toBe(50);

    // Offered = 1
    // Offer rate = (1 / 6) * 100 = 16.7%
    expect(result.offerRate).toBe(16.7);

    // Active count = Total 7 - Rejected 1 = 6
    expect(result.activeCount).toBe(6);
  });
});

describe('Validation Schemas', () => {
  it('validates valid application creation payload', () => {
    const payload = {
      companyName: 'Stripe',
      position: 'Software Engineering Intern',
      jobType: 'Internship',
      workMode: 'Remote',
      status: 'Applied',
      priority: 'High',
      salary: '$55/hr',
    };

    const parsed = createApplicationSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it('rejects application payload without company or position', () => {
    const invalidPayload = {
      companyName: '',
      position: '',
    };

    const parsed = createApplicationSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });
});
