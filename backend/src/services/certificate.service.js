import { v4 as uuidv4 } from 'uuid';
import { WaifuFetcherService } from './waifuFetcher.service.js';
import { buildCertificateImage } from '../utils/certificateBuilder.js';

/**
 * CertificateService
 * Orchestrates fetching waifu image → compositing certificate → returning PNG buffer.
 */
export class CertificateService {
  constructor() {
    this.waifuFetcher = new WaifuFetcherService();
  }

  /**
   * @param {{ userName: string, waifuName: string }} params
   * @returns {Promise<Buffer>} PNG image buffer
   */
  async generate({ userName, waifuName }) {
    // 1. Fetch waifu image
    const waifuImageBuffer = await this.waifuFetcher.fetchImage(waifuName);

    // 2. Build metadata
    const claimDate = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    }).format(new Date());

    const claimId = uuidv4().slice(0, 8).toUpperCase();

    // 3. Composite certificate
    const imageBuffer = await buildCertificateImage({
      userName,
      waifuName,
      claimDate,
      claimId,
      waifuImageBuffer,
    });

    return imageBuffer;
  }
}
