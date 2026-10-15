'use client';

import React, { useState } from 'react';
import { X, Loader2, CheckSquare } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  applicationId?: number;
  availableApplications?: Array<{ id: number; companyName: string; position: string }>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  applicationId,
  availableApplications = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [selectedAppId, setSelectedAppId] = useState<number | undefined>(applicationId);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Task title is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDate || null,
          priority,
          applicationId: selectedAppId || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Failed to create task');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border-[3px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden my-6">
        <div className="flex items-center justify-between border-b-[2.5px] border-black bg-lime-300 px-4 sm:px-6 py-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
              ACTION ITEM
            </span>
            <h3 className="text-lg font-black uppercase text-black mt-1">
              Add Preparation Task
            </h3>
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
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete HackerRank OA, Polish STAR stories"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-lime-50 focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Linked Application (Optional)
            </label>
            <select
              value={selectedAppId || ''}
              onChange={(e) =>
                setSelectedAppId(e.target.value ? parseInt(e.target.value, 10) : undefined)
              }
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
            >
              <option value="">General / Unassigned</option>
              {availableApplications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.position}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm font-bold text-black bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-zinc-200 mb-1">
              Description / Actionable Steps
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Review Sliding Window & Graph BFS patterns."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border-2 border-black px-3 py-2 text-sm text-black placeholder-zinc-400 bg-white focus:bg-lime-50 focus:outline-none shadow-[2px_2px_0px_#000]"
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
              className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-lime-300 px-5 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-lime-400 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              ★ Save Task ★
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
