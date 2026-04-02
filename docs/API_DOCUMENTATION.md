# 📘 API Documentation — Dashboard Warehouse UNPATTI

> **Versi:** 1.0  
> **Diperbarui:** April 2026  
> **Base URL:** `https://api.unpatti.ac.id/v1`

---

## Autentikasi

Semua endpoint memerlukan autentikasi via **Bearer Token** di header:

```
Authorization: Bearer <access_token>
```

Token diperoleh melalui proses login SSO UNPATTI.

---

## Filter Global

Semua endpoint menerima parameter query berikut:

| Parameter | Tipe | Contoh | Keterangan |
|-----------|------|--------|------------|
| `semester` | string | `"2025-2"` | Format: `YYYY-N` (N=1 Ganjil, N=2 Genap) |
| `fakultas` | string | `"Teknik"` | Nama fakultas (opsional, default: semua) |
| `jenjang` | string | `"S1"` | S1/S2/S3/D3/Profesi (opsional) |

---

## Daftar Endpoint

### 1. Dashboard Beranda

```
GET /api/dashboard/beranda?semester=2025-2
```

**Response:**
```json
{
  "semester": "2025-2",
  "totalPendaftar": { "total": 13500, "snbp": 4500, "snbt": 5400, "mandiri": 3600 },
  "mahasiswaBaru": { "total": 5600, "registrasi": 5050, "belumRegistrasi": 550 },
  "mahasiswaAktif": { "total": 19000, "laki": 9500, "perempuan": 9500 },
  "kelulusan": { "total": 3600, "tepatWaktu": 2250, "tidakTepatWaktu": 1350 }
}
```

---

### 2. Mahasiswa Aktif

```
GET /api/mahasiswa/aktif?semester=2025-2&fakultas=Semua&jenjang=Semua
```

**Response Fields:**

| Field | Tipe | Keterangan |
|-------|------|------------|
| `ringkasan.totalAktif` | number | Total mahasiswa aktif |
| `ringkasan.nonAktif` | number | Mahasiswa non-aktif |
| `ringkasan.cuti` | number | Mahasiswa cuti |
| `ringkasan.isiKRS` | number | Sudah isi KRS |
| `ringkasan.ipkRataRata` | number | IPK rata-rata |
| `perJenjang[]` | array | Distribusi per jenjang (S1/S2/S3/D3/Profesi) |
| `perFakultas[]` | array | Distribusi per fakultas |
| `distribusiIPK[]` | array | Distribusi range IPK |
| `trenAktif[]` | array | Tren 10 semester terakhir |

---

### 3. Mahasiswa Baru

```
GET /api/mahasiswa/baru?semester=2025-2&jalur=Semua&fakultas=Semua&jenjang=Semua
```

**Response Fields:**

| Field | Tipe | Keterangan |
|-------|------|------------|
| `ringkasan.total` | number | Total mahasiswa baru |
| `ringkasan.dayaTampung` | number | Daya tampung |
| `ringkasan.peminat` | number | Total peminat |
| `perJalur` | object | Breakdown per jalur (SNBP/SNBT/Mandiri) |
| `rasioMinatProdi[]` | array | Rasio minat per prodi |
| `asalWilayah[]` | array | Distribusi asal wilayah |
| `asalSekolah[]` | array | Asal sekolah asal |

---

### 4. Lulusan

```
GET /api/lulusan?semester=2025-2&fakultas=Semua
```

**Response Fields:**

| Field | Tipe | Keterangan |
|-------|------|------------|
| `ringkasan.totalTercatat` | number | Total lulusan sepanjang masa |
| `ringkasan.total5Tahun` | number | Lulusan 5 tahun terakhir |
| `ringkasan.ipkRataRata` | number | IPK rata-rata lulusan |
| `perSemester[]` | array | Data per semester (totalLulusan, ipk, lamaStudi, cumlaude) |
| `perFakultas[]` | array | Total lulusan per fakultas |

---

### 5. Mahasiswa Keluar

```
GET /api/mahasiswa/keluar?semester=2025-2&fakultas=Semua
```

**Response Fields:**

