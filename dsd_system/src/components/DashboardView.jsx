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

const COLORS = ['#0F6E56', '#D97706', '#2563EB'];

export default function DashboardView({ onEntryClick }) {
  const { entries, role } = useData();

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
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={FileText} label="Total Entries" value={total} sub="All time" />
        <SummaryCard icon={CheckCircle} label="Captured" value={captured} sub="Submitted forms" />
        <SummaryCard icon={Clock} label="Pending" value={pending} sub="Awaiting action" />
        <SummaryCard icon={AlertCircle} label="In Progress" value={inProgress} sub="Drafts" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-800">Forms captured per month</h3>
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="entries" fill="#0F6E56" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-800">Status breakdown</h3>
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${Math.round(percent * 100)}%`
                  }
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-lg border bg-white">
        <div className="px-5 py-4">
          <h3 className="text-sm font-medium text-gray-800">
            Recent activity
            {role === 'supervisor' && (
              <span className="ml-2 text-[11px] font-normal text-gray-400">All locations</span>
            )}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-[11px] font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-2.5 text-left">Date</th>
                <th className="px-5 py-2.5 text-left">Indicator</th>
                <th className="px-5 py-2.5 text-left">Added by</th>
                {role === 'supervisor' && (
                  <th className="px-5 py-2.5 text-left">Location</th>
                )}
                <th className="px-5 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((entry) => (
                <tr
                  key={entry.id}
                  className="cursor-pointer border-t border-gray-100 transition hover:bg-gray-50"
                  onClick={() => onEntryClick(entry)}
                >
                  <td className="px-5 py-2.5 text-xs text-gray-500">{entry.date}</td>
                  <td className="px-5 py-2.5 text-sm text-gray-800">{entry.indicator}</td>
                  <td className="px-5 py-2.5 text-sm">{entry.addedBy}</td>
                  {role === 'supervisor' && (
                    <td className="px-5 py-2.5 text-xs text-gray-500">{entry.location}</td>
                  )}
                  <td className="px-5 py-2.5">
                    <StatusBadge status={entry.status} />
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-gray-400">
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

function SummaryCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-lg border bg-white p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <Icon size={18} className="text-gray-400" />
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-800">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
  );
}