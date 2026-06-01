# Project Context

Ringkasan ini dibuat untuk orientasi cepat agent. Gunakan sebagai peta awal, lalu verifikasi detail dari file sumber sebelum mengubah atau menyatakan perilaku spesifik.

## Stack

- Monorepo full-stack.
- Backend: FastAPI, SQLAlchemy, Alembic, Pydantic Settings.
- Frontend: Next.js App Router, React, TypeScript.
- Runtime production/staging: Docker Compose. Di environment lokal ini, jangan jalankan command Docker.
- Database dikonfigurasi lewat `.env` dan mendukung PostgreSQL, MySQL, atau SQLite.

## Struktur Utama

- `backend/app/main.py`: entrypoint aplikasi FastAPI.
- `backend/app/core/config.py`: konfigurasi runtime backend.
- `backend/app/db/session.py`: session database.
- `backend/app/api/deps.py`: dependency reusable untuk auth/current user/role guard.
- `backend/app/api/v1/`: router API versi 1.
- `backend/app/models/`: model SQLAlchemy.
- `backend/app/schemas/`: schema Pydantic.
- `backend/app/repositories/`: akses data.
- `backend/app/services/`: business logic.
- `backend/alembic/`: konfigurasi dan migration database.
- `frontend/app/`: Next.js App Router pages/layouts.
- `frontend/components/`: komponen React.
- `frontend/services/`: service layer frontend.
- `frontend/repositories/`: wrapper request API frontend.
- `frontend/types/`: tipe TypeScript bersama.
- `frontend/public/`: aset publik frontend.

## Pola Backend

- Tambahkan endpoint melalui router di `backend/app/api/v1/`.
- Gunakan service untuk business logic dan repository untuk akses database.
- Dependency auth ada di `backend/app/api/deps.py`.
- Jika menambah tabel, model dan migration harus punya `created_at` dan `updated_at`.
- Jangan hardcode credential atau nilai rahasia.

## Pola Frontend

- Gunakan App Router di `frontend/app/`.
- Komponen UI reusable ditempatkan di `frontend/components/`.
- Dashboard memakai shell bersama di `frontend/components/dashboard/`.
- Request browser ke backend mengikuti `NEXT_PUBLIC_API_PREFIX`, default `/api`.
- Jangan tambah state management, UI framework, atau library baru tanpa kebutuhan jelas.
- Jangan jalankan `npm run build` kecuali user eksplisit meminta.

## Fitur Yang Sudah Ada

- Auth memakai cookie `HttpOnly` untuk session token dan CSRF cookie/header untuk request perubahan data.
- Dashboard dan halaman profil memakai shared dashboard layout.
- Logo tanpa teks untuk favicon/sidebar berada di `frontend/public/fastnext-logo-no-text.png`.
- Profil saya berada di route `/profile`; ubah password berada di route `/change-password`.
- Modal konfirmasi logout berada di `frontend/components/common/ConfirmDialog.tsx`.

## Verifikasi Ringan

- Frontend: jangan jalankan `cd frontend && npm run build` kecuali user eksplisit meminta.
- Backend ringan: gunakan `cd backend && python -m compileall app` atau `python3 -m compileall app` jika `python` tidak tersedia.
- Docker: jangan jalankan command Docker di environment lokal ini; Docker hanya tersedia di production/staging server.

## Batasan Kerja

- Abaikan generated/dependency directory kecuali diminta: `frontend/node_modules/`, `frontend/.next/`, `backend/.venv/`, `__pycache__/`.
- Device ini diasumsikan tidak punya `rg`; gunakan `find`, `grep`, dan `sed`.
- Perubahan harus kecil, terarah, dan mengikuti pola lokal.
