import { useMemo, useState, useEffect } from "react";
import { getProdiList, getProdiWeight } from "../data/fakultasProdi";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";

/* ──── helpers ──── */
const fmt = (n) => { try { return Number(n).toLocaleString("id-ID"); } catch { return n; } };
const COLORS = ["#1e5aa8","#3b82f6","#60a5fa","#93c5fd","#6366f1","#8b5cf6"];
const FAC_COLORS = { Hukum:"#6366f1", Teknik:"#2563eb", FKIP:"#0ea5e9", FEB:"#16a34a", FISIP:"#f59e0b", Kedokteran:"#ef4444", Pertanian:"#22c55e", Perikanan:"#14b8a6" };
const STATUS_COLORS = ["#1e5aa8","#22c55e","#f59e0b","#ef4444","#8b5cf6"];

/* Semester options: 2021-1 s.d 2025-2 */
const SEMESTERS = [];
for (let y = 2021; y <= 2025; y++) {
  SEMESTERS.push(`${y}-1`);
  SEMESTERS.push(`${y}-2`);
}

const JENJANG_LIST = ["Semua", "S1", "S2", "S3", "D3", "Profesi"];
const JENJANG_WEIGHTS = { Semua: 1, S1: 0.78, S2: 0.10, S3: 0.02, D3: 0.04, Profesi: 0.06 };

/* ──── charts ──── */
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

function KpiFlat({ label, value, hint, bg }) {
  return (
    <div className="u-kpi-flat">
      <div className="u-kpi-flat__body" style={{ background: bg }}>
        <div className="u-kpi-flat__label">{label}</div>
        <div className="u-kpi-flat__value">{value}</div>
      </div>
      <div className="u-kpi-flat__footer" style={{ background: bg, opacity: 0.85 }}>
        {hint}
      </div>
    </div>
  );
}

/* ──── helper to parse semester ──── */
function semesterFactor(sem) {
  const [y, s] = sem.split("-").map(Number);
  // linear growth factor from 2021-1 (base) to 2025-2
  const idx = (y - 2021) * 2 + (s - 1); // 0..9
  return 0.90 + idx * 0.02; // 0.90 to 1.08
}

