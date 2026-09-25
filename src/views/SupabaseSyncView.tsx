import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Lock,
  Server,
  Layers,
  Calendar,
  Users,
  FileText,
  Activity,
  Award,
  Github,
  Download,
  FolderGit2,
  GitBranch,
  Shield,
  ArrowUpRight,
  HardDriveDownload,
} from 'lucide-react';
import { SupabaseService, DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from '../lib/supabase';
import { GitHubSyncService, DEFAULT_GITHUB_CONFIG } from '../lib/githubSync';
import { CloudAutoSyncService } from '../lib/cloudAutoSync';
import { StorageService } from '../lib/storage';
import { SupabaseConfig, GitHubConfig } from '../types';

export const SupabaseSyncView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'supabase' | 'github'>('both');

  // Supabase State
  const [sbConfig, setSbConfig] = useState<SupabaseConfig>(() => SupabaseService.getConfig());
  const [urlInput, setUrlInput] = useState<string>(sbConfig.url || DEFAULT_SUPABASE_URL);
  const [keyInput, setKeyInput] = useState<string>(sbConfig.apiKey || DEFAULT_SUPABASE_ANON_KEY);
  const [sbAutoSync, setSbAutoSync] = useState<boolean>(sbConfig.autoSync ?? true);

  // GitHub State
  const [ghConfig, setGhConfig] = useState<GitHubConfig>(() => GitHubSyncService.getConfig());
  const [ghOwner, setGhOwner] = useState<string>(ghConfig.owner || '');
  const [ghRepo, setGhRepo] = useState<string>(ghConfig.repo || '');
  const [ghBranch, setGhBranch] = useState<string>(ghConfig.branch || 'main');
  const [ghToken, setGhToken] = useState<string>(ghConfig.token || '');
  const [ghAutoSync, setGhAutoSync] = useState<boolean>(ghConfig.autoSync ?? true);

  // Status and Loading States
  const [isTestingSb, setIsTestingSb] = useState<boolean>(false);
  const [isTestingGh, setIsTestingGh] = useState<boolean>(false);
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [isSyncingSb, setIsSyncingSb] = useState<boolean>(false);
  const [isSyncingGh, setIsSyncingGh] = useState<boolean>(false);

  const [sbTestResult, setSbTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const [ghTestResult, setGhTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    repoUrl?: string;
    defaultBranch?: string;
  } | null>(null);

  const [dualSyncResult, setDualSyncResult] = useState<{
    supabase?: { success: boolean; message: string; stats?: Record<string, number> };
    github?: { success: boolean; message: string; repoUrl?: string; filesCount?: number };
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Counts
  const studentCount = StorageService.getStudents().length;
  const classCount = StorageService.getClasses().length;
  const attendanceCount = StorageService.getAttendance().length;
  const scheduleCount = StorageService.getSchedule().length;
  const agendaCount = StorageService.getAgenda().length;
  const journalCount = StorageService.getJournal().length;
  const dailyGradeCount = StorageService.getDailyGrades().length;
  const unifiedGradeCount = StorageService.getGrades().length;
  const aiDocCount = StorageService.getAIDocuments().length;
  const cpDistCount = StorageService.getCPDistributions().length;
  const userCount = StorageService.getUsers().length;

  // Supabase Handlers
  const handleSaveSbConfig = () => {
    const updated = SupabaseService.saveConfig({
      url: urlInput.trim(),
      apiKey: keyInput.trim(),
      autoSync: sbAutoSync,
    });
    setSbConfig(updated);
    setSbTestResult({
      success: true,
      message: 'Kredensial Supabase berhasil disimpan.',
    });
    setTimeout(() => setSbTestResult(null), 3000);
  };

  const handleResetSbToDefault = () => {
    setUrlInput(DEFAULT_SUPABASE_URL);
    setKeyInput(DEFAULT_SUPABASE_ANON_KEY);
    const updated = SupabaseService.saveConfig({
      url: DEFAULT_SUPABASE_URL,
      apiKey: DEFAULT_SUPABASE_ANON_KEY,
      autoSync: true,
    });
    setSbConfig(updated);
    setSbTestResult({
      success: true,
      message: 'Kredensial dikembalikan ke proyek Supabase terhubung saat ini.',
    });
    setTimeout(() => setSbTestResult(null), 3000);
  };

  const handleTestSb = async () => {
    setIsTestingSb(true);
    setSbTestResult(null);
    try {
      const res = await SupabaseService.testConnection(urlInput.trim(), keyInput.trim());
      setSbTestResult(res);
    } catch (e: any) {
      setSbTestResult({
        success: false,
        message: e?.message || 'Gagal menghubungi server Supabase.',
      });
    } finally {
      setIsTestingSb(false);
    }
  };

  const handlePushSb = async () => {
    setIsSyncingSb(true);
    try {
      const res = await SupabaseService.pushAllToSupabase(false);
      setDualSyncResult((prev) => ({ ...prev, supabase: res }));
      setSbConfig(SupabaseService.getConfig());
    } catch (e: any) {
      setDualSyncResult((prev) => ({
        ...prev,
        supabase: { success: false, message: e?.message || 'Gagal sinkronisasi Supabase' },
      }));
    } finally {
      setIsSyncingSb(false);
    }
  };

  // GitHub Handlers
  const handleSaveGhConfig = () => {
    GitHubSyncService.saveConfig({
      owner: ghOwner.trim(),
      repo: ghRepo.trim(),
      branch: ghBranch.trim() || 'main',
      token: ghToken.trim(),
      autoSync: ghAutoSync,
    });
    setGhConfig(GitHubSyncService.getConfig());
    setGhTestResult({
      success: true,
      message: 'Konfigurasi repositori GitHub berhasil disimpan.',
    });
    setTimeout(() => setGhTestResult(null), 3000);
  };

  const handleTestGh = async () => {
    setIsTestingGh(true);
    setGhTestResult(null);
    try {
      const res = await GitHubSyncService.testConnection(ghOwner.trim(), ghRepo.trim(), ghToken.trim());
      setGhTestResult(res);
      if (res.defaultBranch) {
        setGhBranch(res.defaultBranch);
      }
    } catch (e: any) {
      setGhTestResult({
        success: false,
        message: e?.message || 'Gagal menghubungi GitHub API.',
      });
    } finally {
      setIsTestingGh(false);
    }
  };

  const handlePushGh = async () => {
    setIsSyncingGh(true);
    try {
      const res = await GitHubSyncService.pushAllToGitHub(false);
      setDualSyncResult((prev) => ({ ...prev, github: res }));
      setGhConfig(GitHubSyncService.getConfig());
    } catch (e: any) {
      setDualSyncResult((prev) => ({
        ...prev,
        github: { success: false, message: e?.message || 'Gagal sinkronisasi GitHub' },
      }));
    } finally {
      setIsSyncingGh(false);
    }
  };

  // Unified Sync Handler (Sync Both Simultaneously)
  const handleSyncBoth = async () => {
    setIsSyncingAll(true);
    setDualSyncResult(null);
    try {
      const result = await CloudAutoSyncService.syncBoth(false);
      setDualSyncResult(result);
      setSbConfig(SupabaseService.getConfig());
      setGhConfig(GitHubSyncService.getConfig());
    } catch (err: any) {
      setDualSyncResult({
        supabase: { success: false, message: err?.message || 'Sinkronisasi gagal' },
        github: { success: false, message: err?.message || 'Sinkronisasi gagal' },
      });
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleDownloadSnapshot = () => {
    GitHubSyncService.downloadLocalBackupArchive();
  };

  const sqlSchema = SupabaseService.getSupabaseSQLSchema();

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-800/40 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-64 h-64 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Cloud className="w-3.5 h-3.5" />
              <span>Sinkronisasi Otomatis Dual Cloud (Supabase & GitHub)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Integrasi Cloud & GitHub Real-time</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Sinkronkan seluruh data administrasi guru—presensi, jadwal, agenda, jurnal mengajar, penilaian rapor, alokasi CP/TP, hingga arsip modul ajar AI secara otomatis dan aman ke <strong>Supabase (PostgreSQL)</strong> dan <strong>GitHub Repository</strong>.
            </p>

            {/* Quick Status Chips */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase: <strong>phbrqacielziyyzxntdn</strong></span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub: {ghConfig.owner && ghConfig.repo ? `${ghConfig.owner}/${ghConfig.repo}` : 'Siap Dikonfigurasi'}</span>
              </div>
            </div>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={handleSyncBoth}
              disabled={isSyncingAll || isSyncingSb || isSyncingGh}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Menyinkronkan...' : 'Sinkronkan Keduanya Sekarang'}</span>
            </button>
            <button
              onClick={handleDownloadSnapshot}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              title="Unduh seluruh cadangan data lokal dalam format arsip repositori JSON"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Unduh Arsip Cadangan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dual Sync Result Banner */}
      {dualSyncResult && (
        <div className="space-y-2">
          {dualSyncResult.supabase && (
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                dualSyncResult.supabase.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <Database className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-bold">Status Supabase: </span>
                {dualSyncResult.supabase.message}
                {dualSyncResult.supabase.stats && (
                  <div className="mt-1 flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {Object.entries(dualSyncResult.supabase.stats).map(([k, v]) => (
                      <span key={k} className="px-1.5 py-0.5 rounded bg-emerald-500/20">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {dualSyncResult.github && (
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                dualSyncResult.github.success
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <Github className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-bold">Status GitHub: </span>
                {dualSyncResult.github.message}
                {dualSyncResult.github.repoUrl && (
                  <a
                    href={dualSyncResult.github.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 underline inline-flex items-center gap-1 font-semibold"
                  >
                    Buka Repositori <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('both')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'both'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Dashboard Sinkronisasi Ganda</span>
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pengaturan Supabase Cloud</span>
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'github'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Github className="w-3.5 h-3.5 text-blue-400" />
          <span>Pengaturan Repositori GitHub</span>
        </button>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Peserta Didik</div>
          <div className="text-xl font-bold text-white mt-1">{studentCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Siswa Aktif</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Rombel / Kelas</div>
          <div className="text-xl font-bold text-white mt-1">{classCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Kelas Terdaftar</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Presensi & Jurnal</div>
          <div className="text-xl font-bold text-white mt-1">{attendanceCount + journalCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Pertemuan Terisi</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Agenda & Jadwal</div>
          <div className="text-xl font-bold text-white mt-1">{agendaCount + scheduleCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Jadwal & Agenda</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Penilaian Rapor</div>
          <div className="text-xl font-bold text-white mt-1">{dailyGradeCount + unifiedGradeCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Data Nilai Siswa</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Modul & CP AI</div>
          <div className="text-xl font-bold text-white mt-1">{aiDocCount + cpDistCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Dokumen Kurikulum</div>
        </div>
      </div>

      {/* TAB 1: BOTH / DUAL SYNC */}
      {(activeTab === 'both' || activeTab === 'supabase') && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Konfigurasi Supabase Cloud (PostgreSQL)</h2>
              </div>
              <a
                href="https://supabase.com/dashboard/project/phbrqacielziyyzxntdn"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>Buka Dashboard Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Project URL Supabase:
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="https://phbrqacielziyyzxntdn.supabase.co"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Public Anon Key:
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sbAutoSync}
                  onChange={(e) => setSbAutoSync(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-950 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Aktifkan Auto-Sync Otomatis di Latar Belakang (setiap data disimpan)
                </span>
              </label>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTestSb}
                  disabled={isTestingSb}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
                >
                  <Activity className={`w-3.5 h-3.5 ${isTestingSb ? 'animate-spin' : ''}`} />
                  <span>{isTestingSb ? 'Menguji...' : 'Uji Koneksi Supabase'}</span>
                </button>
                <button
                  onClick={handleSaveSbConfig}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
                >
                  Simpan Konfigurasi
                </button>
                <button
                  onClick={handlePushSb}
                  disabled={isSyncingSb}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSb ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSb ? 'Pushing...' : 'Push ke Supabase'}</span>
                </button>
              </div>
            </div>

            {sbTestResult && (
              <div
                className={`p-3 rounded-xl text-xs border ${
                  sbTestResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {sbTestResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BOTH / GITHUB */}
      {(activeTab === 'both' || activeTab === 'github') && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Github className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Konfigurasi Repositori GitHub & Auto-Commit</h2>
            </div>
            {ghConfig.owner && ghConfig.repo && (
              <a
                href={`https://github.com/${ghConfig.owner}/${ghConfig.repo}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <span>Buka GitHub Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Simpan dan commit seluruh arsip data JSON, dokumen Markdown perangkat ajar Deep Learning, serta skema SQL langsung ke repositori GitHub Anda secara berkala.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner / Username GitHub:
              </label>
              <input
                type="text"
                value={ghOwner}
                onChange={(e) => setGhOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="contoh: ianbandanesse"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Nama Repository GitHub:
              </label>
              <input
                type="text"
                value={ghRepo}
                onChange={(e) => setGhRepo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="contoh: e-project-guru-digital-data"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Branch Target:
              </label>
              <input
                type="text"
                value={ghBranch}
                onChange={(e) => setGhBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="main"
              />
            </div>
          </div>

          <div className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-semibold">
                GitHub Personal Access Token (PAT):
              </label>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=E-Project-Guru-Digital"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Buat Token Baru di GitHub (Izin repo)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={ghToken}
              onChange={(e) => setGhToken(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Token disimpan di browser Anda untuk keperluan sinkronisasi commit otomatis. Pastikan token memiliki centang izin <code className="text-blue-400 font-mono">repo</code>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ghAutoSync}
                onChange={(e) => setGhAutoSync(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-950 border-slate-700"
              />
              <span className="text-xs text-slate-300">
                Otomatis Commit ke GitHub saat data pembelajaran bertambah / diubah
              </span>
            </label>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleTestGh}
                disabled={isTestingGh}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
              >
                <FolderGit2 className={`w-3.5 h-3.5 ${isTestingGh ? 'animate-spin' : ''}`} />
                <span>{isTestingGh ? 'Memeriksa...' : 'Uji Akses Repo'}</span>
              </button>
              <button
                onClick={handleSaveGhConfig}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
              >
                Simpan Pengaturan
              </button>
              <button
                onClick={handlePushGh}
                disabled={isSyncingGh}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 transition-all cursor-pointer flex items-center space-x-1"
              >
                <Github className={`w-3.5 h-3.5 ${isSyncingGh ? 'animate-spin' : ''}`} />
                <span>{isSyncingGh ? 'Committing...' : 'Commit ke GitHub'}</span>
              </button>
            </div>
          </div>

          {ghTestResult && (
            <div
              className={`p-3 rounded-xl text-xs border ${
                ghTestResult.success
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {ghTestResult.message}
            </div>
          )}
        </div>
      )}

      {/* SQL Schema Viewer Component (Preserved & Enhanced) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Skrip SQL Skema Database Supabase</h2>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="https://supabase.com/dashboard/project/phbrqacielziyyzxntdn/sql/new"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 mr-2"
            >
              <span>Buka SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleCopySql}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Seluruh SQL</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Jika tabel di Supabase belum dibuat, klik <strong>Salin Seluruh SQL</strong> di atas, buka <strong>Supabase SQL Editor</strong>, tempelkan skrip, lalu klik <strong>Run</strong>.
        </p>

        <div className="relative">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto select-all">
            {sqlSchema}
          </pre>
        </div>
      </div>
    </div>
  );
};
