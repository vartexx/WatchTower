import React, { useState } from 'react';

export const AegisEvidenceVault: React.FC = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<string>('wm004');

  const artifacts: Record<string, { id: string; title: string; file: string; timestamp: string; hash: string; content: string }> = {
    wm004: {
      id: 'WM-004',
      title: 'Missing authorization on report export',
      file: 'evidence://WM-004/request-response.txt',
      timestamp: '2026-09-23T04:18:06Z',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      content: `# WATCHTOWER CONTROLLED SIMULATION // CHAIN OF CUSTODY
# Finding: WM-004 Missing authorization on report export (IDOR)
# Target: World Monitor /api/v1/reports/export

$ request --method GET --path /api/v1/reports/export?report_id=other-user-8821
Authorization: Bearer [analyst-guest-session-token]

HTTP/1.1 200 OK
content-type: application/json
x-watchtower-observation: unauthorized data returned across tenancy boundary

{
  "report_id": "other-user-8821",
  "owner": "executive-director@intelligence.gov",
  "classification": "TOP-SECRET // RESTRICTED",
  "telemetry_stream": "active",
  "created_at": "2026-09-22T21:04:12Z"
}

# Cryptographic Seal: SHA-256 integrity verified
# Evidence sealed at 2026-09-23T04:18:06Z`
    },
    wm001: {
      id: 'WM-001',
      title: 'SSRF filter bypass via loopback redirection',
      file: 'evidence://WM-001/ssrf-sinkhole.txt',
      timestamp: '2026-09-23T04:22:19Z',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      content: `# WATCHTOWER CONTROLLED SIMULATION // CHAIN OF CUSTODY
# Finding: WM-001 SSRF Filter Bypass via IPv4/IPv6 Mapping
# Target: /api/rss-proxy?url=http://[::ffff:127.0.0.1]:3000/

$ request --method GET --path /api/rss-proxy?url=http://127.0.0.1:3000/api/internal-metrics
User-Agent: WorldMonitor-Crawler/1.0

HTTP/1.1 200 OK
content-type: application/json
x-watchtower-sinkhole: intercepted by 127.0.0.1 safety sandbox

{
  "sinkhole_status": "INTERCEPTED",
  "internal_node": "worldmonitor-core",
  "system_load": 0.42,
  "internal_tokens_exposed": true
}

# Cryptographic Seal: SHA-256 integrity verified
# Evidence sealed at 2026-09-23T04:22:19Z`
    },
    wm002: {
      id: 'WM-002',
      title: 'Session token persists in server memory after logout',
      file: 'evidence://WM-002/session-replay.txt',
      timestamp: '2026-09-23T04:25:44Z',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      content: `# WATCHTOWER CONTROLLED SIMULATION // CHAIN OF CUSTODY
# Finding: WM-002 Session token persists after user logout
# Target: Authentication Session Layer

$ request --method POST --path /api/auth/logout
Authorization: Bearer sess_user_8821_active

HTTP/1.1 200 OK
{ "message": "Logged out successfully" }

$ request --method GET --path /api/user/profile
Authorization: Bearer sess_user_8821_active (REPLAY ATTEMPT)

HTTP/1.1 200 OK
x-watchtower-observation: revoked token remains valid in memory cache!
{ "user_id": "usr_8821", "role": "analyst", "session_valid": true }

# Cryptographic Seal: SHA-256 integrity verified
# Evidence sealed at 2026-09-23T04:25:44Z`
    },
    wm011: {
      id: 'WM-011',
      title: 'Missing defense-in-depth security response headers',
      file: 'evidence://WM-011/header-analysis.txt',
      timestamp: '2026-09-23T04:29:10Z',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      content: `# WATCHTOWER CONTROLLED SIMULATION // CHAIN OF CUSTODY
# Finding: WM-011 Missing security headers on web surface
# Target: worldmonitor.app web server

$ curl -sI https://worldmonitor.app/

HTTP/1.1 200 OK
content-type: text/html; charset=utf-8
x-powered-by: Express

# MISSING MANDATORY HEADERS:
[-] Content-Security-Policy: NOT FOUND (Vulnerable to XSS execution)
[-] Permissions-Policy: NOT FOUND (Microphone/Camera access unrestricted)
[-] Strict-Transport-Security: NOT FOUND (SSL stripping possible)
[-] X-Content-Type-Options: NOT FOUND (MIME sniffing enabled)

# Cryptographic Seal: SHA-256 integrity verified
# Evidence sealed at 2026-09-23T04:29:10Z`
    }
  };

  const current = artifacts[selectedArtifact] || artifacts.wm004;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Intro */}
      <div className="border-b border-[#253740] pb-4">
        <span className="text-[10px] text-[#6be1d6] tracking-widest uppercase block font-mono">
          CHAIN OF CUSTODY // VERIFICATION
        </span>
        <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
          Evidence <em className="text-[#6be1d6] not-italic font-normal">vault</em>
        </h2>
        <p className="text-xs text-[#7f939d] max-w-xl mt-2 leading-relaxed">
          Immutable, timestamped proof that keeps every claim defensible before NTRO evaluators.
        </p>
      </div>

      {/* Artifact selector pills */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(artifacts).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setSelectedArtifact(key)}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all border ${
              selectedArtifact === key
                ? 'border-[#6be1d6] bg-[#162d35] text-[#6be1d6]'
                : 'border-[#253740] text-[#7f939d] hover:text-white'
            }`}
          >
            {item.id} · {item.title}
          </button>
        ))}
      </div>

      {/* Evidence Layout: Summary Card on Left, Terminal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Sealed Vault Summary */}
        <div className="lg:col-span-4 border border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029] p-6 rounded-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full border border-[#6be1d6]/50 bg-[#162f38] text-[#6be1d6] text-2xl grid place-items-center">
            ▣
          </div>
          <div>
            <strong className="block font-syne font-extrabold text-5xl text-white">18</strong>
            <span className="text-xs text-[#7f939d] mt-1 block">sealed artifacts</span>
          </div>

          <div className="text-[10px] text-[#c2e66b] border border-[#46613b] bg-[#16281e] p-2.5 rounded font-mono break-all text-left">
            <span className="block text-[#7f939d] text-[9px] uppercase">SHA-256 INTEGRITY HASH</span>
            {current.hash}
          </div>

          <p className="text-[10px] text-[#7f939d] leading-relaxed pt-2">
            Non-destructive digital evidence sealed under NTRO PS 26163 chain-of-custody guidelines.
          </p>
        </div>

        {/* Right: Evidence Terminal */}
        <div className="lg:col-span-8 border border-[#253740] bg-[#0c1820] rounded-sm overflow-hidden shadow-2xl">
          <div className="h-10 border-b border-[#253740] px-4 flex items-center justify-between bg-[#10202a] text-[10px] text-[#7f939d]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff746d] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#efb867] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#c2e66b] inline-block"></span>
              <span className="ml-2 font-syne text-[#e6edf0] font-semibold">{current.file}</span>
            </div>
            <span className="text-[#c2e66b] font-mono">SEALED & VERIFIED</span>
          </div>

          <pre className="p-6 font-mono text-xs text-[#e6edf0] leading-relaxed whitespace-pre-wrap bg-[#0a151b] max-h-[500px] overflow-y-auto">
            {current.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
