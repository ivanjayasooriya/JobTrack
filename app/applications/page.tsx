'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { ApplicationTable } from '@/components/applications/ApplicationTable.tsx';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal.tsx';
import { ApplicationCardItem } from '@/components/applications/KanbanBoard.tsx';
import { useAuth } from '@/src/context/AuthContext.tsx';
import {
  Search,
  Plus,
  Loader2,
  Briefcase,
  Zap,
} from 'lucide-react';
import { applicationStatuses, jobTypes } from '@/src/schemas/application.schema.ts';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationCardItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('jobType', typeFilter);
      if (sort) params.set('sort', sort);

      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const res = await fetch(`/api/applications?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search, statusFilter, typeFilter, sort]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchApplications();
      }
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar onOpenNewModal={() => setIsModalOpen(true)} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Comic Header Bar */}
        <div className="rounded-3xl border-[3px] border-black bg-lime-300 dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1.5px_1.5px_0px_#000] mb-1">
                <Briefcase className="h-3 w-3 stroke-[2.5]" />
                <span>ARCHIVE DIRECTORY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                Applications Roster
              </h1>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-300 mt-0.5">
                Inspect, filter, and manage every internship posting and recruiter record.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingApp(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Track Application</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-black stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search company, position, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-black text-xs font-bold bg-yellow-50/60 dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-400 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border-2 border-black text-xs font-black uppercase bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
            >
              <option value="">All Statuses ({applications.length})</option>
              {applicationStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border-2 border-black text-xs font-black uppercase bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
            >
              <option value="">All Job Types</option>
              {jobTypes.map((jt) => (
                <option key={jt} value={jt}>
                  {jt}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border-2 border-black text-xs font-black uppercase bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none"
            >
              <option value="newest">Sort: Newest Added</option>
              <option value="oldest">Sort: Oldest Added</option>
              <option value="deadline">Sort: Upcoming Deadline</option>
              <option value="company">Sort: Company Name</option>
            </select>
          </div>
        </div>

        {/* Table / Cards View */}
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        ) : (
          <ApplicationTable
            applications={applications}
            onEdit={(app) => {
              setEditingApp(app);
              setIsModalOpen(true);
            }}
            onDelete={(id) => setDeleteConfirmId(id)}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 p-6 border-[3px] border-black shadow-[8px_8px_0px_#000]">
            <h3 className="text-base font-black uppercase text-black dark:text-white">
              Delete Application Record?
            </h3>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-2">
              This will remove all interview logs, tasks, timeline milestones, and preparation
              notes for this role.
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border-2 border-black bg-white px-4 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-xl border-2 border-black bg-rose-400 px-4 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <ApplicationFormModal
        isOpen={isModalOpen}
        initialData={editingApp as any}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApp(null);
        }}
        onSaved={fetchApplications}
      />
    </div>
  );
}
