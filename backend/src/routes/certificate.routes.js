import { Router } from 'express';
import { generateCertificate } from '../controllers/certificate.controller.js';

const router = Router();

/**
 * POST /api/generate-certificate
 * Body: { userName: string, waifuName: string }
 * Returns: PNG image (binary)
 */
router.post('/generate-certificate', generateCertificate);

export default router;
