import React from 'react';
import { Warning, ArrowCounterClockwise } from '@phosphor-icons/react';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorFallback({
  title = "Gagal mengambil data simulasi terbaru",
  message = "Koneksi ke API tertunda, kuota gratis telah habis, atau jaringan terputus. Sistem mengaktifkan arsitektur fallback agar antarmuka tetap stabil dan tidak terjadi crash.",
  onRetry,
  retryLabel = "Coba Lagi Sekarang"
}: ErrorFallbackProps) {
  return (
    <div className="bg-amber-50/90 border border-amber-300 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-sm animate-fadeIn my-6">
      <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
        <Warning weight="fill" className="w-7 h-7" />
      </div>
      <div className="max-w-lg mx-auto space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-mono">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <ArrowCounterClockwise className="w-4 h-4" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
