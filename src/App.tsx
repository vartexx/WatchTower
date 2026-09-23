import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { ReconView } from './components/ReconView';
import { ScannerHub } from './components/ScannerHub';
import { FindingsTriage } from './components/FindingsTriage';
import { FindingModal } from './components/FindingModal';
import { SafePocLab } from './components/SafePocLab';
import { NtroReportView } from './components/NtroReportView';
import { JudgePitchMode } from './components/JudgePitchMode';
import { Finding, SystemStatus } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [scopeFilter, setScopeFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  useEffect(() => {
    fetchStatus();
    fetchFindings();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetData = async () => {
    if (!confirm('Reset all findings back to clean benchmark seed state?')) return;
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchStatus();
      await fetchFindings();
      showToast('Database reset to clean NTRO seed state.');
    } catch (e) {
      showToast('Error resetting database.');
    }
  };

  const handleRunFullScan = () => {
    setActiveTab('scanner');
  };

  const handleNavigateToScope = (tab: string, filterScope?: string) => {
    if (filterScope) {
      setScopeFilter(filterScope);
    } else {
      setScopeFilter('All');
    }
    setActiveTab(tab);
  };

  const handleFindingUpdated = (updated: Finding) => {
    setFindings(prev => prev.map(f => f.id === updated.id ? updated : f));
    fetchStatus();
    showToast(`Finding ${updated.id} status updated to ${updated.status}.`);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-cyber-850 border border-cyan-500/50 text-cyan-300 text-xs font-mono shadow-2xl flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={status}
        onReset={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            status={status}
            findings={findings}
            onNavigateTab={handleNavigateToScope}
            onRunScan={handleRunFullScan}
          />
        )}

        {activeTab === 'recon' && <ReconView />}

        {activeTab === 'scanner' && (
          <ScannerHub
            onScanComplete={() => {
              fetchStatus();
              fetchFindings();
            }}
            onNavigateToTriage={() => setActiveTab('triage')}
          />
        )}

        {activeTab === 'triage' && (
          <FindingsTriage
            findings={findings}
            onSelectFinding={(f) => setSelectedFinding(f)}
            activeScopeFilter={scopeFilter}
          />
        )}

        {activeTab === 'poc' && <SafePocLab />}

        {activeTab === 'report' && <NtroReportView />}

        {activeTab === 'pitch' && <JudgePitchMode />}
      </main>

      {/* Finding Detail / CVSS Calculator Modal */}
      {selectedFinding && (
        <FindingModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onUpdate={handleFindingUpdated}
        />
      )}
    </div>
  );
};

export default App;
