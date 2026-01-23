import { useState } from "react";
import PageTemplate from "../components/PageTemplate";
import KpiCard from "../components/KpiCard";

export default function Afirmasi() {
  const [tahun, setTahun] = useState("2024");

  return (
    <PageTemplate
      title="Afirmasi"
      description="Rekap penerima afirmasi per tahun."
      filters={
        <label style={{ fontSize: 12, color: "#6b7280" }}>
          Tahun
          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            style={{ marginLeft: 8, padding: "8px 10px", borderRadius: 10, border: "1px solid #e6e6e6" }}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </label>
      }
      kpis={[
        <KpiCard key="1" title="Total Penerima" value="860" />,
        <KpiCard key="2" title="KIP-K" value="540" />,
        <KpiCard key="3" title="Disabilitas" value="80" />,
      ]}
      table={
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6b7280", textAlign: "left" }}>
              <th>Jenis Afirmasi</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>KIP-K</td><td>540</td></tr>
            <tr><td>Disabilitas</td><td>80</td></tr>
            <tr><td>Daerah 3T</td><td>240</td></tr>
          </tbody>
        </table>
      }
    />
  );
}
