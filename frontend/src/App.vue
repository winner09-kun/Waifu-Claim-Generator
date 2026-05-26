<template>
  <div class="app">
    <!-- ── Ambient particles ── -->
    <div class="particles" aria-hidden="true">
      <span v-for="i in 18" :key="i" class="particle" :style="particleStyle(i)" />
    </div>

    <!-- ── Main card ── -->
    <main class="card" :class="{ 'card--result': !!certificateUrl }">

      <!-- Header -->
      <header class="card__header">
        <div class="header-glyph">🏮</div>
        <h1 class="header-title">Waifu Claim<span class="accent">Cert</span></h1>
        <p class="header-sub">Klaim waifumu secara resmi &amp; legal ✨</p>
      </header>

      <!-- ── FORM STATE ── -->
      <section v-if="!certificateUrl" class="form-section">
        <div class="input-group">
          <label class="label" for="userName">Nama Kamu</label>
          <div class="input-wrap" :class="{ 'input-wrap--focused': focusedField === 'user' }">
            <span class="input-icon">👤</span>
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

        <div class="input-group">
          <label class="label" for="waifuName">Nama Waifu</label>
          <div class="input-wrap" :class="{ 'input-wrap--focused': focusedField === 'waifu' }">
            <span class="input-icon">🌸</span>
            <input
              id="waifuName"
              v-model="waifuName"
              type="text"
              class="input"
              placeholder="Misalnya: Zero Two, Rem..."
              autocomplete="off"
              @focus="focusedField = 'waifu'"
              @blur="focusedField = null"
              @keydown.enter="handleGenerate"
            />
          </div>
          <p class="input-hint">Nama karakter dari MyAnimeList akan dicari otomatis</p>
        </div>

        <!-- Error banner -->
        <Transition name="slide-down">
          <div v-if="error" class="error-banner" role="alert">
            <span>⚠️</span>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Claim button -->
        <button
          class="btn-claim"
          :disabled="isLoading || !userName.trim() || !waifuName.trim()"
          @click="handleGenerate"
        >
          <Transition name="fade" mode="out-in">
            <!-- Loading state -->
            <span v-if="isLoading" key="loading" class="btn-inner">
              <span class="spinner" />
              <span class="loading-text">{{ loadingStage }}</span>
            </span>
            <!-- Idle state -->
            <span v-else key="idle" class="btn-inner">
              <span class="btn-icon">🎌</span>
              <span>Klaim Sekarang!</span>
            </span>
          </Transition>
        </button>

        <!-- Loading skeleton preview -->
        <Transition name="fade">
          <div v-if="isLoading" class="skeleton-preview" aria-label="Sedang memproses...">
            <div class="skeleton-bar skeleton-bar--short" />
            <div class="skeleton-cert">
              <div class="skeleton-photo" />
              <div class="skeleton-lines">
                <div class="skeleton-line skeleton-line--wide" />
                <div class="skeleton-line skeleton-line--medium" />
                <div class="skeleton-line skeleton-line--narrow" />
              </div>
            </div>
            <div class="skeleton-progress">
              <div class="skeleton-progress-fill" />
            </div>
          </div>
        </Transition>
      </section>

      <!-- ── RESULT STATE ── -->
      <Transition name="zoom-in">
        <section v-if="certificateUrl" class="result-section">
          <div class="result-badge">🎉 Berhasil Diklaim!</div>
          <div class="cert-preview-wrap">
            <img
              :src="certificateUrl"
              alt="Sertifikat Hak Klaim Waifu"
              class="cert-image"
              @load="certImageLoaded = true"
            />
            <div class="cert-shimmer" />
          </div>

          <div class="result-actions">
            <button class="btn-download" @click="download(`waifu-cert-${waifuName}.png`)">
              <span>⬇️</span> Unduh Sertifikat
            </button>
            <button class="btn-secondary" @click="handleReset">
              <span>🔄</span> Klaim Lagi
            </button>
          </div>
        </section>
      </Transition>

    </main>

    <!-- Footer -->
    <footer class="app-footer">
      Powered by MyAnimeList • waifu.pics • Sharp.js
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCertificate } from './composables/useCertificate.js';

