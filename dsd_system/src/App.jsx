import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import CaptureView from './components/CaptureView';
import FormEntryView from './components/FormEntryView';
import InboxView from './components/InboxView';
import DashboardView from './components/DashboardView';
import ReportsView from './components/ReportsView';
import ChatAssistant from './components/ChatAssistant';
import CommentsScreen from './components/CommentsScreen';
import { DataProvider } from './context/DataContext';
import { SCREEN_TITLES } from './constants/index';

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [editingEntry, setEditingEntry] = useState(null);
  const [formDirty, setFormDirty] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const navigateTo = useCallback(
    (id, entry = null) => {
      if (screen === 'form' && formDirty && id !== 'form') {
        const confirmed = window.confirm(
          'You have unsaved changes. Leave anyway? Your draft will be saved.'
        );
        if (!confirmed) return;
      }
      setScreen(id);
      setFormDirty(false);
      if (id === 'form') setEditingEntry(entry);
      else setEditingEntry(null);
    },
    [screen, formDirty]
  );

  const handleEntryClick = (entry) => navigateTo('form', entry);

  const handleChatPrefill = (data) => {
    setPrefillData(data);
  };

  const handleOpenForm = () => {
    setScreen('form');
    setEditingEntry(null);
    setFormDirty(false);
  };

  const [pageTitle, breadcrumb] = SCREEN_TITLES[screen] || ['', ''];

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
                prefillData={prefillData}
                onBack={() => {
                  setPrefillData(null);
                  navigateTo('capture');
                }}
                onDirty={() => setFormDirty(true)}
              />
            )}
            {screen === 'inbox' && <InboxView onEntryClick={handleEntryClick} />}
            {screen === 'comments' && <CommentsScreen />}  {/* now works */}
            {screen === 'dashboard' && <DashboardView onEntryClick={handleEntryClick} />}
            {screen === 'reports' && <ReportsView />}
          </div>
        </div>
      </div>

      <ChatAssistant
        onFillForm={handleChatPrefill}
        onOpenForm={handleOpenForm}
      />
    </DataProvider>
  );
}