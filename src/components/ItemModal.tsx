import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, Save, FileText, Link, Calendar, User } from 'lucide-react';
import { FileItem, PanelCategory } from '../types';
import { PANELS_METADATA } from '../data/initialData';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<FileItem>) => void;
  editingItem: FileItem | null;
  defaultCategory?: PanelCategory;
  defaultVerifier?: string;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  defaultCategory = 'pengurusan_am',
  defaultVerifier = 'Noradilah binti Ribut',
}) => {
  const [formData, setFormData] = useState<Partial<FileItem>>({
    category: defaultCategory,
    itemCode: '',
    title: '',
    description: '',
    status: 'ADA',
    notes: '',
    documentUrl: '',
    documentName: '',
    verifiedBy: defaultVerifier,
    isImportant: false,
    updatedAt: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
      });
    } else {
      setFormData({
        category: defaultCategory,
        itemCode: '',
        title: '',
        description: '',
        status: 'ADA',
        notes: '',
        documentUrl: '',
        documentName: '',
        verifiedBy: defaultVerifier,
        isImportant: false,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [editingItem, defaultCategory, defaultVerifier, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) {
      newErrors.title = 'Nama item / tajuk dokumen diperlukan.';
    }
    if (!formData.itemCode?.trim()) {
      newErrors.itemCode = 'Kod item (contoh: 1.12, 3.5) diperlukan.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-amber-500/40 overflow-hidden my-8">
        {/* Header - Maroon & Gold */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4A080B] via-[#650E13] to-[#2E0507] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/50 rounded-xl border border-amber-500/40">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">
                {editingItem ? 'Kemaskini Dokumen / Item Fail' : 'Tambah Dokumen / Item Baru'}
              </h2>
              <p className="text-xs text-amber-200/90">
                Panitia Pendidikan Islam SK Kepawa • Instrumen Selia Bantu
              </p>
            </div>
          </div>
          <button
            id="btn-close-item-modal"
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1.5 rounded-lg hover:bg-black/30 transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Category & Item Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Fail Panitia <span className="text-rose-500">*</span>
              </label>
              <select
                id="input-category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as PanelCategory })
                }
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#800000] font-bold"
              >
                {PANELS_METADATA.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.code}: {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kod Item <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-item-code"
                type="text"
                placeholder="cth: 1.12"
                value={formData.itemCode}
                onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                className={`w-full text-sm rounded-lg border p-2.5 focus:ring-2 focus:ring-[#800000] font-mono font-bold ${
                  errors.itemCode ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.itemCode && <p className="text-xs text-rose-600 mt-1">{errors.itemCode}</p>}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Item / Tajuk Dokumen <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-item-title"
              type="text"
              placeholder="cth: Dokumen Standard Kurikulum dan Pentaksiran (DSKP)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full text-sm rounded-lg border p-2.5 focus:ring-2 focus:ring-[#800000] font-bold ${
                errors.title ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Huraian / Skop Dokumen
            </label>
            <textarea
              id="input-item-description"
              rows={2}
              placeholder="Keterangan ringkas tentang kandungan atau tujuan dokumen ini..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] bg-white"
            />
          </div>

          {/* Status Selection (ADA / TIADA / TB) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Status Keberadaan Dokumen (Instrumen Selia Bantu) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label
                className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center transition-all ${
                  formData.status === 'ADA'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-black shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="ADA"
                  checked={formData.status === 'ADA'}
                  onChange={() => setFormData({ ...formData, status: 'ADA' })}
                  className="sr-only"
                />
                <CheckCircle2 className={`w-6 h-6 mb-1 ${formData.status === 'ADA' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-sm">ADA (Lengkap)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-normal">Tersedia dalam fail</span>
              </label>

              <label
                className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center transition-all ${
                  formData.status === 'TIADA'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-black shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="TIADA"
                  checked={formData.status === 'TIADA'}
                  onChange={() => setFormData({ ...formData, status: 'TIADA' })}
                  className="sr-only"
                />
                <AlertCircle className={`w-6 h-6 mb-1 ${formData.status === 'TIADA' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="text-sm">TIADA (Perlu Tindakan)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-normal">Perlu disediakan</span>
              </label>

              <label
                className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center transition-all ${
                  formData.status === 'TB'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-black shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="TB"
                  checked={formData.status === 'TB'}
                  onChange={() => setFormData({ ...formData, status: 'TB' })}
                  className="sr-only"
                />
                <HelpCircle className={`w-6 h-6 mb-1 ${formData.status === 'TB' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-sm">TB (Tidak Berkaitan)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-normal">Dikecualikan</span>
              </label>
            </div>
          </div>

          {/* Notes (Catatan) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Pegawai / Penjelasan (Jika tidak berkaitan, tulis TB)
            </label>
            <textarea
              id="input-item-notes"
              rows={2}
              placeholder="Catatan status, lokasi fizikal, tarikh semak, atau alasan jika ditanda TB..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] bg-white"
            />
          </div>

          {/* Document Link / URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-[#800000]" />
                  Pautan Dokumen / Google Drive
                </span>
                {formData.documentUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.documentUrl) {
                        window.open(formData.documentUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 hover:underline"
                  >
                    Buka Pautan ↗
                  </button>
                )}
              </label>
              <div className="relative">
                <input
                  id="input-document-url"
                  type="text"
                  placeholder="https://drive.google.com/... atau fail PDF"
                  value={formData.documentUrl || ''}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] bg-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#800000]" />
                Pegawai / Guru Pengesah (Ketua Panitia)
              </label>
              <input
                id="input-verified-by"
                type="text"
                placeholder="Nama Pengesah"
                value={formData.verifiedBy || ''}
                onChange={(e) => setFormData({ ...formData, verifiedBy: e.target.value })}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#800000] bg-white font-medium"
              />
            </div>
          </div>

          {/* Date & Important toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600 font-semibold">Tarikh Kemaskini:</span>
              <input
                id="input-updated-at"
                type="date"
                value={formData.updatedAt}
                onChange={(e) => setFormData({ ...formData, updatedAt: e.target.value })}
                className="text-xs rounded border border-slate-300 px-2 py-1 bg-white font-medium"
              />
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                id="input-is-important"
                type="checkbox"
                checked={formData.isImportant || false}
                onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                className="w-4 h-4 rounded text-[#800000] focus:ring-[#800000] border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700">
                Tanda sebagai Dokumen Keutamaan Tinggi (SKPM)
              </span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              id="btn-cancel-modal"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-item-modal"
              className="px-6 py-2.5 text-sm font-black text-amber-300 bg-[#800000] hover:bg-[#600000] rounded-lg shadow-md border border-amber-500/40 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              {editingItem ? 'Kemaskini Item' : 'Simpan Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
