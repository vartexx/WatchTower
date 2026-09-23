import React, { useState, useRef } from 'react';
import { ExternalLink, RotateCcw, Maximize2, Minimize2, Sparkles, ShieldCheck, Layers } from 'lucide-react';

export const AegisEmbeddedView: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-cyber-950 p-4' : 'pb-8'}`}>
      {/* Header bar */}
      <div className="bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-4 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-wide">
                Aegis // World Monitor Security Assessment
              </h2>
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Original SIH26163 UI (100% Untouched)</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct mounted from <code className="text-cyan-400 bg-cyber-950 px-1.5 py-0.5 rounded border border-cyber-800">sih26163/</code> with zero modifications to original HTML, CSS, or JS.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyber-800/80 hover:bg-cyber-700 border border-cyber-600/60 text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
            title="Reload Aegis UI Frame"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Frame</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyber-800/80 hover:bg-cyber-700 border border-cyber-600/60 text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand to Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Maximize</span>
              </>
            )}
          </button>

          <a
            href="/sih26163"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-mono font-medium text-white shadow-md shadow-cyan-900/30 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>

      {/* Embedded Iframe Container */}
      <div className="relative rounded-xl border border-cyber-700/80 bg-cyber-950 overflow-hidden shadow-2xl">
        <div className="bg-cyber-900/90 border-b border-cyber-800 px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-300 font-semibold">Mounted Endpoint:</span>
            <span className="text-cyan-400">http://localhost:3001/sih26163/</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Alias: <code className="text-slate-300">/aegis</code></span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <Layers className="w-3 h-3" />
              <span>Independent Sandbox Mode</span>
            </span>
          </div>
        </div>

        <iframe
          key={iframeKey}
          ref={iframeRef}
          src="/sih26163/"
          title="Aegis // World Monitor Security Assessment"
          className={`w-full bg-slate-950 transition-all ${
            isFullscreen ? 'h-[calc(100vh-8.5rem)]' : 'h-[calc(100vh-16rem)] min-h-[780px]'
          }`}
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
};
