import React from 'react';
import {
  TrendingUp,
  Target,
  Award,
  Layers,
  Zap,
} from 'lucide-react';
import { MetricSummary } from '@/src/lib/calculations.ts';

interface MetricCardsProps {
  metrics: MetricSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Response Rate - Cyan Comic Panel */}
      <div className="relative overflow-hidden rounded-2xl border-[2.5px] border-black bg-cyan-200 dark:bg-cyan-950/70 p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-cyan-200 bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded border border-black">
            Response Rate
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000]">
            <TrendingUp className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
              {metrics.responseRate}%
            </span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase">
              REPLIES
            </span>
          </div>

          <div className="mt-3 h-3 w-full bg-white dark:bg-zinc-900 border-2 border-black rounded-full overflow-hidden p-0.5 shadow-[1.5px_1.5px_0px_#000]">
            <div
              className="h-full bg-cyan-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, metrics.responseRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interview Rate - Purple Comic Panel */}
      <div className="relative overflow-hidden rounded-2xl border-[2.5px] border-black bg-purple-200 dark:bg-purple-950/70 p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-purple-200 bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded border border-black">
            Interview Rate
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000]">
            <Target className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
              {metrics.interviewRate}%
            </span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase">
              ROUNDS
            </span>
          </div>

          <div className="mt-3 h-3 w-full bg-white dark:bg-zinc-900 border-2 border-black rounded-full overflow-hidden p-0.5 shadow-[1.5px_1.5px_0px_#000]">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, metrics.interviewRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Offer Rate - Lime Comic Panel */}
      <div className="relative overflow-hidden rounded-2xl border-[2.5px] border-black bg-lime-300 dark:bg-lime-950/70 p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-lime-200 bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded border border-black">
            Offer Rate
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000]">
            <Award className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
              {metrics.offerRate}%
            </span>
            <span className="text-xs font-black text-black dark:text-white uppercase">
              {metrics.offer + metrics.accepted} OFFERS!
            </span>
          </div>

          <div className="mt-3 h-3 w-full bg-white dark:bg-zinc-900 border-2 border-black rounded-full overflow-hidden p-0.5 shadow-[1.5px_1.5px_0px_#000]">
            <div
              className="h-full bg-lime-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, metrics.offerRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Pipeline - Yellow Comic Panel */}
      <div className="relative overflow-hidden rounded-2xl border-[2.5px] border-black bg-yellow-300 dark:bg-yellow-950/70 p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-yellow-200 bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded border border-black">
            Active Pipeline
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000]">
            <Layers className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
              {metrics.activeCount}
            </span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase">
              OF {metrics.total} TOTAL
            </span>
          </div>

          <div className="mt-2 text-xs font-bold text-black flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 fill-black stroke-black" />
            <span>In active review / pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
