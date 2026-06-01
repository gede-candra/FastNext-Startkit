<p align="center">
  <img src="docs/assets/fastnext-logo.png" alt="FASTNEXT logo" width="400">
</p>

# FASTNEXT Startkit

FASTNEXT adalah starter kit untuk membangun aplikasi web berbasis Python dengan arsitektur backend dan frontend terpisah. Stack utama yang digunakan:
- Backend: FastAPI + SQLAlchemy + Alembic
- Frontend: Next.js (App Router + TypeScript)
- Database: PostgreSQL, MySQL, atau SQLite

## Daftar Isi

1. [Struktur Proyek](#struktur-proyek)
2. [Setup Docker](#1-setup-docker)
3. [Setup Lokal Tanpa Docker](#2-setup-lokal-tanpa-docker)
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

## 1. Setup Docker

Gunakan mode ini jika ingin menjalankan semua service melalui Docker Compose.

### 1.1 Siapkan file environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 1.2 Konfigurasi backend untuk Docker

Edit `backend/.env`. Untuk PostgreSQL bawaan Compose, gunakan nilai berikut:

```env
APP_NAME=Starter API
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
AUTH_SECRET_KEY=change-this-secret-in-your-env
ACCESS_TOKEN_EXPIRE_MINUTES=60

DB_ENGINE=django.db.backends.postgresql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=postgres
DB_PORT=5432
```

Yang penting untuk Docker:
- `DB_HOST` harus memakai nama service database, misalnya `postgres` atau `mysql`.
- `DB_PASSWORD` harus sama dengan password database di `docker-compose.yml`.
- Ganti `AUTH_SECRET_KEY` untuk environment selain lokal.

Jika memakai MySQL profile, gunakan:

```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=mysql
DB_PORT=3306
```

Jika memakai SQLite:

```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=./data/fastnext_db.db
```

### 1.3 Konfigurasi frontend

Edit `frontend/.env`:

```env
APP_NAME=Fastnext
BASE_URL=http://localhost:8000
API_PREFIX=/api
```

Pada Docker Compose, `BASE_URL` akan dioverride menjadi `http://backend:8000` oleh `docker-compose.yml`, sehingga browser tetap cukup memakai `/api` dari frontend.

### 1.4 Jalankan service

PostgreSQL default:

```bash
docker compose up -d --build
```

MySQL:

```bash
docker compose --profile mysql up -d --build
```

SQLite:

```bash
docker compose --profile sqlite up
docker compose up -d --build
```

### 1.5 Jalankan migrasi database

```bash
docker compose exec backend alembic upgrade head
```

### 1.6 Buat superadmin pertama

Interaktif:

```bash
docker compose exec backend python createsuperuser.py
```

Atau langsung dengan argumen:

```bash
docker compose exec backend python createsuperuser.py \
  --name "Superadmin" \
  --email admin@example.com \
  --password password123 \
  --no-input
```

Lalu login di `http://localhost:3000` memakai email dan password tersebut.

Endpoint `/api/v1/auth/bootstrap` masih tersedia untuk membuat akun awal lewat API, tetapi command `createsuperuser.py` lebih cocok untuk setup dari terminal.

### 1.7 Buka aplikasi

- Frontend login: `http://localhost:3000`
- Backend docs: `http://localhost:8000/docs`

### 1.8 Operasional Docker

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

## 2. Setup Lokal Tanpa Docker

Gunakan mode ini jika ingin menjalankan backend dan frontend langsung dari machine lokal.

### 2.1 Siapkan backend

```bash
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Edit `backend/.env`. Untuk PostgreSQL lokal:

```env
APP_NAME=Starter API
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
AUTH_SECRET_KEY=change-this-secret-in-your-env
ACCESS_TOKEN_EXPIRE_MINUTES=60

DB_ENGINE=django.db.backends.postgresql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=localhost
DB_PORT=5432
```

Jika memakai MySQL lokal:

```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=fastnext_db
DB_USER=postgres
DB_PASSWORD=password123
DB_HOST=localhost
DB_PORT=3306
```

Jika memakai SQLite lokal:

```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=./data/fastnext_db.db
```

Jika `DATABASE_URL` diisi, nilainya akan override seluruh konfigurasi `DB_*`.

### 2.2 Jalankan migrasi lokal

Masih dari direktori `backend` dan virtualenv aktif:

```bash
alembic upgrade head
```

### 2.3 Jalankan backend lokal

Masih dari direktori `backend`:

```bash
python runserver.py
```

Atau jalankan dengan port eksplisit:

```bash
python runserver.py 8000
```

Secara default backend berjalan di `http://127.0.0.1:8000`. Jika port 8000 sudah dipakai, `runserver.py` akan mencari port kosong berikutnya. Jika port ditentukan eksplisit seperti `python runserver.py 8000`, server akan gagal start saat port tersebut sedang dipakai.

### 2.4 Siapkan frontend

Buka terminal lain:

```bash
cd frontend
cp .env.example .env
npm install
```

Edit `frontend/.env`:

```env
APP_NAME=Fastnext
BASE_URL=http://localhost:8000
API_PREFIX=/api
```

Jika backend lokal berjalan di port lain, sesuaikan `BASE_URL`.

### 2.5 Jalankan frontend lokal

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`.

### 2.6 Buat superadmin pertama

Masih dari direktori `backend` dan virtualenv aktif, buat akun superadmin pertama secara interaktif:

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

Setelah berhasil, buka `http://localhost:3000` dan login dengan akun tersebut. Halaman awal aplikasi sekarang adalah form login. Setelah login berhasil, user diarahkan ke `/dashboard`.

Endpoint bootstrap tetap tersedia sebagai alternatif API untuk membuat user awal. Setelah ada user yang memiliki password, pembuatan user berikutnya dilakukan melalui endpoint `/api/v1/users` dan membutuhkan token superadmin.

## 3. Endpoint Default

- Frontend: `http://localhost:3000`
- Backend root: `http://localhost:8000/`
- Welcome endpoint: `http://localhost:8000/welcome`
- Health check: `http://localhost:8000/api/v1/health`
- Login: `POST http://localhost:8000/api/v1/auth/login`
- User aktif: `GET http://localhost:8000/api/v1/auth/me`
- Bootstrap superadmin: `POST http://localhost:8000/api/v1/auth/bootstrap`
- API docs: `http://localhost:8000/docs`
