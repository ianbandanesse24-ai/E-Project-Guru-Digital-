import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StorageService } from './lib/storage';
import { OfflineManager } from './lib/offlineManager';

// Daftarkan PWA Service Worker untuk caching offline di HP & Laptop
OfflineManager.registerServiceWorker();

// Inisialisasi pembersihan data dummy & memastikan data bersih seperti aplikasi baru
StorageService.autoCleanLegacyMockData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
