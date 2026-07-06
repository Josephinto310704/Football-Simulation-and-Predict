'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendUp, 
  Sparkle, 
  Lightning, 
  ShieldWarning, 
  Info, 
  ArrowRight, 
  Target, 
  ChartBar, 
  Funnel,
  CheckCircle,
  Warning
} from '@phosphor-icons/react';
import { TEAMS } from '@/lib/data/teams';
import { calculateMoneyballMetrics } from '@/lib/engine/moneyball';
import { Team } from '@/types';
import TeamFlag from '@/components/TeamFlag';

export default function MoneyballPage() {
  const [filter, setFilter] = useState<'all' | 'undervalued' | 'fair' | 'overvalued'>('all');
  const [selectedTeam, setSelectedTeam] = useState<Team>(TEAMS[8]); // Default Uruguay (undervalued gem)

  // Sort teams by highest Moneyball score
  const sortedTeams = [...TEAMS].sort((a, b) => (b.moneyballScore || 0) - (a.moneyballScore || 0));

  const filteredTeams = sortedTeams.filter(t => {
    if (filter === 'all') return true;
    return t.valuationStatus === filter;
  });

  const selectedMetrics = calculateMoneyballMetrics(selectedTeam);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold tracking-wide">
            <TrendUp className="w-3.5 h-3.5" />
            <span>SABERMETRICS VALUATION ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Moneyball Score &amp; Undervalued Index
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Diadaptasi dari filosofi Billy Beane: menemukan nilai tersembunyi lewat statistik lanjutan yang kurang diperhatikan pasar taruhan dan opini publik (<strong className="text-emerald-700 font-semibold">PPDA Pressing</strong>, <strong className="text-blue-700 font-semibold">Progressive Passes</strong>, <strong className="text-amber-700 font-semibold">Shot Quality</strong>, dan <strong className="text-indigo-700 font-semibold">Set-Piece Efficiency</strong>).
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          {[
            { id: 'all', label: 'Semua Tim (16)' },
            { id: 'undervalued', label: '★ Undervalued Gems' },
            { id: 'fair', label: 'Fair Value' },
            { id: 'overvalued', label: 'Overvalued' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                filter === tab.id
                  ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SELECTED TEAM SABERMETRIC SPOTLIGHT CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center space-x-4">
            <TeamFlag isoCode={selectedTeam.isoCode || selectedTeam.id} name={selectedTeam.name} size="2xl" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{selectedTeam.name}</h2>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                  selectedTeam.valuationStatus === 'undervalued' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  selectedTeam.valuationStatus === 'overvalued' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {selectedTeam.valuationStatus?.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Grup {selectedTeam.group} • Elo Rating: {selectedTeam.elo} • FIFA Rank: #{selectedTeam.fifaRank}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono block font-semibold">MONEYBALL SCORE</span>
              <span className="text-2xl font-extrabold text-emerald-700 font-mono">{selectedTeam.moneyballScore}/100</span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono block font-semibold">BANDAR REPUTATION</span>
              <span className="text-2xl font-extrabold text-slate-700 font-mono">{selectedTeam.marketReputation}/100</span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono block font-semibold">VALUE GAP</span>
              <span className={`text-2xl font-extrabold font-mono ${
                (selectedTeam.moneyballScore! - selectedTeam.marketReputation) > 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {(selectedTeam.moneyballScore! - selectedTeam.marketReputation) > 0 ? `+${selectedTeam.moneyballScore! - selectedTeam.marketReputation}` : `${selectedTeam.moneyballScore! - selectedTeam.marketReputation}`}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Sabermetric Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-500 font-semibold">
              <span>PRESSING INTENSITY</span>
              <span className="text-emerald-700 font-bold">{selectedMetrics.breakdown.pressingScore}/100</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {selectedTeam.ppda} PPDA
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div style={{ width: `${selectedMetrics.breakdown.pressingScore}%` }} className="bg-emerald-600 h-full transition-all duration-700" />
            </div>
            <p className="text-[11px] text-slate-600">
              {selectedTeam.ppda < 9.5 ? 'Pressing ultra-agresif memicu turnover cepat di wilayah lawan.' : 'Pressing seimbang dengan disiplin bentuk formasi bertahan.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-500 font-semibold">
              <span>BUILD-UP PROGRESSION</span>
              <span className="text-blue-700 font-bold">{selectedMetrics.breakdown.buildupScore}/100</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {selectedTeam.progPasses} Pass/90m
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div style={{ width: `${selectedMetrics.breakdown.buildupScore}%` }} className="bg-blue-600 h-full transition-all duration-700" />
            </div>
            <p className="text-[11px] text-slate-600">
              {selectedTeam.progPasses > 55 ? 'Kapasitas sirkulasi dan progresi bola melewati lini tengah atas rata-rata.' : 'Aliran bola langsung dengan ketergantungan pada transisi vertikal.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-500 font-semibold">
              <span>SHOT QUALITY (xG/Shot)</span>
              <span className="text-amber-700 font-bold">{selectedMetrics.breakdown.shotQualityScore}/100</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {selectedTeam.shotQuality} xG/shot
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div style={{ width: `${selectedMetrics.breakdown.shotQualityScore}%` }} className="bg-amber-600 h-full transition-all duration-700" />
            </div>
            <p className="text-[11px] text-slate-600">
              {selectedTeam.shotQuality > 0.13 ? 'Kreasi peluang tembakan murni dengan probabilitas konversi gol tinggi.' : 'Volume tembakan tinggi namun didominasi dari spekulasi luar kotak penalti.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-500 font-semibold">
              <span>SET-PIECE CONVERSION</span>
              <span className="text-indigo-700 font-bold">{selectedMetrics.breakdown.setPieceScore}/100</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {selectedTeam.setPieceEfficiency}% Rating
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div style={{ width: `${selectedMetrics.breakdown.setPieceScore}%` }} className="bg-indigo-600 h-full transition-all duration-700" />
            </div>
            <p className="text-[11px] text-slate-600">
              {selectedTeam.setPieceEfficiency > 79 ? 'Ancaman mematikan dalam eksekusi corner kick dan tendangan bebas langsung.' : 'Efektivitas standar dalam skema bola mati ofensif.'}
            </p>
          </div>
        </div>

        {/* Factual Commentary */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 leading-relaxed font-mono flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-800 uppercase tracking-wider block mb-1 font-bold">Analisis Sabermetrics &amp; Pasar Taruhan:</strong>
            {selectedTeam.valuationStatus === 'undervalued' ? (
              <span>
                <strong>{selectedTeam.name}</strong> teridentifikasi sebagai <span className="text-emerald-700 font-bold">Undervalued Gem (+{selectedTeam.moneyballScore! - selectedTeam.marketReputation} poin vs ekspektasi bandar)</span>. Pasar taruhan publik cenderung meremehkan tim ini karena nama besar atau ranking FIFA historis, padahal metrik tekanan defensif PPDA ({selectedTeam.ppda}) dan kualitas peluang murni mereka membuktikan performa di lapangan jauh melampaui odds yang ditawarkan.
              </span>
            ) : selectedTeam.valuationStatus === 'overvalued' ? (
              <span>
                <strong>{selectedTeam.name}</strong> terdeteksi <span className="text-rose-700 font-bold">Overvalued ({selectedTeam.moneyballScore! - selectedTeam.marketReputation} poin di bawah ekspektasi pasar)</span>. Odds bandar terlalu mengunggulkan tim ini berdasarkan reputasi tradisional, padahal efisiensi build-up dan shot quality mereka menunjukkan kerentanan saat menghadapi lawan dengan disiplin taktik tinggi di fase gugur.
              </span>
            ) : (
              <span>
                <strong>{selectedTeam.name}</strong> memiliki nilai pasar yang <span className="text-slate-700 font-bold">Fair (Seimbang dengan performa riil)</span>. Odds yang ditawarkan oleh bandar maupun model matematika berada dalam rentang kesesuaian yang presisi.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MONEYBALL RANKING TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ChartBar className="w-5 h-5 text-emerald-600" />
              <span>Tabel Peringkat Sabermetrics 16 Besar Piala Dunia 2026</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Klik pada baris tim manapun untuk menyoroti breakdown 4 pilar metrik sabermetrics di atas.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-600 font-bold">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Tim &amp; Negara</th>
                <th className="py-3 px-4 text-center">Status Value</th>
                <th className="py-3 px-4 text-right">Moneyball Score</th>
                <th className="py-3 px-4 text-right">Bandar Rep</th>
                <th className="py-3 px-4 text-right">Value Gap</th>
                <th className="py-3 px-4 text-right">PPDA (Press)</th>
                <th className="py-3 px-4 text-right">Prog. Passes</th>
                <th className="py-3 px-4 text-right">Set-Piece %</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-mono">
              {filteredTeams.map((t, idx) => {
                const diff = (t.moneyballScore || 0) - t.marketReputation;
                const isSelected = selectedTeam.id === t.id;
                
                return (
                  <tr 
                    key={t.id} 
                    onClick={() => setSelectedTeam(t)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/60 border-l-4 border-l-emerald-500 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-500">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <TeamFlag isoCode={t.isoCode || t.id} name={t.name} size="md" />
                        <div>
                          <span className="font-bold text-slate-900">
                            {t.name}
                          </span>
                          <span className="block text-[10px] text-slate-500">Grup {t.group}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        t.valuationStatus === 'undervalued' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        t.valuationStatus === 'overvalued' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {t.valuationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700 text-base">
                      {t.moneyballScore}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700">
                      {t.marketReputation}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        diff > 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : diff < 0 ? 'text-rose-700 bg-rose-50 border border-rose-200' : 'text-slate-600 bg-slate-100'
                      }`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-blue-700 font-bold">
                      {t.ppda}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700">
                      {t.progPasses}
                    </td>
                    <td className="py-3.5 px-4 text-right text-indigo-700 font-bold">
                      {t.setPieceEfficiency}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link 
                        href={`/simulator?home=${t.id}`}
                        onClick={(e) => e.stopPropagation()} 
                        className="px-3 py-1 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white text-xs text-slate-700 font-mono transition-colors inline-block font-semibold"
                      >
                        Simulasi
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
