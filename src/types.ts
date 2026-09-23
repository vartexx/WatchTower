export interface CvssMetrics {
  AV: 'N' | 'A' | 'L' | 'P';
  AC: 'L' | 'H';
  PR: 'N' | 'L' | 'H';
  UI: 'N' | 'R';
  S: 'U' | 'C';
  C: 'N' | 'L' | 'H';
  I: 'N' | 'L' | 'H';
  A: 'N' | 'L' | 'H';
}

export interface Finding {
  id: string;
  title: string;
  scopeArea: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  status: 'Unverified' | 'Confirmed' | 'False Positive' | 'Remediated';
  cwe: string;
  component: string;
  description: string;
  impact: string;
  cvssVector: string;
  cvssScore: number;
  cvssMetrics: CvssMetrics;
  reproductionSteps: string[];
  evidence: string;
  remediation: string;
  validationNotes?: string;
  updatedAt?: string;
}

export interface ReconEndpoint {
  route: string;
  file: string;
  methods: string[];
  authRequired: boolean;
  scopeArea: string;
  sensitive: boolean;
  lines: number;
}

export interface SystemStats {
  total: number;
  confirmed: number;
  unverified: number;
  falsePositive: number;
  remediated: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SystemStatus {
  appName: string;
  version: string;
  hackathon: string;
  problemStatement: string;
  organization: string;
  target: {
    name: string;
    host: string;
    domain: string;
    path: string;
    isSelfHosted: true;
    safeMode: true;
  };
  stats: SystemStats;
}

export interface NtroReportData {
  title: string;
  classification: string;
  hackathon: string;
  problemStatement: string;
  organization: string;
  targetSystem: {
    name: string;
    type: string;
    environment: string;
    assessmentPeriod: string;
    methodology: string;
  };
  summary: {
    totalDiscovered: number;
    confirmedVulnerabilities: number;
    falsePositivesEliminated: number;
    pendingManualTriage: number;
    severityBreakdown: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    averageCvssScore: number;
  };
  complianceMapping: {
    owaspTop10: Array<{ id: string; findingsCount: number; status: string }>;
    dpdpAct2023: {
      compliant: boolean;
      issues: string[];
    };
  };
  confirmedFindings: Finding[];
  falsePositives: Finding[];
}
