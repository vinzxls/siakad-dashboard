import { useMemo, useState } from "react";

const fmt = (n) => { try { return Number(n).toLocaleString("id-ID"); } catch { return n; } };

function Kpi({ label, value, hint, variant = "blue" }) {
  return (
    <div className={`u-kpi u-kpi--${variant}`}>
      <div className="u-kpi__label">{label}</div>
      <div className="u-kpi__value">{value}</div>
      {hint && <div className="u-kpi__hint">{hint}</div>}
    </div>
  );
}

export default function PelaporanCP1() {
  const [tahun, setTahun] = useState("2025");
  const [fakultas, setFakultas] = useState("Semua");

  const vm = useMemo(() => {
    const yf = tahun === "2025" ? 1.05 : tahun === "2024" ? 1 : 0.92;
    const facW = { Semua:1, FKIP:0.28, FEB:0.22, FT:0.19, FH:0.16, FISIP:0.15 };
    const ff = facW[fakultas] ?? 1;

    const prodiList = [
      { prodi: "Teknik Informatika", fak: "FT" },
      { prodi: "Manajemen", fak: "FEB" },
      { prodi: "Ilmu Hukum", fak: "FH" },
      { prodi: "Pend. Matematika", fak: "FKIP" },
      { prodi: "Ilmu Komunikasi", fak: "FISIP" },
      { prodi: "Akuntansi", fak: "FEB" },
      { prodi: "Teknik Sipil", fak: "FT" },
      { prodi: "Pend. Bahasa Inggris", fak: "FKIP" },
    ];

    const rows = prodiList.map((p, i) => {
      const base = Math.round((600 - i * 50) * yf * ff);
      const maba = Math.round(base * 0.22);
      const total = base;
      const krsOk = Math.round(total * 0.82);
      const krsBelum = total - krsOk;
      const aktif = Math.round(total * 0.85);
      const nonaktif = Math.round(total * 0.06);
      const cuti = Math.round(total * 0.03);
      const mundur = Math.round(total * 0.02);
      const dikeluarkan = Math.round(total * 0.01);
      const transfer = Math.round(total * 0.01);

      return { ...p, maba, total, krsOk, krsBelum, aktif, nonaktif, cuti, mundur, dikeluarkan, transfer };
    });

    const totalMhs = rows.reduce((a, b) => a + b.total, 0);
    const totalKrsOk = rows.reduce((a, b) => a + b.krsOk, 0);
    const totalKrsBelum = rows.reduce((a, b) => a + b.krsBelum, 0);
    const totalAktif = rows.reduce((a, b) => a + b.aktif, 0);

    return { rows, totalMhs, totalKrsOk, totalKrsBelum, totalAktif };
  }, [tahun, fakultas]);

  return (
    <div className="u-stack">
      {/* Header */}
      <div className="u-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Pelaporan — Checkpoint 1 (Awal Semester)</div>
          <div className="u-text-muted u-text-sm">Registrasi, KRS, dan aktivitas kuliah mahasiswa</div>
        </div>
        <div className="u-filters">
          <label>Tahun <select className="u-select" value={tahun} onChange={e => setTahun(e.target.value)}>
            <option value="2025">2025</option><option value="2024">2024</option><option value="2023">2023</option>
          </select></label>
          <label>Fakultas <select className="u-select" value={fakultas} onChange={e => setFakultas(e.target.value)}>
            <option value="Semua">Semua</option>
            {["FKIP","FEB","FT","FH","FISIP"].map(f => <option key={f} value={f}>{f}</option>)}
          </select></label>
        </div>
      </div>

      {/* KPI */}
      <div className="u-grid-4">
        <Kpi label="Total Mahasiswa" value={fmt(vm.totalMhs)} variant="blue" />
        <Kpi label="KRS Disetujui" value={fmt(vm.totalKrsOk)} variant="green" />
        <Kpi label="KRS Belum Disetujui" value={fmt(vm.totalKrsBelum)} variant="amber" />
        <Kpi label="Mahasiswa Aktif" value={fmt(vm.totalAktif)} variant="sky" />
      </div>

      {/* Table */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div className="lulusan-table-title">Tabel Ringkas CP1 — Per Program Studi</div>
        <div style={{ padding: 14, overflowX: "auto" }}>
          <table className="u-table" style={{ minWidth: 1000 }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ verticalAlign: "bottom" }}>Program Studi</th>
                <th colSpan={2} style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>Jumlah Mahasiswa</th>
                <th colSpan={2} style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>KRS Disetujui</th>
                <th colSpan={6} style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>Aktivitas Kuliah Mahasiswa</th>
              </tr>
              <tr>
                <th>Maba</th><th>Total</th>
                <th>Sudah</th><th>Belum</th>
                <th>Aktif</th><th>Non Aktif</th><th>Cuti</th><th>Mundur</th><th>Dikeluarkan</th><th>Transfer</th>
              </tr>
            </thead>
            <tbody>
              {vm.rows.map(r => (
                <tr key={r.prodi}>
                  <td style={{ fontWeight: 800 }}>{r.prodi}</td>
                  <td>{fmt(r.maba)}</td>
                  <td style={{ fontWeight: 800 }}>{fmt(r.total)}</td>
                  <td style={{ color: "#166534" }}>{fmt(r.krsOk)}</td>
                  <td style={{ color: "#b45309" }}>{fmt(r.krsBelum)}</td>
                  <td>{fmt(r.aktif)}</td>
                  <td>{fmt(r.nonaktif)}</td>
                  <td>{fmt(r.cuti)}</td>
                  <td>{fmt(r.mundur)}</td>
                  <td>{fmt(r.dikeluarkan)}</td>
                  <td>{fmt(r.transfer)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
