<p align="center">
  <img src="docs/assets/fastnext-logo.png" alt="FastNext logo" width="400">
</p>

# FastNext Startkit

FastNext adalah starter kit untuk membangun aplikasi web berbasis Python dengan arsitektur backend dan frontend terpisah. Stack utama yang digunakan:
- Backend: FastAPI + SQLAlchemy + Alembic
- Frontend: Next.js (App Router + TypeScript)
- Database: PostgreSQL, MySQL, atau SQLite

## Daftar Isi

1. [Struktur Proyek](#struktur-proyek)
2. [Setup Docker (Mode Server / Production-Style)](#1-setup-docker-mode-server--production-style)
3. [Setup Lokal Tanpa Docker (Opsional Dev)](#2-setup-lokal-tanpa-docker-opsional-dev)
4. [Endpoint Default](#3-endpoint-default)

## Struktur Proyek

```text
fastnext/                             # Root monorepo starterkit
├── backend/                          # Service backend FastAPI
│   ├── app/                          # Kode utama backend
│   │   ├── api/v1/                   # Routing API versi 1
│   │   ├── core/                     # Konfigurasi global dan settings
│   │   ├── db/                       # Setup SQLAlchemy (engine/session/base)
│   │   ├── models/                   # Model SQLAlchemy (tabel database)
│   │   ├── repositories/             # Layer akses data
│   │   ├── schemas/                  # Schema request/response (Pydantic)
│   │   └── services/                 # Layer business logic
│   ├── alembic/                      # Skrip migrasi database
│   ├── .env.example                  # Template environment backend
│   ├── Dockerfile                    # Image backend
│   ├── runserver.py                  # Entrypoint backend lokal (tanpa Docker)
│   └── requirements.txt              # Dependensi Python
├── frontend/                         # Service frontend Next.js
│   ├── app/                          # Halaman/layout App Router
│   ├── .env.example                  # Template environment frontend
│   ├── Dockerfile                    # Image frontend
│   ├── package.json                  # Script dan dependensi Node.js
│   └── tsconfig.json                 # Konfigurasi TypeScript
├── docs/
│   └── assets/                       # Aset dokumentasi seperti logo README
├── docker-compose.yml                # Orkestrasi seluruh service (app + db)
└── README.md                         # Dokumentasi proyek
```

## 1. Setup Docker (Mode Server / Production-Style)

Pada mode ini semua service dijalankan lewat Docker.
Setelah file environment selesai disiapkan, Anda cukup menjalankan:
- `docker compose up -d`
- atau `docker compose up -d --build` (jika ada perubahan kode/image)

### 1.1 Siapkan file environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 1.2 Isi konfigurasi `.env` backend (wajib sebelum run)

Yang wajib diisi:
- `DB_ENGINE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

Contoh PostgreSQL (default Compose):

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=postgres
DB_PORT=5432
```

Contoh MySQL (aktifkan profile `mysql`):

```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=mysql
DB_PORT=3306
```

Contoh SQLite:

```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=./data/fastnext_db.db
```

Catatan penting:
- Untuk Docker, `DB_HOST` harus memakai nama service container (`postgres` atau `mysql`), bukan `localhost`.
- Jika `DATABASE_URL` diisi, nilai tersebut akan override seluruh `DB_*`.

### 1.3 Isi konfigurasi `.env` frontend

Di `frontend/.env` pastikan minimal:

```env
APP_NAME=Starter App
BASE_URL=http://localhost:8000
API_PREFIX=/api

```

`BASE_URL` adalah target backend untuk Next.js rewrite, dan `API_PREFIX` adalah public prefix di frontend (contoh: `/api`).

### 1.4 Jalankan semua service via Docker

PostgreSQL stack (default):

```bash
docker compose up -d --build
```

MySQL stack:

```bash
docker compose --profile mysql up -d --build
```

SQLite stack (inisialisasi file DB SQLite):

```bash
docker compose --profile sqlite up
```

Lalu jalankan app stack:

```bash
docker compose up -d --build
```

### 1.5 Operasional Docker

Lihat status service:

```bash
docker compose ps
```

Lihat log service:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Hentikan semua service:

```bash
docker compose down
```

## 2. Setup Lokal Tanpa Docker (Opsional Dev)

Mode ini tetap didukung untuk pengembangan lokal/manual.

### 2.1 Isi konfigurasi `.env` backend (wajib sebelum run)

```bash
cd backend
cp .env.example .env
```

Yang wajib diisi:
- `DB_ENGINE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST` (`localhost` untuk lokal)
- `DB_PORT`

Contoh PostgreSQL lokal:

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=localhost
DB_PORT=5432
```

Contoh MySQL lokal:

```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=localhost
DB_PORT=3306
```

Contoh SQLite lokal:

```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=./data/fastnext_db.db
```

### 2.2 Isi konfigurasi `.env` frontend

```bash
cd frontend
cp .env.example .env
```

Di `frontend/.env` pastikan minimal:

```env
APP_NAME=Starter App
BASE_URL=http://localhost:8000
API_PREFIX=/api

```

`BASE_URL` adalah target backend untuk Next.js rewrite, dan `API_PREFIX` adalah public prefix di frontend (contoh: `/api`).

### 2.3 Jalankan backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python runserver.py
```

### 2.4 Jalankan frontend

```bash
cd frontend
npm install
npm run dev
```

## 3. Endpoint Default

- Frontend: `http://localhost:3000`
- Backend root: `http://localhost:8000/`
- Welcome endpoint: `http://localhost:8000`
- Health check: `http://localhost:8000/api/v1/health`
- API docs: `http://localhost:8000/docs`
