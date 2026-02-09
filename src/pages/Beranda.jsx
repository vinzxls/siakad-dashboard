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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ===================== BASIC UI ===================== */
function Card({ title, right, children }) {
  return (
    <section className="card" style={{ display: "grid", gap: 10, borderRadius: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 14 }}>{title}</div>
        {right}
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
        borderRadius: 14,
        padding: 12,
        display: "grid",
        gap: 4,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 900 }}>{value}</div>
      {hint && <div style={{ fontSize: 11, color: "#6b7280" }}>{hint}</div>}
    </div>
  );
}

function Badge({ text, tone = "info" }) {
  const map = {
    info: { bg: "#eff6ff", fg: "#1e5aa8" },
    warn: { bg: "#fff7ed", fg: "#c2410c" },
    ok: { bg: "#ecfdf5", fg: "#047857" },
  };
  const t = map[tone] ?? map.info;

  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 800,
        padding: "4px 8px",
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
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
        borderRadius: 14,
        padding: 12,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 13, color: "#0f172a" }}>{title}</div>
        <span>{icon}</span>
      </div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{desc}</div>
      <div style={{ fontSize: 12, fontWeight: 900, color: "#1e5aa8" }}>Buka →</div>
    </NavLink>
  );
}

/* ===================== HELPERS ===================== */
const id = (n) => {
  try {
    return Number(n).toLocaleString("id-ID");
  } catch {
    return String(n);
  }
};

// Komposisi jalur PER TAHUN (dummy tapi realistis)
function getJalurShareByYear(tahun) {
  // total harus = 1.0
  // bedakan per tahun supaya donut jelas berubah
  if (tahun === "2025") return { snbp: 0.30, snbt: 0.45, mandiri: 0.25 };
  if (tahun === "2024") return { snbp: 0.34, snbt: 0.41, mandiri: 0.25 };
  return { snbp: 0.38, snbt: 0.37, mandiri: 0.25 }; // 2023
}