const userName   = ref('');
const waifuName  = ref('');
const focusedField = ref(null);
const certImageLoaded = ref(false);

const { isLoading, loadingStage, error, certificateUrl, generate, download, reset } = useCertificate();

async function handleGenerate() {
  if (!userName.value.trim() || !waifuName.value.trim()) return;
  await generate(userName.value, waifuName.value);
}

function handleReset() {
  reset();
  certImageLoaded.value = false;
}

// Pseudo-random but deterministic particle positions from index
function particleStyle(i) {
  const x = ((i * 37 + 11) % 97);
  const y = ((i * 53 + 7)  % 93);
  const s = 0.4 + (i % 5) * 0.2;
  const d = (i * 0.7).toFixed(1);
  const dur = 4 + (i % 6);
  return {
    left: `${x}%`,
    top:  `${y}%`,
    transform: `scale(${s})`,
    animationDelay: `${d}s`,
    animationDuration: `${dur}s`,
  };
}
</script>

<style>
/* ─── Fonts ──────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Noto+Sans+JP:wght@300;400;600&display=swap');

/* ─── CSS Variables ──────────────────────────────────── */
:root {
  --bg:         #07060f;
  --surface:    #110d22;
  --surface2:   #1a1133;
  --border:     rgba(196,160,80,0.25);
  --gold:       #c9a84c;
  --gold-light: #f5d78e;
  --pink:       #ff6bab;
  --pink-light: #ff9de2;
  --purple:     #9b59b6;
  --text:       #f0e8ff;
  --text-muted: #8a7fa0;
  --radius:     20px;
  --shadow:     0 24px 80px rgba(0,0,0,0.7);
}

/* ─── Reset ──────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Noto Sans JP', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100dvh;
  overflow-x: hidden;
}

/* ─── App layout ─────────────────────────────────────── */
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
}

/* ─── Particles ──────────────────────────────────────── */
.particles { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
.particle {
  position: absolute;
  width: 6px; height: 6px;
  background: radial-gradient(circle, var(--pink-light), transparent);
  border-radius: 50%;
  opacity: 0;
  animation: float linear infinite;
}
@keyframes float {
  0%   { opacity: 0; transform: translateY(20px) scale(var(--s, 1)); }
  20%  { opacity: 0.6; }
  80%  { opacity: 0.3; }
  100% { opacity: 0; transform: translateY(-60px) scale(var(--s, 1)); }
}

/* ─── Card ───────────────────────────────────────────── */
.card {
  position: relative; z-index: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow), 0 0 0 1px rgba(255,107,171,0.08) inset;
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  transition: max-width 0.5s cubic-bezier(0.34,1.56,0.64,1);
}
.card--result { max-width: 660px; }

/* ─── Card Header ────────────────────────────────────── */
.card__header {
  padding: 2.4rem 2rem 2rem;
  text-align: center;
  background: linear-gradient(180deg, #1e0535 0%, transparent 100%);
  border-bottom: 1px solid var(--border);
}
.header-glyph { font-size: 2.8rem; line-height: 1; margin-bottom: 0.5rem; }
.header-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text);
}
.header-title .accent { color: var(--pink); }
.header-sub {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

/* ─── Form Section ───────────────────────────────────── */
.form-section { padding: 2rem; display: flex; flex-direction: column; gap: 1.4rem; }

.input-group { display: flex; flex-direction: column; gap: 0.5rem; }
.label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
}
.input-hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem; }

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--surface2);
  border: 1.5px solid rgba(196,160,80,0.2);
  border-radius: 12px;
  padding: 0 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-wrap--focused {
  border-color: var(--pink);
  box-shadow: 0 0 0 3px rgba(255,107,171,0.15);
}
.input-icon { font-size: 1.1rem; margin-right: 0.6rem; flex-shrink: 0; }
.input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.95rem;
  color: var(--text);
  padding: 0.9rem 0;
}
.input::placeholder { color: var(--text-muted); }

