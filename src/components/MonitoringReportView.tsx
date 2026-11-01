import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Edit,
  Trash2,
  Printer,
  Calendar,
  User,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
} from 'lucide-react';
import { MonitoringSession, SchoolProfile, FileItem, PanelCategory } from '../types';
import { PANELS_METADATA } from '../data/initialData';

interface MonitoringReportViewProps {
  sessions: MonitoringSession[];
  profile: SchoolProfile;
  items: FileItem[];
  onAddSession: (session: MonitoringSession) => void;
  onUpdateSession: (session: MonitoringSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onPrintOfficial: (session: MonitoringSession) => void;
}

export const MonitoringReportView: React.FC<MonitoringReportViewProps> = ({
  sessions,
  profile,
  items,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onPrintOfficial,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    sessions.length > 0 ? sessions[0].id : null
  );
  const [isCreatingOrEditing, setIsCreatingOrEditing] = useState(false);
  const [editingSession, setEditingSession] = useState<MonitoringSession | null>(null);

  // Form states
  const [monitorRole, setMonitorRole] = useState<'Guru Besar' | 'Penolong Kanan Pentadbiran' | 'Pegawai PPD'>('Guru Besar');
  const [monitorName, setMonitorName] = useState(profile.guruBesarName);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTitle, setSessionTitle] = useState('Pemantauan Pengurusan Fail Panitia Sesi 2026/2027');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [guidance, setGuidance] = useState('');
  const [followUpDeadline, setFollowUpDeadline] = useState('');
  const [checklist, setChecklist] = useState<
    {
      itemId: string;
      itemCode: string;
      title: string;
      category: PanelCategory;
      status: 'ADA' | 'TIADA' | 'TB';
      notes: string;
    }[]
  >([]);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleOpenCreate = (role: 'Guru Besar' | 'Penolong Kanan Pentadbiran') => {
    setEditingSession(null);
    setMonitorRole(role);
    const assignedName = role === 'Guru Besar' ? profile.guruBesarName : profile.pkPentadbiranName;
    setMonitorName(assignedName);
    setSessionDate(new Date().toISOString().split('T')[0]);
    setSessionTitle(`Pemantauan Fail Panitia (${role}: ${assignedName}) Sesi ${profile.academicYear}`);
    setStrengths(
      '1. Susunan fail 1 hingga 6 mematuhi piawaian JPN Sabah dan Standard 3.1.1 SKPM Kualiti@Sekolah.\n2. DSKP, RPT dan Takwim Panitia lengkap dan sentiasa dikemaskini oleh Ketua Panitia.\n3. Program pemerkasaan sahsiah murid (KBS, KCJ dan Khatam Al-Quran) tersusun kemas.'
    );
    setImprovements(
      '1. Pastikan eviden aktiviti murid dan program PLC guru sentiasa dimuatkan eviden bergambar dan analisis refleksi.\n2. Kekalkan semakan berkala buku log BBM surau.'
    );
    setGuidance(
      `Tahniah kepada ${profile.headOfPanitiaName} dan semua guru Pendidikan Islam SK Kepawa. Pengurusan fail mencapai tahap Cemerlang. Teruskan komitmen dalam mendidik sahsiah dan kecemerlangan murid.`
    );
    setFollowUpDeadline(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    // Snapshot current items
    setChecklist(
      items.map((i) => ({
        itemId: i.id,
        itemCode: i.itemCode,
        title: i.title,
        category: i.category,
        status: i.status,
        notes: i.notes,
      }))
    );

    setIsCreatingOrEditing(true);
  };

  const handleOpenEdit = (session: MonitoringSession) => {
    setEditingSession(session);
    setMonitorRole(session.monitorRole as any);
    setMonitorName(session.monitorName);
    setSessionDate(session.date);
    setSessionTitle(session.sessionTitle);
    setStrengths(session.strengths);
    setImprovements(session.improvements);
    setGuidance(session.guidance);
    setFollowUpDeadline(session.followUpDeadline);
    setChecklist(session.checklistSnapshot);
    setIsCreatingOrEditing(true);
  };

  const handleStatusChangeInChecklist = (itemId: string, newStatus: 'ADA' | 'TIADA' | 'TB') => {
    setChecklist((prev) =>
      prev.map((item) => (item.itemId === itemId ? { ...item, status: newStatus } : item))
    );
  };

  const handleNotesChangeInChecklist = (itemId: string, newNotes: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.itemId === itemId ? { ...item, notes: newNotes } : item))
    );
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const total = checklist.length;
    const ada = checklist.filter((i) => i.status === 'ADA').length;
    const tiada = checklist.filter((i) => i.status === 'TIADA').length;
    const tb = checklist.filter((i) => i.status === 'TB').length;
    const effectiveTotal = total - tb > 0 ? total - tb : total;
    const score = Number(((ada / effectiveTotal) * 100).toFixed(1));

    const newSession: MonitoringSession = {
      id: editingSession ? editingSession.id : `mon-${Date.now()}`,
      date: sessionDate,
      monitorRole,
      monitorName,
      sessionTitle,
      scorePercentage: score,
      totalItems: total,
      adaCount: ada,
      tiadaCount: tiada,
      tbCount: tb,
      checklistSnapshot: checklist,
      strengths,
      improvements,
      guidance,
      followUpDeadline,
      headOfDepartmentSignature: {
        signed: true,
        name: profile.headOfPanitiaName,
        date: sessionDate,
      },
      monitorSignature: {
        signed: true,
        name: monitorName,
        date: sessionDate,
      },
      status: 'Selesai',
    };

    if (editingSession) {
      onUpdateSession(newSession);
    } else {
      onAddSession(newSession);
      setSelectedSessionId(newSession.id);
    }
    setIsCreatingOrEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Maroon, Gold & Black */}
      <div className="bg-gradient-to-r from-[#3B0709] via-[#5B0E12] to-[#1E0406] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-500/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 rounded-full text-xs font-bold text-amber-300 border border-amber-500/40 shadow-inner">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Instrumen Selia Bantu JPN Sabah (SKPM Standard 3.1.1)
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Laporan Pemantauan Guru Besar & PK Pentadbiran
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
              Penyeliaan berkala pengurusan fail Panitia Pendidikan Islam SK Kepawa oleh Pentadbir Sekolah: <strong>Guru Besar ({profile.guruBesarName})</strong> dan <strong>PK Pentadbiran ({profile.pkPentadbiranName})</strong>.
            </p>
          </div>

          {/* Action buttons: GB & PKP */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-new-monitoring-gb"
              onClick={() => handleOpenCreate('Guru Besar')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Pemantauan Guru Besar
            </button>
            <button
              id="btn-new-monitoring-pkp"
              onClick={() => handleOpenCreate('Penolong Kanan Pentadbiran')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black/70 hover:bg-black text-amber-300 hover:text-amber-200 border border-amber-500/50 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Pemantauan PKP
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isCreatingOrEditing ? (
        /* Create or Edit Form */
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {editingSession ? 'Kemaskini Laporan Pemantauan' : 'Borang Sesi Pemantauan Pentadbir Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Penyeliaan fail panitia mengikut instrumen selia bantu rasmi KPM / JPN Sabah
              </p>
            </div>
            <button
              onClick={() => setIsCreatingOrEditing(false)}
              className="text-xs text-slate-600 hover:text-slate-900 font-bold px-3 py-1.5 rounded-lg border border-slate-300"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSaveSession} className="space-y-6">
            {/* Monitor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Jawatan Pegawai Pemantau <span className="text-rose-500">*</span>
                </label>
                <select
                  value={monitorRole}
                  onChange={(e) => {
                    const role = e.target.value as any;
                    setMonitorRole(role);
                    if (role === 'Guru Besar') setMonitorName(profile.guruBesarName);
                    else if (role === 'Penolong Kanan Pentadbiran') setMonitorName(profile.pkPentadbiranName);
                  }}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white font-bold focus:ring-2 focus:ring-[#800000]"
                >
                  <option value="Guru Besar">Guru Besar</option>
                  <option value="Penolong Kanan Pentadbiran">Penolong Kanan Pentadbiran</option>
                  <option value="Pegawai PPD">Pegawai PPD Beaufort</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Pegawai Pemantau <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={monitorName}
                  onChange={(e) => setMonitorName(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tarikh Pemantauan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tajuk / Rujukan Sesi Pemantauan
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-medium"
              />
            </div>

            {/* Checklist Table with ADA, TIADA, TB */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-black text-amber-300 px-4 py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    Senarai Semak Instrumen Selia Bantu (6 Kategori Fail Panitia)
                  </h4>
                  <p className="text-[11px] text-amber-200/80">
                    Tandakan status ADA / TIADA / TB bagi setiap item dokumen.
                  </p>
                </div>
                <div className="text-xs font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full shadow-xs">
                  Lengkap: {checklist.filter((c) => c.status === 'ADA').length} / {checklist.length} Item
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                {checklist.map((item) => (
                  <div
                    key={item.itemId}
                    className="p-3 hover:bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#800000] bg-[#800000]/10 px-1.5 py-0.5 rounded">
                          {item.itemCode}
                        </span>
                        <span className="font-bold text-slate-900">{item.title}</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Catatan pemantau (jika tidak berkaitan, tulis TB)..."
                        value={item.notes}
                        onChange={(e) => handleNotesChangeInChecklist(item.itemId, e.target.value)}
                        className="mt-1.5 w-full text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStatusChangeInChecklist(item.itemId, 'ADA')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${
                          item.status === 'ADA'
                            ? 'bg-emerald-700 text-white shadow-sm font-black'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ADA
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChangeInChecklist(item.itemId, 'TIADA')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${
                          item.status === 'TIADA'
                            ? 'bg-rose-700 text-white shadow-sm font-black'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        TIADA
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChangeInChecklist(item.itemId, 'TB')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${
                          item.status === 'TB'
                            ? 'bg-amber-600 text-white shadow-sm font-black'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        TB
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback & Guidance Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kekuatan Pengurusan Panitia
                </label>
                <textarea
                  rows={3}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="Kekuatan dokumen, kepatuhan takwim & komitmen guru..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Aspek Perlu Ditambahbaik
                </label>
                <textarea
                  rows={3}
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="Cadangan pembaikan atau kekurangan dokumen..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bimbingan & Syor Pemantau
                </label>
                <textarea
                  rows={3}
                  value={guidance}
                  onChange={(e) => setGuidance(e.target.value)}
                  placeholder="Bimbingan ikhtisas mengikut SKPM 3.1.1..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tarikh Tindakan Susulan (Follow-up)
              </label>
              <input
                type="date"
                value={followUpDeadline}
                onChange={(e) => setFollowUpDeadline(e.target.value)}
                className="text-xs rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-[#800000]"
              />
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreatingOrEditing(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-black text-amber-300 bg-[#800000] hover:bg-[#600000] rounded-lg shadow-md border border-amber-500/40"
              >
                Simpan & Sahkan Laporan
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Sessions List & Details */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List of Sessions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#800000]" />
                Rekod Sesi Pemantauan ({sessions.length})
              </h3>
            </div>

            {sessions.length === 0 ? (
              <div className="bg-gradient-to-br from-[#3B070A] to-[#250305] rounded-xl p-8 text-center border-2 border-dashed border-amber-400/40">
                <FileCheck className="w-10 h-10 text-amber-400/50 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">Belum ada sesi pemantauan</p>
                <p className="text-xs text-amber-200/70 mt-1">
                  Klik butang di atas untuk memulakan pemantauan oleh Guru Besar atau PK Pentadbiran.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const isSelected = selectedSession?.id === session.id;
                  const isGB = session.monitorRole === 'Guru Besar';

                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-gradient-to-r from-[#500A0F] to-[#38060A] shadow-xl ring-2 ring-amber-400/30'
                          : 'border-amber-400/30 bg-[#290507] hover:border-amber-400/60 hover:bg-[#38060A] shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span
                            className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                              isGB
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-black text-amber-300 border border-amber-400/50'
                            }`}
                          >
                            {session.monitorRole}
                          </span>
                          <h4 className="text-sm font-bold text-white leading-tight line-clamp-1">
                            {session.sessionTitle}
                          </h4>
                          <p className="text-xs text-amber-200/80 flex items-center gap-1 font-medium">
                            <User className="w-3.5 h-3.5 text-amber-400" />
                            {session.monitorName}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-black text-amber-400">
                            {session.scorePercentage}%
                          </div>
                          <span className="text-[10px] text-amber-200/70 font-semibold">Skor Kualiti</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-amber-400/20 flex items-center justify-between text-[11px] text-amber-200/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {session.date}
                        </span>
                        <span className="text-amber-300 font-bold">
                          {session.adaCount} / {session.totalItems} Lengkap
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Session Details */}
          {selectedSession ? (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-b from-[#2F0609] via-[#220406] to-[#160204] rounded-2xl shadow-2xl border-2 border-amber-400/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-amber-400/30 bg-black/40 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                        {selectedSession.monitorRole}
                      </span>
                      <span className="text-xs text-amber-200/80 font-medium">
                        Tarikh: {selectedSession.date}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {selectedSession.sessionTitle}
                    </h3>
                    <p className="text-xs text-amber-200/80">
                      Pemantau: <span className="font-bold text-amber-300">{selectedSession.monitorName}</span> | Ketua Panitia: <span className="font-bold text-amber-300">{profile.headOfPanitiaName}</span>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      id="btn-print-session"
                      onClick={() => onPrintOfficial(selectedSession)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-black shadow-md transition transform active:scale-95 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 stroke-[2.5]" />
                      Cetak Borang Rasmi
                    </button>
                    <button
                      id="btn-edit-session"
                      onClick={() => handleOpenEdit(selectedSession)}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-black/60 border border-amber-400/40 hover:bg-black text-amber-300 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      id="btn-delete-session"
                      onClick={() => {
                        if (window.confirm('Adakah anda pasti ingin memadam rekod pemantauan ini?')) {
                          onDeleteSession(selectedSession.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-black/60 border border-rose-500/50 hover:bg-rose-950/60 text-rose-300 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Padam
                    </button>
                  </div>
                </div>

                {/* Score & Metrics Cards - Merah Hati & Gold */}
                <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 border-b border-amber-400/30">
                  <div className="bg-[#240407] p-3 rounded-xl border border-amber-400/40 text-center shadow-inner">
                    <div className="text-2xl font-black text-amber-400">
                      {selectedSession.scorePercentage}%
                    </div>
                    <div className="text-[11px] font-bold text-amber-200 uppercase mt-0.5">
                      Skor Kualiti
                    </div>
                    <div className="text-[10px] text-amber-300 font-bold">Standard 3.1.1</div>
                  </div>

                  <div className="bg-[#240407] p-3 rounded-xl border border-emerald-400/40 text-center shadow-inner">
                    <div className="text-2xl font-black text-emerald-400">
                      {selectedSession.adaCount}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-200 uppercase mt-0.5">
                      Item Ada
                    </div>
                    <div className="text-[10px] text-emerald-300/80 font-medium">Lengkap dalam fail</div>
                  </div>

                  <div className="bg-[#240407] p-3 rounded-xl border border-rose-400/40 text-center shadow-inner">
                    <div className="text-2xl font-black text-rose-400">
                      {selectedSession.tiadaCount}
                    </div>
                    <div className="text-[11px] font-bold text-rose-200 uppercase mt-0.5">
                      Item Tiada
                    </div>
                    <div className="text-[10px] text-rose-300/80 font-medium">Perlu tindakan</div>
                  </div>

                  <div className="bg-[#240407] p-3 rounded-xl border border-amber-400/40 text-center shadow-inner">
                    <div className="text-2xl font-black text-amber-400">
                      {selectedSession.tbCount}
                    </div>
                    <div className="text-[11px] font-bold text-amber-200 uppercase mt-0.5">
                      Tidak Berkaitan (TB)
                    </div>
                    <div className="text-[10px] text-amber-300/80 font-medium">Dikecualikan</div>
                  </div>
                </div>

                {/* Feedback Boxes */}
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-black/60 border border-emerald-400/40 rounded-xl space-y-1.5 shadow-inner">
                    <h4 className="text-xs font-black text-emerald-300 uppercase flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      Kekuatan Pengurusan Panitia
                    </h4>
                    <p className="text-xs text-amber-100/90 leading-relaxed whitespace-pre-line font-medium">
                      {selectedSession.strengths || 'Tiada catatan kekuatan spesifik.'}
                    </p>
                  </div>

                  <div className="p-4 bg-black/60 border border-amber-400/40 rounded-xl space-y-1.5 shadow-inner">
                    <h4 className="text-xs font-black text-amber-300 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Aspek Yang Perlu Ditambahbaik
                    </h4>
                    <p className="text-xs text-amber-100/90 leading-relaxed whitespace-pre-line font-medium">
                      {selectedSession.improvements || 'Semua item menepati keperluan minimum.'}
                    </p>
                  </div>

                  <div className="p-4 bg-black/60 border border-amber-400/50 rounded-xl space-y-1.5 shadow-inner">
                    <h4 className="text-xs font-black text-amber-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Bimbingan & Syor Pemantau ({selectedSession.monitorRole})
                    </h4>
                    <p className="text-xs text-amber-100/90 leading-relaxed whitespace-pre-line font-medium">
                      {selectedSession.guidance || 'Kekalkan kecemerlangan pengurusan fail.'}
                    </p>
                    {selectedSession.followUpDeadline && (
                      <p className="text-[11px] font-black text-amber-400 pt-1">
                        Tarikh Akhir Tindakan Susulan: {selectedSession.followUpDeadline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Checklist Summary */}
                <div className="px-6 pb-6">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-3">
                    Status Item Semakan Semasa Sesi Ini
                  </h4>
                  <div className="border border-amber-400/30 rounded-xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-amber-400/20 text-xs bg-black/40">
                    {selectedSession.checklistSnapshot.map((item) => (
                      <div key={item.itemId} className="p-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded text-[10px]">
                            {item.itemCode}
                          </span>
                          <span className="font-bold text-white">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              item.status === 'ADA'
                                ? 'bg-emerald-600 text-white'
                                : item.status === 'TIADA'
                                ? 'bg-rose-700 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
