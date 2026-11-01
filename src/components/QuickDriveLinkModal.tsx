import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Link2, Check, Search, Trash2, FolderOpen } from 'lucide-react';
import { FileItem } from '../types';

interface QuickDriveLinkModalProps {
  isOpen: boolean;
  item: FileItem | null;
  panitiaDriveUrl?: string;
  onClose: () => void;
  onSaveLink: (itemId: string, newUrl: string) => void;
}

export const QuickDriveLinkModal: React.FC<QuickDriveLinkModalProps> = ({
  isOpen,
  item,
  panitiaDriveUrl = 'https://drive.google.com/drive',
  onClose,
  onSaveLink,
}) => {
  const [url, setUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (item) {
      setUrl(item.documentUrl || '');
      setSavedSuccess(false);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSave = (urlToSave = url) => {
    onSaveLink(item.id, urlToSave.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleOpenTest = (targetUrl = url) => {
    const finalUrl = targetUrl.trim() || 'https://drive.google.com/drive';
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const searchInDriveUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(
    item.title
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-amber-500/40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header - Maroon & Gold */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4A080B] via-[#650E13] to-[#2E0507] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/50 rounded-xl border border-amber-500/40 text-amber-300">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 87.3 78" fill="none">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00ac47"/>
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>
            <div>
              <h3 className="font-black text-white text-base leading-tight">
                Pautan Dokumen / Google Drive
              </h3>
              <p className="text-xs text-amber-200/90 font-mono">
                Item {item.itemCode} • SK Kepawa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Target Item Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
            <div className="font-extrabold text-slate-900 text-sm">{item.title}</div>
            {item.description && (
              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Link Input Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Alamat URL Pautan (Google Drive / Docs / PDF)</span>
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="text-rose-600 hover:text-rose-800 font-semibold normal-case flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Kosongkan
                </button>
              )}
            </label>
            <div className="relative">
              <input
                id="input-quick-drive-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... atau pautan folder"
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2.5 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] bg-white font-mono"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tampal pautan perkongsian (share link) Google Drive fail atau folder dokumen ini.
            </p>
          </div>

          {/* Quick Presets & Shortcuts */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilihan Pintas Google Drive:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleOpenTest(panitiaDriveUrl)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center justify-between border border-slate-300 text-left transition"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  Buka Folder Panitia
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenTest(searchInDriveUrl)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center justify-between border border-slate-300 text-left transition"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  Cari Tajuk di Drive
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            {url.trim() && (
              <button
                type="button"
                onClick={() => {
                  handleOpenTest(url);
                  handleSave(url);
                }}
                className="px-4 py-2 bg-black/80 hover:bg-black text-amber-200 border border-amber-500/40 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5"
              >
                <span>Buka & Simpan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              id="btn-save-quick-drive"
              onClick={() => handleSave(url)}
              className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  Tersimpan!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Simpan Pautan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
