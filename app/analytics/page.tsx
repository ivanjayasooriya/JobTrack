'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { MetricCards } from '@/components/analytics/MetricCards.tsx';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Layers,
  PieChart,
  Loader2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MetricSummary } from '@/src/lib/calculations.ts';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<MetricSummary>({
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
  });
  const [byJobType, setByJobType] = useState<Record<string, number>>({});
  const [byWorkMode, setByWorkMode] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const headers: Record<string, string> = {};
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('jobtrack_guest_session');
          if (stored) {
            const g = JSON.parse(stored);
            headers['x-jobtrack-uid'] = g.uid;
          }
        }

        const res = await fetch('/api/analytics', { headers });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setByJobType(data.byJobType || {});
          setByWorkMode(data.byWorkMode || {});
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Comic Header Billboard */}
        <div className="rounded-3xl border-[3px] border-black bg-sky-200 dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-yellow-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
              <Zap className="h-3 w-3 fill-black stroke-black" />
              <span>PERFORMANCE TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
              Recruiting Funnel Analytics
            </h1>
            <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-300">
              Guarded conversion calculations, response rates, interview conversion ratios, and work-mode distribution.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
          </div>
        ) : (
          <>
            <MetricCards metrics={metrics} />

            {/* Funnel Stage Drop-off Breakdown */}
            <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black text-yellow-300 px-2 py-0.5 rounded">
                    FUNNEL
                  </span>
                  <h3 className="text-base sm:text-lg font-black uppercase text-black dark:text-white">
                    Stage Conversion & Drop-off Breakdown
                  </h3>
                </div>
                <span className="text-xs font-black uppercase text-zinc-500">
                  Total Tracked: {metrics.total}
                </span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    stage: 'Applied / Submitted',
                    count: metrics.total - metrics.wishlist,
                    percent: 100,
                    barColor: 'bg-sky-400',
                  },
                  {
                    stage: 'Online Assessments (OA / HackerRank)',
                    count: metrics.assessment,
                    percent:
                      metrics.total - metrics.wishlist > 0
                        ? Math.round(
                            (metrics.assessment / (metrics.total - metrics.wishlist)) * 100
                          )
                        : 0,
                    barColor: 'bg-yellow-400',
                  },
                  {
                    stage: 'Live Coding / Technical Rounds',
                    count: metrics.interview,
                    percent: metrics.interviewRate,
                    barColor: 'bg-purple-400',
                  },
                  {
                    stage: 'Offers Received',
                    count: metrics.offer + metrics.accepted,
                    percent: metrics.offerRate,
                    barColor: 'bg-lime-400',
                  },
                ].map((item) => (
                  <div key={item.stage} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-black dark:text-white uppercase">
                        {item.stage}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-black dark:text-white bg-yellow-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                          {item.count} applications
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400 font-bold">
                          ({item.percent}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full border-2 border-black overflow-hidden p-0.5 shadow-[1.5px_1.5px_0px_#000]">
                      <div
                        className={`h-full ${item.barColor} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.min(100, item.percent)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution Grid: Work Mode & Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Work Mode */}
              <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-black">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-cyan-300 text-black shadow-[1.5px_1.5px_0px_#000]">
                    <PieChart className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-sm font-black uppercase text-black dark:text-white">
                    Work Mode Breakdown
                  </h3>
                </div>

                <div className="space-y-3">
                  {Object.keys(byWorkMode).length === 0 ? (
                    <p className="text-xs font-bold text-zinc-400">No applications recorded yet.</p>
                  ) : (
                    Object.entries(byWorkMode).map(([mode, count]) => {
                      const pct = Math.round((count / (metrics.total || 1)) * 100);
                      return (
                        <div key={mode} className="space-y-1">
                          <div className="flex justify-between text-xs font-black">
                            <span className="uppercase text-black dark:text-white">{mode}</span>
                            <span>
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full border-2 border-black overflow-hidden p-0.5 shadow-[1px_1px_0px_#000]">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Job Type */}
              <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-black">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-purple-300 text-black shadow-[1.5px_1.5px_0px_#000]">
                    <BarChart3 className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-sm font-black uppercase text-black dark:text-white">
                    Job Type Distribution
                  </h3>
                </div>

                <div className="space-y-3">
                  {Object.keys(byJobType).length === 0 ? (
                    <p className="text-xs font-bold text-zinc-400">No applications recorded yet.</p>
                  ) : (
                    Object.entries(byJobType).map(([type, count]) => {
                      const pct = Math.round((count / (metrics.total || 1)) * 100);
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-xs font-black">
                            <span className="uppercase text-black dark:text-white">{type}</span>
                            <span>
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full border-2 border-black overflow-hidden p-0.5 shadow-[1px_1px_0px_#000]">
                            <div
                              className="h-full bg-purple-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
