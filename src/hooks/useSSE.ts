import { useState, useEffect, useRef, useCallback } from 'react';
import { AgentLog } from '../types';
import { pipelineService } from '../services/pipeline.service';
import { API_BASE_URL } from '../services/api';

export const useSSE = (sessionId: string | null) => {
  const [events, setEvents] = useState<AgentLog[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const checkStatusFallback = useCallback(async (sessionId: string) => {
    try {
      const res = await pipelineService.getPipelineStatus(sessionId);
      if (res.success && res.data) {
        const session = res.data;
        if (Array.isArray(session.agentLogs) && session.agentLogs.length > 0) {
          setEvents(session.agentLogs);
        }
        if (session.status === 'completed') {
          stopPolling();
          setStatus('completed');
          setIsConnected(false);
          return true;
        } else if (session.status === 'failed') {
          stopPolling();
          setStatus('failed');
          setIsConnected(false);
          return true;
        }
      }
    } catch (e) {
      console.error('Fallback status check error:', e);
    }
    return false;
  }, []);

  const startFallbackPolling = useCallback((sessionId: string) => {
    stopPolling();
    let attempts = 0;
    const maxAttempts = 100; // 100 * 3s = 300s timeout limit

    pollIntervalRef.current = setInterval(async () => {
      attempts += 1;
      const done = await checkStatusFallback(sessionId);
      if (done) {
        stopPolling();
      } else if (attempts >= maxAttempts) {
        stopPolling();
        setStatus('failed');
        setIsConnected(false);
      }
    }, 3000);
  }, [checkStatusFallback]);

  const processStream = useCallback(async (sessionId: string, signal?: AbortSignal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pipeline/stream/${sessionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        signal,
      });

      if (!response.ok) {
        throw new Error(`SSE connection failed: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      setIsConnected(true);
      setStatus('running');

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (!data) continue;

            try {
              const parsedData = JSON.parse(data);
              
              if (!parsedData.agentName && (parsedData.status === 'completed' || parsedData.status === 'failed')) {
                stopPolling();
                setStatus(parsedData.status);
                setIsConnected(false);
                return;
              } else if (parsedData.agentName) {
                setEvents((prev) => {
                  const exists = prev.some(
                    (e) => e.agentName === parsedData.agentName && e.status === parsedData.status
                  );
                  return exists ? prev : [...prev, parsedData];
                });
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }

      // Stream ended without explicit completion event — check DB status
      const isDone = await checkStatusFallback(sessionId);
      if (!isDone) {
        startFallbackPolling(sessionId);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.warn('SSE stream interrupted, switching to status polling:', error);
      setIsConnected(false);
      const isDone = await checkStatusFallback(sessionId);
      if (!isDone) {
        startFallbackPolling(sessionId);
      }
    }
  }, [checkStatusFallback, startFallbackPolling]);

  useEffect(() => {
    if (!sessionId) return;

    setStatus('running');
    abortControllerRef.current = new AbortController();
    processStream(sessionId, abortControllerRef.current.signal);

    return () => {
      stopPolling();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (readerRef.current) {
        readerRef.current.cancel();
      }
      setIsConnected(false);
    };
  }, [sessionId, processStream]);

  return { events, status, isConnected };
};