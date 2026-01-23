import { useState } from "react";
import PageTemplate from "../components/PageTemplate";
import KpiCard from "../components/KpiCard";

export default function Prestasi() {
  const [tahun, setTahun] = useState("2024");

  return (
    <PageTemplate
      title="Prestasi"
      description="Rekap prestasi mahasiswa per tahun."
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
        <KpiCard key="1" title="Total Prestasi" value="120" />,
        <KpiCard key="2" title="Nasional" value="35" />,
        <KpiCard key="3" title="Internasional" value="12" />,
      ]}
      table={
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6b7280", textAlign: "left" }}>
              <th>Kategori</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Akademik</td><td>55</td></tr>
            <tr><td>Olahraga</td><td>40</td></tr>
            <tr><td>Seni</td><td>25</td></tr>
          </tbody>
        </table>
      }
    />
  );
}
