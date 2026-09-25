import React, { useState } from 'react';
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
} from 'lucide-react';
import { SupabaseService, DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from '../lib/supabase';
import { StorageService } from '../lib/storage';
import { SupabaseConfig } from '../types';

export const SupabaseSyncView: React.FC = () => {
  const [config, setConfig] = useState<SupabaseConfig>(() => SupabaseService.getConfig());
  const [urlInput, setUrlInput] = useState<string>(config.url || DEFAULT_SUPABASE_URL);
  const [keyInput, setKeyInput] = useState<string>(config.apiKey || DEFAULT_SUPABASE_ANON_KEY);
  const [autoSync, setAutoSync] = useState<boolean>(config.autoSync ?? true);

  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    stats?: Record<string, number>;
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Data counts
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

  const handleSaveConfig = () => {
    const updated = SupabaseService.saveConfig({
      url: urlInput.trim(),
      apiKey: keyInput.trim(),
      autoSync,
    });
    setConfig(updated);
    setTestResult({
      success: true,
      message: 'Kredensial dan pengaturan Supabase berhasil disimpan.',
    });
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleResetToDefault = () => {
    setUrlInput(DEFAULT_SUPABASE_URL);
    setKeyInput(DEFAULT_SUPABASE_ANON_KEY);
    const updated = SupabaseService.saveConfig({
      url: DEFAULT_SUPABASE_URL,
      apiKey: DEFAULT_SUPABASE_ANON_KEY,
      autoSync: true,
    });
    setConfig(updated);
    setTestResult({
      success: true,
      message: 'Kredensial dikembalikan ke project bawaan.',
    });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await SupabaseService.testConnection(urlInput.trim(), keyInput.trim());
      setTestResult(res);
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'Gagal menghubungi server Supabase.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handlePushAll = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await SupabaseService.pushAllToSupabase(false);
      setSyncResult(res);
      setConfig(SupabaseService.getConfig());
    } catch (e: any) {
      setSyncResult({
        success: false,
        message: e?.message || 'Terjadi kesalahan saat sinkronisasi.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const sqlSchema = SupabaseService.getSupabaseSQLSchema();

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-64 h-64 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Cloud className="w-3.5 h-3.5" />
              <span>Integrasi Database Cloud (PostgreSQL)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Integrasi Supabase & Real-time Cloud
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Sinkronkan seluruh data administrasi guru—presensi siswa, jadwal, agenda harian, jurnal mengajar, penilaian otomatis rapor, modul ajar AI, hingga akun guru secara aman dan real-time ke Supabase.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={handlePushAll}
              disabled={isSyncing}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sedang Menyinkronkan...' : 'Sinkronkan Sekarang ke Supabase'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Alert */}
      {syncResult && (
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
            syncResult.success
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
          }`}
        >
          {syncResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <div className="font-bold text-sm">{syncResult.message}</div>
            {syncResult.stats && (
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {Object.entries(syncResult.stats).map(([table, count]) => (
                  <span
                    key={table}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono"
                  >
                    {table}: {count} baris
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: Credentials & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Credentials Form */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Kredensial Koneksi Supabase</h2>
            </div>
            <a
              href="https://supabase.com/dashboard/project/kydlbpiyfwqrakxomsrx"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Dashboard Supabase</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Project URL Supabase:
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Public Anon Key:
              </label>
              <textarea
                rows={2}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="font-semibold text-white">Sinkronisasi Otomatis Latar Belakang</div>
                <div className="text-[11px] text-slate-400">
                  Otomatis simpan ke Supabase saat Anda menambah/mengubah data lokal
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                  testResult.success
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 text-amber-400 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Menguji...' : 'Tes Koneksi'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                Simpan Kredensial
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition ml-auto"
              >
                Reset ke Default
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Statistics */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Status & Rekap Data Lokal</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950">
              <span className="text-slate-400">Status Server:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                Terhubung (Active)
              </span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950">
              <span className="text-slate-400">Sinkronisasi Terakhir:</span>
              <span className="font-mono text-slate-200">
                {config.lastSyncedAt || 'Belum pernah'}
              </span>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tabel Siap Kirim:
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" /> Siswa
                  </span>
                  <span className="font-bold text-white">{studentCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-cyan-400" /> Kelas
                  </span>
                  <span className="font-bold text-white">{classCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" /> Presensi
                  </span>
                  <span className="font-bold text-white">{attendanceCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-amber-400" /> Jadwal
                  </span>
                  <span className="font-bold text-white">{scheduleCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-rose-400" /> Agenda
                  </span>
                  <span className="font-bold text-white">{agendaCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-purple-400" /> Jurnal
                  </span>
                  <span className="font-bold text-white">{journalCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-yellow-400" /> Nilai Harian
                  </span>
                  <span className="font-bold text-white">{dailyGradeCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-400" /> Nilai Rapor
                  </span>
                  <span className="font-bold text-white">{unifiedGradeCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-300" /> Modul AI
                  </span>
                  <span className="font-bold text-white">{aiDocCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-teal-300" /> Alokasi CP
                  </span>
                  <span className="font-bold text-white">{cpDistCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 flex items-center justify-between col-span-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-violet-400" /> Akun Pengguna
                  </span>
                  <span className="font-bold text-white">{userCount} Akun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Setup Section */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Skrip SQL Schema Supabase (1-Click Copy)</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Jalankan skrip ini sekali di <strong>Supabase Dashboard &gt; SQL Editor</strong> untuk membuat seluruh tabel dan hak akses.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopySql}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Salin Seluruh SQL</span>
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] max-h-60 overflow-y-auto leading-relaxed custom-scrollbar">
            {sqlSchema}
          </pre>
        </div>
      </div>
    </div>
  );
};
