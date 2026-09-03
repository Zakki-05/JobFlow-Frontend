import React from 'react';

const statusStyles = {
  SAVED: 'bg-slate-800 text-slate-300 border-slate-700',
  APPLIED: 'bg-sky-950/80 text-sky-300 border-sky-500/30',
  ASSESSMENT: 'bg-violet-950/80 text-violet-300 border-violet-500/30',
  INTERVIEW: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
  OFFER: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
  WITHDRAWN: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || statusStyles.SAVED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border shadow-sm ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
