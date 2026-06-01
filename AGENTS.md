# AI Agent Instructions

Instruksi ini berlaku untuk seluruh proyek.

## Tujuan Utama

- Hemat token: baca file seperlunya, rangkum temuan, dan jangan menyalin isi file panjang ke respons.
- Minim halusinasi: jangan mengarang struktur, dependency, endpoint, atau perilaku. Verifikasi dari file proyek sebelum menyatakan sesuatu sebagai fakta.
- Jaga perubahan kecil dan terarah sesuai permintaan user.

## Konteks Proyek

- Untuk orientasi cepat dan hemat token, baca `PROJECT_CONTEXT.md` terlebih dahulu jika task membutuhkan konteks proyek umum. Tetap verifikasi detail dari file sumber sebelum mengubah atau menyatakan perilaku spesifik.
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
- Jangan mengubah title, deskripsi, nama proyek, metadata, atau branding default proyek kecuali user secara eksplisit meminta.
- Jangan menghapus atau mereset perubahan user.
- Jangan membuat arsitektur baru jika pola lokal yang ada sudah cukup.
- Jangan menambahkan library untuk hal sederhana yang bisa diselesaikan dengan stack yang sudah ada.

## Pola Backend

- Pertahankan style Python modern dengan type hints.
- Simpan konfigurasi runtime di `backend/app/core/config.py` atau `.env.example` jika memang konfigurasi baru diperlukan.
- Tambahkan route melalui router FastAPI yang sudah ada, bukan langsung menumpuk semuanya di `main.py`, kecuali perubahan sangat kecil dan cocok dengan pola saat ini.
- Untuk akses database, ikuti pola SQLAlchemy/Alembic yang sudah ada. Jika menambah model, sertakan rencana migrasi Alembic.
- Setiap tabel baru wajib menyertakan kolom `created_at` dan `updated_at` pada model SQLAlchemy dan migration.
- Jangan hardcode credential, host production, atau nilai rahasia.

## Pola Frontend

- Gunakan Next.js App Router di `frontend/app/`.
- Gunakan TypeScript dan komponen React sederhana sesuai pola yang ada.
- Susun komponen frontend dengan pola atomic design:
  - `frontend/components/atoms/` untuk elemen UI paling kecil seperti `Icon`, `TextInput`, dan `PasswordInput`.
  - `frontend/components/molecules/` untuk gabungan kecil seperti dialog/toast.
  - `frontend/components/layouts/` untuk bagian layout bersama seperti Header, Sidebar, Footer, dan Breadcrumb.
  - `frontend/components/organisms/` untuk blok fitur besar seperti form login dan konten dashboard.
  - `frontend/components/templates/` untuk layout/shell/page composition.
- Untuk call backend dari browser, ikuti prefix environment yang sudah ada (`NEXT_PUBLIC_API_PREFIX` dengan default `/api`).
- Untuk form, jangan bergantung pada validasi/error bawaan HTML browser. Gunakan `noValidate`, validasi di React, dan tampilkan pesan error merah di bawah input.
- Gunakan komponen reusable `frontend/components/atoms/TextInput.tsx` untuk input biasa dan `frontend/components/atoms/PasswordInput.tsx` untuk input password.
- Setiap input password wajib memakai `PasswordInput` agar tersedia tombol mata untuk hide/show password.
- Untuk hasil submit form dari server, gunakan `frontend/components/molecules/FormStatusToast.tsx`: variant `success` untuk berhasil tambah/ubah data, variant `error` untuk gagal dari server yang bukan validasi field.
- Jangan menambahkan state management, UI framework, atau styling system baru tanpa kebutuhan nyata.
- Pastikan UI responsif dan tidak membuat teks saling tumpang tindih.

## Verifikasi

Jalankan verifikasi paling sempit yang relevan dengan perubahan:

- Frontend:
  - Jangan jalankan `cd frontend && npm run build` kecuali user secara eksplisit meminta.
  - Untuk perubahan frontend, lakukan pemeriksaan file/TypeScript yang lebih sempit bila memungkinkan, atau jelaskan verifikasi manual yang perlu dilakukan user.
- Backend:
  - `cd backend && python -m compileall app` untuk perubahan Python ringan.
  - Jalankan test backend hanya jika test tersedia atau user meminta.
- Docker:
  - Jangan jalankan command Docker apa pun di environment lokal ini. Docker hanya tersedia di production/staging server.
  - Untuk perubahan Compose, lakukan review file secara manual dan jelaskan validasi Docker yang perlu dijalankan di server production/staging.

Jangan menjalankan command long-running/interaktif untuk membuka server development, kecuali user secara eksplisit meminta:

- Jangan jalankan `cd frontend && npm run dev`.
- Jangan jalankan `cd backend && python runserver.py`.
- Jangan jalankan `uvicorn`, `next dev`, `docker compose up`, atau command Docker lain.

Setelah task selesai, berikan instruksi manual yang perlu user jalankan untuk mencoba aplikasi, misalnya command dev server, URL lokal, dan prasyarat environment.

Jika command tidak bisa dijalankan karena dependency/env belum siap, sebutkan jelas command yang gagal dan alasannya.

## Format Respons

- Jawab dalam Bahasa Indonesia jika user memakai Bahasa Indonesia.
- Ringkas: jelaskan file yang diubah, alasan singkat, dan verifikasi yang dilakukan.
- Akhiri respons selesai-task dengan `Next step:` berisi 1-3 langkah paling relevan yang perlu user lakukan; jangan tulis jika tidak ada langkah lanjutan yang berguna.
- Jika membuat migration/ubah schema DB, `Next step:` wajib menyebut command lokal untuk menerapkan migration, misalnya `cd backend && alembic upgrade head`; jangan menyarankan command Docker kecuali user eksplisit meminta instruksi untuk production/staging.
- Untuk investigasi, beri temuan utama dulu. Hindari dump output panjang.
- Gunakan path file spesifik saat menjelaskan perubahan.
