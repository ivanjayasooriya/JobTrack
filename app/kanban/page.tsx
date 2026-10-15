'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { KanbanBoard, ApplicationCardItem } from '@/components/applications/KanbanBoard.tsx';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal.tsx';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { Search, Plus, AlertCircle, Loader2, Zap } from 'lucide-react';

export default function KanbanPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationCardItem | null>(null);
  const [errorToast, setErrorToast] = useState('');

  const fetchApplications = async () => {
    try {
      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const res = await fetch('/api/applications', { headers });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications for kanban:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleStatusChange = async (appId: number, newStatus: string) => {
    const previousApps = [...applications];
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Server rejected status update');
      }
    } catch (err: any) {
      setApplications(previousApps);
      setErrorToast('Failed to update stage. Reverting card position.');
      setTimeout(() => setErrorToast(''), 4000);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = !priorityFilter || app.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar onOpenNewModal={() => setIsModalOpen(true)} />

      {errorToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-black bg-rose-400 text-black px-5 py-3 shadow-[4px_4px_0px_#000] flex items-center gap-2 text-xs font-black uppercase">
          <AlertCircle className="h-4 w-4" />
          <span>{errorToast}</span>
        </div>
      )}

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 flex flex-col space-y-5">
        {/* Comic Header Bar */}
        <div className="rounded-3xl border-[3px] border-black bg-cyan-200 dark:bg-zinc-900 p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-yellow-300 px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1.5px_1.5px_0px_#000] mb-1">
                <Zap className="h-3 w-3 fill-black stroke-black" />
                <span>INTERACTIVE PIPELINE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                Hiring Funnel Board
              </h1>
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Drag cards or use dropdowns to advance through recruitment stages.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-black stroke-[2.5]" />
                <input
                  type="text"
                  placeholder="Filter company/role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-52 pl-9 pr-3 py-1.5 rounded-xl border-2 border-black text-xs font-bold bg-white text-black placeholder-zinc-400 shadow-[2px_2px_0px_#000] focus:outline-none"
                />
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border-2 border-black text-xs font-black uppercase bg-white text-black shadow-[2px_2px_0px_#000] focus:outline-none"
              >
                <option value="">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <button
                onClick={() => {
                  setEditingApp(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Add Opportunity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Board Area */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        ) : (
          <div className="flex-1">
            <KanbanBoard
              applications={filteredApps}
              onStatusChange={handleStatusChange}
              onEdit={(app) => {
                setEditingApp(app);
                setIsModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

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
