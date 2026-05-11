import {
  LayoutDashboard,
  ClipboardList,
  Inbox,
  BarChart3,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Sidebar({ activeScreen, onNavigate }) {
  const { role } = useData();

  const officerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'capture', label: 'Form Capture', icon: ClipboardList },
    { id: 'inbox', label: 'Form Inbox', icon: Inbox },
  ];

  const supervisorNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Form Inbox', icon: Inbox },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
  ];

  const navItems = role === 'supervisor' ? supervisorNav : officerNav;

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
          <div className="text-[11px] text-gray-500">
            {role === 'officer' ? 'Social Info Officer' : 'Supervisor'}
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        <div className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-wider text-gray-400">
          Main
        </div>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors hover:bg-gray-100 ${
              activeScreen === id
                ? 'bg-emerald-50 font-medium text-emerald-700'
                : 'text-gray-600'
            }`}
          >
            <Icon size={16} className="text-current" />
            {label}
          </button>
        ))}
        <div className="px-2 pb-1 pt-4 text-[10px] uppercase tracking-wider text-gray-400">
          Support
        </div>
        <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-100">
          <HelpCircle size={16} />
          Help
        </button>
      </nav>
    </aside>
  );
}