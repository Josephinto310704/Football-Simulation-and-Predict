'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Heart, 
  Gift, 
  Coffee, 
  Copy, 
  Check, 
  ArrowSquareOut, 
  X, 
  Sparkle, 
  QrCode, 
  Trophy,
  Coins
} from '@phosphor-icons/react';

interface DonasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonasiModal({ isOpen, onClose }: DonasiModalProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => {
      setCopiedAccount(null);
    }, 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        {/* Modal Card */}
        <div 
          className="w-full max-w-lg overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all animate-scaleUp border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header with Gradient Background */}
        <div className="relative bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5 font-bold" />
          </button>

          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Heart weight="fill" className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                <Sparkle weight="fill" className="w-3 h-3 text-amber-300" /> Support The Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                Dukung Riset & Analitik
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            WorldCup Predictor 2026 dikembangkan secara independen untuk menyediakan analisis taktis dan prediksi matematis sekelas profesional tanpa iklan & tanpa biaya langganan.
          </p>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Quick Support Platforms */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Platform Donasi Pilihan</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://saweria.co"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 transition-all group shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Gift weight="fill" className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block leading-tight">Saweria</span>
                    <span className="text-[11px] text-amber-700 block mt-0.5">GoPay, OVO, DANA, QRIS</span>
                  </div>
                </div>
                <ArrowSquareOut className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              <a
                href="https://trakteer.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/80 text-rose-900 transition-all group shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Coffee weight="fill" className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block leading-tight">Trakteer</span>
                    <span className="text-[11px] text-rose-700 block mt-0.5">Traktir Kopi Espresso</span>
                  </div>
                </div>
                <ArrowSquareOut className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            </div>
          </div>

          {/* Transfer Bank / QRIS Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Transfer Bank & QRIS</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                INSTANT TRANSFER
              </span>
            </div>

            {/* Account Item 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Bank BCA (a.n. WorldCup Engine)</div>
                <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">8765-4321-00</div>
              </div>
              <button
                onClick={() => handleCopy('8765432100', 'bca')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copiedAccount === 'bca'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {copiedAccount === 'bca' ? (
                  <>
                    <Check weight="bold" className="w-3.5 h-3.5" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* Account Item 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Bank Mandiri (a.n. Riset & Analitik)</div>
                <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">123-00-9876543-2</div>
              </div>
              <button
                onClick={() => handleCopy('1230098765432', 'mandiri')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copiedAccount === 'mandiri'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {copiedAccount === 'mandiri' ? (
                  <>
                    <Check weight="bold" className="w-3.5 h-3.5" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Terima kasih atas kontribusimu pada analitik sepak bola!</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            Close
          </button>
        </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
