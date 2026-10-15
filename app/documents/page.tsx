'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar.tsx';
import {
  FileText,
  Plus,
  Loader2,
  Trash2,
  CheckCircle2,
  X,
  FileCheck,
  Tag,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'RESUME',
    title: '',
    version: 'v1.0',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const loadDocs = async () => {
    try {
      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const res = await fetch('/api/documents', { headers });
      if (res.ok) {
        const d = await res.json();
        setDocuments(d.documents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    try {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setIsModalOpen(false);
      setForm({ type: 'RESUME', title: '', version: 'v1.0', notes: '' });
      loadDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      loadDocs();
    } catch (e) {
      console.error(e);
    }
  };

  const resumes = documents.filter((d) => d.type === 'RESUME');
  const coverLetters = documents.filter((d) => d.type === 'COVER_LETTER');

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Comic Header Billboard */}
        <div className="rounded-3xl border-[3px] border-black bg-cyan-200 dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-yellow-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
                <Zap className="h-3 w-3 fill-black stroke-black" />
                <span>ARSENAL & REVISIONS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
                Resume & Cover Letter Arsenal
              </h1>
              <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-300">
                Track tailored resumes (e.g., Backend, Systems, Full-Stack) and cover letter variations.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add Document Version</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Resumes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0px_#000]">
                  <FileCheck className="h-4 w-4 stroke-[2.5]" />
                </span>
                <h2 className="text-lg font-black uppercase text-black dark:text-white">
                  Resume Iterations ({resumes.length})
                </h2>
              </div>

              {resumes.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-3xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]">
                  <p className="text-xs font-bold text-zinc-500">No resume versions logged yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {resumes.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-5 rounded-3xl border-[2.5px] border-black bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-black bg-cyan-300 px-2.5 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                            Version {doc.version}
                          </span>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-zinc-400 hover:text-rose-600 p-1"
                            title="Delete record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="text-sm font-black text-black dark:text-white">
                          {doc.title}
                        </h3>
                        {doc.notes && (
                          <div className="p-2.5 rounded-xl border border-black bg-yellow-50 dark:bg-zinc-800 text-xs font-bold text-black dark:text-zinc-200">
                            &ldquo;{doc.notes}&rdquo;
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t-2 border-black/10 dark:border-white/10 text-[11px] font-bold text-zinc-500">
                        Added on {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cover Letters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-purple-300 text-black shadow-[2px_2px_0px_#000]">
                  <FileText className="h-4 w-4 stroke-[2.5]" />
                </span>
                <h2 className="text-lg font-black uppercase text-black dark:text-white">
                  Cover Letter Templates ({coverLetters.length})
                </h2>
              </div>

              {coverLetters.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-3xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000]">
                  <p className="text-xs font-bold text-zinc-500">No cover letters logged yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {coverLetters.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-5 rounded-3xl border-[2.5px] border-black bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-black bg-purple-300 px-2.5 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                            Version {doc.version}
                          </span>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-zinc-400 hover:text-rose-600 p-1"
                            title="Delete record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="text-sm font-black text-black dark:text-white">
                          {doc.title}
                        </h3>
                        {doc.notes && (
                          <div className="p-2.5 rounded-xl border border-black bg-yellow-50 dark:bg-zinc-800 text-xs font-bold text-black dark:text-zinc-200">
                            &ldquo;{doc.notes}&rdquo;
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t-2 border-black/10 dark:border-white/10 text-[11px] font-bold text-zinc-500">
                        Added on {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border-[3px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden my-6">
            <div className="flex items-center justify-between border-b-[2.5px] border-black bg-cyan-200 px-4 sm:px-6 py-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                  DOCUMENT TRACKER
                </span>
                <h3 className="text-lg font-black uppercase text-black mt-1">
                  Add Document Version
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_#000] hover:bg-rose-200 active:translate-x-0.5 active:translate-y-0.5"
              >
                <X className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Document Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
                >
                  <option value="RESUME">Resume / CV Version</option>
                  <option value="COVER_LETTER">Cover Letter Template</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Document Title / File Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resume_SWE_Backend_v3.pdf"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Version Tag
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. v3.0, Systems_Specialized"
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Tailoring Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Highlighted Docker, Go distributed systems, and PostgreSQL index optimization."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-cyan-300 px-5 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-cyan-400 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  ★ Save Document ★
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
