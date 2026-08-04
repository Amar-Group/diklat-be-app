# Project Structure

## Overview
Backend API berbasis **Hono.js** dengan arsitektur **Module-based Layered Architecture**. Project ini menyediakan Sistem Manajemen Pelatihan Terintegrasi dan Learning Management System (LMS), manajemen RBAC (Role-Based Access Control), kelas *online/offline/hybrid*, absensi, logistik, modul pembelajaran (kurikulum), kuis, evaluasi, hingga sertifikasi elektronik.

- **Runtime**: Bun
- **Framework**: Hono.js
- **Database**: MySQL via Drizzle ORM
- **Validation**: Zod + @hono/zod-openapi
- **API Docs**: Scalar (via @scalar/hono-api-reference)

---

## Folder Tree

```
diklat-be-app/
├── drizzle/                        # Migrasi database (auto-generated oleh drizzle-kit)
├── src/
│   ├── index.ts                    # Entry point - app setup, global middleware, route mounting
│   ├── app/                        # Feature modules (domain-driven)
│   │   ├── attendance/             # Absensi (QR, Manual, Auto Zoom)
│   │   ├── certificate/            # Sertifikasi kelulusan kelas
│   │   ├── class/                  # Kelas (Batch) dari course/diklat
│   │   ├── company/                # Data perusahaan mitra (B2B)
│   │   ├── course/                 # Program Diklat / Pelatihan Utama
│   │   ├── evaluation/             # Evaluasi instruktur & materi dari peserta
│   │   ├── instructor/             # Profil instruktur & pengelolaan
│   │   ├── invoice/                # Penagihan pembayaran
│   │   ├── logistic/               # Kebutuhan logistik (hotel, makan, field trip)
│   │   ├── material/               # Materi pembelajaran (video/dokumen)
│   │   ├── menu/                   # Manajemen menu navigasi & permission RBAC
│   │   ├── module/                 # Kurikulum / Modul pembelajaran
│   │   ├── participant/            # Profil peserta & progres pembelajaran
│   │   ├── question/               # Bank soal kuis
│   │   ├── quiz/                   # Konfigurasi kuis & passing grade
│   │   ├── role/                   # CRUD master role
│   │   ├── role_permission/        # Mapping menu access & action permission per role
│   │   ├── session/                # Sesi kelas per hari (online/offline)
│   │   └── user/                   # Autentikasi, manajemen akun, & user info
│   │
│   ├── db/                         # Database layer
│   │   ├── connection.ts           # Drizzle + mysql2 connection
│   │   ├── schema.ts               # Drizzle table definitions
│   │   └── seed.ts                 # Initial data seeder (Admin, RBAC config)
│   │
│   ├── docs/                       # OpenAPI documentation infrastructure
│   │   ├── openapi-common.ts       # Shared helpers, schemas, utilities
│   │   ├── openapi-schemas.ts      # Reusable entity schemas
│   │   └── openapi.ts              # Document merger & Scalar setup
│   │
│   ├── middleware/                 # Global & shared middleware
│   │   ├── appToken.ts             # X-App-Token validation
│   │   ├── auth.ts                 # JWT Bearer authentication
│   │   ├── errorHandler.ts         # Global error handler
│   │   ├── originGuard.ts          # CORS policy whitelist
│   │   └── permission.ts           # Dynamic RBAC permission checker
│   │
│   └── utils/                      # Utility functions (jwt, dsb.)
├── drizzle.config.ts               # Drizzle Kit config
└── package.json                    # Dependencies & scripts
```

---

## Database Schema (19 Tables)

Sistem menggunakan MySQL dengan tabel-tabel utama dibagi menjadi:

**A. RBAC & Autentikasi**
- `roles`: Master role system (Admin, User, dsb).
- `menus`: Tree struktur menu untuk navigasi dan `permission_path` untuk checking API access.
- `users`: Master kredensial akun, terhubung dengan role dan company (opsional).
- `role_permissions`: Menyimpan matriks aksi (read, create, update, delete, report) dari sebuah Role ke suatu Menu.

**B. Organisasi & Profil**
- `companies`: Perusahaan mitra B2B tempat asal peserta.
- `instructor_profiles`: Detail CV, bio, ekspertise instruktur.
- `participant_profiles`: Detail registrasi peserta, NIK/BNSP, dll.

**C. Diklat & Kelas (Course & Class)**
- `courses`: Daftar program diklat utama yang diselenggarakan lembaga.
- `classes`: Batch atau angkatan dari sebuah course (dengan metode LMS, online, offline, atau hybrid).
- `class_instructors`: Relasi M:N kelas dengan instruktur.
- `class_participants`: Relasi M:N kelas dengan peserta (status: registered, ongoing, completed).

