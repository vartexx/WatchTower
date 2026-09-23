/**
 * CVSS v3.1 Standard Base Score Calculator
 * Reference: FIRST.org CVSS v3.1 Specification
 */

export const CVSS_METRICS = {
  AV: {
    name: 'Attack Vector',
    options: {
      N: { label: 'Network', value: 0.85, desc: 'Remotely exploitable over Internet/network' },
      A: { label: 'Adjacent', value: 0.62, desc: 'Requires same physical or logical subnet' },
      L: { label: 'Local', value: 0.55, desc: 'Requires local access or command execution' },
      P: { label: 'Physical', value: 0.20, desc: 'Requires physical access to target device' }
    }
  },
  AC: {
    name: 'Attack Complexity',
    options: {
      L: { label: 'Low', value: 0.77, desc: 'Specialized access conditions not required' },
      H: { label: 'High', value: 0.44, desc: 'Requires bypass of defensive configurations or timing' }
    }
  },
  PR: {
    name: 'Privileges Required',
    options: {
      N: { label: 'None', valueUnchanged: 0.85, valueChanged: 0.85, desc: 'Unauthorized attacker' },
      L: { label: 'Low', valueUnchanged: 0.62, valueChanged: 0.68, desc: 'Basic user privileges required' },
      H: { label: 'High', valueUnchanged: 0.27, valueChanged: 0.50, desc: 'Administrative access required' }
    }
  },
  UI: {
    name: 'User Interaction',
    options: {
      N: { label: 'None', value: 0.85, desc: 'No user interaction needed' },
      R: { label: 'Required', value: 0.62, desc: 'Victim must perform an action (e.g. click link)' }
    }
  },
  S: {
    name: 'Scope',
    options: {
      U: { label: 'Unchanged', desc: 'Vulnerability affects only original component' },
      C: { label: 'Changed', desc: 'Can impact components outside security authority' }
    }
  },
  C: {
    name: 'Confidentiality',
    options: {
      H: { label: 'High', value: 0.56, desc: 'Total information disclosure' },
      L: { label: 'Low', value: 0.22, desc: 'Partial or restricted data leakage' },
      N: { label: 'None', value: 0.0, desc: 'No confidentiality impact' }
    }
  },
  I: {
    name: 'Integrity',
    options: {
      H: { label: 'High', value: 0.56, desc: 'Total data modification or tampering' },
      L: { label: 'Low', value: 0.22, desc: 'Partial or restricted modification' },
      N: { label: 'None', value: 0.0, desc: 'No integrity impact' }
    }
  },
  A: {
    name: 'Availability',
    options: {
      H: { label: 'High', value: 0.56, desc: 'Total resource exhaustion / service denial' },
      L: { label: 'Low', value: 0.22, desc: 'Reduced performance or intermittent interruptions' },
      N: { label: 'None', value: 0.0, desc: 'No availability impact' }
    }
  }
};

/**
 * Rounds a number up to one decimal place according to CVSS v3.1 spec
 */
export function roundup(input) {
  const intInput = Math.round(input * 100000);
  if (intInput % 10000 === 0) {
    return intInput / 100000;
  }
  return (Math.floor(intInput / 10000) + 1) / 10;
}

/**
 * Calculates CVSS v3.1 Base Score and Vector String
 */
export function calculateCvss31(metrics) {
  const av = metrics.AV || 'N';
  const ac = metrics.AC || 'L';
  const pr = metrics.PR || 'N';
  const ui = metrics.UI || 'N';
  const s = metrics.S || 'U';
  const c = metrics.C || 'N';
  const i = metrics.I || 'N';
  const a = metrics.A || 'N';

  const avVal = CVSS_METRICS.AV.options[av]?.value ?? 0.85;
  const acVal = CVSS_METRICS.AC.options[ac]?.value ?? 0.77;
  const prVal = s === 'U' 
    ? (CVSS_METRICS.PR.options[pr]?.valueUnchanged ?? 0.85)
    : (CVSS_METRICS.PR.options[pr]?.valueChanged ?? 0.85);
  const uiVal = CVSS_METRICS.UI.options[ui]?.value ?? 0.85;

  const cVal = CVSS_METRICS.C.options[c]?.value ?? 0.0;
  const iVal = CVSS_METRICS.I.options[i]?.value ?? 0.0;
  const aVal = CVSS_METRICS.A.options[a]?.value ?? 0.0;

  // Calculate ISS (Impact Sub Score)
  const iss = 1 - ((1 - cVal) * (1 - iVal) * (1 - aVal));

  let impact = 0;
  if (s === 'U') {
    impact = 6.42 * iss;
  } else {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  }

  const exploitability = 8.22 * avVal * acVal * prVal * uiVal;

  let baseScore = 0;
  if (impact <= 0) {
    baseScore = 0;
  } else if (s === 'U') {
    baseScore = roundup(Math.min(impact + exploitability, 10));
  } else {
    baseScore = roundup(Math.min(1.08 * (impact + exploitability), 10));
  }

  // Determine Severity Rating
  let severity = 'None';
  if (baseScore >= 9.0) severity = 'Critical';
  else if (baseScore >= 7.0) severity = 'High';
  else if (baseScore >= 4.0) severity = 'Medium';
  else if (baseScore >= 0.1) severity = 'Low';

  const vector = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${s}/C:${c}/I:${i}/A:${a}`;

  return {
    baseScore,
    severity,
    vector,
    impact: Math.round(impact * 10) / 10,
    exploitability: Math.round(exploitability * 10) / 10,
    metrics: { AV: av, AC: ac, PR: pr, UI: ui, S: s, C: c, I: i, A: a }
  };
}

/**
 * Parse a CVSS v3.1 vector string into metrics
 */
export function parseCvssVector(vectorString) {
  const parts = vectorString.replace(/^CVSS:3\.1\//, '').split('/');
  const metrics = {};
  for (const part of parts) {
    const [key, val] = part.split(':');
    if (key && val) {
      metrics[key] = val;
    }
  }
  return calculateCvss31(metrics);
}
