<p align="center">
  <img src="docs/assets/fastnext-logo.png" alt="FASTNEXT logo" width="400">
</p>

# FASTNEXT Startkit

FASTNEXT adalah starter kit full-stack dengan backend FastAPI dan frontend Next.js App Router. Project ini sudah memakai autentikasi berbasis cookie `HttpOnly`, CSRF token untuk request perubahan data, dashboard terproteksi, halaman profil, dan halaman ubah password.

## Stack

- Backend: FastAPI, SQLAlchemy, Alembic, Pydantic Settings
- Frontend: Next.js App Router, React, TypeScript
- Database: PostgreSQL, MySQL, atau SQLite

## Struktur Proyek

Project ini memakai struktur monorepo agar backend dan frontend tetap terpisah tetapi masih berada dalam satu repository.

```text
fastnext/
├── backend/                         # Service API utama untuk auth, user, role, dan akses database
│   ├── app/                         # Kode aplikasi backend
│   │   ├── api/                     # Lapisan HTTP API, dependency request, auth guard, dan CSRF
│   │   ├── core/                    # Konfigurasi runtime dan helper keamanan backend
│   │   ├── db/                      # Fondasi koneksi database dan SQLAlchemy
│   │   ├── models/                  # Definisi struktur tabel database
│   │   ├── repositories/            # Lapisan akses data agar query tidak tersebar
│   │   ├── schemas/                 # Kontrak request dan response API
│   │   └── services/                # Business logic aplikasi
│   └── alembic/                     # Pengelolaan migration database
├── frontend/                        # Aplikasi web Next.js
│   ├── app/                         # Definisi route dan layout halaman Next.js
│   ├── components/                  # Komponen React dengan pola atomic design
│   │   ├── atoms/                   # Elemen UI paling kecil dan reusable
│   │   ├── molecules/               # Gabungan kecil dari beberapa atom
│   │   ├── layouts/                 # Header, sidebar, breadcrumb, dan struktur layout umum
│   │   ├── organisms/               # Blok fitur besar seperti form dan konten halaman
│   │   └── templates/               # Komposisi halaman dari layout dan organism
│   ├── lib/                         # Helper frontend umum
│   ├── repositories/                # Wrapper request API
│   ├── services/                    # Service frontend yang dipakai komponen
│   ├── types/                       # Tipe TypeScript bersama
│   └── public/                      # Aset publik frontend
├── docs/                            # Aset dan dokumentasi pendukung project
├── docker-compose.yml               # Konfigurasi Compose untuk production/staging
└── README.md                        # Dokumentasi project
```

## Route Frontend

- `/login`: halaman login.
- `/`: dashboard utama. Jika user belum login, diarahkan ke `/login`.
- `/profile`: halaman profil saya.
- `/change-password`: halaman ubah password.

Welcome page lama sudah dihapus karena halaman awal aplikasi sekarang adalah flow login/dashboard.

## API Yang Dipakai Frontend Saat Ini

Base URL lokal default: `http://localhost:8000`

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/me`

API welcome lama sudah dihapus dari backend karena tidak dipakai oleh frontend.

## Setup Lokal Tanpa Docker

Docker tidak diperlukan di environment lokal ini. Docker Compose hanya dipakai di production/staging.

### Backend

```bash
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python runserver.py
```

Jika backend perlu port eksplisit:

```bash
python runserver.py 8000
```

### Frontend

Di terminal lain:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend lokal berjalan di `http://localhost:3000`.

## Environment Frontend

Contoh `frontend/.env`:

```env
APP_NAME=Fastnext
BASE_URL=http://localhost:8000
API_PREFIX=/api
```

Jika backend lokal berjalan di port lain, sesuaikan `BASE_URL`.

## Membuat Superadmin Pertama

Dari direktori `backend` dengan virtualenv aktif:

```bash
python createsuperuser.py
```

Atau langsung dengan argumen:

```bash
python createsuperuser.py \
  --name "Superadmin" \
  --email admin@example.com \
  --password password123 \
  --no-input
```

Setelah berhasil, buka `http://localhost:3000`. Jika belum login, aplikasi mengarahkan ke `/login`; setelah login berhasil, user masuk ke dashboard di `/`.

## Verifikasi Ringan

Backend:

```bash
cd backend
python3 -m compileall app
```

Frontend:

```bash
cd frontend
./node_modules/.bin/tsc --noEmit
```

Jangan jalankan `npm run build` kecuali memang dibutuhkan secara eksplisit.
