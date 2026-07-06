'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TreeStructure, 
  Play, 
  ArrowCounterClockwise, 
  Trophy, 
  TrendUp, 
  Sparkle, 
  ArrowRight, 
  ShieldCheck,
  Lightning,
  Info
} from '@phosphor-icons/react';
import { TEAMS, getTeam } from '@/lib/data/teams';
import { ROUND_OF_16_FIXTURES } from '@/lib/data/matches';
import { runTournamentSimulation } from '@/lib/engine/monte-carlo';
import { SimulationStats, BracketMatch } from '@/types';
import TeamFlag from '@/components/TeamFlag';

export default function BracketPage() {
  const [iterations, setIterations] = useState<number>(10000);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [stats, setStats] = useState<SimulationStats[]>([]);
  const [bracketPreview, setBracketPreview] = useState<BracketMatch[]>([]);
  const [lastRunTime, setLastRunTime] = useState<number>(0);
  const [useLiveLock, setUseLiveLock] = useState<boolean>(true);

  const handleRunSimulation = (numIters = iterations, liveLock = useLiveLock) => {
    setIsSimulating(true);
    const start = performance.now();
    
    // Use setTimeout to allow UI to show spinning state before sync compute block
    setTimeout(() => {
      const res = runTournamentSimulation(TEAMS, ROUND_OF_16_FIXTURES, numIters, { useRealLifeCompleted: liveLock });
      const end = performance.now();
      setStats(res.stats);
      setBracketPreview(res.bracketPreview);
      setLastRunTime(Math.round(end - start));
      setIsSimulating(false);
    }, 50);
  };

  // Initial simulation on load
  useEffect(() => {
    handleRunSimulation(10000, true);
  }, []);

  // Helper function to render a tournament tree card (Simple, clean, and dynamic)
  const renderTreeCard = (match: BracketMatch) => {
    const teamA = getTeam(match.teamAId || '');
    const teamB = getTeam(match.teamBId || '');
    const isAWinner = match.winnerId ? match.winnerId === match.teamAId : (match.probA || 50) >= (match.probB || 50);
    const isCompleted = match.status === 'completed';
    const isPlaceholder = !teamA || !teamB;
    const isHighlighted = match.teamAId === 'por' && match.teamBId === 'esp';

    return (
      <Link
        key={match.id}
        href={`/simulator?home=${teamA?.id || match.projectedWinnerId || 'esp'}&away=${teamB?.id || 'eng'}`}
        className={`bg-white p-3 rounded-2xl border transition-all duration-200 block relative group ${
          isHighlighted ? 'border-blue-400 bg-blue-50/20 shadow-md hover:-translate-y-0.5' :
          isCompleted ? 'border-emerald-300/80 bg-white shadow-sm hover:border-emerald-400 hover:-translate-y-0.5' :
          isPlaceholder ? 'border-dashed border-amber-300/80 bg-amber-50/10 hover:border-amber-400 hover:bg-amber-50/20 hover:-translate-y-0.5' :
          'border-slate-200/80 hover:border-indigo-400 shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        {/* Left connector line from previous round */}
        {match.round !== '16_besar' && (
          <div className="hidden lg:flex items-center absolute -left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="w-4 h-[2px] bg-slate-300 group-hover:bg-indigo-500 transition-colors" />
          </div>
        )}

        {/* Header Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-1.5 mb-1.5 border-b border-slate-100">
          <span className="font-bold text-slate-700">
            {match.round === '16_besar' ? `M#${match.matchNumber} • 16 Besar` :
             match.round === 'quarter_final' ? `QF#${match.matchNumber - 8} • 8 Besar` :
             match.round === 'semi_final' ? `SF#${match.matchNumber - 12} • Semifinal` :
             `🏆 PARTAI FINAL`}
          </span>
          {isCompleted ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px]">FT {match.score}</span>
          ) : isPlaceholder ? (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold text-[10px] italic flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>WAITING</span>
            </span>
          ) : (
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold text-[10px]">READY</span>
          )}
        </div>

        {/* Team Rows Container */}
        <div className="space-y-1">
          {/* Team A */}
          <div className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-mono transition-colors ${
            isCompleted && match.winnerId === match.teamAId ? 'bg-emerald-50/80 text-emerald-950 font-bold border-l-2 border-emerald-500' :
            !isPlaceholder && isAWinner ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
          }`}>
            <div className="flex items-center gap-2 truncate pr-2">
              {teamA ? (
                <>
                  <TeamFlag isoCode={teamA.isoCode || teamA.id} name={teamA.name} size="sm" />
                  <span className="truncate">{teamA.name}</span>
                </>
              ) : (
                <>
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-bold shrink-0">?</span>
                  <span className="text-amber-700/90 italic truncate">{match.teamAName || '[?] Placeholder'}</span>
                </>
              )}
            </div>
            <span className={`font-bold shrink-0 ${
              isCompleted && match.winnerId === match.teamAId ? 'text-emerald-700' : 'text-slate-400'
            }`}>
              {isCompleted && match.winnerId === match.teamAId ? '🏆' : match.probA ? `${match.probA}%` : '-'}
            </span>
          </div>

          {/* Team B */}
          <div className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-mono transition-colors ${
            isCompleted && match.winnerId === match.teamBId ? 'bg-emerald-50/80 text-emerald-950 font-bold border-l-2 border-emerald-500' :
            !isPlaceholder && !isAWinner ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
          }`}>
            <div className="flex items-center gap-2 truncate pr-2">
              {teamB ? (
                <>
                  <TeamFlag isoCode={teamB.isoCode || teamB.id} name={teamB.name} size="sm" />
                  <span className="truncate">{teamB.name}</span>
                </>
              ) : (
                <>
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-bold shrink-0">?</span>
                  <span className="text-amber-700/90 italic truncate">{match.teamBName || '[?] Placeholder'}</span>
                </>
              )}
            </div>
            <span className={`font-bold shrink-0 ${
              isCompleted && match.winnerId === match.teamBId ? 'text-emerald-700' : 'text-slate-400'
            }`}>
              {isCompleted && match.winnerId === match.teamBId ? '🏆' : match.probB ? `${match.probB}%` : '-'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 mt-1 border-t border-slate-100">
          <span className="truncate pr-2">
            {isCompleted ? (
              <span className="text-emerald-700 font-medium">Lolos: {getTeam(match.winnerId!)?.name || match.winnerId}</span>
            ) : isPlaceholder ? (
              <span className="text-amber-600 italic">Proyeksi: {getTeam(match.projectedWinnerId!)?.name || '---'}</span>
            ) : (
              <span>Unggulan: <strong className="text-indigo-600">{getTeam(match.projectedWinnerId!)?.name}</strong></span>
            )}
          </span>
          <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform font-bold shrink-0">
            ➔
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold tracking-wide">
            <TreeStructure className="w-3.5 h-3.5" />
            <span>MONTE CARLO SIMULATOR — 10,000 ITERATIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            10,000 Iteration Knockout Bracket
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Mensimulasikan alur turnamen 16 besar hingga final Piala Dunia 2026 ribuan kali. Menghitung probabilitas juara tiap kesebelasan sekaligus mendeteksi disparitas nilai (*Value Gap*) terhadap odds pasar.
          </p>
        </div>

        {/* Right Control Panel - Neatly Organized */}
        <div className="flex flex-col gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0 w-full lg:w-auto">
          
          {/* 1. Mode Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Pilih Fase Turnamen &amp; Kalkulasi:
            </span>
            <div className="grid grid-cols-2 bg-slate-200/70 p-1 rounded-xl gap-1">
              <button
                onClick={() => {
                  if (!useLiveLock) {
                    setUseLiveLock(true);
                    handleRunSimulation(iterations, true);
                  }
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  useLiveLock
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Lightning weight="fill" className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">🔥 8 Besar (Live Lock)</span>
              </button>
              <button
                onClick={() => {
                  if (useLiveLock) {
                    setUseLiveLock(false);
                    handleRunSimulation(iterations, false);
                  }
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  !useLiveLock
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span className="truncate">🌐 16 Besar (Hipotesis)</span>
              </button>
            </div>
          </div>

          {/* 2. Simulation Runs & Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-200/60">
            <div className="flex items-center justify-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              {[1000, 10000, 50000].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setIterations(n);
                    handleRunSimulation(n, useLiveLock);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    iterations === n ? 'bg-slate-900 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {n >= 1000 ? `${n / 1000}k` : n} Runs
                </button>
              ))}
            </div>

            <button
              onClick={() => handleRunSimulation(iterations, useLiveLock)}
              disabled={isSimulating}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs font-mono shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <ArrowCounterClockwise className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Menghitung...' : 'Jalankan Ulang'}</span>
            </button>
          </div>
        </div>
      </div>

      {lastRunTime > 0 && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-mono font-bold text-slate-700">Simulasi selesai dalam <strong className="text-slate-900">{lastRunTime} milidetik</strong> ({iterations.toLocaleString('id-ID')} iterasi bracket).</span>
          </div>
          <span className="text-indigo-600 font-bold">16 Tim • 15 Laga Knockout</span>
        </div>
      )}

      {/* CHAMPIONSHIP ODDS LEADERBOARD TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>Distribusi Probabilitas Juara Dunia &amp; Pencapaian Babak</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Diurutkan berdasarkan persentase mengangkat trofi Piala Dunia 2026 dari hasil Monte Carlo.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
            <TrendUp className="w-4 h-4" />
            <span>Value Diff = Model Prob − Implied Odds Pasar</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-600 font-bold">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Tim &amp; Negara</th>
                <th className="py-3 px-4 text-center">Elo Rating</th>
                <th className="py-3 px-4 text-right">8 Besar (QF)</th>
                <th className="py-3 px-4 text-right">Semifinal (SF)</th>
                <th className="py-3 px-4 text-right">Final</th>
                <th className="py-3 px-4 text-right text-amber-700 font-extrabold">Juara Dunia 🏆</th>
                <th className="py-3 px-4 text-right">Implied Odds</th>
                <th className="py-3 px-4 text-right">Value Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-mono">
              {stats.map((s, idx) => {
                const team = getTeam(s.teamId);
                if (!team) return null;
                const isPositiveValue = (s.valueDiff || 0) > 2.0;
                const isNegativeValue = (s.valueDiff || 0) < -2.0;

                return (
                  <tr 
                    key={s.teamId} 
                    className={`hover:bg-slate-50 transition-colors ${
                      idx === 0 ? 'bg-amber-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-500">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link href={`/simulator?home=${team.id}`} className="flex items-center gap-2.5 group">
                        <TeamFlag isoCode={team.isoCode || team.id} name={team.name} size="md" />
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {team.name}
                          </span>
                          <span className="block text-[10px] text-slate-500">Grup {team.group}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-700 font-bold">
                      {team.elo}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      {s.quarterFinalProb === 0 && useLiveLock ? (
                        <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">❌ GUGUR</span>
                      ) : s.quarterFinalProb === 100 && useLiveLock ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">✅ 100% LOLOS</span>
                      ) : (
                        <span className="text-slate-700">{s.quarterFinalProb}%</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 font-mono">
                      {s.quarterFinalProb === 0 && useLiveLock ? "-" : `${s.semiFinalProb}%`}
                    </td>
                    <td className="py-3.5 px-4 text-right text-blue-600 font-bold font-mono">
                      {s.quarterFinalProb === 0 && useLiveLock ? "-" : `${s.finalProb}%`}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-base text-amber-600 font-mono">
                      {s.quarterFinalProb === 0 && useLiveLock ? "0.0%" : `${s.championProb}%`}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {s.impliedMarketProb}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        isPositiveValue ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isNegativeValue ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'text-slate-500 bg-slate-50 border border-slate-200'
                      }`}>
                        {s.valueDiff! > 0 ? `+${s.valueDiff}%` : `${s.valueDiff}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* INTERACTIVE TOURNAMENT KNOCKOUT DATA TREE */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold mb-2">
              <TreeStructure className="w-4 h-4" />
              <span>DYNAMIC TOURNAMENT DATA TREE (16 BESAR ➔ FINAL)</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
              <span>Bagan Struktur Data Tree Piala Dunia 2026</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Sistem placeholder dinamis: Setiap laga yang selesai otomatis mengisi slot negara di babak berikutnya secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-300">Selesai FT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span className="text-slate-300">Siap Main</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse inline-block"></span>
              <span className="text-slate-300">Placeholder Menunggu</span>
            </div>
          </div>
        </div>

        {/* 4-Column Connected Tree Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start relative">
          
          {/* COLUMN 1: 16 BESAR */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-indigo-200 p-3 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between font-mono text-xs font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>16 BESAR (8 LAGA)</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">5-8 Juli</span>
            </div>
            
            {/* Paired match containers with right bracket borders */}
            <div className="space-y-6">
              {(() => {
                const r16 = bracketPreview.filter(m => m.round === '16_besar');
                const pairs = [];
                for (let i = 0; i < r16.length; i += 2) {
                  pairs.push(r16.slice(i, i + 2));
                }
                return pairs.map((pair, idx) => (
                  <div key={idx} className="relative border-r-2 border-slate-200/80 pr-3 -mr-3 py-1 space-y-3">
                    {pair.map(match => match && renderTreeCard(match))}
                    {/* Horizontal stem pointing right to Kolom 2 */}
                    <div className="hidden lg:flex items-center absolute -right-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <div className="w-6 h-[2px] bg-slate-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 -ml-1 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* COLUMN 2: 8 BESAR (QF) */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-blue-200 p-3 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between font-mono text-xs font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>8 BESAR / QF (4 LAGA)</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">9-11 Juli</span>
            </div>
            
            <div className="space-y-10 lg:pt-4">
              {(() => {
                const qf = bracketPreview.filter(m => m.round === 'quarter_final');
                const pairs = [];
                for (let i = 0; i < qf.length; i += 2) {
                  pairs.push(qf.slice(i, i + 2));
                }
                return pairs.map((pair, idx) => (
                  <div key={idx} className="relative border-r-2 border-slate-200/80 pr-3 -mr-3 py-1 space-y-6">
                    {pair.map(match => match && renderTreeCard(match))}
                    {/* Horizontal stem pointing right to Kolom 3 */}
                    <div className="hidden lg:flex items-center absolute -right-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <div className="w-6 h-[2px] bg-slate-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 -ml-1 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* COLUMN 3: SEMIFINAL */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-purple-200 p-3 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between font-mono text-xs font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>SEMIFINAL (2 LAGA)</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">14-15 Juli</span>
            </div>
            
            <div className="lg:pt-16">
              {(() => {
                const sf = bracketPreview.filter(m => m.round === 'semi_final');
                return (
                  <div className="relative border-r-2 border-slate-200/80 pr-3 -mr-3 py-1 space-y-16">
                    {sf.map(match => renderTreeCard(match))}
                    {/* Horizontal stem pointing right to Kolom 4 */}
                    <div className="hidden lg:flex items-center absolute -right-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <div className="w-6 h-[2px] bg-slate-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 -ml-1 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* COLUMN 4: FINAL & JUARA DUNIA */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-amber-200 p-3 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between font-mono text-xs font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>PARTAI FINAL 🏆</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">19 Juli</span>
            </div>
            
            <div className="space-y-6 lg:pt-32">
              {bracketPreview.filter(m => m.round === 'final').map(match => renderTreeCard(match))}

              {/* Champion Trophy Banner (Minimalist & Dynamic) */}
              {(() => {
                const finalMatch = bracketPreview.find(m => m.round === 'final');
                const champId = finalMatch?.winnerId || finalMatch?.projectedWinnerId;
                const champTeam = getTeam(champId || '');
                return (
                  <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white p-5 rounded-2xl shadow-xl border border-amber-300/50 text-center space-y-2 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md shadow-inner text-xl">
                      🏆
                    </div>
                    <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-100">
                      PROYEKSI JUARA DUNIA 2026
                    </div>
                    {champTeam ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <TeamFlag isoCode={champTeam.isoCode || champTeam.id} name={champTeam.name} size="md" />
                          <span className="text-xl font-black tracking-tight">{champTeam.name}</span>
                        </div>
                        <div className="text-[10px] font-mono font-semibold bg-black/20 py-1 px-3 rounded-full inline-block mt-1">
                          Elo: {champTeam.elo} | xG: {champTeam.xgAttack}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-mono font-bold bg-black/20 py-2 px-3 rounded-lg border border-white/20 italic">
                        [🏆?] Menunggu Pemenang Final
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
