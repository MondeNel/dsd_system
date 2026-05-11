import { useData } from '../context/DataContext';
import StatusBadge from './StatusBadge';

export default function InboxView({ onEntryClick }) {
  const { entries } = useData();
  const submitted = entries.filter((e) => e.status === 'captured');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800">Form inbox</h3>
        <span className="text-xs text-gray-400">{submitted.length} submitted</span>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-2.5 text-left">Form</th>
              <th className="px-4 py-2.5 text-left">Location</th>
              <th className="px-4 py-2.5 text-left">Submitted</th>
              <th className="px-4 py-2.5 text-left">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {submitted.map((e) => (
              <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 text-sm text-gray-800">{e.indicator}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{e.location}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{e.date}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => onEntryClick?.(e)}
                    className="rounded border px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {submitted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">
                  No submitted forms yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}