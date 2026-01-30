import { useNavigate } from "react-router-dom";
import unpattiLogo from "../assets/unpatti-logo.png";

function Card({ title, desc, onClick, color }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="home-card"
      style={{
        // biar tinggi sejajar + rapi
        minHeight: 260,
      }}
    >
      {/* ICON + TITLE */}
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div
          className="home-card-icon"
          style={{
            background: color.bg,
            borderColor: "rgba(30, 90, 168, 0.18)",
            color: color.fg,
          }}
        >
          {color.icon}
        </div>

        <div style={{ fontSize: 22, fontWeight: 900 }}>{title}</div>
      </div>

      {/* DESCRIPTION (maks 3 baris) */}
      <div
        style={{
          color: "#475569",
          fontSize: 14,
          lineHeight: 1.6,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {desc}
      </div>

      {/* CTA nempel bawah */}
      <div className="home-card-cta" style={{ color: color.fg }}>
        Buka Modul →
      </div>
    </button>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%" }}>
      {/* FULL WIDTH HEADER */}
      <div
        style={{
          width: "100%",
          background:
            "linear-gradient(90deg, rgba(30,90,168,0.20), rgba(96,165,250,0.18))",
          padding: "36px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            gap: 18,
            alignItems: "center",
          }}
        >
          <img
            src={unpattiLogo}
            alt="UNPATTI"
            style={{ width: 72, height: 72, objectFit: "contain" }}
          />

          <div>
            <div style={{ fontSize: 34, fontWeight: 900 }}>
              Dashboard Warehouse UNPATTI
            </div>
            <div style={{ fontSize: 16, color: "#475569", marginTop: 6 }}>
              Pusat visualisasi data universitas untuk monitoring dan pengambilan
              keputusan.
            </div>
          </div>
        </div>
      </div>

      {/* GRID MENU - 5 SEJAJAR DI TENGAH */}
      <div
        className="home-grid"
        style={{
          maxWidth: 1320,
          margin: "32px auto 0",
          padding: "0 16px",
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: "repeat(5, minmax(220px, 1fr))",
          gap: 24,
        }}
      >
        <Card
          title="Akademik"
          desc="Mahasiswa aktif, mahasiswa baru, SNBP, SNBT, Mandiri, lulusan, dan pelaporan akademik."
          color={{
            bg: "rgba(30,90,168,0.12)",
            fg: "#1e5aa8",
            icon: "🏛️",
          }}
          onClick={() => navigate("/akademik/beranda")}
        />

        <Card
          title="SDM"
          desc="Statistik dosen dan tenaga kependidikan (placeholder)."
          color={{
            bg: "rgba(16,185,129,0.12)",
            fg: "#047857",
            icon: "👥",
          }}
          onClick={() => navigate("/sdm")}
        />

        <Card
          title="Beasiswa"
          desc="Ringkasan penerima beasiswa dan bantuan pendidikan (placeholder)."
          color={{
            bg: "rgba(168,85,247,0.12)",
            fg: "#7c3aed",
            icon: "🎓",
          }}
          onClick={() => navigate("/beasiswa")}
        />

        <Card
          title="Akreditasi"
          desc="Status akreditasi program studi dan institusi (placeholder)."
          color={{
            bg: "rgba(234,88,12,0.12)",
            fg: "#c2410c",
            icon: "✅",
          }}
          onClick={() => navigate("/akreditasi")}
        />

        <Card
          title="Keuangan"
          desc="Ringkasan laporan dan statistik keuangan (placeholder)."
          color={{
            bg: "rgba(34,197,94,0.12)",
            fg: "#15803d",
            icon: "💰",
          }}
          onClick={() => navigate("/keuangan")}
        />
      </div>

      {/* RESPONSIVE */}
      <style>{`
        @media (max-width: 1300px) {
          .home-grid { grid-template-columns: repeat(3, minmax(220px, 1fr)) !important; }
        }
        @media (max-width: 900px) {
          .home-grid { grid-template-columns: repeat(2, minmax(220px, 1fr)) !important; }
        }
        @media (max-width: 560px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
