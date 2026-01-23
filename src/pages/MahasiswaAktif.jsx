import { useMemo, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import KpiCard from "../components/KpiCard";
import { YEAR_OPTIONS, getYearData } from "../data/dashboard";

export default function MahasiswaAktif() {
  const [tahun, setTahun] = useState("2024");
  const d = useMemo(() => getYearData(tahun), [tahun]);

  const rows = [
    { label: "Total Mahasiswa Aktif", value: d.mahasiswaAktif.total },
    { label: "Laki-laki", value: d.mahasiswaAktif.laki },
    { label: "Perempuan", value: d.mahasiswaAktif.perempuan },
  ];

  return (
    <PageTemplate
      title="Mahasiswa Aktif"
      description="Jumlah mahasiswa aktif berdasarkan tahun."
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
        <KpiCard key="1" title="Total Aktif" value={d.mahasiswaAktif.total.toLocaleString("id-ID")} />,
        <KpiCard key="2" title="Laki-laki" value={d.mahasiswaAktif.laki.toLocaleString("id-ID")} />,
        <KpiCard key="3" title="Perempuan" value={d.mahasiswaAktif.perempuan.toLocaleString("id-ID")} />,
      ]}
      table={
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6b7280", textAlign: "left" }}>
              <th style={{ paddingBottom: 8 }}>Keterangan</th>
              <th style={{ paddingBottom: 8 }}>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td style={{ padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>{r.label}</td>
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
