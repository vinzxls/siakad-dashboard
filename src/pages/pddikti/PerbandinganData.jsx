import { useMemo, useState, useCallback } from "react";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  generatePerbandingan,
  generateAnomaliData,
  SEMESTERS,
  FAKULTAS,
} from "../../data/residuPddikti";

const fmt = (n) => {
  try { return Number(n).toLocaleString("id-ID"); } catch { return n; }
};

function Kpi({ label, value, hint, variant = "blue" }) {
  return (
    <div className={`u-kpi u-kpi--${variant}`}>
      <div className="u-kpi__label">{label}</div>
      <div className="u-kpi__value">{value}</div>
      {hint && <div className="u-kpi__hint">{hint}</div>}
    </div>
  );
}

function ChartCard({ title, right, children }) {
  return (
    <div className="u-card">
      <div className="u-card__header">
        <div className="u-card__title">{title}</div>
        {right && <div>{right}</div>}
      </div>
      {children}
    </div>
  );
}

function SeverityBadge({ severity }) {
  const map = {
    Tinggi: "red",
    Sedang: "amber",
    Rendah: "blue",
  };
  return (
    <span className={`u-badge u-badge--${map[severity] || "blue"}`}>
      {severity}
    </span>
  );
}

/**
 * Download anomaly data as CSV.
 */
function downloadCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(row => headers.map(h => `"${row[h]}"`).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PerbandinganData() {
  const [semester, setSemester] = useState("2025-2");
  const [fakultas, setFakultas] = useState("Semua");

  const { facData, totals, anomali } = useMemo(() => {
    const { facData, totals } = generatePerbandingan(semester, fakultas);
    const anomali = generateAnomaliData(semester, fakultas);
    return { facData, totals, anomali };
  }, [semester, fakultas]);

  const handleDownloadCSV = useCallback(() => {
    downloadCSV(anomali, `laporan-anomali-${semester}-${fakultas}.csv`);
  }, [anomali, semester, fakultas]);

  const handleDownloadXLSX = useCallback(() => {
    // XLSX requires a library; fallback to CSV with .xlsx-compatible format
    downloadCSV(anomali, `laporan-anomali-${semester}-${fakultas}.csv`);
  }, [anomali, semester, fakultas]);

  return (
    <div className="u-stack">
      {/* Header */}
      <div
        className="u-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>
            Perbandingan Data SIAKAD vs PDDIKTI
          </div>
          <div className="u-text-muted u-text-sm">
            Modul perbandingan jumlah data dengan tingkat akurasi per fakultas
          </div>
        </div>
        <div className="u-filters">
          <label>
            Semester{" "}
            <select
              className="u-select"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {SEMESTERS.slice()
                .reverse()
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Fakultas{" "}
            <select
              className="u-select"
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
            >
              <option value="Semua">Semua</option>
              {FAKULTAS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* KPI Row */}
      <div className="u-grid-4">
        <Kpi label="Total SIAKAD" value={fmt(totals.siakad)} variant="blue" />
        <Kpi label="Total PDDIKTI" value={fmt(totals.pddikti)} variant="indigo" />
        <Kpi
          label="Data Match"
          value={fmt(totals.match)}
          hint={`${totals.akurasi}% akurasi`}
          variant="green"
        />
        <Kpi
          label="Data Mismatch"
          value={fmt(totals.mismatch)}
          variant="red"
        />
      </div>

      {/* Akurasi Overall Bar */}
      <div className="u-card">
        <div className="u-card__header">
          <div className="u-card__title">Tingkat Akurasi Keseluruhan</div>
          <span
            className={`u-badge u-badge--${totals.akurasi >= 98 ? "green" : totals.akurasi >= 95 ? "amber" : "red"}`}
          >
            {totals.akurasi}%
          </span>
        </div>
        <div className="u-progress-bar u-progress-bar--lg">
          <div
            className="u-progress-bar__fill"
            style={{
              width: `${totals.akurasi}%`,
              background:
                totals.akurasi >= 98
                  ? "linear-gradient(90deg, #047857, #34d399)"
                  : totals.akurasi >= 95
                    ? "linear-gradient(90deg, #b45309, #fbbf24)"
                    : "linear-gradient(90deg, #b91c1c, #f87171)",
            }}
          />
          <span className="u-progress-bar__text">{totals.akurasi}%</span>
        </div>
      </div>

      {/* Chart: Side-by-side comparison */}
      <ChartCard
        title="Perbandingan Per Fakultas"
        right={
          <span className="u-badge u-badge--blue">Semester {semester}</span>
        }
      >
        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={facData} barCategoryGap={16}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fakultas" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Bar
                dataKey="siakad"
                name="SIAKAD"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="pddikti"
                name="PDDIKTI"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Tabel Akurasi per Fakultas */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div className="lulusan-table-title">
          Detail Akurasi Per Fakultas — Semester {semester}
        </div>
        <div style={{ padding: 14, overflowX: "auto" }}>
          <table className="u-table">
            <thead>
              <tr>
                <th>Fakultas</th>
                <th>SIAKAD</th>
                <th>PDDIKTI</th>
                <th>Match</th>
                <th>Mismatch</th>
                <th>Akurasi</th>
              </tr>
            </thead>
            <tbody>
              {facData.map((r) => (
                <tr key={r.fakultas}>
                  <td style={{ fontWeight: 800 }}>{r.fakultas}</td>
                  <td>{fmt(r.siakad)}</td>
                  <td>{fmt(r.pddikti)}</td>
                  <td style={{ color: "#166534" }}>{fmt(r.match)}</td>
                  <td style={{ color: "#dc2626", fontWeight: 800 }}>
                    {fmt(r.mismatch)}
                  </td>
                  <td>
                    <span
                      className={`u-badge u-badge--${r.akurasi >= 98 ? "green" : r.akurasi >= 95 ? "amber" : "red"}`}
                    >
                      {r.akurasi}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomali + Download */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div
          className="lulusan-table-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Laporan Anomali Data</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="u-btn u-btn--white" onClick={handleDownloadCSV}>
              ⬇ Download .csv
            </button>
            <button className="u-btn u-btn--white" onClick={handleDownloadXLSX}>
              ⬇ Download .xlsx
            </button>
          </div>
        </div>
        <div style={{ padding: 14, overflowX: "auto" }}>
          <table className="u-table">
            <thead>
              <tr>
                <th>Fakultas</th>
                <th>Entitas</th>
                <th>Jenis Anomali</th>
                <th>Jumlah</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {anomali.slice(0, 20).map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 800 }}>{r.fakultas}</td>
                  <td>{r.entitas}</td>
                  <td>{r.jenis}</td>
                  <td style={{ fontWeight: 800 }}>{fmt(r.jumlah)}</td>
                  <td>
                    <SeverityBadge severity={r.severity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {anomali.length > 20 && (
            <div
              style={{
                textAlign: "center",
                padding: 12,
                color: "var(--u-muted)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Menampilkan 20 dari {anomali.length} anomali — Download file untuk
              data lengkap
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
