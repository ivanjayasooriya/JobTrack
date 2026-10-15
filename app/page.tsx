'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Kanban,
  CalendarCheck2,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Award,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen comic-dots text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Top Masthead */}
      <header className="w-full border-b-[3px] border-black bg-white dark:bg-zinc-900 shadow-[0_4px_0px_#000]">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-[2.5px] border-black bg-yellow-300 text-black shadow-[3px_3px_0px_#000] rotate-2">
              <Zap className="h-6 w-6 stroke-[3]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight uppercase text-black dark:text-white">
                JOB<span className="bg-yellow-300 px-1 text-black border-2 border-black rounded shadow-[2px_2px_0px_#000] ml-0.5">TRACK</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                ★ THE RECRUITING HERO ★
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-4 sm:px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>Launch HQ</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Comic Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 border-b-[3px] border-black bg-yellow-100 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-rose-400 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-black shadow-[3px_3px_0px_#000] -rotate-1">
            <Zap className="h-4 w-4 fill-black stroke-black" />
            <span>ISSUE #1: CRUSHING THE TECH INTERNSHIP FUNNEL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black dark:text-white max-w-3xl mx-auto leading-tight">
            Stop losing track of your{' '}
            <span className="bg-yellow-300 text-black px-2 border-[2.5px] border-black rounded-lg shadow-[4px_4px_0px_#000] inline-block my-1 rotate-1">
              internship applications
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base font-bold text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Centralize your active pipeline, HackerRank OAs, live coding rounds, tailored resume
            versions, and STAR interview notes in one superhero-grade application tracker.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-black bg-yellow-300 px-8 py-3.5 text-base font-black uppercase tracking-wider text-black shadow-[5px_5px_0px_#000] hover:bg-yellow-400 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <span>★ Enter Candidate HQ ★</span>
              <ArrowRight className="h-5 w-5 stroke-[3]" />
            </Link>
            <Link
              href="/kanban"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-black bg-white dark:bg-zinc-800 px-7 py-3.5 text-base font-black uppercase tracking-wider text-black dark:text-white shadow-[4px_4px_0px_#000] hover:bg-zinc-50 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Explore Kanban Board
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-black uppercase text-black dark:text-zinc-300">
            <span className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-cyan-200 px-2.5 py-1 shadow-[2px_2px_0px_#000]">
              <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
              PostgreSQL Cloud SQL
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-lime-300 px-2.5 py-1 shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
              Guarded Analytics
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border-2 border-black bg-purple-200 px-2.5 py-1 shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
              Multi-Tenant Data Isolation
            </span>
          </div>
        </div>
      </section>

      {/* Feature Comic Strips */}
      <section className="py-12 sm:py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-black bg-yellow-300 px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000]">
            POWER-UPS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
            Built for High-Volume Recruiting Cycles
          </h2>
          <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Everything you need to conquer technical rounds, behavioral screens, and offer negotiations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-6 shadow-[6px_6px_0px_0px_#000] space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-cyan-300 text-black shadow-[3px_3px_0px_#000]">
              <Kanban className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black uppercase text-black dark:text-white">
              Tactile Kanban Pipeline
            </h3>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Drag applications seamlessly from Wishlist to Applied, Assessment, Tech Interview,
              and Offer with optimistic state updates and instant audit logging.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-6 shadow-[6px_6px_0px_0px_#000] space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-purple-300 text-black shadow-[3px_3px_0px_#000]">
              <CalendarCheck2 className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black uppercase text-black dark:text-white">
              Interview Command Center
            </h3>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Track meeting links, duration, interviewer notes, and behavioral STAR stories.
              Never miss a round or forget your retrospective points.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border-[3px] border-black bg-white dark:bg-zinc-900 p-6 shadow-[6px_6px_0px_0px_#000] space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-lime-300 text-black shadow-[3px_3px_0px_#000]">
              <BarChart3 className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black uppercase text-black dark:text-white">
              Zero-Division Analytics
            </h3>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Guarded conversion calculations for response rates, interview conversion, and offer
              rates. Understand exactly where in the funnel you&apos;re succeeding.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t-[3px] border-black bg-yellow-200 dark:bg-zinc-900 py-6 text-center text-xs font-black uppercase tracking-wider text-black dark:text-white">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 JOBTRACK • FULL-STACK INTERNSHIP & JOB APPLICATION TRACKER</p>
        </div>
      </footer>
    </div>
  );
}
