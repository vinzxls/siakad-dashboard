import { useState } from "react";
import PageTemplate from "../components/PageTemplate";
import KpiCard from "../components/KpiCard";

export default function Kelulusan() {
  const [tahun, setTahun] = useState("2024");

  return (
    <PageTemplate
      title="Kelulusan"
      description="Ringkasan kelulusan mahasiswa per tahun."
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
        <KpiCard key="1" title="Total Lulus" value="3.400" />,
        <KpiCard key="2" title="Tepat Waktu" value="2.100" />,
        <KpiCard key="3" title="Tidak Tepat Waktu" value="1.300" />,
      ]}
      table={
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6b7280", textAlign: "left" }}>
              <th>Fakultas</th>
              <th>Lulus</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Hukum</td><td>500</td></tr>
            <tr><td>Teknik</td><td>900</td></tr>
            <tr><td>Ekonomi</td><td>750</td></tr>
          </tbody>
        </table>
      }
    />
  );
}
