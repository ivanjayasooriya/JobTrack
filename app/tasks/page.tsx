'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { TaskModal } from '@/components/tasks/TaskModal.tsx';
import {
  CheckSquare,
  Clock,
  Plus,
  Loader2,
  Trash2,
  Check,
  Calendar,
  Filter,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      const [taskRes, appRes] = await Promise.all([
        fetch('/api/tasks', { headers }),
        fetch('/api/applications', { headers }),
      ]);

      if (taskRes.ok) {
        const d = await taskRes.json();
        setTasks(d.tasks || []);
      }
      if (appRes.ok) {
        const ad = await appRes.json();
        setApplications(ad.applications || []);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (taskId: number, currentCompleted: boolean) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !currentCompleted } : t))
      );

      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentCompleted }),
      });
      loadData();
    } catch (e) {
      console.error(e);
      loadData();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
      loadData();
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending') return !t.isCompleted;
    if (filterStatus === 'completed') return t.isCompleted;
    return true;
  });

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Comic Billboard Header */}
        <div className="rounded-3xl border-[3px] border-black bg-lime-300 dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
                <Zap className="h-3 w-3 fill-black stroke-black" />
                <span>MISSION CHECKLIST</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
                Action Items & OA Log
              </h1>
              <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-300">
                Organize coding assessments, STAR behavioral stories, follow-ups, and interview prep.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add Action Item</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all ${
              filterStatus === 'pending'
                ? 'bg-black text-yellow-300 shadow-[2px_2px_0px_#000]'
                : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_#000]'
            }`}
          >
            Pending ({tasks.filter((t) => !t.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all ${
              filterStatus === 'completed'
                ? 'bg-black text-yellow-300 shadow-[2px_2px_0px_#000]'
                : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_#000]'
            }`}
          >
            Completed ({tasks.filter((t) => t.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all ${
              filterStatus === 'all'
                ? 'bg-black text-yellow-300 shadow-[2px_2px_0px_#000]'
                : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_#000]'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
        </div>

        {/* Tasks list */}
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-8 sm:p-12 text-center shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-lime-300 text-black shadow-[3px_3px_0px_#000] mx-auto">
              <CheckSquare className="h-7 w-7 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-black uppercase text-black dark:text-white">
              {filterStatus === 'completed' ? 'No Completed Missions Yet' : 'All Missions Completed!'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
              Stay sharp by keeping track of Online Assessment links, mock interviews, and resume tweaks.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> Add New Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-3xl border-[2.5px] border-black bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all flex items-start justify-between gap-4 ${
                  t.isCompleted ? 'opacity-60 bg-zinc-50 dark:bg-zinc-800' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggle(t.id, t.isCompleted)}
                    className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-xl border-2 border-black transition-colors ${
                      t.isCompleted
                        ? 'bg-black text-yellow-300'
                        : 'bg-white text-transparent hover:bg-lime-200 hover:text-black'
                    }`}
                    title={t.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                  </button>

                  <div className="space-y-1">
                    <h3
                      className={`text-sm font-black ${
                        t.isCompleted
                          ? 'line-through text-zinc-400'
                          : 'text-black dark:text-white'
                      }`}
                    >
                      {t.title}
                    </h3>
                    {t.description && (
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {t.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      {t.companyName && (
                        <Link
                          href={`/applications/${t.applicationId}`}
                          className="font-black text-black bg-yellow-200 px-2 py-0.5 rounded border border-black text-[11px] hover:underline"
                        >
                          {t.companyName} • {t.position}
                        </Link>
                      )}
                      {t.dueDate && (
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-black text-[11px]">
                          <Clock className="h-3 w-3 stroke-[2.5]" /> Due: {t.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] ${
                      t.priority === 'High' || t.priority === 'Urgent'
                        ? 'bg-rose-400 text-black'
                        : t.priority === 'Medium'
                          ? 'bg-yellow-300 text-black'
                          : 'bg-zinc-200 text-black'
                    }`}
                  >
                    {t.priority}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-zinc-400 hover:text-rose-600 p-1.5 rounded transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        availableApplications={applications}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}
