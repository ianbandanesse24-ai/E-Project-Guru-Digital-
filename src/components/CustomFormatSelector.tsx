import React, { useState, useRef, useEffect } from 'react';
import {
  FileUp,
  FileText,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  Eye,
  Upload,
  Bookmark,
  BookmarkPlus,
  BookmarkCheck,
  Save,
  Copy,
  Check,
  Plus,
  Download,
  Sparkles,
  FolderHeart,
  FileEdit,
  X,
  Search,
  RotateCcw,
} from 'lucide-react';
import { UniversalFileParser, FileCategory } from '../lib/universalFileParser';

export interface CustomFormatFile {
  name: string;
  size: number;
  type: FileCategory | string;
  mimeType: string;
  base64?: string;
  extractedText?: string;
  tableMarkdown?: string;
  previewUrl?: string;
  sheetNames?: string[];
  summaryText?: string;
}

export interface CustomFormatConfig {
  useCustomFormat: boolean;
  formatFile: CustomFormatFile | null;
  customFormatNotes: string;
}

export interface SavedCustomTemplate {
  id: string;
  name: string;
  category: string; // 'modul_ajar' | 'rpm' | 'tp' | 'atp' | 'umum'
  description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  isBuiltIn?: boolean;
}

export const STORAGE_KEY_SAVED_TEMPLATES = 'agk_saved_custom_templates_v5';

export const INITIAL_BUILTIN_TEMPLATES: SavedCustomTemplate[] = [
  {
    id: 'template_standar_baku_mutlak_rpm_deep_learning',
    name: 'Standar Baku Mutlak RPM Deep Learning (Format Resmi Terpadu)',
    category: 'rpm',
    description: 'Format Standar Baku Mutlak Rencana Pelaksanaan Modul (RPM) Deep Learning: Identitas Modul, Kompetensi Dicapai, Skema 6 Fase Pedagogis, Sintaks Deep Learning, Skenario KBM 6 Kolom Lengkap, Asesmen & Rubrik KKTP, Media/Alat, Matriks Berdiferensiasi, Refleksi Guru, dan Pengesahan Dokumen.',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    notes: `STANDAR BAKU MUTLAK RPM (RENCANA PELAKSANAAN MODUL) DEEP LEARNING:

A. IDENTITAS MODUL (Tabel 2 Kolom: Parameter | Keterangan):
   - Satuan Pendidikan
   - Penyusun / Guru Pengampu
   - NIP Guru
   - Tahun Ajaran
   - Jenjang / Fase / Kelas
   - Semester
   - Mata Pelajaran
   - Materi Pokok
   - Sub Materi Tiap Pertemuan (dengan penomoran kode [TP.X.Y])
   - Alokasi Waktu Total (dalam Menit dan JP, misal: 270 Menit (2 Pertemuan × 135 Menit / Pertemuan = 6 JP))
   - Model Pembelajaran: Deep Learning (6 Fase Sintaks: Mindful, Meaningful, Joyful Learning)
   - Pendekatan & Metode: Saintifik, Inkuiri Terbimbing, Kontekstual, Diskusi Kelompok, Eksplorasi Nyata, Think-Pair-Share
   - Target Peserta Didik: Peserta Didik Reguler/Tipikal, Peserta Didik dengan Kesulitan Belajar (Scaffolding), dan Peserta Didik Berprestasi Cepat (Pengayaan)

B. KOMPETENSI YANG DICAPAI:
   - Capaian Pembelajaran (CP) Elemen & Rasional (dengan penanda 📌)
   - Tujuan Pembelajaran (TP) Operasional (HOTS Berbasis Kaidah ABCD dengan Kode [TP.X.Y])
   - Pemahaman Bermakna (Meaningful Learning)
   - Pertanyaan Pemantik (Sparking Questions HOTS)

III. SKEMA SIKLUS 6 FASE PEDAGOGIS DEEP LEARNING (Diagram Alur Mindful, Meaningful, Joyful Learning)

C. SINTAKS (DESAIN PEMBELAJARAN DEEP LEARNING):
   Tabel 4 Kolom: FASE SINTAKS | NAMA TAHAPAN | PILAR PEDAGOGIS | TUJUAN DAN FOKUS AKTIVITAS KELAS (Fase 1 s.d. Fase 6)

D. LANGKAH-LANGKAH PEMBELAJARAN (TABEL SKENARIO KBM LENGKAP TIAP PERTEMUAN):
   Header Tiap Pertemuan:
   - Pertemuan Ke [X] ([Total Menit] Menit)
   - Materi / Sub Pokok Bahasan : [TP.X.Y] [Sub Materi]
   - Tujuan Pembelajaran (TP) : [TP.X.Y] [Rumusan TP]
   
   Tabel Skenario KBM 6 Kolom Lengkap:
   | TAHAP KEGIATAN | FASE SINTAKS DEEP LEARNING | ALOKASI WAKTU | KEGIATAN GURU (LENGKAP DARI AWAL MASUK KELAS) | KEGIATAN PESERTA DIDIK (AKTIF & RESPONSIF) | ASPEK 3 PILAR & 6C |
   
   1. A. KEGIATAN PENDAHULUAN (FASE 1: Orientasi, Apersepsi & Motivasi / Review Materi - 20 Menit):
      - Guru: Salam ramah & kerapian kelas, Doa bersama dipimpin ketua kelas (Religius), Presensi & Mindful Breathing (STOP 2 Menit), Apersepsi kontekstual stimulus fenomena nyata, Pertanyaan pemantik HOTS lisan, Penyampaian TP & skenario 6 fase KBM, Pembentukan kelompok heterogen (4-5 siswa).
      - Peserta Didik: Menjawab salam santun, Berdoa khusyuk, Mengikuti Mindful Breathing, Menyimak apersepsi, Merespons pertanyaan pemantik spontan, Mencatat TP di buku tulis, Bergabung ke kelompok secara tertib.
      - Aspek: Mindful Learning (Beriman & Bertakwa, Kesadaran Diri / Mindfulness, Komunikasi Awal).
      
   2. B. KEGIATAN INTI (Meaningful & Joyful Learning):
      - FASE 2: Eksplorasi Konsep & Penyelidikan Inkuiri (38 Menit):
        * Guru: Distribusi LKPD & kit media konkret, pembagian peran kerja tim (Ketua, Notulis, Alat, Presenter), fasilitasi eksperimen/eksplorasi objek nyata, bimbingan berjenjang (scaffolding & socratic questions).
        * Siswa: Menerima LKPD, berbagi peran secara adil (Gotong Royong), melakukan penyelidikan & mencatat data empiris jujur, berdiskusi aktif membedah data.
      - FASE 3: Penjelasan, Elaborasi & Penguatan Ilmiah (33 Menit):
        * Guru: Mempersilakan presentasi pleno/jigsaw kelompok, memoderatori tanya jawab kelas santun & demokratis, elaborasi konsep di papan tulis, penegasan notasi rumus ilmiah & pelurusan miskonsepsi.
        * Siswa: Presentasi perwakilan lugas (Communication), kelompok lain menyimak kritis & memberi apresiasi, mencatat penguatan guru & rumus di buku, menyempurnakan LKPD.
      - FASE 4: Aplikasi & Pemecahan Masalah Kontekstual (24 Menit):
        * Guru: Memberikan studi kasus nyata tantangan HOTS terapan / rekayasa industri, memandu aktivitas Think-Pair-Share kolaboratif, memberikan umpan balik formatif langsung (real-time).
        * Siswa: Menganalisis tantangan mandiri (Think), diskusi pasangan tim (Pair), berbagi solusi pleno (Share), mencatat metode analisis efisien.
        
   3. C. KEGIATAN PENUTUP (Joyful & Mindful Connection - 20 Menit):
      - FASE 5: Refleksi Mendalam & Metakognisi (Pola 3-2-1 / What So What Now What - 10 Menit):
        * Guru: Memandu pengisian Refleksi 3-2-1, memberikan apresiasi verbal & penghargaan positif atas kolaborasi kelas.
        * Siswa: Mengisi lembar refleksi berkesadaran metakognitif, 2 siswa sukarela membacakan di depan kelas, saling memberi tepuk tangan apresiasi antarteman.
      - FASE 6: Simpulan Bersama, Tindak Lanjut & Doa Penutup (10 Menit):
        * Guru: Merumuskan simpulan terpadu bersama siswa, memberikan tugas pengayaan kontekstual di lingkungan rumah, menyampaikan info materi pertemuan berikutnya, memandu doa penutup khusyuk bersyukur & salam penutup hangat.
        * Siswa: Menyampaikan kesimpulan antusias dengan kata-kata sendiri, mencatat tugas mandiri, menyimak rencana KBM berikutnya, berdoa penutup khidmat & membalas salam tertib.

E. ASESMEN PEMBELAJARAN:
   - Tabel Asesmen 4 Kolom (Jenis Asesmen: Diagnostik Awal, Formatif Proses LKPD & Diskusi, Sumatif Akhir HOTS | Bentuk & Instrumen | Waktu Pelaksanaan | Aspek & Indikator yang Dinilai)
   - Panduan Rubrik Ketercapaian Tujuan Pembelajaran (KKTP) 5 Kolom (Kriteria Capaian: Pemahaman Konsep, Keterampilan Penyelidikan & LKPD, Sikap & Kolaborasi 6C | Perlu Bimbingan 0-64% | Cukup 65-74% | Baik 75-87% | Sangat Baik 88-100%)

E. MEDIA, ALAT, DAN SUMBER BELAJAR:
   - Media Pembelajaran Interaktif (Video animasi kontekstual, Slide infografis visual, LKPD Deep Learning, Papan tulis/Mind Map)
   - Alat dan Bahan Praktik Konkret (Kit peraga/investigasi konkret, Benda kontekstual lingkungan, Sticky notes & spidol warna, LCD Proyektor & Laptop)
   - Sumber Belajar Resmi (Buku Teks Siswa Kemendikbudristek RI, Buku Panduan Guru Kemendikbudristek RI, Modul Digital Kurikulum Merdeka, Portal Simulasi Edukasi)

VIII. MATRIKS PEMBELAJARAN BERDIFERENSIASI:
   - Skema Matriks Alur Visual (Diferensiasi Konten, Diferensiasi Proses, Diferensiasi Produk)
   - Tabel Diferensiasi 4 Kolom (Kategori Peserta Didik: Reguler, Kesulitan Belajar / Scaffolding, Berpencapaian Cepat / Mahir | Diferensiasi Konten | Diferensiasi Proses | Diferensiasi Produk)

H. REFLEKSI GURU:
   - Tabel 2 Kolom (Aspek Refleksi: 1. Ketercapaian TP, 2. Efektivitas Sintaks Deep Learning, 3. Partisipasi & Antusiasme Siswa, 4. Kendala & Miskonsepsi, 5. Rencana Perbaikan | Catatan Evaluatif Guru)

X. PENGESAHAN DOKUMEN:
   - Kolom Tanda Tangan Resmi: Kepala Satuan Pendidikan dan Guru Mata Pelajaran lengkap dengan NIP.`,
  },
];

