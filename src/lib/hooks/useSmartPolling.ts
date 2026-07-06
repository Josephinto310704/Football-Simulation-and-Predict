'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { LiveMatchData } from '@/types';

export interface SmartPollingState {
  mode: 'IN_PLAY' | 'PRE_MATCH_SOON' | 'PRE_MATCH_FAR' | 'POST_MATCH_LOCKED' | 'UNKNOWN';
  revalidateSeconds: number;
  nextPollIntervalMs: number | null;
  statusExplanation: string;
  lastSync: string;
  isPolling: boolean;
}

export function useSmartPolling(onDataReceived?: (matches: LiveMatchData[]) => void) {
  const [pollingState, setPollingState] = useState<SmartPollingState>({
    mode: 'UNKNOWN',
    revalidateSeconds: 300,
    nextPollIntervalMs: null,
    statusExplanation: 'Menyiapkan sistem Smart Polling...',
    lastSync: '',
    isPolling: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLiveData = useCallback(async () => {
    try {
      setPollingState(prev => ({ ...prev, isPolling: true }));
      const res = await fetch('/api/live-data', { cache: 'no-store' }); // Get latest cache evaluation from server
      const json = await res.json();

      if (json && json.smartPolling) {
        setPollingState({
          mode: json.smartPolling.mode,
          revalidateSeconds: json.smartPolling.revalidateSeconds,
          nextPollIntervalMs: json.smartPolling.nextPollIntervalMs,
          statusExplanation: json.smartPolling.statusExplanation,
          lastSync: new Date().toLocaleTimeString('id-ID'),
          isPolling: false,
        });

        if (onDataReceived && Array.isArray(json.matches)) {
          onDataReceived(json.matches);
        }

        // Schedule next poll based on Smart Polling logic
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (json.smartPolling.nextPollIntervalMs !== null && json.smartPolling.nextPollIntervalMs > 0) {
          timeoutRef.current = setTimeout(() => {
            fetchLiveData();
          }, json.smartPolling.nextPollIntervalMs);
        }
      }
    } catch (err) {
      setPollingState(prev => ({
        ...prev,
        isPolling: false,
        statusExplanation: '⚠️ Polling terputus sementara. Akan mencoba kembali...',
      }));
    }
  }, [onDataReceived]);

  useEffect(() => {
    fetchLiveData();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fetchLiveData]);

  return { pollingState, manualRefresh: fetchLiveData };
}
