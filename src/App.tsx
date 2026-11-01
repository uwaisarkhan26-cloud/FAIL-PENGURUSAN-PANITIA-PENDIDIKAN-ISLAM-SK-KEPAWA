/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_ITEMS,
  INITIAL_SCHOOL_PROFILE,
  INITIAL_MONITORING_SESSIONS,
} from './data/initialData';
import { FileItem, PanelCategory, SchoolProfile, MonitoringSession } from './types';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { PanelViewer } from './components/PanelViewer';
import { MonitoringReportView } from './components/MonitoringReportView';
import { OfficialInstrumentPrintView } from './components/OfficialInstrumentPrintView';
import { ItemModal } from './components/ItemModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { ShareModal } from './components/ShareModal';
import { UrlDirectoryModal } from './components/UrlDirectoryModal';

const STORAGE_KEYS = {
  ITEMS: 'sk_kepawa_panitia_items_v3',
  PROFILE: 'sk_kepawa_panitia_profile_v3',
  SESSIONS: 'sk_kepawa_panitia_sessions_v3',
};

export default function App() {
  // Load initial states from localStorage with fallbacks
  const [items, setItems] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (saved) {
      try {
        const parsed: FileItem[] = JSON.parse(saved);
        // Merge active documentUrls from INITIAL_ITEMS if stored item has none
        return parsed.map((item) => {
          const initial = INITIAL_ITEMS.find((init) => init.id === item.id);
          const initialUrl = initial?.documentUrl || '';
          return {
            ...item,
            documentUrl:
              item.documentUrl && item.documentUrl.trim() !== ''
                ? item.documentUrl
                : initialUrl,
          };
        });
      } catch (e) {
        console.error('Error parsing stored items', e);
      }
    }
    return INITIAL_ITEMS;
  });

  const [profile, setProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SCHOOL_PROFILE,
          ...parsed,
          customLogoUrl:
            parsed.customLogoUrl && parsed.customLogoUrl.trim() !== ''
              ? parsed.customLogoUrl
              : '/assets/logo_sk_kepawa.png',
          panitiaDriveUrl:
            parsed.panitiaDriveUrl &&
            parsed.panitiaDriveUrl.trim() !== '' &&
            parsed.panitiaDriveUrl !== 'https://drive.google.com/drive'
              ? parsed.panitiaDriveUrl
              : INITIAL_SCHOOL_PROFILE.panitiaDriveUrl,
          academicYear: parsed.academicYear && parsed.academicYear.includes('2026') ? parsed.academicYear : '2026',
          schoolCode: parsed.schoolCode === 'XBA6012' ? 'XBA6019' : (parsed.schoolCode || 'XBA6019'),
          headOfPanitiaPhone:
            !parsed.headOfPanitiaPhone || parsed.headOfPanitiaPhone.trim() === ''
              ? '087 - 221980'
              : parsed.headOfPanitiaPhone,
          guruBesarName: parsed.guruBesarName || INITIAL_SCHOOL_PROFILE.guruBesarName,
          pkPentadbiranName: parsed.pkPentadbiranName || INITIAL_SCHOOL_PROFILE.pkPentadbiranName,
          headOfPanitiaName: parsed.headOfPanitiaName || INITIAL_SCHOOL_PROFILE.headOfPanitiaName,
        };
      } catch (e) {
        console.error('Error parsing stored profile', e);
      }
    }
    return INITIAL_SCHOOL_PROFILE;
  });

  const [monitoringSessions, setMonitoringSessions] = useState<MonitoringSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored sessions', e);
      }
    }
    return INITIAL_MONITORING_SESSIONS;
  });

  // Navigation states
  const [activeView, setActiveView] = useState<
    'dashboard' | 'panels' | 'monitoring' | 'official_print'
  >('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<PanelCategory | 'all'>('all');

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FileItem | null>(null);
  const [defaultCategoryForAdd, setDefaultCategoryForAdd] = useState<PanelCategory>('pengurusan_am');

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [previewingItem, setPreviewingItem] = useState<FileItem | null>(null);
  const [printSession, setPrintSession] = useState<MonitoringSession | null>(null);

  const handleUpdatePanitiaDriveUrl = (newUrl: string) => {
    setProfile((prev) => ({
      ...prev,
      panitiaDriveUrl: newUrl,
    }));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(monitoringSessions));
  }, [monitoringSessions]);

  // CRUD Handlers
  const handleOpenAddItem = (cat?: PanelCategory) => {
    setEditingItem(null);
    setDefaultCategoryForAdd(cat || (selectedCategory === 'all' ? 'pengurusan_am' : selectedCategory));
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: FileItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<FileItem>) => {
    if (editingItem) {
      // Edit
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? ({ ...i, ...itemData } as FileItem) : i))
      );
    } else {
      // Create
      const newItem: FileItem = {
        id: `item-${Date.now()}`,
        category: itemData.category || 'pengurusan_am',
        itemCode: itemData.itemCode || '1.12',
        title: itemData.title || 'Dokumen Baru',
        description: itemData.description || '',
        status: itemData.status || 'ADA',
        notes: itemData.notes || '',
        documentUrl: itemData.documentUrl || '',
        updatedAt: itemData.updatedAt || new Date().toISOString().split('T')[0],
        verifiedBy: itemData.verifiedBy || profile.headOfPanitiaName,
        isImportant: itemData.isImportant || false,
      };
      setItems((prev) => [...prev, newItem]);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const itemToDelete = items.find((i) => i.id === itemId);
    if (!itemToDelete) return;
    if (
      window.confirm(
        `Adakah anda pasti ingin memadam dokumen "${itemToDelete.itemCode} - ${itemToDelete.title}"?`
      )
    ) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  const handleQuickToggleStatus = (itemId: string, newStatus: 'ADA' | 'TIADA' | 'TB') => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: newStatus,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : i
      )
    );
  };

  // Monitoring sessions handlers
  const handleAddMonitoringSession = (newSession: MonitoringSession) => {
    setMonitoringSessions((prev) => [newSession, ...prev]);
  };

  const handleUpdateMonitoringSession = (updatedSession: MonitoringSession) => {
    setMonitoringSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
  };

  const handleDeleteMonitoringSession = (sessionId: string) => {
    setMonitoringSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // Quick direct update for an item's Google Drive URL
  const handleUpdateItemLink = (itemId: string, newUrl: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              documentUrl: newUrl,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );
  };

  const handleSelectCategoryFromNav = (cat: PanelCategory | 'all') => {
    setSelectedCategory(cat);
    setActiveView('panels');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Logo upload handler
  const handleUploadLogo = (logoUrl: string) => {
    setProfile((prev) => ({
      ...prev,
      customLogoUrl: logoUrl,
      logoChoice: 'sk_kepawa',
    }));
  };

  // Quick Logo toggle between SK Kepawa and Jata Negara
  const handleToggleLogoChoice = (choice: 'sk_kepawa' | 'jata_negara') => {
    setProfile((prev) => ({
      ...prev,
      logoChoice: choice,
    }));
  };

  // Export Data backup
  const handleExportData = () => {
    const backupData = {
      profile,
      items,
      monitoringSessions,
      exportedAt: new Date().toISOString(),
      appName: 'Sistem Fail Pengurusan Pendidikan Islam SK Kepawa',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SK_KEPAWA_FAIL_PENDIDIKAN_ISLAM_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to initial defaults
  const handleResetData = () => {
    if (
      window.confirm(
        'Adakah anda pasti ingin menetapkan semula semua data kepada data contoh rasmi SK Kepawa? Sebarang perubahan data semasa akan diganti.'
      )
    ) {
      setItems(INITIAL_ITEMS);
      setProfile(INITIAL_SCHOOL_PROFILE);
      setMonitoringSessions(INITIAL_MONITORING_SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.ITEMS);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      alert('Data telah berjaya ditetapkan semula.');
    }
  };

  const handlePrintSession = (session?: MonitoringSession) => {
    setPrintSession(session || null);
    setActiveView('official_print');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#280508] via-[#1A0305] to-[#0E0102] text-amber-50 flex flex-col font-sans">
      {/* If view is official print, render full print container */}
      {activeView === 'official_print' ? (
        <OfficialInstrumentPrintView
          profile={profile}
          items={items}
          monitoringSession={printSession}
          onBack={() => setActiveView('monitoring')}
        />
      ) : (
        <>
          {/* Main Navigation Header - Maroon, Gold & Black */}
          <Header
            profile={profile}
            activeView={activeView}
            selectedCategory={selectedCategory}
            onNavigate={(view) => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenUrlModal={() => setIsUrlModalOpen(true)}
            onExportData={handleExportData}
            onResetData={handleResetData}
          />

          {/* Main Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {activeView === 'dashboard' && (
              <DashboardOverview
                items={items}
                profile={profile}
                sessions={monitoringSessions}
                onSelectCategory={(cat) => handleSelectCategoryFromNav(cat)}
                onAddItem={() => handleOpenAddItem()}
                onOpenMonitoring={() => {
                  setActiveView('monitoring');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onPrintOfficial={() => handlePrintSession()}
                onOpenShare={() => setIsShareModalOpen(true)}
              />
            )}

            {activeView === 'panels' && (
              <PanelViewer
                activeCategory={selectedCategory}
                items={items}
                panitiaDriveUrl={profile.panitiaDriveUrl}
                onAddItem={(cat) => handleOpenAddItem(cat)}
                onEditItem={handleOpenEditItem}
                onDeleteItem={handleDeleteItem}
                onQuickToggleStatus={handleQuickToggleStatus}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                onViewDocument={(item) => setPreviewingItem(item)}
                onUpdateItemLink={handleUpdateItemLink}
              />
            )}

            {activeView === 'monitoring' && (
              <MonitoringReportView
                sessions={monitoringSessions}
                profile={profile}
                items={items}
                onAddSession={handleAddMonitoringSession}
                onUpdateSession={handleUpdateMonitoringSession}
                onDeleteSession={handleDeleteMonitoringSession}
                onPrintOfficial={(session) => handlePrintSession(session)}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="bg-black text-amber-100/80 border-t-2 border-amber-500/40 py-6 text-center text-xs">
            <div className="max-w-7xl mx-auto px-4 space-y-1.5">
              <p className="font-bold text-amber-300 tracking-wide">
                {profile.schoolName} ({profile.schoolCode}) • {profile.panitiaName}
              </p>
              <p className="text-amber-100/70">
                Instrumen Selia Bantu Pengurusan Fail Panitia Mata Pelajaran Sektor Pembelajaran, Jabatan Pendidikan Negeri Sabah.
              </p>
              <p className="text-[11px] text-amber-200/50">
                Pematuhan Standard 3.1.1 (Pengurusan Panitia) dalam SKPM Kualiti@Sekolah.
              </p>
            </div>
          </footer>

          {/* Item Add/Edit Modal */}
          <ItemModal
            isOpen={isItemModalOpen}
            onClose={() => setIsItemModalOpen(false)}
            onSave={handleSaveItem}
            editingItem={editingItem}
            defaultCategory={defaultCategoryForAdd}
            defaultVerifier={profile.headOfPanitiaName}
          />

          {/* School & Logo Settings Modal */}
          <SchoolSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            profile={profile}
            onSave={(updated) => setProfile(updated)}
          />

          {/* Document Format & Sample Preview Modal */}
          <DocumentPreviewModal
            isOpen={!!previewingItem}
            onClose={() => setPreviewingItem(null)}
            item={previewingItem}
            profile={profile}
          />

          {/* Share System Link Modal */}
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            profile={profile}
          />

          {/* Panel Alamat URL & Directory Modal */}
          <UrlDirectoryModal
            isOpen={isUrlModalOpen}
            onClose={() => setIsUrlModalOpen(false)}
            items={items}
            profile={profile}
            onUpdateItemLink={handleUpdateItemLink}
            onUpdatePanitiaDriveUrl={handleUpdatePanitiaDriveUrl}
            onEditItem={handleOpenEditItem}
          />
        </>
      )}
    </div>
  );
}
