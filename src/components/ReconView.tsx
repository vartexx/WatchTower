import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  ExternalLink, 
  FileCode, 
  ShieldAlert, 
  RefreshCw,
  Server
} from 'lucide-react';
import { ReconEndpoint } from '../types';

export const ReconView: React.FC = () => {
  const [endpoints, setEndpoints] = useState<ReconEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedScope, setSelectedScope] = useState('All');
  const [authFilter, setAuthFilter] = useState<'All' | 'Auth' | 'Public'>('All');

  const fetchRecon = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recon');
      const data = await res.json();
      setEndpoints(data.endpoints || []);
    } catch (e) {
      console.error('Failed to load recon endpoints', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecon();
  }, []);

  const filtered = endpoints.filter(ep => {
    const matchesSearch = ep.route.toLowerCase().includes(search.toLowerCase()) || 
                          ep.file.toLowerCase().includes(search.toLowerCase());
    const matchesScope = selectedScope === 'All' || ep.scopeArea === selectedScope;
    const matchesAuth = authFilter === 'All' || 
                        (authFilter === 'Auth' && ep.authRequired) || 
                        (authFilter === 'Public' && !ep.authRequired);
    return matchesSearch && matchesScope && matchesAuth;
  });

  const publicCount = endpoints.filter(e => !e.authRequired).length;
  const sensitiveCount = endpoints.filter(e => e.sensitive).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cyber-900 border border-cyber-700/60 rounded-xl p-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Radar className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: '6s' }} />
            <span>ATTACK SURFACE RECONNAISSANCE</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Target Endpoint & Architecture Catalog
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Automated static call-graph enumeration mapping routes, HTTP verbs, middleware guards, and authentication boundaries across World Monitor's API surface.
          </p>
        </div>

        <button
          onClick={fetchRecon}
          disabled={loading}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-cyber-800 hover:bg-cyber-700 border border-cyber-600 text-xs font-mono text-cyan-400 transition cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Surface</span>
        </button>
      </div>

      {/* Surface Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-cyber-900/80 border border-cyber-700/60 rounded-lg p-3">
          <span className="text-slate-500">TOTAL ENDPOINTS</span>
          <div className="text-2xl font-bold text-white mt-1">{endpoints.length}</div>
        </div>
        <div className="bg-cyber-900/80 border border-amber-500/30 rounded-lg p-3">
          <span className="text-slate-500">PUBLIC / UNAUTH</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{publicCount}</div>
        </div>
        <div className="bg-cyber-900/80 border border-rose-500/30 rounded-lg p-3">
          <span className="text-slate-500">SENSITIVE SINKS</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{sensitiveCount}</div>
        </div>
        <div className="bg-cyber-900/80 border border-emerald-500/30 rounded-lg p-3">
          <span className="text-slate-500">AUTH PROTECTED</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{endpoints.length - publicCount}</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-cyber-900/60 border border-cyber-800 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search endpoints by route (e.g. /api/user-prefs, /api/rss-proxy) or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-cyber-950 border border-cyber-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            className="bg-cyber-950 border border-cyber-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All Scope Areas</option>
            <option value="Authentication & sessions">Authentication & Sessions</option>
            <option value="Authorization & access control">Authorization & Access Control</option>
            <option value="Input validation">Input Validation</option>
            <option value="API security">API Security</option>
            <option value="Client-side security">Client-Side Security</option>
          </select>

          <select
            value={authFilter}
            onChange={(e) => setAuthFilter(e.target.value as any)}
            className="bg-cyber-950 border border-cyber-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="All">All Auth States</option>
            <option value="Auth">Auth Protected</option>
            <option value="Public">Public Access</option>
          </select>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cyber-800 bg-cyber-950/80 text-slate-400 font-mono">
                <th className="py-3 px-4">METHOD</th>
                <th className="py-3 px-4">ENDPOINT ROUTE</th>
                <th className="py-3 px-4">TARGET FILE</th>
                <th className="py-3 px-4">NTRO SCOPE PILLAR</th>
                <th className="py-3 px-4 text-center">AUTH GUARD</th>
                <th className="py-3 px-4 text-right">AUDIT STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-800/60 font-mono">
              {filtered.map((ep, idx) => (
                <tr key={idx} className="hover:bg-cyber-850/50 transition">
                  <td className="py-3 px-4">
                    <div className="flex space-x-1">
                      {ep.methods.map(m => (
                        <span 
                          key={m}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            m === 'GET' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                            m === 'POST' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">
                      {ep.route}
                    </span>
                    {ep.sensitive && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px]">
                        High Exposure
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    <span className="text-[11px] text-slate-300 flex items-center space-x-1">
                      <FileCode className="w-3 h-3 text-slate-500" />
                      <span>{ep.file}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-cyber-800 text-slate-300 text-[11px] border border-cyber-700">
                      {ep.scopeArea}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {ep.authRequired ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px]">
                        <Lock className="w-3 h-3" />
                        <span>Enforced</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-400 text-[11px]">
                        <Unlock className="w-3 h-3" />
                        <span>Public/None</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] text-cyan-400">
                      Audited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-cyber-950/60 border-t border-cyber-800 text-xs font-mono text-slate-500 flex justify-between">
          <span>Showing {filtered.length} of {endpoints.length} discovered endpoints</span>
          <span>Target Architecture: Vercel Edge / Node.js Microservices</span>
        </div>
      </div>
    </div>
  );
};
