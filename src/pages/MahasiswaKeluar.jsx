import { useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";

const fmt = (n) => { try { return Number(n).toLocaleString("id-ID"); } catch { return n; } };

function ChartCard({ title, right, ribbon, children }) {
  return (
    <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
      {ribbon && <div className={`lulusan-ribbon ${ribbon}`}>{title}</div>}
      {!ribbon && (
        <div style={{ padding: "14px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div className="u-card__title">{title}</div>
          {right && <div>{right}</div>}
        </div>
      )}
      <div style={{ padding: "14px 18px 18px" }}>{children}</div>
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

export default function MahasiswaKeluar() {
  const [periodeAkhir, setPeriodeAkhir] = useState(2025);
  const [fakultas, setFakultas] = useState("Semua");
  const [statusKeluar, setStatusKeluar] = useState("Semua");
  const [section, setSection] = useState("lulusan"); // lulusan | mutasi | status

  const vm = useMemo(() => {
    const years = Array.from({ length: 6 }, (_, i) => periodeAkhir - 5 + i);
    const facW = { Semua:1, Hukum:0.22, Teknik:0.28, Ekonomi:0.24, FISIP:0.18, Kedokteran:0.08 };
    const ff = facW[fakultas] ?? 1;

    const lulusanRaw = { 2020:0, 2021:4521, 2022:4372, 2023:6179, 2024:5492, 2025:4915 };
    const ipkRaw    = { 2020:0, 2021:3.32, 2022:3.32, 2023:3.31, 2024:3.30, 2025:3.38 };
    const lamaRaw   = { 2020:0, 2021:4.8, 2022:4.6, 2023:3.9, 2024:3.7, 2025:4.0 };
    const ipkBias = fakultas === "Kedokteran" ? 0.06 : fakultas === "Teknik" ? -0.04 : 0;
    const lamaBias = fakultas === "Teknik" ? 0.20 : fakultas === "Kedokteran" ? 0.15 : 0;
    const cumlaudeRate = fakultas === "Kedokteran" ? 0.10 : 0.07;
    const tepatRate = fakultas === "Kedokteran" ? 0.90 : 0.90;

    const lulusanByYear = years.map(y => {
      const total = Math.round((lulusanRaw[y] ?? 0) * ff);
      const ipk = (ipkRaw[y] ?? 0) ? Number(((ipkRaw[y] ?? 0) + ipkBias).toFixed(2)) : 0;
      const lama = (lamaRaw[y] ?? 0) ? Number(((lamaRaw[y] ?? 0) + lamaBias).toFixed(1)) : 0;
      const tepat = y === 2020 ? 0 : Math.round(tepatRate * 100);
      const cumlaude = y === 2020 ? 0 : Math.round(total * cumlaudeRate);
      return { year: String(y), total, ipk, lama, tepat, cumlaude };
    });

    const totalTercatat = 106391;
    const total5 = lulusanByYear.slice(1).reduce((a, b) => a + b.total, 0);
    const ipkList = lulusanByYear.slice(1).map(x => x.ipk).filter(x => x > 0);
    const ipkAvg = ipkList.length ? Number((ipkList.reduce((a, b) => a + b, 0) / ipkList.length).toFixed(2)) : 0;
    const cumlaude5 = lulusanByYear.slice(1).reduce((a, b) => a + b.cumlaude, 0);

    const perFakultas = ["FKIP","FEB","Hukum","FISIP","Teknik","Kedokteran","Pertanian","Perikanan"]
      .map((f, i) => ({ fakultas: f, total: Math.round(Math.max(120, 4500 / (i + 1)) * ff) }));

    const ipkDist = [
      { range: "< 2.5", value: Math.round(total5 * 0.05) },
      { range: "2.5 - 2.99", value: Math.round(total5 * 0.15) },
      { range: "3.0 - 3.49", value: Math.round(total5 * 0.45) },
      { range: "3.5 - 4.0", value: Math.round(total5 * 0.35) },
    ];

    // Mutasi External (keluar)
    const mutasiExternal = [
      { tahun: "2021", keluar: Math.round(85 * ff) },
      { tahun: "2022", keluar: Math.round(92 * ff) },
      { tahun: "2023", keluar: Math.round(78 * ff) },
      { tahun: "2024", keluar: Math.round(95 * ff) },
      { tahun: "2025", keluar: Math.round(88 * ff) },
    ];

    // Status keluar lainnya
    const statusData = [
      { tahun: "2021", wafat: 3, dropout: 45, mutasi: 85, mengundurkan_diri: 120, prodi: "Berbagai", fakultas: "Semua" },
      { tahun: "2022", wafat: 2, dropout: 52, mutasi: 92, mengundurkan_diri: 135, prodi: "Berbagai", fakultas: "Semua" },
      { tahun: "2023", wafat: 4, dropout: 48, mutasi: 78, mengundurkan_diri: 110, prodi: "Berbagai", fakultas: "Semua" },
      { tahun: "2024", wafat: 1, dropout: 55, mutasi: 95, mengundurkan_diri: 142, prodi: "Berbagai", fakultas: "Semua" },
      { tahun: "2025", wafat: 2, dropout: 50, mutasi: 88, mengundurkan_diri: 128, prodi: "Berbagai", fakultas: "Semua" },
    ].map(r => ({
      ...r,
      total: r.wafat + r.dropout + r.mutasi + r.mengundurkan_diri,
    }));

    const filteredStatus = statusKeluar === "Semua"
      ? statusData
      : statusData.map(r => ({ ...r, highlighted: r[statusKeluar] ?? 0 }));

    return { years, lulusanByYear, totalTercatat, total5, ipkAvg, cumlaude5, perFakultas, ipkDist, mutasiExternal, statusData, filteredStatus };
  }, [periodeAkhir, fakultas, statusKeluar]);

  return (
    <div className="u-stack">
      {/* Header */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div style={{
          background: "linear-gradient(90deg, #0b2545, #1e5aa8, #3b82f6)",
          padding: "22px 20px", color: "#fff", textAlign: "center",
        }}>
          <div style={{ fontSize: 28, fontWeight: 900 }}>Mahasiswa Keluar</div>
          <div style={{ fontSize: 15, opacity: 0.9 }}>Periode {vm.years[0]} – {vm.years[5]}</div>
        </div>
        <div style={{ padding: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div className="u-filters">
            <label>Periode Akhir <select className="u-select" value={periodeAkhir} onChange={e => setPeriodeAkhir(Number(e.target.value))}>
              {[2025,2024,2023,2022].map(y => <option key={y} value={y}>{y}</option>)}
            </select></label>
            <label>Fakultas <select className="u-select" value={fakultas} onChange={e => setFakultas(e.target.value)}>
              <option value="Semua">Semua</option>
              {["Hukum","Teknik","Ekonomi","FISIP","Kedokteran"].map(f => <option key={f} value={f}>{f}</option>)}
            </select></label>
          </div>
          <div className="u-tabs" style={{ border: "none" }}>
            {[["lulusan","Lulusan"],["mutasi","Mutasi External"],["status","Status Keluar"]].map(([key, label]) => (
              <button key={key} className={`u-tab${section === key ? " active" : ""}`} onClick={() => setSection(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ LULUSAN ═══ */}
      {section === "lulusan" && (<>
        <div className="u-grid-4">
          <Kpi label="Total Lulusan Terdaftar" value={fmt(vm.totalTercatat)} hint="Terintegrasi di sistem" variant="blue" />
          <Kpi label="Total Lulusan (5 Thn)" value={fmt(vm.total5)} hint="Akumulasi" variant="green" />
          <Kpi label="Rata-rata IPK" value={vm.ipkAvg.toFixed(2)} hint="5 tahun terakhir" variant="purple" />
          <Kpi label="Total Cumlaude" value={fmt(vm.cumlaude5)} hint="5 tahun terakhir" variant="amber" />
        </div>

        <div className="u-grid-2">
          <ChartCard title="Jumlah Lulusan 5 Tahun Terakhir" ribbon="blue">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vm.lulusanByYear}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis />
                  <Tooltip formatter={v => fmt(v)} />
                  <Line type="monotone" dataKey="total" name="Lulusan" stroke="#3b82f6" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Lulusan Per Fakultas" ribbon="teal">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vm.perFakultas} barCategoryGap={10}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fakultas" tick={{ fontSize: 10 }} /><YAxis />
                  <Tooltip formatter={v => fmt(v)} />
                  <Bar dataKey="total" fill="#14b8a6" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="u-grid-2">
          <ChartCard title="Rata-rata Lama Studi" ribbon="orange">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vm.lulusanByYear}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="lama" name="Lama Studi (Thn)" stroke="#fb923c" fill="#fed7aa" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Distribusi IPK Lulusan" ribbon="purple">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vm.ipkDist} barCategoryGap={14}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" /><YAxis />
                  <Tooltip formatter={v => fmt(v)} />
                  <Bar dataKey="value" name="Jumlah" fill="#8b5cf6" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Tabel Lulusan */}
        <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
          <div className="lulusan-table-title">Tabel Ringkas Lulusan</div>
          <div style={{ padding: 14 }}>
            <table className="u-table">
              <thead><tr>
                <th>Tahun</th><th>Total Lulusan</th><th>Rata-rata IPK</th><th>Rata-rata Lama Studi</th><th>Tepat Waktu (%)</th><th>Cumlaude</th>
              </tr></thead>
              <tbody>
                {vm.lulusanByYear.slice().reverse().map(r => (
                  <tr key={r.year}>
                    <td style={{ fontWeight: 800 }}>{r.year}</td>
                    <td>{fmt(r.total)}</td>
                    <td>{r.ipk ? r.ipk.toFixed(2) : "-"}</td>
                    <td>{r.lama ? `${r.lama} thn` : "-"}</td>
                    <td>{r.tepat}%</td>
                    <td>{fmt(r.cumlaude)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>)}

      {/* ═══ MUTASI EXTERNAL ═══ */}
      {section === "mutasi" && (<>
        <Kpi label="Total Mutasi External (Keluar) 5 Tahun" value={fmt(vm.mutasiExternal.reduce((a,b)=>a+b.keluar,0))} hint="Pindah ke luar UNPATTI" variant="red" />
        <ChartCard title="Mutasi External (Keluar) Per Tahun">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vm.mutasiExternal} barCategoryGap={18}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tahun" /><YAxis />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="keluar" name="Keluar" fill="#ef4444" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
          <div className="lulusan-table-title">Tabel Ringkas Mutasi External</div>
          <div style={{ padding: 14 }}>
            <table className="u-table">
              <thead><tr><th>Tahun</th><th>Jumlah Keluar</th></tr></thead>
              <tbody>
                {vm.mutasiExternal.map(r => (
                  <tr key={r.tahun}>
                    <td style={{ fontWeight: 800 }}>{r.tahun}</td>
                    <td style={{ fontWeight: 800, color: "#ef4444" }}>{fmt(r.keluar)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>)}

      {/* ═══ STATUS KELUAR LAINNYA ═══ */}
      {section === "status" && (<>
        <div className="u-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>Status Keluar Lainnya</div>
            <div className="u-text-muted u-text-sm">Berdasarkan tahun, prodi, dan fakultas</div>
          </div>
          <div className="u-filters">
            <label>Filter Status <select className="u-select" value={statusKeluar} onChange={e => setStatusKeluar(e.target.value)}>
              <option value="Semua">Semua</option>
              <option value="wafat">Wafat</option>
              <option value="dropout">Dropout</option>
              <option value="mutasi">Mutasi External (Keluar)</option>
              <option value="mengundurkan_diri">Mengundurkan Diri</option>
            </select></label>
          </div>
        </div>

        <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
          <div className="lulusan-table-title">Tren Status Keluar (Tabel Ringkas)</div>
          <div style={{ padding: 14 }}>
            <table className="u-table">
              <thead><tr>
                <th>Tahun</th><th>Wafat</th><th>Dropout</th><th>Mutasi Ext.</th><th>Mengundurkan Diri</th><th>Total</th>
              </tr></thead>
              <tbody>
                {vm.statusData.map(r => (
                  <tr key={r.tahun}>
                    <td style={{ fontWeight: 800 }}>{r.tahun}</td>
                    <td style={{ color: statusKeluar === "wafat" ? "#ef4444" : undefined, fontWeight: statusKeluar === "wafat" ? 900 : undefined }}>{r.wafat}</td>
                    <td style={{ color: statusKeluar === "dropout" ? "#ef4444" : undefined, fontWeight: statusKeluar === "dropout" ? 900 : undefined }}>{r.dropout}</td>
                    <td style={{ color: statusKeluar === "mutasi" ? "#ef4444" : undefined, fontWeight: statusKeluar === "mutasi" ? 900 : undefined }}>{r.mutasi}</td>
                    <td style={{ color: statusKeluar === "mengundurkan_diri" ? "#ef4444" : undefined, fontWeight: statusKeluar === "mengundurkan_diri" ? 900 : undefined }}>{r.mengundurkan_diri}</td>
                    <td style={{ fontWeight: 900 }}>{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ChartCard title="Tren Status Keluar Per Tahun">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vm.statusData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tahun" /><YAxis />
                <Tooltip /><Legend />
                <Line type="monotone" dataKey="wafat" name="Wafat" stroke="#64748b" strokeWidth={2} dot />
                <Line type="monotone" dataKey="dropout" name="Dropout" stroke="#ef4444" strokeWidth={2} dot />
                <Line type="monotone" dataKey="mutasi" name="Mutasi Ext." stroke="#f59e0b" strokeWidth={2} dot />
                <Line type="monotone" dataKey="mengundurkan_diri" name="Mundur" stroke="#8b5cf6" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </>)}
    </div>
  );
}
