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
import ConfirmModal from './components/ConfirmModal';
import { DataProvider, useData } from './context/DataContext';   // import useData
import { SCREEN_TITLES } from './constants/index';

function AppInner() {   // new wrapper to access context
  const [screen, setScreen] = useState('dashboard');
  const [editingEntry, setEditingEntry] = useState(null);
  const [formDirty, setFormDirty] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [pendingNav, setPendingNav] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { setFilter, clearFilter } = useData();   // get filter functions from context

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const navigateTo = useCallback(
    (id, entry = null) => {
      if (screen === 'form' && formDirty && id !== 'form') {
        setPendingNav({ id, entry });
        return;
      }
      doNavigate(id, entry);
      closeSidebar();
    },
    [screen, formDirty]
  );

  const doNavigate = (id, entry = null) => {
    setScreen(id);
    setFormDirty(false);
    setPendingNav(null);
    if (id === 'form') setEditingEntry(entry);
    else setEditingEntry(null);
  };

  const handleModalConfirm = () => {
    if (pendingNav) doNavigate(pendingNav.id, pendingNav.entry);
  };
  const handleModalCancel = () => setPendingNav(null);
  const handleEntryClick = (entry) => navigateTo('form', entry);
  const handleChatPrefill = (data) => setPrefillData(data);
  const handleOpenForm = () => {
    setScreen('form');
    setEditingEntry(null);
    setFormDirty(false);
  };

  // Quick filter from dashboard cards
  const handleQuickFilter = (status) => {
    clearFilter();                         // remove any previous filters
    if (status && status !== 'all') {
      setFilter(prev => ({ ...prev, status }));   // set only status filter
    }
    setScreen('capture');
  };

  const [pageTitle, breadcrumb] = SCREEN_TITLES[screen] || ['', ''];

  return (
    <div className="flex h-screen min-h-[700px] bg-gray-50 text-sm overflow-hidden">
      <Sidebar activeScreen={screen} onNavigate={navigateTo} isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar
          pageTitle={pageTitle}
          breadcrumb={breadcrumb}
          onNewEntry={() => navigateTo('form')}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
              onBack={() => { setPrefillData(null); navigateTo('capture'); }}
              onDirty={() => setFormDirty(true)}
            />
          )}
          {screen === 'inbox' && <InboxView onEntryClick={handleEntryClick} />}
          {screen === 'comments' && <CommentsScreen />}
          {screen === 'dashboard' && (
            <DashboardView
              onEntryClick={handleEntryClick}
              onQuickFilter={handleQuickFilter}
            />
          )}
          {screen === 'reports' && <ReportsView />}
        </div>
      </div>

      <ChatAssistant onFillForm={handleChatPrefill} onOpenForm={handleOpenForm} />
      <ConfirmModal
        isOpen={!!pendingNav}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        title="You have unsaved changes"
        message="Leave anyway? Your draft will be saved automatically."
      />
    </div>
  );
}

// Wrap with DataProvider so context is available
export default function App() {
  return (
    <DataProvider>
      <AppInner />
    </DataProvider>
  );
}