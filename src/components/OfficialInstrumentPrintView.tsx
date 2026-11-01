import React, { useState } from 'react';
import { Printer, ArrowLeft, Download, ExternalLink, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { FileItem, SchoolProfile, MonitoringSession } from '../types';
import { Logo } from './Logo';

interface OfficialInstrumentPrintViewProps {
  profile: SchoolProfile;
  items: FileItem[];
  monitoringSession?: MonitoringSession | null;
  onBack: () => void;
}

export const OfficialInstrumentPrintView: React.FC<OfficialInstrumentPrintViewProps> = ({
  profile,
  items,
  monitoringSession,
  onBack,
}) => {
  const [printStatus, setPrintStatus] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [tabFallbackUrl, setTabFallbackUrl] = useState<string | null>(null);

  // Helper to generate the standalone printable HTML document string
  const getStandaloneHtml = () => {
    const docElement = document.getElementById('official-instrument-document');
    const docInner = docElement ? docElement.innerHTML : '';
    const schoolCode = profile.schoolCode || 'XBA6019';
    const schoolName = profile.schoolName || 'SK KEPAWA';

    return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>INSTRUMEN_SELIA_BANTU_SK_KEPAWA_${schoolCode}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 10mm 10mm;
    }
    @media print {
      body {
        padding: 0 !important;
        margin: 0 !important;
        background: white !important;
        color: black !important;
      }
      .no-print {
        display: none !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
    body {
      background-color: #f1f5f9;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #000;
      padding: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #000;
    }
  </style>
</head>
<body>
  <!-- Print Control Bar (Visible in browser, hidden when printing) -->
  <div class="no-print max-w-4xl mx-auto mb-5 p-4 bg-gradient-to-r from-[#46080B] via-[#5B0E12] to-[#200406] text-white rounded-2xl shadow-xl border-2 border-amber-400 flex flex-wrap items-center justify-between gap-4">
    <div>
      <div class="font-black text-amber-300 text-base flex items-center gap-2">
        <span>📄 Paparan Cetakan Rasmi: ${schoolName} (${schoolCode})</span>
      </div>
      <div class="text-xs text-amber-100/90 mt-0.5">
        Pilih <strong>Destination: Save as PDF</strong> (Simpan sebagai PDF) atau pilih pencetak fizikal anda.
      </div>
    </div>
    <div class="flex items-center gap-2.5">
      <button onclick="window.print()" style="background: linear-gradient(to right, #f59e0b, #eab308); color: #020617; padding: 10px 22px; border-radius: 12px; font-weight: 900; font-size: 13px; border: none; cursor: pointer; display: inline-flex; items-center: center; gap: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);">
        🖨️ Cetak / Simpan PDF
      </button>
      <button onclick="window.close()" style="background-color: rgba(0,0,0,0.6); color: #fde68a; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 13px; border: 1px solid rgba(245, 158, 11, 0.4); cursor: pointer;">
        ✕ Tutup Tab
      </button>
    </div>
  </div>

  <!-- Document Canvas -->
  <div class="max-w-4xl mx-auto bg-white p-8 sm:p-12 border border-slate-300 shadow-2xl rounded-2xl">
    ${docInner}
  </div>

  <script>
    window.addEventListener('load', function() {
      // Auto open print dialog smoothly
      setTimeout(function() {
        try {
          window.print();
        } catch (e) {
          console.log('Auto print prevented by browser', e);
        }
      }, 700);
    });
  </script>
</body>
</html>`;
  };

  // Method 1: Butang "Cetak Dokumen" (Cetak Terus Pelayar)
  const handleDirectPrint = () => {
    setPrintStatus('Membuka dialog cetakan pelayar...');
    try {
      window.print();
      setPrintStatus('Dialog cetakan dibuka. Sedia untuk dicetak!');
    } catch (e) {
      console.warn('Direct print error, opening tab fallback:', e);
      handleOpenDedicatedPrintWindow();
    }
    setTimeout(() => setPrintStatus(null), 4000);
  };

  // Method 2: Butang "Simpan PDF" (Direct PDF Generation & Download)
  const handleSavePdf = async () => {
    const docElement = document.getElementById('official-instrument-document');
    if (!docElement) return;

    setIsGeneratingPdf(true);
    setPrintStatus('Sedang menjana fail PDF rasmi A4 (definisi tinggi)...');

    const fileName = `INSTRUMEN_SELIA_BANTU_SK_KEPAWA_${profile.schoolCode || 'XBA6019'}.pdf`;

    try {
      // Primary Engine: html2canvas + jsPDF (100% vector-safe, no CORS errors with SVG crest)
      const canvas = await html2canvas(docElement, {
        scale: 2, // 2x for sharp, crisp 300DPI text and borders
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
      const margin = 8; // 8mm margin
      const printWidth = pageWidth - margin * 2; // 194 mm
      const printHeight = pageHeight - margin * 2; // 281 mm
      const totalPdfHeight = (canvas.height * printWidth) / canvas.width;

      let heightLeft = totalPdfHeight;
      let position = margin;
      let pageNum = 1;

      // Add Page 1
      pdf.addImage(imgData, 'JPEG', margin, position, printWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= printHeight;

      // Add subsequent pages if the report spans more than 1 page
      while (heightLeft > 0) {
        pdf.addPage('a4', 'portrait');
        position = margin - (printHeight * pageNum);
        pdf.addImage(imgData, 'JPEG', margin, position, printWidth, totalPdfHeight, undefined, 'FAST');
        heightLeft -= printHeight;
        pageNum++;
      }

      pdf.save(fileName);
      setPrintStatus(`Fail PDF (${fileName}) berjaya dimuat turun!`);
    } catch (primaryErr) {
      console.warn('Primary jsPDF engine failed, attempting html2pdf fallback:', primaryErr);
      
      try {
        const html2pdfLib = (html2pdf as any)?.default || html2pdf;
        const opt = {
          margin: 8,
          filename: fileName,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        };

        await html2pdfLib().set(opt).from(docElement).save();
        setPrintStatus(`Fail PDF (${fileName}) berjaya dimuat turun!`);
      } catch (fallbackErr) {
        console.error('All client PDF libraries failed, opening print-to-PDF:', fallbackErr);
        setPrintStatus('Membuka dialog cetakan (Sila pilih "Save as PDF")...');
        window.print();
      }
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => setPrintStatus(null), 5000);
    }
  };

  // Method 3: Butang "Buka Tab Baharu"
  const handleOpenDedicatedPrintWindow = () => {
    setPrintStatus('Membuka dokumen dalam tab baharu...');
    const fullHtml = getStandaloneHtml();

    try {
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      setTabFallbackUrl(blobUrl);

      // Use a synthesized anchor link to reliably trigger new tab in iframe sandboxes
      const link = document.createElement('a');
      link.href = blobUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPrintStatus('Dokumen berjaya dibuka dalam tab baharu!');
    } catch (err) {
      console.warn('Blob popup blocked, falling back to direct window open or download', err);
      // Fallback: direct window.open
      const newWin = window.open('', '_blank');
      if (newWin) {
        newWin.document.open();
        newWin.document.write(fullHtml);
        newWin.document.close();
        setPrintStatus('Dokumen dibuka dalam tab baharu!');
      } else {
        // Fallback: trigger HTML download
        handleDownloadHtmlDoc();
      }
    }

    setTimeout(() => setPrintStatus(null), 4500);
  };

  // Standalone HTML file download helper
  const handleDownloadHtmlDoc = () => {
    setPrintStatus('Memuat turun fail instrumen A4...');
    const fullHtml = getStandaloneHtml();
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INSTRUMEN_SELIA_BANTU_SK_KEPAWA_${profile.schoolCode || 'XBA6019'}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setPrintStatus(null), 3500);
  };

  const getStatus = (itemId: string, defaultStatus: 'ADA' | 'TIADA' | 'TB') => {
    if (monitoringSession) {
      const snap = monitoringSession.checklistSnapshot.find((s) => s.itemId === itemId);
      if (snap) return snap.status;
    }
    return defaultStatus;
  };

  const getNotes = (itemId: string, defaultNotes: string) => {
    if (monitoringSession) {
      const snap = monitoringSession.checklistSnapshot.find((s) => s.itemId === itemId);
      if (snap) return snap.notes;
    }
    return defaultNotes;
  };

  // Group items by category
  const categories = [
    { key: 'pengurusan_am', bil: 1, title: 'PENGURUSAN AM' },
    { key: 'pekeliling', bil: 2, title: 'PEKELILING' },
    { key: 'mesyuarat', bil: 3, title: 'MESYUARAT' },
    { key: 'pentaksiran', bil: 4, title: 'PENTAKSIRAN' },
    { key: 'perancangan_strategik', bil: 5, title: 'PERANCANGAN STRATEGIK' },
    { key: 'kewangan', bil: 6, title: 'KEWANGAN' },
  ];

  const monitorName = monitoringSession ? monitoringSession.monitorName : profile.guruBesarName;
  const monitorRole = monitoringSession ? monitoringSession.monitorRole : 'Guru Besar';
  const monitorDate = monitoringSession ? monitoringSession.date : new Date().toLocaleDateString('ms-MY');

  return (
    <div className="bg-slate-100 min-h-screen py-6 px-3 sm:px-6">
      {/* Embedded print styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 10mm 10mm;
          }
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
          }
          .print\\:hidden, #top-print-action-bar, #bottom-print-action-bar, header, footer {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Top action bar - Hidden when printing, STICKY for immediate visibility */}
      <div
        id="top-print-action-bar"
        className="sticky top-2 z-50 max-w-4xl mx-auto mb-6 print:hidden bg-gradient-to-r from-[#46080B] via-[#5B0E12] to-[#200406] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border-2 border-amber-400 backdrop-blur-md space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            id="btn-print-back"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-amber-200 bg-black/70 hover:bg-black rounded-xl border border-amber-500/50 transition active:scale-95 cursor-pointer shadow-sm hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            Kembali ke Sistem
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Butang 1: Cetak Dokumen */}
            <button
              id="btn-trigger-print"
              type="button"
              onClick={handleDirectPrint}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg border-2 border-amber-200 transition active:scale-95 cursor-pointer ring-2 ring-amber-400/40"
              title="Cetak terus instrumen rasmi melalui dialog cetakan pelayar"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Cetak Dokumen</span>
            </button>

            {/* Butang 2: Simpan PDF */}
            <button
              id="btn-save-pdf"
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleSavePdf}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg border-2 border-emerald-400/60 transition active:scale-95 cursor-pointer disabled:opacity-60 ring-2 ring-emerald-500/30"
              title="Jana dan muat turun fail PDF A4 rasmi terus ke peranti"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-white" />
              )}
              <span>{isGeneratingPdf ? 'Menjana PDF...' : 'Simpan PDF'}</span>
            </button>

            {/* Butang 3: Buka Tab Baharu */}
            <button
              id="btn-open-tab-print"
              type="button"
              onClick={handleOpenDedicatedPrintWindow}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-200 bg-black/80 hover:bg-black text-white border border-amber-500/60 rounded-xl shadow-md transition active:scale-95 cursor-pointer hover:border-amber-400"
              title="Buka dokumen dalam tab pelayar baharu untuk paparan penuh dan cetakan tanpa halangan iframe"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Buka Tab Baharu</span>
            </button>
          </div>
        </div>

        {/* Informational Guidance Banner & Real-time Status */}
        <div className="bg-black/50 rounded-xl p-2.5 sm:p-3 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <span className="font-bold text-amber-300">💡 Panduan Tindakan:</span>
            <span>
              Pilih <strong>Cetak Dokumen</strong> untuk dialog cetakan, <strong>Simpan PDF</strong> untuk muat turun fail PDF ke peranti, atau <strong>Buka Tab Baharu</strong>.
            </span>
          </div>

          {printStatus && (
            <div className="inline-flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-950/90 px-3 py-1 rounded-lg border border-emerald-500/60 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{printStatus}</span>
            </div>
          )}
        </div>

        {/* Fallback Direct Link banner if popup was blocked by browser */}
        {tabFallbackUrl && (
          <div className="bg-amber-950/70 rounded-xl p-2.5 border border-amber-500/40 flex items-center justify-between gap-2 text-xs text-amber-200">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Jika tab baharu disekat oleh pelayar anda:</span>
            </div>
            <a
              href={tabFallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Tab Manual Di Sini ↗
            </a>
          </div>
        )}
      </div>

      {/* Official A4 Document Container */}
      <div
        id="official-instrument-document"
        className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-2xl rounded-2xl text-black font-sans print:shadow-none print:p-2 print:m-0 print:max-w-none text-[12px] leading-snug border border-slate-200"
      >
        {/* Official Header - HANYA LOGO SK KEPAWA (Tiada logo lain) */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4 gap-4">
          <div className="w-24 flex flex-col items-center justify-center gap-1.5 shrink-0">
            <Logo size="md" customLogoUrl={profile.customLogoUrl || '/assets/logo_sk_kepawa.png'} />
            <span className="text-[10px] font-black text-center tracking-tight leading-tight">
              SK KEPAWA
            </span>
          </div>

          <div className="text-center flex-1 px-2">
            <h2 className="text-xs font-bold tracking-wide uppercase text-slate-800">
              Kementerian Pendidikan Malaysia
            </h2>
            <h1 className="text-base sm:text-xl font-black uppercase tracking-tight text-black mt-0.5">
              INSTRUMEN SELIA BANTU
            </h1>
            <h2 className="text-sm sm:text-base font-extrabold uppercase text-slate-900">
              PENGURUSAN FAIL PANITIA MATA PELAJARAN
            </h2>
            <p className="text-xs font-bold uppercase text-slate-700">
              SEKTOR PEMBELAJARAN, JABATAN PENDIDIKAN NEGERI SABAH
            </p>
            <p className="text-[11px] font-black uppercase text-amber-950 mt-1">
              {profile.schoolName}
            </p>
          </div>

          {/* Spacer to keep center title balanced */}
          <div className="w-24 hidden sm:block shrink-0 opacity-0 pointer-events-none" aria-hidden="true" />
        </div>

        {/* School & Panitia Info Table */}
        <table className="w-full border-collapse border border-black mb-4 text-[11px]">
          <tbody>
            <tr>
              <td className="border border-black p-1.5 font-bold bg-slate-100 w-36 uppercase">Nama Sekolah</td>
              <td className="border border-black p-1.5 font-bold text-black uppercase">{profile.schoolName}</td>
              <td className="border border-black p-1.5 font-bold bg-slate-100 w-28 uppercase">Kod Sekolah</td>
              <td className="border border-black p-1.5 font-bold text-black uppercase w-28 font-mono">{profile.schoolCode}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold bg-slate-100 uppercase">Panitia</td>
              <td colSpan={3} className="border border-black p-1.5 font-bold text-black uppercase">
                {profile.panitiaName}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold bg-slate-100 uppercase">Nama Ketua Panitia</td>
              <td className="border border-black p-1.5 font-bold text-black">{profile.headOfPanitiaName}</td>
              <td className="border border-black p-1.5 font-bold bg-slate-100 uppercase">No. Tel. Sekolah</td>
              <td className="border border-black p-1.5 font-semibold text-black">{profile.headOfPanitiaPhone}</td>
            </tr>
          </tbody>
        </table>

        {/* Objektif Selia Bantu */}
        <div className="border border-black p-2.5 mb-4 text-[11px] bg-white">
          <p className="font-bold uppercase text-[11px] mb-1">OBJEKTIF SELIA BANTU</p>
          <ol className="list-decimal list-inside space-y-0.5 text-black">
            <li>Membimbing ketua panitia dalam mengurus fail panitia mata pelajaran.</li>
            <li>Menerangkan kepada ketua panitia berkaitan maklumat yang perlu dimasukkan ke dalam fail panitia.</li>
            <li>Memastikan fail panitia diurus dengan baik, kemas dan teratur.</li>
            <li>Mengaitkan pengurusan panitia dengan Standard 3.1.1 (Pengurusan Panitia) dalam SKPM Kualiti@Sekolah / SKPMg2.</li>
          </ol>
        </div>

        <p className="italic text-[11px] mb-2 font-medium">
          Sila tandakan <span className="font-bold">✓</span> pada ruang yang berkenaan.
        </p>

        {/* Checklist Table */}
        <table className="w-full border-collapse border border-black text-[11px] mb-6">
          <thead>
            <tr className="bg-slate-200 text-black font-bold uppercase text-center">
              <th className="border border-black py-1.5 px-2 w-10">BIL</th>
              <th className="border border-black py-1.5 px-2 text-left">ITEM</th>
              <th className="border border-black py-1.5 px-1 w-14">ADA</th>
              <th className="border border-black py-1.5 px-1 w-14">TIADA</th>
              <th className="border border-black py-1.5 px-2 w-52 text-left">
                CATATAN <span className="font-normal text-[9px] block">(Jika tidak berkaitan, tulis TB)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat.key);
              return (
                <React.Fragment key={cat.key}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-100 font-bold">
                    <td className="border border-black text-center py-1 font-bold">{cat.bil}</td>
                    <td colSpan={4} className="border border-black py-1 px-2 uppercase font-extrabold tracking-wide">
                      {cat.title}
                    </td>
                  </tr>

                  {/* Item Rows */}
                  {catItems.map((item) => {
                    const currentStatus = getStatus(item.id, item.status);
                    const currentNotes = getNotes(item.id, item.notes);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="border border-black text-center text-slate-500 font-mono text-[10px]">
                          {/* item row indicator */}
                        </td>
                        <td className="border border-black py-1 px-2">
                          <span className="font-bold text-black mr-1">{item.itemCode}</span>{' '}
                          <span>{item.title}</span>
                          {item.itemCode === '1.7' && (
                            <span className="text-[10px] text-slate-600 block italic">
                              (RPH guru disemak secara berkala)
                            </span>
                          )}
                        </td>
                        <td className="border border-black text-center py-1">
                          {currentStatus === 'ADA' && (
                            <span className="font-bold text-sm leading-none">✓</span>
                          )}
                        </td>
                        <td className="border border-black text-center py-1">
                          {currentStatus === 'TIADA' && (
                            <span className="font-bold text-sm leading-none">✓</span>
                          )}
                        </td>
                        <td className="border border-black py-1 px-2 text-[10px] leading-tight">
                          {currentStatus === 'TB' ? (
                            <span className="font-bold text-black">TB</span>
                          ) : (
                            currentNotes || '-'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* Monitoring Feedback / Ulasan Section */}
        {monitoringSession && (
          <div className="border border-black p-3 mb-6 bg-slate-50 text-[11px] space-y-2 break-inside-avoid">
            <p className="font-bold uppercase text-black border-b border-slate-300 pb-1">
              ULASAN & BIMBINGAN PEGAWAI PEMANTAU ({monitoringSession.monitorRole})
            </p>
            <div>
              <span className="font-bold text-black">Kekuatan: </span>
              <span>{monitoringSession.strengths || '-'}</span>
            </div>
            <div>
              <span className="font-bold text-black">Aspek Perlu Ditambahbaik: </span>
              <span>{monitoringSession.improvements || '-'}</span>
            </div>
            <div>
              <span className="font-bold text-black">Bimbingan / Syor: </span>
              <span>{monitoringSession.guidance || '-'}</span>
            </div>
            {monitoringSession.followUpDeadline && (
              <div>
                <span className="font-bold text-black">Tarikh Tindakan Susulan: </span>
                <span className="font-semibold">{monitoringSession.followUpDeadline}</span>
              </div>
            )}
          </div>
        )}

        {/* Signatures Area - Formatted exactly like official JPN Sabah form */}
        <div className="grid grid-cols-2 gap-12 pt-6 mb-8 break-inside-avoid text-[11px]">
          <div>
            <p className="mb-14">Tandatangan : ..............................................................</p>
            <p className="font-bold uppercase mb-2">Ketua Panitia</p>
            <p className="mb-1">Nama & Jawatan : <span className="font-bold">{profile.headOfPanitiaName} (Ketua Panitia Pendidikan Islam)</span></p>
            <p>Tarikh : <span className="font-semibold">{monitorDate}</span></p>
          </div>

          <div>
            <p className="mb-14">Tandatangan : ..............................................................</p>
            <p className="font-bold uppercase mb-2">Pegawai Pemantau</p>
            <p className="mb-1">Nama & Jawatan : <span className="font-bold">{monitorName} ({monitorRole})</span></p>
            <p>Tarikh : <span className="font-semibold">{monitorDate}</span></p>
          </div>
        </div>

        {/* 3 Copies Footer Notice */}
        <div className="border-t border-black pt-3 text-[10px] text-slate-800 italic text-center break-inside-avoid">
          Sila buat dalam 3 salinan. Salinan asal untuk pegawai pemantau, salinan kedua untuk PPD dan salinan ketiga untuk simpanan sekolah.
        </div>
      </div>

      {/* Bottom Action Bar for Easy Access after reviewing document */}
      <div
        id="bottom-print-action-bar"
        className="max-w-4xl mx-auto mt-6 print:hidden bg-gradient-to-r from-[#46080B] via-[#5B0E12] to-[#200406] text-white p-4 rounded-2xl shadow-xl border-2 border-amber-500/40 flex flex-wrap items-center justify-between gap-3"
      >
        <button
          id="btn-print-back-bottom"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-amber-200 bg-black/70 hover:bg-black rounded-xl border border-amber-500/50 transition active:scale-95 cursor-pointer shadow-sm hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          Kembali ke Sistem
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-trigger-print-bottom"
            type="button"
            onClick={handleDirectPrint}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg border-2 border-amber-200 transition active:scale-95 cursor-pointer ring-2 ring-amber-400/40"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Cetak Dokumen</span>
          </button>

          <button
            id="btn-save-pdf-bottom"
            type="button"
            disabled={isGeneratingPdf}
            onClick={handleSavePdf}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg border-2 border-emerald-400/60 transition active:scale-95 cursor-pointer disabled:opacity-60 ring-2 ring-emerald-500/30"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
            <span>{isGeneratingPdf ? 'Menjana PDF...' : 'Simpan PDF'}</span>
          </button>

          <button
            id="btn-open-tab-print-bottom"
            type="button"
            onClick={handleOpenDedicatedPrintWindow}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-200 bg-black/80 hover:bg-black text-white border border-amber-500/60 rounded-xl shadow-md transition active:scale-95 cursor-pointer hover:border-amber-400"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Buka Tab Baharu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
