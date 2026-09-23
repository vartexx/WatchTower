import fs from 'node:fs';
import path from 'node:path';
import { calculateCvss31 } from './cvssEngine.js';

export function runSastScan(targetDir) {
  const findings = [];
  const logs = [];

  logs.push(`[SAST] Initiating Static Application Security Testing (SAST) on ${targetDir}`);

  const rules = [
    {
      id: 'SAST-SEC-001',
      title: 'Potential Hardcoded Secret or Token in Codebase',
      scopeArea: 'Client-side Security',
      severity: 'High',
      cwe: 'CWE-798: Use of Hardcoded Credentials',
      regex: /(?:api[_-]?key|secret|token|password|bearer|auth[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i,
      excludeExt: ['.md', '.json', '.lock', '.svg', '.png'],
      impact: 'Exposure of API tokens or secrets allows unauthorized third-party access to external services or internal state.',
      cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'H', I: 'L', A: 'N' },
      remediation: 'Migrate secret to server-side environment variables loaded via runtime vault or loadEnvFile(). Never embed tokens in client bundles.'
    },
    {
      id: 'SAST-XSS-002',
      title: 'Potential Cross-Site Scripting (XSS) via Unsanitized DOM Sink',
      scopeArea: 'Input validation',
      severity: 'High',
      cwe: 'CWE-79: Improper Neutralization of Input During Web Page Generation',
      regex: /dangerouslySetInnerHTML|innerHTML\s*=|insertAdjacentHTML\s*\(/g,
      excludeExt: ['.test.ts', '.test.js', '.spec.ts', '.md'],
      impact: 'An attacker injecting malicious payloads could execute arbitrary scripts in the context of the user session, stealing session tokens or manipulating UI state.',
      cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'C', C: 'L', I: 'L', A: 'N' },
      remediation: 'Ensure all dynamic HTML rendered is strictly sanitized through DOMPurify with safe tag allowlists before DOM insertion.'
    },
    {
      id: 'SAST-SSRF-003',
      title: 'Potential Server-Side Request Forgery (SSRF) in Outbound Fetch Handler',
      scopeArea: 'Input validation',
      severity: 'Critical',
      cwe: 'CWE-918: Server-Side Request Forgery (SSRF)',
      regex: /fetch\s*\(\s*(?:req\.query|url|targetUrl|webhookUrl|rssUrl)/g,
      excludeExt: ['.test.ts', '.test.mjs', '.md'],
      impact: 'Unchecked outbound HTTP requests allow attackers to scan internal infrastructure (e.g. 127.0.0.1, AWS/GCP metadata services at 169.254.169.254) and retrieve internal metrics.',
      cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'C', C: 'H', I: 'L', A: 'N' },
      remediation: 'Implement strict IP destination validation resolving hostnames and denying loopback (127.0.0.0/8), private RFC1918 blocks, and link-local cloud metadata ranges.'
    },
    {
      id: 'SAST-CORS-004',
      title: 'Permissive CORS Header Configuration Detected',
      scopeArea: 'Secure communication',
      severity: 'Medium',
      cwe: 'CWE-942: Permissive Cross-Origin Resource Sharing Policy',
      regex: /['"]Access-Control-Allow-Origin['"]\s*:\s*['"]\*['"]/g,
      excludeExt: ['.test.ts', '.test.mjs', '.md'],
      impact: 'Wildcard CORS headers may allow untrusted web applications to make cross-origin reads on sensitive responses if coupled with ambient credentials.',
      cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'U', C: 'L', I: 'N', A: 'N' },
      remediation: 'Restrict Access-Control-Allow-Origin to authorized origin domains or validate origin against an explicit domain allowlist.'
    },
    {
      id: 'SAST-SESS-005',
      title: 'Insecure Session Cookie Configuration',
      scopeArea: 'Authentication & sessions',
      severity: 'Medium',
      cwe: 'CWE-614: Sensitive Cookie in HTTPS Session Without Secure Attribute',
      regex: /Set-Cookie.*(?!.*SameSite=(?:Strict|Lax)|.*HttpOnly)/i,
      excludeExt: ['.test.ts', '.test.mjs', '.md'],
      impact: 'Cookies lacking HttpOnly and SameSite protections are vulnerable to cross-site script theft and cross-site request forgery.',
      cvssMetrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'U', C: 'L', I: 'L', A: 'N' },
      remediation: 'Ensure all session and authentication cookies explicitly enforce `HttpOnly; Secure; SameSite=Lax` or `SameSite=Strict`.'
    },
    {
      id: 'SAST-PRIV-006',
      title: 'Potential Unrestricted Logging of Sensitive User Data (PII)',
      scopeArea: 'Data storage & privacy',
      severity: 'Medium',
      cwe: 'CWE-532: Insertion of Sensitive Information into Log File',
      regex: /console\.(?:log|error|warn)\(.*(?:password|email|token|apiKey|secret|bearer)/i,
      excludeExt: ['.test.ts', '.test.mjs', '.md'],
      impact: 'Logging credentials or user personal data violates privacy principles and India DPDP Act 2023 compliance guidelines.',
      cvssMetrics: { AV: 'L', AC: 'L', PR: 'L', UI: 'N', S: 'U', C: 'H', I: 'N', A: 'N' },
      remediation: 'Redact sensitive keys and PII tokens prior to logging, or sanitize log payloads through structured logger filters.'
    }
  ];

  const searchDirs = ['api', 'src', 'server'];

  function walk(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
          files = files.concat(walk(fullPath));
        }
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  let totalFilesScanned = 0;

  for (const subDir of searchDirs) {
    const targetSubDir = path.join(targetDir, subDir);
    const files = walk(targetSubDir);
    totalFilesScanned += files.length;

    for (const filePath of files) {
      const ext = path.extname(filePath);
      const relPath = path.relative(targetDir, filePath);

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        for (const rule of rules) {
          if (rule.excludeExt.includes(ext)) continue;

          for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            rule.regex.lastIndex = 0;
            if (rule.regex.test(line)) {
              const cvss = calculateCvss31(rule.cvssMetrics);
              const findingId = `${rule.id}-${findings.length + 1}`;

              findings.push({
                id: findingId,
                title: `${rule.title} in ${path.basename(filePath)}`,
                scopeArea: rule.scopeArea,
                severity: rule.severity,
                status: 'Unverified', // Crucial: Human must validate!
                cwe: rule.cwe,
                component: `${relPath}:${lineIdx + 1}`,
                description: `Static pattern analysis identified potentially risky construct matching rule [${rule.id}] at line ${lineIdx + 1}.`,
                impact: rule.impact,
                cvssVector: cvss.vector,
                cvssScore: cvss.baseScore,
                cvssMetrics: cvss.metrics,
                reproductionSteps: [
                  `1. Open source file: ${relPath} at line ${lineIdx + 1}.`,
                  `2. Examine usage context of pattern matching rule [${rule.id}].`,
                  `3. Test whether input reaches this sink or whether defense controls sanitize it.`,
                  `4. Verify if finding is a true positive exploit or defended by upstream middleware.`
                ],
                evidence: `File: ${relPath}\nLine ${lineIdx + 1}: ${line.trim().slice(0, 160)}`,
                remediation: rule.remediation,
                validationNotes: ''
              });

              logs.push(`[SAST] [${rule.severity}] Flagged ${rule.id} in ${relPath}:${lineIdx + 1}`);
              break; // 1 hit per rule per file to avoid noise
            }
          }
        }
      } catch (err) {
        // Skip unreadable files
      }
    }
  }

  logs.push(`[SAST] Completed scan across ${totalFilesScanned} source files. Identified ${findings.length} candidates for human verification.`);

  return { findings, logs };
}
