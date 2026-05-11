import { useState } from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'capture', label: 'Form Capture', icon: '📝' },
  { id: 'inbox', label: 'Form Inbox', icon: '📥' },
  { id: 'reports', label: 'Reports', icon: '📈' },
];

export default function Sidebar({ activeScreen, onNavigate }) {
  return (
    <aside className="w-55 flex flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-5">
        <h1 className="text-[13px] font-medium leading-tight text-gray-800">
          Electronic Monitoring<br />& Evaluation
        </h1>
        <p className="mt-0.5 text-[11px] text-gray-500">DSD — eme.dsd.gov.za</p>
      </div>

      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700">
          VS
        </div>
        <div>
          <div className="text-[13px] font-medium text-gray-800">Velile Sean</div>
          <div className="text-[11px] text-gray-500">Social Info Officer</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        <div className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-wider text-gray-400">
          Main
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors hover:bg-gray-100 ${
              activeScreen === item.id
                ? 'bg-emerald-50 font-medium text-emerald-700'
                : 'text-gray-600'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="px-2 pb-1 pt-4 text-[10px] uppercase tracking-wider text-gray-400">
          Support
        </div>
        <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-100">
          <span className="text-base">❓</span> Help
        </button>
      </nav>
    </aside>
  );
}