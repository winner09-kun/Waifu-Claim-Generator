import axios from 'axios';

const WAIFU_PICS_URL = 'https://api.waifu.pics/sfw/waifu';
const JIKAN_SEARCH_URL = 'https://api.jikan.moe/v4/characters';

/**
 * Fetches a waifu image buffer.
 * Strategy:
 *  1. If waifuName given, try Jikan API for a matching character image.
 *  2. Fall back to random waifu.pics image.
 */
export class WaifuFetcherService {
  /**
   * @param {string} waifuName
   * @returns {Promise<Buffer>} raw image buffer
   */
  async fetchImage(waifuName) {
    try {
      const jikanBuffer = await this._fetchFromJikan(waifuName);
      if (jikanBuffer) return jikanBuffer;
    } catch (_) {
      // fall through to fallback
    }

    return this._fetchFromWaifuPics();
  }

  /** Try to find the character on Jikan (MyAnimeList) */
  async _fetchFromJikan(name) {
    const searchRes = await axios.get(JIKAN_SEARCH_URL, {
      params: { q: name, limit: 1 },
      timeout: 5000,
    });

    const character = searchRes.data?.data?.[0];
    const imageUrl = character?.images?.jpg?.image_url || character?.images?.webp?.image_url;

    if (!imageUrl) return null;

    const imgRes = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 8000,
    });

    return Buffer.from(imgRes.data);
  }

  /** Fall back to random waifu from waifu.pics */
  async _fetchFromWaifuPics() {
    const res = await axios.get(WAIFU_PICS_URL, { timeout: 5000 });
    const imageUrl = res.data?.url;
    if (!imageUrl) throw new Error('waifu.pics returned no image URL');

    const imgRes = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 8000,
    });

    return Buffer.from(imgRes.data);
  }
}
