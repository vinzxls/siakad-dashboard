/**
 * Mock data for PDDIKTI monitoring features:
 * - Residu (sync status per entity)
 * - Perbandingan SIAKAD vs PDDIKTI
 * - Progres pelaporan per fakultas
 */

/* ---- Semester helpers (reused) ---- */
export const SEMESTERS = [];
for (let y = 2021; y <= 2025; y++) {
  SEMESTERS.push(`${y}-1`);
  SEMESTERS.push(`${y}-2`);
}

/* ---- Entitas yang disinkronkan ---- */
export const ENTITIES = [
  { key: "mahasiswa",   label: "Mahasiswa" },
  { key: "dosen",       label: "Dosen" },
  { key: "mataKuliah",  label: "Mata Kuliah" },
  { key: "krs",         label: "KRS" },
  { key: "nilai",       label: "Nilai" },
  { key: "kurikulum",   label: "Kurikulum" },
];

/* ---- Fakultas list ---- */
export const FAKULTAS = [
  "FKIP", "FEB", "Teknik", "Hukum", "FISIP",
  "Kedokteran", "Pertanian", "Perikanan",
];

/**
 * Generate residu data per entity for a given semester.
 * Returns { entity, siakad, pddikti, selisih, status, lastSync }
 */
export function generateResiduData(semester) {
  const [y, s] = semester.split("-").map(Number);
  const seed = (y - 2020) * 2 + s;

  return ENTITIES.map((ent, i) => {
    const base = [27300, 1850, 4200, 22000, 18500, 320][i] || 1000;
    const factor = 0.92 + seed * 0.008;
    const siakad = Math.round(base * factor);
    const gap = Math.round(base * 0.01 * (1 + (i * 0.5)));
    const pddikti = siakad - gap;
    const status = gap === 0 ? "sinkron" : gap < base * 0.02 ? "pending" : "error";

    return {
      entity: ent.label,
      key: ent.key,
      siakad,
      pddikti,
      selisih: gap,
      persen: Number(((pddikti / siakad) * 100).toFixed(1)),
      status,
      lastSync: `2026-04-02T${String(8 + i).padStart(2, "0")}:${String(15 + i * 7).padStart(2, "0")}:00`,
    };
  });
}

/**
 * Sync history timeline (last 7 days).
 */
export function generateSyncHistory() {
  const history = [];
  for (let d = 6; d >= 0; d--) {
    const date = new Date(2026, 3, 2 - d);
    const total = ENTITIES.length;
    const success = total - (d % 3 === 0 ? 1 : 0);
    history.push({
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      total,
      success,
      failed: total - success,
      status: success === total ? "success" : "partial",
    });
  }
  return history;
}

/**
 * Perbandingan SIAKAD vs PDDIKTI per fakultas.
 */
export function generatePerbandingan(semester, fakultasFilter) {
  const [y, s] = semester.split("-").map(Number);
  const seed = (y - 2020) * 2 + s;

  const facData = FAKULTAS
    .filter(f => !fakultasFilter || fakultasFilter === "Semua" || f === fakultasFilter)
    .map(fak => {
      const baseStudents = {
        FKIP: 5880, FEB: 4095, Teknik: 4410, Hukum: 3255,
        FISIP: 2730, Kedokteran: 1575, Pertanian: 2835, Perikanan: 2520,
      }[fak] || 2000;

      const factor = 0.94 + seed * 0.006;
      const siakad = Math.round(baseStudents * factor);
      const mismatch = Math.round(siakad * (0.005 + Math.random() * 0.025));
      const pddikti = siakad - mismatch;

      return {
        fakultas: fak,
        siakad,
        pddikti,
        match: pddikti,
        mismatch,
        akurasi: Number(((pddikti / siakad) * 100).toFixed(1)),
      };
    });

  const totals = facData.reduce(
    (acc, f) => ({
      siakad: acc.siakad + f.siakad,
      pddikti: acc.pddikti + f.pddikti,
      match: acc.match + f.match,
      mismatch: acc.mismatch + f.mismatch,
    }),
    { siakad: 0, pddikti: 0, match: 0, mismatch: 0 }
  );
  totals.akurasi = Number(((totals.match / totals.siakad) * 100).toFixed(1));

  return { facData, totals };
}

/**
 * Data anomali detail untuk download CSV.
 */
export function generateAnomaliData(semester, fakultasFilter) {
  const { facData } = generatePerbandingan(semester, fakultasFilter);
  const rows = [];
  const anomalyTypes = [
    "NIM tidak ditemukan di PDDIKTI",
    "Status mahasiswa berbeda",
    "Data KRS tidak sinkron",
    "Nilai belum terkirim",
    "Mata kuliah tidak terdaftar",
    "Data dosen pengajar berbeda",
  ];

  facData.forEach(fak => {
    const count = fak.mismatch;
    for (let i = 0; i < Math.min(count, 15); i++) {
      rows.push({
        fakultas: fak.fakultas,
        entitas: ENTITIES[i % ENTITIES.length].label,
        jenis: anomalyTypes[i % anomalyTypes.length],
        jumlah: Math.round(count / 5 * (1 + Math.random() * 0.4)),
        severity: i % 3 === 0 ? "Tinggi" : i % 3 === 1 ? "Sedang" : "Rendah",
      });
    }
  });

  return rows;
}

/**
 * Progres pelaporan per fakultas (kelengkapan data).
 */
export function generateProgresFakultas(semester) {
  const [y, s] = semester.split("-").map(Number);
  const seed = (y - 2020) * 2 + s;

  const categories = [
    { key: "biodata",    label: "Biodata Mahasiswa" },
    { key: "krs",        label: "KRS" },
    { key: "nilai",      label: "Nilai" },
    { key: "dosen",      label: "Data Dosen" },
    { key: "kurikulum",  label: "Kurikulum" },
  ];

  return FAKULTAS.map(fak => {
    const baseProgress = {
      FKIP: 92, FEB: 88, Teknik: 95, Hukum: 85,
      FISIP: 82, Kedokteran: 90, Pertanian: 78, Perikanan: 75,
    }[fak] || 80;

    const progress = Math.min(100, Math.round(baseProgress + seed * 0.3));

    const detail = categories.map(cat => {
      const catBase = progress + (Math.random() * 10 - 5);
      return {
        ...cat,
        persen: Math.min(100, Math.max(0, Math.round(catBase))),
      };
    });

    return {
      fakultas: fak,
      progress,
      detail,
      totalItems: Math.round(1200 + Math.random() * 800),
      completedItems: 0, // calculated below
    };
  }).map(fak => ({
    ...fak,
    completedItems: Math.round(fak.totalItems * fak.progress / 100),
  }));
}
