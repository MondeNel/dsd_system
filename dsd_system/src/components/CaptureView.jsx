import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import CommentsView from './CommentsView';
import StatusBadge from './StatusBadge';
import { Users, ShieldCheck, Heart, FileCheck } from 'lucide-react';
import { StatsRowSkeleton, TabsSkeleton, TableSkeleton } from './Skeletons';

export default function CaptureView({ onNewEntry, onEntryClick }) {
  const { entries } = useData();
  const [activeTab, setActiveTab] = useState('all');

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <TabsSkeleton />
        <StatsRowSkeleton />
        <div className="mb-3 flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-slate-200/70 dark:bg-slate-700/70 animate-pulse"></div>
          <div className="h-7 w-16 rounded bg-slate-200/70 dark:bg-slate-700/70 animate-pulse"></div>
        </div>
        <TableSkeleton rows={4} cols={6} />
      </div>
    );
  }

  const stats = [
    {
      label: 'Family Preservation',
      value: entries.filter((e) => e.indicator.includes('Family Preservation')).length,
      sub: 'April 2026',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      label: 'Child Abuse Cases',
      value: entries.filter((e) => e.indicator.includes('Child Abuse')).length,
      sub: 'Reported this month',
      icon: ShieldCheck,
      color: 'from-rose-500 to-pink-500',
    },
    {
      label: 'Foster Care Orders',
      value: entries.filter((e) => e.indicator.includes('foster care')).length,
      sub: 'Valid & active',
      icon: Heart,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Forms Captured',
      value: entries.length,
      sub: 'This location',
      icon: FileCheck,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const filteredEntries = () => {
    if (activeTab === 'all') return entries;
    if (activeTab === 'pending') return entries.filter((e) => e.status === 'pending');
    if (activeTab === 'completed') return entries.filter((e) => e.status === 'captured');
    if (activeTab === 'comments') return entries.filter((e) => e.comments?.length > 0);
    return entries;
  };

  const tabs = [
    { id: 'all', label: 'All Forms' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'comments', label: 'Comments' },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex border-b border-white/20 dark:border-slate-700/30 overflow-x-auto -mx-1 px-1">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 sm:px-4 py-2.5 text-[13px] font-medium transition-all relative whitespace-nowrap ${
              activeTab === id
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {label}
            {activeTab === id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-3 sm:p-4 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <div className={`rounded-lg bg-gradient-to-br ${color} p-1.5 sm:p-2`}>
                <Icon size={14} className="sm:size-16 text-white" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            <p className="mt-1 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* Table / comments */}
      {activeTab === 'comments' ? (
        <CommentsView entries={entries} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Recent form captures</h4>
            <button className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 transition">
              View all
            </button>
          </div>
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-white/30 dark:bg-slate-800/30 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Indicator</th>
                    <th className="px-4 py-3 text-left">Added by</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries().map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-t border-white/20 dark:border-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-700/40 transition cursor-pointer"
                      onClick={() => onEntryClick(entry)}
                    >
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{entry.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{entry.indicator}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{entry.addedBy}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{entry.role}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{entry.location}</td>
                      <td className="px-4 py-3"><StatusBadge status={entry.status} /></td>
                    </tr>
                  ))}
                  {filteredEntries().length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">No entries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}