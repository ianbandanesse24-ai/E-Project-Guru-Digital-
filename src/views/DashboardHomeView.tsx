import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Sparkles,
  Printer,
  Clock,
  ArrowRight,
  School,
  CheckCircle2,
  FileSearch,
  Target,
  GitMerge,
  CalendarRange,
  CalendarCheck,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  HelpCircle,
  HeartHandshake,
  BookMarked,
  CalendarDays,
  Search,
  UserCheck,
  Download,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { UserAccount, SchoolProfile, AppTheme } from '../types';
import { StorageService } from '../lib/storage';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { AMDLogo } from '../components/AMDLogo';

interface DashboardHomeViewProps {
  currentUser: UserAccount;
  onNavigate: (viewId: string) => void;
  onOpenSchoolProfile: () => void;
  theme?: AppTheme;
}

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  currentUser,
  onNavigate,
  onOpenSchoolProfile,
}) => {
  const [schoolProfile] = useState<SchoolProfile>(() => StorageService.getSchoolProfile());
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'admin' | 'kaldik'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const students = StorageService.getStudents();
  const schedule = StorageService.getSchedule();
  const aiDocs = StorageService.getAIDocuments();
  const users = StorageService.getUsers();
  const kalender = StorageService.getKalenderPendidikan();
  const adminSettings = StorageService.getAdminSettings();

  const pendingApprovals = users.filter((u) => u.status === 'pending');

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? 'Selamat Pagi'
      : hour < 15
      ? 'Selamat Siang'
      : hour < 18
      ? 'Selamat Sore'
      : 'Selamat Malam';

  const mainShortcuts = [
    {
      id: 'kelas_siswa',
      title: 'Kelola Kelas & Siswa',
      desc: 'Manajemen data rombongan belajar, NISN, dan biodata siswa terpusat',
      icon: Users,
      category: 'admin',
    },
    {
      id: 'absensi',
      title: 'Absensi Siswa',
      desc: 'Presensi harian, rekapitulasi sakit, izin, dan alpa secara otomatis',
      icon: CheckCircle2,
      category: 'admin',
    },
    {
      id: 'jadwal',
      title: 'Jadwal Mengajar',
      desc: 'Matriks jam tatap muka mingguan dan alokasi jam pelajaran',
      icon: Calendar,
      category: 'admin',
    },
    {
      id: 'jurnal',
      title: 'Jurnal Mengajar',
      desc: 'Refleksi pedagogis harian, catatan supervisi, dan tindak lanjut',
      icon: BookMarked,
      category: 'admin',
    },
    {
      id: 'cetak_laporan',
      title: 'Cetak Laporan Lengkap',
      desc: 'Pusat ekspor dokumen format resmi siap cetak ke format PDF atau Word',
      icon: Printer,
      category: 'admin',
      badge: 'PDF / Word',
    },
  ];

  const aiShortcuts = [
    {
      id: 'profil_guru_mapel',
      title: 'Profil Guru Mata Pelajaran',
      desc: 'Biodata guru & kepala sekolah serta rujukan dokumen Capaian Pembelajaran',
      icon: UserCheck,
      category: 'ai',
      badge: 'Acuan Utama',
    },
    {
      id: 'parameter_kurikulum',
      title: 'Parameter Kurikulum, Beban Belajar & Kaldik',
      desc: 'Konfigurasi terpadu mapel, JP/minggu, Bab materi, rumusan TP, dan analisis RBE Kaldik',
      icon: Sliders,
      category: 'kaldik',
      badge: 'Deep Learning & RBE',
    },
    {
      id: 'ai_analisis_cp',
      title: '1. Analisis CP Terbaru',
      desc: 'Pemetaan elemen Capaian Pembelajaran dan integrasi kompetensi',
      icon: FileSearch,
      category: 'ai',
    },
    {
      id: 'ai_tp',
      title: '2. Tujuan Pembelajaran (TP)',
      desc: 'Perumusan kompetensi dan indikator ketercapaian Taksonomi Bloom',
      icon: Target,
      category: 'ai',
    },
    {
      id: 'ai_atp',
      title: '3. Alur TP (ATP)',
      desc: 'Penyusunan alur pembelajaran bertahap beserta alokasi jam pelajaran',
      icon: GitMerge,
      category: 'ai',
    },
    {
      id: 'ai_prota',
      title: '4. Program Tahunan (PROTA)',
      desc: 'Distribusi dan pembagian materi pembelajaran untuk satu tahun ajaran',
      icon: CalendarRange,
      category: 'ai',
    },
    {
      id: 'ai_prosem',
      title: '5. Program Semester (PROSEM)',
      desc: 'Matriks alokasi jadwal pekan efektif dan rencana bulanan semester',
      icon: CalendarCheck,
      category: 'ai',
    },
    {
      id: 'ai_kktp',
      title: '6. Kriteria Ketuntasan (KKTP)',
      desc: 'Interval nilai, rubrik asesmen, dan deskripsi kriteria mutu belajar',
      icon: CheckSquare,
      category: 'ai',
      badge: 'Standar Mutu',
    },
    {
      id: 'ai_modul_ajar',
      title: '7. RPM (Rencana Pelaksanaan Modul)',
      desc: 'Penyusunan Rencana Pelaksanaan Modul dengan sintaks Deep Learning',
      icon: FileText,
      category: 'ai',
      badge: 'RPM Terpadu',
    },
    {
      id: 'ai_lkpd',
      title: '8. Lembar Kerja Siswa (LKPD)',
      desc: 'Aktivitas pembelajaran berdiferensiasi dan penyelidikan terstruktur',
      icon: FileSpreadsheet,
      category: 'ai',
    },
    {
      id: 'ai_rubrik_penilaian',
      title: '9. Rubrik Penilaian Terpadu',
      desc: 'Rubrik asesmen autentik formatif dan sumatif yang selaras dengan modul',
      icon: HelpCircle,
      category: 'ai',
    },
  ];

  const allItems = [...aiShortcuts, ...mainShortcuts];

  const filteredItems = allItems.filter((item) => {
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'ai' && (item.category === 'ai' || item.category === 'kaldik')) ||
      (activeTab === 'admin' && item.category === 'admin') ||
      (activeTab === 'kaldik' && item.category === 'kaldik');

    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Admin Broadcast Announcement */}
      {adminSettings?.systemBroadcastMessage && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-lg flex items-center space-x-3 text-xs text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-blue-950">Pengumuman: </span>
            <span>{adminSettings.systemBroadcastMessage}</span>
          </div>
        </div>
      )}

      {/* Modern SaaS Header Hero */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              <span>Administrasi Guru & Kurikulum Deep Learning</span>
              <span>•</span>
              <span>Tahun Ajaran 2025/2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {greeting}, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Kelola data presensi, jadwal tatap muka, jurnal guru, dan susun perangkat kurikulum secara terpadu dalam satu antarmuka modern.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <button
                type="button"
                id="btn-dashboard-school-profile"
                onClick={onOpenSchoolProfile}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors duration-150"
              >
                <School className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                <span>{schoolProfile.schoolName}</span>
              </button>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200">
                TA {schoolProfile.academicYear} ({schoolProfile.semester})
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/70">
                {currentUser.role === 'admin' ? 'Administrator' : 'Guru Mapel / Wali'}
              </span>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-row lg:flex-col gap-2 shrink-0">
            <button
              id="btn-quick-rpm"
              onClick={() => onNavigate('ai_modul_ajar')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-medium text-xs shadow-xs transition-all duration-150"
            >
              <AMDLogo size="xs" />
              <span>Susun RPM / Modul Ajar</span>
            </button>
            <button
              id="btn-quick-kaldik"
              onClick={() => onNavigate('kalender_pendidikan')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs shadow-xs transition-all duration-150"
            >
              <CalendarDays className="w-4 h-4 text-slate-500" />
              <span>Kalender & Alokasi JP</span>
            </button>
          </div>
        </div>
      </div>

      {/* PWA & Multi-Device Offline Ready Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-slate-900">
                Aplikasi PWA Multi-Perangkat (Offline & Online)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Offline Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dapat dipasang di HP Android, iPhone/iPad, tablet, dan laptop. Data tersimpan aman di perangkat saat offline.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <PWAInstallButton variant="compact" className="w-full sm:w-auto" />
        </div>
      </div>

      {/* Admin Approval Notice Banner */}
      {currentUser.role === 'admin' && pendingApprovals.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-semibold">Ada {pendingApprovals.length} Pengajuan Akun Guru.</span>
              <span className="text-amber-800 ml-1">Menunggu persetujuan dan otorisasi dari administrator.</span>
            </div>
          </div>
          <button
            id="btn-review-approval"
            onClick={() => onNavigate('admin_access')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors duration-150 shrink-0 shadow-xs"
          >
            Tinjau Otorisasi
          </button>
        </div>
      )}

      {/* 4 Statistics Metrics (Clean SaaS Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Siswa</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {students.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Siswa terdaftar aktif</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Beban Mengajar</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-blue-600 mt-2">
            {schedule.length * 2} JP
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{schedule.length} sesi pertemuan/minggu</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Perangkat Kurikulum</span>
            <AMDLogo size="xs" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {aiDocs.length} Modul
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tersimpan di sistem</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pekan Efektif</span>
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            {kalender.semester1?.totalEffectiveWeeks || 19} RBE
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Semester Ganjil 2025/2026</div>
        </div>
      </div>

      {/* Tab Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Filter Pills */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            id="tab-filter-all"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Modul ({allItems.length})
          </button>
          <button
            id="tab-filter-ai"
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              activeTab === 'ai'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kurikulum & AI ({aiShortcuts.length})
          </button>
          <button
            id="tab-filter-admin"
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Administrasi Pokok ({mainShortcuts.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="input-search-modules"
            type="text"
            placeholder="Cari modul atau administrasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white text-slate-900 border border-slate-300 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* Grid of All Application Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`card-module-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 text-left flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center border border-slate-200/80 group-hover:border-blue-200 transition-colors duration-150">
                  <Icon className="w-4 h-4" />
                </div>
                {'badge' in item && Boolean(item.badge) && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {String(item.badge)}
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-150">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500 group-hover:text-blue-600 transition-colors duration-150">
                <span>Buka Modul</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
