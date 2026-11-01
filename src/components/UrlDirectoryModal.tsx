import React, { useState } from 'react';
import { X, ExternalLink, Link2, Search, Check, Globe, FolderOpen, Edit, Copy, ShieldCheck } from 'lucide-react';
import { FileItem, PanelCategory, SchoolProfile } from '../types';
import { PANELS_METADATA } from '../data/initialData';

interface UrlDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: FileItem[];
  profile: SchoolProfile;
  onUpdateItemLink: (itemId: string, newUrl: string) => void;
  onUpdatePanitiaDriveUrl: (newUrl: string) => void;
  onEditItem: (item: FileItem) => void;
}

export const UrlDirectoryModal: React.FC<UrlDirectoryModalProps> = ({
  isOpen,
  onClose,
  items,
  profile,
  onUpdateItemLink,
  onUpdatePanitiaDriveUrl,
  onEditItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PanelCategory | 'all'>('all');
  const [editingUrlId, setEditingUrlId] = useState<string | null>(null);
  const [tempUrl, setTempUrl] = useState('');
  const [masterDriveUrlTemp, setMasterDriveUrlTemp] = useState(profile.panitiaDriveUrl || '');
  const [isEditingMaster, setIsEditingMaster] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        (item.documentUrl && item.documentUrl.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSaveUrl = (itemId: string) => {
    onUpdateItemLink(itemId, tempUrl.trim());
    setEditingUrlId(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border-2 border-amber-500 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4A080B] via-[#650E13] to-[#2E0507] text-white flex items-center justify-between border-b border-amber-500/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black/50 rounded-2xl border border-amber-500/40 text-amber-300 shadow-inner">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">Panel Alamat URL & Direktori Google Drive</h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase font-mono">
                  100% Aktif
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                {profile.schoolName} • Pengurusan Pautan Fail 1 hingga Fail 6 Panitia Pendidikan Islam
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Master Folder Drive Quick Bar */}
        <div className="bg-amber-50 px-6 py-3.5 border-b border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 87.3 78" fill="none">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00ac47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
              <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase">Folder Induk Google Drive Panitia</div>
              <div className="text-[11px] text-slate-600 font-mono truncate max-w-md">{profile.panitiaDriveUrl}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profile.panitiaDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Buka Folder Induk</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => {
                const newUrl = prompt('Masukkan Alamat URL Folder Google Drive Utama Panitia:', profile.panitiaDriveUrl);
                if (newUrl !== null) {
                  onUpdatePanitiaDriveUrl(newUrl.trim());
                }
              }}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" />
              Tukar URL Induk
            </button>
          </div>
        </div>

        {/* Toolbar: Filter & Search */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-[#800000] text-amber-300 font-black shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Semua Fail ({items.length})
            </button>
            {PANELS_METADATA.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedCategory(p.key)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === p.key
                    ? 'bg-[#800000] text-amber-300 font-black shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {p.code}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tajuk atau kod item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
        </div>

        {/* Items URL Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-black uppercase tracking-wider">
                  <th className="py-3 px-3 w-16 text-center">KOD</th>
                  <th className="py-3 px-4">TAJUK DOKUMEN / ITEM</th>
                  <th className="py-3 px-4 w-28 text-center">STATUS</th>
                  <th className="py-3 px-4">ALAMAT URL GOOGLE DRIVE</th>
                  <th className="py-3 px-3 w-36 text-center">TINDAKAN URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const panelMeta = PANELS_METADATA.find((p) => p.key === item.category);
                  const isEditing = editingUrlId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3 px-3 text-center align-middle font-mono font-bold">
                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-800 border border-slate-300">
                          {item.itemCode}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-middle">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        {panelMeta && (
                          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                            {panelMeta.code}: {panelMeta.name}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center align-middle">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            item.status === 'ADA'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.status === 'TIADA'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-middle font-mono text-[11px]">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempUrl}
                              onChange={(e) => setTempUrl(e.target.value)}
                              placeholder="https://drive.google.com/..."
                              className="w-full text-xs p-1.5 border border-amber-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveUrl(item.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shrink-0"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingUrlId(null)}
                              className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg shrink-0"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            <span className="truncate text-slate-700 max-w-xs" title={item.documentUrl}>
                              {item.documentUrl ? item.documentUrl : <span className="text-slate-400 italic">Tiada pautan URL</span>}
                            </span>
                            {item.documentUrl && (
                              <button
                                onClick={() => handleCopy(item.documentUrl || '', item.id)}
                                className="text-slate-500 hover:text-slate-900 shrink-0"
                                title="Salin pautan"
                              >
                                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center align-middle">
                        {!isEditing && (
                          <div className="flex items-center justify-center gap-1.5">
                            {item.documentUrl ? (
                              <a
                                href={item.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
                                title="Uji Buka URL"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Kosong</span>
                            )}

                            <button
                              onClick={() => {
                                setEditingUrlId(item.id);
                                setTempUrl(item.documentUrl || '');
                              }}
                              className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition"
                              title="Edit Alamat URL"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600 font-medium">
            Memaparkan {filteredItems.length} daripada {items.length} item dokumen fail panitia.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#800000] hover:bg-[#600000] text-amber-300 rounded-xl text-xs sm:text-sm font-black shadow transition"
          >
            Tutup Panel URL
          </button>
        </div>
      </div>
    </div>
  );
};
