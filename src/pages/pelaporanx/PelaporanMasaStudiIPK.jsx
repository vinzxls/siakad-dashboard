import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const fmt = (n) => { try { return Number(n).toLocaleString("id-ID"); } catch { return n; } };

function ChartCard({ title, right, children }) {
  return (
    <div className="u-card">
      <div className="u-card__header">
        <div className="u-card__title">{title}</div>
        {right && <div>{right}</div>}
      </div>
      {children}
    </div>
  );
}

function Kpi({ label, value, hint, variant = "blue" }) {
  return (
    <div className={`u-kpi u-kpi--${variant}`}>
      <div className="u-kpi__label">{label}</div>
      <div className="u-kpi__value">{value}</div>
      {hint && <div className="u-kpi__hint">{hint}</div>}
    </div>
  );
}

const GRADE_COLORS = { A: "#22c55e", B: "#3b82f6", C: "#f59e0b", D: "#ef4444", E: "#64748b" };

export default function PelaporanCP2() {
  const [tahun, setTahun] = useState("2025");
  const [fakultas, setFakultas] = useState("Semua");

  const vm = useMemo(() => {
    const yf = tahun === "2025" ? 1.05 : tahun === "2024" ? 1 : 0.92;
    const facW = { Semua:1, FKIP:0.28, FEB:0.22, FT:0.19, FH:0.16, FISIP:0.15 };
    const ff = facW[fakultas] ?? 1;

    const totalMk = Math.round(4200 * yf * ff);
    const sudahFinalisasi = Math.round(totalMk * 0.85);
    const belumFinalisasi = totalMk - sudahFinalisasi;

    const komposisiNilai = [
      { grade: "A",  value: Math.round(totalMk * 0.28) },
      { grade: "B",  value: Math.round(totalMk * 0.35) },
      { grade: "C",  value: Math.round(totalMk * 0.22) },
      { grade: "D",  value: Math.round(totalMk * 0.10) },
      { grade: "E",  value: Math.round(totalMk * 0.05) },
    ];

    const ipsTrend = [
      { semester: "Ganjil 2023", ips: 3.08, ipk: 3.10 },
      { semester: "Genap 2023",  ips: 3.12, ipk: 3.11 },
      { semester: "Ganjil 2024", ips: 3.15, ipk: 3.13 },
      { semester: "Genap 2024",  ips: 3.18, ipk: 3.15 },
      { semester: "Ganjil 2025", ips: 3.22, ipk: 3.17 },
    ];

    const prodiTable = [
      { prodi: "Teknik Informatika", nilaiA: 320, nilaiB: 410, nilaiC: 240, nilaiD: 95, nilaiE: 35, ips: 3.24, ipk: 3.18 },
      { prodi: "Manajemen",          nilaiA: 280, nilaiB: 380, nilaiC: 260, nilaiD: 110, nilaiE: 40, ips: 3.18, ipk: 3.14 },
      { prodi: "Ilmu Hukum",         nilaiA: 250, nilaiB: 350, nilaiC: 200, nilaiD: 85, nilaiE: 30, ips: 3.20, ipk: 3.16 },
      { prodi: "Pendidikan Matematika", nilaiA: 200, nilaiB: 310, nilaiC: 180, nilaiD: 70, nilaiE: 25, ips: 3.22, ipk: 3.20 },
      { prodi: "Ilmu Komunikasi",    nilaiA: 180, nilaiB: 280, nilaiC: 170, nilaiD: 65, nilaiE: 20, ips: 3.15, ipk: 3.12 },
    ].map(r => ({
      ...r,
      total: r.nilaiA + r.nilaiB + r.nilaiC + r.nilaiD + r.nilaiE,
    }));

    return { totalMk, sudahFinalisasi, belumFinalisasi, komposisiNilai, ipsTrend, prodiTable };
  }, [tahun, fakultas]);

  return (
    <div className="u-stack">
      {/* Header */}
      <div className="u-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Pelaporan — Checkpoint 2 (Akhir Semester)</div>
          <div className="u-text-muted u-text-sm">Finalisasi nilai, komposisi A–E, dan tren IPS/IPK</div>
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
      <div className="u-grid-3">
        <Kpi label="Total Mata Kuliah" value={fmt(vm.totalMk)} variant="blue" />
        <Kpi label="Sudah Finalisasi" value={fmt(vm.sudahFinalisasi)} hint={`${Math.round(vm.sudahFinalisasi / vm.totalMk * 100)}%`} variant="green" />
        <Kpi label="Belum Finalisasi" value={fmt(vm.belumFinalisasi)} variant="amber" />
      </div>

      {/* Charts */}
      <div className="u-grid-2">
        <ChartCard title="Komposisi Nilai A–E" right={<span className="u-badge u-badge--blue">Semester Ini</span>}>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vm.komposisiNilai} barCategoryGap={18}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="value" name="Jumlah" radius={[6,6,0,0]}>
                  {vm.komposisiNilai.map((d) => (
                    <BarChart key={d.grade}>
                      {/* handled via fill array */}
                    </BarChart>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
            {vm.komposisiNilai.map(g => (
              <div key={g.grade} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: GRADE_COLORS[g.grade] }} />
                <span style={{ fontWeight: 800 }}>{g.grade}: {fmt(g.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Tren IPS / IPK (5 Semester Terakhir)">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vm.ipsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
                <YAxis domain={[2.8, 3.5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ips" name="IPS" stroke="#3b82f6" strokeWidth={3} dot />
                <Line type="monotone" dataKey="ipk" name="IPK" stroke="#22c55e" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Tabel per Prodi */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div className="lulusan-table-title">Tabel Ringkas CP2 — Per Program Studi</div>
        <div style={{ padding: 14, overflowX: "auto" }}>
          <table className="u-table">
            <thead><tr>
              <th>Program Studi</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>Total</th><th>IPS</th><th>IPK</th>
            </tr></thead>
            <tbody>
              {vm.prodiTable.map(r => (
                <tr key={r.prodi}>
                  <td style={{ fontWeight: 800 }}>{r.prodi}</td>
                  <td style={{ color: "#166534" }}>{fmt(r.nilaiA)}</td>
                  <td style={{ color: "#1e5aa8" }}>{fmt(r.nilaiB)}</td>
                  <td style={{ color: "#b45309" }}>{fmt(r.nilaiC)}</td>
                  <td style={{ color: "#dc2626" }}>{fmt(r.nilaiD)}</td>
                  <td style={{ color: "#64748b" }}>{fmt(r.nilaiE)}</td>
                  <td style={{ fontWeight: 800 }}>{fmt(r.total)}</td>
                  <td style={{ fontWeight: 800 }}>{r.ips.toFixed(2)}</td>
                  <td style={{ fontWeight: 800 }}>{r.ipk.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
