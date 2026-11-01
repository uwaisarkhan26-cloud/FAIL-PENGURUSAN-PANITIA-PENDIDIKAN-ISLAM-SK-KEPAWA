import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  QrCode,
  MessageCircle,
  Send,
  Mail,
  AlertTriangle,
  Globe,
  HelpCircle,
  FileDown,
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(true);

  if (!isOpen) return null;

  // Working active development URL for AI Studio
  const devUrl = 'https://ais-dev-g5krqas6w6uuphyzub7xvq-49039719799.asia-southeast1.run.app';

  // Determine the best URL
  const currentUrl =
    typeof window !== 'undefined' &&
    window.location.origin &&
    !window.location.origin.includes('about:') &&
    !window.location.origin.includes('null')
      ? window.location.origin
      : devUrl;

  const shareText = `*SISTEM FAIL PENGURUSAN PENDIDIKAN ISLAM 2026*\n*SK KEPAWA, BEAUFORT (XBA6019)*\n\nSalam takzim Cikgu,\nSila layari Dashboard Pengurusan Fail Panitia Pendidikan Islam SK Kepawa (Tahun 2026) melalui pautan ini:\n${currentUrl}\n\n- Pematuhan SKPM Kualiti@Sekolah Standard 3.1.1\n- Instrumen Selia Bantu JPN Sabah`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Sistem Fail Pengurusan Pendidikan Islam 2026 - ${profile.schoolName} (${profile.schoolCode})`)}`;
  const emailSubject = `Pautan Sistem Fail Pengurusan Pendidikan Islam 2026 - ${profile.schoolName}`;
  const emailBody = `Salam sejahtera,\n\nBerikut merupakan pautan rasmi ke Dashboard Sistem Fail Pengurusan Pendidikan Islam 2026 bagi ${profile.schoolName} (${profile.schoolCode}):\n\n${currentUrl}\n\nTerima kasih.`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // QR Code URL via QR Server API (safe, fast, universally supported)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&data=${encodeURIComponent(currentUrl)}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Gagal menyalin pautan', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-amber-500/50 animate-in fade-in zoom-in-95 duration-200">
        {/* Header - Maroon and Gold */}
        <div className="bg-gradient-to-r from-[#46080B] via-[#5B0E12] to-[#3B0709] px-6 py-4 text-white flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Kongsi & Buka Pautan Sistem</h3>
              <p className="text-xs text-amber-200/90">
                {profile.schoolName} ({profile.schoolCode}) • Sesi {profile.academicYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Diagnostic Note / Solusi 404 Page Not Found */}
          <div className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                  Mengapa Pautan Sebelum Ini Menunjukkan &quot;Error: Page not found (404)&quot;?
                </h4>
                <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed">
                  Pautan bermula dengan <strong>ais-pre-...</strong> adalah pautan terbitan awam.
                  Di platform Google AI Studio, pautan tersebut hanya diaktifkan oleh Google selepas anda menekan butang <strong>&quot;Share&quot;</strong> di <strong>penjuru atas kanan skrin AI Studio</strong>.
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-3 border border-amber-200 text-[11px] text-amber-950 space-y-1.5">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                Dua Cara Mudah Membuka / Berkongsi Sistem Ini:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>
                  <strong>Untuk Cikgu Buka Sendiri di Tab Baharu:</strong> Gunakan pautan aktif di bawah (klik butang <em>&quot;Buka di Tab Baharu&quot;</em>).
                </li>
                <li>
                  <strong>Untuk Rakan Guru Lain Membuka Tanpa Sekatan:</strong> Klik butang <strong>&quot;Share&quot;</strong> di penjuru atas kanan Google AI Studio &rarr; Pilih <strong>&quot;Anyone with the link&quot;</strong> &rarr; Salin pautan terbitan tersebut.
                </li>
              </ol>
            </div>
          </div>

          {/* Main URL Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Pautan Terus Sistem (Aktif):
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                ● Pelayan Sedang Berjalan (Online)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-slate-50 border-2 border-amber-400/80 rounded-xl px-3.5 py-2.5 font-mono text-xs sm:text-sm text-slate-800 break-all select-all shadow-inner">
                {currentUrl}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex-1 sm:flex-initial ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Pautan</span>
                    </>
                  )}
                </button>

                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95"
                  title="Buka pautan ini di tetingkap browser baharu"
                >
                  <ExternalLink className="w-4 h-4 text-amber-300" />
                  <span>Buka Tab Baharu</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Share Channels */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Kongsi Terus Melalui Aplikasi Mesej:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                Telegram
              </a>

              {/* Email */}
              <a
                href={mailtoUrl}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95"
              >
                <Mail className="w-4 h-4" />
                E-mel Rasmi
              </a>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Kod QR Telefon Pintar</h4>
                  <p className="text-[11px] text-slate-500">
                    Boleh diimbas dengan kamera telefon untuk semakan mudah alih.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="text-xs font-bold px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 rounded-lg text-slate-700 hover:text-amber-800 shadow-sm transition"
              >
                {showQR ? 'Tutup Kod QR' : 'Papar Kod QR'}
              </button>
            </div>

            {showQR && (
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-150">
                <div className="p-3 bg-white border-2 border-amber-400 rounded-2xl shadow-md inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="Kod QR Sistem Fail Panitia SK Kepawa"
                    className="w-44 h-44 object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] text-slate-600 max-w-xs font-medium">
                  Imbas menggunakan telefon pintar anda untuk membuka sistem serta-merta.
                </p>
              </div>
            )}
          </div>

          {/* Netlify Hosting Card */}
          <div className="border-2 border-teal-500/50 rounded-2xl p-4 bg-gradient-to-br from-teal-50/80 to-emerald-50/60 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-600 rounded-xl text-white shadow-xs">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-teal-950 uppercase tracking-wide">
                    Hosting Percuma di Netlify (Domain Kekal)
                  </h4>
                  <p className="text-[11px] text-teal-800">
                    Muat turun pakej binaan rasmi dan seret (drag & drop) terus ke Netlify.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase bg-teal-200/80 text-teal-900 px-2 py-0.5 rounded border border-teal-300">
                Paling Mudah
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="/downloads/sk-kepawa-netlify-build.zip"
                download="sk-kepawa-netlify-build.zip"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-sm transition active:scale-95"
              >
                <FileDown className="w-4 h-4" />
                Muat Turun Pakej Netlify (.zip)
              </a>

              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-teal-900 border border-teal-300 font-bold text-xs rounded-xl shadow-xs transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                Buka Netlify Drop (app.netlify.com/drop) ↗
              </a>
            </div>
          </div>

          {/* Panduan Bergambar AI Studio Share */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Cara Mengaktifkan Perkongsian Awam di Google AI Studio
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-[11px] text-amber-300 hover:underline"
              >
                {showTroubleshoot ? 'Sembunyi' : 'Lihat Langkah'}
              </button>
            </div>

            {showTroubleshoot && (
              <div className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white">Lihat di bucu kanan atas skrin Google AI Studio</p>
                    <p className="text-[11px] text-slate-400">
                      Terdapat butang <strong>&quot;Share&quot;</strong> (bersebelahan akaun Google anda).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white">Klik &quot;Share&quot; dan tetapkan kebenaran</p>
                    <p className="text-[11px] text-slate-400">
                      Tukar akses kepada <em>&quot;Anyone with the link can view&quot;</em> supaya rakan tidak disekat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white">Salin pautan yang diberikan</p>
                    <p className="text-[11px] text-slate-400">
                      Pautan tersebut dijamin boleh dibuka oleh mana-mana telefon atau komputer rakan guru.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">
            SK Kepawa (XBA6019) • Panitia Pendidikan Islam 2026
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
