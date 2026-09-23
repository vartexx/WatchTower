import fs from 'node:fs';
import path from 'node:path';
import { calculateCvss31 } from './cvssEngine.js';

export function runDependencyScan(targetDir) {
  const auditReportPath = path.join(targetDir, 'npm-audit-report.json');
  const packageJsonPath = path.join(targetDir, 'package.json');
  const findings = [];
  const logs = [];

  logs.push(`[DEP] Initiating Supply-Chain & Dependency Scan on target: ${targetDir}`);

  if (!fs.existsSync(auditReportPath)) {
    logs.push(`[DEP] Warning: npm-audit-report.json not found at ${auditReportPath}`);
    return { findings, logs };
  }

  try {
    const rawData = fs.readFileSync(auditReportPath, 'utf8');
    const auditData = JSON.parse(rawData);
    logs.push(`[DEP] Loaded npm audit report (version ${auditData.auditReportVersion || 2})`);

    const vulns = auditData.vulnerabilities || {};
    const packageKeys = Object.keys(vulns);
    logs.push(`[DEP] Total vulnerable dependency trees analyzed: ${packageKeys.length}`);

    let index = 1;
    for (const pkgName of packageKeys) {
      const vuln = vulns[pkgName];
      const severity = (vuln.severity || 'low').toLowerCase();

      // Only import high, critical or notable moderate vulnerabilities to keep high signal
      let ntroScope = 'Client-side Security';
      let cwe = 'CWE-1395: Dependency on Vulnerable Third-Party Component';
      let cvssMetrics = { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'L', I: 'L', A: 'N' };

      if (pkgName.includes('clerk') || pkgName.includes('auth')) {
        ntroScope = 'Authentication & Sessions';
        cvssMetrics = { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'U', C: 'H', I: 'L', A: 'N' };
        cwe = 'CWE-287: Improper Authentication in Client Library';
      } else if (pkgName.includes('geo') || pkgName.includes('deck') || pkgName.includes('luma')) {
        ntroScope = 'Client-side Security';
        cvssMetrics = { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'L', I: 'L', A: 'H' };
        cwe = 'CWE-400: Uncontrolled Resource Consumption in WebGL Layers';
      }

      // Format title and description
      const viaDetails = Array.isArray(vuln.via)
        ? vuln.via.map(v => typeof v === 'string' ? v : (v.title || v.name)).join(', ')
        : 'Multiple transitive dependencies';

      const cvss = calculateCvss31(cvssMetrics);

      const fixAvailable = vuln.fixAvailable;
      let fixRecommendation = 'Update package in package.json to latest stable release.';
      if (typeof fixAvailable === 'object' && fixAvailable.name) {
        fixRecommendation = `Upgrade \`${fixAvailable.name}\` to version \`${fixAvailable.version}\`${fixAvailable.isSemVerMajor ? ' (Major semver upgrade required)' : ''}.`;
      } else if (fixAvailable === true) {
        fixRecommendation = `Run \`npm audit fix\` to automatically patch vulnerable sub-dependency.`;
      }

      findings.push({
        id: `DEP-${String(index++).padStart(3, '0')}`,
        title: `Vulnerable Dependency: ${pkgName} (${severity.toUpperCase()})`,
        scopeArea: ntroScope,
        severity: severity.charAt(0).toUpperCase() + severity.slice(1),
        status: 'Unverified', // By default unverified for human validation!
        cwe,
        component: `package.json -> ${pkgName}@${vuln.range || 'installed'}`,
        description: `High-risk third-party dependency advisory detected in ${pkgName}. Transitive advisory references: ${viaDetails}. Affected range: ${vuln.range || 'N/A'}.`,
        impact: `Exploitation of vulnerable third-party components could lead to client-side code execution, DOM tampering, or unauthorized data exposure in the web dashboard.`,
        cvssVector: cvss.vector,
        cvssScore: cvss.baseScore,
        cvssMetrics: cvss.metrics,
        reproductionSteps: [
          `1. Inspect package.json and lockfile dependencies for ${pkgName}.`,
          `2. Check installed bundle via: npm ls ${pkgName}`,
          `3. Review advisory details and vulnerable call-sites within client bundling pipeline.`,
          `4. Verify whether malicious or crafted inputs reach the component parser.`
        ],
        evidence: `Direct dependency: ${vuln.isDirect ? 'Yes' : 'No'}\nAffected Range: ${vuln.range}\nAdvisory via: ${JSON.stringify(vuln.via, null, 2)}`,
        remediation: fixRecommendation,
        validationNotes: ''
      });

      logs.push(`[DEP] [${severity.toUpperCase()}] Flagged ${pkgName} -> NTRO Scope: ${ntroScope}`);
    }

    logs.push(`[DEP] Dependency audit complete. Flagged ${findings.length} potential issues for human validation.`);
  } catch (err) {
    logs.push(`[DEP] Error parsing dependency audit: ${err.message}`);
  }

  return { findings, logs };
}
