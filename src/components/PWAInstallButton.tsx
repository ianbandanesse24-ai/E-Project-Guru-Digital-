import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'outline' | 'compact' | 'sidebar';
  className?: string;
  showIconOnlyOnMobile?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'primary',
  className = '',
  showIconOnlyOnMobile = false,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="mx-1 mb-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-[11px] truncate text-emerald-900">PWA Aktif (Offline Ready)</span>
        </div>
      );
    }
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-all duration-150 flex items-center justify-between group ${className}`}
        >
          <div className="flex items-center space-x-2.5 text-left">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Download className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Pasang Aplikasi</div>
              <div className="text-[10px] text-slate-500 font-medium">Akses Offline di HP & PC</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            PWA
          </span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          title="Pasang Aplikasi AGK (PWA Offline & Online)"
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium shadow-xs transition-all duration-150 ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span className={showIconOnlyOnMobile ? 'hidden sm:inline' : 'inline'}>
            Pasang Aplikasi
          </span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'outline') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-all duration-150 ${className}`}
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Pasang di HP / Laptop</span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium shadow-xs transition-all duration-150 ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Pasang Aplikasi (PWA Offline)</span>
      </button>
      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
