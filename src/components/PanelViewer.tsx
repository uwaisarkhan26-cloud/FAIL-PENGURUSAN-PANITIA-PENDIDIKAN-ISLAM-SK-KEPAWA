import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Star,
  Check,
  RotateCw,
  FolderOpen,
  FolderKanban,
  Link2,
} from 'lucide-react';
import { FileItem, PanelCategory, PanelMeta } from '../types';
import { PANELS_METADATA } from '../data/initialData';
import { QuickDriveLinkModal } from './QuickDriveLinkModal';

interface PanelViewerProps {
  activeCategory: PanelCategory | 'all';
  items: FileItem[];
  panitiaDriveUrl?: string;
  onAddItem: (category?: PanelCategory) => void;
  onEditItem: (item: FileItem) => void;
  onDeleteItem: (itemId: string) => void;
  onQuickToggleStatus: (itemId: string, newStatus: 'ADA' | 'TIADA' | 'TB') => void;
  onSelectCategory: (category: PanelCategory | 'all') => void;
  onViewDocument: (item: FileItem) => void;
  onUpdateItemLink?: (itemId: string, newUrl: string) => void;
}

export const PanelViewer: React.FC<PanelViewerProps> = ({
  activeCategory,
  items,
  panitiaDriveUrl = 'https://drive.google.com/drive',
  onAddItem,
  onEditItem,
  onDeleteItem,
  onQuickToggleStatus,
  onSelectCategory,
  onViewDocument,
  onUpdateItemLink,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ADA' | 'TIADA' | 'TB'>('ALL');
  const [activeDriveModalItem, setActiveDriveModalItem] = useState<FileItem | null>(null);

  const currentPanelMeta: PanelMeta | undefined = PANELS_METADATA.find(
    (p) => p.key === activeCategory
  );

  // Filter items
  const filteredItems = items.filter((item) => {
    // Category match
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    // Status match
    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }
    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.itemCode.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchNotes && !matchDesc) {
        return false;
      }
    }
    return true;
  });

  // Calculate statistics for active view
  const relevantItems =
    activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory);
  const adaCount = relevantItems.filter((i) => i.status === 'ADA').length;
  const tiadaCount = relevantItems.filter((i) => i.status === 'TIADA').length;
  const tbCount = relevantItems.filter((i) => i.status === 'TB').length;
  const completionPercentage =
    relevantItems.length > 0
      ? Math.round((adaCount / (relevantItems.length - tbCount || relevantItems.length)) * 100)
      : 100;

  return (
    <div className="space-y-6">
      {/* Category Tabs Header - Merah Hati & Gold Navigation */}
      <div className="bg-gradient-to-r from-[#3B070A] via-[#4D090E] to-[#250305] rounded-2xl p-2 sm:p-3 shadow-xl border-2 border-amber-400/50">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm font-bold scrollbar-thin">
          <button
            id="tab-panel-all"
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg'
                : 'text-amber-100/90 hover:bg-black/50 hover:text-amber-300'
            }`}
          >
            <FolderOpen className={`w-4 h-4 ${activeCategory === 'all' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>Semua Panel (Fail 1-6)</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeCategory === 'all' ? 'bg-black text-amber-300' : 'bg-black/60 text-amber-300 border border-amber-400/30'
              }`}
            >
              {items.length}
            </span>
          </button>

          {PANELS_METADATA.map((panel) => {
            const isActive = activeCategory === panel.key;
            const panelItems = items.filter((i) => i.category === panel.key);
            const panelAda = panelItems.filter((i) => i.status === 'ADA').length;

            return (
              <button
                key={panel.key}
                id={`tab-panel-${panel.key}`}
                onClick={() => onSelectCategory(panel.key)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg'
                    : 'text-amber-100/90 hover:bg-black/50 hover:text-amber-300'
                }`}
              >
                <span className="font-mono text-xs font-black uppercase tracking-wider">{panel.code}</span>
                <span className="hidden md:inline">{panel.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-black text-amber-300' : 'bg-black/60 text-amber-200 border border-amber-400/30'
                  }`}
                >
                  {panelAda}/{panelItems.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Panel Metadata Card - Maroon & Gold */}
      {currentPanelMeta && (
        <div className="bg-gradient-to-r from-[#4A080B] via-[#650E13] to-[#2E0507] border-2 border-amber-500/40 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-black bg-black text-amber-300 border border-amber-500/50 shadow-inner">
                  {currentPanelMeta.code}
                </span>
                <span className="text-xs font-bold text-amber-200 bg-white/10 px-2.5 py-0.5 rounded-md">
                  Standard SKPM: {currentPanelMeta.standardSKPM}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentPanelMeta.name}</h2>
              <p className="text-xs text-amber-100/90 max-w-3xl leading-relaxed">{currentPanelMeta.description}</p>
            </div>

            {/* Progress Gauge */}
            <div className="flex items-center gap-4 shrink-0 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-amber-500/40 shadow-inner">
              <div className="text-right">
                <div className="text-2xl font-black text-amber-400">{completionPercentage}%</div>
                <div className="text-[10px] font-bold text-amber-200/80 uppercase">Tahap Kepatuhan</div>
              </div>
              <div className="w-13 h-13 rounded-full border-4 border-amber-400 flex items-center justify-center font-black text-xs text-white bg-black/80 shadow-md">
                {adaCount}/{relevantItems.length - tbCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Actions Bar - Merah Hati & Gold */}
      <div className="bg-gradient-to-r from-[#3B070A] via-[#4D090E] to-[#250305] rounded-2xl p-4 shadow-xl border-2 border-amber-400/50 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-items"
            type="text"
            placeholder="Cari item, kod, fail, atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-black/60 border border-amber-400/40 text-amber-100 placeholder-amber-200/50 rounded-xl focus:bg-black focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        {/* Filters and Tambah Button */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl text-xs font-bold border border-amber-400/40">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'ALL' ? 'bg-amber-400 shadow-md text-slate-950 font-black' : 'text-amber-100/80 hover:text-white'
              }`}
            >
              Semua ({relevantItems.length})
            </button>
            <button
              onClick={() => setStatusFilter('ADA')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'ADA' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'text-amber-100/80 hover:text-white'
              }`}
            >
              Ada ({adaCount})
            </button>
            <button
              onClick={() => setStatusFilter('TIADA')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'TIADA' ? 'bg-rose-700 text-white font-black shadow-sm' : 'text-amber-100/80 hover:text-white'
              }`}
            >
              Tiada ({tiadaCount})
            </button>
            <button
              onClick={() => setStatusFilter('TB')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'TB' ? 'bg-amber-600 text-white font-black shadow-sm' : 'text-amber-100/80 hover:text-white'
              }`}
            >
              TB ({tbCount})
            </button>
          </div>

          {/* Master Panitia Google Drive Link Button */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              id="btn-open-master-drive"
              href={panitiaDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 hover:from-emerald-600 hover:to-teal-700 text-white border border-emerald-400/50 rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition group active:scale-95 cursor-pointer"
              title="Buka Folder Google Drive Utama Panitia Pendidikan Islam SK Kepawa"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" fill="none">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00ac47"/>
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
              <span>Buka Google Drive Panitia</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-bold uppercase tracking-wider">
                Aktif
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <button
            id="btn-add-item-panel"
            onClick={() => onAddItem(activeCategory === 'all' ? undefined : activeCategory)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border border-amber-400 rounded-xl text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition transform active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Tambah Dokumen / Item
          </button>
        </div>
      </div>

      {/* Items Table / Cards - Merah Hati & Gold */}
      <div className="bg-gradient-to-b from-[#2B0508] via-[#1E0305] to-[#120102] rounded-2xl shadow-2xl border-2 border-amber-400/50 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Tiada item dijumpai</h4>
            <p className="text-xs text-amber-200/70 mt-1">
              Cuba tukar kata kunci carian atau tetapan tapisan status di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-black text-amber-300 border-b-2 border-amber-400/50 font-black uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-3 w-16 text-center">KOD</th>
                  <th className="py-3.5 px-4">ITEM / DOKUMEN</th>
                  <th className="py-3.5 px-4 w-52 text-center">STATUS SELIA BANTU</th>
                  <th className="py-3.5 px-4 min-w-[200px]">CATATAN / TINDAKAN</th>
                  <th className="py-3.5 px-3 w-32 text-center">KEMASKINI</th>
                  <th className="py-3.5 px-3 w-36 text-center">TINDAKAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-400/20">
                {filteredItems.map((item) => {
                  const panelInfo = PANELS_METADATA.find((p) => p.key === item.category);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#45090E]/60 transition-colors group bg-black/30"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-3 text-center align-top">
                        <span className="font-mono font-black text-xs bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md shadow-sm">
                          {item.itemCode}
                        </span>
                        {item.isImportant && (
                          <span
                            title="Dokumen Standard Kualiti Utama"
                            className="inline-block mt-1 text-amber-300 font-bold"
                          >
                            ★
                          </span>
                        )}
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-white text-sm group-hover:text-amber-200">
                              {item.title}
                            </span>
                            {activeCategory === 'all' && panelInfo && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${panelInfo.badgeBg}`}
                              >
                                {panelInfo.code}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-amber-100/80 leading-relaxed">
                              {item.description}
                            </p>
                          )}

                          {/* Active Google Drive / Document Buttons */}
                          <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                            {item.documentUrl ? (
                              <div className="inline-flex items-center gap-1.5">
                                <a
                                  id={`btn-drive-link-${item.id}`}
                                  href={item.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-black shadow-xs hover:shadow-md transition transform active:scale-95 group/link cursor-pointer border border-emerald-400/40"
                                  title="Pautan Google Drive Aktif! Klik untuk buka dokumen fail atau folder ini dalam tab baru"
                                >
                                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" fill="none">
                                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                                    <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00ac47"/>
                                    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                                    <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                                    <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                                  </svg>
                                  <span>Buka Google Drive</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                  <ExternalLink className="w-3 h-3 text-emerald-200 group-hover/link:translate-x-0.5 transition-transform" />
                                </a>

                                <button
                                  type="button"
                                  id={`btn-edit-drive-${item.id}`}
                                  onClick={() => setActiveDriveModalItem(item)}
                                  className="p-1.5 text-amber-200 hover:text-white hover:bg-black/60 rounded-md transition border border-amber-400/30"
                                  title="Tukar / Kemaskini Pautan Google Drive"
                                >
                                  <Edit className="w-3.5 h-3.5 text-amber-300" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                id={`btn-add-drive-${item.id}`}
                                onClick={() => setActiveDriveModalItem(item)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/60 rounded-lg text-xs font-bold shadow-2xs hover:shadow transition transform active:scale-95 cursor-pointer"
                                title="Klik untuk pautkan dokumen fail atau folder Google Drive bagi item ini"
                              >
                                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" fill="none">
                                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                                  <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00ac47"/>
                                  <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                                  <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                                  <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                                </svg>
                                <span>+ Pautkan Google Drive</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quick Status Toggle Buttons */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <div className="inline-flex rounded-lg border border-amber-400/40 p-0.5 bg-black/60 shadow-inner">
                          <button
                            id={`btn-status-ada-${item.id}`}
                            title="Tanda ADA"
                            onClick={() => onQuickToggleStatus(item.id, 'ADA')}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                              item.status === 'ADA'
                                ? 'bg-emerald-600 text-white shadow-sm font-black'
                                : 'text-amber-100/70 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ADA
                          </button>
                          <button
                            id={`btn-status-tiada-${item.id}`}
                            title="Tanda TIADA"
                            onClick={() => onQuickToggleStatus(item.id, 'TIADA')}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                              item.status === 'TIADA'
                                ? 'bg-rose-700 text-white shadow-sm font-black'
                                : 'text-amber-100/70 hover:text-white'
                            }`}
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            TIADA
                          </button>
                          <button
                            id={`btn-status-tb-${item.id}`}
                            title="Tanda TB"
                            onClick={() => onQuickToggleStatus(item.id, 'TB')}
                            className={`px-2 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                              item.status === 'TB'
                                ? 'bg-amber-600 text-white shadow-sm font-black'
                                : 'text-amber-100/70 hover:text-white'
                            }`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            TB
                          </button>
                        </div>
                      </td>

                      {/* Notes / Catatan */}
                      <td className="py-3.5 px-4 align-top text-xs text-amber-100">
                        <div className="bg-black/60 border border-amber-400/30 rounded-lg p-2 leading-relaxed">
                          {item.notes ? (
                            <span>{item.notes}</span>
                          ) : (
                            <span className="italic text-amber-200/50">Tiada catatan khas.</span>
                          )}
                        </div>
                      </td>

                      {/* Updated date / Verifier */}
                      <td className="py-3.5 px-3 align-top text-center text-xs text-amber-200/80">
                        <div className="font-bold text-amber-300">{item.updatedAt}</div>
                        {item.verifiedBy && (
                          <div className="text-[10px] text-amber-200/70 mt-0.5 truncate max-w-[120px] mx-auto font-medium" title={item.verifiedBy}>
                            {item.verifiedBy}
                          </div>
                        )}
                      </td>

                      {/* Actions: Drive, Edit, Delete, View - Fully Active Buttons */}
                      <td className="py-3.5 px-3 align-top text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Dedicated Action Drive Button */}
                          <button
                            id={`btn-col-drive-${item.id}`}
                            title={item.documentUrl ? "Buka Pautan Google Drive" : "Pautkan Dokumen Google Drive"}
                            onClick={() => {
                              if (item.documentUrl) {
                                window.open(item.documentUrl, '_blank', 'noopener,noreferrer');
                              } else {
                                setActiveDriveModalItem(item);
                              }
                            }}
                            className={`p-1.5 rounded-lg transition border cursor-pointer ${
                              item.documentUrl
                                ? 'text-emerald-300 bg-black/60 hover:bg-emerald-950/80 border-emerald-400/50 shadow-sm'
                                : 'text-amber-300 bg-black/60 hover:bg-amber-950/80 border-amber-400/50 shadow-sm'
                            }`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            id={`btn-view-doc-${item.id}`}
                            title="Lihat Format Contoh"
                            onClick={() => onViewDocument(item)}
                            className="p-1.5 text-amber-300 bg-black/60 hover:bg-amber-950/80 rounded-lg transition border border-amber-400/50 cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-edit-item-${item.id}`}
                            title="Kemaskini / Edit Item"
                            onClick={() => onEditItem(item)}
                            className="p-1.5 text-sky-300 bg-black/60 hover:bg-sky-950/80 rounded-lg transition border border-sky-400/50 cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-item-${item.id}`}
                            title="Padam Item"
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 text-rose-300 bg-black/60 hover:bg-rose-950/80 rounded-lg transition border border-rose-400/50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Google Drive Link Modal */}
      <QuickDriveLinkModal
        isOpen={!!activeDriveModalItem}
        item={activeDriveModalItem}
        panitiaDriveUrl={panitiaDriveUrl}
        onClose={() => setActiveDriveModalItem(null)}
        onSaveLink={(itemId, newUrl) => {
          if (onUpdateItemLink) {
            onUpdateItemLink(itemId, newUrl);
          }
        }}
      />
    </div>
  );
};
