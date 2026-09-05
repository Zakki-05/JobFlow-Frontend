import React from 'react';

const statusStyles = {
  SAVED: 'bg-[#1a1a2e] text-[#9A8C7D] border-[#FF6B35]/15',
  APPLIED: 'bg-sky-950/80 text-sky-300 border-sky-500/30',
  ASSESSMENT: 'bg-[#FF6B35]/10 text-[#FFB347] border-[#FF6B35]/30',
  INTERVIEW: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
  OFFER: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
  WITHDRAWN: 'bg-[#1a1a2e] text-[#9A8C7D] border-[#FF6B35]/10',
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
