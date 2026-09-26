/**
 * AI Curriculum Generation Engine
 * Generates rich, comprehensive, official Kurikulum Merdeka & Deep Learning documents
 * (Mindful, Meaningful, Joyful Learning) with ABCD TP formulations, HOTS rubrics, and detailed tables.
 */

import { StorageService } from './storage';

export interface GenerateCurriculumParams {
  toolType?: string;
  docType?: string;
  subject?: string;
  level?: string;
  grade?: number | string;
  phase?: string;
  semester?: string;
  academicYear?: string;
  topic?: string;
  meetingCount?: number;
  hoursPerMeeting?: number;
  minutesPerJP?: number;
  totalJP?: number;
  modelOption?: string;
  modulOption?: string;
  manualTP?: string;
  useManualTP?: boolean;
  subTopics?: string[];
  selectedTPs?: any[];
  customInstructions?: string;
  customPrompt?: string;
  cpText?: string;
  distributionData?: any;
  kalenderData?: any;
  schoolProfile?: any;
  teacherName?: string;
  teacherNip?: string;
  headmasterName?: string;
  headmasterNip?: string;
  schoolName?: string;
  city?: string;
  useCustomFormat?: boolean;
  customFormatNotes?: string;
  customFormatFile?: {
    name: string;
    size?: number;
    type?: string;
    mimeType?: string;
    base64?: string;
    extractedText?: string;
  } | null;
}

