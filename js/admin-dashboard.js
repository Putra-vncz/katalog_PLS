// ============================================
// E-KATALOG PLS UNPATTI — Admin Dashboard JS
// ============================================

// Auth check
if (sessionStorage.getItem('ekatalog_admin_logged_in') !== 'true') {
  window.location.href = 'admin.html';
}

let currentSector = 0;
let editingJobIdx = -1;

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  loadPengantar();
  loadKarier();
  loadAlumni();
  loadPanduan();
  loadKontak();
  loadBranding();
  loadSettings();
});

// === PANEL NAVIGATION ===
function showPanel(name) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-sidebar__item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.admin-bottomnav__item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.admin-moresheet__item').forEach(i => i.classList.remove('active'));

  const panel = document.getElementById('panel-' + name);
  const sidebarItems = document.querySelectorAll(`.admin-sidebar__item[data-panel="${name}"]`);
  const bottomnavItems = document.querySelectorAll(`.admin-bottomnav__item[data-panel="${name}"]`);
  const moresheetItems = document.querySelectorAll(`.admin-moresheet__item[data-panel="${name}"]`);

  if (panel) panel.classList.add('active');
  sidebarItems.forEach(i => i.classList.add('active'));
  bottomnavItems.forEach(i => i.classList.add('active'));
  moresheetItems.forEach(i => i.classList.add('active'));

  // Update Topbar Title
  const titles = {
    'dashboard': 'Dashboard',
    'pengantar': 'Kata Pengantar',
    'karier': 'Manajemen Karier',
    'alumni': 'Profil Alumni',
    'panduan': 'Panduan Karier',
    'kontak': 'Kontak & QR',
    'branding': 'Branding / Hero',
    'settings': 'Pengaturan'
  };
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = titles[name] || 'Admin Panel';

  // Refresh data when switching
  if (name === 'dashboard') loadDashboard();
  if (name === 'karier') loadKarier();
  if (name === 'alumni') loadAlumni();
}

function toggleMoreSheet() {
  const overlay = document.getElementById('moresheet-overlay');
  const sheet = document.getElementById('admin-moresheet');
  if (overlay) overlay.classList.toggle('active');
  if (sheet) sheet.classList.toggle('active');
}

// === TOAST ===
function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.innerHTML = `<span class="toast__icon">${icons[type] || '✅'}</span><span>${msg}</span><span class="toast__close" onclick="this.parentElement.remove()">✕</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// === MODAL ===
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('active');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// === SLIDE OVER ===
function openSlideOver(title, bodyHTML) {
  document.getElementById('slideover-title').textContent = title;
  document.getElementById('slideover-body').innerHTML = bodyHTML;
  document.getElementById('slideover-overlay').classList.add('active');
  document.getElementById('slideover').classList.add('active');
}
function closeSlideOver() {
  document.getElementById('slideover-overlay').classList.remove('active');
  document.getElementById('slideover').classList.remove('active');
}

// === LOGOUT ===
function logout() {
  sessionStorage.removeItem('ekatalog_admin_logged_in');
  Storage.addLog('Admin logout');
  window.location.href = 'admin.html';
}

// === DASHBOARD ===
function loadDashboard() {
  const data = Storage.get();
  const totalSectors = data.karierSectors ? data.karierSectors.length : 0;
  const totalJobs = data.karierSectors ? data.karierSectors.reduce((a, s) => a + s.jobs.length, 0) : 0;
  const totalAlumni = data.alumni ? data.alumni.length : 0;
  const lastUp = data.settings?.lastUpdated ? new Date(data.settings.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card"><div class="stat-card__label">Total Sektor</div><div class="stat-card__value">${totalSectors}</div></div>
    <div class="stat-card stat-card--accent"><div class="stat-card__label">Total Jabatan</div><div class="stat-card__value">${totalJobs}</div></div>
    <div class="stat-card stat-card--green"><div class="stat-card__label">Total Alumni</div><div class="stat-card__value">${totalAlumni}</div></div>
    <div class="stat-card stat-card--gold"><div class="stat-card__label">Terakhir Diperbarui</div><div class="stat-card__value" style="font-size:var(--text-lg);">${lastUp}</div></div>`;

  const log = data.activityLog || [];
  const logEl = document.getElementById('activity-log');
  if (log.length === 0) {
    logEl.innerHTML = '<p style="color:var(--color-text-light);font-size:var(--text-sm);">Belum ada aktivitas.</p>';
  } else {
    logEl.innerHTML = log.slice(0, 10).map(l => {
      const d = new Date(l.time);
      return `<div class="activity-item"><div class="activity-dot"></div><div><div>${l.action}</div><div class="activity-time">${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit'})}</div></div></div>`;
    }).join('');
  }
}

