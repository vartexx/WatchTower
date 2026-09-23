import React, { useState, useEffect } from 'react';
import { AegisShell } from './components/AegisShell';
import { AegisMissionControl } from './components/AegisMissionControl';
import { AegisAttackSurface } from './components/AegisAttackSurface';
import { AegisScannerHub } from './components/AegisScannerHub';
import { AegisFindings } from './components/AegisFindings';
import { AegisPocLab } from './components/AegisPocLab';
import { AegisEvidenceVault } from './components/AegisEvidenceVault';
import { AegisNtroReport } from './components/AegisNtroReport';
import { AegisJudgePitch } from './components/AegisJudgePitch';
import { FindingModal } from './components/FindingModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Finding, SystemStatus } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Failed to load status', e);
    }
  };

  const fetchFindings = async () => {
    try {
      const res = await fetch('/api/findings');
      const data = await res.json();
      setFindings(data);
    } catch (e) {
      console.error('Failed to load findings', e);
    }
  };

  const refreshAll = () => {
    fetchStatus();
    fetchFindings();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleQuickScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    showToast('Simulation started: mapping 164 authorized assets.');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanType: 'all' }),
      });
      const data = await res.json();
      refreshAll();
      showToast(`Scan complete: ${data.findingsCount || 0} findings updated.`);
    } catch (e) {
      showToast(`Scan error: ${e}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset findings database back to verified baseline benchmark state?')) {
      try {
        await fetch('/api/reset', { method: 'POST' });
        refreshAll();
        showToast('Database reset to clean NTRO benchmark state.');
      } catch (e) {
        showToast(`Reset failed: ${e}`);
      }
    }
  };

  const handleUpdateFindingStatus = async (findingId: string, newStatus: Finding['status']) => {
    try {
      const res = await fetch(`/api/findings/${findingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setFindings((prev) => prev.map((f) => (f.id === findingId ? updated : f)));
        showToast(`Finding ${findingId} updated to ${newStatus}.`);
      }
    } catch (e) {
      showToast(`Failed to update finding: ${e}`);
    }
  };

  const handleFindingModalUpdated = (updated: Finding) => {
    setFindings((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setSelectedFinding(null);
    showToast(`Finding ${updated.id} metrics & triage saved.`);
  };

  return (
    <AegisShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      status={status}
      findingsCount={findings.length}
      onReset={handleReset}
      onQuickScan={handleQuickScan}
      isScanning={isScanning}
    >
      <ErrorBoundary key={activeTab}>
        {activeTab === 'overview' && (
          <AegisMissionControl
            status={status}
            findings={findings}
            onNavigateTab={setActiveTab}
            onRunScan={handleQuickScan}
            isScanning={isScanning}
          />
        )}

        {activeTab === 'surface' && <AegisAttackSurface />}

        {activeTab === 'scanner' && (
          <AegisScannerHub
            onScanComplete={refreshAll}
            onNavigateToTriage={() => setActiveTab('findings')}
          />
        )}

        {activeTab === 'findings' && (
          <AegisFindings
            findings={findings}
            onSelectFindingForModal={(f) => setSelectedFinding(f)}
            onNavigateToPoc={() => setActiveTab('poc')}
            onUpdateFindingStatus={handleUpdateFindingStatus}
          />
        )}

        {activeTab === 'poc' && <AegisPocLab />}

        {activeTab === 'evidence' && <AegisEvidenceVault />}

        {activeTab === 'report' && <AegisNtroReport />}

        {activeTab === 'pitch' && <AegisJudgePitch />}
      </ErrorBoundary>

      {/* CVSS Modal */}
      {selectedFinding && (
        <FindingModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onUpdate={handleFindingModalUpdated}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d9f0e5] text-[#0d2928] px-4 py-2.5 rounded text-xs font-mono font-semibold shadow-2xl animate-fade-in border border-[#a2d8c3]">
          {toastMessage}
        </div>
      )}
    </AegisShell>
  );
};

export default App;