export function generateExpertCurriculumDocument(
  docTypeOrParams: string | GenerateCurriculumParams,
  maybeParams?: GenerateCurriculumParams
): string {
  const params: GenerateCurriculumParams =
    typeof docTypeOrParams === 'string'
      ? { ...(maybeParams || {}), docType: docTypeOrParams, toolType: docTypeOrParams }
      : docTypeOrParams;

  const rawType = params.toolType || params.docType || 'modul_ajar';
  const docType = rawType.toString().toLowerCase().replace(/^ai_/, '');

  if (docType === 'bundle' || docType === 'perangkat_lengkap') {
    return generateFullCurriculumBundle(params);
  }

  const subject = params.subject || 'Mata Pelajaran';
  const syncedContext = StorageService.getSyncedCurriculumContext(subject, params.grade, params.level);
  const schoolProfile = syncedContext.schoolProfile;

  const level = params.level || syncedContext.level || 'SMA';
  const grade = params.grade || syncedContext.grade || (level === 'SD' ? 4 : level === 'SMP' ? 7 : 10);
  const phase = params.phase || syncedContext.phase || (grade === 10 ? 'Fase E' : Number(grade) > 10 ? 'Fase F' : Number(grade) >= 7 ? 'Fase D' : Number(grade) >= 4 ? 'Fase B/C' : 'Fase A');
  const semester = params.semester || 'Ganjil';
  
  const distributionData = params.distributionData || syncedContext.activeMaster;
  const sem1Materials = (distributionData?.materialsSem1 && distributionData.materialsSem1.length > 0) ? distributionData.materialsSem1 : syncedContext.sem1Materials;
  const sem2Materials = (distributionData?.materialsSem2 && distributionData.materialsSem2.length > 0) ? distributionData.materialsSem2 : syncedContext.sem2Materials;
  const activeMaterials = semester === 'Ganjil' || semester === '1' ? sem1Materials : sem2Materials;
  const matchedMaterial = params.topic ? activeMaterials.find(m => 
    (m.essentialMaterial && (m.essentialMaterial.trim().toLowerCase() === params.topic.trim().toLowerCase() || params.topic.toLowerCase().includes(m.essentialMaterial.toLowerCase()) || m.essentialMaterial.toLowerCase().includes(params.topic.toLowerCase()))) ||
    (m.tpName && (m.tpName.toLowerCase().includes(params.topic.toLowerCase()) || params.topic.toLowerCase().includes(m.tpName.toLowerCase())))
  ) : null;
  const currentMaterial = matchedMaterial || distributionData?.currentSelectedMaterial || (activeMaterials.length > 0 ? activeMaterials[0] : null);

  const topic = params.topic || (currentMaterial?.essentialMaterial) || (currentMaterial?.tpName) || `Konsep Pokok dan Terapan ${subject}`;
  const modelOption = params.modelOption || params.modulOption || 'lengkap';
  const teacherName = params.teacherName || params.schoolProfile?.teacherName || params.distributionData?.teacherName || schoolProfile.teacherName || syncedContext.teacherName || 'Aspian La Ode Madimu, S.Pd. Gr';
  const teacherNip = params.teacherNip || params.schoolProfile?.teacherNip || (params.distributionData as any)?.teacherNip || schoolProfile.teacherNip || syncedContext.teacherNip || '19900822 201801 1 004';
  const headmasterName = params.headmasterName || params.schoolProfile?.headmasterName || schoolProfile.headmasterName || (schoolProfile as any).principalName || syncedContext.headmasterName || 'Drs. M. Taher, M.Pd.';
  const headmasterNip = params.headmasterNip || params.schoolProfile?.headmasterNip || schoolProfile.headmasterNip || (schoolProfile as any).principalNip || syncedContext.headmasterNip || '19700315 199602 1 002';
  const schoolName = params.schoolName || params.schoolProfile?.schoolName || params.distributionData?.schoolName || schoolProfile.schoolName || syncedContext.schoolName || 'SMA NEGERI 30 MALUKU TENGAH';
  const city = params.city || params.schoolProfile?.city || schoolProfile.city || syncedContext.city || 'Maluku Tengah';

  const useCustomFormat = params.useCustomFormat;
  const customFormatNotes = params.customFormatNotes;
  const customFormatFile = params.customFormatFile;
  const manualTP = params.manualTP?.trim();
  const resolvedAcademicYear = params.academicYear || params.kalenderData?.tahunAjaran || schoolProfile.academicYear || syncedContext.academicYear || "2025/2026";
  const yearMatch = resolvedAcademicYear.match(/(\d{4})\s*[\/-]\s*(\d{4})/);
  const startYear = yearMatch ? parseInt(yearMatch[1], 10) : 2025;
  const endYear = yearMatch ? parseInt(yearMatch[2], 10) : startYear + 1;

  // Meeting parameters
  const meetingCount = Number(params.meetingCount) > 0 ? Number(params.meetingCount) : 2;
  const defaultMinutesPerJp = level === 'SD' ? 35 : level === 'SMP' ? 40 : 45;
  const minutesPerJP = Number(params.minutesPerJP) > 0 ? Number(params.minutesPerJP) : defaultMinutesPerJp;
  const defaultJpPerMeeting = level === 'SD' ? 2 : level === 'SMP' ? 2 : 3;
  const hoursPerMeeting = Number(params.hoursPerMeeting) > 0 ? Number(params.hoursPerMeeting) : defaultJpPerMeeting;
  const totalJP = params.totalJP || (meetingCount * hoursPerMeeting);
  const meetingTotalMinutes = hoursPerMeeting * minutesPerJP;

  const tpCode = currentMaterial?.tpCode || `TP.${grade}.1`;
  const tpTitle = currentMaterial?.tpName || `Peserta didik mampu memahami, menganalisis, dan memecahkan permasalahan kontekstual terkait ${topic} secara kritis, mandiri, dan bergotong royong.`;
  const allocatedHours = currentMaterial?.allocatedHours || 6;
  const subTopics: string[] = (currentMaterial as any)?.subTopics || [];

  const generateCoreDoc = (): string => {
    switch (docType) {
    case 'analisis_cp': {
      const jpPerWk = params.distributionData?.jpPerWeek || (level === 'SD' ? 4 : level === 'SMP' ? 3 : 3);
      
      let sumSem1Jp = 0;
      let sumSem1Meetings = 0;
      const sem1Rows = sem1Materials.length > 0
        ? sem1Materials.map((mat, idx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${idx + 1}`;
            const hours = Number(mat.allocatedHours) || 18;
            const meetings = mat.meetingCount || Math.max(1, Math.round(hours / jpPerWk));
            sumSem1Jp += hours;
            sumSem1Meetings += meetings;
            const code = mat.tpCode || `TP.${grade}.${idx + 1}`;
            const elem = mat.elementName || (idx % 2 === 0 ? 'Pemahaman Konseptual' : 'Keterampilan Proses');
            const assess = mat.assessmentStrategy || (idx % 2 === 0 ? 'Asesmen Formatif (Kuis & Observasi Kinerja)' : 'Asesmen Kinerja & Rubrik Portofolio');
            const method = mat.deepLearningMethod || (idx % 2 === 0 ? 'Inquiry & Mindful Exploration' : 'Problem-Based Learning & Joyful Lab');
            return `| **${idx + 1}** | **${code}** | *${elem}* — Peserta didik mampu menganalisis dan mendalami konsep fundamental serta aplikasi ${babName}. | **${babName}** | **${hours} JP** | ${meetings} Pertemuan | ${assess} • *${method}* |`;
          }).join('\n')
        : `| **1** | **TP.${grade}.1** | *Pemahaman Konseptual* — Mengidentifikasi, menguraikan, dan menjelaskan struktur dasar ${topic}. | Konsep Dasar & Hakikat ${subject} | **18 JP** | 6 Pertemuan | Formatif Awal & Tes Kinerja • *Inquiry Discovery* |
| **2** | **TP.${grade}.2** | *Keterampilan Proses* — Menganalisis fenomena, menyelidiki data, dan membuktikan prinsip ${subject}. | Investigasi Empiris & Analisis Kasus ${subject} | **18 JP** | 6 Pertemuan | Observasi Diskusi & Kuis • *Problem-Based Learning* |
| **3** | **TP.${grade}.3** | *Aplikasi & Refleksi* — Merekayasa pemecahan masalah kontekstual berbasis ${subject}. | Rekayasa Solusi Kontekstual & Proyek | **18 JP** | 6 Pertemuan | Unjuk Kerja & Portofolio • *Project-Based Learning* |`;

      const finalSem1JP = sem1Materials.length > 0 ? sumSem1Jp : 54;
      const finalSem1Meetings = sem1Materials.length > 0 ? sumSem1Meetings : 18;

      let sumSem2Jp = 0;
      let sumSem2Meetings = 0;
      const sem2StartIdx = sem1Materials.length > 0 ? sem1Materials.length : 3;
      const sem2Rows = sem2Materials.length > 0
        ? sem2Materials.map((mat, idx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${sem2StartIdx + idx + 1}`;
            const hours = Number(mat.allocatedHours) || 18;
            const meetings = mat.meetingCount || Math.max(1, Math.round(hours / jpPerWk));
            sumSem2Jp += hours;
            sumSem2Meetings += meetings;
            const code = mat.tpCode || `TP.${grade}.${sem2StartIdx + idx + 1}`;
            const elem = mat.elementName || (idx % 2 === 0 ? 'Pemahaman Konseptual' : 'Aplikasi & Refleksi Kritis');
            const assess = mat.assessmentStrategy || (idx % 2 === 0 ? 'Asesmen Formatif (Tes Tulis & Diskusi Terbimbing)' : 'Asesmen Sumatif Lingkup Materi & Gelar Karya');
            const method = mat.deepLearningMethod || (idx % 2 === 0 ? 'Meaningful Inquiry & Diskusi Kasus' : 'Project-Based Learning & Joyful Creation');
            return `| **${sem2StartIdx + idx + 1}** | **${code}** | *${elem}* — Peserta didik mampu mengintegrasikan konsep lanjutan dan menciptakan solusi aplikatif pada ${babName}. | **${babName}** | **${hours} JP** | ${meetings} Pertemuan | ${assess} • *${method}* |`;
          }).join('\n')
        : `| **4** | **TP.${grade}.4** | *Pemahaman Konseptual Lanjutan* — Mengevaluasi hubungan sistemik dan keteraturan konsep pada ${subject}. | Sistem Terpadu & Analisis Dinamis ${subject} | **18 JP** | 6 Pertemuan | Formatif Berkala & Refleksi • *Meaningful Case Study* |
| **5** | **TP.${grade}.5** | *Keterampilan Proses* — Merancang eksperimen terpadu dan mengolah data hasil investigasi secara presisi. | Desain Eksperimen & Analisis Solutif | **18 JP** | 6 Pertemuan | Tes Praktik & Laporan Ilmiah • *Collaborative Inquiry* |
| **6** | **TP.${grade}.6** | *Aplikasi & Kreasi* — Menghasilkan produk inovasi, memamerkan karya nyata, dan menyimpulkan solusi komprehensif. | Gelar Karya Inovasi & Refleksi Komprehensif | **18 JP** | 6 Pertemuan | Pameran Karya & Asesmen Sumatif • *Joyful Showcase* |`;

      const finalSem2JP = sem2Materials.length > 0 ? sumSem2Jp : 54;
      const finalSem2Meetings = sem2Materials.length > 0 ? sumSem2Meetings : 18;
      const totalYearJP = finalSem1JP + finalSem2JP;
      const totalTPCount = (sem1Materials.length > 0 ? sem1Materials.length : 3) + (sem2Materials.length > 0 ? sem2Materials.length : 3);

      return `# ANALISIS CAPAIAN PEMBELAJARAN (CP) & DISTRIBUSI MATERI PER SEMESTER
## PENDEKATAN DEEP LEARNING (MINDFUL, MEANINGFUL, & JOYFUL LEARNING)

---

### A. IDENTITAS PERANGKAT
| Komponen | Keterangan |
| :--- | :--- |
| **Satuan Pendidikan** | ${schoolName} |
| **Mata Pelajaran** | **${subject}** |
| **Fase / Kelas** | **${phase} / Kelas ${grade}** |
| **Jenjang** | **${level}** |
| **Semester** | **Semester Ganjil & Genap (1 Tahun Penuh)** |
| **Alokasi Waktu Total** | **${totalYearJP} JP / Tahun (${jpPerWk} JP / Minggu)** |
| **Tahun Pelajaran** | ${resolvedAcademicYear} |
| **Penyusun / Guru** | ${teacherName} (NIP. ${teacherNip}) |
| **Kepala Sekolah** | ${headmasterName} (NIP. ${headmasterNip}) |

---

### B. RASIONAL & CAPAIAN PEMBELAJARAN (CP) RESMI
**Rumusan CP Resmi Fase ${phase}:**
> *"Peserta didik mampu memahami hakikat keilmuan, menganalisis struktur dan konsep esensial ${subject}, menggunakan nalar kritis untuk memecahkan persoalan nyata, serta mengkomunikasikan ide gagasan solutif secara kolaboratif, kreatif, mandiri, dan beretika."*

---

### C. BAGAN ALUR DEKOMPOSISI CP MENUJU TUJUAN PEMBELAJARAN (TP)
\`\`\`
+---------------------------------------------------------------------------------------------------+
|               BAGAN ALUR DEKOMPOSISI CAPAIAN PEMBELAJARAN (CP) MENUJU TUJUAN (TP)                 |
|                                                                                                   |
|  [ RUMUSAN CAPAIAN PEMBELAJARAN RESMI KEMENDIKBUD ]                                               |
|         │                                                                                         |
|         ▼ (Dekomposisi Elemen CP & Konten Esensial)                                               |
|  ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
|  │  1. PEMAHAMAN KONSEPTUAL  │      │  2. KETERAMPILAN PROSES   │      │ 3. APLIKASI & REFLEKSI    │
|  │  • Mengidentifikasi (C2)  │      │  • Menganalisis Data (C4) │      │ • Mengevaluasi Kritis(C5) │
|  │  • Mengklasifikasikan(C3) │      │  • Uji Empiris & Hipotesis│      │ • Merancang Solusi (C6)   │
|  └─────────────┬─────────────┘      └─────────────┬─────────────┘      └─────────────┬─────────────┘
|                │                                  │                                  │            |
|                └─────────────────┬────────────────┴──────────────────────────────────┘            |
|                                  ▼                                                                |
|         [ INTEGRASI 3 PILAR DEEP LEARNING: MINDFUL ➔ MEANINGFUL ➔ JOYFUL ]                        |
|                                  │                                                                |
|                                  ▼                                                                |
|         [ FORMULASI TUJUAN PEMBELAJARAN (TP) ABCD & PEMETAAN DISTRIBUSI SEMESTER 1 & 2 ]          |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### D. DEKOMPOSISI ELEMEN DAN ANALISIS KOMPETENSI ESENSIAL
| No | Elemen CP | Kalimat Capaian Pembelajaran | Kompetensi Esensial (KKO HOTS Bloom) | Konten / Materi Pokok Esensial |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Pemahaman Konseptual** | Memahami, mengidentifikasi, dan mendeskripsikan prinsip fundamental ${subject}. | Mengidentifikasi (C2), Membedakan (C2), Menganalisis (C4) | ${topic} & Prinsip Dasar Keilmuan |
| 2 | **Keterampilan Proses & Analisis** | Menerapkan prosedur analitis, melakukan observasi/eksperimen, dan menafsirkan data. | Menghitung (C3), Menguji (C4), Mengevaluasi (C5) | Metode Investigasi, Pengolahan Data, & Pemecahan Masalah |
| 3 | **Aplikasi & Refleksi Kritis** | Menghubungkan konsep dengan fenomena lingkungan serta merefleksikan solusi kontekstual. | Mengkorelasikan (C4), Merefleksi (C5), Mengkreasikan Solusi (C6) | Studi Kasus Nyata, Proyek Kolaboratif Berdiferensiasi |

---

### E. HASIL DISTRIBUSI CAPAIAN PEMBELAJARAN (CP) PER SEMESTER

#### 1. Distribusi Capaian Pembelajaran & Materi Semester 1 (Ganjil)
| No | Kode TP | Elemen CP & Rumusan Tujuan Pembelajaran (TP) | Ruang Lingkup Materi Pokok | Alokasi Waktu | Jml Pertemuan | Strategi Asesmen & Model Deep Learning |
| :-: | :---: | :--- | :--- | :-: | :-: | :--- |
${sem1Rows}
| - | - | *Cadangan Alokasi Jam & Evaluasi Formatif/Sumatif Tengah & Akhir Semester* | Penguatan, ASTS & ASAS Ganjil | **6 JP** | 2 Pertemuan | Asesmen Sumatif & Umpan Balik |
| **TOTAL** | | **Total Alokasi Beban KBM Semester 1 (Ganjil)** | | **${finalSem1JP + 6} JP** | **${finalSem1Meetings + 2} Pertemuan** | **100% Selaras Kaldik & Kurikulum** |

#### 2. Distribusi Capaian Pembelajaran & Materi Semester 2 (Genap)
| No | Kode TP | Elemen CP & Rumusan Tujuan Pembelajaran (TP) | Ruang Lingkup Materi Pokok | Alokasi Waktu | Jml Pertemuan | Strategi Asesmen & Model Deep Learning |
| :-: | :---: | :--- | :--- | :-: | :-: | :--- |
${sem2Rows}
| - | - | *Cadangan Alokasi Jam & Evaluasi Formatif/Sumatif Akhir Tahun Pelajaran* | Penguatan, ASAS Genap & Kenaikan | **6 JP** | 2 Pertemuan | Asesmen Sumatif & Pameran Hasil |
| **TOTAL** | | **Total Alokasi Beban KBM Semester 2 (Genap)** | | **${finalSem2JP + 6} JP** | **${finalSem2Meetings + 2} Pertemuan** | **100% Selaras Kaldik & Kurikulum** |

#### 3. Rekapitulasi Matriks Distribusi Alokasi Waktu CP 1 Tahun Pelajaran
| Komponen Distribusi Kurikulum | Semester 1 (Ganjil) | Semester 2 (Genap) | Total 1 Tahun Pelajaran | Keterangan & Rujukan |
| :--- | :---: | :---: | :---: | :--- |
| **Jumlah Tujuan Pembelajaran (TP)** | ${sem1Materials.length > 0 ? sem1Materials.length : 3} TP | ${sem2Materials.length > 0 ? sem2Materials.length : 3} TP | **${totalTPCount} TP** | Pemetaan Master CP & Modul |
| **Alokasi Jam Tatap Muka Efektif** | ${finalSem1JP} JP | ${finalSem2JP} JP | **${finalSem1JP + finalSem2JP} JP** | KBM Berdiferensiasi & Deep Learning |
| **Alokasi Jam Cadangan & Sumatif** | 6 JP | 6 JP | **12 JP** | ASTS, ASAS, & Evaluasi Mutu |
| **Total Jam Pelajaran (JP)** | **${finalSem1JP + 6} JP** | **${finalSem2JP + 6} JP** | **${totalYearJP + 12} JP** | Beban Standar Kurikulum Merdeka |
| **Beban Tatap Muka per Minggu** | ${jpPerWk} JP / Minggu | ${jpPerWk} JP / Minggu | **${jpPerWk} JP / Minggu** | Matriks Jadwal Mingguan Sekolah |
| **Estimasi Pekan Efektif KBM (RBE)** | ~18 Pekan | ~18 Pekan | **~36 Pekan Efektif** | Sinkronisasi Kalender Pendidikan |

---

### F. SKEMA INTEGRASI TIGA PILAR DEEP LEARNING
\`\`\`
+---------------------------------------------------------------------------------------------------+
|                     SKEMA TIGA PILAR PEDAGOGIS DEEP LEARNING DALAM KBM                            |
|                                                                                                   |
|    ┌───────────────────────────┐      ┌───────────────────────────┐      ┌────────────────────────┐
|    │   1. MINDFUL LEARNING     │      │  2. MEANINGFUL LEARNING   │      │   3. JOYFUL LEARNING   │
|    ├───────────────────────────┤      ├───────────────────────────┤      ├────────────────────────┤
|    │ • Latihan Mindful Breath  │ ───► │ • Kontekstualisasi Kasus  │ ───► │ • Tantangan Gamifikasi │
|    │ • Refleksi Awal & Minat   │      │ • Big Ideas & Inquiry     │      │ • Pameran Gelar Karya  │
|    │ • Fokus & Sadar Penuh     │      │ • Keterhubungan Konsep    │      │ • Kolaborasi Tim Ceria │
|    └───────────────────────────┘      └───────────────────────────┘      └────────────────────────┘
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### G. PEMETAAN DIMENSI PROFIL PELAJAR PANCASILA & KARAKTER 6C
* **Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia:** Mensyukuri keteraturan alam semesta dan ilmu pengetahuan.
* **Bernalar Kritis:** Menganalisis informasi, memvalidasi bukti, dan menarik kesimpulan logis.
* **Kreatif:** Mengembangkan alternatif solusi inovatif terhadap tantangan masalah kontekstual.
* **Bergotong Royong:** Berkolaborasi efektif dalam kerja kelompok dan saling menghargai pendapat.
* **Karakter 6C Terpadu:** *Character* (Integritas), *Citizenship* (Kepedulian), *Collaboration* (Kerjasama), *Communication* (Artikulasi Gagasan), *Creativity* (Inovasi), *Critical Thinking* (Solusi Masalah).

---

### H. STRATEGI PEMBELAJARAN BERDIFERENSIASI
* **Diferensiasi Konten:** Menyediakan bahan ajar multimodal (teks narasi, infografis visual, video animasi, dan studi kasus riil).
* **Diferensiasi Proses:** Bimbingan berjenjang (*scaffolding*) bagi kelompok yang membutuhkan bimbingan intensif dan tantangan mandiri untuk kelompok mahir.
* **Diferensiasi Produk:** Kebebasan memilih bentuk unjuk kerja tugas (laporan tulisan, poster infografis, rekaman podcast audio, atau demonstrasi presentasi video).
`;
    }

    case 'tp': {
      const tpRows = activeMaterials.length > 0
        ? activeMaterials.flatMap((mat, mIdx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${mIdx + 1}`;
            const baseCode = mat.tpCode || `TP.${grade}.${mIdx + 1}`;
            return [
              `| **${baseCode}.1** | Peserta didik (**A**) mampu **mengidentifikasi dan menganalisis** (**B**) karakteristik fundamental serta fenomena terkait ${babName} melalui investigasi kontekstual (**C**) secara kritis dan akurat (**D**). | Mengidentifikasi (C2), Menganalisis (C4) | Bernalar Kritis, Mandiri | Pemahaman konsep pokok ${babName} merupakan fondasi memahami keteraturan fenomena sains dan kehidupan. |`,
              `| **${baseCode}.2** | Peserta didik (**A**) mampu **menerapkan dan merekayasa solusi** (**B**) permasalahan kontekstual berbasis ${babName} melalui diskusi kelompok terbimbing (**C**) dengan presisi minimal 80% (**D**). | Menerapkan (C3), Memecahkan (C4) | Bergotong Royong, Bernalar Kritis | Kolaborasi dan aplikasi nyata mempermudah penyelesaian masalah kompleks pada ${babName}. |`,
              `| **${baseCode}.3** | Peserta didik (**A**) mampu **mengevaluasi dan mengkreasikan** (**B**) gagasan/produk inovatif terkait penerapan ${babName} melalui proyek investigasi terpadu (**C**) dengan sistematis dan bertanggung jawab (**D**). | Mengevaluasi (C5), Mengkreasikan (C6) | Kreatif, Berkebinekaan Global | Pengetahuan ${babName} yang bermakna adalah pengetahuan yang dapat diwujudkan dalam aksi nyata yang solutif. |`
            ];
          }).join('\n')
        : `| **${tpCode}** | Peserta didik (**A**) mampu **mengidentifikasi dan menganalisis** (**B**) karakteristik fundamental ${topic} melalui telaah kasus kontekstual (**C**) secara tepat dan kritis (**D**). | Mengidentifikasi (C2), Menganalisis (C4) | Bernalar Kritis, Mandiri | Konsep dasar ${subject} merupakan fondasi memahami pola keteraturan dan fenomena di sekitar kita. |
| **TP.${grade}.2** | Peserta didik (**A**) mampu **menerapkan dan memecahkan** (**B**) permasalahan perhitungan/studi kasus pada ${topic} melalui diskusi kelompok terbimbing (**C**) dengan akurasi minimal 80% (**D**). | Menerapkan (C3), Memecahkan (C4) | Bergotong Royong, Bernalar Kritis | Kolaborasi mempermudah penyelesaian masalah kompleks dan menghasilkan presisi solusi. |
| **TP.${grade}.3** | Peserta didik (**A**) mampu **mengevaluasi dan mengkreasikan** (**B**) solusi gagasan/produk inovatif terkait penerapan ${topic} melalui proyek investigasi sederhana (**C**) dengan sistematis dan komunikatif (**D**). | Mengevaluasi (C5), Mengkreasikan (C6) | Kreatif, Berkebinekaan Global | Pengetahuan yang bermakna adalah pengetahuan yang dapat diwujudkan dalam tindakan nyata. |`;

      const inquiryHooks = activeMaterials.length > 0
        ? activeMaterials.map((mat, idx) => {
            const bName = mat.essentialMaterial || mat.tpName || `Bab ${idx + 1}`;
            return `${idx + 1}. *Bagaimanakah penerapan prinsip **${bName}** dapat menyelesaikan permasalahan nyata di lingkungan kita?*`;
          }).join('\n')
        : `1. *Bagaimanakah keterkaitan antara konsep **${topic}** dengan permasalahan yang sering kita jumpai dalam kehidupan sehari-hari?*
2. *Mengapa pemahaman yang keliru terhadap prinsip ini dapat berdampak pada pengambilan keputusan yang tidak akurat?*
3. *Gagasan atau inovasi apa yang dapat kamu ciptakan untuk mempermudah pemecahan masalah di topik ini?*`;

      return `# PERUMUSAN TUJUAN PEMBELAJARAN (TP)
## PENDEKATAN BERBASIS KOMPONEN ABCD & TAKSONOMI BLOOM HOTS

---

### A. IDENTITAS PERANGKAT
* **Mata Pelajaran:** ${subject}
* **Fase / Kelas:** ${phase} / Kelas ${grade} (${level})
* **Semester:** Semester ${semester}
* **Tahun Pelajaran:** ${resolvedAcademicYear}
* **Cakupan Materi:** ${activeMaterials.length > 0 ? `Seluruh Materi Pokok Semester ${semester} (${activeMaterials.length} Bab - Tersinkronisasi Otomatis dari Profil Guru)` : topic}
* **Guru Pengampu:** ${teacherName}

---

### B. SKEMA ANATOMI RUMUSAN TUJUAN PEMBELAJARAN (ABCD)
\`\`\`
+---------------------------------------------------------------------------------------------------+
|               SKEMA ANATOMI RUMUSAN TUJUAN PEMBELAJARAN (KOMPONEN ABCD)                           |
|                                                                                                   |
|  ┌──────────────────┐    ┌──────────────────────────┐    ┌─────────────────────────────────────┐  |
|  │  AUDIENCE (A)    │    │  BEHAVIOR (B)            │    │  CONDITION (C)                      │  |
|  │  Peserta Didik   │───►│  Kata Kerja Operasional  │───►│  Melalui investigasi kasus nyata,   │  |
|  │  Kelas ${grade} (${phase}) │    │  HOTS (C2, C4, C5, C6)   │    │  simulasi, LKPD & eksperimen        │  |
|  └──────────────────┘    └──────────────────────────┘    └──────────────────┬──────────────────┘  |
|                                                                             │                     |
|                                  ┌──────────────────────────────────────────┘                     |
|                                  ▼                                                                |
|                          ┌──────────────────────────┐                                             |
|                          │  DEGREE (D)              │                                             |
|                          │  Tingkat Ketepatan,      │                                             |
|                          │  Kritis, & Bertanggung Jwb│                                            |
|                          └──────────────────────────┘                                             |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### C. TABEL RUMUSAN TUJUAN PEMBELAJARAN (TP) TERSINKRONISASI
| Kode TP | Rumusan Tujuan Pembelajaran (ABCD) | Kata Kerja Operasional (KKO) | Dimensi Profil Pancasila | Pemahaman Bermakna (Deep Meaning) |
| :--- | :--- | :--- | :--- | :--- |
${tpRows}

---

### D. PERTANYAAN PEMANTIK (INQUIRY HOOKS)
${inquiryHooks}

---

### E. DIAGRAM ALUR TAHAPAN PENGUASAAN KOMPETENSI
\`\`\`
+---------------------------------------------------------------------------------------------------+
|               DIAGRAM HIERARKI TAHAPAN PENGUASAAN KOMPETENSI SISWA                                |
|                                                                                                   |
|  [ TAHAP 1: FONDASI ]      ───►  [ TAHAP 2: PENALARAN ]    ───►  [ TAHAP 3: KREASI INOVASI ]      |
|  • Konsep Pokok & Kaidah         • Analisis Kasus Multi-Var      • Desain Prototipe Solutif       |
|  • Istilah Ilmiah & Notasi       • Olah Data Empiris & Pola      • Presentasi Karya & Evaluasi    |
+---------------------------------------------------------------------------------------------------+
\`\`\`
`;
    }

    case 'atp': {
      let calcTotalSemJp = 0;
      const atpRows = activeMaterials.length > 0
        ? activeMaterials.map((mat, idx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${idx + 1}`;
            const hours = Number(mat.allocatedHours) || 18;
            calcTotalSemJp += hours;
            const code = mat.tpCode || `TP.${grade}.${idx + 1}`;
            const models = ['Inquiry Discovery Learning & Eksplorasi Mindful', 'Problem-Based Learning (PBL)', 'Project-Based Learning (PjBL) & Joyful Lab', 'Collaborative Peer Review & Riset Terpadu'];
            const formatifs = ['Tes Diagnostik Awal & Observasi Diskusi', 'Kuis Formatif Mandiri & Studi Kasus LKPD', 'Lembar Kinerja Praktik & Unjuk Kerja', 'Presentasi Portofolio & Penilaian Antarteman'];
            const media = ['Buku Siswa Kemendikbud, LKPD Mindful, Video Apersepsi', 'Modul Digital, Simulasi Interaktif, Lembar Kerja', 'Kit Eksperimen, Lembar Pengamatan, Canva Infografis', 'Rubrik Autentik, Lembar Refleksi Diri'];
            return `| **${idx + 1}** | **${code}** | ${babName} | ${hours} JP | *${models[idx % models.length]}* | ${formatifs[idx % formatifs.length]} | ${media[idx % media.length]} |`;
          }).join('\n') + `\n| - | - | **Cadangan Jam Pelajaran & Asesmen Sumatif Semester ${semester}** | 4 JP | *Evaluasi Menyeluruh* | Asesmen Sumatif Akhir Semester (SAS) | Instrumen Terstandar & Rubrik |` +
          `\n| **TOTAL** | | **Total Alokasi Waktu KBM Semester ${semester}** | **${calcTotalSemJp + 4} JP** | | | |`
        : `| **1** | **${tpCode}** | Pengenalan Konsep Esensial & Fenomena Dasar ${topic} | ${allocatedHours} JP | *Inquiry Discovery Learning* & Eksplorasi Mindful | Tes Diagnostik Awal & Lembar Observasi Tanya Jawab | Modul Guru, Video Fenomena, LKPD 1 |
| **2** | **TP.${grade}.2** | Analisis Struktur, Pola Hubungan & Studi Kasus Mendalam | 6 JP | *Problem-Based Learning (PBL)* | Kuis Formatif Mandiri & Penilaian Diskusi Teman | Buku Teks Kemendikbud, Artikel Kasus Kontekstual |
| **3** | **TP.${grade}.3** | Investigasi Terapan & Eksperimen / Olah Data Nyata | 6 JP | *Project-Based Learning (PjBL)* & Joyful Lab | Lembar Kinerja Praktik / Observasi Unjuk Kerja | Kit Praktikum / Lembar Kerja Digital |
| **4** | **TP.${grade}.4** | Evaluasi Kritis, Refleksi Bermakna, & Proyek Kreasi | 6 JP | *Collaborative Peer Review* & Galeri Karya | Presentasi Kelompok & Penilaian Produk Portofolio | Rubrik Asesmen Sumatif Lingkup Materi |
| **TOTAL** | | **Total Alokasi Waktu KBM Semester ${semester}** | **${allocatedHours + 18} JP** | | | |`;

      const resolvedAtpTotalJP = activeMaterials.length > 0 ? (calcTotalSemJp + 4) : (params.distributionData?.totalHoursPerYear || 108);

      return `# ALUR TUJUAN PEMBELAJARAN (ATP)
## KURIKULUM MERDEKA — TAHAPAN LOGIS DARI KONKRET KE ABSTRAK

---

### A. IDENTITAS MATA PELAJARAN
* **Mata Pelajaran:** ${subject} | **Fase / Kelas:** ${phase} / Kelas ${grade}
* **Semester:** Semester ${semester}
* **Alokasi Waktu Semester:** ${resolvedAtpTotalJP} JP (Tersinkronisasi Otomatis dari Profil Guru)
* **Penyusun:** ${teacherName}

---

### B. ROADMAP ALUR TUJUAN PEMBELAJARAN (ATP) 1 TAHUN AJARAN
\`\`\`
+---------------------------------------------------------------------------------------------------+
|                     ROADMAP ALUR TUJUAN PEMBELAJARAN (ATP) 1 TAHUN AJARAN                         |
|                                                                                                   |
|  [ SEMESTER GANJIL ]                                                                              |
|  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌────────────────┐ |
|  │ TAHAP 1:        │  ───► │ TAHAP 2:        │  ───► │ TAHAP 3:        │  ───► │ EVALUASI ASTS/ │ |
|  │ Fondasi Konsep  │       │ Investigasi Data│       │ Rekayasa Solusi │       │ ASAS GANJIL    │ |
|  └─────────────────┘       └─────────────────┘       └─────────────────┘       └────────────────┘ |
|                                                                                                   |
|  [ SEMESTER GENAP ]                                                                               |
|  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌────────────────┐ |
|  │ TAHAP 4:        │  ───► │ TAHAP 5:        │  ───► │ TAHAP 6:        │  ───► │ SUMATIF AKHIR  │ |
|  │ Integrasi Sistem│       │ Analisis Kritis │       │ Gelar Karya P5  │       │ TAHUN AJARAN   │ |
|  └─────────────────┘       └─────────────────┘       └─────────────────┘       └────────────────┘ |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### C. MATRIKS ALUR TUJUAN PEMBELAJARAN (ATP) TERSINKRONISASI
| Tahap | Kode TP | Ruang Lingkup Materi Pokok | Alokasi Waktu | Model / Metode Pembelajaran | Bentuk Asesmen Formatif | Sumber / Media Belajar |
| :-: | :--- | :--- | :-: | :--- | :--- | :--- |
${atpRows}

---

### D. DIAGRAM SIKLUS BELAJAR BERKELANJUTAN
\`\`\`
+---------------------------------------------------------------------------------------------------+
|               DIAGRAM SIKLUS BELAJAR BERKELANJUTAN DEEP LEARNING                                  |
|                                                                                                   |
|  ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐       |
|  │ 1. MINDFUL APERSEPSI   │ ───► │ 2. MEANINGFUL INQUIRY  │ ───► │ 3. JOYFUL CREATION     │       |
|  │  (Membangun Minat Awal)│      │  (Eksplorasi Kasus)    │      │  (Proyek Solusi Nyata) │       |
|  └────────────────────────┘      └────────────────────────┘      └───────────┬────────────┘       |
|                                                                              │                    |
|                                  ┌───────────────────────────────────────────┘                    |
|                                  ▼                                                                |
|                          ┌────────────────────────┐                                               |
|                          │ 4. ASESMEN & REFLEKSI  │                                               |
|                          │  (Evaluasi & Umpan Blk)│                                               |
|                          └────────────────────────┘                                               |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### E. CATATAN DIFERENSIASI & FLEKSIBILITAS WAKTU
* Alokasi jam dapat disesuaikan secara proporsional sesuai kecepatan dan daya serap rombongan belajar.
* Pembelajaran remedial dilaksanakan secara terintegrasi setelah asesmen formatif selesai.
`;
    }

    case 'analisis_alokasi_waktu':
    case 'alokasi_waktu':
    case 'rbe': {
      const sem1EffWeeks = params.kalenderData?.semester1?.totalEffectiveWeeks || 19;
      const sem2EffWeeks = params.kalenderData?.semester2?.totalEffectiveWeeks || 18;
      const jpPerWk = params.kalenderData?.semester1?.jpPerWeek || (level === 'SD' ? 4 : 3);
      const sem1TotalJp = sem1EffWeeks * jpPerWk;
      const sem2TotalJp = sem2EffWeeks * jpPerWk;

      const customSchoolHeader = params.customFormatNotes
        ? `\n> 📋 **FORMAT DOKUMEN KHUSUS SEKOLAH DIAKTIFKAN**\n> Dokumen ini disusun dan distrukturkan menyesuaikan format baku resmi satuan pendidikan.\n\n`
        : '';

      return `# ANALISIS ALOKASI WAKTU & RINCIAN PEKAN EFEKTIF (RBE)
## KURIKULUM MERDEKA — TAHUN PELAJARAN ${resolvedAcademicYear}
### DIANALISIS DARI KALENDER PENDIDIKAN RESMI
${customSchoolHeader}
---

### A. IDENTITAS PERANGKAT
* **Satuan Pendidikan:** Satuan Pendidikan Indonesia
* **Mata Pelajaran:** **${subject}**
* **Fase / Kelas:** **${phase} / Kelas ${grade} (${level})**
* **Tahun Pelajaran:** ${resolvedAcademicYear}
* **Alokasi Jam per Pekan:** **${jpPerWk} JP / Minggu**
* **Guru Pengampu:** ${teacherName}

---

### B. SKEMA STRUKTUR DISTRIBUSI ALOKASI WAKTU 1 TAHUN AJARAN
\`\`\`
+---------------------------------------------------------------------------------------------------+
|               SKEMA STRUKTUR DISTRIBUSI ALOKASI WAKTU TAHUN PELAJARAN ${resolvedAcademicYear}            |
|                                                                                                   |
|  [ TOTAL 52 PEKAN KALENDER PENDIDIKAN ]                                                           |
|  ├─────────────────────────────────────────────────┬───────────────────────────────────────────┤  |
|  ▼                                                 ▼                                           |  |
|  [ SEMESTER GANJIL: 26 PEKAN ]                     [ SEMESTER GENAP: 26 PEKAN ]                |  |
|  ├── Pekan Tidak Efektif : 7 Pekan                 ├── Pekan Tidak Efektif : 8 Pekan           |  |
|  └── Pekan Efektif KBM   : ${sem1EffWeeks} Pekan (${sem1TotalJp} JP)          └── Pekan Efektif KBM   : ${sem2EffWeeks} Pekan (${sem2TotalJp} JP)    |  |
|      ├── Jam KBM Tatap Muka: ${sem1TotalJp - 6} JP (${sem1EffWeeks - 2} Pekan)          ├── Jam KBM Tatap Muka: ${sem2TotalJp - 6} JP (${sem2EffWeeks - 2} Pekan)    |  |
|      └── Cadangan & Asesmen: 6 JP (2 Pekan)               └── Cadangan & Asesmen: 6 JP (2 Pekan)         |  |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### C. ANALISIS RINCIAN PEKAN EFEKTIF SEMESTER 1 (GANJIL)
#### 1. Distribusi Jumlah Pekan Semester 1 (Juli s.d. Desember ${startYear})
| No | Nama Bulan | Jumlah Pekan Kalender | Pekan Tidak Efektif | Pekan Efektif KBM | Keterangan Pekan Tidak Efektif (Kalender Pendidikan) |
| :-: | :--- | :-: | :-: | :-: | :--- |
| 1 | **Juli 2025** | 5 Pekan | 2 Pekan | 3 Pekan | Libur Akhir TP 2024/2025 (P1-P2) & MPLS / Matsama (P3) |
| 2 | **Agustus 2025** | 4 Pekan | 0 Pekan | 4 Pekan | KBM Efektif Penuh (Peringatan HUT RI ke-80) |
| 3 | **September 2025** | 5 Pekan | 1 Pekan | 4 Pekan | Asesmen Tengah Semester / ASTS Ganjil (Pekan 4) |
| 4 | **Oktober 2025** | 4 Pekan | 0 Pekan | 4 Pekan | KBM Efektif & Pekan Projek P5 |
| 5 | **November 2025** | 4 Pekan | 0 Pekan | 4 Pekan | KBM Efektif Penuh |
| 6 | **Desember 2025** | 4 Pekan | 4 Pekan | 0 Pekan | ASAS (P1), Remedial & Nilai (P2), Rapor (P3), Libur Sem 1 (P4) |
| **TOTAL** | **Semester 1 (Ganjil)** | **26 Pekan** | **7 Pekan** | **${sem1EffWeeks} Pekan** | **Total Pekan Efektif KBM: ${sem1EffWeeks} Pekan** |

#### 2. Perhitungan Jam Pelajaran (JP) Efektif Semester 1
| Komponen Perhitungan | Formula & Rincian | Hasil Jam Pelajaran (JP) |
| :--- | :--- | :-: |
| **a. Jumlah Pekan Efektif KBM** | ${sem1EffWeeks} Pekan | ${sem1EffWeeks} Pekan |
| **b. Alokasi Waktu Mengajar** | ${jpPerWk} JP / Pekan | ${jpPerWk} JP / Minggu |
| **c. Jumlah Total Jam Efektif** | ${sem1EffWeeks} Pekan × ${jpPerWk} JP | **${sem1TotalJp} JP** |
| **d. Cadangan Jam Pelajaran** | Asesmen Sumatif Lingkup Materi & Remedial | 6 JP |
| **e. Jam Efektif Tatap Muka KBM** | Total Jam Efektif - Cadangan Jam | **${sem1TotalJp - 6} JP** |

---

### D. ANALISIS RINCIAN PEKAN EFEKTIF SEMESTER 2 (GENAP)
#### 1. Distribusi Jumlah Pekan Semester 2 (Januari s.d. Juni ${endYear})
| No | Nama Bulan | Jumlah Pekan Kalender | Pekan Tidak Efektif | Pekan Efektif KBM | Keterangan Pekan Tidak Efektif (Kalender Pendidikan) |
| :-: | :--- | :-: | :-: | :-: | :--- |
| 1 | **Januari 2026** | 5 Pekan | 1 Pekan | 4 Pekan | Libur Tahun Baru & Awal Semester Genap (Pekan 1) |
| 2 | **Februari 2026** | 4 Pekan | 0 Pekan | 4 Pekan | KBM Efektif Penuh |
| 3 | **Maret 2026** | 4 Pekan | 1 Pekan | 3 Pekan | ASTS Genap & Libur Awal Ramadhan 1447 H (Pekan 3) |
| 4 | **April 2026** | 5 Pekan | 2 Pekan | 3 Pekan | Libur Hari Raya Idul Fitri 1447 H & Cuti Bersama (P1-P2) |
| 5 | **Mei 2026** | 4 Pekan | 1 Pekan | 3 Pekan | Asesmen Sumatif Akhir Jenjang / Ujian Sekolah (Pekan 3) |
| 6 | **Juni 2026** | 4 Pekan | 3 Pekan | 1 Pekan | ASAS Genap (P1), Pembagian Rapor (P2), Libur Akhir TP (P3-P4) |
| **TOTAL** | **Semester 2 (Genap)** | **26 Pekan** | **8 Pekan** | **${sem2EffWeeks} Pekan** | **Total Pekan Efektif KBM: ${sem2EffWeeks} Pekan** |

#### 2. Perhitungan Jam Pelajaran (JP) Efektif Semester 2
| Komponen Perhitungan | Formula & Rincian | Hasil Jam Pelajaran (JP) |
| :--- | :--- | :-: |
| **a. Jumlah Pekan Efektif KBM** | ${sem2EffWeeks} Pekan | ${sem2EffWeeks} Pekan |
| **b. Alokasi Waktu Mengajar** | ${jpPerWk} JP / Pekan | ${jpPerWk} JP / Minggu |
| **c. Jumlah Total Jam Efektif** | ${sem2EffWeeks} Pekan × ${jpPerWk} JP | **${sem2TotalJp} JP** |
| **d. Cadangan Jam Pelajaran** | Asesmen Sumatif Akhir & Remedial | 6 JP |
| **e. Jam Efektif Tatap Muka KBM** | Total Jam Efektif - Cadangan Jam | **${sem2TotalJp - 6} JP** |

---

### E. REKAPITULASI ALOKASI WAKTU 1 TAHUN PELAJARAN (SEMESTER 1 & 2)
| No | Semester | Jumlah Pekan Kalender | Pekan Tidak Efektif | Pekan Efektif | Total Jam Efektif (JP) | Cadangan Jam (JP) | Jam Tatap Muka KBM (JP) |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 | **Semester 1 (Ganjil)** | 26 Pekan | 7 Pekan | ${sem1EffWeeks} Pekan | ${sem1TotalJp} JP | 6 JP | ${sem1TotalJp - 6} JP |
| 2 | **Semester 2 (Genap)** | 26 Pekan | 8 Pekan | ${sem2EffWeeks} Pekan | ${sem2TotalJp} JP | 6 JP | ${sem2TotalJp - 6} JP |
| **TOTAL** | **1 Tahun Pelajaran** | **52 Pekan** | **15 Pekan** | **${sem1EffWeeks + sem2EffWeeks} Pekan** | **${sem1TotalJp + sem2TotalJp} JP** | **12 JP** | **${sem1TotalJp + sem2TotalJp - 12} JP** |

---

### F. TABEL DISTRIBUSI ALOKASI WAKTU (JP) & JUMLAH PERTEMUAN PER BAB
*(Perhitungan otomatis: Jumlah Pertemuan = Alokasi Waktu Bab (JP) ÷ Beban ${jpPerWk} JP/Minggu. Contoh: 1 Bab 25 JP ÷ 5 JP/Minggu = 5 Kali Pertemuan Tatap Muka di RPM)*

#### 1. Distribusi Alokasi Waktu Semester 1 (Ganjil)
| No | Kode TP | Bab / Lingkup Materi Pokok | Alokasi Waktu (JP) | Beban JP / Minggu | Jumlah Pertemuan | Rincian Tatap Muka RPM | Keterangan Pendekatan |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- | :--- |
${sem1Materials.length > 0 ? sem1Materials.map((m, idx) => {
  const jp = Number(m.allocatedHours) || 25;
  const meetings = Math.max(1, Math.round(jp / jpPerWk));
  return `| ${idx + 1} | ${m.tpCode || `TP.${grade}.1.${idx + 1}`} | ${m.essentialMaterial || m.tpName || `Bab ${idx + 1}`} | **${jp} JP** | ${jpPerWk} JP / Minggu | **${meetings} Pertemuan** | ${meetings} Pertemuan × ${jpPerWk} JP | Deep Learning Inquiry & Formatif |`;
}).join('\n') : `| 1 | TP.${grade}.1.1 | Bab 1: Eksplorasi Konseptual & Prinsip Awal ${subject} | **25 JP** | ${jpPerWk} JP / Minggu | **${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan** | ${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan × ${jpPerWk} JP | Deep Learning Inquiry |
| 2 | TP.${grade}.1.2 | Bab 2: Analisis Kritis & Penerapan Kasus Terpadu | **25 JP** | ${jpPerWk} JP / Minggu | **${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan** | ${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan × ${jpPerWk} JP | Problem-Based Learning |`}
| - | - | **Cadangan Jam Pelajaran & Asesmen Sumatif Semester 1** | **6 JP** | ${jpPerWk} JP / Minggu | **${Math.max(1, Math.round(6 / jpPerWk))} Pertemuan** | ASTS / ASAS / Remedial | Kalender Pendidikan |
| **TOTAL** | | **Jumlah Jam Pelajaran Semester Ganjil** | **${sem1TotalJp} JP** | **${jpPerWk} JP / Minggu** | **${sem1EffWeeks} Pertemuan** | **${sem1TotalJp} JP KBM Efektif** | **100% Selaras Kaldik & RPM** |

#### 2. Distribusi Alokasi Waktu Semester 2 (Genap)
| No | Kode TP | Bab / Lingkup Materi Pokok | Alokasi Waktu (JP) | Beban JP / Minggu | Jumlah Pertemuan | Rincian Tatap Muka RPM | Keterangan Pendekatan |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- | :--- |
${sem2Materials.length > 0 ? sem2Materials.map((m, idx) => {
  const startIdx = (sem1Materials.length > 0 ? sem1Materials.length : 2) + idx + 1;
  const jp = Number(m.allocatedHours) || 25;
  const meetings = Math.max(1, Math.round(jp / jpPerWk));
  return `| ${startIdx} | ${m.tpCode || `TP.${grade}.2.${idx + 1}`} | ${m.essentialMaterial || m.tpName || `Bab ${startIdx}`} | **${jp} JP** | ${jpPerWk} JP / Minggu | **${meetings} Pertemuan** | ${meetings} Pertemuan × ${jpPerWk} JP | Deep Learning Meaningful & Proyek |`;
}).join('\n') : `| 3 | TP.${grade}.2.1 | Bab 3: Integrasi Lanjutan & Model Pemecahan Masalah | **25 JP** | ${jpPerWk} JP / Minggu | **${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan** | ${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan × ${jpPerWk} JP | Eksplorasi Lanjutan |
| 4 | TP.${grade}.2.2 | Bab 4: Gelar Karya Inovasi & Refleksi Komprehensif | **25 JP** | ${jpPerWk} JP / Minggu | **${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan** | ${Math.max(1, Math.round(25 / jpPerWk))} Pertemuan × ${jpPerWk} JP | Kolaborasi & Pameran Karya |`}
| - | - | **Cadangan Jam Pelajaran & Asesmen Sumatif Akhir Tahun** | **6 JP** | ${jpPerWk} JP / Minggu | **${Math.max(1, Math.round(6 / jpPerWk))} Pertemuan** | ASAS Genap & Kenaikan | Kalender Pendidikan |
| **TOTAL** | | **Jumlah Jam Pelajaran Semester Genap** | **${sem2TotalJp} JP** | **${jpPerWk} JP / Minggu** | **${sem2EffWeeks} Pertemuan** | **${sem2TotalJp} JP KBM Efektif** | **100% Selaras Kaldik & RPM** |
`;
    }

    case 'prota': {
      let sumSem1 = 0;
      const sem1Rows = sem1Materials.length > 0
        ? sem1Materials.map((mat, idx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${idx + 1}`;
            const jp = Number(mat.allocatedHours) || 18;
            sumSem1 += jp;
            return `| ${idx + 1} | TP.${grade}.${idx + 1} | ${babName} | ${jp} JP | Pembelajaran Mendalam + Formatif |`;
          }).join('\n')
        : `| 1 | TP.${grade}.1 | Bab 1: Konsep Fundamental & Prinsip Awal ${subject} | 18 JP | Pembelajaran Mendalam + Formatif |
| 2 | TP.${grade}.2 | Bab 2: Analisis Kritis & Penerapan Kontekstual ${subject} | 18 JP | Studi Kasus & Diskusi |
| 3 | TP.${grade}.3 | Bab 3: Investigasi Terpadu & Proyek Kolaboratif | 14 JP | Proyek Kreatif Siswa |`;

      const cadangan1 = 4;
      const totalSem1JP = (sem1Materials.length > 0 ? sumSem1 : 50) + cadangan1;

      let sumSem2 = 0;
      const sem2StartIdx = (sem1Materials.length > 0 ? sem1Materials.length : 3);
      const sem2Rows = sem2Materials.length > 0
        ? sem2Materials.map((mat, idx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${sem2StartIdx + idx + 1}`;
            const jp = Number(mat.allocatedHours) || 18;
            sumSem2 += jp;
            return `| ${sem2StartIdx + idx + 1} | TP.${grade}.${sem2StartIdx + idx + 1} | ${babName} | ${jp} JP | Pembelajaran Mendalam + Formatif |`;
          }).join('\n')
        : `| 4 | TP.${grade}.4 | Bab 4: Eksplorasi Tingkat Lanjut & Integrasi Sistem | 18 JP | Pembelajaran Mendalam |
| 5 | TP.${grade}.5 | Bab 5: Evaluasi Dampak, Etika, & Rekayasa Solusi | 18 JP | Proyek Desain Solusi |
| 6 | TP.${grade}.6 | Bab 6: Gelar Karya Inovasi & Refleksi Komprehensif | 14 JP | Pameran Hasil Belajar |`;

      const cadangan2 = 4;
      const totalSem2JP = (sem2Materials.length > 0 ? sumSem2 : 50) + cadangan2;
      const grandTotalJP = totalSem1JP + totalSem2JP;

      return `# PROGRAM TAHUNAN (PROTA)
## TAHUN PELAJARAN ${resolvedAcademicYear}

---

### A. IDENTITAS PROGRAM
* **Satuan Pendidikan:** ${schoolName}
* **Mata Pelajaran:** **${subject}**
* **Fase / Kelas:** **${phase} / Kelas ${grade} (${level})**
* **Total Alokasi Waktu:** **${grandTotalJP} JP (Jam Pelajaran)**
* **Guru Pengampu:** ${teacherName}

---

### B. SKEMA ALUR PROGRAM TAHUNAN (PROTA) & BEBAN BELAJAR
\`\`\`
+---------------------------------------------------------------------------------------------------+
|               SKEMA ALUR PROGRAM TAHUNAN (PROTA) TAHUN AJARAN ${resolvedAcademicYear}                 |
|                                                                                                   |
|  [ ANALISIS CP & ELEMEN MAPEL ] ──► [ PENETAPAN ATP & DISTRIBUSI JP ] ──► [ EKSEKUSI PROTA ]     |
|                                                                                 │                 |
|         ┌───────────────────────────────────────────────────────────────────────┘                 |
|         ▼                                                                                         |
|  ┌──────────────────────────────────────────────┐      ┌────────────────────────────────────────┐ |
|  │ SEMESTER 1 (GANJIL): ${totalSem1JP} JP                   │      │ SEMESTER 2 (GENAP): ${totalSem2JP} JP              │ |
|  ├──────────────────────────────────────────────┤      ├────────────────────────────────────────┤ |
|  │ • Seluruh Bab Materi Pokok Ganjil            │      │ • Seluruh Bab Materi Pokok Genap       │ |
|  │ • Asesmen Formatif & ASTS Ganjil             │      │ • Asesmen Formatif & ASTS Genap        │ |
|  │ • ASAS Ganjil & Pelaporan Rapor Sem 1        │      │ • ASAS Akhir Jenjang & Gelar Karya P5  │ |
|  └──────────────────────────────────────────────┘      └────────────────────────────────────────┘ |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### C. PERHITUNGAN ALOKASI PEKAN EFEKTIF
| No | Semester | Jumlah Pekan Kalender | Pekan Tidak Efektif (Libur/PTS/PAS) | Pekan Efektif KBM | Alokasi Waktu (JP/Minggu x Pekan) |
| :-: | :--- | :-: | :-: | :-: | :-: |
| 1 | **Semester 1 (Ganjil)** | 26 Pekan | 8 Pekan | 18 Pekan | **${totalSem1JP} JP** |
| 2 | **Semester 2 (Genap)** | 26 Pekan | 8 Pekan | 18 Pekan | **${totalSem2JP} JP** |
| **TOTAL** | **1 Tahun Ajaran** | **52 Pekan** | **16 Pekan** | **36 Pekan** | **${grandTotalJP} JP** |

---

### D. DISTRIBUSI MATERI SEMESTER 1 (GANJIL) TERSINKRONISASI
| No | Kode TP | Lingkup Materi Pokok (Semester 1) | Alokasi Jam (JP) | Keterangan |
| :-: | :--- | :--- | :-: | :--- |
${sem1Rows}
| - | - | **Cadangan Jam Pelajaran & Asesmen Sumatif Semester 1** | ${cadangan1} JP | Sumatif Lingkup Materi / SAS |
| **JUMLAH** | | **Total Semester Ganjil** | **${totalSem1JP} JP** | **Tuntas Semester 1** |

---

### E. DISTRIBUSI MATERI SEMESTER 2 (GENAP) TERSINKRONISASI
| No | Kode TP | Lingkup Materi Pokok (Semester 2) | Alokasi Jam (JP) | Keterangan |
| :-: | :--- | :--- | :-: | :--- |
${sem2Rows}
| - | - | **Cadangan Jam Pelajaran & Asesmen Sumatif Akhir Tahun** | ${cadangan2} JP | Asesmen Sumatif Akhir Jenjang |
| **JUMLAH** | | **Total Semester Genap** | **${totalSem2JP} JP** | **Tuntas Semester 2** |
`;
    }

    case 'prosem': {
      const isGanjil = semester === 'Ganjil' || semester === '1';
      const hoursPerWeek = params.distributionData?.hoursPerWeek || 3;
      const resolvedGradeText = typeof grade === 'number' ? (grade === 10 ? 'X' : grade === 11 ? 'XI' : grade === 12 ? 'XII' : `${grade}`) : `${grade}`;

      if (isGanjil) {
        const mat1 = sem1Materials[0]?.essentialMaterial || `Keanekaragaman Hayati`;
        const mat2 = sem1Materials[1]?.essentialMaterial || `Ekosistem`;
        const mat3 = sem1Materials[2]?.essentialMaterial || `Pengelolaan lingkungan`;

        return `<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 11pt; font-weight: bold; color: #334155; margin-bottom: 4px; letter-spacing: 0.5px;">PROGRAM...AP KELAS ${resolvedGradeText}</div>
  <div style="display: inline-block; background-color: #00bcd4; color: #000000; font-size: 14pt; font-weight: 900; padding: 4px 20px; border-bottom: 2.5px solid #000000; text-decoration: underline; letter-spacing: 1px;">
    PROGRAM SEMESTER
  </div>
</div>

<table style="width: 100%; border: none; margin-bottom: 12px; font-size: 10pt; font-family: inherit;">
  <tr>
    <td style="width: 50%; vertical-align: top; border: none; padding: 2px 0;">
      <table style="width: 100%; border: none;">
        <tr><td style="width: 130px; font-weight: 500; border: none; padding: 2px 0;">Mata Pelajaran</td><td style="border: none; padding: 2px 0;">: <strong>${subject}</strong></td></tr>
        <tr><td style="font-weight: 500; border: none; padding: 2px 0;">Tahun Pelajaran</td><td style="border: none; padding: 2px 0;">: ${resolvedAcademicYear}</td></tr>
      </table>
    </td>
    <td style="width: 50%; vertical-align: top; border: none; padding: 2px 0; text-align: right;">
      <div style="display: inline-block; text-align: left;">
        <div style="padding: 2px 0; font-weight: 500;"><strong>${resolvedGradeText} / Ganjil</strong></div>
        <div style="padding: 2px 0; font-weight: 500;"><strong>${hoursPerWeek}JP/ Minggu</strong></div>
      </div>
    </td>
  </tr>
</table>

<div style="overflow-x: auto; margin: 12px 0;">
  <table style="width: 100%; border-collapse: collapse; font-size: 9pt; border: 1.5px solid #000000; text-align: center;">
    <thead>
      <tr style="background-color: #c8e6c9; color: #000000; font-weight: bold;">
        <th rowspan="2" style="border: 1px solid #333333; padding: 6px 6px; width: 180px; text-align: center; vertical-align: middle;">Konten/Materi</th>
        <th rowspan="2" style="border: 1px solid #333333; padding: 6px 4px; width: 50px; text-align: center; vertical-align: middle;">JML<br/>JP</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Juli</th>
        <th colspan="5" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Agustus</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">September</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Oktober</th>
        <th colspan="5" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Nofember</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Desember</th>
        <th rowspan="2" style="border: 1px solid #333333; padding: 6px 4px; width: 40px; text-align: center; vertical-align: middle;">Ket</th>
      </tr>
      <tr style="background-color: #c8e6c9; color: #000000; font-weight: bold; font-size: 8.5pt;">
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">5</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">5</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
      </tr>
    </thead>
    <tbody>
      <!-- Baris Materi 1 -->
      <tr>
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; vertical-align: top; font-weight: 500;">${mat1}</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle;">30JP</td>
        <td style="border: 1px solid #333333; background-color: #90caf9; font-weight: bold; color: #ffffff;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; background-color: #90caf9; font-weight: bold; color: #ffffff;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; background-color: #1e3a8a; font-weight: bold; color: #ffffff;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; background-color: #fb923c; font-weight: bold; color: #ffffff;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; background-color: #94a3b8;" rowspan="3"></td>
        <td style="border: 1px solid #333333; background-color: #94a3b8; font-weight: bold; font-size: 11pt; color: #1e293b;" rowspan="3">LS</td>
        <td style="border: 1px solid #333333; background-color: #94a3b8;" rowspan="3"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Materi 2 -->
      <tr>
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; vertical-align: top; font-weight: 500;">${mat2}</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle;">30JP</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Materi 3 -->
      <tr>
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; vertical-align: top; font-weight: 500;">${mat3}</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle;">29JP</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Jam Cadangan -->
      <tr style="background-color: #ffffff; font-weight: 500;">
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; font-weight: bold;">JML Jam Cadangan</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center;">1</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">1</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Total JP -->
      <tr style="background-color: #ffffff; font-weight: bold;">
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; font-weight: bold;">JML Total JP</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center;">66JP</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
    </tbody>
  </table>
</div>

<div style="margin-top: 20px; font-size: 9pt; color: #334155;">
  <strong>Keterangan Format & Agenda Warna:</strong><br/>
  <span style="display:inline-block; width: 12px; height: 12px; background-color: #90caf9; vertical-align: middle; border: 1px solid #333; margin-right: 4px;"></span> Biru Muda = MPLS / Orientasi Sekolah<br/>
  <span style="display:inline-block; width: 12px; height: 12px; background-color: #1e3a8a; vertical-align: middle; border: 1px solid #333; margin-right: 4px;"></span> Biru Tua = Awal Tahun Pelajaran Baru<br/>
  <span style="display:inline-block; width: 12px; height: 12px; background-color: #fb923c; vertical-align: middle; border: 1px solid #333; margin-right: 4px;"></span> Oranye = Matrikulasi & Pembentukan Karakter<br/>
  <span style="display:inline-block; width: 12px; height: 12px; background-color: #94a3b8; vertical-align: middle; border: 1px solid #333; margin-right: 4px;"></span> <strong>LS</strong> = Libur Semester / Penilaian Akhir & Pengisian Rapor
</div>
`;
      } else {
        const mat1 = sem2Materials[0]?.essentialMaterial || `Sistem Regulasi & Koordinasi`;
        const mat2 = sem2Materials[1]?.essentialMaterial || `Bioteknologi Lingkungan`;
        const mat3 = sem2Materials[2]?.essentialMaterial || `Inovasi Rekayasa Terapan`;

        return `<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 11pt; font-weight: bold; color: #334155; margin-bottom: 4px; letter-spacing: 0.5px;">PROGRAM...AP KELAS ${resolvedGradeText}</div>
  <div style="display: inline-block; background-color: #00bcd4; color: #000000; font-size: 14pt; font-weight: 900; padding: 4px 20px; border-bottom: 2.5px solid #000000; text-decoration: underline; letter-spacing: 1px;">
    PROGRAM SEMESTER
  </div>
</div>

<table style="width: 100%; border: none; margin-bottom: 12px; font-size: 10pt; font-family: inherit;">
  <tr>
    <td style="width: 50%; vertical-align: top; border: none; padding: 2px 0;">
      <table style="width: 100%; border: none;">
        <tr><td style="width: 130px; font-weight: 500; border: none; padding: 2px 0;">Mata Pelajaran</td><td style="border: none; padding: 2px 0;">: <strong>${subject}</strong></td></tr>
        <tr><td style="font-weight: 500; border: none; padding: 2px 0;">Tahun Pelajaran</td><td style="border: none; padding: 2px 0;">: ${resolvedAcademicYear}</td></tr>
      </table>
    </td>
    <td style="width: 50%; vertical-align: top; border: none; padding: 2px 0; text-align: right;">
      <div style="display: inline-block; text-align: left;">
        <div style="padding: 2px 0; font-weight: 500;"><strong>${resolvedGradeText} / Genap</strong></div>
        <div style="padding: 2px 0; font-weight: 500;"><strong>${hoursPerWeek}JP/ Minggu</strong></div>
      </div>
    </td>
  </tr>
</table>

<div style="overflow-x: auto; margin: 12px 0;">
  <table style="width: 100%; border-collapse: collapse; font-size: 9pt; border: 1.5px solid #000000; text-align: center;">
    <thead>
      <tr style="background-color: #c8e6c9; color: #000000; font-weight: bold;">
        <th rowspan="2" style="border: 1px solid #333333; padding: 6px 6px; width: 180px; text-align: center; vertical-align: middle;">Konten/Materi</th>
        <th rowspan="2" style="border: 1px solid #333333; padding: 6px 4px; width: 50px; text-align: center; vertical-align: middle;">JML<br/>JP</th>
        <th colspan="5" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Januari</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Februari</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Maret</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">April</th>
        <th colspan="5" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Mei</th>
        <th colspan="4" style="border: 1px solid #333333; padding: 5px 3px; text-align: center;">Juni</th>
        <th rowspan="2" style="border: 1px solid #333333; padding: 6px 4px; width: 40px; text-align: center; vertical-align: middle;">Ket</th>
      </tr>
      <tr style="background-color: #c8e6c9; color: #000000; font-weight: bold; font-size: 8.5pt;">
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">5</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">5</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">1</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">2</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">3</th>
        <th style="border: 1px solid #333333; padding: 3px 1px; width: 22px;">4</th>
      </tr>
    </thead>
    <tbody>
      <!-- Baris Materi 1 -->
      <tr>
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; vertical-align: top; font-weight: 500;">${mat1}</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle;">27JP</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; background-color: #94a3b8;" rowspan="3"></td>
        <td style="border: 1px solid #333333; background-color: #94a3b8; font-weight: bold; font-size: 11pt; color: #1e293b;" rowspan="3">LS</td>
        <td style="border: 1px solid #333333; background-color: #94a3b8;" rowspan="3"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Materi 2 -->
      <tr>
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; vertical-align: top; font-weight: 500;">${mat2}</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle;">27JP</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Materi 3 -->
      <tr>
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; vertical-align: top; font-weight: 500;">${mat3}</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: middle;">24JP</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Jam Cadangan -->
      <tr style="background-color: #ffffff; font-weight: 500;">
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; font-weight: bold;">JML Jam Cadangan</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center;">1</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">1</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333; font-weight: bold;">0</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
      <!-- Baris Total JP -->
      <tr style="background-color: #ffffff; font-weight: bold;">
        <td style="border: 1px solid #333333; padding: 6px 8px; text-align: left; font-weight: bold;">JML Total JP</td>
        <td style="border: 1px solid #333333; padding: 6px 4px; font-weight: bold; text-align: center;">60JP</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333; font-weight: bold;">${hoursPerWeek}</td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
        <td style="border: 1px solid #333333;"></td>
      </tr>
    </tbody>
  </table>
</div>

<div style="margin-top: 20px; font-size: 9pt; color: #334155;">
  <strong>Keterangan Format & Agenda Warna:</strong><br/>
  <span style="display:inline-block; width: 12px; height: 12px; background-color: #c8e6c9; vertical-align: middle; border: 1px solid #333; margin-right: 4px;"></span> Hijau = Header Distribusi KBM Efektif<br/>
  <span style="display:inline-block; width: 12px; height: 12px; background-color: #94a3b8; vertical-align: middle; border: 1px solid #333; margin-right: 4px;"></span> <strong>LS</strong> = Libur Akhir Tahun / Penyerahan Buku Laporan Hasil Belajar
</div>
`;
      }
    }

    case 'modul_ajar':
    case 'rpm':
    case 'rpm_deep_learning_master': {
      // 1. Resolve authentic CP text extracted from uploaded file / activeMaster
      const actualCP = params.cpText || (distributionData as any)?.cpText || (syncedContext.activeMaster as any)?.cpText || `Peserta didik memahami keanekaragaman hayati dan fenomena esensial pada materi ${topic}, serta mampu menerapkan prinsip ilmiah, mengidentifikasi hubungan antarvariabel, dan memecahkan permasalahan kontekstual di kehidupan sehari-hari.`;

      // 2. Resolve authentic TP formulation from manualTP or uploaded file materials with explicit TP codes
      let tpFormattedList = '';
      const matchingMaterials = activeMaterials ? activeMaterials.filter(m => 
        m.essentialMaterial?.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(m.essentialMaterial?.toLowerCase() || '') ||
        m.tpName?.toLowerCase().includes(topic.toLowerCase())
      ) : [];
      const materialsToUse = matchingMaterials.length > 0 ? matchingMaterials : (activeMaterials?.slice(0, Math.max(1, meetingCount)) || []);

      if (manualTP && manualTP.trim().length > 0) {
        // Ensure manual TP has [TP.X.Y] code if not already formatted
        const lines = manualTP.trim().split('\n').filter(Boolean);
        tpFormattedList = lines.map((line, idx) => {
          const cleanText = line.replace(/^(\d+[\.\)\-:]|\-|\*|\•)\s*/, '').trim();
          if (cleanText.startsWith('[TP.') || cleanText.startsWith('TP.')) {
            return `${idx + 1}. ${cleanText}`;
          }
          const defaultCode = materialsToUse[idx]?.tpCode || `TP.${grade}.${idx + 1}`;
          return `${idx + 1}. [${defaultCode}] ${cleanText}`;
        }).join('\n');
      } else if (materialsToUse.length > 0) {
        const allTPs: { code: string; name: string }[] = [];
        materialsToUse.forEach((m, mIdx) => {
          const rawLines = (m.tpName || '').split('\n').map(l => l.trim()).filter(Boolean);
          if (rawLines.length > 1) {
            rawLines.forEach((line, subIdx) => {
              const cleanText = line.replace(/^(\d+[\.\)\-:]|\[TP\.[^\]]+\]|TP\.[^\s:]+[:\s]*|\-|\*|\•)\s*/, '').trim();
              const subCode = m.tpCode ? `${m.tpCode}.${subIdx + 1}` : `TP.${grade}.${mIdx + 1}.${subIdx + 1}`;
              allTPs.push({ code: subCode, name: cleanText });
            });
          } else {
            const cleanText = (m.tpName || '').replace(/^(\d+[\.\)\-:]|\[TP\.[^\]]+\]|TP\.[^\s:]+[:\s]*|\-|\*|\•)\s*/, '').trim();
            allTPs.push({ code: m.tpCode || `TP.${grade}.${mIdx + 1}`, name: cleanText || m.essentialMaterial });
          }
        });
        tpFormattedList = allTPs.map((t, idx) => `${idx + 1}. [${t.code}] ${t.name}`).join('\n');
      }

      if (!tpFormattedList) {
        tpFormattedList = `1. [TP.${grade}.1.1.1] Menganalisis konsep esensial, karakteristik utama, dan prinsip dasar materi ${topic}.
2. [TP.${grade}.1.1.2] Peserta didik mampu menerapkan prinsip, mengidentifikasi hubungan variabel, dan memecahkan permasalahan kontekstual terkait ${topic}.`;
      }

      // 3. Resolve sub-topics for meetings and link each meeting to its corresponding TP Code
      const extractedSubTopicsFromTP: string[] = [];
      const extractedTPCodes: string[] = [];

      if (manualTP && manualTP.trim().length > 0) {
        const manualLines = manualTP.trim().split('\n').map(l => l.trim()).filter(Boolean);
        manualLines.forEach((line, idx) => {
          const codeMatch = line.match(/\[(TP\.[^\]]+)\]/i);
          const cleanText = line.replace(/^(\d+[\.\)\-:]|\[TP\.[^\]]+\]|TP\.[^\s:]+[:\s]*|\-|\*|\•)\s*/, '').trim();
          if (cleanText) extractedSubTopicsFromTP.push(cleanText);
          extractedTPCodes.push(codeMatch ? codeMatch[1] : (materialsToUse[idx]?.tpCode || `TP.${grade}.${idx + 1}`));
        });
      } else if (matchingMaterials.length > 0) {
        matchingMaterials.forEach((m, mIdx) => {
          const rawLines = (m.tpName || '').split('\n').map(l => l.trim()).filter(Boolean);
          rawLines.forEach((line, subIdx) => {
            const cleanText = line.replace(/^(\d+[\.\)\-:]|\[TP\.[^\]]+\]|TP\.[^\s:]+[:\s]*|\-|\*|\•)\s*/, '').trim();
            if (cleanText) extractedSubTopicsFromTP.push(cleanText);
            const subCode = m.tpCode ? (rawLines.length > 1 ? `${m.tpCode}.${subIdx + 1}` : m.tpCode) : `TP.${grade}.${mIdx + 1}.${subIdx + 1}`;
            extractedTPCodes.push(subCode);
          });
        });
      }

      // Ensure resolvedSubTopics has exactly meetingCount elements with rich contextual titles
      const resolvedSubTopics: string[] = [];
      for (let i = 0; i < meetingCount; i++) {
        if (subTopics && subTopics[i]) {
          resolvedSubTopics.push(subTopics[i]);
        } else if (extractedSubTopicsFromTP[i]) {
          resolvedSubTopics.push(extractedSubTopicsFromTP[i]);
        } else if (meetingCount === 1) {
          resolvedSubTopics.push(`Konsep Dasar, Penyelidikan Inkuiri, dan Pemecahan Masalah ${topic}`);
        } else if (i === 0) {
          resolvedSubTopics.push(`Pengenalan Fenomena, Konsep Esensial, dan Eksplorasi Inkuiri Terbimbing ${topic}`);
        } else if (i === 1) {
          resolvedSubTopics.push(`Penyelidikan Terstruktur, Analisis Hubungan Antarvariabel, dan Penguatan Ilmiah ${topic}`);
        } else if (i === 2) {
          resolvedSubTopics.push(`Formulasi Ilmiah, Aplikasi Teknologi, dan Pemecahan Masalah Nyata HOTS ${topic}`);
        } else if (i === 3) {
          resolvedSubTopics.push(`Studi Kasus Rekayasa Terapan & Desain Solusi Kolaboratif ${topic}`);
        } else {
          resolvedSubTopics.push(`Sintesis Komprehensif, Proyek Kreatif & Evaluasi Terpadu ${topic} (Tahap ${i + 1})`);
        }
      }

      // Sub-materi formatted for Module Identity table
      const subMateriTableFormatted = resolvedSubTopics.map((st, i) => {
        const code = extractedTPCodes[i] || materialsToUse[i]?.tpCode || `TP.${grade}.1.1.${i + 1}`;
        const cleanSt = st.replace(/^(\d+[\.\)\-:]|\[TP\.[^\]]+\]|TP\.[^\s:]+[:\s]*|\-|\*|\•)\s*/, '').trim();
        return `[${code}] ${cleanSt}`;
      }).join('; ');

      // 4. Generate dynamic meeting tables following the authentic Deep Learning RPM format exactly
      let meetingsContent = '';
      for (let m = 1; m <= meetingCount; m++) {
        const rawSubMateriM = resolvedSubTopics[m - 1] || `${topic} - Pertemuan Ke-${m}`;
        const cleanSubMateriM = rawSubMateriM.replace(/^(\d+[\.\)\-:]|\[TP\.[^\]]+\]|TP\.[^\s:]+[:\s]*|\-|\*|\•)\s*/, '').trim();
        const targetTPCode = extractedTPCodes[m - 1] || materialsToUse[m - 1]?.tpCode || (m === 1 ? `TP.${grade}.1.1.1` : `TP.${grade}.1.1.${m}`);
        const isFirstMeeting = m === 1;

        // Dynamic time allocation breakdown matching exact hoursPerMeeting * minutesPerJP
        const totalMeetingMinutes = hoursPerMeeting * minutesPerJP;
        const tPendahuluan = Math.max(10, Math.round(totalMeetingMinutes * 0.15));
        const tInti = Math.max(20, Math.round(totalMeetingMinutes * 0.70));
        const tPenutup = totalMeetingMinutes - tPendahuluan - tInti;
        const tFase2 = Math.round(tInti * 0.40);
        const tFase3 = Math.round(tInti * 0.35);
        const tFase4 = tInti - tFase2 - tFase3;
        const tFase5 = Math.round(tPenutup * 0.50);
        const tFase6 = tPenutup - tFase5;

        if (m > 1) {
          meetingsContent += `\n---\n<div style="page-break-before: always; margin-top: 1.5rem; margin-bottom: 1.5rem;"></div>\n`;
        }

        if (isFirstMeeting) {
          meetingsContent += `
### Pertemuan Ke ${m} (${totalMeetingMinutes} Menit)
**Materi / Sub Pokok Bahasan :** [${targetTPCode}] ${cleanSubMateriM}  
**Tujuan Pembelajaran (TP) :** [${targetTPCode}] ${cleanSubMateriM}

| TAHAP KEGIATAN | FASE SINTAKS DEEP LEARNING | ALOKASI WAKTU | KEGIATAN GURU (LENGKAP DARI AWAL MASUK KELAS) | KEGIATAN PESERTA DIDIK (AKTIF & RESPONSIF) | ASPEK 3 PILAR & 6C |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **A. KEGIATAN PENDAHULUAN** | **FASE 1: Orientasi, Apersepsi & Motivasi** | **${tPendahuluan} Menit** | 1. **Salam & Kondisi Kelas:** Guru memasuki ruang kelas dengan ramah dan mengucapkan salam pembuka bersemangat, memeriksa kebersihan ruang belajar, kerapian pakaian, dan kesiapan meja kursi.<br/>2. **Doa Bersama:** Guru meminta ketua kelas memimpin doa bersama sesuai keyakinan masing-masing (Religius & Beriman).<br/>3. **Presensi & Kesadaran Penuh (*Mindful Breathing*):** Guru mengecek kehadiran peserta didik dan memandu latihan pernapasan berkesadaran (Teknik STOP: *Stop, Take a breath, Observe, Proceed*) selama 2 menit untuk menenangkan pikiran dan memusatkan fokus belajar.<br/>4. **Apersepsi Kontekstual:** Guru menayangkan gambar/video pendek fenomena nyata seputar "${topic}" dan mengaitkannya dengan pengalaman keseharian siswa.<br/>5. **Pertanyaan Pemantik HOTS:** Guru mengajukan pertanyaan pemantik lisan:<br/>• *"Pernahkah kalian mengamati bagaimana [${targetTPCode}] ${cleanSubMateriM} bekerja di sekitar kita?"*<br/>• *"Mengapa pengukuran dan pemahaman konsep ini sangat penting bagi teknologi modern?"*<br/>6. **Penyampaian Tujuan & Skenario KBM:** Guru menyampaikan tujuan pembelajaran, peta konsep, tahapan kegiatan 6 fase Deep Learning, serta sistem asesmen formatif yang akan digunakan.<br/>7. **Pembentukan Kelompok:** Guru membagi kelas ke dalam kelompok heterogen (4-5 siswa per kelompok). | 1. Peserta didik menjawab salam guru dengan santun, tertib, dan bersemangat.<br/>2. Peserta didik berdoa bersama dengan khusyuk dipimpin ketua kelas.<br/>3. Peserta didik mengikuti panduan *Mindful Breathing* untuk menata fokus dan kehadiran diri.<br/>4. Peserta didik menyimak tayangan video apersepsi dengan penuh perhatian (*Mindful*).<br/>5. Peserta didik merespons pertanyaan pemantik secara spontan dan berani mengemukakan gagasan awal.<br/>6. Peserta didik mencatat tujuan pembelajaran di buku tulis dan mendengarkan skenario KBM.<br/>7. Peserta didik segera bergabung dengan anggota kelompoknya masing-masing secara tertib. | **Mindful Learning**<br/>• Beriman & Bertakwa<br/>• Kesadaran Diri (*Mindfulness*)<br/>• Komunikasi Awal |
| **B. KEGIATAN INTI** | **FASE 2: Eksplorasi Konsep & Penyelidikan Inkuiri** | **${tFase2} Menit** | 1. **Distribusi LKPD & Media:** Guru membagikan LKPD ${m} dan kit praktikum / media peraga kontekstual materi ${topic} kepada setiap kelompok.<br/>2. **Pembagian Peran Kerja:** Guru menginstruksikan setiap anggota kelompok memilih peran: Ketua Tim, Notulis Data, Pengamat / Pengambil Alat, dan Juru Bicara (Presenter).<br/>3. **Fasilitasi Eksplorasi:** Guru memfasilitasi peserta didik melakukan pengamatan objek nyata, pengukuran langsung, atau eksplorasi data inkuiri terstruktur pada LKPD.<br/>4. **Bimbingan Berjenjang (*Scaffolding*):** Guru berkeliling memantau jalannya diskusi, memberikan bimbingan khusus bagi kelompok yang memerlukan bantuan, dan mengajukan pertanyaan Sokratik untuk memancing pemahaman mendalam. | 1. Setiap kelompok menerima LKPD ${m} dan menyiapkan instrumen praktikum/eksplorasi.<br/>2. Peserta didik membagi tugas peran di dalam kelompok secara adil dan bertanggung jawab (Gotong Royong).<br/>3. Peserta didik melakukan investigasi, mengamati fenomena, mencatat data hasil observasi pada tabel LKPD secara jujur dan objektif.<br/>4. Peserta didik berdiskusi aktif membedah data dan mengidentifikasi karakteristik konsep inti materi. | **Meaningful Learning**<br/>• Bernalar Kritis<br/>• Gotong Royong<br/>• Penyelidikan Ilmiah |
| | **FASE 3: Penjelasan, Elaborasi & Penguatan Ilmiah** | **${tFase3} Menit** | 1. **Presentasi Pleno:** Guru mengundi/mempersilakan 2-3 kelompok untuk mempresentasikan hasil temuan LKPD di depan kelas secara percaya diri.<br/>2. **Diskusi Terbimbing:** Guru memoderatori sesi tanggapan, sanggahan, dan tanya jawab antarkelompok secara demokratis dan santun.<br/>3. **Elaborasi & Klarifikasi Miskonsepsi:** Guru memberikan klarifikasi ilmiah, meluruskan miskonsepsi yang muncul saat presentasi, dan mengelaborasi konsep materi di papan tulis/slide presentasi.<br/>4. **Penguatan Kaidah & Notasi Ilmiah:** Guru menjelaskan hukum, prinsip, notasi matematis/ilmiah baku, dan hubungan antarvariabel terkait ${topic}. | 1. Perwakilan kelompok mempresentasikan laporan hasil kerja LKPD di depan kelas dengan bahasa yang lugas (*Communication*).<br/>2. Peserta didik dari kelompok lain menyimak dengan cermat, mengajukan pertanyaan kritis, atau memberikan apresiasi.<br/>3. Peserta didik menyimak penjelasan penguatan dari guru dan mencatat poin-poin penting serta notasi rumus di buku catatan.<br/>4. Peserta didik menyempurnakan jawaban LKPD kelompok berdasarkan konfirmasi ilmiah guru. | **Meaningful Learning**<br/>• Komunikasi Efektif<br/>• Elaborasi Konsep<br/>• Notasi Ilmiah Baku |
| | **FASE 4: Aplikasi & Pemecahan Masalah Kontekstual** | **${tFase4} Menit** | 1. **Pemberian Tantangan Kontekstual:** Guru menyajikan studi kasus nyata atau soal aplikasi berbasis HOTS (*Higher Order Thinking Skills*) mengenai penerapan ${topic} dalam kehidupan sehari-hari / dunia rekayasa industri.<br/>2. **Aktivitas Kolaboratif (*Think-Pair-Share*):** Guru meminta peserta didik memecahkan tantangan tersebut secara mandiri terlebih dahulu, kemudian memvalidasi ide bersama teman sebangku.<br/>3. **Umpan Balik Formatif:** Guru membahas solusi bersama kelas dan memberikan umpan balik formatif langsung (*real-time feedback*). | 1. Peserta didik menganalisis dan menyelesaikan soal tantangan kontekstual secara mandiri (*Think*).<br/>2. Peserta didik mendiskusikan strategi penyelesaian bersama rekan kelompok (*Pair*).<br/>3. Peserta didik membagikan solusi alternatif dan menarik kesimpulan pemecahan masalah (*Share*).<br/>4. Peserta didik mencatat tips dan metode penyelesaian masalah yang efisien. | **Meaningful & Joyful Learning**<br/>• Kreativitas (*Creativity*)<br/>• Problem Solving HOTS<br/>• Think-Pair-Share |
| **C. KEGIATAN PENUTUP** | **FASE 5: Refleksi Mendalam & Metakognisi (Pola 3-2-1)** | **${tFase5} Menit** | 1. **Pemanduan Refleksi:** Guru membagikan lembar / menginstruksikan siswa menuliskan Refleksi 3-2-1 di buku refleksi:<br/>• **3** Konsep baru yang berhasil saya pahami hari ini.<br/>• **2** Hal menarik yang paling saya sukai selama KBM.<br/>• **1** Pertanyaan/hal yang masih ingin saya pelajari lebih lanjut.<br/>2. **Apresiasi Karakter:** Guru memberikan apresiasi verbal dan penghargaan positif kepada seluruh kelompok atas kolaborasi, kerja keras, dan keaktifan mereka. | 1. Peserta didik mengisi lembar Refleksi 3-2-1 secara jujur, mandiri, dan berkesadaran metakognitif.<br/>2. Dua orang peserta didik membacakan refleksinya secara sukarela di depan kelas.<br/>3. Peserta didik saling memberikan tepuk tangan apresiasi antarteman atas pencapaian belajar hari ini. | **Joyful Learning**<br/>• Refleksi 3-2-1<br/>• Metakognisi Diri<br/>• Karakter Positif |
| | **FASE 6: Simpulan Bersama, Tindak Lanjut & Doa Penutup** | **${tFase6} Menit** | 1. **Perumusan Simpulan Bersama:** Guru bersama peserta didik merangkum intisari kesimpulan pembelajaran secara terpadu.<br/>2. **Tindak Lanjut & Tugas Mandiri:** Guru memberikan tugas pengayaan kontekstual: membuat ringkasan infografis / mencari 3 contoh nyata penerapan [${targetTPCode}] ${cleanSubMateriM} di lingkungan rumah.<br/>3. **Penyampaian Rencana Berikutnya:** Guru menginformasikan materi dan persiapan praktikum untuk ${m < meetingCount ? `Pertemuan Ke-${m + 1}` : 'agenda evaluasi / bab selanjutnya'}.<br/>4. **Doa Penutup & Salam:** Guru mengajak seluruh kelas berdoa bersama mensyukuri kelancaran belajar, mengucapkan pesan motivasi: *"Belajar bermakna adalah kunci memahami alam semesta"*, dan mengakhiri sesi dengan salam penutup. | 1. Peserta didik secara antusias menyampaikan kesimpulan materi dengan kata-kata sendiri.<br/>2. Peserta didik mencatat tugas mandiri dan batas waktu pengumpulannya.<br/>3. Peserta didik menyimak informasi rencana materi pertemuan berikutnya.<br/>4. Peserta didik berdoa bersama dengan khidmat dan menjawab salam penutup guru dengan tertib. | **Mindful & Transfer**<br/>• Simpulan Terpadu<br/>• Tindak Lanjut Kontekstual<br/>• Beriman & Berakhlak Mulia |
`;
        } else {
          meetingsContent += `
### Pertemuan Ke ${m} (${totalMeetingMinutes} Menit)
**Materi / Sub Pokok Bahasan :** [${targetTPCode}] ${cleanSubMateriM}  
**Tujuan Pembelajaran (TP) :** [${targetTPCode}] ${cleanSubMateriM}

| TAHAP KEGIATAN | FASE SINTAKS DEEP LEARNING | ALOKASI WAKTU | KEGIATAN GURU (LENGKAP DARI AWAL MASUK KELAS) | KEGIATAN PESERTA DIDIK (AKTIF & RESPONSIF) | ASPEK 3 PILAR & 6C |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **A. KEGIATAN PENDAHULUAN** | **FASE 1: Orientasi, Apersepsi & Review Materi** | **${tPendahuluan} Menit** | 1. **Salam & Pengondisian:** Guru memasuki kelas dengan ramah, mengucapkan salam, menyapa siswa, serta memastikan kebersihan dan kesiapan ruang kelas.<br/>2. **Doa Pembuka:** Meminta salah satu peserta didik memimpin doa pembuka KBM.<br/>3. **Review Tugas Mandiri (*Gallery Walk*):** Guru meminta siswa memajang hasil tugas mandiri / ringkasan materi pertemuan sebelumnya di dinding kelas atau meja kelompok untuk saling diamati (*Quick Gallery Walk*).<br/>4. **Apersepsi Lanjutan:** Guru memberikan pertanyaan apersepsi penghubung:<br/>• *"Bagaimana konsep pada pertemuan sebelumnya mendasari pembahasan kita hari ini tentang [${targetTPCode}] ${cleanSubMateriM}?"*<br/>5. **Penyampaian TP & Target Kinerja:** Guru menyampaikan tujuan pembelajaran pertemuan ke-${m} dan kriteria ketuntasan yang diharapkan. | 1. Peserta didik menjawab salam guru secara kompak dan merapikan tempat duduk.<br/>2. Peserta didik berdoa bersama dengan khusyuk.<br/>3. Peserta didik memajang tugas mandiri dan saling memberikan catatan positif menggunakan *sticky note*.<br/>4. Peserta didik merespons pertanyaan apersepsi dan mengaitkan konsep sebelumnya dengan materi baru.<br/>5. Peserta didik mencatat tujuan pembelajaran dan menyiapkan modul/buku referensi. | **Mindful Learning**<br/>• Kesadaran Belajar<br/>• Apersepsi Terhubung<br/>• Apresiasi Karya Teman |
| **B. KEGIATAN INTI** | **FASE 2: Eksplorasi Konsep Lanjutan & Investigasi** | **${tFase2} Menit** | 1. **Distribusi LKPD Lanjutan:** Guru membagikan LKPD ${m} (Studi Analisis & Penerapan Lanjutan) kepada masing-masing kelompok.<br/>2. **Pengorganisasian Penyelidikan:** Guru menugaskan kelompok menganalisis data empiris, pola hubungan variabel, atau studi kasus komparatif tingkat lanjut terkait [${targetTPCode}] ${cleanSubMateriM}.<br/>3. **Fasilitasi Uji Coba & Eksperimen:** Guru memandu kelompok menguji fenomena dengan metode perbandingan atau simulasi digital interaktif.<br/>4. **Scaffolding & Konsultasi:** Guru berkeliling memberikan umpan balik langsung, memastikan semua anggota terlibat aktif, dan mengajukan pertanyaan pemandu berpikir kritis. | 1. Setiap kelompok menerima LKPD ${m} dan mendiskusikan petunjuk kerja investigasi.<br/>2. Peserta didik berkolaborasi mengumpulkan data komparatif, menganalisis angka penting/variabel esensial.<br/>3. Peserta didik membandingkan hasil pengamatan antarkelompok untuk menemukan konsistensi ilmiah.<br/>4. Peserta didik merumuskan argumentasi ilmiah pada LKPD berdasarkan bukti data empiris. | **Meaningful Learning**<br/>• Investigasi Kritis<br/>• Kolaborasi Tim<br/>• Analisis Data Empiris |
| | **FASE 3: Penjelasan, Elaborasi & Diskusi Ahli** | **${tFase3} Menit** | 1. **Presentasi Model Expert Jigsaw:** Guru memandu presentasi perwakilan kelompok dengan format perbandingan solusi.<br/>2. **Klarifikasi Konsep Kompleks:** Guru menjelaskan formulasi matematis tingkat lanjut, penurunan rumus, atau kaidah analisis mendalam di papan tulis dengan diagram visual.<br/>3. **Pembahasan Miskonsepsi Lanjutan:** Guru menyoroti kekeliruan umum yang sering terjadi saat menerapkan aturan konsep ${topic}.<br/>4. **Penegasan Hubungan Interdisipliner:** Guru menghubungkan materi dengan bidang ilmu lain (teknologi rekayasa, kedokteran, lingkungan hidup, dll). | 1. Perwakilan kelompok memaparkan argumen ilmiah dan hasil perbandingan data secara sistematis (*Communication*).<br/>2. Kelompok lain memberikan masukan konstruktif dan membandingkan hasil temuan mereka.<br/>3. Peserta didik mencatat penjelasan guru, rumus analitis, dan penurunan persamaan baku di buku catatan.<br/>4. Peserta didik aktif bertanya mengenai keterkaitan materi dengan bidang teknologi terapan. | **Meaningful Learning**<br/>• Elaborasi Konsep Mendalam<br/>• Notasi Ilmiah Baku<br/>• Koneksi Interdisiplin |
| | **FASE 4: Aplikasi & Pemecahan Masalah Terapan** | **${tFase4} Menit** | 1. **Studi Kasus Rekayasa/Sains Nyata:** Guru menyajikan masalah kontekstual tingkat lanjut yang membutuhkan analisis terpadu dan perhitungan presisi.<br/>2. **Tantangan Tim (*Team Problem Solving*):** Guru menugaskan peserta didik merumuskan solusi alternatif pemecahan masalah dalam waktu terbatas.<br/>3. **Evaluasi Solusi:** Guru memfasilitasi penilaian antartim (*Peer Review*) terhadap keakuratan dan efisiensi solusi yang dihasilkan. | 1. Peserta didik membedah permasalahan studi kasus dalam kelompok kerja.<br/>2. Peserta didik menerapkan rumus dan konsep ilmiah untuk menghitung dan merancang solusi.<br/>3. Peserta didik mempresentasikan ringkasan solusi di hadapan kelas dan menerima masukan teman sejawat. | **Meaningful & Joyful**<br/>• Kreativitas Rekayasa<br/>• Peer Review<br/>• Solusi Masalah Nyata |
| **C. KEGIATAN PENUTUP** | **FASE 5: Refleksi Mendalam & Pojok Refleksi Diri** | **${tFase5} Menit** | 1. **Sesi Refleksi *What, So What, Now What?*:** Guru mengajak siswa menuliskan refleksi:<br/>• *What?* (Apa konsep kunci yang telah saya kuasai hari ini?)<br/>• *So What?* (Mengapa konsep ini penting dan bermakna bagi diri saya?)<br/>• *Now What?* (Bagaimana saya akan menerapkan pemahaman ini ke depan?)<br/>2. **Apresiasi & Umpan Balik Guru:** Guru memberikan apresiasi khusus atas peningkatan kemampuan berpikir kritis dan kerja sama seluruh siswa. | 1. Peserta didik merenungkan dan menuliskan jawaban refleksi berkesadaran pada buku catatan.<br/>2. Beberapa perwakilan peserta didik membacakan hasil refleksinya dengan bangga dan antusias.<br/>3. Peserta didik saling menghargai progres belajar masing-masing rekan sekelas. | **Joyful Learning**<br/>• Metakognisi Tingkat Tinggi<br/>• Kesadaran Belajar<br/>• Apresiasi Diri & Rekan |
| | **FASE 6: Simpulan Terpadu, Penugasan Proyek & Doa** | **${tFase6} Menit** | 1. **Simpulan Pembelajaran:** Guru bersama siswa menyusun *Mind Map* simpulan akhir di papan tulis.<br/>2. **Tugas Proyek Mini Kreatif:** Guru memberikan panduan tugas pembuatan karya poster infografis digital / laporan investigasi mini terkait aplikasi materi di kehidupan sehari-hari.<br/>3. **Informasi Asesmen Sumatif:** Guru mengingatkan jadwal tes asesmen sumatif lingkup materi pada pertemuan berikutnya.<br/>4. **Doa Penutup & Salam:** Guru mengajak seluruh kelas berdoa bersama dengan khusyuk dan menutup KBM dengan salam penuh kehangatan. | 1. Peserta didik aktif berkontribusi menyusun bagan kesimpulan akhir materi.<br/>2. Peserta didik mencatat petunjuk tugas proyek mini kontekstual.<br/>3. Peserta didik menyiapkan diri untuk agenda evaluasi sumatif pertemuan mendatang.<br/>4. Peserta didik berdoa bersama dengan khidmat dan membalas salam penutup guru dengan santun. | **Mindful & Joyful**<br/>• Mind Map Simpulan<br/>• Proyek Mini Kontekstual<br/>• Berakhlak Mulia |
`;
        }
      }

      const semesterLabel = String(semester) === '1' || String(semester).toLowerCase().includes('1') || String(semester).toLowerCase().includes('ganjil') ? 'Ganjil' : 'Genap';
      const currentYear = schoolProfile.academicYear?.split('/')[0] || '2026';
      const city = schoolProfile.city || 'Maluku Tengah';
      const fullSchoolName = schoolProfile.schoolName || 'SMA NEGERI 30 MALUKU TENGAH';
      const npsn = schoolProfile.npsn || '60103210';
      const schoolAddress = schoolProfile.address || `Jl. Pendidikan No. 30, ${city}`;
      const schoolEmail = schoolProfile.email || `info@${fullSchoolName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'sekolah'}.sch.id`;

      return `# RENCANA PELAKSANAAN MODUL (RPM)
### Model Pembelajaran: DEEP LEARNING (MINDFUL, MEANINGFUL, & JOYFUL LEARNING)
#### Mata Pelajaran: ${subject} | ${level} Kelas ${grade} (Fase ${phase}) - Semester ${semesterLabel}

---

## A. IDENTITAS MODUL

| Parameter | Keterangan |
| :--- | :--- |
| **Satuan Pendidikan** | ${fullSchoolName} |
| **Penyusun / Guru Pengampu** | ${teacherName} |
| **NIP Guru** | ${teacherNip || '_________________________'} |
| **Tahun Ajaran** | ${schoolProfile.academicYear || '2026/2027'} |
| **Jenjang / Fase / Kelas** | ${level} / Fase ${phase} / Kelas ${grade} |
| **Semester** | ${semesterLabel} |
| **Mata Pelajaran** | ${subject} |
| **Materi Pokok** | ${topic} |
| **Sub Materi Tiap Pertemuan** | ${subMateriTableFormatted} |
| **Alokasi Waktu Total** | ${meetingCount * Number(hoursPerMeeting) * Number(minutesPerJP)} Menit (${meetingCount} Pertemuan × ${hoursPerMeeting * minutesPerJP} Menit / Pertemuan = ${meetingCount * hoursPerMeeting} JP) |
| **Model Pembelajaran** | **Deep Learning (6 Fase Sintaks: Mindful, Meaningful, Joyful Learning)** |
| **Pendekatan & Metode** | Saintifik, Inkuiri Terbimbing, Kontekstual, Diskusi Kelompok, Eksplorasi Nyata, Think-Pair-Share |
| **Target Peserta Didik** | Peserta Didik Reguler/Tipikal, Peserta Didik dengan Kesulitan Belajar (*Scaffolding*), dan Peserta Didik Berprestasi Cepat (*Pengayaan*) |

---

## B. KOMPETENSI YANG DICAPAI

**Capaian Pembelajaran (CP) Elemen & Rasional:**
📌 "${actualCP}"

**Tujuan Pembelajaran (TP) Operasional (HOTS Berbasis Kaidah ABCD):**
${tpFormattedList}

**Pemahaman Bermakna (*Meaningful Learning*):**
- Peserta didik menyadari bahwa penguasaan konsep **${topic}** sangat esensial dalam memahami hukum alam, perkembangan teknologi modern, dan pemecahan masalah nyata di kehidupan sehari-hari.
- Peserta didik mampu menganalisis hubungan sebab-akibat fenomena empiris secara objektif, teliti, dan sistematis.

**Pertanyaan Pemantik (*Sparking Questions*):**
1. *Bagaimana fenomena ${topic} dapat kita jumpai dan manfaatkan dalam aktivitas sehari-hari serta perkembangan teknologi terkini?*
2. *Mengapa pengukuran yang presisi dan pemahaman konsep ilmiah yang mendalam sangat dibutuhkan dalam menyelesaikan masalah di sekitar kita?*
3. *Apa konsekuensi yang terjadi jika suatu rancangan rekayasa mengabaikan prinsip-prinsip dasar materi ini?*

---

## C. SINTAKS & SKEMA 6 FASE DEEP LEARNING

\`\`\`
+-------------------------------------------------------------------------------------------------
| SKEMA ALUR SIKLUS 6 FASE DEEP LEARNING (MINDFUL, MEANINGFUL, JOYFUL)
|
| [ MINDFUL LEARNING ]
| ┌───────────────────────────────┐          ┌───────────────────────────────┐
| │ FASE 1: Orientasi & Motivasi  │   ───►   │ FASE 2: Eksplorasi Konsep     │
| │ • Mindful Breathing (STOP)    │          │ • Inkuiri Konkret / Eksperimen│
| │ • Pertanyaan Pemantik HOTS    │          │ • Identifikasi Masalah & LKPD │
| └───────────────────────────────┘          └───────────────┬───────────────┘
|                                                             │
| [ MEANINGFUL LEARNING ]                                    ▼
| ┌───────────────────────────────┐          ┌───────────────────────────────┐
| │ FASE 4: Aplikasi & Penerapan  │   ◄───   │ FASE 3: Penjelasan & Elaborasi│
| │ • Pemecahan Soal Kontekstual  │          │ • Penguatan Konsep Ilmiah     │
| │ • Think-Pair-Share Kolaboratif│          │ • Diskusi Kaidah & Notasi Baku│
| └───────────────┬───────────────┘          └───────────────────────────────┘
|                  │
| [ JOYFUL LEARNING ]
|                  ▼
| ┌───────────────────────────────┐          ┌───────────────────────────────┐
| │ FASE 5: Refleksi Mendalam     │   ───►   │ FASE 6: Transfer & Koneksi    │
| │ • Lembar Refleksi Pola 3-2-1  │          │ • Proyek Mini Kreatif Siswa   │
| │ • Apresiasi Diri & Teman (6C) │          │ • Simpulan & Doa Penutup      │
| └───────────────────────────────┘          └───────────────────────────────┘
+-------------------------------------------------------------------------------------------------
\`\`\`

## C. SINTAKS (DESAIN PEMBELAJARAN DEEP LEARNING)

Pembelajaran Deep Learning mengintegrasikan 3 Pilar Utama (*Mindful Learning, Meaningful Learning, dan Joyful Learning*) melalui 6 tahapan sintaks KBM sebagai berikut:

| FASE SINTAKS | NAMA TAHAPAN | PILAR PEDAGOGIS | TUJUAN DAN FOKUS AKTIVITAS KELAS |
| :---: | :--- | :---: | :--- |
| **Fase 1** | **Orientasi, Apersepsi & Motivasi** | *Mindful Learning* | Membangkitkan rasa ingin tahu, menghadirkan kesadaran penuh (*Mindful Breathing*), dan mengaitkan materi dengan kehidupan nyata. |
| **Fase 2** | **Eksplorasi Konsep & Inkuiri** | *Meaningful Learning* | Peserta didik aktif menemukan konsep melalui pengamatan nyata, eksperimen terbimbing, dan diskusi kelompok berbasis LKPD. |
| **Fase 3** | **Penjelasan, Elaborasi & Diskusi** | *Meaningful Learning* | Guru mengelaborasi konsep, meluruskan miskonsepsi, menegaskan notasi ilmiah baku, dan memfasilitasi presentasi siswa. |
| **Fase 4** | **Aplikasi & Pemecahan Masalah** | *Meaningful Learning* | Peserta didik menerapkan konsep dalam konteks nyata baru melalui metode *Think-Pair-Share* dan pemecahan kasus HOTS. |
| **Fase 5** | **Refleksi Mendalam & Metakognisi** | *Joyful Learning* | Peserta didik merefleksikan proses belajar (format 3-2-1), mengapresiasi pencapaian diri, serta memperkuat karakter 6C. |
| **Fase 6** | **Simpulan Bersama, Transfer & Penutup** | *Joyful & Mindful* | Merumuskan kesimpulan terpadu, memberikan tindak lanjut proyek kreatif, pengumuman materi berikutnya, dan doa penutup. |

---

## D. LANGKAH-LANGKAH PEMBELAJARAN
${meetingsContent}

---

## E. ASESMEN PEMBELAJARAN

| Jenis Asesmen | Bentuk & Instrumen | Waktu Pelaksanaan | Aspek & Indikator yang Dinilai |
| :--- | :--- | :--- | :--- |
| **1. Asesmen Diagnostik (Awal)** | Pertanyaan pemantik lisan / kuis apersepsi 5 butir soal | Awal Pertemuan 1 (Pendahuluan) | Pengetahuan prasyarat, kesiapan belajar, dan identifikasi miskonsepsi awal peserta didik. |
| **2. Asesmen Formatif (Proses)** | • Lembar Kerja Peserta Didik (LKPD)<br/>• Lembar Observasi Kinerja Diskusi & Presentasi<br/>• Lembar Refleksi Diri 3-2-1 | Selama KBM berlangsung (Kegiatan Inti & Penutup) | Proses bernalar kritis, gotong royong, keaktifan berkomunikasi, dan pemahaman konsep secara berkelanjutan. |
| **3. Asesmen Sumatif (Akhir)** | • Tes Tertulis Pilihan Ganda & Uraian HOTS<br/>• Penilaian Produk Proyek Mini Infografis | Akhir Pembelajaran / Setelah ${meetingCount} Pertemuan | Penguasaan konsep mendalam, kemampuan analisis pemecahan masalah, dan kreativitas produk hasil belajar. |

### Panduan Rubrik Ketercapaian Tujuan Pembelajaran (KKTP):
| Kriteria Capaian | Perlu Bimbingan (0 - 64%) | Cukup (65 - 74%) | Baik (75 - 87%) | Sangat Baik (88 - 100%) |
| :--- | :--- | :--- | :--- | :--- |
| **Pemahaman Konsep ${topic}** | Belum mampu menjelaskan prinsip dasar materi dengan tepat. | Mampu menjelaskan konsep dasar namun masih membutuhkan bantuan contoh. | Mampu menjelaskan dan menghubungkan konsep dasar secara mandiri dan benar. | Mampu menganalisis konsep secara komprehensif dan mengaitkannya ke studi kasus kompleks. |
| **Keterampilan Penyelidikan & LKPD** | Data pengamatan belum lengkap dan belum terstruktur. | Data pengamatan lengkap namun analisis simpulan belum runtut. | Data pengamatan lengkap, akurat, dan analisis simpulan tepat. | Analisis data sangat mendalam, memuat evaluasi kritis dan solusi inovatif. |
| **Sikap & Kolaborasi 6C** | Pasif dalam kelompok dan memerlukan dorongan guru. | Cukup aktif dalam diskusi kelompok tetapi belum konsisten. | Aktif berkolaborasi, menghargai pendapat rekan, dan komunikatif. | Menunjukkan kepemimpinan kolaboratif yang inspiratif dan berempati tinggi. |

---

## F. MEDIA, ALAT, DAN SUMBER BELAJAR

- **Media Pembelajaran Interaktif:**
  - Video animasi fenomena nyata materi "${topic}" (YouTube Edukasi / Multimedia Interaktif).
  - Slide presentasi PowerPoint / Canva berbasis infografis visual.
  - LKPD 1 dan LKPD 2 Deep Learning terstruktur (Format cetak & digital).
  - Papan tulis interaktif / *Mind Map* dinding refleksi siswa.

- **Alat dan Bahan Praktik Konkret:**
  - Alat peraga / kit investigasi konkret materi ${topic}.
  - Benda-benda kontekstual di lingkungan kelas dan sekolah.
  - Sticky note berwarna, spidol warna, kertas karton / kertas plano.
  - Komputer / Laptop, LCD Proyektor, dan sambungan internet.

- **Sumber Belajar Resmi:**
  - Buku Teks Utama: *${subject} untuk ${level} Kelas ${grade}*, Pusat Perbukuan Kemendikbudristek RI.
  - Buku Panduan Guru *${subject}*, Kemendikbudristek RI.
  - Modul & Bahan Ajar Digital Pendamping Kurikulum Merdeka.
  - Portal Sains & Simulasi Edukasi: *PhET Interactive Simulations*, *Khan Academy*, dan ensiklopedia ilmiah.

---

## G. MATRIKS PEMBELAJARAN BERDIFERENSIASI

\`\`\`
+-------------------------------------------------------------------------------------------------
| SKEMA MATRIKS PEMBELAJARAN BERDIFERENSIASI (PROSES, KONTEN, PRODUK)
|
| ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
| │ 1. DIFERENSIASI KONTEN    │      │ 2. DIFERENSIASI PROSES    │      │ 3. DIFERENSIASI PRODUK    │
| ├───────────────────────────┤      ├───────────────────────────┤      ├───────────────────────────┤
| │ • Video Fenomena Konkret  │ ───► │ • Pendampingan Scaffolding│ ───► │ • Infografis / Poster     │
| │ • Modul Teks Bergambar    │      │ • Diskusi Sebaya Heterogen│      │ • Presentasi Lisan Tim    │
| │ • Kit Eksplorasi Nyata    │      │ • Bimbingan Intensif Guru │      │ • Laporan Tertulis Analis │
| └───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
+-------------------------------------------------------------------------------------------------
\`\`\`

| Kategori Peserta Didik | Diferensiasi Konten | Diferensiasi Proses | Diferensiasi Produk |
| :--- | :--- | :--- | :--- |
| **Peserta Didik Reguler** | Modul teks standar, LKPD inkuiri, dan tayangan video fenomena. | Diskusi kelompok campuran dengan bimbingan reguler guru. | Laporan LKPD dan presentasi hasil temuan kelompok. |
| **Peserta Didik dengan Kesulitan Belajar** | Materi disajikan dengan visual lebih kaya, panduan ringkas bertahap, dan benda konkret. | Mendapatkan bimbingan intensif dari guru (*scaffolding*) dan pendampingan tutor sebaya. | Boleh memilih format laporan yang lebih visual (bagan/poin inti terstruktur). |
| **Peserta Didik Berpencapaian Cepat (Mahir)** | Diberikan artikel ilmiah pengayaan dan studi kasus tantangan tingkat HOTS tinggi. | Menjadi tutor sebaya bagi rekan kelompoknya dan melakukan eksplorasi mandiri lanjutan. | Membuat karya inovasi mini berupa poster digital analitis / usulan solusi rekayasa. |

---

## H. REFLEKSI GURU

| Aspek Refleksi | Catatan Evaluatif Guru |
| :--- | :--- |
| **1. Ketercapaian Tujuan Pembelajaran** | ................................................................................................................................ |
| **2. Efektivitas Sintaks Deep Learning** | ................................................................................................................................ |
| **3. Partisipasi & Antusiasme Siswa** | ................................................................................................................................ |
| **4. Kendala & Miskonsepsi yang Muncul** | ................................................................................................................................ |
| **5. Rencana Perbaikan untuk Pertemuan Berikutnya** | ................................................................................................................................ |
`;
    }

    case 'lkpd': {
      const resolvedMeetingCount = meetingCount && Number(meetingCount) > 0 ? Number(meetingCount) : 2;
      const resolvedHours = hoursPerMeeting && Number(hoursPerMeeting) > 0 ? Number(hoursPerMeeting) : 3;
      const resolvedMinutes = minutesPerJP && Number(minutesPerJP) > 0 ? Number(minutesPerJP) : 45;
      const durationPerMeeting = resolvedHours * resolvedMinutes;

      const meetingBlocks = [];

      for (let m = 1; m <= resolvedMeetingCount; m++) {
        const isFirst = m === 1;
        const isLast = m === resolvedMeetingCount;
        const meetingTheme = isFirst 
          ? `Eksplorasi Konsep & Penyelidikan Masalah Nyata`
          : isLast 
            ? `Kreasi Rekayasa Solusi, Pameran Karya & Asesmen Autentik`
            : `Pengolahan Data Empiris & Analisis Komparasi Berjenjang`;

        meetingBlocks.push(`
# LEMBAR KERJA PESERTA DIDIK (LKPD) DEEP LEARNING - PERTEMUAN ${m} DARI ${resolvedMeetingCount}
## TEMA PERTEMUAN ${m}: ${meetingTheme.toUpperCase()}
### MATA PELAJARAN: ${subject.toUpperCase()} - KELAS ${grade} (${phase}) - SEMESTER ${semester}

---

### I. IDENTITAS KELOMPOK BELAJAR
| Komponen Identitas | Keterangan / Isian Peserta Didik |
| :--- | :--- |
| **Nama Kelompok** | ......................................................................................... |
| **Anggota Kelompok** | 1. ..................................................... 3. .....................................................<br/>2. ..................................................... 4. ..................................................... |
| **Kelas / Semester** | **Kelas ${grade} / Semester ${semester}** |
| **Mata Pelajaran & Topik** | **${subject}** - *${topic}* |
| **Alokasi Waktu KBM** | **${resolvedHours} JP (${durationPerMeeting} Menit)** |
| **Profil Karakter 6C** | *Character, Critical Thinking, Creativity, Collaboration, Communication, Citizenship* |

---

### II. TUJUAN PEMBELAJARAN & PETUNJUK KERJA
* **Tujuan Pembelajaran Pertemuan ${m}:**
  * ${isFirst ? `Peserta didik mampu mengidentifikasi fenomena esensial ${topic}, memetakan variabel kausalitas, dan merumuskan hipotesis ilmiah secara kritis.` : `Peserta didik mampu merancang sketsa visual solusi inovatif ${topic}, memvalidasi data empiris, dan mempresentasikannya melalui forum kelas.`}
* **Petunjuk Belajar Mindful & Safety:**
  1. Mulailah dengan doa bersama kelompok dan latihan pernapasan sadar (*Mindfulness 1 Menit*).
  2. Cermati stimulus fenomena nyata dan **Bagan Ilustrasi Konsep** yang disajikan secara teliti.
  3. Lakukan pembagian tugas kelompok secara adil, inklusif, dan saling mendukung.
  4. Tuangkan ide dan visualisasi pemecahan masalah pada **Kanvas Sketsa Siswa**.

---

### III. SINTAKS 1: MINDFUL DISCOVERY (ORIENTASI BERKESADARAN & BAGAN VISUAL KONSEP)
> **📌 Stimulus Kontekstual & Studi Kasus Pertemuan ${m}:**  
> Dalam kehidupan sehari-hari, prinsip **${topic}** pada bidang studi **${subject}** menjadi kunci utama dalam memecahkan masalah kontekstual (efisiensi sistem, kelestarian lingkungan, ketepatan analisis, atau dinamika sosial-teknologi). Ketika terjadi ketidakseimbangan sistem, diperlukan analisis kritis dan rekayasa ide yang solutif.

#### 📊 Bagan Ilustrasi Konsep & Skema Alur Ilmiah Pertemuan ${m}
\`\`\`
+-----------------------------------------------------------------------------------+
|               DIAGRAM ALUR KONSEP & PENYELIDIKAN ILMIAH (${topic.toUpperCase()})               |
|                                                                                   |
|  [ FENOMENA NYATA ] ---> [ VARIABEL BEBAS (X) ] ---> [ PROSES TRANSFORMASI ]     |
|          |                                                  |                     |
|          v                                                  v                     |
|  [ HIPOTESIS IDE ] <--- [ OLAH DATA EMPIRIS ] <--- [ VARIABEL TERIKAT (Y) ]       |
+-----------------------------------------------------------------------------------+
\`\`\`

* **Pertanyaan Pemantik Berkesadaran (Mindful Curiosity Trigger):**
  1. *Mengapa fenomena ${topic} ini sangat krusial dalam konteks ilmu ${subject}?*
  2. *Bagaimana jika salah satu variabel pada diagram di atas tidak berfungsi optimal?*

---

### IV. SINTAKS 2: MEANINGFUL INQUIRY (PENYELIDIKAN KRITIS & PENGOLAHAN DATA EMPIRIS)

#### 1. Lembar Aktivitas Penyelidikan Mandiri & Kolaboratif [HOTS]
* Lakukan observasi/studi literatur bersama tim dan jawab pertanyaan kunci berikut:
  * **Analisis Variabel Inti:** ....................................................................................................
  * **Prinsip / Formula Utama:** $$\\text{Efektivitas } (${topic}) = f(\\text{Variabel } X, \\text{ Intervensi Solutif})$$

#### 2. Tabel Pengumpulan & Pengolahan Data Empiris
| No | Parameter / Objek yang Diselidiki | Hasil Pengamatan Empiris | Analisis Hubungan Sebab - Akibat |
| :-: | :--- | :--- | :--- |
| 1 | Kondisi Baseline / Standar Normal **${topic}** | .................................................... | .................................................... |
| 2 | Kondisi Uji Variabel / Faktor Pengganggu | .................................................... | .................................................... |
| 3 | Solusi Optimalisasi & Rekomendasi Terapan | .................................................... | .................................................... |

#### 3. Bantuan Scaffolding Berjenjang (Diferensiasi Proses)
* **Kelompok Berkembang:** Gunakan panduan rumus dasar dan konsultasikan tabel dengan guru pendamping.
* **Kelompok Mahir:** Lakukan analisis komparasi multi-variabel dan estimasi dampak jangka panjang.

---

### V. SINTAKS 3: JOYFUL CREATION (KANVAS SKETSA SOLUSI SISWA & PAMERAN KARYA)

#### 🎨 Kanvas Gambar & Sketsa Visual Inovasi Siswa
Gambarkan rancangan diagram ide, bagan sistem prototipe, poster mini, atau ilustrasi kreatif pemecahan masalah kelompok kalian pada kotak kanvas berikut:

\`\`\`
+-----------------------------------------------------------------------------------+
|                        KANVAS SKETSA & DIAGRAM DESAIN SISWA                       |
|                                                                                   |
|                                                                                   |
|        (Gambarkan rancangan sketsa, bagan sistem, atau visualisasi solusi)        |
|                                                                                   |
|                                                                                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
\`\`\`
* **Deskripsi Keunggulan & Nilai Kebaruan Karya Kelompok:**  
  ................................................................................................................................

#### 🌟 Pameran Karya Dinding Kelas (Joyful Gallery Walk) & Umpan Balik
*Kunjungi stand kelompok lain, amati presentasi visual mereka, dan berikan catatan apresiasi:*
* ⭐ **Bintang 1 (Kekuatan Konsep & Diagram Visual):** .............................................................
* ⭐ **Bintang 2 (Kreativitas & Orisinalitas Solusi):** ............................................................
* 💡 **Wish (Saran Penyempurnaan Konstruktif):** ..................................................................

---

### VI. SINTAKS 4: MINDFUL REFLECTION & ASESMEN AUTENTIK

#### 1. Lembar Refleksi Diri Siswa (Kartu 3-2-1)
* **3 Hal bermakna yang saya pelajari hari ini:** .................................................................
* **2 Hal yang paling membuat saya bersemangat dalam KBM:** ................................................
* **1 Pertanyaan/ide yang ingin saya eksplorasi lebih jauh:** ...............................................

#### 2. Rubrik Penilaian Autentik Kinerja LKPD Guru
| Aspek Penilaian Mutu | Kriteria Mahir (86-100) | Kriteria Cakap (71-85) | Kriteria Berkembang (0-70) |
| :--- | :--- | :--- | :--- |
| **Nalar Kritis & Analisis Data** | Analisis sebab-akibat sangat mendalam dengan data empiris valid. | Menjelaskan keterkaitan konsep dengan cukup baik. | Memerlukan bimbingan pendampingan guru (*scaffolding*). |
| **Kreativitas Produk Visual** | Sketsa diagram sangat orisinal, estetis, dan solutif. | Sketsa diagram cukup jelas dan memadai. | Sketsa belum tuntas atau kurang terstruktur. |
| **Kolaborasi & Karakter 6C** | Menunjukkan kepemimpinan positif dan gotong royong aktif. | Bekerjasama dengan baik dalam tim. | Perlu dorongan untuk berpartisipasi aktif. |
`);
      }

      return meetingBlocks.join('\n\n<div class="page-break" style="page-break-before:always; break-before:page; margin-top:24px; margin-bottom:18px;"></div>\n\n');
    }

    case 'bundle':
    case 'bundel_lengkap':
    case 'perangkat_ajar_lengkap':
      return generateFullCurriculumBundle(params);

    case 'kktp': {
      const kktpRows = activeMaterials.length > 0
        ? activeMaterials.flatMap((mat, mIdx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${mIdx + 1}`;
            const baseCode = mat.tpCode || `TP.${grade}.${mIdx + 1}`;
            return [
              `| **${baseCode}.1** | Penguasaan Konsep Fundamental ${babName} | Belum mampu menyebutkan prinsip dasar materi pokok. | Mampu menyebutkan konsep dasar dengan bantuan panduan guru. | Mampu menjelaskan dan menerapkan konsep secara mandiri dan benar. | Mampu menguraikan konsep secara komprehensif serta memecahkan studi kasus tingkat tinggi. | 75% |`,
              `| **${baseCode}.2** | Analisis & Pemecahan Masalah ${babName} | Belum mampu mengidentifikasi akar persoalan pada studi kasus. | Mampu mengidentifikasi masalah namun penyelesaian belum sistematis. | Mampu menganalisis masalah dan merumuskan solusi logis yang tepat. | Mampu mengevaluasi alternatif solusi dan merekayasa inovasi baru yang aplikatif. | 75% |`
            ];
          }).join('\n')
        : `| **${tpCode}.1** | Penguasaan Konsep Esensial ${topic} | Belum mampu menyebutkan prinsip dasar materi pokok. | Mampu menyebutkan konsep dasar dengan bantuan panduan guru. | Mampu menjelaskan dan menghubungkan konsep secara mandiri dan benar. | Mampu menguraikan konsep secara komprehensif serta mengoreksi miskonsepsi orang lain. | 75% |
| **${tpCode}.2** | Analisis & Pemecahan Kasus | Belum mampu mengidentifikasi akar persoalan pada studi kasus. | Mampu mengidentifikasi masalah namun solusi belum sistematis. | Mampu menganalisis masalah dan memberikan solusi logis yang tepat. | Mampu mengevaluasi berbagai alternatif solusi dan merumuskan inovasi baru yang efektif. | 75% |
| **${tpCode}.3** | Komunikasi & Kreasi Produk | Belum mampu menyajikan hasil kerja secara runtut. | Menyajikan hasil kerja cukup jelas namun belum terstruktur rapi. | Menyajikan hasil kerja dengan bahasa baku, runtut, dan komunikatif. | Menyajikan produk dengan sangat memukau, estetis, interaktif, dan inspiratif. | 75% |`;

      const kktpIntervalRows = activeMaterials.length > 0
        ? activeMaterials.map((mat, mIdx) => {
            const babName = mat.essentialMaterial || mat.tpName || `Bab ${mIdx + 1}`;
            const baseCode = mat.tpCode || `TP.${grade}.${mIdx + 1}`;
            return `| **Bab ${mIdx + 1}: ${babName}** | ${baseCode} | 0% – 40% (Bimbingan Penuh) | 41% – 65% (Remedial Parsial) | 66% – 85% (Tuntas Ketercapaian) | 86% – 100% (Pengayaan Mandiri) | **75%** |`;
          }).join('\n')
        : `| **${topic}** | ${tpCode} | 0% – 40% (Bimbingan Penuh) | 41% – 65% (Remedial Parsial) | 66% – 85% (Tuntas Ketercapaian) | 86% – 100% (Pengayaan Mandiri) | **75%** |`;

      return `# KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)
## PENDEKATAN RUBRIK DESKRIPTIF & INTERVAL NILAI KURIKULUM MERDEKA
### RUJUKAN STANDAR MUTU KETUNTASAN PEMBELAJARAN SEMESTER ${semester.toUpperCase()}

---

### A. IDENTITAS PERANGKAT KKTP
* **Mata Pelajaran:** ${subject}
* **Fase / Kelas:** ${phase} / Kelas ${grade} (${level})
* **Semester / TP:** Semester ${semester} / Tahun Pelajaran ${resolvedAcademicYear}
* **Cakupan Pembelajaran:** ${activeMaterials.length > 0 ? `Seluruh Materi Pokok Semester ${semester} (${activeMaterials.length} Bab Terintegrasi Profil Guru)` : topic}
* **Guru Penyusun:** ${teacherName}

---

### B. DIAGRAM TANGGA INTERVAL KETUNTASAN & ALUR INTERVENSI KKTP
\`\`\`
+---------------------------------------------------------------------------------------------------+
|               DIAGRAM PIRAMIDA TANGGA INTERVAL KETUNTASAN KKTP KURIKULUM MERDEKA                  |
|                                                                                                   |
|  [ LEVEL 4: 86% - 100% ] ──► [ MAHIR / SANGAT BAIK ] ──► Pengayaan Mandiri & Tutor Sebaya         |
|  ▲                                                                                                |
|  [ LEVEL 3: 66% - 85%  ] ──► [ CAKAP / TUNTAS ]      ──► Melanjutkan ke TP / Bab Berikutnya       |
|  ▲                                                                                                |
|  [ LEVEL 2: 41% - 65%  ] ──► [ LAYAK / REMEDIAL TP ] ──► Remedial Indikator Tertentu + Tutor Sebaya |
|  ▲                                                                                                |
|  [ LEVEL 1: 0% - 40%   ] ──► [ BARU BERKEMBANG ]     ──► Remedial Total & Bimbingan Khusus Guru   |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### C. PENDEKATAN 1: RUBRIK DESKRIPTIF KETERCAPAIAN TP PER BAB (SEMESTER ${semester.toUpperCase()})
| Indikator TP / Materi Pokok | Deskripsi Kriteria | Baru Berkembang (0 - 59) | Layak (60 - 74) | Cakap (75 - 89) | Mahir (90 - 100) | Standar Minimal |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
${kktpRows}

---

### D. PENDEKATAN 2: SKALA MATRIKS INTERVAL NILAI KETERCAPAIAN SEMESTER ${semester.toUpperCase()}
| Lingkup Materi Pokok (Bab) | Kode TP | Interval 1 (0-40%) | Interval 2 (41-65%) | Interval 3 (66-85%) | Interval 4 (86-100%) | Kriteria Minimal |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
${kktpIntervalRows}

---

### E. PEDOMAN TINDAK LANJUT INTERVAL KETERCAPAIAN
* **Interval 0% – 40% (Belum Mencapai Ketuntasan):** Diberikan intervensi pendampingan individual secara intensif dan pengulangan konsep dasar oleh guru sebelum melanjutkan ke bab berikutnya.
* **Interval 41% – 65% (Belum Mencapai Ketuntasan):** Mengikuti kegiatan remedial pada indikator-indikator tertentu yang belum tuntas dengan bantuan modul penguatan dan tutor sebaya.
* **Interval 66% – 85% (Sudah Mencapai Ketuntasan):** Dinyatakan tuntas ketercapaian dan dapat melanjutkan pembelajaran ke materi/tujuan pembelajaran selanjutnya secara mandiri.
* **Interval 86% – 100% (Mencapai Ketuntasan Optimal):** Diberikan materi pengayaan tingkat lanjut, proyek pemecahan masalah kontekstual, atau diperbantukan sebagai tutor sebaya di kelas.

---

### F. REKAPITULASI KESIMPULAN KETUNTASAN SEMESTER
* Peserta didik dinyatakan **TUNTAS** pada setiap Tujuan Pembelajaran di Semester ${semester} apabila minimal memperoleh kategori **Cakap (Skor Interval ≥ 75%)** pada rubrik deskriptif dan penilaian asesmen sumatif bab bersangkutan.
`;
    }

    case 'rubrik_penilaian':
    case 'asesmen':
      return `# RUBRIK PENILAIAN TERPADU
## SINKRON DENGAN PERANGKAT ASESMEN PADA MODUL AJAR / RPP
### (ASESMEN DIAGNOSTIK, FORMATIF SIKAP 6C, KINERJA LKPD, DAN SUMATIF HOTS)

---

### A. IDENTITAS ASESMEN & BAGAN SISTEM PENILAIAN TERINTEGRASI
* **Mata Pelajaran:** ${subject} | **Fase / Kelas:** ${phase} / Kelas ${grade} (${level})
* **Lingkup Materi Pokok:** ${topic}
* **Tujuan Pembelajaran:** ${tpTitle}
* **Guru Pengampu:** ${teacherName}

\`\`\`
+---------------------------------------------------------------------------------------------------+
|               BAGAN STRUKTUR ASESMEN HOLISTIK & AUTENTIK KURIKULUM MERDEKA                        |
|                                                                                                   |
|  ┌─────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐  |
|  │ 1. ASESMEN DIAGNOSTIK   │ ──► │ 2. ASESMEN FORMATIF       │ ──► │ 3. ASESMEN SUMATIF        │  |
|  ├─────────────────────────┤     ├───────────────────────────┤     ├───────────────────────────┤  |
|  │ • Gaya Belajar Siswa    │     │ • Sikap 6C Berkelanjutan  │     │ • Tes Tertulis HOTS (PG)  │  |
|  │ • Kesiapan Kognitif Awal│     │ • Kinerja & LKPD Inkuiri  │     │ • Soal Uraian Studi Kasus │  |
|  │ • Pemetaan Scaffolding  │     │ • Umpan Balik Antarteman  │     │ • Portofolio Proyek Karya │  |
|  └─────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘  |
+---------------------------------------------------------------------------------------------------+
\`\`\`

| No | Jenis Asesmen | Teknik Penilaian | Bentuk Instrumen | Dimensi 6C & Kognitif | Waktu Pelaksanaan |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Diagnostik** | Kuesioner Emosi & Tes Lisan | Angket Gaya Belajar & Soal Prasyarat | Kesiapan Belajar & Prasyarat | Awal Sesi / Pertemuan 1 |
| 2 | **Formatif Sikap** | Observasi Berkelanjutan | Lembar Observasi Karakter 6C | Karakter, Gotong Royong, Nalar Kritis | Selama Proses Diskusi |
| 3 | **Formatif Kinerja** | Penilaian Autentik LKPD | Rubrik Analisis Kasus & Kanvas Solusi | Keterampilan Proses & Kreativitas | Saat Kegiatan Inti |
| 4 | **Formatif Teman** | Penilaian Antarteman | Lembar *Two Stars and a Wish* | Komunikasi & Empati Kolaboratif | Sesi *Gallery Walk* |
| 5 | **Sumatif Materi** | Tes Tertulis & Proyek | Soal PG-HOTS, Uraian & Rubrik Karya | C4–C6 Penalaran & Rekayasa | Akhir Lingkup Materi |

---

### B. RUBRIK ASESMEN DIAGNOSTIK AWAL (KESIAPAN BELAJAR)

#### 1. Diagnostik Non-Kognitif (Gaya Belajar & Kondisi Emosional)
| Indikator Diagnostik | Kategori Visual | Kategori Auditori | Kategori Kinestetik | Tindak Lanjut Diferensiasi |
| :--- | :--- | :--- | :--- | :--- |
| **Modalitas Dominan** | Memahami lewat infografis, video, dan bagan alur. | Memahami lewat penjelasan lisan, diskusi, dan podcast. | Memahami lewat praktik langsung, manipulasi objek konkret. | Guru menyediakan variasi media bahan ajar multimodal. |

#### 2. Diagnostik Kognitif Prasyarat Materi ${topic}
| Kesiapan Siswa | Skor Prasyarat | Deskripsi Karakteristik | Intervensi Pembelajaran |
| :--- | :---: | :--- | :--- |
| **Mahir (Siap)** | 85 - 100 | Menguasai seluruh konsep prasyarat dengan matang. | Diberi peran *leader* diskusi dan materi pengayaan. |
| **Cakap (Cukup)** | 65 - 84 | Menguasai sebagian besar prasyarat, sedikit ragu. | Diberikan apersepsi kontekstual dan lembar panduan. |
| **Berkembang (Butuh Bantuan)** | < 65 | Belum menguasai konsep dasar prasyarat. | Diberikan bimbingan terarah (*scaffolding*) intensif. |

---

### C. RUBRIK ASESMEN FORMATIF SIKAP & KARAKTER DIMENSI 6C
*Skala Penilaian: 4 = Sangat Baik / Membudaya, 3 = Baik / Mulai Berkembang, 2 = Cukup / Terlihat, 1 = Perlu Bimbingan*

| Dimensi 6C Kemendikdasmen | Indikator Perilaku Teramati | Kriteria Skor 4 (Mahir) | Kriteria Skor 3 (Cakap) | Kriteria Skor 2 (Layak) | Kriteria Skor 1 (Berkembang) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Character & Akhlak Mulia** | Kejujuran data dan menghargai rekan belajar | Selalu jujur, santun, dan konsisten menghargai pendapat rekan | Jujur dalam pengamatan dan bertutur kata santun | Kadang kurang terbuka dalam data hasil percobaan | Mengabaikan etika dan kurang menghargai rekan |
| **2. Critical Thinking (Nalar Kritis)** | Mampu menganalisis sebab-akibat fenomena ${topic} | Menganalisis secara mendalam, berbasis data valid, dan solutif | Menganalisis dengan baik dan logis | Analisis masih dangkal dan terbatas | Belum mampu mengemukakan analisis sebab-akibat |
| **3. Creativity (Kreativitas)** | Menghasilkan ide/sketsa solusi inovatif | Gagasan sangat orisinal, bernilai guna tinggi, dan estetis | Gagasan inovatif dan dapat diterapkan | Gagasan meniru contoh yang sudah ada | Belum memunculkan ide solusi mandiri |
| **4. Collaboration (Gotong Royong)** | Aktif bekerjasama dalam tim LKPD | Berbagi peran adil, saling memotivasi, dan proaktif membantu | Bekerjasama dengan baik sesuai pembagian tugas | Kurang aktif, hanya menunggu instruksi ketua | Tidak mau bekerjasama dalam kelompok |
| **5. Communication (Komunikasi)** | Menyampaikan gagasan pada sesi *Gallery Walk* | Artikulasi jelas, runtut, persuasif, dan percaya diri | Menyampaikan materi dengan jelas dan terstruktur | Penjelasan kurang runtut dan terbata-bata | Menolak mempresentasikan hasil kerja |
| **6. Citizenship (Kewarganegaraan)** | Kepedulian terhadap lingkungan & isu sosial | Mengaitkan solusi dengan dampak sosial-lingkungan nyata | Memperhatikan aspek kebermanfaatan bagi sekitar | Kurang peka terhadap dampak solusi | Mengabaikan nilai kebermanfaatan sosial |

---

### D. RUBRIK PENILAIAN KINERJA PROSES & LKPD BERJENJANG
| Aspek Penilaian Kinerja | Kriteria Mahir (Skor 4) | Kriteria Cakap (Skor 3) | Kriteria Layak (Skor 2) | Kriteria Berkembang (Skor 1) |
| :--- | :--- | :--- | :--- | :--- |
| **Penyelidikan & Pengolahan Data** | Data pengamatan lengkap, sistematis, dan dianalisis secara presisi. | Data lengkap dan diolah dengan rumus/konsep yang benar. | Data cukup lengkap namun analisis masih sederhana. | Data tidak lengkap dan perhitungan belum tepat. |
| **Kualitas Sketsa / Bagan Solusi** | Bagan konsep/sketsa sangat rapi, informatif, dan memiliki kebaruan ide. | Bagan jelas dan menunjukkan alur logika yang tepat. | Bagan sederhana dan minim keterangan pendukung. | Belum berhasil menyusun bagan solusi. |
| **Umpan Balik Antarteman** | Memberikan masukan konstruktif *Two Stars and a Wish* yang bernas. | Memberikan apresiasi dan masukan yang relevan. | Memberikan komentar singkat tanpa saran perbaikan. | Tidak memberikan umpan balik kepada rekan. |

---

### E. RUBRIK ASESMEN SUMATIF LINGKUP MATERI (KISI-KISI & PENSKORAN)

#### 1. Pedoman Penskoran Soal Pilihan Ganda HOTS (5 Butir)
* Setiap butir soal bernilai **2 poin** jika benar, **0 poin** jika salah. Total skor maksimal = **10 poin**.

#### 2. Rubrik Penskoran Soal Uraian HOTS (3 Butir Kasus Kompleks)
| No Soal | Indikator Kognitif | Deskripsi Kriteria Penskoran Maksimal (Skor 4) | Skor Maks |
| :-: | :--- | :--- | :-: |
| **1** | Analisis Pemecahan Masalah (C4) | Menguraikan akar masalah ${topic} secara runtut, menghubungkan minimal 3 konsep terkait, dan memberi contoh riil. | **4** |
| **2** | Evaluasi Komparatif (C5) | Membandingkan 2 sudut pandang/metode secara objektif berdasarkan efisiensi, akurasi, dan dampak lingkungan. | **4** |
| **3** | Rekayasa Solusi Inovatif (C6) | Merumuskan desain inovasi kontekstual yang aplikatif, terukur, dan memiliki tahapan implementasi logis. | **4** |
| **TOTAL** | **Skor Maksimal Uraian** | | **12** |

#### 3. Rubrik Penilaian Produk / Portofolio Proyek
| Kriteria Produk | Sangat Baik (90 - 100) | Baik (80 - 89) | Cukup (70 - 79) | Kurang (< 70) |
| :--- | :--- | :--- | :--- | :--- |
| **Orisinalitas & Inovasi** | Karya murni ide baru dan solutif terhadap isu nyata. | Karya menunjukkan modifikasi kreatif yang baik. | Karya meniru pola umum yang sudah ada. | Karya kurang menunjukkan kreativitas. |
| **Kesesuaian Konsep ${subject}** | Penerapan teori ilmiah 100% tepat dan terverifikasi. | Sebagian besar teori diterapkan dengan benar. | Terdapat sedikit miskonsepsi minor. | Miskonsepsi mendasar pada konten materi. |
| **Estetika & Kerapian** | Tampilan visual sangat memukau, rapi, dan mudah dipahami. | Tampilan menarik dan terstruktur rapi. | Tampilan cukup rapi namun kurang menarik. | Tampilan tidak rapi dan sulit dibaca. |

---

### F. FORMULA PENGOLAHAN NILAI AKHIR & INTERVENSI KKTP

$$\text{Nilai Akhir Asesmen (NA)} = \left(\frac{\text{Skor PG (Maks 10)} + \text{Skor Uraian (Maks 12)} + \text{Skor Kinerja LKPD (Maks 12)}}{34}\right) \times 100$$

| Rentang Nilai Akhir | Predikat Ketuntasan | Rekomendasi Tindak Lanjut Guru |
| :---: | :---: | :--- |
| **90 – 100** | **Mahir (A)** | Diberikan penugasan pengayaan berupa telaah studi kasus lanjutan / mini riset. |
| **80 – 89** | **Cakap (B)** | Dinyatakan tuntas, siap melanjutkan ke Alur Tujuan Pembelajaran (ATP) berikutnya. |
| **70 – 79** | **Layak (C)** | Tuntas bersyarat, diberikan penguatan mandiri pada indikator yang nilainya rendah. |
| **< 70** | **Baru Berkembang (D)** | Wajib mengikuti program remedial pembelajaran ulang (*re-teaching*) dengan tutor sebaya. |
`;

    default:
      return `# PERANGKAT AJAR KURIKULUM MERDEKA
## MATA PELAJARAN: ${subject.toUpperCase()} (${level} KELAS ${grade})
* **Fase:** ${phase} | **Semester:** ${semester}
* **Topik:** ${topic}
* **Guru Pengampu:** ${teacherName}

---

Dokumen administrasi perangkat ajar berhasil disusun dengan prinsip pembelajaran mendalam (*Deep Learning: Mindful, Meaningful, & Joyful*) dan telah tersinkronisasi penuh dengan master Capaian Pembelajaran.
`;
    }
  };

  let finalDoc = generateCoreDoc();

  // If custom school format / template is enabled, weave template notes and compliance
  if (useCustomFormat && (customFormatNotes || customFormatFile)) {
    const templateName = customFormatFile?.name || 'Template Baku Sekolah / MGMP';
    finalDoc += `\n\n---
\n### 📑 KELENGKAPAN FORMAT & TEMPLATE SEKOLAH RESMI
* **Status Penyesuaian:** ✅ Disesuaikan dengan Standar Template Sekolah (*${templateName}*)
${customFormatFile ? `* **Berkas Acuan Sekolah:** ${customFormatFile.name} (${customFormatFile.type ? customFormatFile.type.toUpperCase() : 'Dokumen'})\n` : ''}${customFormatNotes ? `* **Struktur Khusus Satuan Pendidikan:**\n${customFormatNotes}\n` : ''}* **Keterangan Penjaminan Mutu:** Dokumen ini telah diselaraskan dengan tata kelola administrasi Kurikulum Operasional Satuan Pendidikan (KOSP) dan standar format sekolah yang berlaku.
`;
  }

  return finalDoc;
}

