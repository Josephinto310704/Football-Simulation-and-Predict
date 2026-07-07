'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Cpu, 
  TreeStructure, 
  TrendUp, 
  CheckCircle, 
  ArrowRight, 
  Sparkle, 
  Pulse, 
  ShieldCheck, 
  Lightning, 
  Target, 
  ChartBar,
  Calendar
} from '@phosphor-icons/react';
import { TEAMS } from '@/lib/data/teams';
import { MATCHES } from '@/lib/data/matches';
import { predictMatch } from '@/lib/engine/poisson';
import TeamFlag from '@/components/TeamFlag';

export default function HomePage() {
  // Get highlighted match from QF1: Spanyol vs Maroko
  const esp = TEAMS.find(t => t.code === 'ESP')!;
  const mar = TEAMS.find(t => t.code === 'MAR')!;
  const prdMatchPrediction = predictMatch(esp, mar, true);

  // Get undervalued gems
  const undervaluedTeams = TEAMS.filter(t => t.valuationStatus === 'undervalued').slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-5 sm:p-8 md:p-12 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-50/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold tracking-wide">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="leading-tight">PIALA DUNIA 2026 — ANALYTICAL COMMAND CENTER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Data-Driven Football Simulation <span className="text-blue-600">&amp; Prediction Engine</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
            Menggantikan tebakan intuitif dengan matematika probabilistik yang dapat diaudit. Mengintegrasikan filosofi <strong className="text-slate-900 font-semibold">Moneyball Sabermetrics (PPDA &amp; xG)</strong>, model <strong className="text-slate-900 font-semibold">Dixon-Coles Poisson</strong>, dan 10.000 iterasi <strong className="text-slate-900 font-semibold">Monte Carlo</strong> untuk menganalisis babak knockout Piala Dunia 2026.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/simulator"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all w-full sm:w-auto"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Match Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/bracket"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 transition-all shadow-sm w-full sm:w-auto"
            >
              <TreeStructure className="w-4 h-4 text-indigo-600" />
              <span>10,000 Monte Carlo Bracket</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase font-medium">Status Turnamen</p>
            <p className="text-xl font-bold text-slate-900">8 Tim Quarter-Final</p>
            <p className="text-[11px] text-emerald-600 font-semibold">10–11 Juli 2026</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase font-medium">Model Brier Score</p>
            <p className="text-xl font-bold text-slate-900">0.1392 <span className="text-xs font-normal text-blue-600">(KPI &lt; 0.20)</span></p>
            <p className="text-[11px] text-slate-500 font-semibold">Terkalibrasi Sempurna</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <TrendUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase font-medium">Top Moneyball Gem</p>
            <p className="text-xl font-bold text-slate-900">Uruguay 🇺🇾</p>
            <p className="text-[11px] text-amber-600 font-semibold">Score 83/100 (+8 vs Odds)</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase font-medium">Explainable AI</p>
            <p className="text-xl font-bold text-slate-900">100% Audit</p>
            <p className="text-[11px] text-indigo-600 font-semibold">Bukan Black-Box</p>
          </div>
        </div>
      </div>

      {/* Highlighted Matchup from QF1 8 Besar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold uppercase tracking-wider">
              ★ QF1 Spotlight Duel 8 Besar
            </span>
            <span className="text-sm text-slate-500 font-mono flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> 10 Juli 2026, 02:00 WIB (Boston)
            </span>
          </div>
          <Link
            href="/simulator?home=esp&away=mar"
            className="text-xs font-mono text-blue-600 hover:text-blue-700 flex items-center gap-1 group font-bold"
          >
            <span>Buka di Match Simulator Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Teams and Probabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-8 items-center">
          
          {/* Spanyol */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
            <div className="flex items-center gap-3">
              <TeamFlag isoCode={esp.isoCode || esp.id} name={esp.name} size="xl" />
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{esp.name}</h3>
                <p className="text-xs text-slate-500 font-mono">Elo Rating: {esp.elo} | Moneyball: {esp.moneyballScore}/100</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
              <span>xG Attack: <strong className="text-emerald-600">{esp.xgAttack}</strong></span>
              <span>•</span>
              <span>Prog. Passes: <strong className="text-blue-600">{esp.progPasses}</strong></span>
            </div>
          </div>

          {/* VS & Probability Bar */}
          <div className="lg:col-span-6 space-y-4 px-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-red-700">ESP WIN: {Math.round(prdMatchPrediction.homeWinProb * 100)}%</span>
              <span className="text-slate-500">DRAW: {Math.round(prdMatchPrediction.drawProb * 100)}%</span>
              <span className="text-emerald-700">MAR WIN: {Math.round(prdMatchPrediction.awayWinProb * 100)}%</span>
            </div>

            {/* Visual Probability Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner border border-slate-200">
              <div 
                style={{ width: `${prdMatchPrediction.homeWinProb * 100}%` }} 
                className="bg-red-600 h-full transition-all duration-1000"
                title="Spanyol Win Probability"
              />
              <div 
                style={{ width: `${prdMatchPrediction.drawProb * 100}%` }} 
                className="bg-slate-300 h-full transition-all duration-1000"
                title="Draw / Penalty Shootout Probability"
              />
              <div 
                style={{ width: `${prdMatchPrediction.awayWinProb * 100}%` }} 
                className="bg-emerald-600 h-full transition-all duration-1000"
                title="Maroko Win Probability"
              />
            </div>

            <div className="flex justify-center pt-1">
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs font-mono text-slate-700 shadow-2xs">
                <span className="text-slate-500 font-semibold">Skor Terpopuler:</span>
                <span className="bg-white px-2.5 py-0.5 rounded-md border border-slate-200 text-slate-900 font-bold shadow-2xs">1-0, 0-0, 0-1</span>
                <span className="text-amber-700 font-bold">(Duel Bertahan)</span>
              </div>
            </div>
          </div>

          {/* Maroko */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right space-y-2">
            <div className="flex items-center flex-row-reverse lg:flex-row gap-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{mar.name}</h3>
                <p className="text-xs text-slate-500 font-mono">Elo Rating: {mar.elo} | Moneyball: {mar.moneyballScore}/100</p>
              </div>
              <TeamFlag isoCode={mar.isoCode || mar.id} name={mar.name} size="xl" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
              <span>xG Defense: <strong className="text-emerald-600">{mar.xgDefense}</strong> (Super Solid)</span>
              <span>•</span>
              <span>PPDA: <strong className="text-blue-600">{mar.ppda}</strong></span>
            </div>
          </div>
        </div>

        {/* Explainability Note */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono flex items-start gap-3">
          <Lightning weight="fill" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-700 font-bold uppercase tracking-wider block mb-1">Catatan Taktikal QF1 8 Besar (Dixon-Coles):</strong>
            Spanyol dominan dalam penguasaan bola dan sirkulasi progresi (64 passes/laga), namun pertahanan blok rendah Maroko (0.65 xGA/laga) terbukti menjadi batu sandungan fatal di 16 besar Piala Dunia 2022. Laga pembuka perempat final dengan probabilitas penalti tertinggi!
          </div>
        </div>
      </div>

      {/* Undervalued Teams Spotlight (Moneyball Gems) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <TrendUp className="w-6 h-6 text-emerald-600" />
              <span>Moneyball Gems: Tim Undervalued</span>
            </h2>
            <p className="text-sm text-slate-600">
              Tim dengan performa sabermetrics (PPDA &amp; xG kreasi) melampaui reputasi odds bandar di Piala Dunia 2026.
            </p>
          </div>
          <Link href="/moneyball" className="text-sm font-mono text-blue-600 hover:underline flex items-center gap-1 font-bold">
            <span>Lihat Semua Ranking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {undervaluedTeams.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <TeamFlag isoCode={t.isoCode || t.id} name={t.name} size="lg" />
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold uppercase">
                  UNDERVALUED (+{t.moneyballScore! - t.marketReputation})
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{t.name}</h4>
                <p className="text-xs text-slate-500 font-mono">Grup {t.group} • Elo: {t.elo}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">MONEYBALL</span>
                  <span className="text-emerald-600 font-bold text-sm">{t.moneyballScore}/100</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">PPDA PRESSING</span>
                  <span className="text-blue-600 font-bold text-sm">{t.ppda}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modular Access Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Pulse className="w-6 h-6 text-blue-600" />
          <span>Eksplorasi Analisis</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/simulator" className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm space-y-4 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Match Simulator (Dixon-Coles)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pilih dua tim dan dapatkan distribusi probabilitas 8x8 gol, xG komparatif, dan kartu penjelasan faktual.
              </p>
            </div>
            <div className="text-xs font-mono text-blue-600 font-bold flex items-center gap-1 pt-2">
              <span>Buka Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/bracket" className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-sm space-y-4 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <TreeStructure className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">10,000 Monte Carlo Bracket</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Simulasi ribuan kali alur turnamen 16 besar hingga final untuk menghasilkan probabilitas juara dunia.
              </p>
            </div>
            <div className="text-xs font-mono text-indigo-600 font-bold flex items-center gap-1 pt-2">
              <span>Jalankan Simulasi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/reports" className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm space-y-4 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <ChartBar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Pre-Match Report &amp; Betting Tiers</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Output laporan profesional otomatis dengan tier rekomendasi (Primary, Secondary, dan Parlay Value Builder).
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1 pt-2">
              <span>Generate Laporan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