**D. Kurikulum LMS**
- `course_modules`: Modul atau silabus di dalam sebuah Course.
- `materials`: Sub-materi pembelajaran (video, pdf) yang ada di dalam modul.
- `supplementary_materials`: Materi tambahan dari instruktur per kelas khusus.
- `participant_progress`: Progres ketuntasan setiap peserta terhadap setiap materi.

**E. Evaluasi Kuis & Pertanyaan**
- `quizzes`: Soal kuis yang terhubung ke sebuah modul dengan `passing_grade`.
- `questions`: Butir soal di dalam kuis dengan opsi ganda.
- `quiz_attempts`: Skor histori percobaan kuis peserta.

**F. Sesi, Logistik, Presensi**
- `sessions`: Jadwal pertemuan/sesi per jam, per hari dari sebuah kelas (online link / offline venue).
- `attendances`: Rekaman kehadiran (check-in time) peserta pada sesi terkait.
- `class_logistics`: Pengelolaan hotel, *field trip*, dan konsumsi kelas offline.

**G. Keuangan & Kelulusan**
- `invoices`: Tagihan biaya registrasi B2B/B2C.
- `evaluations`: Form penilaian dari peserta untuk instruktur & materi di akhir pelatihan.
- `certificates`: Sertifikat digital dan nomor BNSP peserta yang lulus kelas.

---

## Alur Request (Request Flow)

### Protected Endpoint (Standar CRUD)
```
HTTP Request
    ↓
[Global Middleware] (CORS, Origin Guard, Logger)
    ↓
[Module Middleware] (JWT Verify, App-Token Verify, requirePermission)
    ↓
[Zod Validation] (Auto-validate request dari OpenAPI schema)
    ↓
Controller (Extract Params & panggil Service)
    ↓
Service (Business Logic orchestration)
    ↓
Repository (CQRS split: Drizzle query Builder)
    ↓
Database (MySQL)
```

---

## Arsitektur Module (6-Layer Pattern)

Setiap module (seperti `/user`, `/course`, `/class`, dll) selalu dipisah minimal menjadi 6 layer ini:

1. **Contract (`contract/*.contract.ts`)**: Type definitions (TS).
2. **DTO (`dto/*.dto.ts`)**: Zod Schemas untuk validasi *request body/params* dan *response payloads* untuk OpenAPI.
3. **Route (`route/*.openapi.ts` & `*.route.ts`)**:
   - `*.openapi.ts`: Definisi spek OpenAPI (paths, schemas, response shape).
   - `*.route.ts`: Mounting Hono router, penempelan middleware, dan binding handler ke route specification.
4. **Controller (`controller/*.controller.ts`)**: HTTP Request handler tipis. *Tidak boleh* berisi business logic rumit. Validasi request diserahkan sepenuhnya kepada Zod.
5. **Service (`service/*.service.ts`)**: Business logic (cek validitas, proses transaksi, integrasi repositori gabungan).
6. **Repository (`repository/*-read.repository.ts`, `*-write.repository.ts`)**: CQRS Data access object.

---

## API Endpoints List (Prefix `/api`)

- **`/users`**: Manajemen Pengguna & Kredensial.
- **`/roles` & `/role-permissions`**: Manajemen Akses dan Menu.
- **`/menus`**: Struktur sidebar FE & Endpoint mapping.
- **`/companies`**: Klien B2B.
- **`/instructors` & `/participants`**: Master Profil.
- **`/courses`**: Manajemen Program Pelatihan.
- **`/classes`**: Konfigurasi Angkatan Pelatihan.
- **`/modules` & `/materials`**: Penyusunan Kurikulum.
- **`/quizzes` & `/questions`**: Evaluasi Kognitif LMS.
- **`/sessions` & `/attendances`**: Jadwal tatap muka dan presensi peserta.
- **`/logistics`**: Pengelolaan akomodasi pelatihan.
- **`/invoices`**: Billing / Tagihan B2B B2C.
- **`/evaluations`**: Feedback Peserta.
- **`/certificates`**: Penerbitan Sertifikat Kelulusan.

---

## Script Runner

| Script | Keterangan |
|---|---|
| `bun run dev` | Hot-reload development server |
| `bun run db:generate` | Generate Drizzle migration files (`drizzle/`) |
| `bun run db:migrate` | Push/execute migrations ke database |
| `bun run db:seed` | Mengisi data dummy (Roles, Menu default, Superadmin) |
