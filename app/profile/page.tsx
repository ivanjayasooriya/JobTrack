'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { useAuth } from '@/src/context/AuthContext.tsx';
import {
  User,
  GraduationCap,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Loader2,
  CheckCircle2,
  Save,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshProfile, signInWithGoogle, signOut } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    graduationYear: 2026,
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        university: user.university || 'Computer Science, B.S.',
        graduationYear: user.graduationYear || 2026,
        location: user.location || 'San Francisco, CA',
        githubUrl: user.githubUrl || 'https://github.com/applicant',
        linkedinUrl: user.linkedinUrl || 'https://linkedin.com/in/applicant',
        portfolioUrl: user.portfolioUrl || 'https://applicant.dev',
        skills:
          user.skills || 'TypeScript, React, Next.js, Node.js, PostgreSQL, Go, Docker, AWS',
        bio:
          user.bio ||
          'Undergraduate software engineering student preparing for SWE internships. Passionate about distributed systems, type-safe API architectures, and performance engineering.',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jobtrack_guest_session');
        if (stored) {
          const g = JSON.parse(stored);
          headers['x-jobtrack-uid'] = g.uid;
        }
      }

      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setToast('★ Candidate dossier updated successfully! ★');
        refreshProfile();
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-black bg-yellow-300 text-black px-5 py-3 shadow-[5px_5px_0px_#000] flex items-center gap-2 text-xs font-black uppercase">
          <Zap className="h-4 w-4 fill-black stroke-black" />
          <span>{toast}</span>
        </div>
      )}

      <main className="flex-1 mx-auto max-w-4xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Comic Header Billboard */}
        <div className="rounded-3xl border-[3px] border-black bg-orange-300 dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-yellow-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
              <Zap className="h-3 w-3 fill-black stroke-black" />
              <span>RECRUITING SECRET IDENTITY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
              Candidate Dossier
            </h1>
            <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-300">
              Manage your technical portfolio, university status, target roles, and skill keywords.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b-2 border-black">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-[3px] border-black bg-yellow-300 text-black text-2xl sm:text-3xl font-black shadow-[4px_4px_0px_#000] rotate-2">
                {(formData.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                  {formData.name || 'Candidate Name'}
                </h3>
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{formData.email}</p>
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-black bg-lime-300 px-2.5 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                    ★ Active Internship Applicant ★
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-black bg-cyan-200 px-2.5 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                    Class of {formData.graduationYear}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Account Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full rounded-xl border-2 border-black bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-500 shadow-[2px_2px_0px_#000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  University / College & Major
                </label>
                <input
                  type="text"
                  placeholder="e.g. UC Berkeley - Computer Science"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) =>
                    setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) })
                  }
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Target Location / Base
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA / Seattle, WA / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1 flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" /> GitHub Profile
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1 flex items-center gap-1.5">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Portfolio URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.dev"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Core Technical Skills (Keywords)
              </label>
              <input
                type="text"
                placeholder="TypeScript, React, Node.js, PostgreSQL, Docker, Go, Git"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Candidate Bio & Recruiting Goal
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-yellow-300 px-6 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 stroke-[2.5]" />
                )}
                <span>★ Save Candidate Dossier ★</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
