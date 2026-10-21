import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { exportCasesToCsv } from '../../services/exportService';
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
} from 'recharts';
import { Download, BarChart3, TrendingUp, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const AnalyticsReports: React.FC = () => {
  const { filteredCases, suggestions, institutions } = useApp();

  // 1. State/Region Distribution
  const stateDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredCases.forEach(c => {
      map[c.state] = (map[c.state] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredCases]);

  // 2. Issue Category Breakdown
  const categoryDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredCases.forEach(c => {
      map[c.category] = (map[c.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.length > 24 ? name.slice(0, 22) + '...' : name,
      fullName: name,
      value,
    }));
  }, [filteredCases]);

  // 3. Overlap Review Outcomes
  const reviewOutcomes = useMemo(() => {
    const map: Record<string, number> = {
      'Accepted Link': 0,
      'Rejected Match': 0,
      'Pending Review': 0,
      'Under Investigation': 0,
    };
    suggestions.forEach(s => {
      if (s.status === 'Accepted') map['Accepted Link']++;
      else if (s.status === 'Rejected') map['Rejected Match']++;
      else if (s.status === 'Pending Review') map['Pending Review']++;
      else map['Under Investigation']++;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [suggestions]);

  // 4. Source Channel Distribution
  const channelDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredCases.forEach(c => {
      map[c.sourceChannel] = (map[c.sourceChannel] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [filteredCases]);

  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#e11d48', '#8b5cf6', '#06b6d4', '#84cc16'];
  const REVIEW_COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#6366f1'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Executive Analytics & Regulatory Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic distribution, review adjudication ratios, and systemic violation analysis
          </p>
        </div>
        <button
          onClick={() => exportCasesToCsv(filteredCases, 'AICTE_Executive_Analytics_Report.csv')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Report (CSV)</span>
        </button>
      </div>

      {/* Grid of Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: State-wise Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">State / Territory Distribution</h3>
              <p className="text-xs text-slate-500">Complaint density across state jurisdictions</p>
            </div>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Overlap Review Outcomes */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cross-Bureau Review Outcomes</h3>
              <p className="text-xs text-slate-500">Adjudication ratio of suggested cross-bureau links</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewOutcomes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {reviewOutcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={REVIEW_COLORS[index % REVIEW_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Grievance Categories Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Grievance Category Frequency</h3>
              <p className="text-xs text-slate-500">Distribution by primary violation type</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Intake Channel Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Case Inflow by Source Channel</h3>
              <p className="text-xs text-slate-500">CPGRAMS, direct web portal, vigilance, and physical petitions</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
