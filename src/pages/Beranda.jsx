import { NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import StatSection from "../components/StatSection";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ===================== SIMPLE UI WRAPPERS ===================== */
function Card({ title, right, children }) {
  return (
    <section className="card" style={{ display: "grid", gap: 12, borderRadius: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontWeight: 1000, fontSize: 16 }}>{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

function MiniKpi({ label, value, accent = "#1e5aa8", hint }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: 16,
        padding: 14,
        display: "grid",
        gap: 6,
        borderLeft: `6px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 1000, lineHeight: 1.05, color: "#0f172a" }}>{value}</div>
      {hint ? <div style={{ fontSize: 12, color: "#6b7280" }}>{hint}</div> : null}
    </div>
  );
}

function Badge({ text, tone = "info" }) {
  const map = {
    info: { bg: "rgba(30,90,168,0.10)", fg: "#1e5aa8", bd: "rgba(30,90,168,0.20)" },
    warn: { bg: "rgba(245,158,11,0.14)", fg: "#b45309", bd: "rgba(245,158,11,0.25)" },
    ok: { bg: "rgba(16,185,129,0.12)", fg: "#047857", bd: "rgba(16,185,129,0.22)" },
  };
  const t = map[tone] ?? map.info;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function QuickLinkCard({ title, desc, to, icon }) {
  return (
    <NavLink
      to={to}
      className="card"
      style={{
        textDecoration: "none",
        borderRadius: 18,
        padding: 16,
        display: "grid",
        gap: 6,
        border: "1px solid #eef2f7",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={{ fontWeight: 1000, color: "#0f172a" }}>{title}</div>
        <div style={{ fontSize: 18 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{desc}</div>
      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 900, color: "#1e5aa8" }}>
        Buka →
      </div>
    </NavLink>
  );
}

/* ===================== HELPERS ===================== */
function id(n) {
  try {
    return Number(n).toLocaleString("id-ID");
  } catch {
    return String(n);
  }
}

/* ===================== PAGE ===================== */
export default function BerandaAkademik() {
  const [tahun, setTahun] = useState("2025/2026");
  const [fakultas, setFakultas] = useState("Semua");

  const items = [
    { title: "Total Mahasiswa", value: "18,240", icon: "👥", className: "statcard--purple" },
    { title: "Mahasiswa Baru", value: "3,200", icon: "🎓", className: "statcard--green" },
    { title: "Lulusan Tahun Ini", value: "2,500", icon: "🏅", className: "statcard--orange" },
    { title: "Mahasiswa Aktif", value: "16,910", icon: "✅", className: "statcard--blue" },
    { title: "Pendaftaran Ulang", value: "15,580", icon: "🔄", className: "statcard--yellow" },
  ];

  const vm = useMemo(() => {
    const base = tahun === "2025/2026" ? 1.0 : 0.95;

    const facWeight = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };
    const facFactor = facWeight[fakultas] ?? 1;

    // Mini KPI
    const totalMaba = Math.round(3200 * base * facFactor);
    const registrasi = Math.round(totalMaba * 0.88);
    const belumRegistrasi = Math.max(0, totalMaba - registrasi);

    const nonaktif = Math.round(16910 * 0.11 * facFactor);
    const ipk = (3.12 + (tahun === "2025/2026" ? 0.04 : 0)).toFixed(2);

    // Tren ringkas
    const trenAktif = [
      { tahun: "2021", value: Math.round(15200 * 0.92 * facFactor) },
      { tahun: "2022", value: Math.round(15800 * 0.96 * facFactor) },
      { tahun: "2023", value: Math.round(16350 * 0.99 * facFactor) },
      { tahun: "2024", value: Math.round(16910 * 1.01 * facFactor) },
      { tahun: "2025", value: Math.round(17320 * 1.04 * facFactor) },
    ];

    const trenMaba = [
      { tahun: "2021", value: Math.round(2800 * 0.95 * facFactor) },
      { tahun: "2022", value: Math.round(3000 * 0.98 * facFactor) },
      { tahun: "2023", value: Math.round(3100 * 1.0 * facFactor) },
      { tahun: "2024", value: Math.round(3200 * 1.02 * facFactor) },
      { tahun: "2025", value: Math.round(3300 * 1.05 * facFactor) },
    ];

    // Komposisi jalur (maba)
    const snbp = Math.round(totalMaba * 0.34);
    const snbt = Math.round(totalMaba * 0.41);
    const mandiri = Math.max(0, totalMaba - snbp - snbt);

    const komposisiJalur = [
      { name: "SNBP", value: snbp },
      { name: "SNBT", value: snbt },
      { name: "Mandiri", value: mandiri },
    ];

    // Top fakultas ringkas (aktif)
    const topFakultas = [
      { name: "Teknik", value: Math.round(4000 * base) },
      { name: "Ekonomi", value: Math.round(3200 * base) },
      { name: "Hukum", value: Math.round(2500 * base) },
      { name: "FISIP", value: Math.round(2800 * base) },
      { name: "Kedokteran", value: Math.round(1100 * base) },
    ];

    // Highlight (dummy insight)
    const highlight = [
      {
        tone: belumRegistrasi > 250 ? "warn" : "info",
        badge: belumRegistrasi > 250 ? "Perlu Follow-up" : "Stabil",
        text: `Belum registrasi: ${id(belumRegistrasi)} mahasiswa (estimasi)`,
      },
      {
        tone: nonaktif > 600 ? "warn" : "info",
        badge: nonaktif > 600 ? "Butuh perhatian" : "Terkendali",
        text: `Mahasiswa nonaktif: ${id(nonaktif)} (indikator administrasi / KRS)`,
      },
      {
        tone: "ok",
        badge: "Kinerja Akademik",
        text: `IPK rata-rata semester: ${ipk}`,
      },
    ];

    return {
      totalMaba,
      registrasi,
      belumRegistrasi,
      nonaktif,
      ipk,
      trenAktif,
      trenMaba,
      komposisiJalur,
      topFakultas,
      highlight,
    };
  }, [tahun, fakultas]);

  const PIE_COLORS = ["#1e5aa8", "#60a5fa", "#6366f1"];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Filter ringkas untuk Beranda */}
      <div
        className="card"
        style={{
          borderRadius: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 1000 }}>Ringkasan Akademik</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Snapshot cepat lintas menu untuk monitoring.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 900 }}>
            Tahun Akademik
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              style={{
                marginLeft: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              <option value="2025/2026">2025/2026</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </label>

          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 900 }}>
            Fakultas
            <select
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
              style={{
                marginLeft: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              <option value="Semua">Semua</option>
              <option value="Hukum">Hukum</option>
              <option value="Teknik">Teknik</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="FISIP">FISIP</option>
              <option value="Kedokteran">Kedokteran</option>
            </select>
          </label>
        </div>
      </div>

      {/* KPI utama (existing) */}
      <StatSection items={items} />

      {/* Mini KPI status */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(4, 1fr)" }}>
        <MiniKpi label="Mahasiswa Baru (estimasi)" value={id(vm.totalMaba)} accent="#1e5aa8" hint="Total intake terfilter" />
        <MiniKpi label="Registrasi" value={id(vm.registrasi)} accent="#2563eb" hint="Sudah daftar ulang" />
        <MiniKpi label="Belum Registrasi" value={id(vm.belumRegistrasi)} accent="#f59e0b" hint="Prioritas follow-up" />
        <MiniKpi label="IPK Rata-rata" value={vm.ipk} accent="#6366f1" hint="Semester berjalan" />
      </div>

      {/* Grid utama isi halaman */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.35fr 0.85fr", alignItems: "start" }}>
        {/* LEFT: Tren */}
        <div style={{ display: "grid", gap: 16 }}>
          <Card title="Tren Mahasiswa Aktif (5 Tahun)" right={<Badge text="Ringkas" tone="info" />}>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vm.trenAktif}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" />
                  <YAxis />
                  <Tooltip formatter={(v) => id(v)} />
                  <Line type="monotone" dataKey="value" stroke="#1e5aa8" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Tren Mahasiswa Baru (5 Tahun)" right={<Badge text="Ringkas" tone="info" />}>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vm.trenMaba} margin={{ top: 10, right: 16, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" />
                  <YAxis />
                  <Tooltip formatter={(v) => id(v)} />
                  <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Quick Actions" right={<Badge text="Shortcut" tone="ok" />}>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(4, 1fr)" }}>
              <QuickLinkCard title="Mahasiswa Aktif" desc="Lihat ringkasan & tren" to="/akademik/mahasiswa-aktif" icon="✅" />
              <QuickLinkCard title="Mahasiswa Baru" desc="SNBP/SNBT/Mandiri" to="/akademik/mahasiswa-baru" icon="🎓" />
              <QuickLinkCard title="Lulusan" desc="KPI + tabel 5 tahun" to="/akademik/lulusan" icon="🏅" />
              <QuickLinkCard title="Pelaporan" desc="Checkpoint 1 & 2" to="/akademik/pelaporan/checkpoint-1" icon="🧾" />
            </div>
          </Card>
        </div>

        {/* RIGHT: Komposisi + Highlight */}
        <div style={{ display: "grid", gap: 16 }}>
          <Card
            title="Komposisi Jalur Penerimaan"
            right={<span style={{ fontWeight: 900, color: "#6b7280" }}>SNBP/SNBT/Mandiri</span>}
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vm.komposisiJalur}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={2}
                  >
                    {vm.komposisiJalur.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => id(v)} />
                  <Legend verticalAlign="bottom" height={24} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {vm.komposisiJalur.map((x) => (
                <div key={x.name} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 10, fontSize: 14 }}>
                  <div style={{ fontWeight: 1000 }}>{x.name}</div>
                  <div style={{ fontWeight: 1000 }}>{id(x.value)}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Top 5 Fakultas (Mahasiswa Aktif)" right={<Badge text="Ringkas" tone="info" />}>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vm.topFakultas} margin={{ top: 10, right: 16, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(v) => id(v)} />
                  <Bar dataKey="value" fill="#1e5aa8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Highlight & Alert" right={<Badge text="Monitoring" tone="warn" />}>
            <div style={{ display: "grid", gap: 10 }}>
              {vm.highlight.map((h, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    borderRadius: 16,
                    padding: 12,
                    border: "1px solid #eef2f7",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <Badge text={h.badge} tone={h.tone} />
                    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 900 }}>Auto insight</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 900 }}>
                    {h.text}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#6b7280" }}>
        







        
      </div>
    </div>
  );
}
