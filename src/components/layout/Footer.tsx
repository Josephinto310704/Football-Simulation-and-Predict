import React from 'react';
import Link from 'next/link';
import { Sparkle, Shield, Database, Cpu, Trophy } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Sparkle weight="fill" className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-wide">WorldCup Predictor</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem simulasi analitik kuantitatif untuk Piala Dunia 2026. Menggabungkan sabermetrics ala Moneyball, distribusi Poisson Dixon-Coles, Elo Rating dinamis, dan 10.000 iterasi Monte Carlo.
            </p>
          </div>

          {/* Theoretical Frameworks */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" /> Metodologi Model
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 font-medium">
              <li>• Dixon-Coles Poisson Distribution</li>
              <li>• Moneyball Sabermetrics (PPDA & xG)</li>
              <li>• Dynamic Elo Rating ($K=40$)</li>
              <li>• 10,000 Iteration Monte Carlo Engine</li>
              <li>• Bayesian Probability Updating</li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" /> Navigasi Modul
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 font-medium">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Command Center Overview</Link></li>
              <li><Link href="/simulator" className="hover:text-blue-600 transition-colors">Head-to-Head Match Simulator</Link></li>
              <li><Link href="/bracket" className="hover:text-blue-600 transition-colors">Interactive Knockout Bracket</Link></li>
              <li><Link href="/moneyball" className="hover:text-blue-600 transition-colors">Undervalued Teams Index</Link></li>
              <li><Link href="/reports" className="hover:text-blue-600 transition-colors">Pre-Match Report Generator</Link></li>
            </ul>
          </div>

          {/* KPI & Transparency */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Explainable AI KPI
            </h4>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Target Brier Score:</span>
                <span className="text-emerald-700 font-mono font-bold">&lt; 0.20</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Target Win Accuracy:</span>
                <span className="text-blue-700 font-mono font-bold">&gt; 55%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Explainability Rate:</span>
                <span className="text-indigo-700 font-mono font-bold">100% Audit</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              *Murni alat analisis riset kuantitatif, bukan platform transaksi betting.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 WorldCup Predictor Engine. Disusun untuk Zenin (Versi Dokumen 1.0).</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center gap-1 text-emerald-700 font-mono font-semibold">
              <Trophy className="w-3.5 h-3.5" /> FIFA World Cup USA/CAN/MEX 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
