'use client';

import React, { useState } from 'react';
import { X, Loader2, Video } from 'lucide-react';
import { interviewRounds } from '@/src/schemas/interview.schema.ts';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  applicationId: number;
  companyName?: string;
  position?: string;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  applicationId,
  companyName,
  position,
}) => {
  const [round, setRound] = useState<(typeof interviewRounds)[number]>('Technical');
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [interviewers, setInterviewers] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [location, setLocation] = useState('Virtual');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Interview title is required (e.g. Systems Live Coding Round).');
      return;
    }
    if (!scheduledAt) {
      setErrorMsg('Date and time is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          round,
          title: title.trim(),
          scheduledAt: new Date(scheduledAt).toISOString(),
          durationMinutes: Number(durationMinutes),
          interviewers: interviewers.trim() || null,
          meetingUrl: meetingUrl.trim() || null,
          location: location.trim() || null,
          notes: notes.trim() || null,
          result: 'Pending',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to schedule interview');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border-[3px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[2.5px] border-black bg-purple-300 px-4 sm:px-6 py-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
              ROUND SCHEDULER
            </span>
            <h3 className="text-lg font-black uppercase text-black mt-1">
              Schedule Interview Round
            </h3>
            {companyName && (
              <p className="text-xs font-bold text-black/80">
                For {position} at {companyName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Round Type
              </label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value as any)}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
              >
                {interviewRounds.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={15}
                max={240}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Title / Focus *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Systems & Algorithms Live Coding Screen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-purple-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Interviewers
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins (Staff SWE)"
                value={interviewers}
                onChange={(e) => setInterviewers(e.target.value)}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-purple-50 focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Meeting URL (Google Meet / Zoom)
            </label>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-purple-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Preparation Notes / Topics
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on graph traversal and concurrency primitives."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-purple-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-purple-300 px-5 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-purple-400 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              ★ Confirm Schedule ★
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
