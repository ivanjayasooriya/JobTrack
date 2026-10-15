'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import {
  jobTypes,
  workModes,
  applicationStatuses,
  priorities,
} from '@/src/schemas/application.schema.ts';

export interface ApplicationFormData {
  id?: number;
  companyName: string;
  position: string;
  jobType: (typeof jobTypes)[number];
  workMode: (typeof workModes)[number];
  location?: string;
  status: (typeof applicationStatuses)[number];
  priority: (typeof priorities)[number];
  salary?: string;
  jobUrl?: string;
  portalUrl?: string;
  applicationDate?: string;
  deadline?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  notes?: string;
  resumeVersion?: string;
  coverLetterVersion?: string;
}

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: ApplicationFormData | null;
}

const getInitialState = (data?: ApplicationFormData | null): ApplicationFormData => ({
  companyName: data?.companyName || '',
  position: data?.position || '',
  jobType: data?.jobType || 'Internship',
  workMode: data?.workMode || 'Remote',
  location: data?.location || '',
  status: data?.status || 'Applied',
  priority: data?.priority || 'Medium',
  salary: data?.salary || '',
  jobUrl: data?.jobUrl || '',
  portalUrl: data?.portalUrl || '',
  applicationDate: data?.applicationDate || new Date().toISOString().split('T')[0],
  deadline: data?.deadline || '',
  recruiterName: data?.recruiterName || '',
  recruiterEmail: data?.recruiterEmail || '',
  recruiterPhone: data?.recruiterPhone || '',
  notes: data?.notes || '',
  resumeVersion: data?.resumeVersion || 'v1.0',
  coverLetterVersion: data?.coverLetterVersion || '',
});

function InnerForm({
  initialData,
  onClose,
  onSaved,
}: {
  initialData?: ApplicationFormData | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState<ApplicationFormData>(() =>
    getInitialState(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setErrorMsg('Company name is required.');
      return;
    }
    if (!formData.position.trim()) {
      setErrorMsg('Position / Role title is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const isEdit = !!initialData?.id;
      const url = isEdit ? `/api/applications/${initialData.id}` : '/api/applications';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || 'Failed to save application');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {errorMsg && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl border-2 border-black bg-rose-200 text-black text-xs font-black shadow-[2px_2px_0px_#000]">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe, Google, Datadog"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Position / Role *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Software Engineering Intern"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Job Type
            </label>
            <select
              value={formData.jobType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  jobType: e.target.value as (typeof jobTypes)[number],
                })
              }
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
            >
              {jobTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Work Mode
            </label>
            <select
              value={formData.workMode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workMode: e.target.value as (typeof workModes)[number],
                })
              }
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
            >
              {workModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. SF, CA / Remote"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Pipeline Stage
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as (typeof applicationStatuses)[number],
                })
              }
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-black text-black bg-yellow-100 shadow-[2px_2px_0px_#000] focus:outline-none"
            >
              {applicationStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as (typeof priorities)[number],
                })
              }
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Stipend / Salary
            </label>
            <input
              type="text"
              placeholder="e.g. $55/hr + housing"
              value={formData.salary || ''}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Date Applied
            </label>
            <input
              type="date"
              value={formData.applicationDate || ''}
              onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Deadline / OA Due Date
            </label>
            <input
              type="date"
              value={formData.deadline || ''}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Posting URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.jobUrl || ''}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Candidate Portal URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.portalUrl || ''}
              onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Resume Version Tag
            </label>
            <input
              type="text"
              placeholder="e.g. Resume_SWE_v3"
              value={formData.resumeVersion || ''}
              onChange={(e) => setFormData({ ...formData, resumeVersion: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Cover Letter Version Tag
            </label>
            <input
              type="text"
              placeholder="e.g. CoverLetter_v2"
              value={formData.coverLetterVersion || ''}
              onChange={(e) => setFormData({ ...formData, coverLetterVersion: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Recruiter Name
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Rostova"
              value={formData.recruiterName || ''}
              onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Recruiter Email
            </label>
            <input
              type="email"
              placeholder="recruiter@company.com"
              value={formData.recruiterEmail || ''}
              onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Recruiter Phone
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={formData.recruiterPhone || ''}
              onChange={(e) => setFormData({ ...formData, recruiterPhone: e.target.value })}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
            Application Notes & Intel
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Reached out via alumni network. Prep for GraphQL and systems round."
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-yellow-300 px-6 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData?.id ? '★ Save Changes ★' : '★ Track Application ★'}
          </button>
        </div>
      </form>
    </>
  );
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border-[3px] border-black shadow-[8px_8px_0px_0px_#000] my-6 overflow-hidden">
        {/* Comic Header Band */}
        <div className="flex items-center justify-between border-b-[2.5px] border-black bg-yellow-300 px-4 sm:px-6 py-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
              JOB LOG ENTRY
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-black mt-1">
              {initialData?.id ? 'Edit Application Details' : 'Track New Opportunity'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_#000] hover:bg-rose-200 active:translate-x-0.5 active:translate-y-0.5"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        <InnerForm
          key={initialData?.id || 'new'}
          initialData={initialData}
          onClose={onClose}
          onSaved={onSaved}
        />
      </div>
    </div>
  );
};