export function getSavedTemplates(): SavedCustomTemplate[] {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return INITIAL_BUILTIN_TEMPLATES;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY_SAVED_TEMPLATES);
    let parsed: SavedCustomTemplate[] = [];
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) parsed = p;
    }
    // Filter out old built-in templates and purge any obsolete RPM templates so Deep Learning is the sole standard
    const userCustomTemplates = parsed.filter(
      (t) => !t.isBuiltIn && t.category !== 'rpm' && !INITIAL_BUILTIN_TEMPLATES.some((b) => b.id === t.id)
    );
    const merged = [...INITIAL_BUILTIN_TEMPLATES, ...userCustomTemplates];
    window.localStorage.setItem(STORAGE_KEY_SAVED_TEMPLATES, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error('Error loading saved templates:', err);
    return INITIAL_BUILTIN_TEMPLATES;
  }
}

export function saveTemplatesToStorage(templates: SavedCustomTemplate[]): void {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY_SAVED_TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Error saving templates:', err);
  }
}

export function exportTemplatesAsJSON(templates: SavedCustomTemplate[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(templates, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `Templat_RPM_Guru_AGK_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

interface CustomFormatSelectorProps {
  value: CustomFormatConfig;
  onChange: (config: CustomFormatConfig) => void;
  docTypeName?: string;
  docTypeId?: string;
  compact?: boolean;
}

export const DOCUMENT_PRESETS: Record<string, { id: string; label: string; notes: string }[]> = {
  analisis_alokasi_waktu: [
    {
      id: 'alokasi_waktu_standar_sekolah',
      label: 'Format Tabel Analisis Alokasi Waktu (RBE) Resmi Sekolah',
      notes: `1. IDENTITAS DOKUMEN (Satuan Pendidikan, Mata Pelajaran, Jenjang/Kelas/Fase, Semester Ganjil & Genap, Tahun Pelajaran, Guru Pengampu, NIP)
2. DASAR HUKUM & ACUAN KALENDER PENDIDIKAN RESMI
3. PERHITUNGAN PEKAN EFEKTIF SEMESTER (Tabel Matriks Bulanan: No, Nama Bulan, Jumlah Pekan Kalender, Pekan Tidak Efektif, Pekan Efektif KBM, Keterangan/Agenda Sekolah)
4. DISTRIBUSI ALOKASI JAM PELAJARAN (JP):
   - Jumlah Jam Pelajaran Efektif (Pekan Efektif × Beban JP/Minggu)
   - Cadangan Jam Pelajaran (Asesmen Sumatif Lingkup Materi, Remedial, Pengayaan, Kegiatan Sekolah)
   - Jam Efektif Tatap Muka KBM Murni
5. TABEL DISTRIBUSI MATERI POKOK / TP KE DALAM ALOKASI JP
6. KOLOM PENGESAHAN DOKUMEN (Kepala Satuan Pendidikan & Guru Mata Pelajaran)`,
    },
    {
      id: 'alokasi_waktu_dinas_provinsi',
      label: 'Format Rincian Minggu Efektif (RME) Standar Dinas Pendidikan',
      notes: `A. PERHITUNGAN RINCIAN MINGGU EFEKTIF (RME) BERDASARKAN KALENDER PENDIDIKAN RESMI
B. RINCIAN MINGGU TIDAK EFEKTIF (MPLS, Libur Awal/Akhir Puasa, Libur Hari Raya, Penilaian Sumatif, Libur Semester)
C. REKAPITULASI JUMLAH JAM PELAJARAN SEMESTER GANJIL & GENAP
D. MATRIKS DISTRIBUSI ALOKASI WAKTU PER ELEMEN & TUJUAN PEMBELAJARAN (TP)
E. PENGESAHAN KEPALA SEKOLAH, GURU PENGAMPU & MENGETAHUI PENGAWAS PEMBINA`,
    },
  ],
  alokasi_waktu: [
    {
      id: 'alokasi_waktu_standar_sekolah',
      label: 'Format Tabel Analisis Alokasi Waktu (RBE) Resmi Sekolah',
      notes: `1. IDENTITAS DOKUMEN (Satuan Pendidikan, Mata Pelajaran, Jenjang/Kelas/Fase, Semester Ganjil & Genap, Tahun Pelajaran, Guru Pengampu)
2. PERHITUNGAN PEKAN EFEKTIF (Tabel Bulan, Jumlah Pekan, Pekan Tidak Efektif, Pekan Efektif, Keterangan)
3. DISTRIBUSI ALOKASI JAM PELAJARAN (Total JP, Cadangan, Efektif Tatap Muka)
4. DISTRIBUSI MATERI POKOK PER ALOKASI JP
5. PENGESAHAN KEPALA SEKOLAH & GURU`,
    },
  ],
  analisis_cp: [
    {
      id: 'analisis_cp_tabel',
      label: 'Format Tabel Analisis CP & Elemen Sekolah',
      notes: `1. IDENTITAS PERANGKAT (Satuan Pendidikan, Mapel, Fase/Kelas, Semester, Tahun Pelajaran)
2. CAPAIAN PEMBELAJARAN (CP) RESMI
3. DEKOMPOSISI ELEMEN & ANALISIS KOMPETENSI ESENSIAL (Tabel: No, Elemen CP, Kalimat CP, Kompetensi HOTS, Materi Esensial)
4. INTEGRASI 3 PILAR DEEP LEARNING (Mindful, Meaningful, Joyful Learning)
5. PEMETAAN DIMENSI PROFIL PELAJAR PANCASILA
6. STRATEGI PEMBELAJARAN BERDIFERENSIASI (Konten, Proses, Produk)`,
    },
    {
      id: 'analisis_cp_deep_learning_matriks',
      label: 'Format Matriks 6 Kolom Analisis CP (Deep Learning & Profil Pancasila)',
      notes: `1. KOP RESMI SATUAN PENDIDIKAN & IDENTITAS GURU
2. CAPAIAN PEMBELAJARAN (CP) RESMI FASE & KELAS
3. TABEL MATRIKS ANALISIS CP LENGKAP:
   | No | Elemen CP | Kalimat Capaian Pembelajaran | Materi Pokok Esensial | Rumusan Tujuan Pembelajaran (TP) | Dimensi Profil Pancasila & 3 Pilar Deep Learning | Alokasi JP |
4. DISTRIBUSI ALOKASI WAKTU SEMESTER 1 (GANJIL) & SEMESTER 2 (GENAP)
5. PENGESAHAN DOKUMEN: Kepala Satuan Pendidikan dan Guru Pengampu (Lengkap dengan NIP)`,
    },
    {
      id: 'analisis_cp_mgmp',
      label: 'Format Analisis CP Standar MGMP / MKKS',
      notes: `A. RASIONAL & CAPAIAN PEMBELAJARAN FASE
B. PEMETAAN ELEMEN CAPAIAN & KOMPETENSI KUNCI
C. ANALISIS MATERI POKOK ESENSIAL & ALOKASI WAKTU
D. INDIKATOR CAPAIAN PEMBELAJARAN
E. RENCANA PENILAIAN & ASESMEN AUTENTIK`,
    },
  ],
  tp: [
    {
      id: 'tp_abcd',
      label: 'Format TP Komponen ABCD & Taksonomi Bloom',
      notes: `1. IDENTITAS SATUAN PENDIDIKAN & MATA PELAJARAN
2. CAPAIAN PEMBELAJARAN FASE / KELAS
3. TABEL RUMUSAN TUJUAN PEMBELAJARAN (TP):
   - Kode TP
   - Rumusan TP (Komponen: Audience, Behavior, Condition, Degree)
   - Kata Kerja Operasional (KKO Bloom HOTS)
   - Dimensi Profil Pelajar Pancasila
   - Pemahaman Bermakna (Deep Meaning)`,
    },
    {
      id: 'tp_elemen',
      label: 'Format TP Matriks Elemen & Kompetensi',
      notes: `A. TUJUAN PEMBELAJARAN ELEMEN PEMAHAMAN KONSEPTUAL
B. TUJUAN PEMBELAJARAN ELEMEN KETERAMPILAN PROSES
C. TUJUAN PEMBELAJARAN SIKAP & PROFIL PANCASILA
D. INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN (IKTP)`,
    },
  ],
  atp: [
    {
      id: 'atp_matriks',
      label: 'Format Matriks ATP & Alokasi JP Sekolah',
      notes: `1. IDENTITAS ATP (Fase, Kelas, Mapel, Alokasi Total Jam Pertahun)
2. CAPAIAN PEMBELAJARAN PER ELEMEN
3. TABEL ALUR TUJUAN PEMBELAJARAN (ATP):
   - No Urut / Tahap
   - Kode & Rumusan TP
   - Lingkup Materi Esensial
   - Alokasi Waktu (JP)
   - Pendekatan Deep Learning & Model Pembelajaran
   - Profil Pelajar Pancasila
   - Glosarium & Kata Kunci`,
    },
    {
      id: 'atp_kronologis',
      label: 'Format Bagan Alur Tahapan Kronologis',
      notes: `A. TAHAP 1: PENGUASAAN KONSEP DASAR (SEMESTER 1)
B. TAHAP 2: APLIKASI & ANALISIS MASALAH KONTEKSTUAL (SEMESTER 1)
C. TAHAP 3: INVESTIGASI & EKSPERIMEN MENDALAM (SEMESTER 2)
D. TAHAP 4: KREASI SOLUSI, PROYEK & REFLEKSI AKHIR (SEMESTER 2)`,
    },
  ],
  prota: [
    {
      id: 'prota_standar',
      label: 'Format PROTA Tabel Distribusi JP Sekolah',
      notes: `1. KOP RESMI SEKOLAH & IDENTITAS PROGRAM TAHUNAN
2. PERHITUNGAN ALOKASI WAKTU EFEKTIF PER TAHUN
3. TABEL DISTRIBUSI ALOKASI PROTA:
   - Semester (Ganjil & Genap)
   - Nomor Bab / Lingkup Materi
   - Alur Tujuan Pembelajaran (ATP / TP)
   - Alokasi Jam Pelajaran (JP)
   - Keterangan Waktu Asesmen & Cadangan
4. REKAPITULASI TOTAL JP & PENGESAHAN KEPALA SEKOLAH`,
    },
  ],
  prosem: [
    {
      id: 'prosem_matriks',
      label: 'Format PROSEM Matriks Pekan Efektif Bulanan',
      notes: `1. IDENTITAS PROGRAM SEMESTER (Semester Ganjil / Genap, Mapel, Kelas/Fase, Alokasi Total JP & JP/Pekan, Guru Pengampu)
2. TABEL MATRIKS PROSEM SINKRON KALPEN:
   - Kolom: No | ATP | LINGKUP MATERI | JP | BULAN (Januari/Juli dst: Minggu 1, 2, 3, 4)
3. LEGENDA KODE KEGIATAN PROSEM
4. TANDA TANGAN PENYUSUN & KEPALA SEKOLAH`,
    },
  ],
  lkpd: [
    {
      id: 'lkpd_eksploratif',
      label: 'Format LKPD Eksploratif 4 Langkah',
      notes: `1. KOP LKPD SEKOLAH, IDENTITAS SISWA / KELOMPOK, KELAS & MAPEL
2. TUJUAN PEMBELAJARAN & PETUNJUK PENGERJAAN
3. STIMULUS / STUDI KASUS KONTEKSTUAL
4. LANGKAH-LANGKAH AKTIVITAS SISWA
5. PERTANYAAN ANALISIS HOTS
6. KESIMPULAN & REFLEKSI DIRI SISWA`,
    },
    {
      id: 'lkpd_bertingkat',
      label: 'Format LKPD Bertingkat (Tiered Assignment)',
      notes: `A. TINGKAT DASAR
B. TINGKAT MENENGAH
C. TINGKAT MAHIR / PENGAYAAN`,
    },
  ],
  kktp: [
    {
      id: 'kktp_rubrik',
      label: 'Format KKTP Rubrik Deskripsi 4 Kriteria',
      notes: `1. IDENTITAS KKTP (Mapel, Kelas, Fase, Semester, TP Pokok)
2. TABEL RUBRIK KRITERIA KETUNTASAN:
   - Aspek / Indikator Penilaian
   - Kategori 1: Perlu Bimbingan (0 - 65)
   - Kategori 2: Cukup (66 - 75)
   - Kategori 3: Baik (76 - 88)
   - Kategori 4: Sangat Baik (89 - 100)
3. TINDAK LANJUT HASIL KKTP`,
    },
  ],
  modul_ajar: [
    {
      id: 'rpm_standar_baku_mutlak_deep_learning',
      label: 'Format Standar Baku Mutlak RPM Deep Learning (Format Resmi Terpadu)',
      notes: `A. IDENTITAS MODUL (Tabel 2 Kolom: Satuan Pendidikan, Penyusun / Guru Pengampu, NIP Guru, Tahun Ajaran, Jenjang / Fase / Kelas, Semester, Mata Pelajaran, Materi Pokok, Sub Materi Tiap Pertemuan [TP.X.Y], Alokasi Waktu Total dalam Menit & JP, Model Pembelajaran Deep Learning 6 Fase Sintaks, Pendekatan & Metode, Target Peserta Didik)

B. KOMPETENSI YANG DICAPAI:
   - Capaian Pembelajaran (CP) Elemen & Rasional (📌)
   - Tujuan Pembelajaran (TP) Operasional (HOTS Berbasis Kaidah ABCD dengan Kode [TP.X.Y])
   - Pemahaman Bermakna (Meaningful Learning)
   - Pertanyaan Pemantik (Sparking Questions HOTS)

III. SKEMA SIKLUS 6 FASE PEDAGOGIS DEEP LEARNING (Diagram Alur Mindful, Meaningful, Joyful Learning)

C. SINTAKS (DESAIN PEMBELAJARAN DEEP LEARNING):
   Tabel 4 Kolom: FASE SINTAKS | NAMA TAHAPAN | PILAR PEDAGOGIS | TUJUAN DAN FOKUS AKTIVITAS KELAS (Fase 1 s.d. Fase 6)

D. LANGKAH-LANGKAH PEMBELAJARAN (TABEL SKENARIO KBM LENGKAP TIAP PERTEMUAN):
   - Header: Pertemuan Ke [X] ([Total Menit] Menit), Materi / Sub Pokok Bahasan [TP.X.Y], Tujuan Pembelajaran (TP) [TP.X.Y]
   - Tabel Skenario 6 Kolom: TAHAP KEGIATAN | FASE SINTAKS DEEP LEARNING | ALOKASI WAKTU | KEGIATAN GURU (DARI SALAM AWAL MASUK KELAS) | KEGIATAN PESERTA DIDIK (AKTIF & RESPONSIF) | ASPEK 3 PILAR & 6C
   - Tahap A: KEGIATAN PENDAHULUAN (FASE 1: Orientasi, Apersepsi & Motivasi / Review Materi - Salam, Doa Bersama, Presensi & Mindful Breathing Teknik STOP 2 Menit, Apersepsi Kontekstual Fenomena Nyata, Pertanyaan Pemantik HOTS, Skenario KBM 6 Fase, Pembentukan Kelompok Heterogen)
   - Tahap B: KEGIATAN INTI:
     * FASE 2: Eksplorasi Konsep & Penyelidikan Inkuiri (Distribusi LKPD & Media Peraga, Pembagian Peran Kerja Tim, Fasilitasi Eksplorasi Objek Nyata, Bimbingan Berjenjang Scaffolding)
     * FASE 3: Penjelasan, Elaborasi & Penguatan Ilmiah (Presentasi Pleno / Jigsaw Kelompok, Moderasi Diskusi Kelas Santun, Elaborasi Konsep di Papan Tulis, Notasi Ilmiah Baku & Pelurusan Miskonsepsi)
     * FASE 4: Aplikasi & Pemecahan Masalah Kontekstual (Studi Kasus Tantangan Terapan HOTS, Kolaborasi Think-Pair-Share, Umpan Balik Formatif Langsung)
   - Tahap C: KEGIATAN PENUTUP:
     * FASE 5: Refleksi Mendalam & Metakognisi (Pola 3-2-1 / What So What Now What, Apresiasi Karakter)
     * FASE 6: Simpulan Bersama, Tindak Lanjut & Doa Penutup (Simpulan Terpadu, Tugas Pengayaan / Proyek Mini Kreatif, Rencana KBM Berikutnya, Doa Khusyuk Bersyukur, & Salam Hangat)

E. ASESMEN PEMBELAJARAN:
   - Tabel Asesmen 4 Kolom: Jenis Asesmen (Diagnostik Awal, Formatif Proses LKPD & Diskusi, Sumatif Akhir HOTS) | Bentuk & Instrumen | Waktu Pelaksanaan | Aspek & Indikator
   - Panduan Rubrik Ketercapaian Tujuan Pembelajaran (KKTP) 5 Kolom: Kriteria Capaian | Perlu Bimbingan (0 - 64%) | Cukup (65 - 74%) | Baik (75 - 87%) | Sangat Baik (88 - 100%)

E. MEDIA, ALAT, DAN SUMBER BELAJAR:
   - Media Pembelajaran Interaktif
   - Alat dan Bahan Praktik Konkret
   - Sumber Belajar Resmi

VIII. MATRIKS PEMBELAJARAN BERDIFERENSIASI:
   - Skema Matriks Alur (Konten, Proses, Produk)
   - Tabel Diferensiasi 4 Kolom: Kategori Peserta Didik (Reguler, Kesulitan Belajar / Scaffolding, Berpencapaian Cepat / Mahir) | Diferensiasi Konten | Diferensiasi Proses | Diferensiasi Produk

H. REFLEKSI GURU:
   - Tabel 2 Kolom: Aspek Refleksi (1. Ketercapaian TP, 2. Efektivitas Sintaks, 3. Partisipasi Siswa, 4. Kendala & Miskonsepsi, 5. Rencana Perbaikan) | Catatan Evaluatif Guru

X. PENGESAHAN DOKUMEN:
   - Kolom Tanda Tangan Resmi: Kepala Satuan Pendidikan dan Guru Mata Pelajaran lengkap dengan NIP`,
    },
  ],
  rpm: [
    {
      id: 'rpm_standar_baku_mutlak_deep_learning',
      label: 'Format Standar Baku Mutlak RPM Deep Learning (Format Resmi Terpadu)',
      notes: `A. IDENTITAS MODUL (Tabel 2 Kolom: Satuan Pendidikan, Penyusun / Guru Pengampu, NIP Guru, Tahun Ajaran, Jenjang / Fase / Kelas, Semester, Mata Pelajaran, Materi Pokok, Sub Materi Tiap Pertemuan [TP.X.Y], Alokasi Waktu Total dalam Menit & JP, Model Pembelajaran Deep Learning 6 Fase Sintaks, Pendekatan & Metode, Target Peserta Didik)

B. KOMPETENSI YANG DICAPAI:
   - Capaian Pembelajaran (CP) Elemen & Rasional (📌)
   - Tujuan Pembelajaran (TP) Operasional (HOTS Berbasis Kaidah ABCD dengan Kode [TP.X.Y])
   - Pemahaman Bermakna (Meaningful Learning)
   - Pertanyaan Pemantik (Sparking Questions HOTS)

III. SKEMA SIKLUS 6 FASE PEDAGOGIS DEEP LEARNING (Diagram Alur Mindful, Meaningful, Joyful Learning)

C. SINTAKS (DESAIN PEMBELAJARAN DEEP LEARNING):
   Tabel 4 Kolom: FASE SINTAKS | NAMA TAHAPAN | PILAR PEDAGOGIS | TUJUAN DAN FOKUS AKTIVITAS KELAS (Fase 1 s.d. Fase 6)

D. LANGKAH-LANGKAH PEMBELAJARAN (TABEL SKENARIO KBM LENGKAP TIAP PERTEMUAN):
   - Header: Pertemuan Ke [X] ([Total Menit] Menit), Materi / Sub Pokok Bahasan [TP.X.Y], Tujuan Pembelajaran (TP) [TP.X.Y]
   - Tabel Skenario 6 Kolom: TAHAP KEGIATAN | FASE SINTAKS DEEP LEARNING | ALOKASI WAKTU | KEGIATAN GURU (DARI SALAM AWAL MASUK KELAS) | KEGIATAN PESERTA DIDIK (AKTIF & RESPONSIF) | ASPEK 3 PILAR & 6C
   - Tahap A: KEGIATAN PENDAHULUAN (FASE 1: Orientasi, Apersepsi & Motivasi / Review Materi - Salam, Doa Bersama, Presensi & Mindful Breathing Teknik STOP 2 Menit, Apersepsi Kontekstual Fenomena Nyata, Pertanyaan Pemantik HOTS, Skenario KBM 6 Fase, Pembentukan Kelompok Heterogen)
   - Tahap B: KEGIATAN INTI:
     * FASE 2: Eksplorasi Konsep & Penyelidikan Inkuiri (Distribusi LKPD & Media Peraga, Pembagian Peran Kerja Tim, Fasilitasi Eksplorasi Objek Nyata, Bimbingan Berjenjang Scaffolding)
     * FASE 3: Penjelasan, Elaborasi & Penguatan Ilmiah (Presentasi Pleno / Jigsaw Kelompok, Moderasi Diskusi Kelas Santun, Elaborasi Konsep di Papan Tulis, Notasi Ilmiah Baku & Pelurusan Miskonsepsi)
     * FASE 4: Aplikasi & Pemecahan Masalah Kontekstual (Studi Kasus Tantangan Terapan HOTS, Kolaborasi Think-Pair-Share, Umpan Balik Formatif Langsung)
   - Tahap C: KEGIATAN PENUTUP:
     * FASE 5: Refleksi Mendalam & Metakognisi (Pola 3-2-1 / What So What Now What, Apresiasi Karakter)
     * FASE 6: Simpulan Bersama, Tindak Lanjut & Doa Penutup (Simpulan Terpadu, Tugas Pengayaan / Proyek Mini Kreatif, Rencana KBM Berikutnya, Doa Khusyuk Bersyukur, & Salam Hangat)

E. ASESMEN PEMBELAJARAN:
   - Tabel Asesmen 4 Kolom: Jenis Asesmen (Diagnostik Awal, Formatif Proses LKPD & Diskusi, Sumatif Akhir HOTS) | Bentuk & Instrumen | Waktu Pelaksanaan | Aspek & Indikator
   - Panduan Rubrik Ketercapaian Tujuan Pembelajaran (KKTP) 5 Kolom: Kriteria Capaian | Perlu Bimbingan (0 - 64%) | Cukup (65 - 74%) | Baik (75 - 87%) | Sangat Baik (88 - 100%)

E. MEDIA, ALAT, DAN SUMBER BELAJAR:
   - Media Pembelajaran Interaktif
   - Alat dan Bahan Praktik Konkret
   - Sumber Belajar Resmi

VIII. MATRIKS PEMBELAJARAN BERDIFERENSIASI:
   - Skema Matriks Alur (Konten, Proses, Produk)
   - Tabel Diferensiasi 4 Kolom: Kategori Peserta Didik (Reguler, Kesulitan Belajar / Scaffolding, Berpencapaian Cepat / Mahir) | Diferensiasi Konten | Diferensiasi Proses | Diferensiasi Produk

H. REFLEKSI GURU:
   - Tabel 2 Kolom: Aspek Refleksi (1. Ketercapaian TP, 2. Efektivitas Sintaks, 3. Partisipasi Siswa, 4. Kendala & Miskonsepsi, 5. Rencana Perbaikan) | Catatan Evaluatif Guru

X. PENGESAHAN DOKUMEN:
   - Kolom Tanda Tangan Resmi: Kepala Satuan Pendidikan dan Guru Mata Pelajaran lengkap dengan NIP`,
    },
  ],
  asesmen: [
    {
      id: 'asesmen_3_jenis',
      label: 'Format Asesmen Komprehensif (Diagnostik, Formatif, Sumatif)',
      notes: `BAGIAN 1: ASESMEN DIAGNOSTIK
BAGIAN 2: ASESMEN FORMATIF
BAGIAN 3: ASESMEN SUMATIF (Kisi-Kisi, Soal HOTS, Kunci Jawaban & Rubrik)
BAGIAN 4: REFLEKSI GURU & SISWA`,
    },
  ],
};

export const TEMPLATE_PRESETS = [
  {
    id: 'perangkat_umum',
    label: 'Format Perangkat Pembelajaran Standar',
    notes: `1. IDENTITAS PERANGKAT
2. CAPAIAN & TUJUAN PEMBELAJARAN
3. LANGKAH-LANGKAH KEGIATAN PEMBELAJARAN
4. ASESMEN & REFLEKSI PEMBELAJARAN`,
  },
];

export const CustomFormatSelector: React.FC<CustomFormatSelectorProps> = ({
  value,
  onChange,
  docTypeName = 'Perangkat Ajar',
  docTypeId,
  compact = false,
}) => {
  const isRPM = docTypeId === 'modul_ajar' || docTypeId === 'rpm';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Template Manager States
  const [savedTemplates, setSavedTemplates] = useState<SavedCustomTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'presets' | 'saved'>('presets');
  const [isCreating, setIsCreating] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateCategory, setTemplateCategory] = useState<string>(isRPM ? 'rpm' : (docTypeId || 'tp'));
  const [searchSaved, setSearchSaved] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getSavedTemplates();
    setSavedTemplates(loaded);
  }, []);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3000);
  };

  const activePresets = docTypeId && DOCUMENT_PRESETS[docTypeId]
    ? DOCUMENT_PRESETS[docTypeId]
    : (isRPM && DOCUMENT_PRESETS['rpm'] ? DOCUMENT_PRESETS['rpm'] : TEMPLATE_PRESETS);

  const handleToggle = () => {
    const nextState = !value.useCustomFormat;
    const defaultNotes = activePresets.length > 0 ? activePresets[0].notes : TEMPLATE_PRESETS[0].notes;
    onChange({
      ...value,
      useCustomFormat: nextState,
      customFormatNotes:
        nextState && !value.customFormatNotes
          ? defaultNotes
          : value.customFormatNotes,
    });
  };

  const processFile = async (file: File) => {
    setIsReadingFile(true);
    try {
      const parsed = await UniversalFileParser.parseFile(file);
      const newFile: CustomFormatFile = {
        name: parsed.fileName,
        size: parsed.fileSize,
        type: parsed.category,
        mimeType: parsed.mimeType,
        base64: parsed.base64,
        extractedText: parsed.extractedText,
        tableMarkdown: parsed.tableMarkdown,
        sheetNames: parsed.sheetNames,
        summaryText: parsed.summaryText,
        previewUrl: parsed.previewUrl,
      };

      onChange({
        ...value,
        useCustomFormat: true,
        formatFile: newFile,
        customFormatNotes:
          value.customFormatNotes ||
          parsed.summaryText ||
          `Format Acuan Dokumen: Mengikuti struktur bab, tata letak, dan komponen yang ada pada file lampiran "${parsed.fileName}".`,
      });
      showNotification(`File format "${parsed.fileName}" berhasil diunggah dan dibaca!`);
    } catch (err) {
      console.error('Failed to read format file:', err);
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onChange({
      ...value,
      formatFile: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyPreset = (presetNotes: string, presetLabel?: string) => {
    onChange({
      ...value,
      useCustomFormat: true,
      customFormatNotes: presetNotes,
    });
    showNotification(`Sistematika "${presetLabel || 'Pilihan'}" berhasil diterapkan!`);
  };

  const handleResetToStandardFormat = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onChange({
      useCustomFormat: false,
      formatFile: null,
      customFormatNotes: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotification(
      isRPM
        ? 'Format RPM berhasil di-reset ke format baku standar Kemendikbud & Deep Learning!'
        : `Format acuan ${docTypeName || 'dokumen'} telah di-reset ke format standar sistem.`
    );
  };

  const handleRestoreDefaultTemplates = () => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_TEMPLATES, JSON.stringify(INITIAL_BUILTIN_TEMPLATES));
      setSavedTemplates(INITIAL_BUILTIN_TEMPLATES);
      showNotification('Koleksi templat bawaan RPM & Perangkat Ajar berhasil dipulihkan!');
    } catch (e) {
      console.error('Failed to restore default templates:', e);
    }
  };

  // Custom Template Operations
  const handleSaveCurrentAsTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    const notesToSave = value.customFormatNotes.trim() || (activePresets[0] ? activePresets[0].notes : '');
    const newTpl: SavedCustomTemplate = {
      id: `custom_tpl_${Date.now()}`,
      name: templateName.trim(),
      description: templateDesc.trim() || 'Templat khusus guru untuk penyusunan modul',
      category: templateCategory,
      notes: notesToSave,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      isBuiltIn: false,
    };

    const updated = [newTpl, ...savedTemplates];
    setSavedTemplates(updated);
    saveTemplatesToStorage(updated);
    setIsCreating(false);
    setTemplateName('');
    setTemplateDesc('');
    setActiveTab('saved');
    showNotification(`Templat "${newTpl.name}" berhasil disimpan ke koleksi guru!`);
  };

  const handleApplySavedTemplate = (tpl: SavedCustomTemplate) => {
    onChange({
      ...value,
      useCustomFormat: true,
      customFormatNotes: tpl.notes,
    });
    showNotification(`Templat "${tpl.name}" berhasil diterapkan ke form aktif!`);
  };

  const handleDeleteSavedTemplate = (id: string, name: string) => {
    if (!confirm(`Hapus templat "${name}" dari daftar simpanan?`)) return;
    const updated = savedTemplates.filter((t) => t.id !== id);
    setSavedTemplates(updated);
    saveTemplatesToStorage(updated);
    showNotification(`Templat "${name}" telah dihapus.`);
  };

  const handleCopyNotes = (notes: string, name: string) => {
    navigator.clipboard.writeText(notes);
    showNotification(`Struktur templat "${name}" berhasil disalin ke clipboard!`);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((item) => item.name && item.notes);
          if (valid.length === 0) {
            alert('File JSON tidak memuat templat valid.');
            return;
          }
          // Merge by id
          const existingIds = new Set(savedTemplates.map((t) => t.id));
          const toAdd = valid.filter((v) => !existingIds.has(v.id));
          const updated = [...toAdd, ...savedTemplates];
          setSavedTemplates(updated);
          saveTemplatesToStorage(updated);
          setActiveTab('saved');
          showNotification(`${toAdd.length} templat baru berhasil diimpor!`);
        } else {
          alert('Format data JSON tidak cocok.');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('Gagal membaca file JSON templat.');
      }
    };
    reader.readAsText(file);
    if (jsonImportRef.current) jsonImportRef.current.value = '';
  };

  const filteredSavedTemplates = savedTemplates.filter((t) => {
    if (!searchSaved.trim()) return true;
    const q = searchSaved.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`rounded-xl border transition ${
        value.useCustomFormat
          ? 'bg-blue-50/40 border-blue-200'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      } p-3.5 space-y-3.5`}
    >
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="p-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-md transition animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationMsg(null)}
            className="text-white/80 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}



      {/* Checkbox Header */}
      <div className="flex items-start justify-between gap-3">
        <label
          htmlFor="checkbox-custom-format"
          onClick={handleToggle}
          className="flex items-start space-x-2.5 cursor-pointer select-none group flex-1"
        >
          <div className="mt-0.5 shrink-0">
            {value.useCustomFormat ? (
              <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
              <span>{isRPM ? 'Gunakan Format Sekolah Sendiri sebagai Acuan RPM' : `Gunakan Format / Templat ${docTypeName} Khusus`}</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                {isRPM ? 'Word / PDF / Scan / Format Resmi Sekolah' : 'Word / PDF / Teks / Koleksi Guru'}
              </span>
              {savedTemplates.length > 0 && (
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <BookmarkCheck className="w-3 h-3" />
                  {savedTemplates.length} Tersimpan
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {isRPM
                ? 'Unggah dokumen format resmi sekolah Anda (.docx, .pdf, scan foto) atau tuliskan sistematika sekolah agar AI menyusun RPM sesuai acuan sekolah Anda.'
                : `Pilih templat ${docTypeName} acuan sekolah, gunakan templat tersimpan milik guru, atau unggah file format (.docx/.pdf).`}
            </p>
          </div>
        </label>

        {(value.useCustomFormat || value.formatFile || (value.customFormatNotes && value.customFormatNotes.trim().length > 0)) && (
          <button
            type="button"
            onClick={handleResetToStandardFormat}
            className="shrink-0 px-2 py-1 rounded-md bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 text-[11px] font-semibold transition flex items-center gap-1 shadow-xs"
            title={isRPM ? 'Reset ke Format Standar Baku RPM' : 'Kembalikan ke format standar sistem'}
          >
            <RotateCcw className="w-3 h-3 text-rose-600" />
            <span>{isRPM ? 'Reset Format RPM' : 'Reset Standar'}</span>
          </button>
        )}
      </div>

      {/* Expanded Controls when Checked */}
      {value.useCustomFormat && (
        <div className="space-y-3.5 pt-2 border-t border-slate-200">
          {/* File Upload Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1.5">
                <FileUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload File Dokumen Format (Word / PDF / Gambar):</span>
              </label>
              {value.formatFile && (
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  File terlampir sebagai acuan
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              id="input-format-file"
              accept=".pdf,.docx,.doc,.dotx,.xlsx,.xls,.csv,.tsv,.ods,.pptx,.ppt,.txt,.md,.rtf,.html,.xml,.json,.jpg,.jpeg,.png,.webp,.bmp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {!value.formatFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-3.5 rounded-lg border border-dashed transition cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                  {isReadingFile ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">
                    Klik untuk memilih file format resmi sekolah atau Tarik (Drag & Drop) ke sini
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Word (.docx / .doc), PDF (.pdf), Excel (.xlsx), atau Foto/Scan dokumen format
                  </div>
                </div>
              </div>
            ) : (
              /* Attached File Card */
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1.5">
                      <span className="truncate">{value.formatFile.name}</span>
                      <span className="text-[10px] text-slate-500">
                        ({(value.formatFile.size / 1024).toFixed(1)} KB)
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shrink-0">
                        Acuan Aktif
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {(value.formatFile.previewUrl || value.formatFile.extractedText || value.formatFile.tableMarkdown) && (
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      title="Lihat Pratinjau Dokumen Format"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 rounded text-rose-600 hover:bg-rose-50"
                    title="Hapus File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TEMPLATE MANAGER TABS & SAVING CONTROLS */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-3 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* Tab Selector */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                {activePresets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition flex items-center space-x-1.5 ${
                      activeTab === 'presets'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Sistematika Bawaan</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('saved')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition flex items-center space-x-1.5 ${
                    activeTab === 'saved'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className="w-3 h-3 text-emerald-600" />
                  <span>{isRPM ? 'Format Sekolah Tersimpan' : 'Templat Saya'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                    {savedTemplates.length}
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsCreating((prev) => !prev)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1.5 transition shadow-xs"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{isRPM ? 'Simpan Format Sekolah Ini' : 'Simpan Format Ini sebagai Templat Baru'}</span>
                </button>
              </div>
            </div>

            {/* INLINE CREATE TEMPLATE FORM */}
            {isCreating && (
              <form
                onSubmit={handleSaveCurrentAsTemplate}
                className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 space-y-2.5 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                    <Save className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isRPM ? 'Simpan Format Resmi Sekolah ke Koleksi Guru' : 'Simpan Format Saat Ini ke Koleksi Templat Guru'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      {isRPM ? 'Nama Format Sekolah:' : 'Nama Templat RPM / Modul:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder={isRPM ? 'Contoh: Format RPM SMAN 1 (KOSP)' : 'Contoh: RPM Fisika Fase E SMAN 30'}
                      className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      Kategori / Lingkup:
                    </label>
                    <select
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:border-blue-600"
                    >
                      <option value="rpm">RPM (Rencana Pelaksanaan Modul)</option>
                      <option value="modul_ajar">Modul Ajar</option>
                      <option value="tp">Tujuan Pembelajaran (TP)</option>
                      <option value="atp">Alur Tujuan Pembelajaran (ATP)</option>
                      <option value="lkpd">Lembar Kerja Peserta Didik (LKPD)</option>
                      <option value="asesmen">Asesmen Pembelajaran</option>
                      <option value="umum">Format Umum / Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                    Keterangan Singkat (Opsional):
                  </label>
                  <input
                    type="text"
                    value={templateDesc}
                    onChange={(e) => setTemplateDesc(e.target.value)}
                    placeholder={isRPM ? 'Contoh: Format KOSP resmi sekolah dengan tabel KBM 4 kolom' : 'Contoh: Sesuai acuan MGMP 2 pertemuan @ 2 JP dengan tabel 6 kolom'}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-xs flex items-center space-x-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Simpan Format</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 1: PRESETS BAWAAN */}
            {activeTab === 'presets' && activePresets.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-700">
                  Pilihan Sistematika Standar untuk {docTypeName}:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset.notes, preset.label)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition text-left flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3 text-blue-500 shrink-0" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: TEMPLAT TERSIMPAN SAYA */}
            {activeTab === 'saved' && (
              <div className="space-y-2.5">
                {/* Search and Backup/Restore bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="relative flex-1 min-w-[160px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      value={searchSaved}
                      onChange={(e) => setSearchSaved(e.target.value)}
                      placeholder="Cari templat tersimpan..."
                      className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <input
                      ref={jsonImportRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleRestoreDefaultTemplates}
                      className="px-2 py-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 flex items-center space-x-1"
                      title="Pulihkan templat bawaan resmi ke pengaturan awal pabrik"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>Pulihkan Bawaan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => jsonImportRef.current?.click()}
                      className="px-2 py-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 flex items-center space-x-1"
                      title="Impor templat dari file JSON"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Impor JSON</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => exportTemplatesAsJSON(savedTemplates)}
                      className="px-2 py-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 flex items-center space-x-1"
                      title="Ekspor dan cadangkan koleksi templat guru ke file JSON"
                    >
                      <Download className="w-3 h-3" />
                      <span>Ekspor Cadangan</span>
                    </button>
                  </div>
                </div>

                {/* Templates List */}
                {filteredSavedTemplates.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-1">
                    <FolderHeart className="w-6 h-6 mx-auto text-slate-400" />
                    <div className="font-semibold">Belum ada templat yang cocok</div>
                    <p className="text-[10px] text-slate-400">
                      Klik tombol "+ Simpan Format Ini sebagai Templat Baru" di atas untuk menyimpan format dokumen favorit Anda.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {filteredSavedTemplates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition flex flex-col justify-between space-y-2 shadow-xs group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition">
                              {tpl.name}
                            </div>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                tpl.isBuiltIn
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {tpl.isBuiltIn ? 'Resmi' : 'Kustom Guru'}
                            </span>
                          </div>
                          {tpl.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                              {tpl.description}
                            </p>
                          )}
                          <div className="text-[9px] text-slate-400 mt-1 font-mono">
                            Disimpan: {tpl.createdAt}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                          <button
                            type="button"
                            onClick={() => handleApplySavedTemplate(tpl)}
                            className="px-2 py-0.8 rounded text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1 transition shadow-xs"
                          >
                            <Check className="w-3 h-3" />
                            <span>Gunakan Templat Ini</span>
                          </button>

                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleCopyNotes(tpl.notes, tpl.name)}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                              title="Salin isi format ke clipboard"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            {!tpl.isBuiltIn && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSavedTemplate(tpl.id, tpl.name)}
                                className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                title="Hapus templat ini"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Format Structure Textarea Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700">
                {isRPM ? 'Catatan Khusus Sistematika / Komponen Format Sekolah (Opsional):' : 'Isi / Struktur Format Acuan yang Aktif Digunakan:'}
              </label>
              {value.customFormatNotes && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(value.customFormatNotes);
                    showNotification('Isi format aktif berhasil disalin!');
                  }}
                  className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Teks Format</span>
                </button>
              )}
            </div>
            <textarea
              rows={compact ? 4 : 6}
              value={value.customFormatNotes}
              onChange={(e) =>
                onChange({
                  ...value,
                  customFormatNotes: e.target.value,
                })
              }
              placeholder={
                isRPM
                  ? 'Tuliskan urutan bab, nama tabel, atau sistematika format dari sekolah Anda. AI akan menggunakannya sebagai acuan utama penyusunan RPM...'
                  : 'Tuliskan urutan bab, judul komponen, tabel, atau petunjuk format sekolah...'
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-xs font-mono leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Document & Image Preview Modal */}
      {showPreviewModal && value.formatFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full p-4 space-y-3 shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 shrink-0">
              <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Pratinjau Berkas Acuan: {value.formatFile.name}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-slate-50 p-3 text-xs">
              {value.formatFile.previewUrl && value.formatFile.type === 'image' ? (
                <div className="flex justify-center">
                  <img
                    src={value.formatFile.previewUrl}
                    alt="Pratinjau Dokumen Format"
                    className="max-h-[60vh] object-contain rounded border border-slate-200"
                  />
                </div>
              ) : value.formatFile.tableMarkdown || value.formatFile.extractedText ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 flex items-center justify-between">
                    <span>Intisari Teks Ekstraksi Dokumen ({String(value.formatFile.type).toUpperCase()})</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(value.formatFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed max-h-[55vh] overflow-auto">
                    {value.formatFile.tableMarkdown || value.formatFile.extractedText}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Berkas format &quot;{value.formatFile.name}&quot; terlampir dan siap dijadikan acuan penyusunan oleh AI.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