// === KATA PENGANTAR ===
let _pengantarPhotoData = null;

function loadPengantar() {
  const d = Storage.get('kataPengantar');
  document.getElementById('pengantar-quote').value = d.quote || '';
  document.getElementById('pengantar-name').value = d.authorName || '';
  document.getElementById('pengantar-title').value = d.authorTitle || '';
  // Load existing photo
  if (d.authorImage) {
    _pengantarPhotoData = d.authorImage;
    const thumb = `<img src="${d.authorImage}" style="width:100%;height:100%;object-fit:cover;">`;
    document.getElementById('pengantar-photo-preview').innerHTML = thumb;
    document.getElementById('pengantar-preview-photo').innerHTML = thumb;
  }
  updatePengantarPreview();
  // Live preview
  ['pengantar-quote', 'pengantar-name', 'pengantar-title'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePengantarPreview);
  });
}

function handlePengantarPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    _pengantarPhotoData = ev.target.result;
    const thumb = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
    document.getElementById('pengantar-photo-preview').innerHTML = thumb;
    document.getElementById('pengantar-preview-photo').innerHTML = thumb;
  };
  reader.readAsDataURL(file);
}

function updatePengantarPreview() {
  document.getElementById('pengantar-preview').textContent = document.getElementById('pengantar-quote').value;
  document.getElementById('pengantar-preview-name').textContent = document.getElementById('pengantar-name').value;
  document.getElementById('pengantar-preview-title').textContent = document.getElementById('pengantar-title').value;
}

function savePengantar() {
  const existing = Storage.get('kataPengantar') || {};
  Storage.set('kataPengantar', {
    quote: document.getElementById('pengantar-quote').value,
    authorName: document.getElementById('pengantar-name').value,
    authorTitle: document.getElementById('pengantar-title').value,
    authorImage: _pengantarPhotoData || existing.authorImage || '',
  });
  Storage.addLog('Kata Pengantar diperbarui');
  showToast('Kata Pengantar berhasil disimpan!');
}

// === KARIER ===
function loadKarier() {
  const sectors = Storage.get('karierSectors') || [];
  const tabsEl = document.getElementById('karier-tabs');
  tabsEl.innerHTML = sectors.map((s, i) => `<div class="tab ${i === currentSector ? 'active' : ''}" onclick="switchSector(${i})">${s.icon} ${s.title.split('(')[0].trim().split(' ').slice(0,3).join(' ')}</div>`).join('');
  renderJobTable();
}

function switchSector(i) {
  currentSector = i;
  loadKarier();
}

function renderJobTable() {
  const sectors = Storage.get('karierSectors') || [];
  const s = sectors[currentSector];
  if (!s) return;
  const tbody = document.getElementById('karier-tbody');
  tbody.innerHTML = s.jobs.map((j, i) => `<tr>
    <td><strong>${j.title}</strong></td>
    <td style="max-width:300px;">${j.desc}</td>
    <td>${(j.institutions || []).join(', ')}</td>
    <td><button class="btn btn--ghost btn--sm" onclick="editJob(${i})">✏️</button><button class="btn btn--ghost btn--sm" onclick="deleteJob(${i})" style="color:var(--color-error);">🗑</button></td>
  </tr>`).join('');
}

