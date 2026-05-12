import { useState } from 'react';
import { Filter, Plus, User, Menu, Sun, Moon } from 'lucide-react';
import { useData } from '../context/DataContext';
import FilterModal from './FilterModal';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Topbar({ pageTitle, breadcrumb, onNewEntry, onToggleSidebar }) {
  const { role, setRole, currentUser, filter } = useData();
  const [showFilter, setShowFilter] = useState(false);
  const filterCount = Object.values(filter).filter(Boolean).length;
  const [dark, setDark] = useDarkMode();

  const toggleRole = () => setRole(role === 'officer' ? 'supervisor' : 'officer');

  const dynamicBreadcrumb =
    pageTitle === 'Form Capture'
      ? `${currentUser.servicePoint} · April 2026`
      : breadcrumb;

  return (
    <>
      <header className="glass-card sticky top-0 z-30 flex items-center justify-between border-b border-white/20 dark:border-slate-700/30 px-3 sm:px-6 py-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 truncate">{pageTitle}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{dynamicBreadcrumb}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300"
            title="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={toggleRole}
            className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors ${
              role === 'supervisor'
                ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
            title={`Switch to ${role === 'officer' ? 'Supervisor' : 'Officer'}`}
          >
            <User size={14} />
            <span className="hidden sm:inline">{role === 'officer' ? 'Officer' : 'Supervisor'}</span>
          </button>

          <button
            onClick={() => setShowFilter(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filter</span>
            {filterCount > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 px-1.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                {filterCount}
              </span>
            )}
          </button>

          {role === 'officer' && (
            <button
              onClick={onNewEntry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 sm:px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          )}
        </div>
      </header>

      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </>
  );
}