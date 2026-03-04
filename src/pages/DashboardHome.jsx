import { useNavigate } from "react-router-dom";
import unpattiLogo from "../assets/unpatti-logo.png";
import "../styles/unpatti.css";

const MODULES = [
  {
    title: "Akademik",
    desc: "Mahasiswa aktif, mahasiswa baru, lulusan, pelaporan, dan data akademik lainnya.",
    icon: "🏛️",
    bg: "linear-gradient(135deg, #1e5aa8, #3b82f6)",
    to: "/akademik/beranda",
  },
  {
    title: "SDM",
    desc: "Statistik dosen dan tenaga kependidikan (segera hadir).",
    icon: "👥",
    bg: "linear-gradient(135deg, #047857, #34d399)",
    to: "/sdm",
  },
  {
    title: "Beasiswa",
    desc: "Ringkasan penerima beasiswa dan bantuan pendidikan (segera hadir).",
    icon: "🎓",
    bg: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    to: "/beasiswa",
  },
  {
    title: "Akreditasi",
    desc: "Status akreditasi program studi dan institusi (segera hadir).",
    icon: "✅",
    bg: "linear-gradient(135deg, #b45309, #fbbf24)",
    to: "/akreditasi",
  },
  {
    title: "Keuangan",
    desc: "Ringkasan laporan dan statistik keuangan (segera hadir).",
    icon: "💰",
    bg: "linear-gradient(135deg, #15803d, #4ade80)",
    to: "/keuangan",
  },
];

function Card({ title, desc, icon, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 20,
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 220,
        boxShadow: "0 4px 16px rgba(15,23,42,0.07)",
        transition: "transform 150ms, box-shadow 150ms",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.07)";
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            display: "grid", placeItems: "center",
            background: bg, fontSize: 20, color: "#fff",
          }}
        >
          {icon}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>{title}</div>
      </div>
      <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, flex: 1 }}>
        {desc}
      </div>
      <div style={{ fontWeight: 800, color: "#1e5aa8", fontSize: 13 }}>
        Buka Modul →
      </div>
    </button>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2545, #1e5aa8, #60a5fa)",
          padding: "48px 20px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center", marginBottom: 12 }}>
          <img src={unpattiLogo} alt="UNPATTI" style={{ width: 64, height: 64, objectFit: "contain" }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 0.5 }}>
              Dashboard Warehouse UNPATTI
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>
              Pusat visualisasi data universitas untuk monitoring dan pengambilan keputusan.
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: "32px auto 0",
          padding: "0 20px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {MODULES.map((m) => (
          <Card key={m.title} {...m} onClick={() => navigate(m.to)} />
        ))}
      </div>
    </div>
  );
}
