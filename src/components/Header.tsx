import React from 'react';
import {
  FolderKanban,
  FileCheck,
  Printer,
  Settings,
  Download,
  RotateCcw,
  Award,
  Share2,
  Globe,
} from 'lucide-react';
import { SchoolProfile, PanelCategory } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  profile: SchoolProfile;
  activeView: 'dashboard' | 'panels' | 'monitoring' | 'official_print';
  selectedCategory: PanelCategory | 'all';
  onNavigate: (view: 'dashboard' | 'panels' | 'monitoring' | 'official_print') => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
  onOpenUrlModal: () => void;
  onExportData: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeView,
  selectedCategory,
  onNavigate,
  onOpenSettings,
  onOpenShare,
  onOpenUrlModal,
  onExportData,
  onResetData,
}) => {
  return (
    <header className="bg-gradient-to-b from-[#46080B] via-[#5B0E12] to-[#420608] border-b-2 border-amber-500/50 sticky top-0 z-40 shadow-lg text-white">
      {/* Top Black & Gold Micro-bar */}
      <div className="bg-black/90 text-amber-200/90 text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-300 uppercase tracking-wider">
            {profile.schoolName}
          </span>
          <span className="text-amber-500">•</span>
          <span className="text-amber-100 font-semibold">Sesi Persekolahan {profile.academicYear}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium text-amber-100/90">
          <span>
            Kod Sekolah: <strong className="text-amber-300 font-mono">{profile.schoolCode}</strong>
          </span>
          <span className="text-amber-500 hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            Guru Besar: <strong className="text-white">{profile.guruBesarName}</strong>
          </span>
          <span className="text-amber-500 hidden md:inline">•</span>
          <span className="hidden md:inline">
            PKP: <strong className="text-white">{profile.pkPentadbiranName}</strong>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Logo */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="cursor-pointer group flex items-center gap-3"
          title="Klik untuk kembali ke Dashboard"
        >
          <div className="relative p-1 bg-black/40 rounded-xl border border-amber-500/30 group-hover:border-amber-400 transition shadow-inner">
            <Logo
              size="md"
              customLogoUrl={profile.customLogoUrl}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-amber-300 tracking-tight leading-tight group-hover:text-amber-200 transition">
                {profile.schoolName}
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-black/60 text-amber-400 px-2 py-0.5 rounded border border-amber-500/40 font-mono">
                {profile.schoolCode}
              </span>
            </div>
            <p className="text-xs font-bold text-amber-100/90 tracking-wide mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
              SISTEM FAIL PENGURUSAN PENDIDIKAN ISLAM (FAIL 1 - 6)
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Navigation Pill */}
          <nav className="inline-flex bg-black/60 p-1 rounded-xl text-xs font-bold border border-amber-500/30 shadow-inner">
            <button
              id="nav-btn-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeView === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-btn-panels"
              onClick={() => onNavigate('panels')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeView === 'panels'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Fail 1 - 6
            </button>
            <button
              id="nav-btn-monitoring"
              onClick={() => onNavigate('monitoring')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'monitoring'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Pemantauan GB & PKP
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-open-url-modal"
              title="Panel Alamat URL & Pautan Google Drive Fail 1 - 6"
              onClick={onOpenUrlModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-200 bg-black/60 hover:bg-black/80 rounded-lg shadow-sm border border-amber-500/40 transition active:scale-95 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Panel Alamat URL</span>
            </button>

            <button
              id="btn-share-system"
              title="Kongsi Pautan Sistem kepada Rakan / Pentadbir (WhatsApp, Telegram, QR)"
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm border border-emerald-400/50 transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Kongsi Pautan</span>
            </button>

            <button
              id="btn-print-view"
              title="Cetak & Simpan PDF Borang Rasmi JPN Sabah"
              onClick={() => onNavigate('official_print')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm border border-amber-300 transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Cetak / Simpan PDF</span>
            </button>

            <button
              id="btn-open-settings"
              title="Tetapan Sekolah & Maklumat Panitia"
              onClick={onOpenSettings}
              className="p-2 text-amber-200 hover:text-white bg-black/40 hover:bg-black/60 border border-amber-500/30 rounded-lg transition"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              id="btn-export-backup"
              title="Muat Turun Sandaran Data (JSON)"
              onClick={onExportData}
              className="p-2 text-amber-200 hover:text-white bg-black/40 hover:bg-black/60 border border-amber-500/30 rounded-lg transition"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="btn-reset-initial"
              title="Set Semula Data Contoh Rasmi"
              onClick={onResetData}
              className="p-2 text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/30 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
