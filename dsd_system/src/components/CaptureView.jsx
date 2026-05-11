import { useState } from 'react';
import { useData } from '../context/DataContext';
import CommentsView from './CommentsView';

const statusBadge = (status) => {
  const map = {
    captured: 'bg-lime-100 text-lime-800',
    pending: 'bg-amber-100 text-amber-800',
    inprogress: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status === 'inprogress' ? 'In progress' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function CaptureView({ onNewEntry, onEntryClick }) {
  const { entries } = useData();
  const [activeTab, setActiveTab] = useState('all');

  // Stats
  const stats = {
    familyPreservation: entries.filter(e => e.indicator.includes('Family Preservation')).length,
    childAbuse: entries.filter(e => e.indicator.includes('Child Abuse')).length,
    fosterCare: entries.filter(e => e.indicator.includes('foster care')).length,
    totalForms: entries.length,
  };

  const filteredEntries = () => {
    if (activeTab === 'all') return entries;
    if (activeTab === 'pending') return entries.filter(e => e.status === 'pending');
    if (activeTab === 'completed') return entries.filter(e => e.status === 'captured');
    if (activeTab === 'comments') return entries.filter(e => e.comments && e.comments.length > 0);
    return entries;
  };

  return (
    <div>
      {/* Tab Bar */}
      <div className="mb-5 flex border-b border-gray-200">
        {['all', 'pending', 'completed', 'comments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[13px] ${
              activeTab === tab
                ? 'border-b-2 border-emerald-700 font-medium text-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'all' ? 'All Forms' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <p className="text-xs text-gray-500">Family Preservation</p>
            <span className="text-lg text-gray-400">👥</span>
          </div>
          <p className="mt-1.5 text-2xl font-medium text-gray-800">{stats.familyPreservation}</p>
          <p className="mt-1 text-[11px] text-gray-400">April 2026</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <p className="text-xs text-gray-500">Child Abuse Cases</p>
            <span className="text-lg text-gray-400">🛡️</span>
          </div>
          <p className="mt-1.5 text-2xl font-medium text-gray-800">{stats.childAbuse}</p>
          <p className="mt-1 text-[11px] text-gray-400">Reported this month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <p className="text-xs text-gray-500">Foster Care Orders</p>
            <span className="text-lg text-gray-400">❤️</span>
          </div>
          <p className="mt-1.5 text-2xl font-medium text-gray-800">{stats.fosterCare}</p>
          <p className="mt-1 text-[11px] text-gray-400">Valid & active</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <p className="text-xs text-gray-500">Forms Captured</p>
            <span className="text-lg text-gray-400">✅</span>
          </div>
          <p className="mt-1.5 text-2xl font-medium text-gray-800">{stats.totalForms}</p>
          <p className="mt-1 text-[11px] text-gray-400">Pixley Ka Seme</p>
        </div>
      </div>

      {/* Table or Comments View */}
      {activeTab === 'comments' ? (
        <CommentsView entries={entries} />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-800">Recent form captures</h4>
            <button className="rounded-md border px-2.5 py-1 text-xs hover:bg-gray-50">View all</button>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-2.5 text-left">Date</th>
                  <th className="px-4 py-2.5 text-left">Indicator / Comment</th>
                  <th className="px-4 py-2.5 text-left">Added by</th>
                  <th className="px-4 py-2.5 text-left">Role</th>
                  <th className="px-4 py-2.5 text-left">Location</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries().map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => onEntryClick(entry)}>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{entry.date}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-800">{entry.indicator}</td>
                    <td className="px-4 py-2.5 text-sm">{entry.addedBy}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{entry.role}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{entry.location}</td>
                    <td className="px-4 py-2.5">{statusBadge(entry.status)}</td>
                  </tr>
                ))}
                {filteredEntries().length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">No entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}