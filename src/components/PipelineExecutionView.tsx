import React, { useEffect, useState, useRef, useCallback } from 'react';
import { UserProfile, PipelineStage, AgentLog } from '../types';
import { useSSE } from '../hooks/useSSE';
import { pipelineService } from '../services/pipeline.service';

interface PipelineExecutionViewProps {
  userProfile: UserProfile;
  sessionId: string;
  onPipelineComplete: (projects: any[]) => void;
  onRetry?: () => void;
  onViewResults?: () => void;
}

const STAGE_ORDER = ['scout', 'clustering', 'match', 'validator', 'architect'];

const STAGE_CONFIG: Record<string, { name: string; description: string; id: number }> = {
  scout: { id: 1, name: 'Scout Agent', description: 'Scraping Reddit & GitHub for real developer pain points' },
  clustering: { id: 2, name: 'Clustering Agent', description: 'Grouping pain points into semantic clusters via embeddings' },
  match: { id: 3, name: 'Match Agent', description: 'Scoring clusters against your tech stack & goals' },
  validator: { id: 4, name: 'Validator Agent', description: 'Checking for existing solutions & market saturation' },
  architect: { id: 5, name: 'Architect Agent', description: 'Generating full project specs & week-by-week roadmaps' },
};

export const PipelineExecutionView: React.FC<PipelineExecutionViewProps> = ({
  userProfile,
  sessionId,
  onPipelineComplete,
  onRetry,
  onViewResults,
}) => {
  const [stages, setStages] = useState<PipelineStage[]>(() =>
    STAGE_ORDER.map((key) => ({
      id: STAGE_CONFIG[key].id,
      name: STAGE_CONFIG[key].name,
      description: STAGE_CONFIG[key].description,
      status: 'idle' as const,
      progress: 0,
      logs: [],
    }))
  );
  const [logs, setLogs] = useState<string[]>([
    `[00:00.00] BUILDPATH PIPELINE INITIALIZED`,
    `[00:00.05] TARGET STACK: ${userProfile.techStack.join(', ') || 'Not specified'}`,
    `[00:00.10] DISPATCHING AUTONOMOUS AGENTS...`
  ]);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const stageStartTimes = useRef<Record<string, number>>({});

  const { events, status, isConnected } = useSSE(sessionId);

  const formatTime = (ms: number) => {
    const secs = (ms / 1000).toFixed(2);
    return `[${secs.padStart(6, '0')}]`;
  };

  const getStageIndex = (agentName: string) => {
    const normalized = agentName.toLowerCase().replace('-agent', '').replace('cluster', 'clustering');
    return STAGE_ORDER.indexOf(normalized);
  };

  const updateStageFromEvent = useCallback((event: AgentLog) => {
    const stageIdx = getStageIndex(event.agentName);
    if (stageIdx === -1) return;

    const now = Date.now();
    const startTime = stageStartTimes.current[event.agentName] || now;
    const elapsed = now - startTime;

    setStages((prev) =>
      prev.map((s, idx) => {
        if (idx === stageIdx) {
          if (event.status === 'running') {
            if (!stageStartTimes.current[event.agentName]) {
              stageStartTimes.current[event.agentName] = now;
            }
            return { ...s, status: 'running' as const, progress: Math.min(30 + (elapsed / 100), 90) };
          }
          if (event.status === 'completed') {
            return { ...s, status: 'completed' as const, progress: 100 };
          }
          if (event.status === 'failed') {
            return { ...s, status: 'failed' as const, progress: 0 };
          }
        }
        if (idx === stageIdx + 1 && event.status === 'completed') {
          return { ...s, status: 'running' as const, progress: 10 };
        }
        return s;
      })
    );

    setLogs((prev) => [
      ...prev,
      `${formatTime(elapsed)} [${STAGE_CONFIG[STAGE_ORDER[stageIdx]]?.name || event.agentName}] ${event.message}`,
    ]);
  }, []);

  useEffect(() => {
    events.forEach(updateStageFromEvent);
  }, [events, updateStageFromEvent]);

  useEffect(() => {
    if (status === 'completed' && !isFinished) {
      setIsFinished(true);
      setStages((prev) => prev.map((s) => ({ ...s, status: 'completed' as const, progress: 100 })));
      setLogs((prev) => [...prev, `${formatTime(Date.now())} PIPELINE EXECUTION COMPLETE!`]);
      
      const fetchResultsWithRetry = async (retries = 3) => {
        try {
          const response = await pipelineService.getPipelineResults(sessionId);
          if (response.success && Array.isArray(response.data) && response.data.length > 0) {
            onPipelineComplete(response.data);
          } else if (retries > 0) {
            setTimeout(() => fetchResultsWithRetry(retries - 1), 1500);
          }
        } catch (err: any) {
          if (retries > 0) {
            setTimeout(() => fetchResultsWithRetry(retries - 1), 1500);
          } else {
            setError('Failed to fetch results: ' + (err.response?.data?.message || err.message));
          }
        }
      };

      fetchResultsWithRetry();
    } else if (status === 'failed') {
      setError('Pipeline execution failed');
      setStages((prev) => prev.map((s) => s.status === 'running' ? { ...s, status: 'failed' as const } : s));
    }
  }, [status, isFinished, sessionId, onPipelineComplete]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const totalProgress = Math.round((completedCount / stages.length) * 100);

  const currentStageIdx = stages.findIndex((s) => s.status === 'running');
  const displayStage = currentStageIdx !== -1 ? currentStageIdx : completedCount;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* Header */}
      <div className="text-center mb-8 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 border border-[#0057ff] bg-[#0057ff]/10 px-3.5 py-1 text-xs font-mono font-bold text-[#0057ff] mb-3 uppercase tracking-widest">
          <span className="material-symbols-outlined text-base">memory</span>
          BUILDPATH AGENT PIPELINE IN EXECUTION
        </div>
        <h1 className="font-syne text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
          Executing <span className="text-transparent stroke-white">Pipeline</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-white/70 max-w-xl mx-auto font-space leading-relaxed">
          5 autonomous AI agents are scanning live developer threads to compute compatibility vectors for your portfolio.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="border border-white/10 bg-white/[0.02] p-5 mb-8">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
          <span className="flex items-center gap-2">
            <span className={`h-2 w-2 ${isFinished ? 'bg-emerald-400' : isConnected ? 'bg-[#0057ff] animate-ping' : 'bg-amber-500'}`}></span>
            Pipeline Status: {isFinished ? 'COMPLETED (100%)' : isConnected ? `STAGE 0${displayStage + 1}/05 IN PROGRESS` : 'CONNECTING...'}
          </span>
          <span className="text-[#0057ff] font-bold tabular-nums">{totalProgress}%</span>
        </div>
        <div className="h-3 w-full bg-black border border-white/10 overflow-hidden">
          <div
            className="h-full bg-[#0057ff] transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Stage Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {stages.map((stage) => {
          const isCurrent = stage.status === 'running';
          const isDone = stage.status === 'completed';
          const isFailed = stage.status === 'failed';

          return (
            <div
              key={stage.id}
              className={`p-4 border transition ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                  : isCurrent
                  ? 'bg-[#0057ff]/20 border-[#0057ff] text-white shadow-lg'
                  : isFailed
                  ? 'bg-red-950/20 border-red-500/40 text-red-400'
                  : 'bg-black border-white/10 text-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  0{stage.id}
                </span>
                <span className="material-symbols-outlined text-base">
                  {isDone ? 'check_circle' : isCurrent ? 'hourglass_top' : isFailed ? 'error' : 'radio_button_unchecked'}
                </span>
              </div>
              <h4 className="font-syne text-xs font-bold uppercase text-white mb-1">{stage.name}</h4>
              <p className="text-[10px] text-white/50 leading-normal font-space line-clamp-2 uppercase">{stage.description}</p>
            </div>
          );
        })}
      </div>

      {/* Live Terminal Log Stream */}
      <div className="border border-white/10 bg-black p-5 font-mono text-xs mb-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-white/50 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-red-500"></span>
            <span className="h-2.5 w-2.5 bg-amber-500"></span>
            <span className="h-2.5 w-2.5 bg-emerald-500"></span>
            <span className="ml-2 font-bold text-white/80">BUILDPATH_AGENT_STREAM.LOG</span>
          </div>
          <span className="text-[10px] text-[#0057ff] font-bold">SSE :: {isConnected ? 'LIVE' : 'CONNECTING...'}</span>
        </div>

        <div className="h-56 overflow-y-auto space-y-2 pr-2 no-scrollbar font-mono text-[11px]">
{logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-white/80 leading-relaxed uppercase">
                  <span className="text-[#0057ff] font-bold select-none">{'>'}</span>
              <span className={
                log.includes('COMPLETE') ? 'text-emerald-400 font-bold' :
                log.includes('ERROR') || log.includes('FAILED') ? 'text-red-400 font-bold' :
                log.includes('INITIALIZED') || log.includes('DISPATCHING') ? 'text-blue-400' : ''
              }>
                {log}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs text-center">
          {error}
          {onRetry && (
            <div className="mt-3 flex justify-center gap-3">
              <button
                onClick={onRetry}
                className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 px-5 py-2.5 text-xs font-mono font-bold uppercase text-red-300 hover:bg-red-500/30 transition"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                RETRY PIPELINE
              </button>
            </div>
          )}
        </div>
      )}

      {/* Completion CTA */}
      <div className="flex justify-center">
        <button
          id="view-matched-projects-btn"
          disabled={!isFinished}
          onClick={() => onViewResults?.()}
          className={`flex items-center gap-3 px-8 py-4 text-xs font-black tracking-[0.25em] uppercase transition ${
            isFinished
              ? 'bg-[#0057ff] text-white hover:bg-[#0046d5] shadow-xl active:scale-95 cursor-pointer'
              : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {isFinished ? 'verified' : 'sync'}
          </span>
          {isFinished ? 'VIEW MATCHED PROJECTS' : 'PIPELINE PROCESSING...'}
        </button>
      </div>
    </div>
  );
};