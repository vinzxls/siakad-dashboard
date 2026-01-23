import { useMemo, useState } from "react";
import PageTemplate from "./PageTemplate";
import KpiCard from "./KpiCard";
import { penerimaanData } from "../data/penerimaan";

const YEAR_OPTIONS = ["2025", "2024", "2023"];

export default function PenerimaanPage({ jalurKey, title }) {
  const [tahun, setTahun] = useState("2024");

  const { kpi, rows } = useMemo(() => {
    const year = penerimaanData[tahun] ?? penerimaanData["2024"];
    const jalur = year[jalurKey];

    return {
      kpi: jalur.kpi,
      rows: jalur.rows,
    };
  }, [tahun, jalurKey]);

  return (
    <PageTemplate
      title={title}
      description={`Statistik penerimaan mahasiswa jalur ${title}.`}
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
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      }
      kpis={[
        <KpiCard key="1" title="Pendaftar" value={kpi.pendaftar.toLocaleString("id-ID")} />,
        <KpiCard key="2" title="Diterima" value={kpi.diterima.toLocaleString("id-ID")} />,
        <KpiCard key="3" title="Registrasi" value={kpi.registrasi.toLocaleString("id-ID")} />,
      ]}
      table={
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6b7280", textAlign: "left" }}>
              <th style={{ paddingBottom: 8 }}>Fakultas</th>
              <th style={{ paddingBottom: 8 }}>Pendaftar</th>
              <th style={{ paddingBottom: 8 }}>Diterima</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.fakultas}>
                <td style={{ padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>{r.fakultas}</td>
                <td style={{ padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>
                  {r.pendaftar.toLocaleString("id-ID")}
                </td>
                <td style={{ padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>
                  {r.diterima.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    />
  );
}
