import React, { useState } from 'react';
import { TypewriterText } from './TypewriterText';
import { Activity, ShieldCheck, Play, ChevronUp, ChevronDown, Radio, Terminal } from 'lucide-react';
import { SystemStatus } from '../types';

interface BottomTelemetryBarProps {
  status: SystemStatus | null;
  findingsCount: number;
  onQuickScan: () => void;
  isScanning: boolean;
  onNavigateTab: (tab: string) => void;
}

export const BottomTelemetryBar: React.FC<BottomTelemetryBarProps> = ({
  status,
  findingsCount,
  onQuickScan,
  isScanning,
  onNavigateTab,
}) => {
  const [minimized, setMinimized] = useState(false);

  const telemetryPhrases = [
    'NTRO PS 26163 // 164 Attack surface endpoints mapped & indexed.',
    'Safe sandbox // 127.0.0.1 sinkhole active with non-destructive payloads.',
    'DPDP Act 2023 // Section 8(5) technical data safeguards verified.',
    'CVSS v3.1 // Continuous mathematical base score recalculation.',
    'Continuous VAPT // Memory & session leakage telemetry live.'
  ];

  return (
    <div className="fixed bottom-0 left-0 lg:left-72 right-0 z-30 pointer-events-none">
      <div className="pointer-events-auto transition-transform duration-500 ease-out">
        {/* Minimized Pill Toggle */}
        {minimized ? (
          <div className="flex justify-end pr-6 pb-3">
            <button
              onClick={() => setMinimized(false)}
              className="bg-[#0c0e14] border border-[#181f2e] hover:border-[#00f0ff]/60 text-white text-[11px] font-mono px-3.5 py-1.5 rounded-t-sm shadow-[0_-4px_20px_rgba(0,0,0,0.8)] flex items-center space-x-2 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            >
              <div className="flex items-end space-x-0.5 h-3">
                <span className="w-1 bg-[#00f0ff] rounded-xs animate-bar-1 h-3 inline-block" />
                <span className="w-1 bg-[#00ff9d] rounded-xs animate-bar-2 h-3 inline-block" />
                <span className="w-1 bg-[#00f0ff] rounded-xs animate-bar-3 h-3 inline-block" />
              </div>
              <span className="text-white font-semibold">WATCHTOWER HUD</span>
              <ChevronUp className="w-3.5 h-3.5 text-[#00f0ff]" />
            </button>
          </div>
        ) : (
          /* Full Bottom Bar Coming from Bottom to Top */
          <div className="bg-[#07090e]/95 backdrop-blur-md border-t border-[#181f2e] shadow-[0_-8px_30px_rgba(0,0,0,0.8)] animate-slide-up-dock relative overflow-hidden">
            {/* Top glowing laser line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-80" />

            <div className="px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              {/* Left: Signal Bars (coming from bottom to top) + Typewriter Status */}
              <div className="flex items-center space-x-4 min-w-0">
                {/* Vertical Signal Bars Rising Bottom to Top */}
                <div className="flex items-end space-x-1 h-5.5 px-2 py-1 rounded bg-[#040507] border border-[#181f2e]">
                  <span className="w-1 bg-[#00f0ff] rounded-xs animate-bar-1 h-5 inline-block" />
                  <span className="w-1 bg-[#00ff9d] rounded-xs animate-bar-2 h-5 inline-block" />
                  <span className="w-1 bg-[#00f0ff] rounded-xs animate-bar-3 h-5 inline-block" />
                  <span className="w-1 bg-[#38bdf8] rounded-xs animate-bar-4 h-5 inline-block" />
                  <span className="w-1 bg-[#00ff9d] rounded-xs animate-bar-2 h-5 inline-block" />
                </div>

                {/* Live Ticker */}
                <div className="truncate max-w-md xl:max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">
                      TELEMETRY
                    </span>
                    <span className="text-[#181f2e]">|</span>
                    <TypewriterText
                      phrases={telemetryPhrases}
                      typingSpeed={38}
                      deletingSpeed={18}
                      pauseDuration={2800}
                      className="text-[11px] text-[#94a3b8]"
                      prefix=">"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Quick telemetry stats & Action */}
              <div className="flex items-center space-x-4">
                {/* Telemetry pill 1 */}
                <button
                  onClick={() => onNavigateTab('surface')}
                  className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0c0e14] border border-[#181f2e] text-[11px] text-[#94a3b8] hover:text-white hover:border-[#00f0ff]/40 transition-colors"
                >
                  <Radio className="w-3 h-3 text-[#00f0ff]" />
                  <span>ROUTES: <b className="text-white font-semibold">164</b></span>
                </button>

                {/* Telemetry pill 2 */}
                <button
                  onClick={() => onNavigateTab('findings')}
                  className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0c0e14] border border-[#181f2e] text-[11px] text-[#94a3b8] hover:text-white hover:border-[#00f0ff]/40 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-[#00ff9d]" />
                  <span>FINDINGS: <b className="text-white font-semibold">{findingsCount || 130}</b></span>
                </button>

                {/* Quick Scan Action */}
                <button
                  onClick={onQuickScan}
                  disabled={isScanning}
                  className={`px-3 py-1.5 rounded text-[11px] font-syne font-bold flex items-center space-x-1.5 shadow-md transition-all ${
                    isScanning
                      ? 'bg-[#18202e] text-[#64748b] cursor-wait'
                      : 'bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] text-[#040507] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isScanning ? 'Scanning...' : 'Simulate Scan'}</span>
                </button>

                {/* Minimize Button */}
                <button
                  onClick={() => setMinimized(true)}
                  className="p-1 rounded text-[#64748b] hover:text-white hover:bg-[#181f2e] transition-colors"
                  title="Minimize bar"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
