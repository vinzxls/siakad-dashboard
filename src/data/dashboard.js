export const dashboardData = {
  "2023": {
    totalPendaftar: { total: 11000, snbp: 3800, snbt: 4700, mandiri: 2500 },
    mahasiswaBaru: {total: 4700,registrasi: 4200,belumRegistrasi: 500,laki: 2350,perempuan: 2350},
    mahasiswaAktif: { total: 17000, laki: 8300, perempuan: 8700 },
    kelulusan: { total: 3100, tepatWaktu: 1900, tidakTepatWaktu: 1200 },
    prestasi: { total: 105, nasional: 30, internasional: 10 },
    afirmasi: { total: 780, kipk: 500, disabilitas: 70 },

    topFakultasPendaftar: [
      { fakultas: "Hukum", value: 1900 },
      { fakultas: "Teknik", value: 3100 },
      { fakultas: "Ekonomi", value: 2600 },
    ],
  },

  "2024": {
    totalPendaftar: { total: 12500, snbp: 4200, snbt: 5100, mandiri: 3200 },

    mahasiswaBaru: {
    total: 5200,
    registrasi: 4700,
    belumRegistrasi: 500,
    laki: 2600,
    perempuan: 2600,
  },

    mahasiswaAktif: { total: 18200, laki: 9100, perempuan: 9100 },
    kelulusan: { total: 3400, tepatWaktu: 2100, tidakTepatWaktu: 1300 },
    prestasi: { total: 120, nasional: 35, internasional: 12 },
    afirmasi: { total: 860, kipk: 540, disabilitas: 80 },
  

    topFakultasPendaftar: [
      { fakultas: "Hukum", value: 2100 },
      { fakultas: "Teknik", value: 3400 },
      { fakultas: "Ekonomi", value: 2800 },
    ],

  },

  "2025": {
    totalPendaftar: { total: 13500, snbp: 4500, snbt: 5400, mandiri: 3600 },
    mahasiswaBaru: {total: 5600,registrasi: 5050,belumRegistrasi: 550,laki: 2800,perempuan: 2800},

    mahasiswaAktif: { total: 19000, laki: 9500, perempuan: 9500 },
    kelulusan: { total: 3600, tepatWaktu: 2250, tidakTepatWaktu: 1350 },
    prestasi: { total: 130, nasional: 40, internasional: 15 },
    afirmasi: { total: 920, kipk: 580, disabilitas: 85 },

    topFakultasPendaftar: [
      { fakultas: "Hukum", value: 2200 },
      { fakultas: "Teknik", value: 3600 },
      { fakultas: "Ekonomi", value: 2950 },
    ],
  },
};

export const YEAR_OPTIONS = ["2025", "2024", "2023"];

export function getYearData(tahun) {
  return dashboardData[tahun] ?? dashboardData["2024"];
}
