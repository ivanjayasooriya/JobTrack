'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { StatusBadge, PriorityBadge } from '@/components/applications/StatusBadge.tsx';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal.tsx';
import { InterviewModal } from '@/components/interviews/InterviewModal.tsx';
import { TaskModal } from '@/components/tasks/TaskModal.tsx';
import { applicationStatuses } from '@/src/schemas/application.schema.ts';
import {
  MapPin,
  ExternalLink,
  Mail,
  Phone,
  DollarSign,
  Clock,
  ArrowLeft,
  Edit2,
  Plus,
  Video,
  CheckCircle2,
  BookOpen,
  Loader2,
  Check,
  Zap,
} from 'lucide-react';

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const appId = parseInt(resolvedParams.id, 10);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePrepTab, setActivePrepTab] = useState<
    'research' | 'technical' | 'star' | 'questions' | 'retrospective'
  >('research');

  // Prep notes state
  const [prepForm, setPrepForm] = useState({
    companyResearch: '',
    technicalTopics: '',
    starStories: '',
    questionsToAsk: '',
    areasToImprove: '',
  });
  const [savingPrep, setSavingPrep] = useState(false);
  const [prepToast, setPrepToast] = useState('');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchApplicationDetails = async () => {
    try {
      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const res = await fetch(`/api/applications/${appId}`, { headers });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.prepNotes) {
          setPrepForm({
            companyResearch: json.prepNotes.companyResearch || '',
            technicalTopics: json.prepNotes.technicalTopics || '',
            starStories: json.prepNotes.starStories || '',
            questionsToAsk: json.prepNotes.questionsToAsk || '',
            areasToImprove: json.prepNotes.areasToImprove || '',
          });
        }
      } else if (res.status === 404) {
        router.push('/applications');
      }
    } catch (err) {
      console.error('Failed to load application details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchApplicationDetails();
      }
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleSavePrep = async () => {
    setSavingPrep(true);
    try {
      const res = await fetch(`/api/applications/${appId}/prep`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prepForm),
      });
      if (res.ok) {
        setPrepToast('★ Preparation notes saved to your dossier! ★');
        setTimeout(() => setPrepToast(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save prep notes:', err);
    } finally {
      setSavingPrep(false);
    }
  };

  const handleToggleTask = async (taskId: number, currentCompleted: boolean) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentCompleted }),
      });
      fetchApplicationDetails();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen comic-dots flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      </div>
    );
  }

  if (!data?.application) {
    return null;
  }

  const {
    application: app,
    events = [],
    interviews: appInterviews = [],
    tasks: appTasks = [],
  } = data;

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      {prepToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-black bg-yellow-300 text-black px-5 py-3 shadow-[5px_5px_0px_#000] flex items-center gap-2 text-xs font-black uppercase">
          <Zap className="h-4 w-4 fill-black stroke-black" />
          <span>{prepToast}</span>
        </div>
      )}

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-black dark:text-white bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-yellow-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            Back to Applications Roster
          </Link>
        </div>

        {/* Hero Comic Dossier Card */}
        <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge status={app.status} size="lg" />
                <PriorityBadge priority={app.priority} />
                <span className="text-xs font-black uppercase text-black bg-yellow-200 px-2.5 py-1 rounded-md border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                  {app.jobType} • {app.workMode}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white break-words">
                  {app.position}
                </h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1.5 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  <span className="text-base sm:text-lg font-black text-black dark:text-white bg-yellow-300 px-2 py-0.5 rounded border border-black">
                    {app.companyName}
                  </span>
                  {app.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {app.location}
                    </span>
                  )}
                  {app.salary && (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-black">
                      <DollarSign className="h-3.5 w-3.5 shrink-0" />
                      {app.salary}
                    </span>
                  )}
                  {app.deadline && (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-black">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      Due: {app.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-black dark:text-white">
                  Stage:
                </span>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="rounded-xl border-2 border-black bg-yellow-100 px-3 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_#000] focus:outline-none"
                >
                  {applicationStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3.5 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100"
              >
                <Edit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                Edit
              </button>

              <button
                onClick={() => setIsInterviewModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-purple-300 px-4 py-1.5 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-purple-400 active:translate-x-0.5 active:translate-y-0.5"
              >
                <Video className="h-3.5 w-3.5 stroke-[2.5]" />
                Schedule Round
              </button>
            </div>
          </div>

          {/* Links & Recruiter Strip */}
          <div className="pt-4 border-t-2 border-black grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            {/* Recruiter */}
            <div className="p-3 rounded-2xl border-2 border-black bg-yellow-50 dark:bg-zinc-800 shadow-[2px_2px_0px_#000] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black bg-yellow-300 px-1.5 py-0.5 rounded border border-black">
                Recruiter Contact
              </span>
              <p className="font-black text-black dark:text-white pt-1">
                {app.recruiterName || 'No recruiter name recorded'}
              </p>
              <div className="flex flex-col gap-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                {app.recruiterEmail && (
                  <a
                    href={`mailto:${app.recruiterEmail}`}
                    className="hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {app.recruiterEmail}
                  </a>
                )}
                {app.recruiterPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {app.recruiterPhone}
                  </span>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="p-3 rounded-2xl border-2 border-black bg-cyan-50 dark:bg-zinc-800 shadow-[2px_2px_0px_#000] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black bg-cyan-300 px-1.5 py-0.5 rounded border border-black">
                Submitted Documents
              </span>
              <p className="font-bold text-black dark:text-white pt-1">
                Resume Version: <span className="font-black underline">{app.resumeVersion || 'v1.0'}</span>
              </p>
              {app.coverLetterVersion && (
                <p className="text-zinc-600 dark:text-zinc-300">
                  Cover Letter: <span className="font-black">{app.coverLetterVersion}</span>
                </p>
              )}
            </div>

            {/* Links */}
            <div className="p-3 rounded-2xl border-2 border-black bg-lime-50 dark:bg-zinc-800 shadow-[2px_2px_0px_#000] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black bg-lime-300 px-1.5 py-0.5 rounded border border-black">
                Portals & Links
              </span>
              <div className="flex flex-col gap-1 pt-1">
                {app.jobUrl ? (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-black dark:text-white hover:underline font-black"
                  >
                    Job Posting Link <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                  </a>
                ) : (
                  <span className="text-zinc-400">No posting link</span>
                )}
                {app.portalUrl && (
                  <a
                    href={app.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-black dark:text-white hover:underline font-black"
                  >
                    Candidate Portal <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Left (Interviews & Tasks) / Right (Timeline & Prep Hub) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Scheduled Interviews */}
            <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 shadow-[5px_5px_0px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <h3 className="text-sm font-black uppercase text-black dark:text-white flex items-center gap-2">
                  <Video className="h-4 w-4 stroke-[2.5]" />
                  Interviews ({appInterviews.length})
                </h3>
                <button
                  onClick={() => setIsInterviewModalOpen(true)}
                  className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Round
                </button>
              </div>

              {appInterviews.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                  <p className="text-xs font-bold text-zinc-400">No interview rounds scheduled.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appInterviews.map((iv: any) => (
                    <div
                      key={iv.id}
                      className="p-3.5 rounded-2xl border-2 border-black bg-purple-50 dark:bg-zinc-800 shadow-[2.5px_2.5px_0px_#000] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black bg-purple-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                          {iv.round} Round
                        </span>
                        <span className="text-xs font-black text-black dark:text-zinc-300">
                          {iv.durationMinutes} mins
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-black dark:text-white">{iv.title}</h4>
                      <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        {new Date(iv.scheduledAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                      {iv.interviewers && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Interviewers: {iv.interviewers}
                        </p>
                      )}
                      {iv.meetingUrl && (
                        <a
                          href={iv.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-black uppercase text-indigo-700 dark:text-yellow-300 hover:underline"
                        >
                          Join Call <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preparation Action Items */}
            <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 shadow-[5px_5px_0px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <h3 className="text-sm font-black uppercase text-black dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  Action Items ({appTasks.length})
                </h3>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="text-xs font-black uppercase text-lime-700 dark:text-lime-300 hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Task
                </button>
              </div>

              {appTasks.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                  <p className="text-xs font-bold text-zinc-400">No action items attached.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {appTasks.map((t: any) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl border-2 border-black bg-lime-50 dark:bg-zinc-800 shadow-[2px_2px_0px_#000] flex items-start gap-2.5"
                    >
                      <button
                        onClick={() => handleToggleTask(t.id, t.isCompleted)}
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-lg border-2 border-black transition-colors ${
                          t.isCompleted
                            ? 'bg-black text-yellow-300'
                            : 'bg-white text-transparent hover:bg-emerald-200 hover:text-black'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </button>
                      <div className="flex-1 text-xs">
                        <p
                          className={`font-black ${
                            t.isCompleted
                              ? 'line-through text-zinc-400'
                              : 'text-black dark:text-white'
                          }`}
                        >
                          {t.title}
                        </p>
                        {t.dueDate && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            Due: {t.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Prep Hub & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Prep Hub */}
            <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0px_#000]">
                    <BookOpen className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase text-black dark:text-white">
                      Interview Preparation Dossier
                    </h3>
                    <p className="text-xs font-bold text-zinc-500">
                      Company intel, STAR answers, and questions for engineers
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSavePrep}
                  disabled={savingPrep}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 self-start sm:self-auto"
                >
                  {savingPrep ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  )}
                  Save Prep Notes
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 pb-2">
                {[
                  { id: 'research', label: 'Company Intel' },
                  { id: 'technical', label: 'Tech Stack & Topics' },
                  { id: 'star', label: 'STAR Stories' },
                  { id: 'questions', label: 'Questions to Ask' },
                  { id: 'retrospective', label: 'Retrospective' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePrepTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all ${
                      activePrepTab === tab.id
                        ? 'bg-yellow-300 text-black shadow-[2.5px_2.5px_0px_#000]'
                        : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-yellow-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                {activePrepTab === 'research' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                      Company Culture, Engineering Values & News
                    </label>
                    <textarea
                      rows={7}
                      placeholder="e.g. Core focus on API idempotency and 99.999% reliability. Read recent blog posts..."
                      value={prepForm.companyResearch}
                      onChange={(e) =>
                        setPrepForm({ ...prepForm, companyResearch: e.target.value })
                      }
                      className="w-full rounded-2xl border-2 border-black p-3.5 text-xs font-bold leading-relaxed text-black dark:text-white bg-yellow-50/50 dark:bg-zinc-800 focus:outline-none shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                )}

                {activePrepTab === 'technical' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                      Target Technologies & Data Structure Patterns
                    </label>
                    <textarea
                      rows={7}
                      placeholder="e.g. Distributed locks, idempotent POST endpoints, B-Tree indexes, LRU Cache..."
                      value={prepForm.technicalTopics}
                      onChange={(e) =>
                        setPrepForm({ ...prepForm, technicalTopics: e.target.value })
                      }
                      className="w-full rounded-2xl border-2 border-black p-3.5 text-xs font-bold leading-relaxed text-black dark:text-white bg-yellow-50/50 dark:bg-zinc-800 focus:outline-none shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                )}

                {activePrepTab === 'star' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                      STAR Behavioral Stories (Situation, Task, Action, Result)
                    </label>
                    <textarea
                      rows={7}
                      placeholder="Situation: Production database CPU spiked to 98% during peak load.
Task: Restore query throughput.
Action: Added compound index on (user_id, status) and optimized connection pool.
Result: Latency dropped by 65%."
                      value={prepForm.starStories}
                      onChange={(e) => setPrepForm({ ...prepForm, starStories: e.target.value })}
                      className="w-full rounded-2xl border-2 border-black p-3.5 text-xs font-bold font-mono leading-relaxed text-black dark:text-white bg-yellow-50/50 dark:bg-zinc-800 focus:outline-none shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                )}

                {activePrepTab === 'questions' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                      Questions for the Interviewer
                    </label>
                    <textarea
                      rows={7}
                      placeholder="e.g. 1. What does the deployment pipeline look like? 2. What project did the previous intern ship that had the most impact?"
                      value={prepForm.questionsToAsk}
                      onChange={(e) =>
                        setPrepForm({ ...prepForm, questionsToAsk: e.target.value })
                      }
                      className="w-full rounded-2xl border-2 border-black p-3.5 text-xs font-bold leading-relaxed text-black dark:text-white bg-yellow-50/50 dark:bg-zinc-800 focus:outline-none shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                )}

                {activePrepTab === 'retrospective' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                      Post-Interview Retrospective
                    </label>
                    <textarea
                      rows={7}
                      placeholder="e.g. State space complexity upfront. Practice dynamic programming memoization templates."
                      value={prepForm.areasToImprove}
                      onChange={(e) =>
                        setPrepForm({ ...prepForm, areasToImprove: e.target.value })
                      }
                      className="w-full rounded-2xl border-2 border-black p-3.5 text-xs font-bold leading-relaxed text-black dark:text-white bg-yellow-50/50 dark:bg-zinc-800 focus:outline-none shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Application Timeline Audit Trail */}
            <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-black">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-yellow-300 px-2 py-0.5 rounded">
                  LOG
                </span>
                <h3 className="text-base font-black uppercase text-black dark:text-white">
                  Chronological Timeline
                </h3>
              </div>

              <div className="space-y-3">
                {events.length === 0 ? (
                  <p className="text-xs font-bold text-zinc-400">No events logged yet.</p>
                ) : (
                  events.map((ev: any) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl border-2 border-black bg-yellow-50 dark:bg-zinc-800 shadow-[2.5px_2.5px_0px_#000] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-black dark:text-white">
                          {ev.title}
                        </span>
                        <span className="text-[10px] font-black uppercase text-zinc-500">
                          {new Date(ev.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      {ev.description && (
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {ev.description}
                        </p>
                      )}
                      {ev.newStatus && (
                        <div className="pt-1">
                          <span className="text-[10px] font-black uppercase bg-yellow-300 text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                            Stage: {ev.newStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <ApplicationFormModal
        isOpen={isEditModalOpen}
        initialData={app}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={fetchApplicationDetails}
      />

      {/* Interview Modal */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        applicationId={app.id}
        companyName={app.companyName}
        position={app.position}
        onClose={() => setIsInterviewModalOpen(false)}
        onSaved={fetchApplicationDetails}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        applicationId={app.id}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={fetchApplicationDetails}
      />
    </div>
  );
}
