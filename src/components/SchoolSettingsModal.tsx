import React, { useState } from 'react';
import { X, School, User, Phone, Save, Upload, RotateCcw } from 'lucide-react';
import { SchoolProfile } from '../types';
import { Logo } from './Logo';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onSave: (updated: SchoolProfile) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>({ ...profile });
  const [imagePreview, setImagePreview] = useState<string>(profile.customLogoUrl || '/assets/logo_sk_kepawa.png');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          customLogoUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setImagePreview('/assets/logo_sk_kepawa.png');
    setFormData((prev) => ({ ...prev, customLogoUrl: '/assets/logo_sk_kepawa.png' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-amber-500/40 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4A080B] via-[#650E13] to-[#2E0507] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/50 rounded-xl border border-amber-500/40">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Tetapan Maklumat Sekolah & Panitia</h2>
              <p className="text-xs text-amber-200/90">{profile.schoolName} ({profile.schoolCode})</p>
            </div>
          </div>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1.5 rounded-lg hover:bg-black/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Logo Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 p-1 bg-black/40 rounded-xl border border-amber-500/30 flex items-center justify-center shadow-inner">
                <Logo size="sm" customLogoUrl={imagePreview} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Logo Rasmi SK Kepawa</h4>
                <p className="text-xs text-slate-500">
                  {imagePreview ? 'Logo kustom dimuat naik' : 'Lencana rasmi SK Kepawa (Usaha Jaya)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800000] hover:bg-[#600000] text-amber-300 hover:text-amber-200 text-xs font-bold rounded-lg shadow-sm border border-amber-500/40 transition">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{imagePreview ? 'Tukar Logo' : 'Muat Naik Logo'}</span>
                <input
                  id="input-logo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>

              {imagePreview && imagePreview !== '/assets/logo_sk_kepawa.png' && (
                <button
                  type="button"
                  id="btn-reset-logo"
                  onClick={handleResetLogo}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition"
                  title="Kembali kepada lencana asal SK Kepawa"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  Asal
                </button>
              )}
            </div>
          </div>

          {/* School Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 border-b pb-1">
              Maklumat Sekolah & Daerah
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Sekolah
                </label>
                <input
                  id="input-school-name"
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kod Sekolah
                </label>
                <input
                  id="input-school-code"
                  type="text"
                  value={formData.schoolCode}
                  onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-mono font-bold uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  PPD / Pejabat Pendidikan Daerah
                </label>
                <input
                  id="input-ppd-name"
                  type="text"
                  value={formData.ppdName}
                  onChange={(e) => setFormData({ ...formData, ppdName: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tahun Sesi Persekolahan
                </label>
                <input
                  id="input-academic-year"
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000]"
                />
              </div>
            </div>
          </div>

          {/* Panitia & Pentadbir Details */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 border-b pb-1">
              Maklumat Pentadbir & Panitia Pendidikan Islam
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Panitia
              </label>
              <input
                id="input-panitia-name"
                type="text"
                value={formData.panitiaName}
                onChange={(e) => setFormData({ ...formData, panitiaName: e.target.value })}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-bold"
              />
            </div>

            {/* Google Drive Folder Induk */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" fill="none">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                    <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00ac47"/>
                    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
                    <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                    <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                  </svg>
                  Pautan Folder Google Drive Panitia (Folder Induk)
                </span>
                {formData.panitiaDriveUrl && (
                  <a
                    href={formData.panitiaDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline flex items-center gap-1"
                  >
                    Uji Pautan ↗
                  </a>
                )}
              </label>
              <input
                id="input-panitia-drive-url"
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.panitiaDriveUrl || ''}
                onChange={(e) => setFormData({ ...formData, panitiaDriveUrl: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-lg border border-emerald-300 p-2.5 focus:ring-2 focus:ring-emerald-600 bg-white font-mono"
              />
              <p className="text-[11px] text-emerald-800">
                Pautan folder Google Drive Panitia Pendidikan Islam SK Kepawa yang aktif dibuka melalui butang hijau di atas panel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#800000]" />
                  Nama Ketua Panitia
                </label>
                <input
                  id="input-head-panitia-name"
                  type="text"
                  value={formData.headOfPanitiaName}
                  onChange={(e) => setFormData({ ...formData, headOfPanitiaName: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#800000]" />
                  No. Tel Sekolah / Panitia
                </label>
                <input
                  id="input-head-panitia-phone"
                  type="text"
                  placeholder="087 - 221980"
                  value={formData.headOfPanitiaPhone}
                  onChange={(e) => setFormData({ ...formData, headOfPanitiaPhone: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Guru Besar
                </label>
                <input
                  id="input-guru-besar-name"
                  type="text"
                  value={formData.guruBesarName}
                  onChange={(e) => setFormData({ ...formData, guruBesarName: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama PK Pentadbiran
                </label>
                <input
                  id="input-pk-pentadbiran-name"
                  type="text"
                  value={formData.pkPentadbiranName}
                  onChange={(e) => setFormData({ ...formData, pkPentadbiranName: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              id="btn-cancel-settings"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-save-settings"
              className="px-6 py-2.5 text-sm font-black text-amber-300 bg-[#800000] hover:bg-[#600000] rounded-lg shadow-md border border-amber-500/40 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Simpan Maklumat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
