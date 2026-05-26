import { CertificateService } from '../services/certificate.service.js';

const certificateService = new CertificateService();

/**
 * POST /api/generate-certificate
 * Validates input, delegates to service, streams PNG back.
 */
export async function generateCertificate(req, res, next) {
  try {
    const { userName, waifuName } = req.body;

    if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
      return res.status(400).json({ error: 'userName is required.' });
    }
    if (!waifuName || typeof waifuName !== 'string' || waifuName.trim().length === 0) {
      return res.status(400).json({ error: 'waifuName is required.' });
    }

    const imageBuffer = await certificateService.generate({
      userName: userName.trim(),
      waifuName: waifuName.trim(),
    });

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="waifu-certificate-${Date.now()}.png"`,
      'Content-Length': imageBuffer.length,
    });

    return res.send(imageBuffer);
  } catch (err) {
    next(err);
  }
}
