import { useState } from 'react';
import { Filter, Plus, User } from 'lucide-react';
import { useData } from '../context/DataContext';
import FilterModal from './FilterModal';

export default function Topbar({ pageTitle, breadcrumb, onNewEntry }) {
  const { role, setRole, currentUser, filter } = useData();
  const [showFilter, setShowFilter] = useState(false);

  const toggleRole = () => {
    setRole(role === 'officer' ? 'supervisor' : 'officer');
  };

  // Number of active filter fields (non‑empty strings)
  const filterCount = Object.values(filter).filter(Boolean).length;

  // Dynamic breadcrumb: capture screen shows the user's location
  const dynamicBreadcrumb =
    pageTitle === 'Form Capture'
      ? `${currentUser.servicePoint} · April 2026`
      : breadcrumb;

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h2 className="text-[15px] font-medium text-gray-800">{pageTitle}</h2>
          <p className="text-xs text-gray-500">{dynamicBreadcrumb}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Role toggle — for demo purposes */}
          <button
            onClick={toggleRole}
            title="Toggle role (demo)"
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              role === 'supervisor'
                ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User size={14} />
            {role === 'officer' ? 'Officer' : 'Supervisor'}
          </button>

          {/* Filter button – opens modal */}
          <button
            onClick={() => setShowFilter(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Filter size={14} />
            Filter
            {filterCount > 0 && (
              <span className="ml-1 rounded-full bg-emerald-100 px-1.5 text-xs text-emerald-700">
                {filterCount}
              </span>
            )}
          </button>

          {role === 'officer' && (
            <button
              onClick={onNewEntry}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-1.5 text-sm text-white hover:bg-emerald-800"
            >
              <Plus size={14} />
              New Entry
            </button>
          )}
        </div>
      </header>

      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </>
  );
}