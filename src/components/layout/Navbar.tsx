'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  SoccerBall, 
  Cpu, 
  TreeStructure, 
  TrendUp, 
  FileText, 
  CheckCircle, 
  List, 
  X, 
  Sparkle,
  CaretDown,
  ChartBar
} from '@phosphor-icons/react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainNav = [
    { name: 'Beranda', href: '/', icon: SoccerBall },
    { name: 'Simulator', href: '/simulator', icon: Cpu },
    { name: 'Bracket', href: '/bracket', icon: TreeStructure },
  ];

  const analyticsNav = [
    { name: 'Moneyball Index', href: '/moneyball', icon: TrendUp, desc: 'Sabermetrics & Undervalued Teams' },
    { name: 'Pre-Match Reports', href: '/reports', icon: FileText, desc: 'Betting Tiers & Analisis Taktikal' },
    { name: 'Accuracy Tracker', href: '/tracker', icon: CheckCircle, desc: 'Brier Score & Audit Real-Time' },
  ];

  const isAnalyticsActive = analyticsNav.some(item => pathname === item.href);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo - Sleek & Simple */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <Sparkle weight="fill" className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-none">
                  WorldCup Predictor
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-wider block mt-1">
                  ● LIVE 2026 ENGINE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Simplified to 4 Items */}
          <div className="hidden md:flex items-center space-x-1.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Analitik Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                  isAnalyticsActive || dropdownOpen
                    ? 'bg-slate-100 text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ChartBar className={`w-4 h-4 ${isAnalyticsActive || dropdownOpen ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Analisis</span>
                <CaretDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-slate-200 py-2 animate-fadeIn z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Fitur Eksplorasi Data
                  </div>
                  {analyticsNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-start space-x-3 px-3.5 py-2.5 mx-1 rounded-xl transition-colors ${
                          isActive ? 'bg-blue-50/60 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div>
                          <span className="text-sm font-bold block">{item.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono block mt-0.5 leading-tight">{item.desc}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Simplified & Clean */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-1 animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>LIVE TURNAMEN: BRACKET WC 2026</span>
          </div>

          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
            Navigasi Utama
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-base font-semibold ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1 flex items-center gap-1.5">
            <ChartBar className="w-3.5 h-3.5 text-blue-500" />
            <span>Analisis &amp; Laporan</span>
          </div>
          {analyticsNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-base font-semibold ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
