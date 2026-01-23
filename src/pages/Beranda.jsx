import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "../components/KpiCard";
import { penerimaanData } from "../data/penerimaan";
import { YEAR_OPTIONS, getYearData } from "../data/dashboard";

const JALUR_OPTIONS = ["Semua", "SNBP", "SNBT", "Mandiri"];

const jalurToKey = (jalur) => {
  if (jalur === "SNBP") return "snbp";
  if (jalur === "SNBT") return "snbt";
  if (jalur === "Mandiri") return "mandiri";
  return null;
};

export default function Beranda() {
  const navigate = useNavigate();

  const [tahun, setTahun] = useState("2024");
  const [jalur, setJalur] = useState("Semua");
  const [openDiterima, setOpenDiterima] = useState(false);

  const { kpi, topRows, aktif } = useMemo(() => {
    const yearPenerimaan = penerimaanData[tahun] ?? penerimaanData["2024"];
    const yearDash = getYearData(tahun);

    const aktifTotal = yearDash.mahasiswaAktif?.total ?? 0;

    // Ambil KPI berdasarkan jalur
    let kpiRes = { pendaftar: 0, diterima: 0, registrasi: 0 };
    let rowsRes = [];

    const key = jalurToKey(jalur);

    if (!key) {
      // Semua = agregat SNBP + SNBT + Mandiri
      const keys = ["snbp", "snbt", "mandiri"];

      // KPI total
      for (const k of keys) {
        kpiRes.pendaftar += yearPenerimaan[k].kpi.pendaftar;
        kpiRes.diterima += yearPenerimaan[k].kpi.diterima;
        kpiRes.registrasi += yearPenerimaan[k].kpi.registrasi;
      }

      // rows agregat per fakultas
      const map = new Map();
      for (const k of keys) {
        for (const r of yearPenerimaan[k].rows) {
          const prev = map.get(r.fakultas) || { fakultas: r.fakultas, pendaftar: 0, diterima: 0 };
          prev.pendaftar += r.pendaftar;
          prev.diterima += r.diterima;
          map.set(r.fakultas, prev);
        }
      }
      rowsRes = Array.from(map.values());
    } else {
      // Jalur spesifik
      kpiRes = yearPenerimaan[key].kpi;
      rowsRes = yearPenerimaan[key].rows;
    }

    // Top rows (ambil 3 teratas berdasarkan pendaftar)
    const top = [...rowsRes]
      .sort((a, b) => b.pendaftar - a.pendaftar)
      .slice(0, 3);

    return {
      kpi: kpiRes,
      topRows: top,
      aktif: aktifTotal,
    };
  }, [tahun, jalur]);

  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      {/* Header + Filter */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          border: "1px solid #e6e6e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Beranda</h2>
          <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>
            Ringkasan statistik (dummy terpusat) — nanti diganti API.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
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

          <label style={{ fontSize: 12, color: "#6b7280" }}>
            Jalur
            <select
              value={jalur}
              onChange={(e) => setJalur(e.target.value)}
              style={{
                marginLeft: 8,
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #e6e6e6",
                background: "#fff",
              }}
            >
              {JALUR_OPTIONS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* KPI Grid */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <KpiCard
          title="Total Pendaftar"
          value={kpi.pendaftar.toLocaleString("id-ID")}
          subtitle={`Tahun ${tahun} • ${jalur}`}
          onClick={() => navigate("/total-pendaftar")}
        />

        <div style={{ position: "relative" }}>
          <KpiCard
            title="Total Diterima"
            value={kpi.diterima.toLocaleString("id-ID")}
            subtitle="Hasil seleksi"
            onClick={() => setOpenDiterima((v) => !v)}
          />

          {openDiterima ? (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                background: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: 8,
                minWidth: 220,
                zIndex: 10,
              }}
            >
              {[
                { label: "SNBP", path: "/snbp" },
                { label: "SNBT", path: "/snbt" },
                { label: "Mandiri", path: "/mandiri" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setOpenDiterima(false);
                    navigate(item.path);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <KpiCard
          title="Registrasi"
          value={kpi.registrasi.toLocaleString("id-ID")}
          subtitle="Daftar ulang"
          onClick={() => navigate("/mahasiswa-baru")}
        />

        <KpiCard
          title="Mahasiswa Aktif"
          value={aktif.toLocaleString("id-ID")}
          subtitle="Semester berjalan"
          onClick={() => navigate("/mahasiswa-aktif")}
        />
      </div>

      {/* Table ringkas */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          border: "1px solid #e6e6e6",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 10 }}>
          Top Fakultas ({jalur}) — {tahun}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280" }}>
              <th style={{ paddingBottom: 8 }}>Fakultas</th>
              <th style={{ paddingBottom: 8 }}>Pendaftar</th>
              <th style={{ paddingBottom: 8 }}>Diterima</th>
            </tr>
          </thead>
          <tbody>
            {topRows.map((r) => (
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
      </div>
    </div>
  );
}
