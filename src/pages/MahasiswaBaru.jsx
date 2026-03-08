import { useMemo, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const fmt = (n) => { try { return Number(n).toLocaleString("id-ID"); } catch { return n; } };
const COLORS = ["#1e5aa8","#22c55e","#f59e0b","#8b5cf6","#ef4444","#14b8a6"];

/* Semester options */
const SEMESTERS = [];
for (let y = 2021; y <= 2025; y++) {
  SEMESTERS.push(`${y}-1`);
  SEMESTERS.push(`${y}-2`);
}

const JENJANG_LIST = ["Semua", "S1", "S2", "S3", "D3", "Profesi"];
const JENJANG_WEIGHTS = { Semua: 1, S1: 0.78, S2: 0.10, S3: 0.02, D3: 0.04, Profesi: 0.06 };

function semesterFactor(sem) {
  const [y, s] = sem.split("-").map(Number);
  const idx = (y - 2021) * 2 + (s - 1);
  return 0.90 + idx * 0.02;
}

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

export default function MahasiswaBaru() {
  const [semester, setSemester] = useState("2025-2");
  const [jalur, setJalur] = useState("Semua");
  const [fakultas, setFakultas] = useState("Semua");
  const [jenjang, setJenjang] = useState("Semua");
  const [tabMandiri, setTabMandiri] = useState("Reguler");

  const vm = useMemo(() => {
    const sf = semesterFactor(semester);
    const FAC_W = { Semua:1, Hukum:0.12, Teknik:0.16, FKIP:0.22, FEB:0.15, FISIP:0.10, Kedokteran:0.06, Pertanian:0.10, Perikanan:0.09 };
    const ff = FAC_W[fakultas] ?? 1;
    const jf = JENJANG_WEIGHTS[jenjang] ?? 1;

    let jlf = 1;
    if (jalur === "SNBP") jlf = 0.34;
    else if (jalur === "SNBT") jlf = 0.41;
    else if (jalur === "Mandiri") jlf = 0.25;

    const total = Math.max(1, Math.round(5200 * sf * jlf * ff * jf));
    const dayaTampung = Math.round(total * 1.15);
    const minat = Math.round(total * 2.8);
    const registrasi = Math.round(total * 0.9);
    const belum = Math.max(0, total - registrasi);

    const snbp = Math.round(5200 * sf * ff * jf * 0.34);
    const snbt = Math.round(5200 * sf * ff * jf * 0.41);
    const mandiriAll = Math.max(0, Math.round(5200 * sf * ff * jf) - snbp - snbt);

    const mandiriReg = Math.round(mandiriAll * 0.40);
    const mandiriRpl = Math.round(mandiriAll * 0.20);
    const mandiriPrestasi = Math.round(mandiriAll * 0.25);
    const mandiriAfirmasi = Math.max(0, mandiriAll - mandiriReg - mandiriRpl - mandiriPrestasi);

    const jalurDonut = [
      { name: "SNBP", value: snbp },
      { name: "SNBT", value: snbt },
      { name: "Mandiri", value: mandiriAll },
    ];

    const mandiriTab = {
      Reguler:  { label: "Mandiri Reguler",  value: mandiriReg },
      RPL:      { label: "Mandiri RPL",      value: mandiriRpl },
      Prestasi: { label: "Mandiri Prestasi", value: mandiriPrestasi },
      Afirmasi: { label: "Mandiri Afirmasi", value: mandiriAfirmasi },
    };

    /* Rasio Minat / Daya Tampung per Prodi */
    const rasioProdi = [
      { prodi: "Teknik Informatika", dayaTampung: 100, peminat: 520 },
      { prodi: "Manajemen",          dayaTampung: 120, peminat: 460 },
      { prodi: "Hukum",              dayaTampung: 80,  peminat: 420 },
      { prodi: "Kedokteran",         dayaTampung: 50,  peminat: 380 },
      { prodi: "Ilmu Komunikasi",    dayaTampung: 90,  peminat: 340 },
      { prodi: "Akuntansi",          dayaTampung: 100, peminat: 310 },
      { prodi: "Teknik Sipil",       dayaTampung: 80,  peminat: 280 },
      { prodi: "Pend. Matematika",   dayaTampung: 70,  peminat: 260 },
    ].map(r => {
      const pAdj = Math.round(r.peminat * sf * jlf * ff);
      const dAdj = Math.round(r.dayaTampung * sf * ff);
      return {
        ...r,
        peminat: pAdj,
        dayaTampung: dAdj,
        rasio: dAdj > 0 ? Number((pAdj / dAdj).toFixed(2)) : 0,
      };
    }).sort((a, b) => b.rasio - a.rasio);

    /* Top Prodi berdasarkan rasio minat (bukan jumlah absolut) */
    const topProdi = rasioProdi.map(r => ({
      name: r.prodi,
      value: r.rasio,
    }));

    const asal = [
      { name: "Maluku", value: Math.round(total * 0.58) },
      { name: "Papua", value: Math.round(total * 0.14) },
      { name: "Sulawesi", value: Math.round(total * 0.12) },
      { name: "Jawa", value: Math.round(total * 0.08) },
      { name: "Lainnya", value: Math.round(total * 0.08) },
    ];

    /* Sebaran Asal Sekolah (Kota Ambon) */
    const asalSekolah = [
      { name: "SMAN 1 Ambon",       value: Math.round(total * 0.14), color: "#1e5aa8" },
      { name: "SMAN 2 Ambon",       value: Math.round(total * 0.11), color: "#3b82f6" },
      { name: "SMAN 3 Ambon",       value: Math.round(total * 0.09), color: "#0ea5e9" },
      { name: "SMAN 5 Ambon",       value: Math.round(total * 0.07), color: "#6366f1" },
      { name: "SMKN 1 Ambon",       value: Math.round(total * 0.08), color: "#22c55e" },
      { name: "SMKN 2 Ambon",       value: Math.round(total * 0.06), color: "#16a34a" },
      { name: "SMA Xaverius Ambon", value: Math.round(total * 0.07), color: "#f59e0b" },
      { name: "MAN Ambon",          value: Math.round(total * 0.05), color: "#8b5cf6" },
      { name: "SMA Kristen Ambon",  value: Math.round(total * 0.04), color: "#14b8a6" },
      { name: "Sekolah Lainnya",    value: Math.round(total * 0.29), color: "#94a3b8" },
    ];

    return { total, dayaTampung, minat, registrasi, belum, jalurDonut, mandiriTab, topProdi, asal, mandiriAll, snbp, snbt, rasioProdi, asalSekolah };
  }, [semester, jalur, fakultas, jenjang]);

  const activeTab = vm.mandiriTab[tabMandiri];

  return (
    <div className="u-stack">
      {/* Header + Filters */}
      <div className="u-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Mahasiswa Baru</div>
          <div className="u-text-muted u-text-sm">SNBP • SNBT • Mandiri (Reguler, RPL, Prestasi, Afirmasi)</div>
        </div>
        <div className="u-filters">
          <label>Semester <select className="u-select" value={semester} onChange={e => setSemester(e.target.value)}>
            {SEMESTERS.slice().reverse().map(s => <option key={s} value={s}>{s}</option>)}
          </select></label>
          <label>Jalur <select className="u-select" value={jalur} onChange={e => setJalur(e.target.value)}>
            <option value="Semua">Semua</option><option value="SNBP">SNBP</option><option value="SNBT">SNBT</option><option value="Mandiri">Mandiri</option>
          </select></label>
          <label>Fakultas <select className="u-select" value={fakultas} onChange={e => setFakultas(e.target.value)}>
            <option value="Semua">Semua</option>
            <option value="Hukum">Hukum</option><option value="Teknik">Teknik</option><option value="FKIP">FKIP</option>
            <option value="FEB">FEB</option><option value="FISIP">FISIP</option><option value="Kedokteran">Kedokteran</option>
          </select></label>
          <label>Jenjang <select className="u-select" value={jenjang} onChange={e => setJenjang(e.target.value)}>
            {JENJANG_LIST.map(j => <option key={j} value={j}>{j}</option>)}
          </select></label>
        </div>
      </div>

      {/* KPI */}
      <div className="u-grid-4">
        <Kpi label="Total Mahasiswa Baru" value={fmt(vm.total)} hint={`Semester ${semester} • ${jalur}`} variant="blue" />
        <Kpi label="Daya Tampung" value={fmt(vm.dayaTampung)} hint="Kapasitas tersedia" variant="indigo" />
        <Kpi label="Peminat" value={fmt(vm.minat)} hint="Total pendaftar" variant="sky" />
        <Kpi label="Sudah Registrasi" value={fmt(vm.registrasi)} hint={`${Math.round(vm.registrasi / Math.max(1, vm.total) * 100)}% dari total`} variant="green" />
      </div>

      {/* Main Layout */}
      <div className="u-layout-lr">
        <div className="u-stack">
          {/* Donut Jalur */}
          <ChartCard title="Komposisi Jalur Penerimaan" right={<span className="u-badge u-badge--blue">Semester {semester}</span>}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={vm.jalurDonut} dataKey="value" nameKey="name" innerRadius={75} outerRadius={115} paddingAngle={2}>
                    {vm.jalurDonut.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              {vm.jalurDonut.map(j => (
                <div key={j.name} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 800 }}>{j.name}</span>
                  <span style={{ fontWeight: 900 }}>{fmt(j.value)}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Mandiri Tabs */}
          <ChartCard title="Mandiri — Detail Per Kategori">
            <div className="u-tabs">
              {["Reguler","RPL","Prestasi","Afirmasi"].map(t => (
                <button key={t} className={`u-tab${tabMandiri === t ? " active" : ""}`} onClick={() => setTabMandiri(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Kpi label={activeTab.label} value={fmt(activeTab.value)} hint={`Semester ${semester}`} variant="purple" />
              <div className="u-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Total Mandiri (Semua)</div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>{fmt(vm.mandiriAll)}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                  Reguler: {fmt(vm.mandiriTab.Reguler.value)} • RPL: {fmt(vm.mandiriTab.RPL.value)} • Prestasi: {fmt(vm.mandiriTab.Prestasi.value)} • Afirmasi: {fmt(vm.mandiriTab.Afirmasi.value)}
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Rasio Minat / Daya Tampung */}
          <ChartCard title="Rasio Minat / Daya Tampung Per Program Studi" right={<span className="u-badge u-badge--purple">Rasio Tinggi = Persaingan Tinggi</span>}>
            <table className="u-table">
              <thead>
                <tr>
                  <th>Program Studi</th>
                  <th>Daya Tampung</th>
                  <th>Peminat</th>
                  <th>Rasio Minat / Daya Tampung</th>
                </tr>
              </thead>
              <tbody>
                {vm.rasioProdi.map(r => (
                  <tr key={r.prodi}>
                    <td style={{ fontWeight: 800 }}>{r.prodi}</td>
                    <td>{fmt(r.dayaTampung)}</td>
                    <td>{fmt(r.peminat)}</td>
                    <td>
                      <span style={{
                        fontWeight: 900,
                        color: r.rasio >= 5 ? "#ef4444" : r.rasio >= 3 ? "#f59e0b" : "#22c55e",
                      }}>
                        {r.rasio.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ChartCard>

          {/* Top Prodi berdasarkan Rasio */}
          <ChartCard title="Top Program Studi (Berdasarkan Rasio Minat)">
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vm.topProdi} layout="vertical" barCategoryGap={10} margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `${v.toFixed(1)}x`} />
                  <Bar dataKey="value" name="Rasio Minat" fill="#8b5cf6" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Asal Wilayah */}
          <div className="u-grid-2">
            <ChartCard title="Sebaran Asal Wilayah">
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vm.asal} barCategoryGap={14}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={v => fmt(v)} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Sebaran Berdasarkan Asal Sekolah">
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vm.asalSekolah} barCategoryGap={14}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={v => fmt(v)} />
                    <Bar dataKey="value" name="Jumlah" radius={[6,6,0,0]}>
                      {vm.asalSekolah.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
                {vm.asalSekolah.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                    <span style={{ fontWeight: 800 }}>{s.name}: {fmt(s.value)}</span>
                    <span style={{ color: "#64748b" }}>({Math.round(s.value / Math.max(1, vm.total) * 100)}%)</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* RIGHT KPI */}
        <div className="u-stack">
          <Kpi label="SNBP" value={fmt(vm.snbp)} variant="blue" />
          <Kpi label="SNBT" value={fmt(vm.snbt)} variant="green" />
          <Kpi label="Mandiri (Total)" value={fmt(vm.mandiriAll)} variant="amber" />
          <Kpi label="Belum Registrasi" value={fmt(vm.belum)} hint="Butuh follow-up" variant="red" />

          <div className="u-card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Catatan</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#64748b", display: "grid", gap: 6, fontSize: 12 }}>
              <li>Semua data berubah sesuai filter Semester, Jalur, Fakultas, dan Jenjang.</li>
              <li>Tab Mandiri menampilkan detail RPL/Prestasi/Afirmasi.</li>
              <li>Rasio minat menunjukkan tingkat persaingan relatif.</li>
              <li>Data dummy — nanti disambungkan ke API SIAKAD.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
