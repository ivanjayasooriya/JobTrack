'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { MetricCards } from '@/components/analytics/MetricCards.tsx';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal.tsx';
import { StatusBadge } from '@/components/applications/StatusBadge.tsx';
import { useAuth } from '@/src/context/AuthContext.tsx';
import {
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Video,
  ListTodo,
  Check,
  Zap,
  Target,
} from 'lucide-react';
import { MetricSummary } from '@/src/lib/calculations.ts';

export default function DashboardPage() {
  const { user } = useAuth();
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
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadDashboardData = async () => {
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
        setUpcomingInterviews(data.upcomingInterviews || []);
        setPendingTasks(data.pendingTasks || []);
        setRecentEvents(data.recentEvents || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleSeed = async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const res = await fetch('/api/seed', { method: 'POST', headers });
      if (res.ok) {
        setToastMsg('★ Sample internship applications loaded! ★');
        loadDashboardData();
        setTimeout(() => setToastMsg(''), 4000);
      }
    } catch (e) {
      console.error('Seed error:', e);
    }
  };

  const handleToggleTask = async (taskId: number, currentCompleted: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentCompleted }),
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar onOpenNewModal={() => setIsModalOpen(true)} onSeedRequested={handleSeed} />

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-[2.5px] border-black bg-yellow-300 text-black px-5 py-3 shadow-[5px_5px_0px_#000] flex items-center gap-2 text-sm font-black uppercase tracking-wider animate-in fade-in">
          <Zap className="h-5 w-5 fill-black stroke-black" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Comic Billboard */}
        <div className="rounded-3xl border-[3px] border-black bg-yellow-100 dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-rose-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
                <Zap className="h-3 w-3 fill-black stroke-black" />
                <span>MISSION CONTROL</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-black dark:text-white">
                Application HQ
              </h1>
              <p className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Track active hiring funnels, OA challenges, live coding rounds, and offers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/kanban"
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-cyan-300 px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-cyan-400 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <span>Pipeline Board</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-rose-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-rose-500 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <span>+ Track Application</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State Prompt */}
        {metrics.total === 0 && !loading && (
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] text-center space-y-4">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl border-2 border-black bg-yellow-300 shadow-[3px_3px_0px_#000] mx-auto text-black">
              <Sparkles className="h-7 w-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-black dark:text-white">
                Your Job Track Is Ready For Action!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto mt-1">
                Hit &ldquo;Load Sample Tracker&rdquo; to populate realistic applications (Stripe,
                Google, Datadog, Figma) with OAs, interviews, and interview prep notes in 1 click!
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleSeed}
                className="rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                ★ Load Sample Tracker ★
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl border-2 border-black bg-white dark:bg-zinc-800 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black dark:text-white shadow-[3px_3px_0px_#000] hover:bg-zinc-100 transition-all"
              >
                Create First Entry
              </button>
            </div>
          </div>
        )}

        {/* Key Metrics Panels */}
        <MetricCards metrics={metrics} />

        {/* Funnel Distribution Panel */}
        <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-black">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-yellow-300 px-2 py-0.5 rounded">
                  FUNNEL
                </span>
                <h3 className="text-base font-black uppercase text-black dark:text-white">
                  Hiring Pipeline Breakdown
                </h3>
              </div>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-0.5">
                Current count of opportunities by hiring stage
              </p>
            </div>
            <Link
              href="/kanban"
              className="inline-flex items-center gap-1 text-xs font-black uppercase text-indigo-700 dark:text-yellow-300 hover:underline"
            >
              Open Kanban Board <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-2xl border-2 border-black bg-amber-100 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Wishlist
              </span>
              <p className="text-2xl font-black text-black mt-1">{metrics.wishlist}</p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-black bg-sky-200 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Applied
              </span>
              <p className="text-2xl font-black text-black mt-1">{metrics.applied}</p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-black bg-yellow-200 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Assessments
              </span>
              <p className="text-2xl font-black text-black mt-1">{metrics.assessment}</p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-black bg-purple-200 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Interviews
              </span>
              <p className="text-2xl font-black text-black mt-1">{metrics.interview}</p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-black bg-lime-300 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Offers!
              </span>
              <p className="text-2xl font-black text-black mt-1">
                {metrics.offer + metrics.accepted}
              </p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-black bg-rose-200 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Rejected
              </span>
              <p className="text-2xl font-black text-black mt-1">{metrics.rejected}</p>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Scheduled Interviews & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Interviews Comic Card */}
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-purple-300 text-black shadow-[2px_2px_0px_#000]">
                    <Video className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-black dark:text-white">
                      Upcoming Interviews
                    </h3>
                    <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      Live coding rounds & video screens
                    </p>
                  </div>
                </div>
                <Link
                  href="/interviews"
                  className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 hover:underline"
                >
                  View All →
                </Link>
              </div>

              {upcomingInterviews.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                  <p className="text-xs font-bold text-zinc-500">No upcoming interviews logged.</p>
                  <Link
                    href="/applications"
                    className="text-xs font-black text-indigo-700 dark:text-yellow-300 hover:underline mt-1 inline-block"
                  >
                    Schedule an interview from an application →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingInterviews.map((iv) => (
                    <div
                      key={iv.id}
                      className="p-3.5 rounded-2xl border-2 border-black bg-purple-50 dark:bg-zinc-800/80 shadow-[2.5px_2.5px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-black bg-purple-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                            {iv.round} Round
                          </span>
                          <span className="text-xs font-black text-black dark:text-white line-clamp-1">
                            {iv.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 stroke-[2.5]" />
                            {new Date(iv.scheduledAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>• {iv.durationMinutes} mins</span>
                        </div>
                      </div>

                      {iv.meetingUrl && (
                        <a
                          href={iv.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl border-2 border-black bg-yellow-300 px-3 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 self-start sm:self-auto"
                        >
                          Join <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actionable Tasks Comic Card */}
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-lime-300 text-black shadow-[2px_2px_0px_#000]">
                    <ListTodo className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-black dark:text-white">
                      Actionable Checklist
                    </h3>
                    <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      OAs, follow-ups, and resume revisions
                    </p>
                  </div>
                </div>
                <Link
                  href="/tasks"
                  className="text-xs font-black uppercase text-lime-700 dark:text-lime-300 hover:underline"
                >
                  Manage All →
                </Link>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                  <p className="text-xs font-bold text-zinc-500">No pending tasks. You&apos;re all caught up!</p>
                  <Link
                    href="/tasks"
                    className="text-xs font-black text-indigo-700 dark:text-yellow-300 hover:underline mt-1 inline-block"
                  >
                    + Add an action task
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl border-2 border-black bg-lime-50/70 dark:bg-zinc-800/80 shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleTask(task.id, false)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-white text-transparent hover:bg-emerald-200 hover:text-black transition-colors"
                          title="Mark complete"
                        >
                          <Check className="h-4 w-4 stroke-[3]" />
                        </button>
                        <div>
                          <p className="text-xs font-black text-black dark:text-white">
                            {task.title}
                          </p>
                          {task.dueDate && (
                            <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                              Due: {task.dueDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded border border-black bg-white text-black shadow-[1px_1px_0px_#000]">
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Activity Log */}
        {recentEvents.length > 0 && (
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-black">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-yellow-300 px-2 py-0.5 rounded">
                HISTORY
              </span>
              <h3 className="text-sm font-black uppercase text-black dark:text-white">
                Application Activity Feed
              </h3>
            </div>

            <div className="space-y-3">
              {recentEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl border-2 border-black bg-yellow-50 dark:bg-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-[2px_2px_0px_#000]"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full border border-black bg-yellow-400" />
                    <span className="font-black text-black dark:text-white">{ev.title}</span>
                    {ev.description && (
                      <span className="font-bold text-zinc-600 dark:text-zinc-300">
                        — {ev.description}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-zinc-500 shrink-0">
                    {new Date(ev.eventDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadDashboardData}
      />
    </div>
  );
}
