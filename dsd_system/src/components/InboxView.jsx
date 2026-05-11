import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import StatusBadge from './StatusBadge';
import { Inbox } from 'lucide-react';
import { TableSkeleton } from './Skeletons';

export default function InboxView({ onEntryClick }) {
  const { entries } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const submitted = entries.filter((e) => e.status === 'captured');

  if (loading) {
    return (
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-slate-200/70 dark:bg-slate-700/70 animate-pulse"></div>
          <div className="h-5 w-16 rounded-full bg-slate-200/70 dark:bg-slate-700/70 animate-pulse"></div>
        </div>
        <TableSkeleton rows={submitted.length || 3} cols={5} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 p-1.5">
            <Inbox size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Form inbox</h3>
        </div>
        <span className="rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 border border-white/30 dark:border-slate-700/30">
          {submitted.length} submitted
        </span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-white/30 dark:bg-slate-800/30 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 sm:px-5 py-3 text-left">Form</th>
                <th className="px-4 sm:px-5 py-3 text-left">Location</th>
                <th className="px-4 sm:px-5 py-3 text-left">Submitted</th>
                <th className="px-4 sm:px-5 py-3 text-left">Status</th>
                <th className="px-4 sm:px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {submitted.map((e) => (
                <tr
                  key={e.id}
                  className="border-t border-white/20 dark:border-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-700/40 transition cursor-pointer"
                >
                  <td className="px-4 sm:px-5 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{e.indicator}</td>
                  <td className="px-4 sm:px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{e.location}</td>
                  <td className="px-4 sm:px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{e.date}</td>
                  <td className="px-4 sm:px-5 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-right">
                    <button
                      onClick={() => onEntryClick?.(e, 3)}
                      className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 backdrop-blur px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-600/80 hover:border-slate-300 dark:hover:border-slate-500 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {submitted.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <p className="text-sm text-slate-400 dark:text-slate-500">No submitted forms yet.</p>
                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Completed entries will appear here.</p>
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