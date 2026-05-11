import { useData } from '../context/DataContext';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
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
} from 'recharts';

const COLORS = ['#0F6E56', '#D97706', '#2563EB', '#6B7280'];

export default function DashboardView({ onEntryClick }) {
  const { entries } = useData();

  // ---------- Summary stats ----------
  const total = entries.length;
  const captured = entries.filter((e) => e.status === 'captured').length;
  const pending = entries.filter((e) => e.status === 'pending').length;
  const inProgress = entries.filter((e) => e.status === 'inprogress').length;
  const recent = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  ).slice(0, 5);

  // ---------- Chart data ----------
  // Monthly entries (based on date string: YYYY-MM-DD)
  const monthsMap = {};
  entries.forEach((e) => {
    const month = e.date.substring(0, 7); // "2026-05"
    monthsMap[month] = (monthsMap[month] || 0) + 1;
  });
  const barData = Object.entries(monthsMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({
      name: month,
      entries: count,
    }));

  // Status distribution
  const statusData = [
    { name: 'Captured', value: captured },
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={FileText}
          label="Total Entries"
          value={total}
          sub="All time"
        />
        <SummaryCard
          icon={CheckCircle}
          label="Captured"
          value={captured}
          sub="Submitted forms"
        />
        <SummaryCard
          icon={Clock}
          label="Pending"
          value={pending}
          sub="Awaiting action"
        />
        <SummaryCard
          icon={AlertCircle}
          label="In Progress"
          value={inProgress}
          sub="Drafts"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar chart: monthly entries */}
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-800">
            Forms Captured per Month
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="entries" fill="#0F6E56" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: status distribution */}
        <div className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-800">
            Status Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-lg border bg-white">
        <div className="px-5 py-4">
          <h3 className="text-sm font-medium text-gray-800">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-[11px] font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-2.5 text-left">Date</th>
                <th className="px-5 py-2.5 text-left">Indicator</th>
                <th className="px-5 py-2.5 text-left">Added by</th>
                <th className="px-5 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((entry) => (
                <tr
                  key={entry.id}
                  className="cursor-pointer border-t border-gray-100 hover:bg-gray-50 transition"
                  onClick={() => onEntryClick(entry)}
                >
                  <td className="px-5 py-2.5 text-xs text-gray-500">{entry.date}</td>
                  <td className="px-5 py-2.5 text-sm text-gray-800">{entry.indicator}</td>
                  <td className="px-5 py-2.5 text-sm">{entry.addedBy}</td>
                  <td className="px-5 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        entry.status === 'captured'
                          ? 'bg-lime-100 text-lime-800'
                          : entry.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {entry.status === 'inprogress'
                        ? 'In progress'
                        : entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-sm text-gray-400">
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
    <div className="rounded-lg border bg-white p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <Icon size={18} className="text-gray-400" />
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-800">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
  );
}