# 📖 User Manual — Dashboard Warehouse UNPATTI

> **Versi:** 1.0  
> **Diperbarui:** April 2026  
> **Untuk:** Operator Fakultas, Admin Akademik, Pimpinan Universitas

---

## 1. Pengenalan

**Dashboard Warehouse UNPATTI** adalah sistem visualisasi data universitas yang digunakan untuk:

- Monitoring data akademik secara real-time
- Pemantauan sinkronisasi data SIAKAD ↔ PDDIKTI
- Pelaporan kelengkapan data per fakultas
- Download laporan anomali data

### Akses Sistem

1. Buka browser (Chrome/Firefox/Edge)
2. Akses URL: `https://dashboard.unpatti.ac.id`
3. Login menggunakan akun SSO UNPATTI
4. Dashboard utama akan ditampilkan

---

## 2. Navigasi Utama

### 2.1 Halaman Utama

Setelah login, Anda akan melihat halaman utama dengan modul-modul:

| Modul | Keterangan | Status |
|-------|------------|--------|
| **Akademik** | Data mahasiswa, pelaporan, PDDIKTI | ✅ Aktif |
| **SDM** | Data dosen & tenaga kependidikan | 🔜 Segera hadir |
| **Beasiswa** | Data penerima beasiswa | 🔜 Segera hadir |
| **Akreditasi** | Status akreditasi prodi | 🔜 Segera hadir |
| **Keuangan** | Laporan keuangan | 🔜 Segera hadir |

### 2.2 Sidebar Menu (Modul Akademik)

Klik modul **Akademik** untuk membuka dashboard dengan sidebar menu:

- **Beranda** — Halaman selamat datang
- **Mahasiswa** → Mahasiswa Aktif, Mahasiswa Baru
- **Mahasiswa Keluar** → Lulusan & Status Keluar
- **Pelaporan** → Checkpoint 1, Checkpoint 2
- **PDDIKTI** → Residu Data, Perbandingan Data, Progres Fakultas

---

## 3. Fitur Akademik

### 3.1 Mahasiswa Aktif

**Navigasi:** Sidebar → Mahasiswa → Mahasiswa Aktif

Halaman ini menampilkan:
- **KPI Cards** — Total aktif, non-aktif, cuti, KRS, IPK rata-rata
- **Chart distribusi** — Per jenjang dan per fakultas
- **Tabel detail** — Distribusi IPK dan tren mahasiswa aktif

**Filter yang tersedia:**
- Semester (dropdown)
- Fakultas
- Jenjang (S1/S2/S3/D3/Profesi)

### 3.2 Mahasiswa Baru

**Navigasi:** Sidebar → Mahasiswa → Mahasiswa Baru

Menampilkan data penerimaan mahasiswa baru termasuk:
- Statistik per jalur (SNBP, SNBT, Mandiri)
- Rasio minat per program studi
- Asal wilayah dan asal sekolah

### 3.3 Mahasiswa Keluar / Lulusan

**Navigasi:** Sidebar → Mahasiswa Keluar → Lulusan & Status Keluar

Data lulusan dan mahasiswa keluar per tahun, termasuk status (dropout, wafat, mengundurkan diri, mutasi).

---

## 4. Fitur Pelaporan

### 4.1 Checkpoint 1 (Awal Semester)

**Navigasi:** Sidebar → Pelaporan → Checkpoint 1

Data awal semester meliputi:
- Total mahasiswa dan mahasiswa baru
- Status KRS (disetujui vs belum)
- Aktivitas kuliah per program studi

### 4.2 Checkpoint 2 (Akhir Semester)

**Navigasi:** Sidebar → Pelaporan → Checkpoint 2

Data akhir semester meliputi:
- Total mata kuliah dan status finalisasi nilai
- Komposisi nilai A–E
- Tren IPS/IPK per semester

---

## 5. Fitur PDDIKTI

### 5.1 Residu Data PDDIKTI

**Navigasi:** Sidebar → PDDIKTI → Residu Data

Halaman ini memantau sinkronisasi data antara SIAKAD dan PDDIKTI:

- **KPI Cards:**
  - Total data SIAKAD
  - Tersinkron ke PDDIKTI
  - Residu (belum sinkron)
  - Countdown timer (sinkronisasi berikutnya)

