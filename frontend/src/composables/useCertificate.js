import { ref } from 'vue';
import axios from 'axios';

/**
 * useCertificate
 * Encapsulates all API logic for generating a waifu certificate.
 */
export function useCertificate() {
  const isLoading = ref(false);
  const loadingStage = ref('');   // human-readable stage label for spinner
  const error = ref(null);
  const certificateUrl = ref(null);

  const STAGES = [
    { delay: 0,    text: '🔍 Mencari data waifu di MyAnimeList...' },
    { delay: 1200, text: '🎨 Menggambar sertifikat keagungan...' },
    { delay: 2400, text: '✨ Menyempurnakan detail sakura...' },
  ];

  let stageTimers = [];

  function startStageLoop() {
    STAGES.forEach(({ delay, text }) => {
      const t = setTimeout(() => {
        loadingStage.value = text;
      }, delay);
      stageTimers.push(t);
    });
  }

  function clearStageLoop() {
    stageTimers.forEach(clearTimeout);
    stageTimers = [];
  }

  async function generate(userName, waifuName) {
    isLoading.value = true;
    error.value = null;
    certificateUrl.value = null;
    loadingStage.value = STAGES[0].text;

    startStageLoop();

    try {
      const response = await axios.post(
        '/api/generate-certificate',
        { userName, waifuName },
        { responseType: 'blob', timeout: 30_000 }
      );

      // Revoke previous object URL to avoid memory leaks
      if (certificateUrl.value) URL.revokeObjectURL(certificateUrl.value);
      certificateUrl.value = URL.createObjectURL(response.data);
    } catch (err) {
      const message =
        err.response?.data
          ? await err.response.data.text().catch(() => 'Terjadi kesalahan pada server.')
          : err.message || 'Terjadi kesalahan tak terduga.';
      error.value = message;
    } finally {
      clearStageLoop();
      isLoading.value = false;
      loadingStage.value = '';
    }
  }

  function download(fileName = 'waifu-certificate.png') {
    if (!certificateUrl.value) return;
    const a = document.createElement('a');
    a.href = certificateUrl.value;
    a.download = fileName;
    a.click();
  }

  function reset() {
    if (certificateUrl.value) URL.revokeObjectURL(certificateUrl.value);
    certificateUrl.value = null;
    error.value = null;
  }

  return { isLoading, loadingStage, error, certificateUrl, generate, download, reset };
}
