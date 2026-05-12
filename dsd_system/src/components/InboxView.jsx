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
          <div className="h-5 w-20 rounded bg-slate-800/70 animate-pulse"></div>
          <div className="h-5 w-16 rounded-full bg-slate-800/70 animate-pulse"></div>
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
          <div className="rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 p-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <Inbox size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Form inbox</h3>
        </div>
        <span className="rounded-full bg-slate-800/60 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 border border-slate-700/30">
          {submitted.length} submitted
        </span>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-800/40 text-[10px] font-semibold uppercase text-slate-400 tracking-wide">
              <tr>
                <th className="px-4 sm:px-5 py-2.5 text-left">Form</th>
                <th className="px-4 sm:px-5 py-2.5 text-left">Location</th>
                <th className="px-4 sm:px-5 py-2.5 text-left">Submitted</th>
                <th className="px-4 sm:px-5 py-2.5 text-left">Status</th>
                <th className="px-4 sm:px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {submitted.map((e) => (
                <tr
                  key={e.id}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition cursor-pointer group"
                >
                  <td className="px-4 sm:px-5 py-2.5 text-sm font-medium text-slate-200 group-hover:text-white">{e.indicator}</td>
                  <td className="px-4 sm:px-5 py-2.5 text-xs text-slate-400">{e.location}</td>
                  <td className="px-4 sm:px-5 py-2.5 text-xs text-slate-400 font-mono">{e.date}</td>
                  <td className="px-4 sm:px-5 py-2.5">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-4 sm:px-5 py-2.5 text-right">
                    <button
                      onClick={() => onEntryClick?.(e, 3)}
                      className="rounded-lg border border-slate-700/40 bg-slate-800/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-slate-800/70 transition-all"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {submitted.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <p className="text-xs text-slate-600 italic">No submitted forms yet.</p>
                    <p className="text-[10px] text-slate-700 mt-1">Completed entries will appear here.</p>
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