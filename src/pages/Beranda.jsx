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

/* ===================== CARD WRAPPER ===================== */
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
        <div style={{ fontWeight: 900, fontSize: 15 }}>{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* ===================== MINI KPI ===================== */
function MiniKpi({ label, value, accent = "#1e5aa8", hint }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: 14,
        padding: 12,
        display: "grid",
        gap: 4,
        borderLeft: `5px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.1 }}>{value}</div>
      {hint && <div style={{ fontSize: 11, color: "#6b7280" }}>{hint}</div>}
    </div>
  );
}

/* ===================== QUICK LINK ===================== */
function QuickLinkCard({ title, desc, to, icon }) {
  return (
    <NavLink
      to={to}
      className="card"
      style={{
        textDecoration: "none",
        borderRadius: 16,
        padding: 14,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 14 }}>{title}</div>
        <span>{icon}</span>
      </div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{desc}</div>
      <div style={{ fontSize: 12, fontWeight: 900, color: "#1e5aa8" }}>Buka →</div>
    </NavLink>
  );
}

/* ===================== HELPERS ===================== */
const id = (n) => Number(n).toLocaleString("id-ID");

/* ===================== PAGE ===================== */
export default function BerandaAkademik() {
  const [tahun] = useState("2025/2026");

  /* KPI UTAMA (DIPERKECIL) */
  const items = [
    { title: "Total Mahasiswa", value: "18,240", icon: "👥", className: "statcard--purple" },
    { title: "Mahasiswa Baru", value: "3,200", icon: "🎓", className: "statcard--green" },
    { title: "Lulusan", value: "2,500", icon: "🏅", className: "statcard--orange" },
    { title: "Mahasiswa Aktif", value: "16,910", icon: "✅", className: "statcard--blue" },
    { title: "Registrasi Ulang", value: "15,580", icon: "🔄", className: "statcard--yellow" },
  ];

  const vm = useMemo(() => {
    return {
      maba: 3200,
      registrasi: 2810,
      belum: 390,
      ipk: "3.16",
      trenAktif: [
        { tahun: "2021", v: 15200 },
        { tahun: "2022", v: 15800 },
        { tahun: "2023", v: 16350 },
        { tahun: "2024", v: 16910 },
        { tahun: "2025", v: 17320 },
      ],
      jalur: [
        { name: "SNBP", value: 1100 },
        { name: "SNBT", value: 1350 },
        { name: "Mandiri", value: 750 },
      ],
    };
  }, []);

  const PIE_COLORS = ["#1e5aa8", "#60a5fa", "#6366f1"];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* HEADER */}
      <div className="card" style={{ borderRadius: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>Ringkasan Akademik</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Snapshot data akademik • Tahun {tahun}
        </div>
      </div>

      {/* KPI UTAMA — RESPONSIVE */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        <StatSection items={items} />
      </div>

      {/* MINI KPI */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        }}
      >
        <MiniKpi label="Mahasiswa Baru" value={id(vm.maba)} />
        <MiniKpi label="Registrasi" value={id(vm.registrasi)} accent="#2563eb" />
        <MiniKpi label="Belum Registrasi" value={id(vm.belum)} accent="#f59e0b" />
        <MiniKpi label="IPK Rata-rata" value={vm.ipk} accent="#6366f1" />
      </div>

      {/* GRID UTAMA */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
        }}
      >
        <Card title="Tren Mahasiswa Aktif (5 Tahun)">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vm.trenAktif}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tahun" />
                <YAxis />
                <Tooltip />
                <Line dataKey="v" stroke="#1e5aa8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Komposisi Jalur Penerimaan">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vm.jalur} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                  {vm.jalur.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* QUICK ACTION */}
      <Card title="Akses Cepat">
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
