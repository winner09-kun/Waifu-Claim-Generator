<template>
  <div class="app">
    <!-- Interactive dot grid background -->
    <div class="dot-grid" aria-hidden="true" />

    <!-- Nav -->
    <nav class="nav">
      <span class="nav-logo">WaifuCert</span>
      <span class="nav-tag">Beta</span>
    </nav>

    <!-- Main container -->
    <main class="container">

      <!-- ── FORM STATE ── -->
      <section v-if="!certificateUrl" class="panel">
        <header class="panel__header">
          <p class="overline">Sertifikasi Resmi</p>
          <h1 class="headline">Klaim Waifumu<br />Secara Resmi</h1>
          <p class="body-text">Masukkan namamu dan nama karakter waifu dari MyAnimeList — kami akan membuat sertifikat klaim resmi untukmu.</p>
        </header>

        <div class="form">
          <!-- Nama Kamu -->
          <div class="field">
            <label class="label" for="userName">Nama Kamu</label>
            <div class="input-wrap" :class="{ 'input-wrap--focus': focusedField === 'user', 'input-wrap--error': !!error && !userName.trim() }">
              <input
                id="userName"
                v-model="userName"
                type="text"
                class="input"
                placeholder="Masukkan namamu..."
                autocomplete="off"
                @focus="focusedField = 'user'"
                @blur="focusedField = null"
                @keydown.enter="handleGenerate"
              />
            </div>
          </div>

          <!-- Nama Waifu -->
          <div class="field">
            <label class="label" for="waifuName">Nama Waifu</label>
            <div class="input-wrap" :class="{ 'input-wrap--focus': focusedField === 'waifu', 'input-wrap--error': !!error && !waifuName.trim() }">
              <input
                id="waifuName"
                v-model="waifuName"
                type="text"
                class="input"
                placeholder="Misalnya: Zero Two, Rem, Miku..."
                autocomplete="off"
                @focus="focusedField = 'waifu'"
                @blur="focusedField = null"
                @keydown.enter="handleGenerate"
              />
            </div>
            <p class="hint">Nama karakter dari MyAnimeList akan dicari otomatis</p>
          </div>

          <!-- Error banner -->
          <Transition name="slide-down">
            <div v-if="error" class="error-banner" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v3M8 10.5v.5M1.5 13.5h13L8 2 1.5 13.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>{{ error }}</span>
            </div>
          </Transition>

          <!-- Loading skeleton -->
          <Transition name="fade">
            <div v-if="isLoading" class="skeleton-wrap" aria-label="Memproses...">
              <div class="skeleton-row">
                <div class="skeleton skeleton--avatar" />
                <div class="skeleton-lines">
                  <div class="skeleton skeleton--line" style="width:70%" />
                  <div class="skeleton skeleton--line" style="width:50%" />
                  <div class="skeleton skeleton--line" style="width:35%" />
                </div>
              </div>
              <div class="loading-stage">
                <div class="stage-dot" />
                <span>{{ loadingStage }}</span>
              </div>
            </div>
          </Transition>

          <!-- CTA button -->
          <button
            class="btn-primary"
            :disabled="isLoading || !userName.trim() || !waifuName.trim()"
            @click="handleGenerate"
          >
            <Transition name="fade" mode="out-in">
              <span v-if="isLoading" key="loading" class="btn-inner">
                <span class="spinner" />
                Memproses...
              </span>
              <span v-else key="idle" class="btn-inner">
                Buat Sertifikat
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </Transition>
          </button>
        </div>
      </section>

      <!-- ── RESULT STATE ── -->
      <Transition name="zoom-in">
        <section v-if="certificateUrl" class="panel panel--result">
          <div class="result-header">
            <span class="status-chip status-chip--success">
              <span class="status-dot" />
              Berhasil Dibuat
            </span>
            <h2 class="subhead">Sertifikat Siap</h2>
            <p class="body-text">Sertifikat klaim resmi kamu sudah siap. Unduh dan simpan sebagai bukti sahmu!</p>
          </div>

          <div class="cert-frame">
            <img
              :src="certificateUrl"
              alt="Sertifikat Hak Klaim Waifu"
              class="cert-image"
            />
          </div>

          <div class="result-actions">
            <button class="btn-primary" @click="download(`waifu-cert-${waifuName}.png`)">
              <span class="btn-inner">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3M2 11v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Unduh Sertifikat
              </span>
            </button>
            <button class="btn-ghost" @click="handleReset">
              Klaim Lagi
            </button>
          </div>
        </section>
      </Transition>

    </main>

    <!-- Footer -->
    <footer class="footer">
      <span>Powered by MyAnimeList · waifu.pics · Sharp.js</span>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCertificate } from './composables/useCertificate.js';

const userName     = ref('');
const waifuName    = ref('');
const focusedField = ref(null);

const { isLoading, loadingStage, error, certificateUrl, generate, download, reset } = useCertificate();

async function handleGenerate() {
  if (!userName.value.trim() || !waifuName.value.trim()) return;
  await generate(userName.value, waifuName.value);
}

function handleReset() {
  reset();
}
</script>

<style>
/* ─── Fonts ──────────────────────────────────────────── */
@import url('https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');