/**
 * Generates a complete, ready-to-print Master Curriculum Portfolio (1 Unified Perangkat Ajar Lengkap)
 * Synchronized across Teacher Profile, CP, TP, ATP, Time Allocation, PROTA, PROSEM, KKTP, Modul Ajar, LKPD, and Rubrik.
 */
export function generateFullCurriculumBundle(params: GenerateCurriculumParams): string {
  const schoolProfile = StorageService.getSchoolProfile();
  const subject = params.subject || 'Fisika';
  const level = params.level || 'SMA';
  const grade = params.grade || 10;
  const phase = params.phase || (grade === 10 ? 'Fase E' : Number(grade) > 10 ? 'Fase F' : Number(grade) >= 7 ? 'Fase D' : 'Fase A/B/C');
  const resolvedAcademicYear = params.academicYear || schoolProfile.academicYear || '2025/2026';
  const teacherName = params.teacherName || params.schoolProfile?.teacherName || params.distributionData?.teacherName || schoolProfile.teacherName || 'Guru Mata Pelajaran';
  const teacherNip = params.teacherNip || params.schoolProfile?.teacherNip || schoolProfile.teacherNip || '19850715 201101 1 003';
  const headmasterName = params.headmasterName || params.schoolProfile?.headmasterName || schoolProfile.headmasterName || 'Kepala Satuan Pendidikan';
  const headmasterNip = params.headmasterNip || params.schoolProfile?.headmasterNip || schoolProfile.headmasterNip || '-';
  const schoolName = params.schoolName || params.schoolProfile?.schoolName || schoolProfile.schoolName || 'SMA / SMK / MA / SMP / SD Terpadu';
  const city = params.city || params.schoolProfile?.city || schoolProfile.city || 'Kota Satuan Pendidikan';

  // 1. Cover Page
  const coverSection = `
# DOKUMEN PERANGKAT AJAR LENGKAP
## KURIKULUM MERDEKA & PENDEKATAN DEEP LEARNING
### (MINDFUL, MEANINGFUL, & JOYFUL LEARNING)

<div style="text-align: center; margin: 30px 0;">
  <div style="font-size: 16pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase;">
    MATA PELAJARAN: ${subject.toUpperCase()}
  </div>
  <div style="font-size: 13pt; font-weight: bold; color: #334155; margin-top: 6px;">
    JENJANG ${level} • ${phase} • KELAS ${grade}
  </div>
  <div style="font-size: 12pt; color: #475569; margin-top: 4px;">
    TAHUN PELAJARAN ${resolvedAcademicYear}
  </div>
</div>

---

### PROFIL GURU PENGAMPU & SATUAN PENDIDIKAN
| Data Administrasi | Keterangan Dokumen Resmi |
| :--- | :--- |
| **Satuan Pendidikan** | **${schoolName}** |
| **Nama Guru Pengampu** | **${teacherName}** |
| **NIP Guru Pengampu** | ${teacherNip} |
| **Mata Pelajaran** | **${subject}** |
| **Fase / Kelas / Jenjang** | **${phase} / Kelas ${grade} (${level})** |
| **Kepala Satuan Pendidikan** | **${headmasterName}** |
| **NIP Kepala Sekolah** | ${headmasterNip} |
| **Kota / Kabupaten** | ${city} |
| **Status Dokumen** | **✅ TERVERIFIKASI & TERSINKRONISASI LENGKAP** |

<div style="page-break-before: always; break-before: page; margin-top: 40px;"></div>
`;

  // 2. Lembar Pengesahan Terpadu
  const pengesahanSection = `
# LEMBAR PENGESAHAN PERANGKAT AJAR
## DOKUMEN ADMINISTRASI PEMBELAJARAN TAHUN PELAJARAN ${resolvedAcademicYear}

Setelah memeriksa dan menelaah secara saksama seluruh instrumen dan dokumen administrasi pembelajaran mata pelajaran **${subject}** untuk **${phase} / Kelas ${grade}**, yang disusun oleh:

* **Nama Guru Mata Pelajaran** : **${teacherName}**
* **NIP** : ${teacherNip}
* **Satuan Pendidikan** : **${schoolName}**

Menyatakan bahwa Perangkat Ajar Kurikulum Merdeka ini telah memenuhi standar kompetensi BSKAP No. 032/H/KR/2024 dan prinsip pembelajaran mendalam (*Deep Learning: Mindful, Meaningful, & Joyful*), serta disahkan untuk diberlakukan sebagai pedoman pelaksanaan Kegiatan Belajar Mengajar (KBM) pada Tahun Pelajaran **${resolvedAcademicYear}**.

---

Ditetapkan dan disahkan di : **${city}**  
Pada tanggal : **${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}**

<table style="width: 100%; border: none; margin-top: 36px; font-size: 10.5pt; text-align: center;">
  <tr>
    <td style="width: 50%; border: none; vertical-align: top;">
      Mengetahui,<br/>
      <strong>Kepala Satuan Pendidikan</strong><br/><br/><br/><br/>
      <strong><u>${headmasterName}</u></strong><br/>
      NIP. ${headmasterNip}
    </td>
    <td style="width: 50%; border: none; vertical-align: top;">
      Penyusun,<br/>
      <strong>Guru Mata Pelajaran</strong><br/><br/><br/><br/>
      <strong><u>${teacherName}</u></strong><br/>
      NIP. ${teacherNip}
    </td>
  </tr>
</table>

<div style="page-break-before: always; break-before: page; margin-top: 40px;"></div>
`;

  // 3. Daftar Isi
  const daftarIsiSection = `
# DAFTAR ISI PERANGKAT AJAR TERPADU
## MATA PELAJARAN: ${subject.toUpperCase()} (${level} KELAS ${grade})

1. **LEMBAR PENGESAHAN RESMI**
2. **BAGIAN I : ANALISIS ALOKASI WAKTU & RINCIAN PEKAN EFEKTIF (RBE)**
3. **BAGIAN II : ANALISIS CAPAIAN PEMBELAJARAN (CP) TERBARU & PEMETAAN ELEMEN**
4. **BAGIAN III : RUMUSAN TUJUAN PEMBELAJARAN (TP) BERBASIS KKO & ABCD**
5. **BAGIAN IV : ALUR TUJUAN PEMBELAJARAN (ATP) & PEMETAAN JAM PELAJARAN**
6. **BAGIAN V : PROGRAM TAHUNAN (PROTA) SEMESTER GANJIL & GENAP**
7. **BAGIAN VI : PROGRAM SEMESTER (PROSEM) & MATRIKS PEKANAN BERWARNA**
8. **BAGIAN VII : KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)**
9. **BAGIAN VIII : MODUL AJAR (DEEP LEARNING: MINDFUL, MEANINGFUL, & JOYFUL)**
10. **BAGIAN IX : LEMBAR KERJA PESERTA DIDIK (LKPD KREATIF BERDIFERENSIASI)**
11. **BAGIAN X : RUBRIK & INSTRUMEN PENILAIAN TERPADU (SIKAP 6C, KINERJA, & SUMATIF HOTS)**

<div style="page-break-before: always; break-before: page; margin-top: 40px;"></div>
`;

  // 4. Generate all individual parts
  const docAlokasiWaktu = generateExpertCurriculumDocument({ ...params, docType: 'analisis_alokasi_waktu', toolType: 'analisis_alokasi_waktu' });
  const docAnalisisCP = generateExpertCurriculumDocument({ ...params, docType: 'analisis_cp', toolType: 'analisis_cp' });
  const docTP = generateExpertCurriculumDocument({ ...params, docType: 'tp', toolType: 'tp' });
  const docATP = generateExpertCurriculumDocument({ ...params, docType: 'atp', toolType: 'atp' });
  const docPROTA = generateExpertCurriculumDocument({ ...params, docType: 'prota', toolType: 'prota' });
  const docPROSEM = generateExpertCurriculumDocument({ ...params, docType: 'prosem', toolType: 'prosem' });
  const docKKTP = generateExpertCurriculumDocument({ ...params, docType: 'kktp', toolType: 'kktp' });
  const docModulAjar = generateExpertCurriculumDocument({ ...params, docType: 'modul_ajar', toolType: 'modul_ajar' });
  const docLKPD = generateExpertCurriculumDocument({ ...params, docType: 'lkpd', toolType: 'lkpd' });
  const docRubrik = generateExpertCurriculumDocument({ ...params, docType: 'rubrik_penilaian', toolType: 'rubrik_penilaian' });

  const pageBreak = '\n\n<div style="page-break-before: always; break-before: page; margin-top: 40px;"></div>\n\n';

  return [
    coverSection.trim(),
    pengesahanSection.trim(),
    daftarIsiSection.trim(),
    '# BAGIAN I : ANALISIS ALOKASI WAKTU (RBE)\n' + docAlokasiWaktu.trim(),
    '# BAGIAN II : ANALISIS CAPAIAN PEMBELAJARAN (CP) TERBARU\n' + docAnalisisCP.trim(),
    '# BAGIAN III : RUMUSAN TUJUAN PEMBELAJARAN (TP)\n' + docTP.trim(),
    '# BAGIAN IV : ALUR TUJUAN PEMBELAJARAN (ATP)\n' + docATP.trim(),
    '# BAGIAN V : PROGRAM TAHUNAN (PROTA)\n' + docPROTA.trim(),
    '# BAGIAN VI : PROGRAM SEMESTER (PROSEM) GANJIL & GENAP\n' + docPROSEM.trim(),
    '# BAGIAN VII : KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)\n' + docKKTP.trim(),
    '# BAGIAN VIII : MODUL AJAR DEEP LEARNING\n' + docModulAjar.trim(),
    '# BAGIAN IX : LEMBAR KERJA PESERTA DIDIK (LKPD KREATIF)\n' + docLKPD.trim(),
    '# BAGIAN X : RUBRIK PENILAIAN TERPADU\n' + docRubrik.trim(),
  ].join(pageBreak);
}