/* ===================== PAGE ===================== */
export default function BerandaAkademik() {
  const [tahun, setTahun] = useState("2025");

  const vm = useMemo(() => {
    const yearFactor = tahun === "2025" ? 1 : tahun === "2024" ? 0.96 : 0.9;

    // KPI utama (dummy)
    const totalMahasiswa = Math.round(18240 * yearFactor);
    const mahasiswaAktif = Math.round(16910 * yearFactor);
    const maba = Math.round(3200 * yearFactor);
    const registrasiUlang = Math.round(15580 * yearFactor);
    const lulusan = Math.round(2500 * yearFactor);

    // mini KPI
    const registrasiMaba = Math.round(maba * 0.88);
    const belumRegistrasi = Math.max(0, maba - registrasiMaba);
    const nonaktif = Math.max(0, totalMahasiswa - mahasiswaAktif);
    const ipk = (3.12 + (tahun === "2025" ? 0.04 : tahun === "2024" ? 0.02 : 0)).toFixed(2);

    // tren aktif
    const trenAktif = [
      { tahun: "2021", v: Math.round(15200 * 0.92 * yearFactor) },
      { tahun: "2022", v: Math.round(15800 * 0.96 * yearFactor) },
      { tahun: "2023", v: Math.round(16350 * 0.99 * yearFactor) },
      { tahun: "2024", v: Math.round(16910 * 1.01 * yearFactor) },
      { tahun: "2025", v: Math.round(17320 * 1.04 * yearFactor) },
    ];

    // ✅ komposisi jalur (proporsi beda tiap tahun)
    const share = getJalurShareByYear(tahun);
    const snbp = Math.round(maba * share.snbp);
    const snbt = Math.round(maba * share.snbt);
    const mandiri = Math.max(0, maba - snbp - snbt);

    const jalur = [
      { name: "SNBP", value: snbp },
      { name: "SNBT", value: snbt },
      { name: "Mandiri", value: mandiri },
    ];

    const highlight = [
      {
        tone: belumRegistrasi > 400 ? "warn" : "info",
        badge: "Registrasi",
        text: `Belum registrasi ${id(belumRegistrasi)} mahasiswa`,
      },
      {
        tone: nonaktif > 2000 ? "warn" : "info",
        badge: "Status",
        text: `Mahasiswa nonaktif ${id(nonaktif)} orang`,
      },
      {
        tone: "ok",
        badge: "Akademik",
        text: `IPK rata-rata ${ipk}`,
      },
    ];

    const items = [
      { title: "Total Mahasiswa", value: id(totalMahasiswa), icon: "👥", className: "statcard--purple" },
      { title: "Mahasiswa Baru", value: id(maba), icon: "🎓", className: "statcard--green" },
      { title: "Lulusan", value: id(lulusan), icon: "🏅", className: "statcard--orange" },
      { title: "Mahasiswa Aktif", value: id(mahasiswaAktif), icon: "✅", className: "statcard--blue" },
      { title: "Registrasi Ulang", value: id(registrasiUlang), icon: "🔄", className: "statcard--yellow" },
    ];

    return {
      items,
      maba,
      registrasiMaba,
      belumRegistrasi,
      ipk,
      trenAktif,
      jalur,
      highlight,
    };
  }, [tahun]);

  const PIE_COLORS = ["#1e5aa8", "#60a5fa", "#6366f1"];

  // ✅ Legend custom: tampilkan nilai + persen (biar perubahan tahun kelihatan)
  const renderLegend = (props) => {
    const { payload } = props;
    if (!payload?.length) return null;

    const total = vm.jalur.reduce((a, b) => a + b.value, 0) || 1;

    return (
      <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
        {payload.map((p, i) => {
          const item = vm.jalur[i];
          const percent = Math.round((item.value / total) * 100);
          return (
            <div key={p.value} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: p.color,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontWeight: 900, color: "#0f172a" }}>{p.value}</span>
                <span style={{ color: "#6b7280", fontWeight: 800 }}>{percent}%</span>
              </div>
              <div style={{ fontWeight: 900, color: "#0f172a" }}>{id(item.value)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* HEADER + DROPDOWN TAHUN */}
      <div
        className="card"
        style={{
          borderRadius: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 900 }}>Ringkasan Akademik</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Snapshot data akademik per tahun</div>
        </div>

        <label style={{ fontSize: 12, fontWeight: 800, color: "#6b7280" }}>
          Tahun
          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            style={{
              marginLeft: 8,
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#fff",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </label>
      </div>

      {/* KPI UTAMA */}
      <StatSection items={vm.items} />

      {/* MINI KPI */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        }}
      >
        <MiniKpi label="Mahasiswa Baru" value={id(vm.maba)} />
        <MiniKpi label="Registrasi" value={id(vm.registrasiMaba)} accent="#2563eb" />
        <MiniKpi label="Belum Registrasi" value={id(vm.belumRegistrasi)} accent="#f59e0b" />
        <MiniKpi label="IPK Rata-rata" value={vm.ipk} accent="#6366f1" />
      </div>

      {/* GRID UTAMA */}
      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        <Card title="Tren Mahasiswa Aktif (5 Tahun)">
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vm.trenAktif}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tahun" />
                <YAxis />
                <Tooltip formatter={(v) => id(v)} />
                <Line dataKey="v" stroke="#1e5aa8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ✅ FIX: tinggi dinaikkan + donut dinaikkan (cy) supaya tidak kepotong */}
        <Card title="Komposisi Jalur Penerimaan" right={<Badge text={`Tahun ${tahun}`} tone="info" />}>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vm.jalur}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  cx="50%"
                  cy="45%"
                >
                  {vm.jalur.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>

                <Tooltip formatter={(v) => id(v)} labelFormatter={(label) => `Jalur: ${label}`} />

                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            Total: <b style={{ color: "#0f172a" }}>{id(vm.maba)}</b>
          </div>
        </Card>
      </div>

      {/* HIGHLIGHT ALERT */}
      <Card title="Highlight & Alert" right={<Badge text="Monitoring" tone="warn" />}>
        <div
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {vm.highlight.map((h, i) => (
            <div
              key={i}
              className="card"
              style={{
                borderRadius: 14,
                padding: 10,
                display: "grid",
                gap: 6,
                border: "1px solid #eef2f7",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Badge text={h.badge} tone={h.tone} />
                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 800 }}>Tahun {tahun}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900 }}>{h.text}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* QUICK ACTION */}
      <Card title="Akses Cepat">
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          }}
        >
          <QuickLinkCard title="Mahasiswa Aktif" desc="Distribusi & tren" to="/akademik/mahasiswa-aktif" icon="✅" />
          <QuickLinkCard title="Mahasiswa Baru" desc="SNBP • SNBT • Mandiri" to="/akademik/mahasiswa-baru" icon="🎓" />
          <QuickLinkCard title="Lulusan" desc="KPI & tren" to="/akademik/lulusan" icon="🏅" />
          <QuickLinkCard title="Pelaporan" desc="Checkpoint" to="/akademik/pelaporan/checkpoint-1" icon="🧾" />
        </div>
      </Card>

      <div style={{ fontSize: 12, color: "#6b7280" }}>
        
      </div>
    </div>
  );
}
