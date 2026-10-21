import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/Badges';
import {
  FileText,
  AlertCircle,
  Clock,
  GitCompareArrows,
  Network,
  Building2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export const OverviewDashboard: React.FC = () => {
  const {
    filteredCases,
    cases,
    institutions,
    suggestions,
    coordinations,
    setCurrentView,
    setFilters,
    viewInstitution360,
    viewCaseDetails,
  } = useApp();

  // Metrics derived purely from the dataset
  const totalCases = filteredCases.length;
  const openCases = filteredCases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const pendingCases = filteredCases.filter(c => c.status === 'Under Review' || c.status === 'Awaiting Information').length;
  const overdueCases = filteredCases.filter(c => {
    if (c.status === 'Resolved' || c.status === 'Closed') return false;
    return new Date(c.dueDate).getTime() < new Date('2026-10-21').getTime();
  }).length;
  const awaitingCoordination = filteredCases.filter(c => c.status === 'Coordination Requested').length;
  const pendingOverlapReviews = suggestions.filter(s => s.status === 'Pending Review').length;
  const totalInstitutions = institutions.length;

  // Chart 1: Cases by Bureau
  const bureauDistribution = React.useMemo(() => {
    const map: Record<string, number> = {};
    filteredCases.forEach(c => {
      map[c.bureau] = (map[c.bureau] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [filteredCases]);

  // Chart 2: Cases by Status
  const statusDistribution = React.useMemo(() => {
    const map: Record<string, number> = {};
    filteredCases.forEach(c => {
      map[c.status] = (map[c.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredCases]);

  // Chart 3: Case Ageing Buckets
  const ageingBuckets = React.useMemo(() => {
    const buckets = [
      { name: '< 15 Days', count: 0 },
      { name: '15-30 Days', count: 0 },
      { name: '31-60 Days', count: 0 },
      { name: '> 60 Days', count: 0 },
    ];
    const now = new Date('2026-10-21').getTime();
    filteredCases.forEach(c => {
      if (c.status === 'Resolved' || c.status === 'Closed') return;
      const days = Math.round((now - new Date(c.dateReceived).getTime()) / (1000 * 3600 * 24));
      if (days < 15) buckets[0].count++;
      else if (days <= 30) buckets[1].count++;
      else if (days <= 60) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [filteredCases]);

  // Chart 4: Monthly Trend
  const monthlyTrend = React.useMemo(() => {
    const months = ['Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'];
    const map: Record<string, { month: string; pgrc: number; rb: number; resolved: number }> = {
      'Jun 2026': { month: 'Jun', pgrc: 2, rb: 3, resolved: 4 },
      'Jul 2026': { month: 'Jul', pgrc: 5, rb: 4, resolved: 3 },
      'Aug 2026': { month: 'Aug', pgrc: 8, rb: 7, resolved: 6 },
      'Sep 2026': { month: 'Sep', pgrc: 14, rb: 11, resolved: 9 },
      'Oct 2026': { month: 'Oct', pgrc: 19, rb: 13, resolved: 8 },
    };
    return Object.values(map);
  }, []);

  // Top Institutions with Recurring Violations
  const recurringInstitutions = React.useMemo(() => {
    return [...institutions]
      .sort((a, b) => b.recurringIssues.reduce((acc, i) => acc + i.count, 0) - a.recurringIssues.reduce((acc, i) => acc + i.count, 0))
      .slice(0, 5);
  }, [institutions]);

  // Officer Workload
  const officerWorkload = React.useMemo(() => {
    const map: Record<string, { officer: string; bureau: string; count: number }> = {};
    filteredCases.forEach(c => {
      if (c.status === 'Resolved' || c.status === 'Closed') return;
      const key = c.assignedOfficer.name;
      if (!map[key]) {
        map[key] = { officer: key, bureau: c.bureau, count: 0 };
      }
      map[key].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredCases]);

  const PIE_COLORS = ['#3b82f6', '#f59e0b', '#6366f1', '#a855f7', '#06b6d4', '#ef4444', '#10b981', '#64748b'];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Alert if high-priority cross-bureau overlap exists */}
      {pendingOverlapReviews > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-rose-100 text-rose-700">
              <GitCompareArrows className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                {pendingOverlapReviews} Cross-Bureau Overlap Suggestions Awaiting Officer Review
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Explainable AI matcher detected concurrent complaints across Regulation Bureau and PGRC sharing permanent ID, text tokens, or violation patterns.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('overlap')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Review Overlap Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        <MetricCard
          title="Total Cases"
          value={totalCases}
          subtitle="Registered in system"
          icon={<FileText className="w-4 h-4" />}
          onClick={() => {
            setFilters(prev => ({ ...prev, status: 'ALL' }));
            setCurrentView('cases');
          }}
        />
        <MetricCard
          title="Open Active"
          value={openCases}
          subtitle="Currently actionable"
          icon={<AlertCircle className="w-4 h-4 text-blue-600" />}
          highlight
          onClick={() => {
            setFilters(prev => ({ ...prev, status: 'In Progress' }));
            setCurrentView('cases');
          }}
        />
        <MetricCard
          title="Pending Review"
          value={pendingCases}
          subtitle="Under initial scrutiny"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          onClick={() => {
            setFilters(prev => ({ ...prev, status: 'Under Review' }));
            setCurrentView('cases');
          }}
        />
        <MetricCard
          title="Overdue (SLA)"
          value={overdueCases}
          subtitle="Target response breached"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
          trend={{ text: `${overdueCases} cases breach SLA`, positive: false }}
          onClick={() => setCurrentView('sla')}
        />
        <MetricCard
          title="Coordination Req"
          value={awaitingCoordination}
          subtitle="Cross-bureau action"
          icon={<Network className="w-4 h-4 text-cyan-600" />}
          onClick={() => setCurrentView('coordination')}
        />
        <MetricCard
          title="Overlap Pending"
          value={pendingOverlapReviews}
          subtitle="Multi-signal matched"
          icon={<GitCompareArrows className="w-4 h-4 text-rose-600" />}
          badge="Action Required"
          onClick={() => setCurrentView('overlap')}
        />
        <MetricCard
          title="Institutions"
          value={totalInstitutions}
          subtitle="Technical institutes"
          icon={<Building2 className="w-4 h-4 text-indigo-600" />}
          onClick={() => setCurrentView('institutions')}
        />
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases by Bureau */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cases by Bureau / Cell</h3>
              <p className="text-xs text-slate-500">Distribution across administrative divisions</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Click bar to filter</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bureauDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                onClick={(data: any) => {
                  if (data?.activeLabel) {
                    setFilters(prev => ({ ...prev, bureau: data.activeLabel }));
                    setCurrentView('cases');
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cases by Status Pie */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Status Breakdown</h3>
              <p className="text-xs text-slate-500">Lifecycle distribution of cases</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Ageing Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Case Ageing Distribution</h3>
              <p className="text-xs text-slate-500">Days elapsed since receipt for unresolved cases</p>
            </div>
            <button
              onClick={() => setCurrentView('sla')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View SLA Queue
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageingBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Trend & Recurring Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Case Trend */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Case Trend (PGRC vs Regulation Bureau)</h3>
              <p className="text-xs text-slate-500">Intake velocity and resolution volume</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              Past 5 Months
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="pgrc" name="PGRC Inflow" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rb" name="RB Scrutiny" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institutions with Recurring Issues */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">High-Scrutiny Institutions</h3>
              <p className="text-xs text-slate-500">Recurring grievance hotspots</p>
            </div>
            <button
              onClick={() => setCurrentView('institutions')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              All Registry
            </button>
          </div>
          <div className="space-y-3 mt-4">
            {recurringInstitutions.map(inst => (
              <div
                key={inst.id}
                onClick={() => viewInstitution360(inst.id)}
                className="p-3 rounded-md border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{inst.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                    <span>{inst.aictePermanentId}</span>
                    <span>•</span>
                    <span>{inst.district}, {inst.state}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    Risk {inst.riskIndex}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {inst.openCasesCount} Open / {inst.overdueCasesCount} Overdue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Officer Workload Breakdown */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Officer Workload Allocation</h3>
            <p className="text-xs text-slate-500">Active caseload distribution across investigating officers</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {officerWorkload.map(ow => (
            <div key={ow.officer} className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-800 truncate">{ow.officer}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{ow.bureau}</p>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xs text-slate-600">Active Cases:</span>
                <span className="text-lg font-bold font-mono text-blue-900">{ow.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
