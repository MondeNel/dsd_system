import { Filter, Plus } from 'lucide-react';

export default function Topbar({ pageTitle, breadcrumb, onNewEntry }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div>
        <h2 className="text-[15px] font-medium text-gray-800">{pageTitle}</h2>
        <p className="text-xs text-gray-500">{breadcrumb}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm hover:bg-gray-50">
          <Filter size={14} />
          Filter
        </button>
        <button
          onClick={onNewEntry}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-1.5 text-sm text-white hover:bg-emerald-800"
        >
          <Plus size={14} />
          New Entry
        </button>
      </div>
    </header>
  );
}