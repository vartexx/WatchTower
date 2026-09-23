import React, { useState, useEffect } from 'react';
import { ReconEndpoint } from '../types';

interface AegisAttackSurfaceProps {
  onSelectScope?: (scope: string) => void;
}

export const AegisAttackSurface: React.FC<AegisAttackSurfaceProps> = ({ onSelectScope }) => {
  const [endpoints, setEndpoints] = useState<ReconEndpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'public' | 'auth'>('all');
  const [copiedRoute, setCopiedRoute] = useState<string | null>(null);

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

  const handleCopy = (route: string) => {
    navigator.clipboard?.writeText(route);
    setCopiedRoute(route);
    setTimeout(() => setCopiedRoute(null), 1800);
  };

  const filteredEndpoints = endpoints.filter((ep) => {
    const matchesSearch =
      ep.route.toLowerCase().includes(search.toLowerCase()) ||
      ep.file.toLowerCase().includes(search.toLowerCase()) ||
      ep.scopeArea.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'high') return ep.riskRating === 'HIGH' || ep.riskRating === 'CRITICAL' || ep.sensitive;
    if (activeFilter === 'public') return !ep.authRequired;
    if (activeFilter === 'auth') return ep.authRequired;
    return true;
  });

  const getIconClass = (scope: string, auth: boolean) => {
    if (scope.includes('Authentication') || auth) return { type: 'ID', cls: 'border-[#efb867] text-[#efb867]' };
    if (scope.includes('Data') || scope.includes('Sensitive')) return { type: 'DB', cls: 'border-[#c2e66b] text-[#c2e66b]' };
    if (scope.includes('Communication')) return { type: 'WEB', cls: 'border-[#77a9ff] text-[#77a9ff]' };
    return { type: 'API', cls: 'border-[#6be1d6] text-[#6be1d6]' };
  };

  const getSeverityBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="text-[9px] text-[#ff746d] font-syne font-bold uppercase tracking-wider">HIGH</span>;
      case 'MEDIUM':
        return <span className="text-[9px] text-[#efb867] font-syne font-bold uppercase tracking-wider">MEDIUM</span>;
      case 'LOW':
        return <span className="text-[9px] text-[#77a9ff] font-syne font-bold uppercase tracking-wider">LOW</span>;
      default:
        return <span className="text-[9px] text-[#c2e66b] font-syne font-bold uppercase tracking-wider">VERIFIED</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Intro */}
      <div className="border-b border-[#253740] pb-4">
        <span className="text-[10px] text-[#6be1d6] tracking-widest uppercase block font-mono">
          PHASE 01 // RECONNAISSANCE
        </span>
        <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
          Attack surface <em className="text-[#6be1d6] not-italic font-normal">inventory</em>
        </h2>
        <p className="text-xs text-[#7f939d] max-w-xl mt-2 leading-relaxed">
          Every exposed asset, API route, and trust boundary detected across the target World Monitor application mapped into a controlled catalog.
        </p>
      </div>

      {/* Surface Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="border border-[#253740] bg-[#14242d] px-3 py-2 flex items-center space-x-2 w-72 rounded-sm">
          <span className="text-[#6be1d6] text-sm">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes, files, scopes..."
            className="bg-transparent border-0 outline-none text-xs text-[#e6edf0] placeholder-[#7f939d] w-full font-mono"
          />
        </div>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all border ${
            activeFilter === 'all'
              ? 'border-[#365963] bg-[#162d35] text-[#6be1d6]'
              : 'border-transparent text-[#7f939d] hover:text-white'
          }`}
        >
          All assets <b className="font-normal ml-1">{endpoints.length}</b>
        </button>

        <button
          onClick={() => setActiveFilter('high')}
          className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all border ${
            activeFilter === 'high'
              ? 'border-[#365963] bg-[#162d35] text-[#ff746d]'
              : 'border-transparent text-[#7f939d] hover:text-white'
          }`}
        >
          High risk / Sensitive <b className="font-normal ml-1">{endpoints.filter(e => e.sensitive || e.riskRating === 'HIGH').length}</b>
        </button>

        <button
          onClick={() => setActiveFilter('public')}
          className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all border ${
            activeFilter === 'public'
              ? 'border-[#365963] bg-[#162d35] text-[#efb867]'
              : 'border-transparent text-[#7f939d] hover:text-white'
          }`}
        >
          Public Unauthenticated <b className="font-normal ml-1">{endpoints.filter(e => !e.authRequired).length}</b>
        </button>

        <button
          onClick={() => setActiveFilter('auth')}
          className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all border ${
            activeFilter === 'auth'
              ? 'border-[#365963] bg-[#162d35] text-[#c2e66b]'
              : 'border-transparent text-[#7f939d] hover:text-white'
          }`}
        >
          Auth Protected <b className="font-normal ml-1">{endpoints.filter(e => e.authRequired).length}</b>
        </button>

        <button
          onClick={fetchRecon}
          disabled={loading}
          className="ml-auto px-3.5 py-1.5 rounded-sm bg-[#223a43] hover:bg-[#2b4954] text-[#e6edf0] border border-[#3a5c65] text-xs font-mono transition-all"
        >
          {loading ? '↻ Refreshing...' : '↻ Refresh inventory'}
        </button>
      </div>

      {/* Asset Table in Aegis Style */}
      <div className="border border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029] rounded-sm overflow-hidden shadow-lg">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#253740] text-[10px] text-[#7f939d] font-mono uppercase tracking-wider">
          <div className="col-span-5">Asset / Endpoint</div>
          <div className="col-span-2">Method / Type</div>
          <div className="col-span-3">NTRO Scope Pillar</div>
          <div className="col-span-1 text-center">Exposure</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#253740] max-h-[640px] overflow-y-auto">
          {filteredEndpoints.length === 0 ? (
            <div className="text-center py-12 text-[#7f939d] text-xs font-mono">
              {loading ? 'Loading attack surface inventory from World Monitor...' : 'No matching endpoints found.'}
            </div>
          ) : (
            filteredEndpoints.map((ep, idx) => {
              const icon = getIconClass(ep.scopeArea, ep.authRequired);
              return (
                <div
                  key={`${ep.route}-${ep.method}-${idx}`}
                  className="grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-[#1b333b]/60 transition-all font-mono"
                >
                  {/* Endpoint & File */}
                  <div className="col-span-5 flex items-center space-x-3 min-w-0">
                    <span className={`w-8 h-8 rounded border ${icon.cls} flex-none text-[9px] font-bold grid place-items-center`}>
                      {icon.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-xs text-white font-syne font-semibold truncate" title={ep.route}>
                        {ep.route}
                      </strong>
                      <small className="block text-[10px] text-[#7f939d] truncate mt-0.5" title={ep.file}>
                        {ep.file}
                      </small>
                    </div>
                  </div>

                  {/* Method & Auth */}
                  <div className="col-span-2 flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#203943] text-[#6be1d6] text-[10px] font-bold">
                      {ep.method || 'GET'}
                    </span>
                    <span className="text-[10px] text-[#7f939d]">
                      {ep.authRequired ? '🔒 Auth' : '🌐 Public'}
                    </span>
                  </div>

                  {/* Scope Pillar */}
                  <div className="col-span-3 text-[11px] text-[#e6edf0] truncate">
                    {ep.scopeArea}
                  </div>

                  {/* Exposure Risk Badge */}
                  <div className="col-span-1 text-center">
                    {getSeverityBadge(ep.riskRating || (ep.sensitive ? 'HIGH' : 'LOW'))}
                  </div>

                  {/* Copy / Inspect Action */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleCopy(ep.route)}
                      className="text-[10px] text-[#6be1d6] hover:underline"
                    >
                      {copiedRoute === ep.route ? '✓ Copied' : 'Copy ↗'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
