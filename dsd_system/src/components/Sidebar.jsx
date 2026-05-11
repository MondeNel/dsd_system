import {
  LayoutDashboard,
  ClipboardList,
  Inbox,
  BarChart3,
  HelpCircle,
  MessageSquare,
  X,
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Sidebar({ activeScreen, onNavigate, isOpen, onClose }) {
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
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 dark-glass flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:z-auto
        `}
      >
        {/* Close button (mobile only) */}
        <div className="lg:hidden absolute top-2 right-2">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70">
            <X size={18} />
          </button>
        </div>

        {/* Logo */}
        <div className="border-b border-white/10 px-4 py-5">
          <h1 className="text-[13px] font-semibold leading-tight text-white">
            Electronic Monitoring
            <br />& Evaluation
          </h1>
          <p className="mt-0.5 text-[11px] text-indigo-200/80">DSD — eme.dsd.gov.za</p>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-semibold text-white">
            VS
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-white">Velile Sean</div>
            <div className="text-[11px] text-indigo-200/70">
              {role === 'officer' ? 'Social Info Officer' : 'Supervisor'}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-200/50">
            Main
          </p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all ${
                activeScreen === id
                  ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-indigo-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </button>
          ))}
          <p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-indigo-200/50">
            Support
          </p>
          <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-indigo-100/70 transition-all hover:bg-white/5 hover:text-white">
            <HelpCircle size={16} className="flex-shrink-0" />
            Help
          </button>
        </nav>
      </aside>
    </>
  );
}