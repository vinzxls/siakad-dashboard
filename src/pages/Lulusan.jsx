import { useMemo, useState } from "react";
import StatCard from "../components/StatCard";

export default function Lulusan() {
  const [tahun, setTahun] = useState("2024");
  const [fakultas, setFakultas] = useState("Semua");

  const data = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.06 : tahun === "2024" ? 1 : 0.9;

    const FAC_WEIGHT = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };

    const facFactor = FAC_WEIGHT[fakultas] ?? 1;

    const total = Math.round(3400 * baseYear * facFactor);
    const tepatWaktu = Math.round(total * 0.62);
    const tidakTepatWaktu = Math.max(0, total - tepatWaktu);

    return { total, tepatWaktu, tidakTepatWaktu };
  }, [tahun, fakultas]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Header + Filter */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>Lulusan</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Ringkasan kelulusan (placeholder) — nanti diganti API.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
            Tahun
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
                fontWeight: 800,
              }}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </label>

          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
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
                fontWeight: 800,
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

      {/* Stat besar (pakai StatCard) */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          alignItems: "stretch",
        }}
      >
        <StatCard
          title="Total Lulusan"
          value={data.total.toLocaleString("id-ID")}
          icon="🎓"
          className="statcard--purple"
        />

        <StatCard
          title="Tepat Waktu"
          value={data.tepatWaktu.toLocaleString("id-ID")}
          icon="✅"
          className="statcard--blue"
        />

        <StatCard
          title="Tidak Tepat Waktu"
          value={data.tidakTepatWaktu.toLocaleString("id-ID")}
          icon="⏳"
          className="statcard--teal"
        />
      </div>

      {/* Catatan */}
      <div className="card" style={{ borderRadius: 18 }}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Catatan</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          Nanti di step berikutnya kita buat chart (tepat waktu vs tidak), dan tabel top prodi/fakultas.
        </div>
      </div>
    </div>
  );
}
