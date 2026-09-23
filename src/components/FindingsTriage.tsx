import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ShieldAlert, 
  ExternalLink, 
  ChevronRight, 
  FileCode, 
  CheckCheck,
  ShieldQuestion
} from 'lucide-react';
import { Finding } from '../types';

interface FindingsTriageProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  activeScopeFilter?: string;
}

export const FindingsTriage: React.FC<FindingsTriageProps> = ({
  findings,
  onSelectFinding,
  activeScopeFilter = 'All',
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unverified' | 'Confirmed' | 'False Positive' | 'Remediated'>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [scopeFilter, setScopeFilter] = useState<string>(activeScopeFilter);
  const [search, setSearch] = useState('');

  const filtered = findings.filter(f => {
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || f.severity === severityFilter;
    const matchesScope = scopeFilter === 'All' || f.scopeArea.toLowerCase().includes(scopeFilter.toLowerCase());
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
                          f.id.toLowerCase().includes(search.toLowerCase()) ||
                          f.component.toLowerCase().includes(search.toLowerCase()) ||
                          f.cwe.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSeverity && matchesScope && matchesSearch;
  });

  const unverifiedCount = findings.filter(f => f.status === 'Unverified').length;
  const confirmedCount = findings.filter(f => f.status === 'Confirmed').length;
  const fpCount = findings.filter(f => f.status === 'False Positive').length;
  const remediatedCount = findings.filter(f => f.status === 'Remediated').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <ShieldQuestion className="w-4 h-4 text-cyan-400" />
          <span>STAGE 4 // HUMAN-IN-THE-LOOP VALIDATION</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Findings Triage & Verification Matrix
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Automated scanners only discover candidates. The human auditor manually reproduces each finding on the local World Monitor sandbox, documents proof-of-concept steps, scores severity via CVSS v3.1, and marks it <strong className="text-rose-400">Confirmed</strong> or <strong className="text-emerald-400">False Positive</strong>.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 cursor-pointer ${
            statusFilter === 'All'
              ? 'bg-cyber-700 text-white font-bold border border-cyber-500'
              : 'bg-cyber-900/80 text-slate-400 hover:text-white border border-cyber-800'
          }`}
        >
          <span>All Findings</span>
          <span className="px-1.5 py-0.2 rounded bg-cyber-950 text-slate-300 text-[10px]">{findings.length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Unverified')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 cursor-pointer ${
            statusFilter === 'Unverified'
              ? 'bg-amber-900/60 text-amber-300 font-bold border border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-cyber-900/80 text-slate-400 hover:text-amber-300 border border-cyber-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Unverified (Scanner Alerts)</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[10px] font-bold">{unverifiedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Confirmed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 cursor-pointer ${
            statusFilter === 'Confirmed'
              ? 'bg-rose-900/60 text-rose-300 font-bold border border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
              : 'bg-cyber-900/80 text-slate-400 hover:text-rose-300 border border-cyber-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Confirmed (True Positives)</span>
          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 text-[10px] font-bold">{confirmedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('False Positive')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 cursor-pointer ${
            statusFilter === 'False Positive'
              ? 'bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-cyber-900/80 text-slate-400 hover:text-emerald-300 border border-cyber-800'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>False Positives Discarded</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">{fpCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Remediated')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 cursor-pointer ${
            statusFilter === 'Remediated'
              ? 'bg-blue-900/60 text-blue-300 font-bold border border-blue-500'
              : 'bg-cyber-900/80 text-slate-400 hover:text-blue-300 border border-cyber-800'
          }`}
        >
          <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Remediated / Fixed</span>
          <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 text-[10px]">{remediatedCount}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-cyber-900/60 border border-cyber-800 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID (VAPT-001), keyword, component, or CWE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-cyber-950 border border-cyber-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="bg-cyber-950 border border-cyber-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All 7 NTRO Scope Areas</option>
            <option value="Authentication & sessions">1. Authentication & Sessions</option>
            <option value="Authorization & access control">2. Authorization & Access Control</option>
            <option value="Input validation">3. Input Validation</option>
            <option value="API security">4. API Security</option>
            <option value="Client-side security">5. Client-Side Security</option>
            <option value="Secure communication">6. Secure Communication</option>
            <option value="Data storage & privacy">7. Data Storage & Privacy</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-cyber-950 border border-cyber-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-cyber-900/60 border border-cyber-800 rounded-xl p-12 text-center text-slate-400 font-mono text-xs">
            No security findings matching current filter parameters.
          </div>
        ) : (
          filtered.map((finding) => {
            const isConfirmed = finding.status === 'Confirmed';
            const isUnverified = finding.status === 'Unverified';
            const isFalsePositive = finding.status === 'False Positive';
            const isRemediated = finding.status === 'Remediated';

            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding)}
                className={`bg-cyber-900/90 border transition-all rounded-xl p-4 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isConfirmed ? 'border-rose-500/40 hover:border-rose-500/80 hover:bg-cyber-850' :
                  isUnverified ? 'border-amber-500/40 hover:border-amber-500/80 hover:bg-cyber-850' :
                  isFalsePositive ? 'border-emerald-500/30 opacity-75 hover:opacity-100 hover:border-emerald-500/60' :
                  'border-blue-500/30 hover:border-blue-500/60'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-cyber-950 text-cyan-400 font-bold border border-cyan-800">
                      {finding.id}
                    </span>

                    {/* Status Badge */}
                    {isConfirmed && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-rose-400" />
                        <span>CONFIRMED</span>
                      </span>
                    )}
                    {isUnverified && (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800 animate-pulse flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>UNVERIFIED SCANNER ALERT</span>
                      </span>
                    )}
                    {isFalsePositive && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 flex items-center space-x-1">
                        <XCircle className="w-3 h-3 text-emerald-400" />
                        <span>FALSE POSITIVE (VETTED)</span>
                      </span>
                    )}
                    {isRemediated && (
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800 flex items-center space-x-1">
                        <CheckCheck className="w-3 h-3 text-blue-400" />
                        <span>REMEDIATED</span>
                      </span>
                    )}

                    {/* Severity Badge */}
                    <span className={`px-2 py-0.5 rounded font-bold border ${
                      finding.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' :
                      finding.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                      finding.severity === 'Medium' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                      'bg-slate-700/20 text-slate-400 border-slate-600'
                    }`}>
                      {finding.severity.toUpperCase()}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-cyber-800 text-slate-300 border border-cyber-700">
                      {finding.scopeArea}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold text-white group-hover:text-cyan-300 transition ${isFalsePositive ? 'line-through text-slate-400' : ''}`}>
                    {finding.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {finding.description}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <FileCode className="w-3 h-3 text-slate-500" />
                      <span>{finding.component}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{finding.cwe.split(':')[0]}</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-cyber-800 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">CVSS v3.1</div>
                    <div className={`text-xl font-bold font-mono ${
                      finding.cvssScore >= 9.0 ? 'text-rose-400' :
                      finding.cvssScore >= 7.0 ? 'text-amber-400' :
                      finding.cvssScore >= 4.0 ? 'text-blue-400' : 'text-slate-300'
                    }`}>
                      {finding.cvssScore}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFinding(finding);
                    }}
                    className="mt-2 px-3 py-1.5 rounded bg-cyber-800 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyber-600 font-mono text-xs transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isUnverified ? 'Triage Finding' : 'Inspect Dossier'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
