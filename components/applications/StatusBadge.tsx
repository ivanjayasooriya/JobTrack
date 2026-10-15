import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusColorMap: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  Wishlist: {
    bg: 'bg-amber-100 text-amber-950 border-black',
    text: 'text-black',
    dot: 'bg-amber-400',
    label: 'WISHLIST',
  },
  Preparing: {
    bg: 'bg-orange-200 text-orange-950 border-black',
    text: 'text-black',
    dot: 'bg-orange-500',
    label: 'PREPARING',
  },
  Applied: {
    bg: 'bg-sky-200 text-sky-950 border-black',
    text: 'text-black',
    dot: 'bg-sky-500',
    label: 'APPLIED',
  },
  Assessment: {
    bg: 'bg-yellow-300 text-yellow-950 border-black',
    text: 'text-black',
    dot: 'bg-amber-500',
    label: 'ASSESSMENT',
  },
  Interview: {
    bg: 'bg-purple-200 text-purple-950 border-black',
    text: 'text-black',
    dot: 'bg-purple-600',
    label: 'INTERVIEW',
  },
  'Technical Interview': {
    bg: 'bg-violet-300 text-violet-950 border-black',
    text: 'text-black',
    dot: 'bg-violet-600',
    label: 'TECH ROUND',
  },
  'Final Interview': {
    bg: 'bg-pink-300 text-pink-950 border-black',
    text: 'text-black',
    dot: 'bg-pink-600',
    label: 'FINAL ROUND',
  },
  Offer: {
    bg: 'bg-emerald-300 text-emerald-950 border-black',
    text: 'text-black',
    dot: 'bg-emerald-600',
    label: 'OFFER!',
  },
  Accepted: {
    bg: 'bg-teal-300 text-teal-950 border-black',
    text: 'text-black',
    dot: 'bg-teal-600',
    label: 'ACCEPTED! 🎉',
  },
  Rejected: {
    bg: 'bg-rose-200 text-rose-950 border-black',
    text: 'text-black',
    dot: 'bg-rose-500',
    label: 'REJECTED',
  },
  Withdrawn: {
    bg: 'bg-slate-200 text-slate-900 border-black',
    text: 'text-black',
    dot: 'bg-slate-500',
    label: 'WITHDRAWN',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const item = statusColorMap[status] || {
    bg: 'bg-yellow-200 text-black border-black',
    text: 'text-black',
    dot: 'bg-black',
    label: status.toUpperCase(),
  };

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000]'
      : size === 'lg'
        ? 'text-xs px-3 py-1 font-black shadow-[3px_3px_0px_#000]'
        : 'text-[11px] px-2.5 py-0.5 font-bold shadow-[2px_2px_0px_#000]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border-2 border-black font-black uppercase tracking-wider ${item.bg} ${sizeClasses} select-none`}
    >
      <span className={`w-2 h-2 rounded-full border border-black ${item.dot}`} />
      <span>{item.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const config: Record<string, { bg: string; label: string }> = {
    Low: { bg: 'bg-slate-200 text-black', label: 'LOW' },
    Medium: { bg: 'bg-sky-200 text-black', label: 'MED' },
    High: { bg: 'bg-amber-300 text-black', label: 'HIGH!' },
    Urgent: { bg: 'bg-rose-400 text-black', label: 'URGENT!!' },
  };

  const current = config[priority] || config['Medium'];

  return (
    <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${current.bg} select-none`}>
      {current.label}
    </span>
  );
};
