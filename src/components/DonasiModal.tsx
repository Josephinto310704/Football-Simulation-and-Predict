'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Heart, 
  X, 
  Sparkle, 
  QrCode, 
  Trophy
} from '@phosphor-icons/react';

interface DonasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonasiModal({ isOpen, onClose }: DonasiModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        {/* Modal Card */}
        <div 
          className="w-full max-w-md overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all animate-scaleUp border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Gradient Background */}
          <div className="relative bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 p-6 sm:p-7 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-5 h-5 font-bold" />
            </button>

            <div className="flex items-center space-x-3 mb-2.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Heart weight="fill" className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Sparkle weight="fill" className="w-3 h-3 text-amber-300" /> Support The Engine
                </span>
                <h3 className="text-xl font-extrabold tracking-tight mt-0.5">
                  Dukung Riset &amp; Analitik
                </h3>
              </div>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              WorldCup Predictor 2026 dikembangkan secara independen untuk menyediakan analisis taktis dan prediksi matematis tanpa iklan.
            </p>
          </div>

          {/* Modal Body - QRIS Only */}
          <div className="p-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between w-full pb-3 border-b border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Scan QRIS untuk Donasi</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  ALL E-WALLET &amp; BANK
                </span>
              </div>

              {/* QRIS Image Container */}
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-[230px] w-full mx-auto transform hover:scale-105 transition-transform duration-200">
                <img 
                  src="/qris.jpg" 
                  alt="QRIS Donasi WorldCup Predictor" 
                  className="w-full h-auto rounded-xl object-contain"
                />
              </div>

              {/* Helper Text */}
              <p className="text-[11px] text-slate-600 font-medium max-w-xs leading-relaxed pt-1">
                Dapat discan menggunakan <strong>OVO, GoPay, DANA, ShopeePay, LinkAja</strong>, maupun aplikasi <strong>Mobile Banking</strong> apa pun.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Terima kasih atas kontribusimu!</span>
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
