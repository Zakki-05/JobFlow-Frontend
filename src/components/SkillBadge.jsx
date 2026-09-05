import React from 'react';
import { Check, X } from 'lucide-react';

const SkillBadge = ({ name, isMatch = true, count = null }) => {
  if (!name) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border shadow-sm transition-transform hover:scale-105 ${
        isMatch
          ? 'bg-[#FF6B35]/10 text-[#FFB347] border-[#FF6B35]/25'
          : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
      }`}
    >
      {isMatch ? (
        <Check className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      )}
      <span>{name}</span>
      {count !== null && (
        <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-[#1a1a2e] text-[#9A8C7D] rounded-md border border-[#FF6B35]/10">
          {count} jobs
        </span>
      )}
    </span>
  );
};

export default SkillBadge;
