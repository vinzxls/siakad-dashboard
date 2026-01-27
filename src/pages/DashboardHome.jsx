import { useNavigate } from "react-router-dom";
import unpattiLogo from "../assets/unpatti-logo.png";

function Card({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        textAlign: "left",
        cursor: "pointer",
        borderRadius: 18,
        padding: 22,
        display: "grid",
        gap: 10,
        border: "1px solid rgba(30,90,168,0.20)",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 900 }}>{title}</div>
      <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.5 }}>{desc}</div>
      <div style={{ marginTop: 6, fontWeight: 900, color: "#1e5aa8" }}>Buka →</div>
    </button>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        className="card"
        style={{
          borderRadius: 18,
          padding: 22,
          display: "grid",
          gap: 10,
          border: "1px solid rgba(30,90,168,0.20)",
          background:
            "linear-gradient(90deg, rgba(30,90,168,0.12), rgba(96,165,250,0.10))",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <img
            src={unpattiLogo}
            alt="UNPATTI"
            style={{ width: 52, height: 52, objectFit: "contain" }}
          />
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontSize: 28, fontWeight: 900 }}>
              Dashboard Warehouse UNPATTI
            </div>
            <div style={{ color: "#6b7280", fontSize: 14 }}>
              Pilih modul untuk melihat statistik dan ringkasan data.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <Card
          title="Akademik"
          desc="Mahasiswa aktif, mahasiswa baru, penerimaan (SNBP/SNBT/Mandiri), prestasi, afirmasi, dan lainnya."
          onClick={() => navigate("/akademik/beranda")}
        />
        <Card
          title="SDM"
          desc="Statistik dosen & tenaga kependidikan (placeholder)."
          onClick={() => navigate("/sdm")}
        />
        <Card
          title="Beasiswa"
          desc="Ringkasan penerima beasiswa (placeholder)."
          onClick={() => navigate("/beasiswa")}
        />
        <Card
          title="Akreditasi"
          desc="Status akreditasi program studi & institusi (placeholder)."
          onClick={() => navigate("/akreditasi")}
        />
        <Card
          title="Keuangan"
          desc="Ringkasan laporan keuangan (placeholder)."
          onClick={() => navigate("/keuangan")}
        />
      </div>
    </div>
  );
}
