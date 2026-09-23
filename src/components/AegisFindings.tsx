import React, { useState } from 'react';
import { Finding } from '../types';
import { SlidersHorizontal, CheckCircle2, XCircle } from 'lucide-react';

interface AegisFindingsProps {
  findings: Finding[];
  onSelectFindingForModal: (finding: Finding) => void;
  onNavigateToPoc: () => void;
  onUpdateFindingStatus: (findingId: string, newStatus: Finding['status']) => void;
}

export const AegisFindings: React.FC<AegisFindingsProps> = ({
  findings,
  onSelectFindingForModal,
  onNavigateToPoc,
  onUpdateFindingStatus,
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>(findings[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Unverified' | 'False Positive'>('All');
  const [search, setSearch] = useState<string>('');

  const filteredFindings = findings.filter((f) => {
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    const matchesSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.component.toLowerCase().includes(search.toLowerCase()) ||
      f.scopeArea.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedFinding = findings.find((f) => f.id === selectedFindingId) || filteredFindings[0] || findings[0];

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-[#ff746d] border border-[#ff746d]/40 bg-[#ff746d]/10';
      case 'HIGH':
        return 'text-[#ff746d] border border-[#ff746d]/30 bg-[#ff746d]/10';
      case 'MEDIUM':
        return 'text-[#efb867] border border-[#efb867]/40 bg-[#efb867]/10';
      case 'LOW':
        return 'text-[#77a9ff] border border-[#77a9ff]/40 bg-[#77a9ff]/10';
      default:
        return 'text-[#c2e66b] border border-[#c2e66b]/40 bg-[#c2e66b]/10';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Intro */}
      <div className="border-b border-[#253740] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#6be1d6] tracking-widest uppercase block font-mono">
            PHASE 03 // VALIDATION & TRIAGE
          </span>
          <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
            Findings <em className="text-[#6be1d6] not-italic font-normal">that matter</em>
          </h2>
          <p className="text-xs text-[#7f939d] max-w-xl mt-2 leading-relaxed">
            Prioritized by mathematical CVSS v3.1 exploitability, business impact, and human triage confidence.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#7f939d]">
            Total: <b className="text-white font-normal">{findings.length}</b> ·
            Confirmed: <b className="text-[#c2e66b] font-normal">{findings.filter(f => f.status === 'Confirmed').length}</b> ·
            Unverified: <b className="text-[#efb867] font-normal">{findings.filter(f => f.status === 'Unverified').length}</b>
          </span>
        </div>
      </div>

      {/* Finding Layout Split: List on Left, Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Finding List */}
        <div className="lg:col-span-5 border border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029] rounded-sm overflow-hidden flex flex-col h-[700px]">
          {/* List Toolbar */}
          <div className="p-3 border-b border-[#253740] space-y-2 bg-[#12242c]">
            <div className="border border-[#253740] bg-[#0c1820] px-3 py-1.5 flex items-center space-x-2 rounded-sm">
              <span className="text-[#6be1d6] text-xs">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter findings..."
                className="bg-transparent border-0 outline-none text-xs text-[#e6edf0] placeholder-[#7f939d] w-full font-mono"
              />
            </div>

            <div className="flex items-center space-x-1 text-[10px]">
              {(['All', 'Confirmed', 'Unverified', 'False Positive'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded-sm transition-all ${
                    statusFilter === st
                      ? 'bg-[#1b333b] text-[#6be1d6] border border-[#365963]'
                      : 'text-[#7f939d] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Finding Rows */}
          <div className="divide-y divide-[#253740] overflow-y-auto flex-1 font-mono">
            {filteredFindings.length === 0 ? (
              <div className="text-center py-12 text-[#7f939d] text-xs">No findings match current filter.</div>
            ) : (
              filteredFindings.map((f) => {
                const isSelected = selectedFinding?.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFindingId(f.id)}
                    className={`w-full text-left p-3.5 flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#1b333b] border-l-2 border-[#6be1d6]'
                        : 'hover:bg-[#14262f] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-syne font-bold uppercase tracking-wider flex-none ${getSeverityBadgeClass(f.severity)}`}>
                        {f.severity}
                      </span>
                      <div className="min-w-0 flex-1 pr-2">
                        <strong className="block text-xs text-white font-syne font-semibold truncate">
                          {f.title}
                        </strong>
                        <small className="block text-[10px] text-[#7f939d] truncate mt-0.5">
                          {f.id} · {f.component}
                        </small>
                      </div>
                    </div>
                    <div className="text-right flex-none pl-2">
                      <span className="font-syne font-bold text-base text-white">{f.cvssScore.toFixed(1)}</span>
                      <span className={`block text-[9px] ${f.status === 'Confirmed' ? 'text-[#c2e66b]' : f.status === 'False Positive' ? 'text-[#ff746d]' : 'text-[#efb867]'}`}>
                        {f.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Finding Detail Inspector */}
        <div className="lg:col-span-7 border border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029] p-6 rounded-sm flex flex-col justify-between h-[700px] overflow-y-auto">
          {selectedFinding ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#ff746d] tracking-widest font-mono uppercase font-bold">
                    {selectedFinding.severity} // {selectedFinding.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    selectedFinding.status === 'Confirmed'
                      ? 'border-[#c2e66b]/40 text-[#c2e66b] bg-[#c2e66b]/10'
                      : selectedFinding.status === 'False Positive'
                      ? 'border-[#ff746d]/40 text-[#ff746d] bg-[#ff746d]/10'
                      : 'border-[#efb867]/40 text-[#efb867] bg-[#efb867]/10'
                  }`}>
                    STATUS: {selectedFinding.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-syne font-bold text-2xl text-white mt-1.5 leading-snug">
                  {selectedFinding.title}
                </h3>
                <p className="text-xs text-[#7f939d] leading-relaxed mt-2.5">
                  {selectedFinding.description}
                </p>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#253740] text-xs font-mono">
                <div>
                  <label className="block text-[10px] text-[#7f939d] uppercase mb-1">AFFECTED COMPONENT</label>
                  <strong className="block text-white font-syne font-semibold break-all text-xs">
                    {selectedFinding.component}
                  </strong>
                </div>

                <div>
                  <label className="block text-[10px] text-[#7f939d] uppercase mb-1">CVSS v3.1 BASE SCORE</label>
                  <div className="flex items-center space-x-2">
                    <strong className="text-white font-syne font-bold text-base">
                      {selectedFinding.cvssScore.toFixed(1)} {selectedFinding.severity}
                    </strong>
                    <button
                      onClick={() => onSelectFindingForModal(selectedFinding)}
                      className="text-[10px] text-[#6be1d6] hover:underline flex items-center space-x-1"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Calculator</span>
                    </button>
                  </div>
                  <small className="text-[9px] text-[#7f939d] block truncate mt-0.5">
                    {selectedFinding.cvssVector}
                  </small>
                </div>

                <div>
                  <label className="block text-[10px] text-[#7f939d] uppercase mb-1">NTRO SCOPE PILLAR</label>
                  <strong className="block text-[#e6edf0] font-syne font-semibold">
                    {selectedFinding.scopeArea}
                  </strong>
                  <small className="text-[10px] text-[#7f939d]">{selectedFinding.cwe}</small>
                </div>

                <div>
                  <label className="block text-[10px] text-[#7f939d] uppercase mb-1">CONFIDENCE & EVIDENCE</label>
                  <strong className="block text-[#c2e66b] font-syne font-semibold">
                    High · 3 sealed artifacts
                  </strong>
                  <small className="text-[10px] text-[#7f939d]">Reproduction verified in sandbox</small>
                </div>
              </div>

              {/* Business Impact & DPDP Relevance */}
              <div className="space-y-3 pt-3 border-t border-[#253740] text-xs">
                <div>
                  <label className="block text-[10px] text-[#7f939d] font-mono uppercase mb-1">BUSINESS & MISSION IMPACT</label>
                  <p className="text-xs text-[#e6edf0] leading-relaxed bg-[#0c1820] p-2.5 rounded border border-[#253740] font-mono">
                    {selectedFinding.businessImpact}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] text-[#7f939d] font-mono uppercase mb-1">RECOMMENDED REMEDIATION</label>
                  <p className="text-xs text-[#c2e66b] leading-relaxed bg-[#0c1820] p-2.5 rounded border border-[#253740] font-mono">
                    {selectedFinding.remediation}
                  </p>
                </div>

                {selectedFinding.dpdpRelevance && (
                  <div>
                    <label className="block text-[10px] text-[#efb867] font-mono uppercase mb-1">DPDP ACT 2023 RELEVANCE</label>
                    <p className="text-xs text-[#efb867] leading-relaxed bg-[#0c1820] p-2.5 rounded border border-[#efb867]/30 font-mono">
                      {selectedFinding.dpdpRelevance}
                    </p>
                  </div>
                )}
              </div>

              {/* Detail Action Buttons */}
              <div className="pt-4 border-t border-[#253740] flex flex-wrap items-center gap-3">
                <button
                  onClick={onNavigateToPoc}
                  className="px-4 py-2 rounded-sm bg-[#6be1d6] text-[#10252b] text-xs font-syne font-semibold hover:bg-[#5cd4c9] transition-all shadow-md flex items-center space-x-1.5"
                >
                  <span>▣</span>
                  <span>View Proof of Concept</span>
                </button>

                <button
                  onClick={() => onUpdateFindingStatus(selectedFinding.id, 'Confirmed')}
                  className="px-3.5 py-2 rounded-sm bg-[#223a43] hover:bg-[#2c4b57] text-[#c2e66b] border border-[#3a5c65] text-xs font-syne font-semibold transition-all flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Vulnerability</span>
                </button>

                <button
                  onClick={() => onUpdateFindingStatus(selectedFinding.id, 'False Positive')}
                  className="px-3.5 py-2 rounded-sm bg-[#223a43] hover:bg-[#2c4b57] text-[#ff746d] border border-[#3a5c65] text-xs font-syne font-semibold transition-all flex items-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Mark False Positive</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-[#7f939d]">Select a finding from the left to inspect details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
