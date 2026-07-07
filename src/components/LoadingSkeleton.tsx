import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'kpi' | 'table' | 'card' | 'full';
  rows?: number;
}

export default function LoadingSkeleton({ variant = 'full', rows = 5 }: LoadingSkeletonProps) {
  if (variant === 'kpi') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
              <div className="h-5 bg-slate-100 rounded-md w-1/4"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-lg w-3/4 my-2"></div>
            <div className="h-3 bg-slate-100 rounded w-4/5"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-2 w-full sm:w-1/2">
            <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="h-9 bg-slate-100 rounded-xl w-36"></div>
        </div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
          {Array.from({ length: rows }).map((_, idx) => (
            <div key={idx} className="h-16 bg-slate-50 border border-slate-100 rounded-xl w-full flex items-center justify-between px-4 gap-4">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                <div className="space-y-1.5 w-full">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-1/6 hidden sm:block"></div>
              <div className="h-6 bg-slate-200 rounded-md w-16"></div>
              <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  // default 'full' variant
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
              <div className="h-5 bg-slate-100 rounded-md w-1/4"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-lg w-3/4 my-2"></div>
            <div className="h-3 bg-slate-100 rounded w-4/5"></div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-2 w-full sm:w-1/2">
            <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="h-9 bg-slate-100 rounded-xl w-36"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, idx) => (
            <div key={idx} className="h-16 bg-slate-50 border border-slate-100 rounded-xl w-full flex items-center justify-between px-4 gap-4">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                <div className="space-y-1.5 w-full">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-1/6 hidden sm:block"></div>
              <div className="h-6 bg-slate-200 rounded-md w-16"></div>
              <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
