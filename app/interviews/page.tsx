'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { InterviewModal } from '@/components/interviews/InterviewModal.tsx';
import {
  CalendarCheck2,
  Clock,
  ExternalLink,
  MapPin,
  Plus,
  Video,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Trash2,
  Zap,
  Sparkles,
  Award,
} from 'lucide-react';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<number | undefined>();
  const [filterResult, setFilterResult] = useState<string>('all');

  const loadData = async () => {
    try {
      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const [ivRes, appRes] = await Promise.all([
        fetch('/api/interviews', { headers }),
        fetch('/api/applications', { headers }),
      ]);

      if (ivRes.ok) {
        const data = await ivRes.json();
        setInterviews(data.interviews || []);
      }
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateResult = async (id: number, result: string) => {
    try {
      await fetch(`/api/interviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this interview entry?')) return;
    try {
      await fetch(`/api/interviews/${id}`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredInterviews = interviews.filter((iv) => {
    if (filterResult === 'all') return true;
    return iv.result === filterResult;
  });

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Comic Header Billboard */}
        <div className="rounded-3xl border-[3px] border-black bg-purple-200 dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-yellow-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
                <Zap className="h-3 w-3 fill-black stroke-black" />
                <span>INTERVIEW RADAR • ISSUE #2</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
                Interview Battleground
              </h1>
              <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-300">
                Log behavioral screens, HackerRank OAs, live coding rounds, and manager syncs.
              </p>
            </div>

            {applications.length > 0 && (
              <button
                onClick={() => {
                  setSelectedAppId(applications[0]?.id);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Schedule Round</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-black dark:text-white mr-1">
              Filter Outcome:
            </span>
            {(['all', 'Pending', 'Passed', 'Failed'] as const).map((resKey) => (
              <button
                key={resKey}
                onClick={() => setFilterResult(resKey)}
                className={`px-3 py-1 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all ${
                  filterResult === resKey
                    ? 'bg-black text-yellow-300 shadow-[2px_2px_0px_#000]'
                    : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_#000]'
                }`}
              >
                {resKey === 'all' ? `All (${interviews.length})` : resKey}
              </button>
            ))}
          </div>

          <div className="text-xs font-black text-zinc-600 dark:text-zinc-400">
            Total Logged: <span className="text-black dark:text-white underline">{interviews.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-8 sm:p-12 text-center shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-purple-300 text-black shadow-[3px_3px_0px_#000] mx-auto">
              <CalendarCheck2 className="h-7 w-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-black dark:text-white">
                {filterResult !== 'all' ? `No ${filterResult} Interviews Found` : 'No Interviews Scheduled Yet!'}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mt-1">
                When recruiters ping you for a tech phone screen, HackerRank assessment, or panel round, schedule it here to prepare STAR stories!
              </p>
            </div>
            {applications.length > 0 ? (
              <button
                onClick={() => {
                  setSelectedAppId(applications[0]?.id);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" /> Schedule First Round
              </button>
            ) : (
              <Link
                href="/applications"
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-cyan-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-cyan-400 transition-all"
              >
                Track An Opportunity First →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((iv) => {
              const dateObj = new Date(iv.scheduledAt);
              const isPast = dateObj < new Date();

              return (
                <div
                  key={iv.id}
                  className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 shadow-[5px_5px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black bg-purple-300 px-2.5 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                        {iv.round} Round
                      </span>
                      <div className="flex items-center gap-2">
                        {iv.result === 'Passed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-black bg-lime-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                            <CheckCircle2 className="h-3 w-3" /> Passed! 🎉
                          </span>
                        )}
                        {iv.result === 'Failed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-black bg-rose-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                            <XCircle className="h-3 w-3" /> Next Time
                          </span>
                        )}
                        {iv.result === 'Pending' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-black bg-yellow-200 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                            <HelpCircle className="h-3 w-3" /> Upcoming
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(iv.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Delete interview log"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <Link
                        href={`/applications/${iv.applicationId}`}
                        className="text-base font-black text-black dark:text-white hover:text-indigo-600 flex items-center gap-1"
                      >
                        <span className="bg-yellow-300 text-black px-1.5 py-0.5 rounded border border-black text-xs font-black">
                          {iv.companyName}
                        </span>
                        <span className="truncate">{iv.position}</span>
                      </Link>
                      <h4 className="text-sm font-black text-black dark:text-white mt-1.5">
                        {iv.title}
                      </h4>
                    </div>

                    <div className="text-xs space-y-1.5 text-zinc-700 dark:text-zinc-300 pt-2 border-t-2 border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-1.5 font-black text-black dark:text-zinc-200">
                        <Clock className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>
                          {dateObj.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="font-bold">Duration: {iv.durationMinutes} minutes</div>
                      {iv.interviewers && (
                        <div className="font-bold text-zinc-600 dark:text-zinc-400">
                          Panel: {iv.interviewers}
                        </div>
                      )}
                      {iv.notes && (
                        <div className="p-2.5 rounded-xl border border-black bg-yellow-50 dark:bg-zinc-800 text-[11px] font-bold text-black dark:text-zinc-200 shadow-[1.5px_1.5px_0px_#000]">
                          &ldquo;{iv.notes}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                    {/* Result selector */}
                    <select
                      value={iv.result}
                      onChange={(e) => handleUpdateResult(iv.id, e.target.value)}
                      className="text-xs font-black uppercase bg-yellow-100 border-2 border-black rounded-lg px-2 py-1 text-black shadow-[1.5px_1.5px_0px_#000] focus:outline-none"
                    >
                      <option value="Pending">Outcome: Pending</option>
                      <option value="Passed">Outcome: Passed</option>
                      <option value="Failed">Outcome: Rejected</option>
                      <option value="Cancelled">Outcome: Cancelled</option>
                    </select>

                    {iv.meetingUrl && (
                      <a
                        href={iv.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border-2 border-black bg-cyan-300 px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-cyan-400 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      >
                        Join Call <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedAppId && (
        <InterviewModal
          isOpen={isModalOpen}
          applicationId={selectedAppId}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadData}
        />
      )}
    </div>
  );
}
