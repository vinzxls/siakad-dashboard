/**
 * Mapping Fakultas → Program Studi (dummy UNPATTI)
 * Digunakan untuk dropdown Prodi yang dependent pada Fakultas.
 */

export const FAKULTAS_PRODI = {
  Hukum:      ["Ilmu Hukum"],
  Teknik:     ["Teknik Informatika", "Teknik Sipil", "Teknik Mesin", "Teknik Industri"],
  FKIP:       ["Pend. Matematika", "Pend. Bahasa Inggris", "Pend. Biologi", "PGSD"],
  FEB:        ["Manajemen", "Akuntansi", "Ekonomi Pembangunan"],
  FISIP:      ["Ilmu Komunikasi", "Ilmu Administrasi Negara", "Sosiologi"],
  Kedokteran: ["Kedokteran", "Keperawatan", "Kesehatan Masyarakat"],
  Pertanian:  ["Agribisnis", "Agroteknologi", "Kehutanan"],
  Perikanan:  ["Ilmu Kelautan", "Budidaya Perairan", "Teknologi Hasil Perikanan"],
};

/* Semua fakultas (sesuai kunci FAKULTAS_PRODI) */
export const FAKULTAS_LIST = Object.keys(FAKULTAS_PRODI);

/**
 * Ambil daftar prodi berdasarkan fakultas yang dipilih.
 * Jika fakultas = "Semua", kembalikan seluruh prodi.
 */
export function getProdiList(fakultas) {
  if (!fakultas || fakultas === "Semua") {
    return Object.values(FAKULTAS_PRODI).flat();
  }
  return FAKULTAS_PRODI[fakultas] ?? [];
}

/**
 * Weight factor dummy per prodi (agar data terasa berubah saat filter prodi dipilih).
 * Jika prodi = "Semua" → return 1 (tidak difilter).
 */
const PRODI_WEIGHT_MAP = {
  // Teknik
  "Teknik Informatika":       0.35,
  "Teknik Sipil":             0.28,
  "Teknik Mesin":             0.20,
  "Teknik Industri":          0.17,
  // FKIP
  "Pend. Matematika":         0.30,
  "Pend. Bahasa Inggris":     0.28,
  "Pend. Biologi":            0.22,
  "PGSD":                     0.20,
  // FEB
  "Manajemen":                0.40,
  "Akuntansi":                0.35,
  "Ekonomi Pembangunan":      0.25,
  // FISIP
  "Ilmu Komunikasi":          0.40,
  "Ilmu Administrasi Negara": 0.35,
  "Sosiologi":                0.25,
  // Hukum
  "Ilmu Hukum":               1.00,
  // Kedokteran
  "Kedokteran":               0.45,
  "Keperawatan":              0.30,
  "Kesehatan Masyarakat":     0.25,
  // Pertanian
  "Agribisnis":               0.38,
  "Agroteknologi":            0.35,
  "Kehutanan":                0.27,
  // Perikanan
  "Ilmu Kelautan":            0.38,
  "Budidaya Perairan":        0.32,
  "Teknologi Hasil Perikanan":0.30,
};

export function getProdiWeight(prodi) {
  if (!prodi || prodi === "Semua") return 1;
  return PRODI_WEIGHT_MAP[prodi] ?? 0.25;
}
