export interface FileItem {
  id: string;
  category: PanelCategory;
  itemCode: string; // e.g. "1.1", "1.2", "2.1"
  title: string;
  description?: string;
  status: 'ADA' | 'TIADA' | 'TB';
  notes: string;
  documentUrl?: string;
  documentType?: 'pdf' | 'doc' | 'link' | 'image' | 'template';
  documentName?: string;
  updatedAt: string;
  verifiedBy?: string;
  isImportant?: boolean;
}

export type PanelCategory =
  | 'pengurusan_am'
  | 'pekeliling'
  | 'mesyuarat'
  | 'pentaksiran'
  | 'perancangan_strategik'
  | 'kewangan';

export interface PanelMeta {
  key: PanelCategory;
  fileNumber: number;
  code: string;
  name: string;
  description: string;
  color: string;
  badgeBg: string;
  iconName: string;
  standardSKPM: string;
}

export interface MonitoringSession {
  id: string;
  date: string;
  monitorRole: 'Guru Besar' | 'Penolong Kanan Pentadbiran' | 'Pegawai PPD' | 'Pegawai JPN' | 'Lain-lain';
  monitorName: string;
  monitorNip?: string;
  monitorPhone?: string;
  sessionTitle: string; // e.g. "Pemantauan Pengurusan Fail Panitia Bil. 1/2026"
  scorePercentage: number;
  totalItems: number;
  adaCount: number;
  tiadaCount: number;
  tbCount: number;
  checklistSnapshot: {
    itemId: string;
    itemCode: string;
    title: string;
    category: PanelCategory;
    status: 'ADA' | 'TIADA' | 'TB';
    notes: string;
  }[];
  strengths: string; // Kekuatan
  improvements: string; // Aspek Perlu Ditambahbaik
  guidance: string; // Bimbingan & Syor Pemantau
  followUpDeadline: string; // Tarikh Tindakan Susulan
  headOfDepartmentSignature: {
    signed: boolean;
    name: string;
    date: string;
  };
  monitorSignature: {
    signed: boolean;
    name: string;
    date: string;
  };
  status: 'Draf' | 'Selesai' | 'Perlu Tindakan';
}

export interface SchoolProfile {
  schoolName: string;
  schoolCode: string;
  panitiaName: string;
  headOfPanitiaName: string;
  headOfPanitiaPhone: string;
  guruBesarName: string;
  pkPentadbiranName: string;
  academicYear: string;
  ppdName: string;
  stateDepartment: string;
  customLogoUrl?: string;
  logoChoice?: 'sk_kepawa' | 'jata_negara';
  panitiaDriveUrl?: string;
}
