import React from 'react';
import { Inbox, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  actionLink
}) => {
  return (
    <div className="enterprise-panel p-10 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 text-xs max-w-sm">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="btn-primary mt-2 px-4 py-2 inline-flex items-center gap-1.5 text-xs shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{actionLabel}</span>
        </Link>
      )}
    </div>
  );
};
