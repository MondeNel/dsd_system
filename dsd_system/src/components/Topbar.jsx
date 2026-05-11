import { useState } from 'react';
import { Filter, Plus, User } from 'lucide-react';
import { useData } from '../context/DataContext';
import FilterModal from './FilterModal';

export default function Topbar({ pageTitle, breadcrumb, onNewEntry }) {
  const { role, setRole, currentUser, filter } = useData();
  const [showFilter, setShowFilter] = useState(false);
  const filterCount = Object.values(filter).filter(Boolean).length;

  const toggleRole = () => setRole(role === 'officer' ? 'supervisor' : 'officer');

  const dynamicBreadcrumb =
    pageTitle === 'Form Capture'
      ? `${currentUser.servicePoint} · April 2026`
      : breadcrumb;

  return (
    <>
      <header className="glass-card sticky top-0 z-40 flex items-center justify-between border-b border-white/20 px-6 py-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">{pageTitle}</h2>
          <p className="text-xs text-slate-500">{dynamicBreadcrumb}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Role toggle */}
          <button
            onClick={toggleRole}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              role === 'supervisor'
                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User size={14} />
            {role === 'officer' ? 'Officer' : 'Supervisor'}
          </button>

          {/* Filter */}
          <button
            onClick={() => setShowFilter(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Filter size={14} />
            Filter
            {filterCount > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 px-1.5 text-xs font-medium text-indigo-600">
                {filterCount}
              </span>
            )}
          </button>

          {role === 'officer' && (
            <button
              onClick={onNewEntry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all"
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