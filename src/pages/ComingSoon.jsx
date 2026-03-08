import { useNavigate } from "react-router-dom";
import unpattiLogo from "../assets/unpatti-logo.png";
import "../styles/unpatti.css";

const MODULE_META = {
  sdm: {
    title: "SDM",
    desc: "Statistik dosen dan tenaga kependidikan.",
    icon: "👥",
    gradient: "linear-gradient(135deg, #047857, #34d399)",
  },
  beasiswa: {
    title: "Beasiswa",
    desc: "Ringkasan penerima beasiswa dan bantuan pendidikan.",
    icon: "🎓",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  },
  akreditasi: {
    title: "Akreditasi",
    desc: "Status akreditasi program studi dan institusi.",
    icon: "✅",
    gradient: "linear-gradient(135deg, #b45309, #fbbf24)",
  },
  keuangan: {
    title: "Keuangan",
    desc: "Ringkasan laporan dan statistik keuangan.",
    icon: "💰",
    gradient: "linear-gradient(135deg, #15803d, #4ade80)",
  },
};

export default function ComingSoon({ moduleKey = "sdm" }) {
  const navigate = useNavigate();
  const meta = MODULE_META[moduleKey] ?? MODULE_META.sdm;

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7" }}>
      {/* Header */}
      <div
        style={{
          background: meta.gradient,
          padding: "48px 20px 36px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <img
            src={unpattiLogo}
            alt="UNPATTI"
            style={{
              width: 56,
              height: 56,
              objectFit: "contain",
              background: "#fff",
              borderRadius: 12,
              padding: 4,
            }}
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 0.5 }}>
              Dashboard Warehouse UNPATTI
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              Modul {meta.title}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "48px 32px",
            boxShadow: "0 8px 40px rgba(15,23,42,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>{meta.icon}</div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            COMING SOON
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#1e5aa8",
              marginBottom: 12,
            }}
          >
            Modul {meta.title}
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {meta.desc}
            <br />
            Modul ini sedang dalam tahap pengembangan dan akan segera tersedia.
          </div>

          {/* Progress indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 180,
                height: 6,
                background: "#e2e8f0",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "15%",
                  height: "100%",
                  background: meta.gradient,
                  borderRadius: 99,
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>
            <span
              style={{ fontSize: 11, fontWeight: 800, color: "#64748b" }}
            >
              Dalam Pengembangan
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(135deg, #0b2545, #1e5aa8)",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              transition: "transform 150ms, box-shadow 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(15,23,42,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
