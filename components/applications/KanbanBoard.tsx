'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ExternalLink,
  ChevronRight,
  Clock,
  DollarSign,
  MoveRight,
  LayoutGrid,
  ListFilter,
  Zap,
  Sparkles,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge.tsx';
import { applicationStatuses } from '@/src/schemas/application.schema.ts';

export interface ApplicationCardItem {
  id: number;
  companyName: string;
  position: string;
  jobType: string;
  workMode: string;
  location?: string | null;
  status: string;
  priority: string;
  salary?: string | null;
  jobUrl?: string | null;
  deadline?: string | null;
  applicationDate?: string | null;
  resumeVersion?: string | null;
}

interface KanbanBoardProps {
  applications: ApplicationCardItem[];
  onStatusChange: (appId: number, newStatus: string) => Promise<void>;
  onEdit: (app: ApplicationCardItem) => void;
}

const KANBAN_STAGES = [
  { key: 'Wishlist', title: 'WISHLIST', tag: 'PLAN', headerBg: 'bg-amber-300' },
  { key: 'Applied', title: 'APPLIED', tag: 'SENT', headerBg: 'bg-sky-300' },
  { key: 'Assessment', title: 'OA / TEST', tag: 'HACK', headerBg: 'bg-yellow-300' },
  { key: 'Interview', title: 'SCREEN', tag: 'SYNC', headerBg: 'bg-purple-300' },
  { key: 'Technical Interview', title: 'TECH ROUND', tag: 'CODE', headerBg: 'bg-violet-300' },
  { key: 'Final Interview', title: 'FINAL ROUND', tag: 'BOSS', headerBg: 'bg-pink-300' },
  { key: 'Offer', title: 'OFFER! 🎉', tag: 'POW!', headerBg: 'bg-emerald-300' },
  { key: 'Rejected', title: 'REJECTED', tag: 'AGAIN', headerBg: 'bg-rose-300' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onStatusChange,
  onEdit,
}) => {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'stacked'>('board');
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({});

  const toggleStageCollapse = (key: string) => {
    setCollapsedStages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    if (dragOverColumn !== columnKey) {
      setDragOverColumn(columnKey);
    }
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const idStr = e.dataTransfer.getData('text/plain');
    const appId = parseInt(idStr, 10);
    if (!isNaN(appId)) {
      setMovingId(appId);
      await onStatusChange(appId, newStatus);
      setMovingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* View Switcher & Mobile Hints */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-black dark:text-white">
            Layout:
          </span>
          <button
            onClick={() => setViewMode('board')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'board'
                ? 'bg-black text-yellow-300 shadow-[2px_2px_0px_#000]'
                : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_#000]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Columns Board</span>
          </button>
          <button
            onClick={() => setViewMode('stacked')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'stacked'
                ? 'bg-black text-yellow-300 shadow-[2px_2px_0px_#000]'
                : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_#000]'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Stacked Stages (Mobile Friendly)</span>
          </button>
        </div>

        {viewMode === 'board' && (
          <div className="sm:hidden inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-black bg-yellow-200 px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
            <span>Swipe sideways</span>
            <MoveRight className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Render Mode: Board Columns */}
      {viewMode === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 px-1 scrollbar-thin">
          {KANBAN_STAGES.map((stage) => {
            const stageApps = applications.filter((app) => {
              if (stage.key === 'Wishlist') {
                return app.status === 'Wishlist' || app.status === 'Preparing';
              }
              if (stage.key === 'Offer') {
                return app.status === 'Offer' || app.status === 'Accepted';
              }
              return app.status === stage.key;
            });

            const isDropTarget = dragOverColumn === stage.key;

            return (
              <div
                key={stage.key}
                onDragOver={(e) => handleDragOver(e, stage.key)}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => handleDrop(e, stage.key)}
                className={`w-72 sm:w-80 shrink-0 flex flex-col rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 shadow-[5px_5px_0px_0px_#000] overflow-hidden transition-all ${
                  isDropTarget ? 'ring-4 ring-yellow-400 bg-yellow-50 dark:bg-zinc-800' : ''
                }`}
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between border-b-[3px] border-black px-4 py-3 ${stage.headerBg}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      {stage.title}
                    </span>
                    <span className="text-[9px] font-black uppercase bg-black text-white px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000]">
                      {stage.tag}
                    </span>
                  </div>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-black text-black shadow-[1.5px_1.5px_0px_#000]">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col gap-3 p-3 min-h-[460px] bg-yellow-50/30 dark:bg-zinc-950/40">
                  {stageApps.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-black/20 dark:border-white/20 p-4 text-center">
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                        Drop application card here
                      </p>
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <KanbanCard
                        key={app.id}
                        app={app}
                        isBeingMoved={movingId === app.id}
                        onDragStart={handleDragStart}
                        onStatusChange={onStatusChange}
                        onEdit={onEdit}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Render Mode: Stacked Stages for phones and narrow screens */
        <div className="space-y-4">
          {KANBAN_STAGES.map((stage) => {
            const stageApps = applications.filter((app) => {
              if (stage.key === 'Wishlist') {
                return app.status === 'Wishlist' || app.status === 'Preparing';
              }
              if (stage.key === 'Offer') {
                return app.status === 'Offer' || app.status === 'Accepted';
              }
              return app.status === stage.key;
            });

            const isCollapsed = collapsedStages[stage.key];

            return (
              <div
                key={stage.key}
                className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 shadow-[5px_5px_0px_0px_#000] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleStageCollapse(stage.key)}
                  className={`w-full flex items-center justify-between border-b-[3px] border-black px-4 sm:px-6 py-3.5 ${stage.headerBg} cursor-pointer text-left`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black uppercase tracking-wider text-black">
                      {stage.title}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]">
                      {stage.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-black text-black shadow-[1.5px_1.5px_0px_#000]">
                      {stageApps.length}
                    </span>
                    <span className="text-xs font-black text-black">
                      {isCollapsed ? '+ Expand' : '− Collapse'}
                    </span>
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="p-4 bg-yellow-50/20 dark:bg-zinc-950/40">
                    {stageApps.length === 0 ? (
                      <p className="text-xs font-black text-zinc-400 uppercase text-center py-4">
                        No applications in this stage
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stageApps.map((app) => (
                          <KanbanCard
                            key={app.id}
                            app={app}
                            isBeingMoved={movingId === app.id}
                            onDragStart={handleDragStart}
                            onStatusChange={onStatusChange}
                            onEdit={onEdit}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function KanbanCard({
  app,
  isBeingMoved,
  onDragStart,
  onStatusChange,
  onEdit,
}: {
  app: ApplicationCardItem;
  isBeingMoved: boolean;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onStatusChange: (appId: number, newStatus: string) => Promise<void>;
  onEdit: (app: ApplicationCardItem) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, app.id)}
      className={`group relative rounded-2xl border-2 border-black bg-white dark:bg-zinc-900 p-3.5 shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-grab active:cursor-grabbing ${
        isBeingMoved ? 'opacity-40 animate-pulse' : ''
      }`}
    >
      {/* Priority and Type */}
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={app.priority} />
        <span className="text-[10px] font-black uppercase tracking-wider text-black dark:text-zinc-300 bg-yellow-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
          {app.jobType}
        </span>
      </div>

      {/* Company & Role */}
      <div className="mb-2">
        <Link
          href={`/applications/${app.id}`}
          className="font-black text-base text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-yellow-300 line-clamp-1 transition-colors flex items-center gap-1.5"
        >
          <span>{app.companyName}</span>
        </Link>
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1 mt-0.5">
          {app.position}
        </p>
      </div>

      {/* Metadata strip */}
      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t-2 border-black/10 dark:border-white/10">
        {app.location && (
          <div className="flex items-center gap-1.5 truncate font-bold">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-black dark:text-white" />
            <span className="truncate">
              {app.location} • {app.workMode}
            </span>
          </div>
        )}
        {app.salary && (
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black">
            <DollarSign className="h-3.5 w-3.5 shrink-0" />
            <span>{app.salary}</span>
          </div>
        )}
        {app.deadline && (
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-black">
            <Clock className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span>Due: {app.deadline}</span>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t-2 border-black/10 dark:border-white/10 gap-2">
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app.id, e.target.value)}
          className="text-[11px] font-black uppercase bg-yellow-100 dark:bg-zinc-800 border-2 border-black rounded-lg px-2 py-0.5 text-black dark:text-white focus:outline-none shadow-[1.5px_1.5px_0px_#000]"
        >
          {applicationStatuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(app)}
            className="text-[11px] font-black uppercase text-black dark:text-white bg-white dark:bg-zinc-800 border-2 border-black px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_#000] hover:bg-yellow-100 transition-colors cursor-pointer"
          >
            Edit
          </button>
          <Link
            href={`/applications/${app.id}`}
            className="p-1 rounded-lg border-2 border-black bg-yellow-300 text-black shadow-[1.5px_1.5px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="View details & timeline"
          >
            <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
