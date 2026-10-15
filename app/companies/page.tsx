'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar.tsx';
import {
  Building2,
  ExternalLink,
  MapPin,
  Users,
  Briefcase,
  Plus,
  Loader2,
  X,
  Edit2,
  Trash2,
  Zap,
  Globe,
  Sparkles,
} from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    website: '',
    industry: '',
    location: '',
    size: '',
    description: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadCompanies = async () => {
    try {
      const headers: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const res = await fetch('/api/companies', { headers });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMsg('Company name is required');
      return;
    }
    setSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Failed to create company');
      }

      setIsModalOpen(false);
      setForm({
        name: '',
        website: '',
        industry: '',
        location: '',
        size: '',
        description: '',
        notes: '',
      });
      loadCompanies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this company profile?')) return;
    try {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      loadCompanies();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Comic Header Billboard */}
        <div className="rounded-3xl border-[3px] border-black bg-pink-300 dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-yellow-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
                <Zap className="h-3 w-3 fill-black stroke-black" />
                <span>COMPANY DOSSIERS • INTEL</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
                Companies Directory
              </h1>
              <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-300">
                Maintain culture research, tech stacks, and career portal links for target employers.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add Target Company</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-8 sm:p-12 text-center shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-pink-300 text-black shadow-[3px_3px_0px_#000] mx-auto">
              <Building2 className="h-7 w-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-black dark:text-white">
                No Companies Saved In Your Radar Yet
              </h3>
              <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mt-1">
                Companies are automatically created when you track applications, or you can register your dream companies right now with research notes!
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> Add First Company
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 shadow-[5px_5px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black uppercase text-black dark:text-white">
                        {c.name}
                      </h3>
                      {c.industry && (
                        <span className="inline-block text-[10px] font-black uppercase text-black bg-pink-200 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] mt-1">
                          {c.industry}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Delete company"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {c.description && (
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 line-clamp-2">
                      {c.description}
                    </p>
                  )}

                  <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400 pt-2 border-t-2 border-black/10 dark:border-white/10">
                    {c.location && (
                      <div className="flex items-center gap-1.5 font-bold">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-black dark:text-white" />
                        <span>{c.location}</span>
                      </div>
                    )}
                    {c.size && (
                      <div className="flex items-center gap-1.5 font-bold">
                        <Users className="h-3.5 w-3.5 shrink-0 text-black dark:text-white" />
                        <span>{c.size} employees</span>
                      </div>
                    )}
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-black dark:text-yellow-300 font-black hover:underline"
                      >
                        <Globe className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{c.website}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                  </div>

                  {c.notes && (
                    <div className="p-2.5 rounded-xl border border-black bg-yellow-50 dark:bg-zinc-800 text-xs font-bold text-black dark:text-zinc-200 shadow-[1.5px_1.5px_0px_#000]">
                      &ldquo;{c.notes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="font-black text-black dark:text-white flex items-center gap-1.5 bg-yellow-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black">
                    <Briefcase className="h-3.5 w-3.5" />
                    {c.applicationCount || 0} application{c.applicationCount === 1 ? '' : 's'}
                  </span>
                  <Link
                    href={`/applications?search=${encodeURIComponent(c.name)}`}
                    className="font-black uppercase text-indigo-700 dark:text-yellow-300 hover:underline flex items-center gap-1"
                  >
                    View Roles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border-[3px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden my-6">
            <div className="flex items-center justify-between border-b-[2.5px] border-black bg-pink-300 px-4 sm:px-6 py-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                  EMPLOYER PROFILE
                </span>
                <h3 className="text-lg font-black uppercase text-black mt-1">
                  Add Target Company
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_#000] hover:bg-rose-200 active:translate-x-0.5 active:translate-y-0.5"
              >
                <X className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl border-2 border-black bg-rose-200 text-black text-xs font-black shadow-[2px_2px_0px_#000]">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCompany} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OpenAI, Stripe, Figma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-pink-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fintech / AI"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-pink-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500-1000"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-pink-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-pink-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Location / HQ
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-pink-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Culture Notes & Engineering Values
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Emphasis on system reliability, type safety, and internal tooling."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-pink-50 focus:outline-none shadow-[2px_2px_0px_#000]"
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
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-pink-300 px-5 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-pink-400 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  ★ Save Target Company ★
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
