'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext.tsx';
import {
  Briefcase,
  LayoutDashboard,
  Kanban,
  Building2,
  CalendarCheck2,
  CheckSquare,
  FileText,
  BarChart3,
  User,
  Plus,
  LogIn,
  LogOut,
  Sparkles,
  Menu,
  X,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  onOpenNewModal?: () => void;
  onSeedRequested?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewModal, onSeedRequested }) => {
  const pathname = usePathname();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'hover:bg-yellow-300' },
    { href: '/kanban', label: 'Pipeline', icon: Kanban, color: 'hover:bg-cyan-300' },
    { href: '/applications', label: 'Applications', icon: Briefcase, color: 'hover:bg-lime-300' },
    { href: '/interviews', label: 'Interviews', icon: CalendarCheck2, color: 'hover:bg-purple-300' },
    { href: '/companies', label: 'Companies', icon: Building2, color: 'hover:bg-pink-300' },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare, color: 'hover:bg-amber-300' },
    { href: '/documents', label: 'Documents', icon: FileText, color: 'hover:bg-emerald-300' },
    { href: '/analytics', label: 'Analytics', icon: BarChart3, color: 'hover:bg-sky-300' },
    { href: '/profile', label: 'Profile', icon: User, color: 'hover:bg-orange-300' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-[3px] border-black bg-white dark:bg-zinc-900 shadow-[0_4px_0px_0px_#000]">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3 lg:gap-8 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group transform active:scale-95 transition-transform shrink-0"
          >
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-[2.5px] border-black bg-yellow-300 text-black shadow-[2.5px_2.5px_0px_#000] group-hover:rotate-6 transition-transform">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl font-black tracking-tight uppercase text-black dark:text-white">
                  JOB<span className="bg-yellow-300 px-1 text-black border-2 border-black rounded shadow-[2px_2px_0px_#000] ml-0.5">TRACK</span>
                </span>
              </div>
              <span className="hidden xs:inline-block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                ★ SWE INTERN EDITION ★
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-black transition-all ${
                    isActive
                      ? 'bg-black text-yellow-300 shadow-[2px_2px_0px_#000]'
                      : `bg-white dark:bg-zinc-800 text-black dark:text-white ${item.color} shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000]`
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[2.5]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {onSeedRequested && (
            <button
              onClick={onSeedRequested}
              title="Populate realistic sample internship applications (Stripe, Datadog, Google, Figma)"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-cyan-300 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[2.5px_2.5px_0px_#000] hover:bg-cyan-400 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-black" />
              <span>Load Data</span>
            </button>
          )}

          {onOpenNewModal && (
            <button
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border-2 border-black bg-rose-400 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[2.5px_2.5px_0px_#000] hover:bg-rose-500 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
              <span>Track App</span>
            </button>
          )}

          {/* User profile / Auth button */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1">
              <Link
                href="/profile"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border-2 border-black bg-lime-300 text-xs font-black text-black shadow-[2px_2px_0px_#000] overflow-hidden"
                title={user.email}
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={36}
                    height={36}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.name || 'U').charAt(0).toUpperCase()
                )}
              </Link>
              <button
                onClick={() => signOut()}
                title="Sign Out"
                className="p-1 sm:p-1.5 rounded-lg border-2 border-black bg-white hover:bg-rose-100 text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border-2 border-black bg-yellow-300 px-2.5 sm:px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <Menu className="h-5 w-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu + Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="xl:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="xl:hidden relative z-50 border-t-[3px] border-black bg-yellow-100 dark:bg-zinc-900 px-4 py-4 space-y-3 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 shadow-[0_8px_0px_0px_#000]">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                HQ MISSION NAVIGATION
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-black uppercase text-black dark:text-white"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-black text-yellow-300 shadow-[3px_3px_0px_#000]'
                        : 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    <Icon className="h-4 w-4 stroke-[2.5]" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {onSeedRequested && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSeedRequested();
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-black bg-cyan-300 text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>★ Load Sample Internship Data ★</span>
              </button>
            )}
          </div>
        </>
      )}
    </header>
  );
};
