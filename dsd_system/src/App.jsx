import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import CaptureView from './components/CaptureView';
import FormEntryView from './components/FormEntryView';
import InboxView from './components/InboxView';
import DashboardView from './components/DashboardView';
import ReportsView from './components/ReportsView';
import { DataProvider } from './context/DataContext';

const screenTitles = {
  dashboard: ['Dashboard', 'Overview'],
  capture: ['Form Capture', 'Prieska Siya-Themba · April 2026'],
  form: ['New Entry', 'Step 2 of 3 — Participant breakdown'],
  inbox: ['Form Inbox', 'Submitted forms'],
  reports: ['Reports', 'Analytics & exports'],
};

export default function App() {
  const [screen, setScreen] = useState('dashboard');  // start on dashboard now
  const [editingEntry, setEditingEntry] = useState(null);

  const navigateTo = (id, entry = null) => {
    setScreen(id);
    if (id === 'form') setEditingEntry(entry);
    else setEditingEntry(null);
  };

  const handleEntryClick = (entry) => navigateTo('form', entry);

  const [pageTitle, breadcrumb] = screenTitles[screen] || ['', ''];

  return (
    <DataProvider>
      <div className="flex h-screen min-h-[700px] bg-gray-50 text-sm">
        <Sidebar activeScreen={screen} onNavigate={navigateTo} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar
            pageTitle={pageTitle}
            breadcrumb={breadcrumb}
            onNewEntry={() => navigateTo('form')}
          />
          <div className="flex-1 overflow-y-auto p-6">
            {screen === 'capture' && (
              <CaptureView
                onNewEntry={() => navigateTo('form')}
                onEntryClick={handleEntryClick}
              />
            )}
            {screen === 'form' && (
              <FormEntryView
                entry={editingEntry}
                onBack={() => navigateTo('capture')}
              />
            )}
            {screen === 'inbox' && <InboxView />}
            {screen === 'dashboard' && <DashboardView onEntryClick={handleEntryClick} />}
            {screen === 'reports' && <ReportsView />}
          </div>
        </div>
      </div>
    </DataProvider>
  );
}