'use client';

import React from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  MapPin,
  Trash2,
  Edit2,
  ChevronRight,
  Clock,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge.tsx';
import { ApplicationCardItem } from './KanbanBoard.tsx';

interface ApplicationTableProps {
  applications: ApplicationCardItem[];
  onEdit: (app: ApplicationCardItem) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => Promise<void>;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0px_#000] mb-3">
          <Briefcase className="h-6 w-6 stroke-[2.5]" />
        </div>
        <h4 className="text-base font-black uppercase tracking-tight text-black dark:text-white">
          No applications match your criteria
        </h4>
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 max-w-sm mt-1">
          Try clearing your search filters, or click &ldquo;Track Application&rdquo; to log a new opportunity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Stack (< md screens) */}
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border-[2.5px] border-black bg-white dark:bg-zinc-900 p-4 shadow-[3px_3px_0px_#000] space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/applications/${app.id}`}
                  className="font-black text-base text-black dark:text-white hover:text-indigo-600 flex items-center gap-1.5"
                >
                  <span>{app.companyName}</span>
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-400 hover:text-black"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </Link>
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
                  {app.position}
                </p>
              </div>
              <PriorityBadge priority={app.priority} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={app.status} size="sm" />
              <span className="text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black">
                {app.jobType} • {app.workMode}
              </span>
            </div>

            {(app.location || app.salary || app.deadline) && (
              <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {app.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{app.location}</span>
                  </div>
                )}
                {app.salary && (
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black">
                    <DollarSign className="h-3.5 w-3.5 shrink-0" />
                    <span>{app.salary}</span>
                  </div>
                )}
                {app.deadline && (
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>Due: {app.deadline}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(app)}
                  className="px-2.5 py-1 text-xs font-black uppercase rounded-lg border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[1.5px_1.5px_0px_#000]"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  className="p-1 rounded-lg border-2 border-black bg-rose-200 text-black shadow-[1.5px_1.5px_0px_#000]"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <Link
                href={`/applications/${app.id}`}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase rounded-lg border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0px_#000]"
              >
                <span>Details</span>
                <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (>= md screens) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border-[2.5px] border-black bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000]">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b-[2.5px] border-black bg-yellow-300 text-black text-[11px] font-black uppercase tracking-wider">
              <th className="py-3.5 px-4">Company & Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Type & Mode</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Salary / Stipend</th>
              <th className="py-3.5 px-4">Deadline</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 dark:divide-white/10">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-yellow-50/60 dark:hover:bg-zinc-800/50 transition-colors group"
              >
                {/* Company & Role */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-black text-black hover:text-indigo-600 dark:text-white dark:hover:text-yellow-300 transition-colors flex items-center gap-1.5"
                    >
                      <span>{app.companyName}</span>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-zinc-400 hover:text-black"
                          title="Open posting"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </Link>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                      {app.position}
                    </span>
                    {app.location && (
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {app.location}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={app.status} size="sm" />
                </td>

                {/* Type & Mode */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col text-xs text-black dark:text-zinc-200">
                    <span className="font-bold">{app.jobType}</span>
                    <span className="text-[11px] text-zinc-500">{app.workMode}</span>
                  </div>
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityBadge priority={app.priority} />
                </td>

                {/* Salary */}
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-black dark:text-zinc-300 font-black">
                  {app.salary || <span className="text-zinc-400 font-normal">—</span>}
                </td>

                {/* Deadline */}
                <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                  {app.deadline ? (
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-black">
                      <Clock className="h-3.5 w-3.5 stroke-[2.5]" />
                      {app.deadline}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-xs">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(app)}
                      className="p-1.5 rounded-lg border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[1.5px_1.5px_0px_#000] hover:bg-yellow-200"
                      title="Edit application"
                    >
                      <Edit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => onDelete(app.id)}
                      className="p-1.5 rounded-lg border-2 border-black bg-rose-200 text-black shadow-[1.5px_1.5px_0px_#000] hover:bg-rose-300"
                      title="Delete application"
                    >
                      <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                    <Link
                      href={`/applications/${app.id}`}
                      className="p-1.5 rounded-lg border-2 border-black bg-yellow-300 text-black shadow-[1.5px_1.5px_0px_#000] hover:bg-yellow-400"
                      title="View details & timeline"
                    >
                      <ChevronRight className="h-4 w-4 stroke-[3]" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
