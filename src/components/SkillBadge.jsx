import React from 'react';
import { Check, X } from 'lucide-react';

const SkillBadge = ({ name, isMatch = true, count = null }) => {
  if (!name) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border shadow-sm transition-transform hover:scale-105 ${
        isMatch
          ? 'bg-indigo-950/60 text-indigo-200 border-indigo-500/30'
          : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
      }`}
    >
      {isMatch ? (
        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      )}
      <span>{name}</span>
      {count !== null && (
        <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-slate-900 text-slate-300 rounded-md border border-slate-700">
          {count} jobs
        </span>
      )}
    </span>
  );
};

export default SkillBadge;
