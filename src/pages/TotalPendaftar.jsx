import { useMemo, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import KpiCard from "../components/KpiCard";
import { YEAR_OPTIONS, getYearData } from "../data/dashboard";

export default function TotalPendaftar() {
  const [tahun, setTahun] = useState("2024");

  const d = useMemo(() => getYearData(tahun), [tahun]);

  return (
    <PageTemplate
      title="Total Pendaftar"
      description="Jumlah pendaftar mahasiswa berdasarkan tahun dan fakultas."
      filters={
        <label style={{ fontSize: 12, color: "#6b7280" }}>
          Tahun
          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            style={{
              marginLeft: 8,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #e6e6e6",
              background: "#fff",
            }}
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      }
      kpis={[
        <KpiCard key="1" title="Total Pendaftar" value={d.totalPendaftar.total.toLocaleString("id-ID")} />,
        <KpiCard key="2" title="SNBP" value={d.totalPendaftar.snbp.toLocaleString("id-ID")} />,
        <KpiCard key="3" title="SNBT" value={d.totalPendaftar.snbt.toLocaleString("id-ID")} />,
        <KpiCard key="4" title="Mandiri" value={d.totalPendaftar.mandiri.toLocaleString("id-ID")} />,
      ]}
      table={
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6b7280", textAlign: "left" }}>
              <th style={{ paddingBottom: 8 }}>Fakultas</th>
              <th style={{ paddingBottom: 8 }}>Pendaftar</th>
            </tr>
          </thead>
          <tbody>
            {d.topFakultasPendaftar.map((r) => (
              <tr key={r.fakultas}>
                <td style={{ padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>{r.fakultas}</td>
                <td style={{ padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>
                  {r.value.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    />
  );
}