- **Tabel Residu Per Entitas:**
  - Mahasiswa, Dosen, Mata Kuliah, KRS, Nilai, Kurikulum
  - Jumlah SIAKAD vs PDDIKTI dan selisih
  - Progress bar visual
  - Status: Sinkron (hijau), Pending (kuning), Error (merah)

- **Riwayat Sinkronisasi:**
  - Tampilan 7 hari terakhir
  - Indikator hijau = semua berhasil, kuning = ada yang gagal

> **Catatan:** Sinkronisasi berjalan otomatis setiap 24 jam. Countdown timer menunjukkan waktu tersisa hingga sync berikutnya.

### 5.2 Perbandingan Data SIAKAD vs PDDIKTI

**Navigasi:** Sidebar → PDDIKTI → Perbandingan Data

Membandingkan jumlah data di SIAKAD dengan PDDIKTI:

- **KPI Cards:** Total SIAKAD, Total PDDIKTI, Data Match, Data Mismatch
- **Progress Bar Akurasi:** Persentase kesesuaian data keseluruhan
- **Chart Perbandingan:** Bar chart SIAKAD vs PDDIKTI per fakultas
- **Tabel Akurasi:** Detail akurasi per fakultas

#### Cara Download Laporan Anomali

1. Scroll ke bagian bawah halaman **"Laporan Anomali Data"**
2. Klik tombol **"⬇ Download .csv"** untuk format CSV
3. Atau klik **"⬇ Download .xlsx"** untuk format Excel
4. File akan otomatis terunduh ke folder download Anda

> **Format file:** Berisi kolom Fakultas, Entitas, Jenis Anomali, Jumlah, dan Severity.
> File ini dapat dibagikan ke operator fakultas sebagai bahan perbaikan data.

**Filter:** Semester dan Fakultas (untuk melihat data spesifik per fakultas)

### 5.3 Progres Pelaporan Per Fakultas

**Navigasi:** Sidebar → PDDIKTI → Progres Fakultas

Menampilkan kelengkapan data pelaporan setiap fakultas:

- **KPI Cards:**
  - Rata-rata kelengkapan (%)
  - Fakultas tuntas (≥95%)
  - Dalam proses (70-94%)
  - Perlu perhatian (<70%)

- **Card Grid Per Fakultas:**
  - Circular progress ring (visual persentase)
  - Detail per kategori: Biodata Mahasiswa, KRS, Nilai, Data Dosen, Kurikulum
  - Mini progress bar per kategori

- **Ranking Chart:** Horizontal bar chart ranking kelengkapan semua fakultas

**Kode Warna:**
- 🟢 Hijau (≥90%): Kelengkapan baik
- 🟡 Kuning (70-89%): Perlu dilengkapi
- 🔴 Merah (<70%): Perlu perhatian segera

---

## 6. Tips Penggunaan

### Filter Data
- Semua halaman memiliki **filter semester** di pojok kanan atas
- Beberapa halaman memiliki filter tambahan (fakultas, jenjang)
- Pilih filter yang diinginkan, data akan otomatis diperbarui

### Export Data
- Gunakan fitur **Download CSV/XLSX** di halaman Perbandingan Data
- File CSV bisa dibuka di Excel, Google Sheets, atau text editor
- File XLSX bisa langsung dibuka di Microsoft Excel

### Membaca Indikator
- **Badge hijau** = status baik / sinkron / tuntas
- **Badge kuning** = perlu perhatian / dalam proses
- **Badge merah** = error / perlu tindakan segera

---

## 7. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Halaman tidak memuat data | Periksa koneksi internet, refresh halaman |
| Filter tidak bekerja | Pastikan semester valid, coba refresh |
| Download tidak berjalan | Periksa pengaturan popup/download browser |
| Countdown timer tidak jalan | Refresh halaman, timer akan reset otomatis |
| Data tidak sesuai | Data diperbarui setiap 24 jam, cek timestamp last sync |

---

## 8. Kontak

Untuk bantuan teknis, hubungi:

- **Email:** admin-dashboard@unpatti.ac.id
- **Telepon:** (0911) 123-456
- **UPT TIK UNPATTI:** Gedung Rektorat Lt. 2