/* ──── page ──── */
export default function MahasiswaAktif() {
  const [semester, setSemester] = useState("2025-2");
  const [fakultas, setFakultas] = useState("Semua");
  const [prodi, setProdi] = useState("Semua");
  const [jenjang, setJenjang] = useState("Semua");

  // Reset prodi saat fakultas berubah
  useEffect(() => { setProdi("Semua"); }, [fakultas]);

  const prodiList = getProdiList(fakultas);

  const vm = useMemo(() => {
    const sf = semesterFactor(semester);
    const FAC_W = { Semua:1, Hukum:0.12, Teknik:0.16, FKIP:0.22, FEB:0.15, FISIP:0.10, Kedokteran:0.06, Pertanian:0.10, Perikanan:0.09 };
    const ff = FAC_W[fakultas] ?? 1;
    const pf = getProdiWeight(prodi);
    const jf = JENJANG_WEIGHTS[jenjang] ?? 1;

    const aktif    = Math.round(26000 * sf * ff * pf * jf);
    const nonaktif = Math.round(aktif * 0.08);
    const cuti     = Math.round(aktif * 0.03);
    const ipk      = (3.12 + (sf > 1.04 ? 0.04 : sf < 0.94 ? -0.03 : 0)).toFixed(2);

    const byJenjang = [
      { name: "S1", value: Math.round(26000 * sf * ff * pf * 0.78) },
      { name: "S2", value: Math.round(26000 * sf * ff * pf * 0.10) },
      { name: "S3", value: Math.round(26000 * sf * ff * pf * 0.02) },
      { name: "Profesi", value: Math.round(26000 * sf * ff * pf * 0.06) },
      { name: "D3", value: Math.round(26000 * sf * ff * pf * 0.04) },
    ];

    const barFakultas = [
      { name: "FKIP",    value: Math.round(5600 * sf * pf * jf) },
      { name: "FEB",     value: Math.round(3900 * sf * pf * jf) },
      { name: "Teknik",  value: Math.round(4200 * sf * pf * jf) },
      { name: "Hukum",   value: Math.round(3100 * sf * pf * jf) },
      { name: "FISIP",   value: Math.round(2600 * sf * pf * jf) },
      { name: "Kedokteran", value: Math.round(1500 * sf * pf * jf) },
      { name: "Pertanian",  value: Math.round(2700 * sf * pf * jf) },
      { name: "Perikanan",  value: Math.round(2400 * sf * pf * jf) },
    ];

    const statusSemester = [
      { name: "Aktif",         value: Math.round(aktif * 0.82) },
      { name: "Isi KRS",       value: Math.round(aktif * 0.74) },
      { name: "Belum KRS",     value: Math.round(aktif * 0.08) },
      { name: "Non Aktif",     value: nonaktif },
      { name: "Cuti",          value: cuti },
    ];

    // Tren per semester (2021-1 s/d 2025-2)
    const trenAktif = SEMESTERS.map(sem => {
      const f = semesterFactor(sem);
      return { semester: sem, value: Math.round(26000 * f * ff * pf * jf) };
    });

    const ipkBar = [
      { range: "< 2.0",      value: Math.round(aktif * 0.02) },
      { range: "2.0 - 2.49", value: Math.round(aktif * 0.08) },
      { range: "2.5 - 2.99", value: Math.round(aktif * 0.22) },
      { range: "3.0 - 3.49", value: Math.round(aktif * 0.42) },
      { range: "3.5 - 4.0",  value: Math.round(aktif * 0.26) },
    ];

    const transfer = SEMESTERS.filter(s => s.endsWith("-1")).map((sem, i) => {
      const y = sem.split("-")[0];
      return { tahun: y, internal: 45 + i * 5, external: 32 + i * 4 };
    });

    const ipkSks = [
      { range: "< 2.0",      sks: 16 },
      { range: "2.0 - 2.49", sks: 18 },
      { range: "2.5 - 2.99", sks: 20 },
      { range: "3.0 - 3.49", sks: 22 },
      { range: "3.5 - 4.0",  sks: 24 },
    ];

    const jenjangFlat = [
      { label: "Mahasiswa D3", value: byJenjang.find(x=>x.name==="D3")?.value ?? 0, bg: "#14b8a6" },
      { label: "Mahasiswa S1", value: byJenjang.find(x=>x.name==="S1")?.value ?? 0, bg: "#ef4444" },
      { label: "Mahasiswa S2", value: byJenjang.find(x=>x.name==="S2")?.value ?? 0, bg: "#3b82f6" },
      { label: "Mahasiswa S3", value: byJenjang.find(x=>x.name==="S3")?.value ?? 0, bg: "#eab308" },
      { label: "Mahasiswa Profesi", value: byJenjang.find(x=>x.name==="Profesi")?.value ?? 0, bg: "#8b5cf6" },
    ];

    return { aktif, nonaktif, cuti, ipk, byJenjang, barFakultas, statusSemester, trenAktif, ipkBar, transfer, ipkSks, jenjangFlat };
  }, [semester, fakultas, prodi, jenjang]);

  return (
    <div className="u-stack">
      {/* Header + Filters */}
      <div className="u-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Mahasiswa Aktif</div>
          <div className="u-text-muted u-text-sm">Data mahasiswa aktif per semester berjalan</div>
        </div>
        <div className="u-filters">
          <label>Semester <select className="u-select" value={semester} onChange={e => setSemester(e.target.value)}>
            {SEMESTERS.slice().reverse().map(s => <option key={s} value={s}>{s}</option>)}
          </select></label>
          <label>Fakultas <select className="u-select" value={fakultas} onChange={e => setFakultas(e.target.value)}>
            <option value="Semua">Semua</option>
            {Object.keys(FAC_COLORS).map(f => <option key={f} value={f}>{f}</option>)}
          </select></label>
          <label>Prodi <select className="u-select" value={prodi} onChange={e => setProdi(e.target.value)}>
            <option value="Semua">Semua</option>
            {prodiList.map(p => <option key={p} value={p}>{p}</option>)}
          </select></label>
          <label>Jenjang <select className="u-select" value={jenjang} onChange={e => setJenjang(e.target.value)}>
            {JENJANG_LIST.map(j => <option key={j} value={j}>{j}</option>)}
          </select></label>
        </div>
      </div>

      {/* Main Layout: Charts left + KPI right */}
      <div className="u-layout-lr">
        {/* LEFT */}
        <div className="u-stack">
          {/* Row 1: Donut Jenjang + Bar Angkatan */}
          <div className="u-grid-2">
            <ChartCard title="Mahasiswa Aktif Berdasarkan Jenjang Pendidikan">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={vm.byJenjang} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                      {vm.byJenjang.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={v => fmt(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Mahasiswa Aktif Berdasarkan Angkatan">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vm.trenAktif.slice(-5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={v => fmt(v)} />
                    <Bar dataKey="value" fill="#1e5aa8" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Tren Mahasiswa Aktif per Semester */}
          <ChartCard title="Tren Mahasiswa Aktif (Per Semester, 2021-1 s/d 2025-2)">
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vm.trenAktif}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip formatter={v => fmt(v)} />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* RIGHT KPI */}
        <div className="u-stack">
          <Kpi label="👥 Mahasiswa Aktif" value={fmt(vm.aktif)} hint={`Semester ${semester}`} variant="green" />
          <Kpi label="📋 Mahasiswa Isi KRS" value={fmt(Math.round(vm.aktif * 0.82))} variant="sky" />
          <Kpi label="🆕 Mahasiswa Baru" value={fmt(Math.round(vm.aktif * 0.18))} hint={`Semester ${semester}`} variant="brown" />
          <Kpi label="❌ Mahasiswa Non Aktif" value={fmt(vm.nonaktif)} variant="red" />
          <Kpi label="⏸️ Mahasiswa Cuti" value={fmt(vm.cuti)} variant="amber" />
          <Kpi label="📊 IPK Rata-rata" value={vm.ipk} variant="purple" />
        </div>
      </div>

      {/* Section Divider */}
      <div className="u-divider">MAHASISWA AKTIF</div>

      {/* KPI Flat Cards (jenjang) */}
      <div className="u-grid-5">
        {vm.jenjangFlat.map(k => (
          <KpiFlat key={k.label} label={k.label} value={fmt(k.value)} hint={`Semester ${semester}`} bg={k.bg} />
        ))}
      </div>

      {/* Bar Fakultas */}
      <ChartCard title="Mahasiswa Aktif Berdasarkan Fakultas">
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vm.barFakultas} barCategoryGap={14}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {vm.barFakultas.map((d, i) => <Cell key={i} fill={FAC_COLORS[d.name] ?? COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Status Semester + IPK Distribution */}
      <div className="u-grid-2">
        <ChartCard title="Mahasiswa Aktif Berdasarkan Status Semester">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vm.statusSemester} barCategoryGap={14}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {vm.statusSemester.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Distribusi IPK Mahasiswa Aktif" right={<span className="u-badge u-badge--blue">Rata-rata: {vm.ipk}</span>}>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vm.ipkBar} barCategoryGap={14}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Transfer + IPK-SKS */}
      <div className="u-grid-2">
        <ChartCard title="Grafik Mahasiswa Transfer Per Tahun" right={<span className="u-badge u-badge--green">Internal & External (Masuk)</span>}>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vm.transfer}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tahun" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="internal" name="Internal" stroke="#1e5aa8" strokeWidth={2} dot />
                <Line type="monotone" dataKey="external" name="External (Masuk)" stroke="#22c55e" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Range IPK & Pengembalian SKS">
          <table className="u-table">
            <thead><tr><th>Range IPK</th><th>Maks SKS</th><th>Jumlah Mahasiswa</th></tr></thead>
            <tbody>
              {vm.ipkSks.map((r, i) => (
                <tr key={r.range}>
                  <td style={{ fontWeight: 800 }}>{r.range}</td>
                  <td>{r.sks} SKS</td>
                  <td style={{ fontWeight: 800 }}>{fmt(vm.ipkBar[i]?.value ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </div>

      {/* Map Placeholder */}
      <ChartCard title="Sebaran Mahasiswa Aktif Per Wilayah">
        <div className="u-map-placeholder">
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🗺️</div>
            <div>Peta Sebaran Wilayah</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Akan diimplementasi dengan library peta</div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
