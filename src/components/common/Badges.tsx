import React from 'react';
import { CaseStatus, CasePriority, BureauType, OverlapConfidenceBand } from '../../types';

export const StatusBadge: React.FC<{ status: CaseStatus; className?: string }> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Awaiting Information':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Coordination Requested':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200 font-medium';
      case 'Escalated':
        return 'bg-rose-50 text-rose-700 border-rose-300 font-semibold';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-medium tracking-wide ${getStyles()} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: CasePriority; className?: string }> = ({ priority, className = '' }) => {
  const getStyles = () => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-300 font-semibold';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border uppercase tracking-wider font-semibold ${getStyles()} ${className}`}>
      {priority}
    </span>
  );
};

export const BureauBadge: React.FC<{ bureau: BureauType; className?: string }> = ({ bureau, className = '' }) => {
  const getStyles = () => {
    switch (bureau) {
      case 'PGRC':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Regulation Bureau':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'Approval Bureau':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Legal Cell':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Skill Development':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${getStyles()} ${className}`}>
      {bureau === 'PGRC' ? 'PGRC (Grievance)' : bureau === 'Regulation Bureau' ? 'RB (Regulation)' : bureau}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ band: OverlapConfidenceBand; score: number; className?: string }> = ({ band, score, className = '' }) => {
  const getStyles = () => {
    switch (band) {
      case 'High-Priority Review':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Potentially Related':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Weak Match':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'Identity Needs Verification':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border font-medium ${getStyles()} ${className}`}>
      <span className="font-mono font-bold">{score}%</span>
      <span>•</span>
      <span>{band}</span>
    </div>
  );
};

export const MetricCard: React.FC<{
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { text: string; positive?: boolean };
  badge?: string;
  onClick?: () => void;
  highlight?: boolean;
}> = ({ title, value, subtitle, icon, trend, badge, onClick, highlight = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border p-4 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-400' : ''
      } ${highlight ? 'border-blue-300 ring-1 ring-blue-100 bg-blue-50/20' : 'border-slate-200'}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">{value}</span>
            {badge && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="p-2.5 rounded-md bg-slate-50 text-slate-700 border border-slate-100">
          {icon}
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span className={`font-medium ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
