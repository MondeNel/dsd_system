import { useData } from '../context/DataContext';
import StatusBadge from './StatusBadge';
import { Inbox } from 'lucide-react';

export default function InboxView({ onEntryClick }) {
  const { entries } = useData();
  const submitted = entries.filter((e) => e.status === 'captured');

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 p-1.5">
            <Inbox size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Form inbox</h3>
        </div>
        <span className="rounded-full bg-white/60 backdrop-blur px-3 py-1 text-xs font-medium text-slate-500 border border-white/30">
          {submitted.length} submitted
        </span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <table className="w-full">
          <thead className="bg-white/30 text-[11px] font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">Form</th>
              <th className="px-5 py-3 text-left">Location</th>
              <th className="px-5 py-3 text-left">Submitted</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {submitted.map((e) => (
              <tr
                key={e.id}
                className="border-t border-white/20 hover:bg-white/40 transition cursor-pointer"
              >
                <td className="px-5 py-3 text-sm font-medium text-slate-800">{e.indicator}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{e.location}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{e.date}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => onEntryClick?.(e)}
                    className="rounded-lg border border-slate-200 bg-white/60 backdrop-blur px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white/80 hover:border-slate-300 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {submitted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center">
                  <p className="text-sm text-slate-400">No submitted forms yet.</p>
                  <p className="text-xs text-slate-300 mt-1">Completed entries will appear here.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}