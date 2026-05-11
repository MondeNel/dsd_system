import { Filter, Plus, User } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Topbar({ pageTitle, breadcrumb, onNewEntry }) {
  const { role, setRole } = useData();

  const toggleRole = () => {
    setRole(role === 'officer' ? 'supervisor' : 'officer');
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div>
        <h2 className="text-[15px] font-medium text-gray-800">{pageTitle}</h2>
        <p className="text-xs text-gray-500">{breadcrumb}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Role Toggle */}
        <button
          onClick={toggleRole}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium ${
            role === 'supervisor'
              ? 'border-amber-300 bg-amber-50 text-amber-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User size={14} />
          {role === 'officer' ? 'Officer' : 'Supervisor'}
        </button>

        <button className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm hover:bg-gray-50">
          <Filter size={14} />
          Filter
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
  );
}