import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import StatusBadge from './StatusBadge';
import {
  FileText, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { CardSkeleton, ChartSkeleton } from './Skeletons';

const CHART_COLORS = ['#10b981', '#38bdf8', '#a78bfa', '#f472b6'];
const PIE_COLORS = ['#10b981', '#fbbf24', '#38bdf8'];

const getMonthRange = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate().toString().padStart(2, '0');
  return { dateFrom: `${year}-${month}-01`, dateTo: `${year}-${month}-${lastDay}` };
};

export default function DashboardView({ onEntryClick, onQuickFilter, onChartFilter }) {
  const { entries, role } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // ========== SKELETON ==========
  if (loading) {
    return (
      <div className="-m-4 sm:-m-6 p-4 sm:p-6 min-h-full"
        style={{ background: 'radial-gradient(circle at 20% 30%, #0f172a, #020617)' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ChartSkeleton /><ChartSkeleton />
        </div>
        <div className="h-40 bg-slate-800/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  // ========== DATA ==========
  const total = entries.length;
  const captured = entries.filter((e) => e.status === 'captured').length;
  const pending = entries.filter((e) => e.status === 'pending').length;
  const inProgress = entries.filter((e) => e.status === 'inprogress').length;
  const recent = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const monthsMap = {};
  entries.forEach((e) => {
    const month = e.date.substring(0, 7);
    monthsMap[month] = (monthsMap[month] || 0) + 1;
  });
  const barData = Object.entries(monthsMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ name: month, entries: count }));

  const statusData = [
    { name: 'Captured', value: captured },
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
  ].filter((d) => d.value > 0);

  const handleBarClick = (data) => {
    if (data?.name) onChartFilter(getMonthRange(data.name));
  };
  const handlePieClick = (data) => {
    if (data?.name) {
      const map = { 'Captured': 'captured', 'Pending': 'pending', 'In Progress': 'inprogress' };
      onChartFilter({ status: map[data.name] || data.name.toLowerCase() });
    }
  };

  return (
    <div className="-m-4 sm:-m-6 p-4 sm:p-6 min-h-full"
      style={{ background: 'radial-gradient(circle at 30% 20%, #0f172a, #020617)' }}>
      
      {/* ── Cards bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <ExecutiveCard icon={FileText} label="Total Entries" value={total} sub="All time" color="emerald" onClick={() => onQuickFilter('all')} />
        <ExecutiveCard icon={CheckCircle} label="Captured" value={captured} sub="Submitted forms" color="emerald" onClick={() => onQuickFilter('captured')} />
        <ExecutiveCard icon={Clock} label="Pending" value={pending} sub="Awaiting action" color="amber" onClick={() => onQuickFilter('pending')} />
        <ExecutiveCard icon={AlertCircle} label="In Progress" value={inProgress} sub="Drafts" color="sky" onClick={() => onQuickFilter('inprogress')} />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Bar chart */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-[0.15em]">Forms per month</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: 'rgba(15,23,42,0.6)' }} contentStyle={{ background: '#1e293b', borderColor: '#334155', borderRadius: 8, color: '#f1f5f9' }} />
              <Bar dataKey="entries" radius={[4,4,0,0]} cursor="pointer" onClick={handleBarClick}>
                {barData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-[0.15em]">Status breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                onClick={handlePieClick} cursor="pointer">
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', borderColor: '#334155', borderRadius: 8, color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-0.5 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-[0.15em]">Recent activity</h3>
            {role === 'supervisor' && <span className="text-[10px] text-slate-500 ml-2">All locations</span>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px]">
            <thead className="bg-slate-800/40 text-[10px] font-semibold uppercase text-slate-400 tracking-wide">
              <tr>
                <th className="px-5 py-2.5 text-left">Date</th>
                <th className="px-5 py-2.5 text-left">Indicator</th>
                <th className="px-5 py-2.5 text-left">Added by</th>
                {role === 'supervisor' && <th className="px-5 py-2.5 text-left">Location</th>}
                <th className="px-5 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((entry) => (
                <tr key={entry.id}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition cursor-pointer group"
                  onClick={() => onEntryClick(entry)}>
                  <td className="px-5 py-2.5 text-xs text-slate-400 font-mono">{entry.date}</td>
                  <td className="px-5 py-2.5 text-sm font-medium text-slate-200 group-hover:text-white">{entry.indicator}</td>
                  <td className="px-5 py-2.5 text-sm text-slate-400">{entry.addedBy}</td>
                  {role === 'supervisor' && <td className="px-5 py-2.5 text-sm text-slate-400">{entry.location}</td>}
                  <td className="px-5 py-2.5"><StatusBadge status={entry.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-xs text-slate-600 italic">
                    No entries yet – data will appear here once captured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Enhanced executive card with glow */
function ExecutiveCard({ icon: Icon, label, value, sub, color, onClick }) {
  const glows = {
    emerald: 'shadow-[0_0_15px_rgba(16,185,129,0.15)] border-emerald-500/20',
    amber: 'shadow-[0_0_15px_rgba(251,191,36,0.15)] border-amber-400/20',
    sky: 'shadow-[0_0_15px_rgba(56,189,248,0.15)] border-sky-400/20',
  };
  return (
    <div onClick={onClick}
      className={`rounded-xl bg-slate-900/80 backdrop-blur-sm border ${glows[color] || 'border-slate-700/30'} p-3 sm:p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${color === 'emerald' ? 'from-emerald-600 to-teal-500' : color === 'amber' ? 'from-amber-500 to-orange-600' : 'from-sky-500 to-blue-600'}`}>
          <Icon size={14} className="text-white" />
        </div>
      </div>
      <p className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="mt-0.5 text-[10px] text-slate-500 font-medium">{sub}</p>
    </div>
  );
}