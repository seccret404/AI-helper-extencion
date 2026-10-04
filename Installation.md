# AI Helper Extension — Instalasi

Extension Chrome untuk menjawab soal: blok teks soal di halaman web, dan jawabannya muncul di bubble kecil di pojok kanan bawah.

## Fitur

- Klik **Start**, lalu bubble kecil `waiting` muncul di pojok kanan bawah.
- Blok teks soal, lalu bubble berubah jadi `processing` dan menampilkan jawabannya.
- Jawaban tampil 3 detik, lalu bubble kembali ke `waiting` untuk soal berikutnya.
- Soal pilihan ganda hanya dijawab dengan opsinya (misalnya `B. Canberra`), tanpa penjelasan.
- Soal lain dijawab dengan penjelasan singkat, maksimal 2 kalimat.
- Klik `×` di bubble untuk berhenti.

## Kebutuhan

- Google Chrome, atau browser berbasis Chromium seperti Edge atau Brave.
- API key Ollama. Buat di https://ollama.com/settings/keys.

## Instalasi

1. Clone repo ini:
   ```bash
   git clone https://github.com/seccret404/AI-helper-extencion.git
   cd AI-helper-extencion
   ```
2. Buat file konfigurasi dari contohnya:
   ```bash
   cp ext/config.example.js ext/config.js
   ```
3. Buka `ext/config.js` dan isi `OLLAMA_API_KEY` dengan key Anda:
   ```js
   self.CONFIG = {
     OLLAMA_API_KEY: "key-anda",
     MODEL: "gpt-oss:120b"
   };
   ```
   File ini sudah ada di `.gitignore`, jadi key Anda tidak akan ikut ter-commit.
4. Buka `chrome://extensions` di Chrome, lalu nyalakan **Developer mode** di pojok kanan atas.
5. Klik **Load unpacked**, lalu pilih folder `ext/`.
6. Supaya mudah diklik, pin ikon extension lewat ikon puzzle 🧩 di toolbar.

## Penggunaan

1. Buka halaman yang berisi soal.
2. Klik ikon extension, lalu **Start**.
3. Blok teks soal. Jawabannya muncul di bubble.

Extension tidak bisa berjalan di halaman `chrome://`, Chrome Web Store, atau tab kosong.

## Konfigurasi

| Opsi | Default | Keterangan |
|---|---|---|
| `OLLAMA_API_KEY` | — | API key dari ollama.com |
| `MODEL` | `gpt-oss:120b` | Model cloud Ollama apa saja, misalnya `deepseek-v3.1:671b` atau `qwen3-coder:480b` |

## Update

```bash
git pull
```
Lalu klik tombol reload ⟳ di kartu extension di `chrome://extensions`, dan refresh halaman yang sedang dibuka.

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Bubble menampilkan `Error: HTTP 401` | API key salah atau belum diisi di `ext/config.js` |
| Bubble tidak muncul setelah Start | Refresh halaman lalu klik Start lagi. Pastikan bukan halaman `chrome://`. |
| Soal yang sama tidak diproses ulang | Blok teks yang sama dua kali berturut-turut sengaja diabaikan. Klik Start lagi untuk reset. |
| Melihat log error | Di `chrome://extensions`, klik link **service worker** di kartu extension |

## Struktur

```
ext/
├── manifest.json        # Konfigurasi extension (Manifest V3)
├── popup.html / .js     # Tombol Start
├── content.js           # Bubble dan deteksi teks yang diblok
├── background.js        # Request ke Ollama API
├── config.example.js    # Contoh konfigurasi
└── icons/               # Ikon extension
```