| Field | Tipe | Keterangan |
|-------|------|------------|
| `statusKeluar[]` | array | Per tahun: wafat, dropout, mutasi, mengundurkanDiri |
| `mutasiExternal[]` | array | Mutasi external per tahun |

---

### 6. Pelaporan Checkpoint 1

```
GET /api/pelaporan/cp1?semester=2025-2&fakultas=Semua
```

**Response Fields:**

| Field | Tipe | Keterangan |
|-------|------|------------|
| `ringkasan.totalMahasiswa` | number | Total mahasiswa |
| `ringkasan.krsDisetujui` | number | KRS yang disetujui |
| `perProdi[]` | array | Detail per prodi (maba, total, krs, aktif, nonAktif, cuti, dll.) |

---

### 7. Pelaporan Checkpoint 2

```
GET /api/pelaporan/cp2?semester=2025-2&fakultas=Semua
```

**Response Fields:**

| Field | Tipe | Keterangan |
|-------|------|------------|
| `ringkasan.totalMataKuliah` | number | Total mata kuliah |
| `ringkasan.sudahFinalisasi` | number | Sudah finalisasi nilai |
| `komposisiNilai[]` | array | Komposisi grade A-E |
| `trenIPSIPK[]` | array | Tren IPS/IPK 5 semester |
| `perProdi[]` | array | Detail nilai per prodi |

---

### 8. Residu PDDIKTI

```
GET /api/pddikti/residu?semester=2025-2
```

**Response:**
```json
{
  "semester": "2025-2",
  "lastSync": "2026-04-02T08:15:00",
  "nextSync": "2026-04-03T08:15:00",
  "perEntitas": [
    {
      "entitas": "Mahasiswa",
      "siakad": 27737,
      "pddikti": 27464,
      "selisih": 273,
      "persen": 99.0,
      "status": "pending"
    }
  ],
  "syncHistory": [
    { "date": "2026-04-01", "total": 6, "success": 6, "failed": 0 }
  ]
}
```

---

### 9. Perbandingan SIAKAD vs PDDIKTI

```
GET /api/pddikti/perbandingan?semester=2025-2&fakultas=Semua
```

**Response:**
```json
{
  "semester": "2025-2",
  "totals": { "siakad": 28875, "pddikti": 28400, "match": 28400, "mismatch": 475, "akurasi": 98.4 },
  "perFakultas": [
    { "fakultas": "FKIP", "siakad": 5880, "pddikti": 5800, "mismatch": 80, "akurasi": 98.6 }
  ]
}
```

---

### 10. Laporan Anomali (Download)

```
GET /api/pddikti/anomali?semester=2025-2&fakultas=Semua&format=csv
```

**Query Parameters:**

| Parameter | Keterangan |
|-----------|------------|
| `format` | `csv` atau `xlsx` |

**Response:** File download (Content-Disposition: attachment)

---

### 11. Progres Pelaporan Fakultas

```
GET /api/pddikti/progres?semester=2025-2
```

**Response:**
```json
{
  "semester": "2025-2",
  "rataRata": 90,
  "perFakultas": [
    {
      "fakultas": "Teknik",
      "progress": 95,
      "totalItems": 1500,
      "completedItems": 1425,
      "detail": [
        { "kategori": "Biodata Mahasiswa", "persen": 98 },
        { "kategori": "KRS", "persen": 95 }
      ]
    }
  ]
}
```

---

## Kode Error

| HTTP Code | Keterangan |
|-----------|------------|
| `200` | Berhasil |
| `400` | Parameter tidak valid |
| `401` | Token tidak valid / expired |
| `403` | Tidak memiliki akses |
| `404` | Data tidak ditemukan |
| `500` | Server error |

**Format Error Response:**
```json
{
  "error": true,
  "message": "Semester tidak valid",
  "code": "INVALID_SEMESTER"
}
```

---

## Catatan Teknis

- Semua response dalam format **JSON** (kecuali download file)
- Semua angka bertipe **number** (bukan string)
- Nama field menggunakan **camelCase**
- API mendukung **CORS**
- Menggunakan **HTTPS**
- Format semester: `YYYY-N` (N=1 Ganjil, N=2 Genap)
