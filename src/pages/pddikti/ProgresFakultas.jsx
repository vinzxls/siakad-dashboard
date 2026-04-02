import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { generateProgresFakultas, SEMESTERS } from "../../data/residuPddikti";

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

/**
 * SVG Circular Progress Ring.
 */
function ProgressRing({ persen, size = 100, stroke = 8, color }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (persen / 100) * circ;

  const autoColor =
    color ||
    (persen >= 90
      ? "#22c55e"
      : persen >= 70
        ? "#f59e0b"
        : "#ef4444");

  return (
    <svg
      width={size}
      height={size}
      className="u-progress-ring"
      style={{ display: "block", margin: "0 auto" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={autoColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        style={{
          fontSize: size * 0.22,
          fontWeight: 900,
          fill: "#0f172a",
        }}
      >
        {persen}%
      </text>
    </svg>
  );
}

export default function ProgresFakultas() {
  const [semester, setSemester] = useState("2025-2");

  const { fakultasData, overall, chartData } = useMemo(() => {
    const fakultasData = generateProgresFakultas(semester);
    const avg =
      fakultasData.reduce((a, f) => a + f.progress, 0) / fakultasData.length;

    const completed = fakultasData.filter((f) => f.progress >= 95).length;
    const inProgress = fakultasData.filter(
      (f) => f.progress >= 70 && f.progress < 95
    ).length;
    const needsWork = fakultasData.filter((f) => f.progress < 70).length;

    const chartData = [...fakultasData]
      .sort((a, b) => b.progress - a.progress)
      .map((f) => ({
        fakultas: f.fakultas,
        progress: f.progress,
        fill:
          f.progress >= 90
            ? "#22c55e"
            : f.progress >= 70
              ? "#f59e0b"
              : "#ef4444",
      }));

    return {
      fakultasData,
      overall: { avg: Math.round(avg), completed, inProgress, needsWork },
      chartData,
    };
  }, [semester]);

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
            Progres Pelaporan Per Fakultas
          </div>
          <div className="u-text-muted u-text-sm">
            Grafik persentase kelengkapan data pelaporan setiap fakultas
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
        </div>
      </div>

      {/* KPI Row */}
      <div className="u-grid-4">
        <Kpi
          label="Rata-rata Kelengkapan"
          value={`${overall.avg}%`}
          variant="blue"
        />
        <Kpi
          label="Fakultas Tuntas (≥95%)"
          value={overall.completed}
          variant="green"
        />
        <Kpi
          label="Dalam Proses (70-94%)"
          value={overall.inProgress}
          variant="amber"
        />
        <Kpi
          label="Perlu Perhatian (<70%)"
          value={overall.needsWork}
          variant="red"
        />
      </div>

      {/* Overall Progress Bar */}
      <div className="u-card">
        <div className="u-card__header">
          <div className="u-card__title">Kelengkapan Data Keseluruhan</div>
          <span
            className={`u-badge u-badge--${overall.avg >= 90 ? "green" : overall.avg >= 70 ? "amber" : "red"}`}
          >
            {overall.avg}%
          </span>
        </div>
        <div className="u-progress-bar u-progress-bar--lg">
          <div
            className="u-progress-bar__fill"
            style={{
              width: `${overall.avg}%`,
              background:
                overall.avg >= 90
                  ? "linear-gradient(90deg, #047857, #34d399)"
                  : overall.avg >= 70
                    ? "linear-gradient(90deg, #b45309, #fbbf24)"
                    : "linear-gradient(90deg, #b91c1c, #f87171)",
            }}
          />
          <span className="u-progress-bar__text">{overall.avg}%</span>
        </div>
      </div>

      {/* Grid: Circular Progress per Fakultas */}
      <div className="u-grid-4">
        {fakultasData.map((fak) => (
          <div key={fak.fakultas} className="u-card u-target-card">
            <ProgressRing persen={fak.progress} size={110} stroke={10} />
            <div
              style={{
                textAlign: "center",
                marginTop: 10,
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              {fak.fakultas}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "var(--u-muted)",
              }}
            >
              {fmt(fak.completedItems)} / {fmt(fak.totalItems)} item
            </div>

            {/* Mini detail bars */}
            <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
              {fak.detail.map((cat) => (
                <div key={cat.key}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--u-muted)",
                      marginBottom: 2,
                    }}
                  >
                    <span>{cat.label}</span>
                    <span>{cat.persen}%</span>
                  </div>
                  <div className="u-progress-bar u-progress-bar--sm">
                    <div
                      className="u-progress-bar__fill"
                      style={{
                        width: `${cat.persen}%`,
                        background:
                          cat.persen >= 90
                            ? "#22c55e"
                            : cat.persen >= 70
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ranking Chart */}
      <div className="u-card">
        <div className="u-card__header">
          <div className="u-card__title">
            Ranking Kelengkapan Data Per Fakultas
          </div>
          <span className="u-badge u-badge--blue">Semester {semester}</span>
        </div>
        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis
                type="category"
                dataKey="fakultas"
                width={100}
                tick={{ fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar
                dataKey="progress"
                name="Kelengkapan"
                radius={[0, 6, 6, 0]}
                fill="#3b82f6"
              >
                {/* Color each bar individually via the data's fill property */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Table */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div className="lulusan-table-title">
          Ringkasan Kelengkapan Data — Semester {semester}
        </div>
        <div style={{ padding: 14, overflowX: "auto" }}>
          <table className="u-table">
            <thead>
              <tr>
                <th>Fakultas</th>
                <th>Total Item</th>
                <th>Selesai</th>
                <th>Kelengkapan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fakultasData.map((fak) => (
                <tr key={fak.fakultas}>
                  <td style={{ fontWeight: 800 }}>{fak.fakultas}</td>
                  <td>{fmt(fak.totalItems)}</td>
                  <td>{fmt(fak.completedItems)}</td>
                  <td>
                    <div className="u-progress-bar">
                      <div
                        className="u-progress-bar__fill"
                        style={{
                          width: `${fak.progress}%`,
                          background:
                            fak.progress >= 90
                              ? "#22c55e"
                              : fak.progress >= 70
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      />
                      <span className="u-progress-bar__text">
                        {fak.progress}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`u-badge u-badge--${fak.progress >= 95 ? "green" : fak.progress >= 70 ? "amber" : "red"}`}
                    >
                      {fak.progress >= 95
                        ? "Tuntas"
                        : fak.progress >= 70
                          ? "Proses"
                          : "Perlu Perhatian"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
