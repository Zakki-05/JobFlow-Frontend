import React from 'react';

const ScoreGauge = ({ score = 0, size = 'md', showLabel = true }) => {
  const rounded = Math.round(score);

  let colorClass = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
  let level = 'STRONG MATCH';
  if (rounded < 40) {
    colorClass = 'text-rose-400 bg-rose-950/60 border-rose-500/30';
    level = 'POOR MATCH';
  } else if (rounded < 60) {
    colorClass = 'text-amber-400 bg-amber-950/60 border-amber-500/30';
    level = 'LOW MATCH';
  } else if (rounded < 80) {
    colorClass = 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30';
    level = 'MODERATE MATCH';
  }

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-mono text-xs font-bold ${colorClass}`}>
        <span>{rounded}%</span>
        {showLabel && <span className="text-[10px] opacity-80">{level}</span>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${colorClass} text-center shadow-lg`}>
      <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
        {rounded}%
      </div>
      {showLabel && (
        <span className="mt-1 text-[11px] font-mono uppercase tracking-widest font-bold">
          {level}
        </span>
      )}
    </div>
  );
};

export default ScoreGauge;
