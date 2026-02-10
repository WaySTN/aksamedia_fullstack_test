# 🔧 Backend — Laravel REST API

REST API backend untuk aplikasi manajemen karyawan, dibangun menggunakan **Laravel 12** dengan autentikasi **Sanctum**.

> **Live API:** [aksamedia-backend-phi.vercel.app](https://aksamedia-backend-phi.vercel.app/)

## 🏗️ Arsitektur

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php        # Login, Logout, Update Profile
│   │       ├── DivisionController.php     # Daftar divisi
│   │       └── EmployeeController.php     # CRUD karyawan
│   └── Requests/
│       └── Api/
│           ├── ApiFormRequest.php          # Base class (shared JSON validation response)
│           ├── LoginRequest.php            # Validasi login
│           ├── StoreEmployeeRequest.php    # Validasi create employee
│           ├── UpdateEmployeeRequest.php   # Validasi update employee
│           └── UpdateProfileRequest.php    # Validasi update profile
├── Models/
│   ├── Admin.php                          # Model admin (HasApiTokens, HasUuids)
│   ├── Division.php                       # Model divisi (HasMany → Employee)
│   └── Employee.php                       # Model karyawan (BelongsTo → Division)
└── Providers/
    └── AppServiceProvider.php             # Force HTTPS in production
```

## 🚀 Setup

```bash
# 1. Install dependencies
composer install

# 2. Copy environment file
cp .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Jalankan migration & seeder
php artisan migrate:fresh --seed

# 5. Buat storage link (untuk upload foto)
php artisan storage:link

# 6. Jalankan server
php artisan serve
```

## 🔑 Kredensial Default

Seeder akan membuat 1 admin, 6 divisi, dan 12 karyawan.

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `pastibisa` |
| Email | `admin@aksamedia.com` |

## 📡 API Reference

Base URL: `http://localhost:8000`

> **Catatan:** API prefix dikosongkan (`apiPrefix: ''`), sehingga semua endpoint langsung di root path.

---

### Authentication

#### Login

```http
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "pastibisa"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "token": "1|abc123...",
    "admin": {
      "id": "uuid",
      "name": "Administrator",
      "username": "admin",
      "phone": "081234567890",
      "email": "admin@aksamedia.com"
    }
  }
}
```

#### Logout

```http
POST /logout
Authorization: Bearer {token}
```

#### Update Profile

```http
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Name",
  "phone": "081234567890",
  "email": "new@email.com"
}
```

---

### Divisions

#### Get All Divisions

```http
GET /divisions?name=backend
Authorization: Bearer {token}
```

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `name` | string (opsional) | Filter berdasarkan nama divisi |

**Response (200):**
```json
{
  "status": "success",
  "message": "Data divisi berhasil diambil",
  "data": {
    "divisions": [
      { "id": "uuid", "name": "Backend" }
    ]
  },
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 1,
    "from": 1,
    "to": 1
  }
}
```

---

### Employees

#### List Employees

```http
GET /employees?name=budi&division_id={uuid}
Authorization: Bearer {token}
```

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `name` | string (opsional) | Filter berdasarkan nama |
| `division_id` | uuid (opsional) | Filter berdasarkan divisi |

#### Create Employee

```http
POST /employees
Authorization: Bearer {token}
Content-Type: multipart/form-data

name: Budi Santoso
phone: 081234567890
division: {division_uuid}
position: Junior Developer
image: (file, opsional)
```

#### Update Employee

```http
PUT /employees/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

name: Budi Updated (opsional)
phone: 089876543210 (opsional)
division: {division_uuid} (opsional)
position: Senior Developer (opsional)
image: (file, opsional)
```

#### Delete Employee

```http
DELETE /employees/{id}
Authorization: Bearer {token}
```

---

### Error Response Format

Semua error menggunakan format JSON yang konsisten:

```json
{
  "status": "error",
  "message": "Deskripsi error"
}
```

### Validation Error (422)

```json
{
  "status": "error",
  "message": "Validasi gagal",
  "errors": {
    "name": ["Nama wajib diisi"],
    "division": ["Divisi tidak ditemukan"]
  }
}
```

## 🛠️ Fitur Laravel yang Digunakan

| Fitur | Penggunaan |
|-------|-----------|
| **Sanctum** | Token-based auth (`HasApiTokens`, middleware `auth:sanctum`) |
| **Form Request** | Validasi terpisah di 4 class, extends dari `ApiFormRequest` base class |
| **Eloquent** | Relationships (`BelongsTo`, `HasMany`), `HasUuids`, mass assignment `$fillable` |
| **Query Builder** | `when()` + `filled()` untuk conditional query filtering |
| **Migration** | Schema dengan UUID primary key, foreign key constraints |
| **Seeder** | `AdminSeeder`, `DivisionSeeder`, `EmployeeSeeder` |
| **Storage** | Upload file ke `public` disk, `Storage::disk('public')->delete()` |
| **Exception Handling** | Custom JSON rendering di `bootstrap/app.php` |
| **Middleware** | `auth:sanctum`, `guest`, `statefulApi` |
| **Named Routes** | Semua route memiliki `->name()` (e.g., `api.employees.index`) |

## 📦 Database Schema

```
admins
├── id (UUID, PK)
├── name (string)
├── username (string, unique)
├── phone (string, nullable)
├── email (string, unique)
├── password (string, hashed)
└── timestamps

divisions
├── id (UUID, PK)
├── name (string)
└── timestamps

employees
├── id (UUID, PK)
├── image (string, nullable)
├── name (string)
├── phone (string)
├── division_id (UUID, FK → divisions.id, CASCADE)
├── position (string)
└── timestamps
```