/* ─── Error Banner ───────────────────────────────────── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255,80,80,0.12);
  border: 1px solid rgba(255,80,80,0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #ff8585;
}

/* ─── Claim Button ───────────────────────────────────── */
.btn-claim {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #d4156e 0%, #ff6bab 50%, #d4156e 100%);
  background-size: 200% 200%;
  color: white;
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 24px rgba(255,107,171,0.35);
  animation: btnShimmer 3s ease infinite;
}
@keyframes btnShimmer {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
.btn-claim:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255,107,171,0.5);
}
.btn-claim:active:not(:disabled) { transform: translateY(0); }
.btn-claim:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-icon { font-size: 1.2rem; }

/* ─── Spinner ────────────────────────────────────────── */
.spinner {
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.loading-text {
  font-size: 0.88rem;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 400;
  letter-spacing: 0.02em;
  min-width: 240px;
  text-align: left;
}

/* ─── Skeleton Preview ───────────────────────────────── */
.skeleton-preview {
  background: var(--surface2);
  border: 1px dashed rgba(196,160,80,0.2);
  border-radius: 14px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.skeleton-bar {
  height: 10px;
  background: linear-gradient(90deg, var(--surface2) 25%, rgba(255,107,171,0.15) 50%, var(--surface2) 75%);
  background-size: 200% 100%;
  border-radius: 99px;
  animation: shimmer 1.5s infinite;
}
.skeleton-bar--short { width: 55%; }
.skeleton-cert { display: flex; gap: 1rem; align-items: center; }
.skeleton-photo {
  width: 64px; height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(90deg, var(--surface2) 25%, rgba(255,107,171,0.15) 50%, var(--surface2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite 0.1s;
}
.skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.skeleton-line {
  height: 10px; border-radius: 99px;
  background: linear-gradient(90deg, var(--surface2) 25%, rgba(255,107,171,0.15) 50%, var(--surface2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-line--wide   { width: 85%; animation-delay: 0.05s; }
.skeleton-line--medium { width: 65%; animation-delay: 0.1s; }
.skeleton-line--narrow { width: 45%; animation-delay: 0.15s; }
.skeleton-progress {
  height: 5px; border-radius: 99px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}
.skeleton-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--pink), transparent);
  animation: progress 1.8s ease-in-out infinite;
}
@keyframes progress {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Result Section ─────────────────────────────────── */
.result-section {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.result-badge {
  background: linear-gradient(135deg, #c9a84c, #f5d78e);
  color: #1a0d2e;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.4rem 1.4rem;
  border-radius: 99px;
  letter-spacing: 0.05em;
}
.cert-preview-wrap {
  position: relative;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(255,107,171,0.25), 0 0 0 1px var(--border);
}
.cert-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 14px;
}
.cert-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
  animation: certShimmer 3s ease-in-out infinite;
  pointer-events: none;
}
@keyframes certShimmer {
  0%, 100% { transform: translateX(-100%); }
  50%       { transform: translateX(100%); }
}
.result-actions {
  display: flex;
  gap: 0.8rem;
  width: 100%;
}
.btn-download, .btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s;
  border: none;
}
.btn-download {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: #1a0d2e;
  box-shadow: 0 4px 20px rgba(201,168,76,0.3);
}
.btn-download:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,168,76,0.45); }
.btn-secondary {
  background: var(--surface2);
  border: 1.5px solid var(--border);
  color: var(--text);
}
.btn-secondary:hover { border-color: var(--pink); color: var(--pink); }

/* ─── Footer ─────────────────────────────────────────── */
.app-footer {
  margin-top: 2rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 0.1em;
  opacity: 0.5;
  z-index: 1;
}

/* ─── Vue Transitions ────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from { opacity: 0; transform: translateY(6px); }
.fade-leave-to   { opacity: 0; transform: translateY(-6px); }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s; }
.slide-down-enter-from { opacity: 0; transform: translateY(-10px); max-height: 0; }
.slide-down-leave-to   { opacity: 0; transform: translateY(-10px); max-height: 0; }

.zoom-in-enter-active { transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.zoom-in-enter-from   { opacity: 0; transform: scale(0.92); }
.zoom-in-leave-active { transition: all 0.2s ease-in; }
.zoom-in-leave-to     { opacity: 0; transform: scale(0.96); }

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 480px) {
  .header-title { font-size: 1.7rem; }
  .result-actions { flex-direction: column; }
  .loading-text { min-width: 0; }
}
</style>
