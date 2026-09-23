export const SEED_FINDINGS = [
  {
    id: 'VAPT-26163-001',
    title: 'Server-Side Request Forgery (SSRF) in RSS & Webhook Proxy',
    scopeArea: 'Input validation',
    severity: 'Critical',
    status: 'Confirmed',
    cwe: 'CWE-918: Server-Side Request Forgery (SSRF)',
    component: 'api/rss-proxy.js & _notification-webhook-ssrf.ts',
    description: 'The endpoint /api/rss-proxy accepts user-supplied target URLs and initiates server-side outbound HTTP requests. Insufficient domain/IP validation or improper URL-object wrapper handling allows requests targeting internal loopback services (127.0.0.1) and cloud metadata services (169.254.169.254).',
    impact: 'An attacker can pivot through the edge server to query internal network services, retrieve cloud instance credentials, and bypass network perimeter firewalls.',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N',
    cvssScore: 9.3,
    cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'C', C: 'H', I: 'L', A: 'N' },
    reproductionSteps: [
      '1. Target the local World Monitor instance at http://127.0.0.1:3000.',
      '2. Issue an HTTP GET request to /api/rss-proxy with a URL parameter pointing to a loopback address: `curl "http://127.0.0.1:3000/api/rss-proxy?url=http://127.0.0.1:8080/metrics"`',
      '3. Observe that the edge proxy attempts outbound resolution without strict subnet-range boundary enforcement.',
      '4. Verify that internal service responses are proxied back to the caller.'
    ],
    evidence: `GET /api/rss-proxy?url=http://127.0.0.1:6379/ HTTP/1.1\nHost: 127.0.0.1:3000\nUser-Agent: Watchtower-PoC-Runner\n\nHTTP/1.1 200 OK\nContent-Type: application/xml\n-ERR unknown command 'GET'`,
    remediation: 'Implement strict IP destination validation: resolve domain to IPv4/IPv6 before initiating connection, reject all RFC 1918 private ranges, loopback (127.0.0.0/8), link-local (169.254.0.0/16), and cloud provider metadata addresses. Enforce an explicit allowlist of authorized RSS syndication domains.',
    validationNotes: 'Confirmed by security analyst via local sinkhole. Edge proxy failed to filter internal loopback requests when octal IP formats were used.'
  },
  {
    id: 'VAPT-26163-002',
    title: 'Broken Object-Level Authorization (BOLA/IDOR) in User Preferences & Notification Relay',
    scopeArea: 'Authorization & access control',
    severity: 'High',
    status: 'Confirmed',
    cwe: 'CWE-639: Authorization Bypass Through User-Controlled Key',
    component: 'api/user-prefs.ts & api/notification-channels.ts',
    description: 'The user preference and notification channel configuration endpoints rely on client-supplied user identifiers (`userId` / `channelId`) without validating that the authenticated session token cryptographically matches the target account record.',
    impact: 'A low-privilege authenticated user can modify notification relays, telegram webhooks, or alert delivery destinations of other users, intercepting sensitive intelligence alerts or tampering with preference profiles.',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
    cvssScore: 8.1,
    cvssMetrics: { AV: 'N', AC: 'L', PR: 'L', UI: 'N', S: 'U', C: 'H', I: 'H', A: 'N' },
    reproductionSteps: [
      '1. Authenticate as User A and obtain valid session token `sess_alpha_987`.',
      '2. Send a POST request to `/api/user-prefs` containing JSON payload with `userId: "user_victim_456"`.',
      '3. Observe that the API updates settings for `user_victim_456` without verifying ownership against `sess_alpha_987`.',
      '4. Query preferences for victim user to confirm state mutation.'
    ],
    evidence: `POST /api/user-prefs HTTP/1.1\nAuthorization: Bearer sess_alpha_987\nContent-Type: application/json\n\n{"userId": "user_victim_456", "notifications": {"email": "attacker@evil.corp"}}\n\nHTTP/1.1 200 OK\n{"status": "success", "updatedUser": "user_victim_456"}`,
    remediation: 'Extract user identity strictly from the verified server-side session context or JWT claims. Discard any client-supplied `userId` parameters in request bodies or query strings.',
    validationNotes: 'Confirmed in local sandbox. Arbitrary user ID parameters accepted and persisted without subject ownership checks.'
  },
  {
    id: 'VAPT-26163-003',
    title: 'Broken Session Revocation & Insecure Cookie Storage',
    scopeArea: 'Authentication & sessions',
    severity: 'High',
    status: 'Confirmed',
    cwe: 'CWE-384: Session Fixation / CWE-613: Insufficient Session Expiration',
    component: 'api/wm-session.js & api/_session.js',
    description: 'Session tokens generated on authentication lack active server-side revocation on logout. In addition, cookies set by fallback authentication endpoints omit the `SameSite=Strict` and `HttpOnly` flags in specific desktop sidecar bridge routes.',
    impact: 'Stolen or abandoned session tokens remain valid indefinitely until natural Redis TTL expiration, allowing session hijacking via XSS or browser history extraction.',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N',
    cvssScore: 7.1,
    cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'U', C: 'H', I: 'L', A: 'N' },
    reproductionSteps: [
      '1. Log into World Monitor and capture the `wm_session` cookie value.',
      '2. Trigger logout in the UI.',
      '3. Replay an authenticated request using the previously captured `wm_session` cookie.',
      '4. Observe that the session is still accepted as valid.'
    ],
    evidence: `POST /api/wm-session/logout HTTP/1.1\nCookie: wm_session=tok_expired_123\n\nHTTP/1.1 200 OK\n\n-- Subsequent request --\nGET /api/me HTTP/1.1\nCookie: wm_session=tok_expired_123\n\nHTTP/1.1 200 OK\n{"authenticated": true, "user": "analyst@gov.in"}`,
    remediation: 'Implement an explicit Redis session revocation blocklist (`revoked-session:<token_hash>`) with immediate invalidation on logout. Enforce `HttpOnly; Secure; SameSite=Lax` across all session cookies.',
    validationNotes: 'Manually verified: Redis key remained alive and authorized requests succeeded after explicit user logout.'
  },
  {
    id: 'VAPT-26163-004',
    title: 'Missing Rate Limiting & Resource Exhaustion on AI Intelligence APIs',
    scopeArea: 'API security',
    severity: 'Medium',
    status: 'Confirmed',
    cwe: 'CWE-770: Allocation of Resources Without Limits or Throttling',
    component: 'api/latest-brief.ts & api/mcp-proxy.ts',
    description: 'The intelligence summary generator `/api/latest-brief` and LLM agent proxy `/api/mcp-proxy` do not enforce strict per-IP or per-user rate limiting. When upstream LLM providers are invoked, uncontrolled requests can exhaust quota and cause denial of service.',
    impact: 'Attackers or automated scripts can flood expensive AI intelligence generation endpoints, incurring excessive API operational costs or degrading dashboard performance for legitimate defense analysts.',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    cvssScore: 7.5,
    cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'N', I: 'N', A: 'H' },
    reproductionSteps: [
      '1. Use ApacheBench or curl in a loop to send 50 concurrent requests to `/api/latest-brief`.',
      '2. Monitor server response times and HTTP status codes.',
      '3. Observe that no HTTP 429 Too Many Requests response is returned, and server memory consumption surges.'
    ],
    evidence: `Concurrency Test: 50 requests in 3.2 seconds\nCompleted: 50/50\nHTTP 429 count: 0\nAverage latency increased from 180ms to 4200ms.`,
    remediation: 'Implement distributed token-bucket rate limiting via Upstash Redis or memory store (e.g. 10 requests per minute per IP/API key). Return standard `HTTP 429 Too Many Requests` with `Retry-After` header.',
    validationNotes: 'Confirmed in local benchmark: 100 requests executed with zero rate-limit enforcement.'
  },
  {
    id: 'VAPT-26163-005',
    title: 'Vulnerable Third-Party Dependencies in Visualization & Mapping Stack',
    scopeArea: 'Client-side security',
    severity: 'High',
    status: 'Confirmed',
    cwe: 'CWE-1395: Dependency on Vulnerable Third-Party Component',
    component: 'package.json -> @deck.gl/carto & @deck.gl/geo-layers',
    description: 'The client application utilizes outdated Deck.gl and Carto spatial rendering libraries containing 13 High-severity advisories related to WebGL buffer manipulation and unhandled matrix transformations.',
    impact: 'Malicious GeoJSON feeds or crafted spatial telemetry data ingested into the World Monitor globe could trigger buffer overflows in WebGL contexts or client crash (Denial of Service).',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:H',
    cvssScore: 7.6,
    cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'U', C: 'L', I: 'L', A: 'H' },
    reproductionSteps: [
      '1. Run `npm audit --json` on World Monitor repository.',
      '2. Query npm-audit-report.json for `@deck.gl/carto`.',
      '3. Notice advisory chain originating from `@deck.gl/geo-layers -> @loaders.gl/3d-tiles`.'
    ],
    evidence: `Package: @deck.gl/carto\nSeverity: High\nVia: @deck.gl/geo-layers, @loaders.gl/3d-tiles\nRange: >=8.10.0-alpha.1`,
    remediation: 'Upgrade `@deck.gl/carto` and all `@deck.gl/*` dependencies to the latest stable release (v9.0+) and regenerate package-lock.json.',
    validationNotes: 'Cross-referenced against npm-audit-report.json and GitHub Security Advisory database.'
  },
  {
    id: 'VAPT-26163-006',
    title: 'Potential DOM XSS via Unescaped Markdown Parsing in News Feed',
    scopeArea: 'Input validation',
    severity: 'Medium',
    status: 'False Positive', // Marked False Positive to show Human-in-the-Loop!
    cwe: 'CWE-79: Cross-Site Scripting (XSS)',
    component: 'src/components/StoryCard.tsx & api/og-story.js',
    description: 'Automated static regex scanner flagged unescaped HTML injection in story rendering component due to presence of dangerouslySetInnerHTML keyword.',
    impact: 'Hypothetical script execution in user session.',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
    cvssScore: 6.1,
    cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'C', C: 'L', I: 'L', A: 'N' },
    reproductionSteps: [
      '1. Injected `<img src=x onerror=alert(1)>` payload into mock news headline feed.',
      '2. Inspected rendered DOM in StoryCard.',
      '3. Verified DOMPurify.sanitize() strictly stripped all script and event handlers before insertion.'
    ],
    evidence: `Input: "<script>alert(1)</script><b>Headline</b>"\nRendered DOM: "<b>Headline</b>"\nDOMPurify sanitize intercept was active.`,
    remediation: 'No remediation required. Defense-in-depth sanitization is properly implemented via DOMPurify.',
    validationNotes: 'FALSE POSITIVE: Human verification confirmed that DOMPurify sanitization runs unconditionally before dangerouslySetInnerHTML is invoked. Scanner flag was an automated false alarm.'
  },
  {
    id: 'VAPT-26163-007',
    title: 'Absence of Data Retention & PII Scrubbing Policy (DPDP Act 2023 Non-Compliance)',
    scopeArea: 'Data storage & privacy',
    severity: 'Medium',
    status: 'Confirmed',
    cwe: 'CWE-359: Exposure of Private Personal Information',
    component: 'server/_shared/usage-telemetry.js & api/_client-ip.js',
    description: 'Client IP addresses, browser fingerprint user-agents, and location telemetry coordinates are cached in Upstash Redis without automated anonymization, hashing, or scheduled data purging mechanisms required under the Digital Personal Data Protection (DPDP) Act 2023.',
    impact: 'Storage of raw IP addresses and telemetry without explicit retention caps or anonymization exposes operator identities to privacy audit failure and regulatory non-compliance.',
    cvssVector: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
    cvssScore: 5.5,
    cvssMetrics: { AV: 'L', AC: 'L', PR: 'L', UI: 'N', S: 'U', C: 'H', I: 'N', A: 'N' },
    reproductionSteps: [
      '1. Send request through client proxy to trigger telemetry logging.',
      '2. Inspect Redis keys under `telemetry:*` or `client-ip:*`.',
      '3. Verify that raw unhashed IPv4/IPv6 addresses are stored indefinitely without TTL.'
    ],
    evidence: `Redis Key: telemetry:client:192.168.1.104\nPayload: {"ip": "192.168.1.104", "ua": "Mozilla/5.0...", "timestamp": 1726000000}\nTTL: -1 (Never expires)`,
    remediation: 'Truncate or salt-hash client IP addresses (e.g. SHA-256(IP + daily_salt)). Set strict TTL (e.g. 72 hours) on telemetry records to satisfy DPDP Act 2023 purpose limitation and storage limitation principles.',
    validationNotes: 'Confirmed by auditing server/_shared/usage-telemetry.js. Raw client IP is saved without salt-hashing or TTL.'
  },
  {
    id: 'VAPT-26163-008',
    title: 'Missing HTTP Strict Transport Security (HSTS) and Insecure TLS Fallback',
    scopeArea: 'Secure communication',
    severity: 'Medium',
    status: 'Confirmed',
    cwe: 'CWE-319: Cleartext Transmission of Sensitive Information',
    component: 'api/_cors.js & server reverse proxy',
    description: 'The edge HTTP configuration does not transmit `Strict-Transport-Security` headers on response payloads, leaving open a protocol downgrade vulnerability.',
    impact: 'Attackers on local Wi-Fi or compromised gateways can strip TLS encryption (SSL Stripping) and intercept sensitive geopolitical and defense telemetry.',
    cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:L/A:N',
    cvssScore: 5.9,
    cvssMetrics: { AV: 'N', AC: 'H', PR: 'N', UI: 'R', S: 'U', C: 'H', I: 'L', A: 'N' },
    reproductionSteps: [
      '1. Run `curl -sI https://127.0.0.1:3000/api/health`',
      '2. Inspect response headers for Strict-Transport-Security.',
      '3. Observe header is completely absent.'
    ],
    evidence: `HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: *\nCache-Control: public, s-maxage=60\n(Strict-Transport-Security missing)`,
    remediation: 'Inject `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` header in all edge and API responses.',
    validationNotes: 'Confirmed via automated header probe.'
  }
];
