# 🎨 Frontend — React SPA

Single Page Application untuk manajemen karyawan, dibangun dengan **React 19** + **Vite** + **Tailwind CSS v4**.

## 🏗️ Arsitektur

```
src/
├── components/
│   ├── Layout.jsx              # Layout utama dengan Navbar + Outlet
│   ├── Modal.jsx               # Reusable modal dialog
│   ├── Navbar.jsx              # Navigation bar (responsive, theme toggle)
│   ├── Pagination.jsx          # Reusable pagination control
│   ├── ProtectedRoute.jsx      # Auth guard untuk protected routes
│   └── Toast.jsx               # Toast notification system (Context-based)
├── contexts/
│   ├── AuthContext.jsx          # Authentication state & methods
│   └── ThemeContext.jsx         # Dark/Light/System theme management
├── hooks/
│   └── useLocalStorage.js       # Custom hook untuk localStorage
├── pages/
│   ├── Dashboard.jsx            # Dashboard dengan statistik & quick actions
│   ├── Employees.jsx            # CRUD karyawan (tabel, modal, filter)
│   ├── Login.jsx                # Halaman login
│   ├── Profile.jsx              # Edit profil admin
│   └── DataManagement.jsx       # CRUD lokal (localStorage)
├── services/
│   └── api.js                   # API service layer (fetch wrapper)
├── App.jsx                      # Root component (routing & providers)
├── main.jsx                     # Entry point (React + BrowserRouter)
└── index.css                    # Global styles (Tailwind + custom scrollbar)
```

## 🚀 Setup

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

## ⚙️ Environment Variables

Buat file `.env` di root frontend (opsional):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

> Default: `http://127.0.0.1:8000/api` jika tidak diset.

## 🧩 Arsitektur Komponen

### Provider Hierarchy

```
BrowserRouter
  └── ThemeProvider         (dark/light/system)
       └── ToastProvider    (notifikasi global)
            └── AuthProvider (login state & token)
                 └── Routes
                      ├── /login    → Login (public)
                      └── ProtectedRoute
                           └── Layout (Navbar + Outlet)
                                ├── /dashboard  → Dashboard
                                ├── /employees  → Employees
                                └── /profile    → Profile
```

### Reusable Components

| Komponen | Deskripsi |
|----------|-----------|
| `Modal` | Dialog modal — Escape close, backdrop click, body scroll lock |
| `Pagination` | Navigasi halaman — Smart page numbers dengan ellipsis |
| `Toast` | Notifikasi — Auto-dismiss, animasi slide-in/out |
| `ProtectedRoute` | Auth guard — Redirect ke login jika belum auth |

### Custom Hooks

| Hook | Deskripsi |
|------|-----------|
| `useLocalStorage` | Sync React state dengan localStorage |
| `useAuth` | Akses auth state (user, login, logout) |
| `useTheme` | Akses theme state (isDark, setTheme) |
| `useToast` | Tampilkan toast notification |

## ✨ Fitur UI/UX

- 🌗 **Dark/Light/System Mode** — Mengikuti preferensi OS atau pilihan manual
- 🎨 **Soft Neon Minimal Theme** — Violet/cyan glow effects, gradient avatars
- 📱 **Responsive** — Mobile-friendly (hamburger menu, stackable layout)
- 🔔 **Toast Notifications** — Feedback success/error dengan animasi
- ⌨️ **Keyboard Support** — Escape untuk tutup modal
- 🔄 **Loading States** — Skeleton/spinner saat fetch data
- 🔍 **Search & Filter** — Filter karyawan berdasarkan nama & divisi
- 📄 **Pagination** — Navigasi halaman dengan smart page numbers

## 🔧 Tech Details

| Aspek | Detail |
|-------|--------|
| **Framework** | React 19 |
| **Bundler** | Vite |
| **Styling** | Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **State** | React Context + useState + useLocalStorage |
| **HTTP Client** | Native Fetch API (custom wrapper) |
| **Fonts** | Google Fonts — Outfit (headings) + DM Sans (body) |
