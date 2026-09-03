import React from 'react';
import { Inbox, Plus } from 'lucide-react';

const EmptyState = ({
  title = 'No records found',
  description = 'Get started by creating your first entry.',
  icon: Icon = Inbox,
  actionText = null,
  onAction = null,
}) => {
  return (
    <div className="glass-card rounded-2xl p-10 text-center flex flex-col items-center justify-center my-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
