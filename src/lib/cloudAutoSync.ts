import { SupabaseService } from './supabase';
import { GitHubSyncService } from './githubSync';
import { addStorageListener } from './storage';

export interface DualSyncResult {
  supabase: {
    success: boolean;
    message: string;
    stats?: Record<string, number>;
  };
  github: {
    success: boolean;
    message: string;
    repoUrl?: string;
    filesCount?: number;
  };
}

export class CloudAutoSyncService {
  private static isInitialized = false;

  /**
   * Menginisialisasi pendengar perubahan data untuk sinkronisasi otomatis ganda
   */
  static init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Pasang pendengar ke seluruh mutasi penyimpanan lokal (StorageService)
    addStorageListener((key) => {
      // Abaikan kunci konfigurasi sinkronisasi itu sendiri agar tidak terjadi loop
      if (key === 'agk_supabase_config' || key === 'agk_github_config') {
        return;
      }

      // Picu auto-sync ke Supabase
      SupabaseService.triggerAutoSync(key);

      // Picu auto-sync ke GitHub
      GitHubSyncService.triggerAutoSync();
    });

    // Dengarkan saat koneksi kembali online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Jaringan online terdeteksi. Memulai sinkronisasi otomatis Cloud & GitHub...');
        SupabaseService.triggerAutoSync();
        GitHubSyncService.triggerAutoSync();
      });
    }
  }

  /**
   * Menjalankan sinkronisasi manual ke Supabase dan GitHub secara serentak
   */
  static async syncBoth(isAutoSync: boolean = false): Promise<DualSyncResult> {
    const [supabaseRes, githubRes] = await Promise.allSettled([
      SupabaseService.pushAllToSupabase(isAutoSync),
      GitHubSyncService.pushAllToGitHub(isAutoSync),
    ]);

    const supabaseOutput =
      supabaseRes.status === 'fulfilled'
        ? supabaseRes.value
        : { success: false, message: (supabaseRes.reason as Error)?.message || 'Gagal' };

    const githubOutput =
      githubRes.status === 'fulfilled'
        ? githubRes.value
        : { success: false, message: (githubRes.reason as Error)?.message || 'Gagal' };

    return {
      supabase: supabaseOutput,
      github: githubOutput,
    };
  }

  /**
   * Mengambil status komparatif kedua integrasi
   */
  static getCombinedStatus() {
    const sbConfig = SupabaseService.getConfig();
    const ghConfig = GitHubSyncService.getConfig();

    return {
      supabase: {
        configured: Boolean(sbConfig.url && sbConfig.apiKey),
        autoSync: sbConfig.autoSync,
        status: sbConfig.syncStatus || 'idle',
        lastSyncedAt: sbConfig.lastSyncedAt,
        errorMessage: sbConfig.errorMessage,
        url: sbConfig.url,
      },
      github: {
        configured: Boolean(ghConfig.owner && ghConfig.repo && ghConfig.token),
        autoSync: ghConfig.autoSync,
        status: ghConfig.syncStatus || 'idle',
        lastSyncedAt: ghConfig.lastSyncedAt,
        errorMessage: ghConfig.errorMessage,
        repo: ghConfig.owner && ghConfig.repo ? `${ghConfig.owner}/${ghConfig.repo}` : undefined,
        repoUrl: ghConfig.lastCommitUrl || (ghConfig.owner && ghConfig.repo ? `https://github.com/${ghConfig.owner}/${ghConfig.repo}` : undefined),
      },
    };
  }
}
