# AI Agent Instructions

Instruksi ini berlaku untuk seluruh proyek.

## Tujuan Utama

- Hemat token: baca file seperlunya, rangkum temuan, dan jangan menyalin isi file panjang ke respons.
- Minim halusinasi: jangan mengarang struktur, dependency, endpoint, atau perilaku. Verifikasi dari file proyek sebelum menyatakan sesuatu sebagai fakta.
- Jaga perubahan kecil dan terarah sesuai permintaan user.

## Konteks Proyek

- Monorepo starter full-stack.
- Backend: FastAPI, SQLAlchemy, Alembic, Pydantic Settings.
- Frontend: Next.js App Router, React, TypeScript.
- Runtime utama via Docker Compose, dengan opsi menjalankan backend/frontend secara lokal.
- Database didukung lewat konfigurasi `.env`: PostgreSQL, MySQL, atau SQLite.

## Cara Bekerja

- Mulai dari file paling relevan:
  - Root: `README.md`, `docker-compose.yml`.
  - Backend: `backend/app/main.py`, `backend/app/core/config.py`, `backend/requirements.txt`, `backend/alembic/`.
  - Frontend: `frontend/app/`, `frontend/package.json`, `frontend/next.config.mjs`.
- Abaikan direktori generated/dependency kecuali user secara eksplisit meminta:
  - `frontend/node_modules/`
  - `frontend/.next/`
  - `backend/.venv/`
  - `__pycache__/`
- Device ini tidak memiliki `rg`. Gunakan tool yang tersedia langsung:
  - Cari file: `find . -path './frontend/node_modules' -prune -o -path './frontend/.next' -prune -o -path './backend/.venv' -prune -o -type f -print`
  - Cari teks: `grep -R --line-number --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.venv "keyword" .`
  - Baca potongan file: `sed -n '1,160p' path/file`
- Jangan membaca banyak file sekaligus tanpa alasan. Baca hanya file yang berhubungan langsung dengan task.
- Jika perlu membuat asumsi, tulis sebagai asumsi dan jelaskan dasar dari file yang sudah dibaca.

## Aturan Anti-Halusinasi

- Jangan menyebut endpoint, command, script, tabel, model, atau env var yang tidak ditemukan di repo.
- Jangan mengklaim test/lint/build berhasil kalau belum dijalankan.
- Jangan mengubah dependency tanpa alasan yang jelas dan tanpa memperbarui lockfile terkait bila diperlukan.
- Jangan menghapus atau mereset perubahan user.
- Jangan membuat arsitektur baru jika pola lokal yang ada sudah cukup.
- Jangan menambahkan library untuk hal sederhana yang bisa diselesaikan dengan stack yang sudah ada.

## Pola Backend

- Pertahankan style Python modern dengan type hints.
- Simpan konfigurasi runtime di `backend/app/core/config.py` atau `.env.example` jika memang konfigurasi baru diperlukan.
- Tambahkan route melalui router FastAPI yang sudah ada, bukan langsung menumpuk semuanya di `main.py`, kecuali perubahan sangat kecil dan cocok dengan pola saat ini.
- Untuk akses database, ikuti pola SQLAlchemy/Alembic yang sudah ada. Jika menambah model, sertakan rencana migrasi Alembic.
- Jangan hardcode credential, host production, atau nilai rahasia.

## Pola Frontend

- Gunakan Next.js App Router di `frontend/app/`.
- Gunakan TypeScript dan komponen React sederhana sesuai pola yang ada.
- Untuk call backend dari browser, ikuti prefix environment yang sudah ada (`NEXT_PUBLIC_API_PREFIX` dengan default `/api`).
- Jangan menambahkan state management, UI framework, atau styling system baru tanpa kebutuhan nyata.
- Pastikan UI responsif dan tidak membuat teks saling tumpang tindih.

## Verifikasi

Jalankan verifikasi paling sempit yang relevan dengan perubahan:

- Frontend:
  - `cd frontend && npm run build` untuk perubahan build-sensitive.
- Backend:
  - `cd backend && python -m compileall app` untuk perubahan Python ringan.
  - Jalankan test backend hanya jika test tersedia atau user meminta.
- Docker:
  - Gunakan `docker compose config` untuk validasi perubahan Compose.

Jika command tidak bisa dijalankan karena dependency/env belum siap, sebutkan jelas command yang gagal dan alasannya.

## Format Respons

- Jawab dalam Bahasa Indonesia jika user memakai Bahasa Indonesia.
- Ringkas: jelaskan file yang diubah, alasan singkat, dan verifikasi yang dilakukan.
- Untuk investigasi, beri temuan utama dulu. Hindari dump output panjang.
- Gunakan path file spesifik saat menjelaskan perubahan.
