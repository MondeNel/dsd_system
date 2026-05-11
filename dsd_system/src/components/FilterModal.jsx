import { useData } from '../context/DataContext';
import { INDICATORS } from '../constants';
import { X } from 'lucide-react';

export default function FilterModal({ isOpen, onClose }) {
  const { filter, setFilter, clearFilter } = useData();

  if (!isOpen) return null;

  const handleApply = () => {
    onClose();
  };

  const handleClear = () => {
    clearFilter();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-800">Filter entries</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Indicator */}
          <label className="block text-xs font-medium text-gray-600">
            Indicator
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              value={filter.indicator}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, indicator: e.target.value }))
              }
            >
              <option value="">All indicators</option>
              {INDICATORS.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </label>

          {/* Status */}
          <label className="block text-xs font-medium text-gray-600">
            Status
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">All statuses</option>
              <option value="captured">Captured</option>
              <option value="pending">Pending</option>
              <option value="inprogress">In progress</option>
            </select>
          </label>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-gray-600">
              From
              <input
                type="date"
                value={filter.dateFrom}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-gray-600">
              To
              <input
                type="date"
                value={filter.dateTo}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, dateTo: e.target.value }))
                }
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 underline hover:text-gray-700"
          >
            Clear filters
          </button>
          <button
            onClick={handleApply}
            className="rounded bg-emerald-700 px-5 py-2 text-sm text-white hover:bg-emerald-800"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}