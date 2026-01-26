import { useNavigate } from "react-router-dom";

function Card({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 18,
        background: "#fff",
        cursor: "pointer",
        display: "grid",
        gap: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 900 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{desc}</div>
    </button>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        padding: 24,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ width: "min(1100px, 100%)", display: "grid", gap: 14 }}>
        <div
          style={{
            background: "#1e5aa8",
            color: "#fff",
            borderRadius: 16,
            padding: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>DASHBOARD WAREHOUSE</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Universitas Pattimura — UNPATTI</div>
          </div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>GANJIL 2025/2026</div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <Card
            title="Akademik"
            desc="Mahasiswa, Mahasiswa Baru, Lulusan, Pelaporan, E-learning"
            onClick={() => navigate("/akademik/beranda")}
          />
          <Card
            title="SDM"
            desc="Statistik dosen & tenaga kependidikan (placeholder dulu)"
            onClick={() => navigate("/sdm")}
          />
          <Card
            title="Beasiswa"
            desc="KIP-K, bantuan UKT, dll (placeholder dulu)"
            onClick={() => navigate("/beasiswa")}
          />
          <Card
            title="Akreditasi"
            desc="Akreditasi prodi / institusi (placeholder dulu)"
            onClick={() => navigate("/akreditasi")}
          />
          <Card
            title="Keuangan"
            desc="Ringkasan penerimaan/pengeluaran (placeholder dulu)"
            onClick={() => navigate("/keuangan")}
          />
        </div>
      </div>
    </div>
  );
}