function openAddJob() {
  editingJobIdx = -1;
  const sectors = Storage.get('karierSectors') || [];
  openSlideOver('Tambah Jabatan', `
    <div class="form-group"><label class="form-label">Sektor</label>
      <select class="form-input form-select" id="job-sector">${sectors.map((s,i) => `<option value="${i}" ${i===currentSector?'selected':''}>${s.title}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Nama Jabatan</label><input class="form-input" id="job-title" type="text"></div>
    <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-input form-textarea" id="job-desc" rows="3"></textarea></div>
    <div class="form-group"><label class="form-label">Instansi (pisahkan dengan koma)</label><input class="form-input" id="job-inst" type="text"></div>
    <button class="btn btn--primary" onclick="saveJob()" style="width:100%;margin-top:var(--space-4);">Simpan Jabatan</button>`);
}

function editJob(idx) {
  editingJobIdx = idx;
  const sectors = Storage.get('karierSectors') || [];
  const job = sectors[currentSector].jobs[idx];
  openSlideOver('Edit Jabatan', `
    <div class="form-group"><label class="form-label">Nama Jabatan</label><input class="form-input" id="job-title" type="text" value="${job.title}"></div>
    <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-input form-textarea" id="job-desc" rows="3">${job.desc}</textarea></div>
    <div class="form-group"><label class="form-label">Instansi (pisahkan dengan koma)</label><input class="form-input" id="job-inst" type="text" value="${(job.institutions||[]).join(', ')}"></div>
    <button class="btn btn--primary" onclick="saveJob()" style="width:100%;margin-top:var(--space-4);">Simpan Perubahan</button>`);
}

function saveJob() {
  const sectors = Storage.get('karierSectors') || [];
  const sIdx = editingJobIdx === -1 ? parseInt(document.getElementById('job-sector')?.value || currentSector) : currentSector;
  const job = {
    title: document.getElementById('job-title').value.trim(),
    desc: document.getElementById('job-desc').value.trim(),
    institutions: document.getElementById('job-inst').value.split(',').map(s => s.trim()).filter(Boolean),
  };
  if (!job.title) { showToast('Nama jabatan wajib diisi', 'error'); return; }
  if (editingJobIdx === -1) {
    sectors[sIdx].jobs.push(job);
  } else {
    sectors[sIdx].jobs[editingJobIdx] = job;
  }
  Storage.set('karierSectors', sectors);
  Storage.addLog(editingJobIdx === -1 ? `Jabatan "${job.title}" ditambahkan` : `Jabatan "${job.title}" diperbarui`);
  closeSlideOver();
  currentSector = sIdx;
  loadKarier();
  showToast('Jabatan berhasil disimpan!');
}

function deleteJob(idx) {
  if (!confirm('Hapus jabatan ini?')) return;
  const sectors = Storage.get('karierSectors') || [];
  const name = sectors[currentSector].jobs[idx].title;
  sectors[currentSector].jobs.splice(idx, 1);
  Storage.set('karierSectors', sectors);
  Storage.addLog(`Jabatan "${name}" dihapus`);
  loadKarier();
  showToast('Jabatan dihapus.', 'warning');
}

// === ALUMNI ===
function loadAlumni() {
  const alumni = Storage.get('alumni') || [];
  const grid = document.getElementById('alumni-admin-grid');
  grid.innerHTML = alumni.map((a, i) => `
    <div class="admin-alumni-card">
      <div class="admin-alumni-card__actions">
        <button class="btn btn--ghost btn--sm" onclick="editAlumni(${i})">✏️</button>
        <button class="btn btn--ghost btn--sm" onclick="deleteAlumni(${i})" style="color:var(--color-error);">🗑</button>
      </div>
      <div style="width:64px;height:64px;border-radius:50%;margin:0 auto var(--space-3);background:var(--color-bg-primary);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:var(--color-primary);overflow:hidden;">
        ${a.photo ? `<img src="${a.photo}" style="width:100%;height:100%;object-fit:cover;">` : a.name.charAt(0)}
      </div>
      <h4 style="font-size:var(--text-base);font-weight:700;">${a.name}</h4>
      <p style="font-size:var(--text-xs);color:var(--color-text-muted);">Lulus ${a.year}</p>
      <p style="font-size:var(--text-sm);margin-top:var(--space-2);"><strong>${a.job}</strong><br>${a.institution}</p>
    </div>`).join('');
}

function openAddAlumni() { showAlumniForm(-1); }
function editAlumni(idx) { showAlumniForm(idx); }

function showAlumniForm(idx) {
  const alumni = Storage.get('alumni') || [];
  const a = idx >= 0 ? alumni[idx] : { name:'', year:'', job:'', institution:'', quote:'', photo:'', linkedin:'' };
  openModal(idx >= 0 ? 'Edit Alumni' : 'Tambah Alumni', `
    <div class="form-group"><label class="form-label">Foto (URL atau upload)</label>
      <input class="form-input" id="alum-photo" type="text" value="${a.photo || ''}" placeholder="URL gambar atau gunakan upload">
      <input type="file" accept="image/*" onchange="handleAlumniPhoto(event)" style="margin-top:var(--space-2);font-size:var(--text-sm);">
    </div>
    <div class="form-group"><label class="form-label">Nama Lengkap</label><input class="form-input" id="alum-name" value="${a.name}"></div>
    <div class="modal-form-row">
      <div class="form-group"><label class="form-label">Tahun Lulus</label><input class="form-input" id="alum-year" value="${a.year}"></div>
      <div class="form-group"><label class="form-label">LinkedIn URL</label><input class="form-input" id="alum-linkedin" value="${a.linkedin || ''}"></div>
    </div>
    <div class="form-group"><label class="form-label">Jabatan Saat Ini</label><input class="form-input" id="alum-job" value="${a.job}"></div>
    <div class="form-group"><label class="form-label">Institusi</label><input class="form-input" id="alum-inst" value="${a.institution}"></div>
    <div class="form-group"><label class="form-label">Quote / Pesan</label><textarea class="form-input form-textarea" id="alum-quote" rows="3">${a.quote}</textarea></div>
    <button class="btn btn--primary" onclick="saveAlumni(${idx})" style="width:100%;margin-top:var(--space-2);">Simpan Alumni</button>`);
}

function handleAlumniPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { document.getElementById('alum-photo').value = ev.target.result; };
  reader.readAsDataURL(file);
}

function saveAlumni(idx) {
  const alumni = Storage.get('alumni') || [];
  const a = {
    id: idx >= 0 ? alumni[idx].id : 'alumni-' + Date.now(),
    name: document.getElementById('alum-name').value.trim(),
    year: document.getElementById('alum-year').value.trim(),
    job: document.getElementById('alum-job').value.trim(),
    institution: document.getElementById('alum-inst').value.trim(),
    quote: document.getElementById('alum-quote').value.trim(),
    photo: document.getElementById('alum-photo').value.trim(),
    linkedin: document.getElementById('alum-linkedin').value.trim(),
  };
  if (!a.name) { showToast('Nama wajib diisi', 'error'); return; }
  if (idx >= 0) { alumni[idx] = a; } else { alumni.push(a); }
  Storage.set('alumni', alumni);
  Storage.addLog(idx >= 0 ? `Alumni "${a.name}" diperbarui` : `Alumni "${a.name}" ditambahkan`);
  closeModal();
  loadAlumni();
  showToast('Alumni berhasil disimpan!');
}

function deleteAlumni(idx) {
  if (!confirm('Hapus alumni ini?')) return;
  const alumni = Storage.get('alumni') || [];
  const name = alumni[idx].name;
  alumni.splice(idx, 1);
  Storage.set('alumni', alumni);
  Storage.addLog(`Alumni "${name}" dihapus`);
  loadAlumni();
  showToast('Alumni dihapus.', 'warning');
}

// === PANDUAN ===
function loadPanduan() {
  const steps = Storage.get('panduanKarier') || [];
  const el = document.getElementById('panduan-editors');
  el.innerHTML = steps.map((s, i) => `
    <div class="step-editor">
      <div class="step-editor__header">
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <div class="step-editor__number">${s.step}</div>
          <h4 style="font-weight:700;">Langkah ${s.step}</h4>
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <label class="toggle"><input type="checkbox" ${s.visible !== false ? 'checked' : ''} onchange="toggleStep(${i}, this.checked)"><span class="toggle__slider"></span></label>
          <button class="btn btn--ghost btn--sm" onclick="deleteStep(${i})" style="color:var(--color-error);padding:var(--space-1) var(--space-2);" title="Hapus langkah ini">🗑</button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Icon</label><input class="form-input" id="step-icon-${i}" value="${s.icon}" style="width:80px;"></div>
      <div class="form-group"><label class="form-label">Judul</label><input class="form-input" id="step-title-${i}" value="${s.title}"></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-input form-textarea" id="step-desc-${i}" rows="2">${s.desc}</textarea></div>
      <div class="form-group"><label class="form-label">Checklist Items</label>
        <div class="checklist-editor" id="step-checklist-${i}">
          ${s.checklist.map((c, ci) => `<div class="checklist-editor__item">
            <input value="${c}" class="step-check-input" data-step="${i}" data-idx="${ci}">
            <span class="checklist-editor__remove" onclick="removeCheckItem(${i}, ${ci})">✕</span>
          </div>`).join('')}
        </div>
        <button class="btn btn--ghost btn--sm" onclick="addCheckItem(${i})" style="margin-top:var(--space-2);">+ Tambah Item</button>
      </div>
    </div>`).join('');

  // Tambahkan tombol "+ Tambah Langkah" di bagian bawah
  el.insertAdjacentHTML('beforeend', `
    <div style="margin-top:var(--space-4);text-align:center;">
      <button class="btn btn--outline" onclick="addStep()" style="gap:var(--space-2);">
        <span style="font-size:1.2rem;">➕</span> Tambah Langkah
      </button>
    </div>`);
}

function toggleStep(i, visible) {
  const steps = Storage.get('panduanKarier') || [];
  steps[i].visible = visible;
  Storage.set('panduanKarier', steps);
}

function addStep() {
  // Simpan dulu perubahan yang ada sebelum menambah langkah baru
  savePanduan(false);
  const steps = Storage.get('panduanKarier') || [];
  const nextNum = steps.length + 1;
  steps.push({
    step: nextNum,
    icon: '📌',
    title: 'Langkah Baru ' + nextNum,
    desc: 'Deskripsi langkah ' + nextNum,
    checklist: ['Item 1'],
    visible: true,
  });
  Storage.set('panduanKarier', steps);
  Storage.addLog(`Langkah ${nextNum} ditambahkan di Panduan Karier`);
  loadPanduan();
  showToast('Langkah ' + nextNum + ' berhasil ditambahkan!');
  // Scroll ke bawah untuk melihat langkah baru
  setTimeout(() => {
    const editors = document.getElementById('panduan-editors');
    editors.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function deleteStep(idx) {
  const steps = Storage.get('panduanKarier') || [];
  if (steps.length <= 1) { showToast('Minimal harus ada 1 langkah', 'warning'); return; }
  if (!confirm(`Hapus Langkah ${steps[idx].step} "${steps[idx].title}"?`)) return;
  steps.splice(idx, 1);
  // Renumber steps
  steps.forEach((s, i) => { s.step = i + 1; });
  Storage.set('panduanKarier', steps);
  Storage.addLog(`Langkah ${idx + 1} dihapus dari Panduan Karier`);
  loadPanduan();
  showToast('Langkah dihapus.', 'warning');
}

function addCheckItem(stepIdx) {
  const steps = Storage.get('panduanKarier') || [];
  steps[stepIdx].checklist.push('Item baru');
  Storage.set('panduanKarier', steps);
  loadPanduan();
}

function removeCheckItem(stepIdx, itemIdx) {
  const steps = Storage.get('panduanKarier') || [];
  steps[stepIdx].checklist.splice(itemIdx, 1);
  Storage.set('panduanKarier', steps);
  loadPanduan();
}

function savePanduan(showNotification = true) {
  const steps = Storage.get('panduanKarier') || [];
  steps.forEach((s, i) => {
    s.icon = document.getElementById(`step-icon-${i}`)?.value || s.icon;
    s.title = document.getElementById(`step-title-${i}`)?.value || s.title;
    s.desc = document.getElementById(`step-desc-${i}`)?.value || s.desc;
    const inputs = document.querySelectorAll(`.step-check-input[data-step="${i}"]`);
    s.checklist = Array.from(inputs).map(inp => inp.value.trim()).filter(Boolean);
  });
  Storage.set('panduanKarier', steps);
  if (showNotification) {
    Storage.addLog('Panduan Karier diperbarui');
    showToast('Panduan Karier berhasil disimpan!');
  }
}

// === KONTAK ===
function loadKontak() {
  const k = Storage.get('kontak') || {};
  document.getElementById('kontak-address').value = k.address || '';
  document.getElementById('kontak-email').value = k.email || '';
  document.getElementById('kontak-ig').value = k.instagram || '';
  document.getElementById('kontak-web').value = k.website || '';
  document.getElementById('kontak-qr-url').value = k.qrUrl || '';
  generateAdminQR();
}

function generateAdminQR() {
  const url = document.getElementById('kontak-qr-url').value.trim();
  const container = document.getElementById('admin-qr-preview');
  container.innerHTML = '';
  if (url && typeof QRCode !== 'undefined') {
    new QRCode(container, { text: url, width: 160, height: 160, colorDark: '#0A2463', colorLight: '#ffffff' });
  }
}

function saveKontak() {
  Storage.set('kontak', {
    address: document.getElementById('kontak-address').value,
    email: document.getElementById('kontak-email').value,
    instagram: document.getElementById('kontak-ig').value,
    website: document.getElementById('kontak-web').value,
    qrUrl: document.getElementById('kontak-qr-url').value,
  });
  Storage.addLog('Informasi Kontak diperbarui');
  showToast('Kontak berhasil disimpan!');
}

// === BRANDING ===
function loadBranding() {
  const h = Storage.get('hero') || {};
  document.getElementById('hero-edit-title').value = h.title || '';
  document.getElementById('hero-edit-subtitle').value = h.subtitle || '';
  document.getElementById('hero-edit-badge').value = h.badge || '';
}

function saveBranding() {
  Storage.set('hero', {
    title: document.getElementById('hero-edit-title').value,
    subtitle: document.getElementById('hero-edit-subtitle').value,
    badge: document.getElementById('hero-edit-badge').value,
  });
  Storage.addLog('Branding Hero diperbarui');
  showToast('Branding berhasil disimpan!');
}

// === SETTINGS ===
function loadSettings() {
  const s = Storage.get('settings') || {};
  document.getElementById('maintenance-toggle').checked = s.maintenanceMode || false;
}

function changePassword() {
  const newPass = document.getElementById('new-password').value;
  const confirm = document.getElementById('confirm-password').value;
  if (!newPass || newPass.length < 4) { showToast('Password minimal 4 karakter', 'error'); return; }
  if (newPass !== confirm) { showToast('Password tidak cocok', 'error'); return; }
  const settings = Storage.get('settings') || {};
  settings.adminPassword = newPass;
  Storage.set('settings', settings);
  Storage.addLog('Password admin diubah');
  showToast('Password berhasil diubah!');
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
}

function toggleMaintenance() {
  const checked = document.getElementById('maintenance-toggle').checked;
  const settings = Storage.get('settings') || {};
  settings.maintenanceMode = checked;
  Storage.set('settings', settings);
  Storage.addLog(checked ? 'Mode pemeliharaan diaktifkan' : 'Mode pemeliharaan dinonaktifkan');
  showToast(checked ? 'Mode pemeliharaan aktif' : 'Mode pemeliharaan nonaktif', checked ? 'warning' : 'success');
}

function exportData() {
  Storage.downloadJSON();
  Storage.addLog('Data di-export sebagai JSON');
  showToast('Data berhasil di-export!');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = Storage.import(e.target.result);
    if (result.success) {
      Storage.addLog('Data di-import dari JSON');
      showToast('Data berhasil di-import! Halaman akan dimuat ulang.', 'success');
      setTimeout(() => location.reload(), 1500);
    } else {
      showToast('Gagal import: ' + result.error, 'error');
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm('PERINGATAN: Semua data akan dikembalikan ke default. Lanjutkan?')) return;
  if (!confirm('Anda yakin? Tindakan ini tidak dapat dibatalkan.')) return;
  Storage.reset();
  showToast('Data berhasil direset ke default. Halaman akan dimuat ulang.', 'warning');
  setTimeout(() => location.reload(), 1500);
}
