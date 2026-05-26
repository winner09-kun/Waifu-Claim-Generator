import sharp from 'sharp';

const W = 900;
const H = 600;

/**
 * Builds the certificate PNG buffer using sharp.
 * @param {object} params
 * @param {string} params.userName
 * @param {string} params.waifuName
 * @param {string} params.claimDate
 * @param {string} params.claimId
 * @param {Buffer} params.waifuImageBuffer
 * @returns {Promise<Buffer>}
 */
export async function buildCertificateImage({ userName, waifuName, claimDate, claimId, waifuImageBuffer }) {
  // ── 1. Resize & circle-crop the waifu photo ─────────────────
  const PHOTO_SIZE = 220;
  const processedPhoto = await sharp(waifuImageBuffer)
    .resize(PHOTO_SIZE, PHOTO_SIZE, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  // Create circular mask
  const circleMask = Buffer.from(
    `<svg width="${PHOTO_SIZE}" height="${PHOTO_SIZE}">
      <circle cx="${PHOTO_SIZE / 2}" cy="${PHOTO_SIZE / 2}" r="${PHOTO_SIZE / 2}" fill="white"/>
    </svg>`
  );

  const circlePhoto = await sharp(processedPhoto)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // ── 2. Build SVG template ────────────────────────────────────
  const svgTemplate = buildSvgTemplate({ userName, waifuName, claimDate, claimId });

  // ── 3. Compose: SVG bg + circle photo ────────────────────────
  const finalImage = await sharp(Buffer.from(svgTemplate))
    .composite([
      {
        input: circlePhoto,
        top: 170,   // vertical center of photo area
        left: 60,   // left padding
      },
    ])
    .png()
    .toBuffer();

  return finalImage;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSvgTemplate({ userName, waifuName, claimDate, claimId }) {
  const safeUser = escapeXml(userName);
  const safeWaifu = escapeXml(waifuName);
  const safeDate = escapeXml(claimDate);
  const safeId = escapeXml(claimId);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <!-- Background gradient: deep indigo → violet -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0d0d1a"/>
      <stop offset="50%"  stop-color="#1a0d2e"/>
      <stop offset="100%" stop-color="#0d0d1a"/>
    </linearGradient>

    <!-- Gold shimmer for accents -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#c9a84c"/>
      <stop offset="50%"  stop-color="#f5d78e"/>
      <stop offset="100%" stop-color="#c9a84c"/>
    </linearGradient>

    <!-- Pink accent -->
    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#ff6bab"/>
      <stop offset="100%" stop-color="#ff9de2"/>
    </linearGradient>

    <!-- Glowing filter for photo ring -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Drop shadow for text -->
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#ff6bab" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- ═══ Background ═══ -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>

  <!-- Decorative corner sakura petals (simplified) -->
  <circle cx="0"   cy="0"   r="120" fill="#ff6bab" fill-opacity="0.06"/>
  <circle cx="${W}" cy="0"   r="100" fill="#9b59b6" fill-opacity="0.08"/>
  <circle cx="0"   cy="${H}" r="90"  fill="#9b59b6" fill-opacity="0.06"/>
  <circle cx="${W}" cy="${H}" r="140" fill="#ff6bab" fill-opacity="0.05"/>

  <!-- Star dots -->
  <circle cx="480" cy="80"  r="2" fill="#f5d78e" fill-opacity="0.6"/>
  <circle cx="620" cy="140" r="1.5" fill="#ff9de2" fill-opacity="0.7"/>
  <circle cx="750" cy="60"  r="2.5" fill="#f5d78e" fill-opacity="0.5"/>
  <circle cx="820" cy="200" r="1.5" fill="#ff9de2" fill-opacity="0.6"/>
  <circle cx="550" cy="460" r="2" fill="#f5d78e" fill-opacity="0.4"/>
  <circle cx="700" cy="510" r="1.5" fill="#ff9de2" fill-opacity="0.5"/>
  <circle cx="840" cy="440" r="2" fill="#f5d78e" fill-opacity="0.5"/>

  <!-- ═══ Outer border (gold) ═══ -->
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}"
        rx="16" ry="16"
        fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.7"/>

  <!-- Inner border (pink) -->
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}"
        rx="12" ry="12"
        fill="none" stroke="url(#pinkGrad)" stroke-width="1" stroke-opacity="0.4"/>

  <!-- ═══ Header ribbon ═══ -->
  <rect x="0" y="0" width="${W}" height="80" rx="0" fill="#1e0535" fill-opacity="0.9"/>
  <rect x="0" y="76" width="${W}" height="4" fill="url(#goldGrad)" fill-opacity="0.8"/>

  <!-- Header title -->
  <text x="${W / 2}" y="30" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="13"
        fill="url(#goldGrad)" letter-spacing="8" font-weight="bold">
    ✦ SERTIFIKAT RESMI ✦
  </text>
  <text x="${W / 2}" y="60" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="26"
        fill="white" letter-spacing="4" filter="url(#textShadow)">
    HAK KLAIM WAIFU
  </text>

  <!-- ═══ Photo placeholder circle (will be replaced by actual photo via composite) ═══ -->
  <!-- Gold ring behind photo -->
  <circle cx="170" cy="280" r="122"
          fill="none" stroke="url(#goldGrad)" stroke-width="5"
          filter="url(#glow)" opacity="0.9"/>
  <!-- Inner pink ring -->
  <circle cx="170" cy="280" r="115"
          fill="none" stroke="url(#pinkGrad)" stroke-width="2" opacity="0.6"/>
  <!-- Background circle (shows behind photo) -->
  <circle cx="170" cy="280" r="110" fill="#1e0535"/>

  <!-- Small crown above photo -->
  <text x="170" y="145" text-anchor="middle" font-size="28">👑</text>

  <!-- ═══ Main content (right of photo) ═══ -->
  <!-- "Dengan bangga menyatakan bahwa" label -->
  <text x="490" y="140" text-anchor="middle"
        font-family="Georgia, serif" font-size="13" font-style="italic"
        fill="#c9a84c" letter-spacing="2" fill-opacity="0.9">
    — Dengan bangga menyatakan bahwa —
  </text>

  <!-- User name -->
  <text x="490" y="195" text-anchor="middle"
        font-family="Georgia, serif" font-size="36" font-weight="bold"
        fill="white" filter="url(#textShadow)">
    ${safeUser}
  </text>

  <!-- Divider line -->
  <line x1="290" y1="210" x2="680" y2="210"
        stroke="url(#goldGrad)" stroke-width="1.5" stroke-opacity="0.5"/>

  <!-- "Secara resmi mengklaim" -->
  <text x="490" y="245" text-anchor="middle"
        font-family="Georgia, serif" font-size="13" font-style="italic"
        fill="#c9a84c" fill-opacity="0.9">
    secara resmi &amp; sah mengklaim
  </text>

  <!-- Waifu name (big, pink) -->
  <text x="490" y="305" text-anchor="middle"
        font-family="Georgia, serif" font-size="40" font-weight="bold"
        fill="url(#pinkGrad)" filter="url(#textShadow)">
    ${safeWaifu}
  </text>

  <!-- "sebagai Waifunya" -->
  <text x="490" y="342" text-anchor="middle"
        font-family="Georgia, serif" font-size="16" font-style="italic"
        fill="white" fill-opacity="0.75">
    sebagai Waifunya yang sah &amp; terkasih
  </text>

  <!-- Decorative separator -->
  <text x="490" y="380" text-anchor="middle"
        font-family="serif" font-size="18"
        fill="url(#goldGrad)" fill-opacity="0.8">
    ❧ ✦ ❧
  </text>

  <!-- ═══ Footer info row ═══ -->
  <rect x="0" y="${H - 100}" width="${W}" height="100"
        fill="#0d0d1a" fill-opacity="0.8"/>
  <rect x="0" y="${H - 100}" width="${W}" height="3"
        fill="url(#goldGrad)" fill-opacity="0.6"/>

  <!-- Date -->
  <text x="310" y="${H - 62}" text-anchor="middle"
        font-family="monospace" font-size="11"
        fill="#c9a84c" letter-spacing="1">
    TANGGAL KLAIM
  </text>
  <text x="310" y="${H - 40}" text-anchor="middle"
        font-family="monospace" font-size="15" font-weight="bold"
        fill="white">
    ${safeDate}
  </text>

  <!-- Separator -->
  <line x1="${W / 2}" y1="${H - 88}" x2="${W / 2}" y2="${H - 24}"
        stroke="url(#goldGrad)" stroke-width="1" stroke-opacity="0.4"/>

  <!-- ID -->
  <text x="590" y="${H - 62}" text-anchor="middle"
        font-family="monospace" font-size="11"
        fill="#c9a84c" letter-spacing="1">
    CLAIM ID
  </text>
  <text x="590" y="${H - 40}" text-anchor="middle"
        font-family="monospace" font-size="13" font-weight="bold"
        fill="white">
    #${safeId}
  </text>

  <!-- Official seal emoji -->
  <text x="852" y="${H - 42}" text-anchor="middle" font-size="42">🏮</text>
  <text x="852" y="${H - 20}" text-anchor="middle"
        font-family="monospace" font-size="9"
        fill="#c9a84c" fill-opacity="0.7" letter-spacing="1">OFFICIAL</text>

  <!-- Watermark -->
  <text x="60" y="${H - 20}" text-anchor="start"
        font-family="monospace" font-size="9"
        fill="white" fill-opacity="0.2" letter-spacing="2">
    waifucert.app • powered by MyAnimeList
  </text>
</svg>`;
}
