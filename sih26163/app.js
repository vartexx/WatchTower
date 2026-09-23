const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('[data-view]');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3200);
}

function switchView(viewName) {
  views.forEach((view) => view.classList.toggle('active', view.id === viewName));
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === viewName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach((item) => item.addEventListener('click', () => switchView(item.dataset.view)));

const findings = {
  idor: { tag: 'CRITICAL / WM-004', title: 'Missing authorization on report export', description: 'The report export endpoint accepts a valid session token but does not verify that the requested report belongs to the authenticated principal. A controlled identifier mutation returned a redacted record owned by another test user.', component: '/api/v1/reports/export', cvss: '9.1 Critical', impact: 'Confidentiality: High · Integrity: Low · Availability: None' },
  session: { tag: 'HIGH / WM-002', title: 'Session token persists after logout', description: 'A revoked session remains accepted by the controlled authentication fixture after logout. This increases the window for replay if a token is exposed.', component: 'Authentication session layer', cvss: '8.1 High', impact: 'Confidentiality: High · Integrity: High · Availability: None' },
  cors: { tag: 'MEDIUM / WM-007', title: 'Over-permissive CORS policy', description: 'The API gateway reflects arbitrary origins in the controlled environment, allowing browser-based cross-origin requests where credentialed access is enabled.', component: 'API gateway response policy', cvss: '5.4 Medium', impact: 'Confidentiality: Low · Integrity: Low · Availability: None' },
  headers: { tag: 'LOW / WM-011', title: 'Missing security response headers', description: 'The web surface does not consistently emit hardening headers such as Content-Security-Policy and Permissions-Policy. This increases defense-in-depth gaps.', component: 'worldmonitor.app web surface', cvss: '3.7 Low', impact: 'Confidentiality: Low · Integrity: Low · Availability: None' }
};

function renderFinding(key = 'idor') {
  const finding = findings[key];
  document.getElementById('findingDetail').innerHTML = `<span class="detail-tag">${finding.tag}</span><h3>${finding.title}</h3><p>${finding.description}</p><div class="detail-grid"><div><label>AFFECTED COMPONENT</label><strong>${finding.component}</strong></div><div><label>CVSS v3.1</label><strong>${finding.cvss}</strong></div><div><label>BUSINESS IMPACT</label><strong>${finding.impact}</strong></div><div><label>CONFIDENCE</label><strong class="lime-text">High · 3 artifacts</strong></div></div><div class="detail-actions"><button class="primary-btn" id="viewEvidence">▣ View proof of concept</button><button class="secondary-btn" id="remediate">✓ Mark remediation ready</button></div>`;
  document.getElementById('viewEvidence').addEventListener('click', () => switchView('evidence'));
  document.getElementById('remediate').addEventListener('click', () => showToast('Remediation task created in the assessment queue.'));
}

document.querySelectorAll('.finding-row').forEach((row) => row.addEventListener('click', () => {
  document.querySelectorAll('.finding-row').forEach((item) => item.classList.remove('selected'));
  row.classList.add('selected');
  renderFinding(row.dataset.finding);
}));

document.getElementById('runScan').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.innerHTML = '<span>◌</span> Running controlled scan...';
  showToast('Simulation started: mapping 25 authorized assets.');
  window.setTimeout(() => {
    button.disabled = false;
    button.innerHTML = '<span>✓</span> Scan complete';
    document.getElementById('score').textContent = '58';
    document.getElementById('activityList').insertAdjacentHTML('afterbegin', '<div class="activity-item"><span class="activity-icon red">△</span><div><strong>New evidence requires review</strong><span>Authorization mutation captured on export route</span></div><time>now</time></div>');
    showToast('Scan complete: 1 new evidence item needs analyst review.');
    window.setTimeout(() => { button.innerHTML = '<span>▶</span> Run simulated scan'; }, 2200);
  }, 1800);
});

document.getElementById('refreshSurface').addEventListener('click', (event) => {
  event.currentTarget.textContent = '✓ Inventory current';
  showToast('Attack surface inventory refreshed from the simulation fixture.');
});
document.getElementById('newFinding').addEventListener('click', () => showToast('Analyst note mode is ready. Select an asset to attach evidence.'));
document.getElementById('exportReport').addEventListener('click', () => showToast('Assessment package queued: NTRO_WM26163_AEGIS.pdf'));

renderFinding();
window.setInterval(() => {
  const now = new Date();
  document.getElementById('clock').textContent = `${now.toISOString().slice(11, 19)} UTC`;
}, 1000);