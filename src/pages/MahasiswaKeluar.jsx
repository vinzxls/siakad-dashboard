import { useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";

const fmt = (n) => { try { return Number(n).toLocaleString("id-ID"); } catch { return n; } };

/* Semester options */
const SEMESTERS = [];
for (let y = 2021; y <= 2025; y++) {
  SEMESTERS.push(`${y}-1`);
  SEMESTERS.push(`${y}-2`);
}

function semesterFactor(sem) {
  const [y, s] = sem.split("-").map(Number);
  const idx = (y - 2021) * 2 + (s - 1);
  return 0.90 + idx * 0.02;
}

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
  const [semester, setSemester] = useState("2025-2");
  const [fakultas, setFakultas] = useState("Semua");
  const [statusKeluar, setStatusKeluar] = useState("Semua");
  const [section, setSection] = useState("lulusan");

  const vm = useMemo(() => {
    const facW = { Semua:1, Hukum:0.22, Teknik:0.28, Ekonomi:0.24, FISIP:0.18, Kedokteran:0.08 };
    const ff = facW[fakultas] ?? 1;
    const ipkBias = fakultas === "Kedokteran" ? 0.06 : fakultas === "Teknik" ? -0.04 : 0;
    const lamaBias = fakultas === "Teknik" ? 0.20 : fakultas === "Kedokteran" ? 0.15 : 0;
    const cumlaudeRate = fakultas === "Kedokteran" ? 0.10 : 0.07;
    const tepatRate = 0.90;

    const lulusanRaw = {
      "2021-1": 2200, "2021-2": 2321, "2022-1": 2100, "2022-2": 2272,
      "2023-1": 3000, "2023-2": 3179, "2024-1": 2700, "2024-2": 2792,
      "2025-1": 2400, "2025-2": 2515,
    };
    const ipkRaw = {
      "2021-1": 3.30, "2021-2": 3.32, "2022-1": 3.31, "2022-2": 3.32,
      "2023-1": 3.29, "2023-2": 3.31, "2024-1": 3.28, "2024-2": 3.30,
      "2025-1": 3.36, "2025-2": 3.38,
    };
    const lamaRaw = {
      "2021-1": 4.9, "2021-2": 4.8, "2022-1": 4.7, "2022-2": 4.6,
      "2023-1": 4.0, "2023-2": 3.9, "2024-1": 3.8, "2024-2": 3.7,
      "2025-1": 4.1, "2025-2": 4.0,
    };

    const lulusanBySemester = SEMESTERS.map(sem => {
      const total = Math.round((lulusanRaw[sem] ?? 0) * ff);
      const ipk = (ipkRaw[sem] ?? 0) ? Number(((ipkRaw[sem] ?? 0) + ipkBias).toFixed(2)) : 0;
      const lama = (lamaRaw[sem] ?? 0) ? Number(((lamaRaw[sem] ?? 0) + lamaBias).toFixed(1)) : 0;
      const tepat = Math.round(tepatRate * 100);
      const cumlaude = Math.round(total * cumlaudeRate);
      return { semester: sem, total, ipk, lama, tepat, cumlaude };
    });

    const totalTercatat = 106391;
    const total5 = lulusanBySemester.reduce((a, b) => a + b.total, 0);
    const ipkList = lulusanBySemester.map(x => x.ipk).filter(x => x > 0);
    const ipkAvg = ipkList.length ? Number((ipkList.reduce((a, b) => a + b, 0) / ipkList.length).toFixed(2)) : 0;
    const cumlaude5 = lulusanBySemester.reduce((a, b) => a + b.cumlaude, 0);

    const perFakultas = ["FKIP","FEB","Hukum","FISIP","Teknik","Kedokteran","Pertanian","Perikanan"]
      .map((f, i) => ({ fakultas: f, total: Math.round(Math.max(120, 4500 / (i + 1)) * ff) }));

    const ipkDist = [
      { range: "< 2.5", value: Math.round(total5 * 0.05) },
      { range: "2.5 - 2.99", value: Math.round(total5 * 0.15) },
      { range: "3.0 - 3.49", value: Math.round(total5 * 0.45) },
      { range: "3.5 - 4.0", value: Math.round(total5 * 0.35) },
    ];

    const mutasiExternal = SEMESTERS.filter(s => s.endsWith("-1")).map((sem, i) => {
      const y = sem.split("-")[0];
      return { tahun: y, keluar: Math.round((85 + i * 3) * ff) };
    });

    const statusData = [
      { tahun: "2021", wafat: 3, dropout: 45, mutasi: 85, mengundurkan_diri: 120 },
      { tahun: "2022", wafat: 2, dropout: 52, mutasi: 92, mengundurkan_diri: 135 },
      { tahun: "2023", wafat: 4, dropout: 48, mutasi: 78, mengundurkan_diri: 110 },
      { tahun: "2024", wafat: 1, dropout: 55, mutasi: 95, mengundurkan_diri: 142 },
      { tahun: "2025", wafat: 2, dropout: 50, mutasi: 88, mengundurkan_diri: 128 },
    ].map(r => ({
      ...r,
      total: r.wafat + r.dropout + r.mutasi + r.mengundurkan_diri,
    }));

    return { lulusanBySemester, totalTercatat, total5, ipkAvg, cumlaude5, perFakultas, ipkDist, mutasiExternal, statusData };
  }, [semester, fakultas, statusKeluar]);

  return (
    <div className="u-stack">
      {/* Header */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div style={{
          background: "linear-gradient(90deg, #0b2545, #1e5aa8, #3b82f6)",
          padding: "22px 20px", color: "#fff", textAlign: "center",
        }}>
          <div style={{ fontSize: 28, fontWeight: 900 }}>Mahasiswa Keluar</div>
          <div style={{ fontSize: 15, opacity: 0.9 }}>Data per semester (2021-1 s/d 2025-2)</div>
        </div>
        <div style={{ padding: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div className="u-filters">
            <label>Semester <select className="u-select" value={semester} onChange={e => setSemester(e.target.value)}>
              {SEMESTERS.slice().reverse().map(s => <option key={s} value={s}>{s}</option>)}
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
          <ChartCard title="Tren Lulusan Per Semester (5 Tahun)" ribbon="blue">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vm.lulusanBySemester}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="semester" tick={{ fontSize: 10 }} /><YAxis />
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
          <ChartCard title="Rata-rata Lama Studi Per Semester" ribbon="orange">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vm.lulusanBySemester}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="semester" tick={{ fontSize: 10 }} /><YAxis />
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
          <div className="lulusan-table-title">Tabel Ringkas Lulusan Per Semester</div>
          <div style={{ padding: 14, overflowX: "auto" }}>
            <table className="u-table">
              <thead><tr>
                <th>Semester</th><th>Total Lulusan</th><th>Rata-rata IPK</th><th>Rata-rata Lama Studi</th><th>Tepat Waktu (%)</th><th>Cumlaude</th>
              </tr></thead>
              <tbody>
                {vm.lulusanBySemester.slice().reverse().map(r => (
                  <tr key={r.semester}>
                    <td style={{ fontWeight: 800 }}>{r.semester}</td>
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
