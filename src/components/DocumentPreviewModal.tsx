import React from 'react';
import { X, FileText, Download, ExternalLink, Printer, CheckCircle } from 'lucide-react';
import { FileItem, SchoolProfile } from '../types';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FileItem | null;
  profile: SchoolProfile;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  item,
  profile,
}) => {
  if (!isOpen || !item) return null;

  // Custom template preview content based on item code
  const renderTemplateContent = () => {
    switch (item.itemCode) {
      case '2.1':
        return (
          <div className="space-y-4 font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-center font-bold text-slate-800 pb-2 border-b border-slate-300">
              KEMENTERIAN PENDIDIKAN MALAYSIA<br />
              SURAT PEKELILING IKHTISAS BIL. 4/1986<br />
              PENGURUSAN PANITIA MATA PELAJARAN
            </div>
            <p><strong>Tujuan:</strong> Pekeliling ini dikeluarkan bagi memperkemaskan dan mengukuhkan peranan panitia mata pelajaran di sekolah-sekolah rendah dan menengah.</p>
            <p><strong>Peranan Utama Panitia:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Memperbaiki dan meningkatkan mutu serta keberkesanan pengajaran dan pembelajaran.</li>
              <li>Berikhtiar dan berusaha mendapatkan strategi pengajaran yang inovatif dan boleh mendorong pembelajaran murid.</li>
              <li>Memperbaiki prestasi murid-murid dalam peperiksaan (berdasarkan sasaran headcount dan PBD).</li>
              <li>Mewujudkan semangat kerjasama antara panitia mata pelajaran dengan persatuan atau kelab akademik.</li>
            </ul>
          </div>
        );

      case '3.4':
        return (
          <div className="space-y-3 font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-center font-bold text-slate-800 pb-2 border-b border-slate-300">
              {profile.schoolName}<br />
              MINIT MESYUARAT PANITIA PENDIDIKAN ISLAM BIL. 1/{profile.academicYear.split('/')[0].trim()}
            </div>
            <p><strong>Tarikh:</strong> 18 Januari 2026 | <strong>Masa:</strong> 2.00 Petang</p>
            <p><strong>Tempat:</strong> Bilik Mesyuarat / Surau SK Kepawa</p>
            <p><strong>Pengerusi:</strong> {profile.headOfPanitiaName} (Ketua Panitia)</p>
            <p><strong>Agenda:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Perutusan Pengerusi</li>
              <li>Pengesahan Minit Mesyuarat yang lalu</li>
              <li>Perkara Berbangkit & Maklum Balas</li>
              <li>Pengurusan DSKP, RPT dan Takwim Persekolahan 2026/2027</li>
              <li>Agihan Peruntukan PCG dan Penyediaan Nota Minta</li>
              <li>Program Celik Al-Quran, Kem Bestari Solat & Ihya Ramadan</li>
              <li>Hal-hal lain dan Penutup</li>
            </ol>
          </div>
        );

      case '6.3':
        return (
          <div className="space-y-3 font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-center font-bold text-slate-800 pb-2 border-b border-slate-300">
              BORANG NOTA MINTA<br />
              {profile.schoolName} - KEWANGAN PCG PENDIDIKAN ISLAM
            </div>
            <p><strong>Kepada:</strong> Guru Besar ({profile.guruBesarName})</p>
            <p><strong>Daripada:</strong> Ketua Panitia Pendidikan Islam ({profile.headOfPanitiaName})</p>
            <table className="w-full border-collapse border border-slate-400 my-2 text-[11px]">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-400 p-1">Bil</th>
                  <th className="border border-slate-400 p-1">Perihal Barang / Servis</th>
                  <th className="border border-slate-400 p-1">Kuantiti</th>
                  <th className="border border-slate-400 p-1">Anggaran Harga (RM)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">1</td>
                  <td className="border border-slate-400 p-1">Kertas A4 & Modul Celik Jawi Murid Tahap 1</td>
                  <td className="border border-slate-400 p-1 text-center">10 Rim</td>
                  <td className="border border-slate-400 p-1 text-right">RM 160.00</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">2</td>
                  <td className="border border-slate-400 p-1">Hadiah & Cenderahati Program Kem Bestari Solat</td>
                  <td className="border border-slate-400 p-1 text-center">1 Set</td>
                  <td className="border border-slate-400 p-1 text-right">RM 350.00</td>
                </tr>
              </tbody>
            </table>
            <p><strong>Baki Peruntukan Semasa:</strong> Mencukupi di bawah PCG Panitia.</p>
          </div>
        );

      default:
        return (
          <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-[#800000] font-bold border-b border-slate-200 pb-2">
              <CheckCircle className="w-4 h-4 text-[#800000]" />
              <span>Panduan Format Dokumen Fail: {item.itemCode} - {item.title}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Dokumen ini difailkan di bawah <strong>{item.category.replace('_', ' ').toUpperCase()}</strong> mengikut piawaian Instrumen Selia Bantu Sektor Pembelajaran JPN Sabah dan SKPM Kualiti@Sekolah Standard 3.1.1.
            </p>
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-slate-700">
              <p><strong>Status Fail:</strong> <span className="text-[#800000] font-bold">{item.status}</span></p>
              <p><strong>Catatan:</strong> {item.notes || 'Telah disemak dan disahkan.'}</p>
              <p><strong>Pegawai Pengesah:</strong> {item.verifiedBy || profile.headOfPanitiaName}</p>
              <p><strong>Tarikh Kemaskini:</strong> {item.updatedAt}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border-2 border-amber-500/40 overflow-hidden my-8">
        <div className="px-6 py-4 bg-gradient-to-r from-[#4A080B] via-[#650E13] to-[#2E0507] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/50 rounded-xl border border-amber-500/40">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {item.itemCode} - {item.title}
              </h3>
              <p className="text-xs text-amber-200/90">
                Format Contoh & Maklumat Perekodan Fail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1.5 rounded-lg hover:bg-black/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {renderTemplateContent()}

          {/* Active Google Drive Section */}
          <div className="p-4 bg-gradient-to-r from-amber-50/80 to-slate-50 rounded-xl border-2 border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 87.3 78" fill="none">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00ac47"/>
                  <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                  <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <span className="text-xs font-black text-slate-800">
                  Pautan Dokumen / Google Drive:
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                {item.documentUrl ? 'Dipautkan' : 'Folder Panitia'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                id="btn-preview-modal-drive-link"
                href={item.documentUrl || profile.panitiaDriveUrl || 'https://drive.google.com/drive'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-bold shadow-sm inline-flex items-center gap-1.5 transition active:scale-95"
              >
                <span>{item.documentUrl ? 'Buka Fail Google Drive' : 'Buka Google Drive Panitia'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </a>

              <a
                href={`https://drive.google.com/drive/search?q=${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
              >
                <span>Cari Fail di Drive</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Paparan Ini</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