/* ─── Design Tokens ──────────────────────────────────── */
:root {
  /* Colors */
  --primary:        #6366F1;
  --primary-hover:  #4F46E5;
  --neutral:        #9C9C9C;
  --bg:             #FAFAFA;
  --surface:        #FFFFFF;
  --text-primary:   #0A0A0A;
  --text-secondary: #6B6B6B;
  --border:         #E8E8EC;
  --success:        #10B981;
  --warning:        #F59E0B;
  --error:          #EF4444;

  /* Typography */
  --font-display: 'General Sans', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm:   4px;
  --radius-btn:  6px;
  --radius-card: 12px;
  --radius-full: 9999px;

  /* Elevation */
  --shadow-hover: 0 8px 30px rgba(0,0,0,0.08);
  --shadow-focus: 0 0 0 3px rgba(99,102,241,0.12);
  --shadow-btn:   0 4px 12px rgba(99,102,241,0.35);
}

/* ─── Reset ──────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-primary);
  min-height: 100dvh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ─── Dot Grid Background ────────────────────────────── */
.dot-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: radial-gradient(circle, #D1D5DB 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.45;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

/* ─── App Layout ─────────────────────────────────────── */
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* ─── Nav ────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  background: rgba(250,250,250,0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  max-width: 1280px;
  margin: 0 auto;
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.nav-tag {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary);
  background: rgba(99,102,241,0.08);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(99,102,241,0.2);
}

/* ─── Container ──────────────────────────────────────── */
.container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 64px 24px 40px;
  flex: 1;
}

/* ─── Panel (Card) ───────────────────────────────────── */
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.panel:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
.panel--result {
  max-width: 580px;
  width: 100%;
}

/* ─── Panel Header ───────────────────────────────────── */
.panel__header {
  padding: 32px 32px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ─── Typography ─────────────────────────────────────── */
.overline {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
}

.headline {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--text-primary);
}

.subhead {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.body-text {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* ─── Form ───────────────────────────────────────────── */
.form {
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.hint {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--neutral);
}

/* ─── Input ──────────────────────────────────────────── */
.input-wrap {
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
  transition: border-color 150ms, box-shadow 150ms;
}
.input-wrap--focus {
  border-color: var(--primary);
  box-shadow: var(--shadow-focus);
}
.input-wrap--error {
  border-color: var(--error);
}

.input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-primary);
  padding: 10px 14px;
  border-radius: var(--radius-btn);
}
.input::placeholder {
  color: var(--neutral);
}

/* ─── Error Banner ───────────────────────────────────── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239,68,68,0.06);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--radius-btn);
  padding: 10px 14px;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--error);
}

/* ─── Skeleton ───────────────────────────────────────── */
.skeleton-wrap {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.skeleton {
  background: linear-gradient(90deg, #E8E8EC 25%, #F4F4F6 50%, #E8E8EC 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--radius-sm);
}
.skeleton--avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.skeleton--line {
  height: 10px;
  border-radius: var(--radius-sm);
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.loading-stage {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-secondary);
}
.stage-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--primary);
  animation: pulse 1s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.75); }
}

/* ─── Buttons ────────────────────────────────────────── */
.btn-primary {
  width: 100%;
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: var(--radius-btn);
  background: var(--primary);
  color: #fff;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms, transform 150ms, box-shadow 150ms;
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-btn);
}
.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}
.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-ghost {
  width: 100%;
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: color 150ms, transform 150ms;
}
.btn-ghost:hover {
  color: var(--text-primary);
  transform: translateY(-1px);
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* ─── Spinner ────────────────────────────────────────── */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Status Chip ────────────────────────────────────── */
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--radius-full);
  padding: 4px 12px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
}
.status-chip--success {
  background: rgba(16,185,129,0.08);
  color: var(--success);
  border: 1px solid rgba(16,185,129,0.2);
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: currentColor;
}

/* ─── Result ─────────────────────────────────────────── */
.result-header {
  padding: 32px 32px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cert-frame {
  margin: 24px 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: box-shadow 200ms;
}
.cert-frame:hover {
  box-shadow: var(--shadow-hover);
}
.cert-image {
  width: 100%;
  height: auto;
  display: block;
}

.result-actions {
  padding: 0 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ─── Footer ─────────────────────────────────────────── */
.footer {
  position: relative;
  z-index: 1;
  padding: 32px 24px;
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--neutral);
  text-align: center;
  letter-spacing: 0.02em;
}

/* ─── Vue Transitions ────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.fade-enter-from { opacity: 0; transform: translateY(4px); }
.fade-leave-to   { opacity: 0; transform: translateY(-4px); }

.slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.25s, transform 0.25s; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to   { opacity: 0; transform: translateY(-8px); }

.zoom-in-enter-active { transition: all 0.4s cubic-bezier(0.34,1.4,0.64,1); }
.zoom-in-enter-from   { opacity: 0; transform: scale(0.94) translateY(8px); }
.zoom-in-leave-active { transition: all 0.2s ease-in; }
.zoom-in-leave-to     { opacity: 0; transform: scale(0.97); }

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 540px) {
  .container { padding: 32px 16px 32px; }
  .panel__header { padding: 24px 20px 0; }
  .form { padding: 20px 20px 24px; }
  .result-header { padding: 24px 20px 0; }
  .cert-frame { margin: 20px; }
  .result-actions { padding: 0 20px 24px; }
  .headline { font-size: 26px; }
}
</style>
