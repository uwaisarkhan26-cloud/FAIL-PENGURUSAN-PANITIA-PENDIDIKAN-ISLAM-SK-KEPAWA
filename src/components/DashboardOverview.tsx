import React from 'react';
import {
  FolderKanban,
  BookOpenCheck,
  Users,
  GraduationCap,
  Target,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Printer,
  Plus,
  ArrowRight,
  Award,
  Share2,
} from 'lucide-react';
import { FileItem, PanelCategory, SchoolProfile, MonitoringSession } from '../types';
import { PANELS_METADATA } from '../data/initialData';

interface DashboardOverviewProps {
  items: FileItem[];
  profile: SchoolProfile;
  sessions: MonitoringSession[];
  onSelectCategory: (cat: PanelCategory) => void;
  onAddItem: () => void;
  onOpenMonitoring: () => void;
  onPrintOfficial: () => void;
  onOpenShare?: () => void;
  onOpenGBSession?: () => void;
  onOpenPKPSession?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  items,
  profile,
  sessions,
  onSelectCategory,
  onAddItem,
  onOpenMonitoring,
  onPrintOfficial,
  onOpenShare,
}) => {
  const totalItems = items.length;
  const adaCount = items.filter((i) => i.status === 'ADA').length;
  const tiadaCount = items.filter((i) => i.status === 'TIADA').length;
  const tbCount = items.filter((i) => i.status === 'TB').length;

  const applicableTotal = totalItems - tbCount > 0 ? totalItems - tbCount : totalItems;
  const overallPercentage = Math.round((adaCount / applicableTotal) * 100);

  const latestGBSession = sessions.find((s) => s.monitorRole === 'Guru Besar');
  const latestPKPSession = sessions.find((s) => s.monitorRole === 'Penolong Kanan Pentadbiran');

  // Icons with authentic Gold styling
  const getIcon = (name: string) => {
    switch (name) {
      case 'FolderKanban':
        return <FolderKanban className="w-6 h-6 text-amber-300" />;
      case 'BookOpenCheck':
        return <BookOpenCheck className="w-6 h-6 text-amber-300" />;
      case 'Users':
        return <Users className="w-6 h-6 text-amber-300" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-amber-300" />;
      case 'Target':
        return <Target className="w-6 h-6 text-amber-300" />;
      case 'Receipt':
        return <Receipt className="w-6 h-6 text-amber-300" />;
      default:
        return <FolderKanban className="w-6 h-6 text-amber-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HERO BANNER - MERAH HATI & GOLD */}
      <div className="bg-gradient-to-r from-[#4A080C] via-[#650E14] to-[#2D0407] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400 relative overflow-hidden">
        {/* Decorative gold ambient glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-rose-950/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-black/70 rounded-full text-xs font-black text-amber-300 border border-amber-400/80 shadow-inner">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Instrumen Selia Bantu Pengurusan Panitia KPM</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              FAIL PENGURUSAN PENDIDIKAN ISLAM SK KEPAWA 2026
            </h1>

            <p className="text-xs sm:text-sm text-amber-100/95 max-w-2xl leading-relaxed">
              Memastikan semua 6 fail panitia diurus dengan teratur, kemas dan mematuhi Standard 3.1.1 (Pengurusan Panitia) dalam SKPM Kualiti@Sekolah bagi sesi {profile.academicYear}.
            </p>

            {/* Quick Action Buttons - Butang Tindakan Pantas Emas Berkualiti Tinggi */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                id="btn-dash-add-item"
                onClick={onAddItem}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition transform active:scale-95 cursor-pointer border border-amber-200"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Tambah Fail / Dokumen
              </button>

              <button
                id="btn-dash-open-monitoring"
                onClick={onOpenMonitoring}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-black/60 to-amber-500/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border-2 border-amber-400 rounded-xl text-xs sm:text-sm font-black shadow-lg transition transform active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
                Pemantauan Pentadbir
              </button>

              <button
                id="btn-dash-print-official"
                onClick={onPrintOfficial}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-black/60 to-amber-500/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border-2 border-amber-400 rounded-xl text-xs sm:text-sm font-black shadow-lg transition transform active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300 group-hover:text-slate-950" />
                Cetak / Simpan PDF
              </button>

              {onOpenShare && (
                <button
                  id="btn-dash-share"
                  onClick={onOpenShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-emerald-400 rounded-xl text-xs sm:text-sm font-black shadow-lg transition transform active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-200" />
                  Kongsi Pautan
                </button>
              )}
            </div>
          </div>

          {/* Meter Pematuhan SKPM 3.1.1 Bercahaya Emas */}
          <div className="bg-gradient-to-b from-[#2E0508] via-[#38060A] to-[#1F0305] rounded-2xl p-5 border-2 border-amber-400 text-center flex flex-col items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/50 relative overflow-hidden">
            <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_15px_rgba(251,191,36,0.65)]">
              {overallPercentage}%
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-300 mt-1">
              Tahap Kepatuhan Fail Panitia
            </p>
            <div className="text-[11px] font-bold text-amber-200/90 mt-1">
              Standard SKPM 3.1.1: {overallPercentage >= 90 ? 'Cemerlang' : overallPercentage >= 80 ? 'Baik' : 'Sederhana'}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 w-full pt-3 border-t border-amber-400/30 text-xs">
              <div className="bg-black/70 p-2 rounded-lg border border-emerald-400/50">
                <div className="font-black text-emerald-400 text-base">{adaCount}</div>
                <div className="text-[10px] text-emerald-200 font-bold uppercase">Lengkap</div>
              </div>
              <div className="bg-black/70 p-2 rounded-lg border border-rose-400/50">
                <div className="font-black text-rose-400 text-base">{tiadaCount}</div>
                <div className="text-[10px] text-rose-200 font-bold uppercase">Tindakan</div>
              </div>
              <div className="bg-black/70 p-2 rounded-lg border border-amber-400/50">
                <div className="font-black text-amber-400 text-base">{tbCount}</div>
                <div className="text-[10px] text-amber-200 font-bold uppercase">TB</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6 PANELS GRID - MERAH HATI GELAP (#3B070A ke #250305) & GOLD */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-black text-amber-300 tracking-tight flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] inline-block" />
              6 Panel Fail Panitia Pendidikan Islam SK Kepawa
            </h2>
            <p className="text-xs text-amber-100/80">
              Semua panel aktif. Klik mana-mana fail untuk membuka senarai penuh dokumen, tambah item, edit pautan Google Drive atau kemaskini status.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('pengurusan_am')}
            className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 hover:text-amber-300 self-start sm:self-auto bg-[#380609] border border-amber-400/50 px-3 py-1.5 rounded-lg shadow-sm hover:border-amber-300 transition cursor-pointer"
          >
            Buka Semua Panel <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PANELS_METADATA.map((panel) => {
            const panelItems = items.filter((i) => i.category === panel.key);
            const pAda = panelItems.filter((i) => i.status === 'ADA').length;
            const pTb = panelItems.filter((i) => i.status === 'TB').length;
            const pTotal = panelItems.length;
            const pPercent = pTotal - pTb > 0 ? Math.round((pAda / (pTotal - pTb)) * 100) : 100;

            return (
              <div
                key={panel.key}
                id={`card-panel-${panel.key}`}
                onClick={() => onSelectCategory(panel.key)}
                className="cursor-pointer group bg-gradient-to-br from-[#3B070A] to-[#250305] rounded-2xl p-5 border-2 border-amber-400/60 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Garisan Aksen Atas Emas */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-black/70 border border-amber-400/40 group-hover:bg-amber-400 group-hover:border-amber-300 transition shadow-inner">
                      {getIcon(panel.iconName)}
                    </div>
                    {/* Lencana Kod Emas */}
                    <span className="text-xs font-mono font-black px-3 py-1 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md border border-amber-200">
                      {panel.code}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                    {panel.name}
                  </h3>
                  <p className="text-xs text-amber-100/80 line-clamp-2 mt-1 leading-relaxed">
                    {panel.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-amber-400/25 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-200 font-bold">Status Pengisian:</span>
                    <span className="font-black text-amber-300">
                      {pAda} / {pTotal} Item ({pPercent}%)
                    </span>
                  </div>

                  {/* Bar Kemajuan Emas */}
                  <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden border border-amber-400/40 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all duration-500"
                      style={{ width: `${pPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-mono text-amber-300/90 font-bold">SKPM {panel.standardSKPM}</span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-black group-hover:text-amber-200 group-hover:translate-x-1 transition-all">
                      Buka Fail <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MONITORING & ACTION PANELS - MERAH HATI & GOLD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pemantauan Pentadbir (Guru Besar & PK Pentadbiran) */}
        <div className="bg-gradient-to-br from-[#3B070A] via-[#4D090E] to-[#250305] rounded-2xl p-6 border-2 border-amber-400/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Laporan Pemantauan Pentadbir SK Kepawa
            </h3>
            <button
              id="btn-dash-view-all-monitoring"
              onClick={onOpenMonitoring}
              className="text-xs font-black text-amber-400 hover:text-amber-200 hover:underline cursor-pointer"
            >
              Buka Semua ({sessions.length})
            </button>
          </div>

          <div className="space-y-3">
            {/* Guru Besar: Mohd. Zahari bin Tibin */}
            <div className="p-4 rounded-xl border-2 border-amber-400/40 bg-black/55 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="space-y-1">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 uppercase">
                  Guru Besar: {profile.guruBesarName}
                </span>
                <p className="text-xs font-bold text-white">
                  {latestGBSession ? latestGBSession.sessionTitle : 'Sedia untuk pemantauan rasmi'}
                </p>
                <p className="text-[11px] text-amber-200/80 font-mono">
                  {latestGBSession ? `Tarikh Semakan: ${latestGBSession.date}` : 'Instrumen Selia Bantu JPN Sabah'}
                </p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400">
                    {latestGBSession ? `${latestGBSession.scorePercentage}%` : '100%'}
                  </span>
                  <span className="text-[10px] text-amber-300/80 font-bold block">Skor Selia Bantu</span>
                </div>
                <button
                  onClick={onOpenMonitoring}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-lg shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  Lihat Rekod GB
                </button>
              </div>
            </div>

            {/* PK Pentadbiran: Nurtitah binti Membuai */}
            <div className="p-4 rounded-xl border-2 border-amber-400/40 bg-black/55 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="space-y-1">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 uppercase">
                  PK Pentadbiran: {profile.pkPentadbiranName}
                </span>
                <p className="text-xs font-bold text-white">
                  {latestPKPSession ? latestPKPSession.sessionTitle : 'Semakan Kurikulum Panitia'}
                </p>
                <p className="text-[11px] text-amber-200/80 font-mono">
                  {latestPKPSession ? `Tarikh Semakan: ${latestPKPSession.date}` : 'Instrumen Selia Bantu JPN Sabah'}
                </p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400">
                    {latestPKPSession ? `${latestPKPSession.scorePercentage}%` : '95%'}
                  </span>
                  <span className="text-[10px] text-amber-300/80 font-bold block">Skor Selia Bantu</span>
                </div>
                <button
                  onClick={onOpenMonitoring}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-lg shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  Lihat Rekod PKP
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Items That Need Attention (TIADA) */}
        <div className="bg-gradient-to-br from-[#3B070A] via-[#4D090E] to-[#250305] rounded-2xl p-6 border-2 border-amber-400/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Senarai Semak & Tindakan Panitia ({tiadaCount} Perlu Dilengkapkan)
            </h3>
            <span className="text-xs font-bold text-amber-200">
              Ketua Panitia: {profile.headOfPanitiaName}
            </span>
          </div>

          {tiadaCount === 0 ? (
            <div className="p-6 text-center bg-black/55 rounded-xl border-2 border-amber-400/40 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-amber-200">
                Tahniah! Semua dokumen panitia berstatus ADA atau TB.
              </p>
              <p className="text-[11px] text-amber-300/80 mt-1">
                Pengurusan fail panitia bersedia sepenuhnya untuk pemantauan Pentadbir dan pengauditan rasmi.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {items
                .filter((i) => i.status === 'TIADA')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-black/60 border border-amber-400/30 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-black text-slate-950 mr-2 bg-amber-400 px-2 py-0.5 rounded">
                        {item.itemCode}
                      </span>
                      <span className="font-bold text-white">{item.title}</span>
                      <p className="text-[11px] text-amber-200/80 mt-0.5">{item.notes || 'Perlu dimuatkan ke dalam fail.'}</p>
                    </div>
                    <button
                      onClick={() => onSelectCategory(item.category)}
                      className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-black shrink-0 ml-2 shadow-sm transition cursor-pointer"
                    >
                      Buka Fail
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
