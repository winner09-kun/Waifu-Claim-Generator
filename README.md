# 🎌 Waifu ClaimCert

Generate sertifikat resmi klaim waifu dengan foto dari MyAnimeList!

---

### Layer Responsibilities

| Layer | File | Tanggung Jawab |
|-------|------|----------------|
| **Route** | `certificate.routes.js` | Mapping HTTP verb + path ke controller |
| **Controller** | `certificate.controller.js` | Validasi request, format response HTTP |
| **Service** | `certificate.service.js` | Orkestrasi — panggil fetcher, bangun metadata |
| **Service** | `waifuFetcher.service.js` | Komunikasi ke Jikan API & waifu.pics |
| **Util** | `certificateBuilder.js` | Pure function: terima data → kembalikan PNG buffer |

---

## 🚀 Cara Menjalankan

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev          # atau: npm start
# API berjalan di http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# UI berjalan di http://localhost:5173
```

---

## 📡 API Reference

### `POST /api/generate-certificate`

**Request Body:**
```json
{
  "userName": "Budi Santoso",
  "waifuName": "Zero Two"
}
```

**Response:**
- `Content-Type: image/png`
- Binary PNG image (900×600 px)
- Header `Content-Disposition: attachment; filename="waifu-certificate-....png"`

**cURL contoh:**
```bash
curl -X POST http://localhost:3001/api/generate-certificate \
  -H "Content-Type: application/json" \
  -d '{"userName":"Budi","waifuName":"Rem"}' \
  --output cert.png
```

---

## 🎨 Strategi Fetch Gambar

1. **Jikan API (MyAnimeList)** — search karakter berdasarkan `waifuName`, ambil `images.jpg.image_url`
2. **waifu.pics (fallback)** — jika Jikan gagal, ambil gambar waifu random dari `api.waifu.pics/sfw/waifu`

---

## ✨ Fitur Loading UI (Vue)

- **Spinner** animasi CSS di dalam tombol saat proses berjalan
- **Stage messages** berganti setiap ~1.2 detik:
  - 🔍 Mencari data waifu di MyAnimeList...
  - 🎨 Menggambar sertifikat keagungan...
  - ✨ Menyempurnakan detail sakura...
- **Skeleton preview** card animasi shimmer selama generate
- **Vue `<Transition>`** untuk semua perubahan state (form → loading → result)
