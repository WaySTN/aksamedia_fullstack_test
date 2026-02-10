# 📋 Aksamedia Fullstack Developer Test

Aplikasi manajemen karyawan (**Employee Management System**) yang dibangun sebagai submission untuk test magang fullstack developer di Aksamedia.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [aksamedia-frontend-self.vercel.app](https://aksamedia-frontend-self.vercel.app/) |
| **Backend API** | [aksamedia-backend-phi.vercel.app](https://aksamedia-backend-phi.vercel.app/) |

## 🏗️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Laravel 12, PHP 8.2+, SQLite, Laravel Sanctum |
| **Frontend** | React 19, Vite, Tailwind CSS v4 |
| **Auth** | Token-based (Sanctum Personal Access Token) |

## 📁 Struktur Project

```
aksamedia_fullstack_test/
├── backend/          # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/   # AuthController, DivisionController, EmployeeController
│   │   │   └── Requests/Api/      # Form Requests (validation)
│   │   └── Models/                # Admin, Division, Employee
│   ├── database/
│   │   ├── migrations/            # Schema definitions
│   │   └── seeders/               # Data seeder
│   └── routes/api.php             # API route definitions
│
├── frontend/         # React SPA
│   └── src/
│       ├── components/            # Navbar, Modal, Pagination, Toast, dll
│       ├── contexts/              # AuthContext, ThemeContext
│       ├── hooks/                 # useLocalStorage
│       ├── pages/                 # Dashboard, Employees, Profile, Login
│       └── services/api.js        # API service layer
│
└── README.md         # File ini
```

## 🚀 Cara Menjalankan

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ & npm
- Laragon (opsional, untuk local development)

### 1. Setup Backend

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Jalankan migration & seeder
php artisan migrate:fresh --seed

# Buat symbolic link untuk storage
php artisan storage:link

# Jalankan server
php artisan serve
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

### 3. Akses Aplikasi

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |

### 🔑 Kredensial Login

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `pastibisa` |

## ✨ Fitur Aplikasi

### Authentication
- ✅ Login admin dengan token (Sanctum)
- ✅ Logout (revoke token)
- ✅ Protected routes (middleware `auth:sanctum`)
- ✅ Auto-redirect jika belum login

### Dashboard
- ✅ Statistik jumlah karyawan & divisi
- ✅ Greeting dinamis berdasarkan waktu
- ✅ Quick actions menu
- ✅ Daftar karyawan terbaru

### Manajemen Karyawan (CRUD)
- ✅ **Create** — Tambah karyawan baru (nama, telepon, divisi, posisi, foto)
- ✅ **Read** — Daftar karyawan dengan pagination
- ✅ **Update** — Edit data karyawan (partial update)
- ✅ **Delete** — Hapus karyawan beserta foto
- ✅ Filter berdasarkan nama & divisi
- ✅ Upload foto karyawan

### Divisi
- ✅ Daftar semua divisi dengan pagination
- ✅ Filter divisi berdasarkan nama

### Profile
- ✅ Edit profil admin (nama, telepon, email)
- ✅ Validasi email unik

### UI/UX
- ✅ Responsive design (mobile-friendly)
- ✅ Dark/Light/System mode
- ✅ "Soft Neon Minimal" design theme
- ✅ Toast notifications
- ✅ Loading states & error handling

## 📡 API Endpoints

Semua endpoint API berada di root path (tanpa prefix `/api`).

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/login` | ❌ | Admin login |
| `POST` | `/logout` | ✅ | Admin logout |
| `PUT` | `/profile` | ✅ | Update profil admin |
| `GET` | `/divisions` | ✅ | Daftar divisi (filter: `name`) |
| `GET` | `/employees` | ✅ | Daftar karyawan (filter: `name`, `division_id`) |
| `POST` | `/employees` | ✅ | Tambah karyawan baru |
| `PUT` | `/employees/{id}` | ✅ | Update data karyawan |
| `DELETE` | `/employees/{id}` | ✅ | Hapus karyawan |

## 🛠️ Fitur Laravel yang Dimanfaatkan

- **Sanctum** — Token-based authentication
- **Form Request** — Validasi request terpisah (`LoginRequest`, `StoreEmployeeRequest`, `UpdateEmployeeRequest`, `UpdateProfileRequest`)
- **Eloquent ORM** — Model relationships (`BelongsTo`, `HasMany`), `HasUuids`, `HasFactory`
- **Query Builder** — `when()` untuk conditional filtering
- **Migration & Seeder** — Database schema & dummy data
- **Storage** — File upload management (public disk)
- **Middleware** — `auth:sanctum` untuk proteksi route
- **UUID** — Primary key menggunakan UUID
- **Exception Handling** — Custom JSON error responses

## 👤 Author Wahyu Setiawan

Dibuat untuk submission test magang Wahyu Setiawan sebegai fullstack developer di **Aksamedia**.
