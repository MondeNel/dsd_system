import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import StatusBadge from './StatusBadge';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
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
} from 'recharts';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from './Skeletons';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];
const PIE_COLORS = ['#10b981', '#f59e0b', '#6366f1'];

export default function DashboardView({ onEntryClick }) {
  const { entries, role } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <TableSkeleton rows={5} cols={role === 'supervisor' ? 5 : 4} />
      </div>
    );
  }

  const total = entries.length;
  const captured = entries.filter((e) => e.status === 'captured').length;
  const pending = entries.filter((e) => e.status === 'pending').length;
  const inProgress = entries.filter((e) => e.status === 'inprogress').length;
  const recent = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

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

  return (
    <div className="space-y-6">
      {/* Summary cards: 1 / 2 / 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={FileText} label="Total Entries" value={total} sub="All time" color="indigo" />
        <SummaryCard icon={CheckCircle} label="Captured" value={captured} sub="Submitted forms" color="emerald" />
        <SummaryCard icon={Clock} label="Pending" value={pending} sub="Awaiting action" color="amber" />
        <SummaryCard icon={AlertCircle} label="In Progress" value={inProgress} sub="Drafts" color="violet" />
      </div>

      {/* Charts — stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Forms captured per month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="entries" radius={[6, 6, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Status breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity — scrollable table */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="px-4 sm:px-6 py-4 border-b border-white/20">
          <h3 className="text-sm font-semibold text-slate-800">
            Recent activity
            {role === 'supervisor' && (
              <span className="ml-2 text-[11px] font-normal text-slate-400">All locations</span>
            )}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-white/30 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left">Indicator</th>
                <th className="px-4 sm:px-6 py-3 text-left">Added by</th>
                {role === 'supervisor' && (
                  <th className="px-4 sm:px-6 py-3 text-left">Location</th>
                )}
                <th className="px-4 sm:px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-t border-white/20 hover:bg-white/40 transition cursor-pointer"
                  onClick={() => onEntryClick(entry)}
                >
                  <td className="px-4 sm:px-6 py-3 text-sm text-slate-600">{entry.date}</td>
                  <td className="px-4 sm:px-6 py-3 text-sm font-medium text-slate-800">{entry.indicator}</td>
                  <td className="px-4 sm:px-6 py-3 text-sm text-slate-700">{entry.addedBy}</td>
                  {role === 'supervisor' && (
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-500">{entry.location}</td>
                  )}
                  <td className="px-4 sm:px-6 py-3">
                    <StatusBadge status={entry.status} />
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                    No entries yet.
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

function SummaryCard({ icon: Icon, label, value, sub, color }) {
  const gradients = {
    indigo: 'from-indigo-500 to-blue-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    violet: 'from-violet-500 to-purple-500',
  };
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`rounded-lg bg-gradient-to-br ${gradients[color]} p-2`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="mt-3 text-2xl sm:text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}