import { useMemo, useState, useEffect } from "react";
import {
  generateResiduData,
  generateSyncHistory,
  SEMESTERS,
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

function StatusBadge({ status }) {
  const map = {
    sinkron: { cls: "green", text: "Sinkron" },
    pending: { cls: "amber", text: "Pending" },
    error:   { cls: "red",   text: "Error" },
  };
  const s = map[status] || map.pending;
  return <span className={`u-badge u-badge--${s.cls}`}>{s.text}</span>;
}

/**
 * Countdown timer — shows time remaining until next sync (24h cycle).
 */
function CountdownTimer() {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function calc() {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0); // next midnight
      const diff = next - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="u-countdown">
      <div className="u-countdown__label">Sinkronisasi Berikutnya</div>
      <div className="u-countdown__time">{remaining}</div>
      <div className="u-countdown__hint">Auto-sync setiap 24 jam</div>
    </div>
  );
}

export default function ResiduPddikti() {
  const [semester, setSemester] = useState("2025-2");

  const { residu, history, stats } = useMemo(() => {
    const residu = generateResiduData(semester);
    const history = generateSyncHistory();

    const totalSiakad = residu.reduce((a, r) => a + r.siakad, 0);
    const totalPddikti = residu.reduce((a, r) => a + r.pddikti, 0);
    const totalSelisih = residu.reduce((a, r) => a + r.selisih, 0);
    const sinkronCount = residu.filter(r => r.status === "sinkron").length;
    const pendingCount = residu.filter(r => r.status === "pending").length;
    const errorCount = residu.filter(r => r.status === "error").length;

    return {
      residu,
      history,
      stats: {
        totalSiakad, totalPddikti, totalSelisih,
        sinkronCount, pendingCount, errorCount,
        akurasi: ((totalPddikti / totalSiakad) * 100).toFixed(1),
      },
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
            Pemantauan Residu Data PDDIKTI
          </div>
          <div className="u-text-muted u-text-sm">
            Monitoring sinkronisasi data SIAKAD ↔ PDDIKTI secara otomatis setiap
            24 jam
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

      {/* KPI + Countdown */}
      <div className="u-grid-4">
        <Kpi
          label="Total Data SIAKAD"
          value={fmt(stats.totalSiakad)}
          variant="blue"
        />
        <Kpi
          label="Tersinkron ke PDDIKTI"
          value={fmt(stats.totalPddikti)}
          hint={`${stats.akurasi}% akurasi`}
          variant="green"
        />
        <Kpi
          label="Residu (Belum Sinkron)"
          value={fmt(stats.totalSelisih)}
          variant="amber"
        />
        <CountdownTimer />
      </div>

      {/* Status Summary Badges */}
      <div className="u-card">
        <div className="u-card__header">
          <div className="u-card__title">Status Entitas</div>
          <div style={{ display: "flex", gap: 12 }}>
            <span className="u-badge u-badge--green">
              ✓ Sinkron: {stats.sinkronCount}
            </span>
            <span className="u-badge u-badge--amber">
              ⏳ Pending: {stats.pendingCount}
            </span>
            <span className="u-badge u-badge--red">
              ✕ Error: {stats.errorCount}
            </span>
          </div>
        </div>
      </div>

      {/* Residu Table */}
      <div className="u-card" style={{ overflow: "hidden", padding: 0 }}>
        <div className="lulusan-table-title">
          Residu Per Entitas — Semester {semester}
        </div>
        <div style={{ padding: 14, overflowX: "auto" }}>
          <table className="u-table">
            <thead>
              <tr>
                <th>Entitas</th>
                <th>SIAKAD</th>
                <th>PDDIKTI</th>
                <th>Selisih</th>
                <th>Sinkronisasi</th>
                <th>Status</th>
                <th>Terakhir Sync</th>
              </tr>
            </thead>
            <tbody>
              {residu.map((r) => (
                <tr key={r.key}>
                  <td style={{ fontWeight: 800 }}>{r.entity}</td>
                  <td>{fmt(r.siakad)}</td>
                  <td>{fmt(r.pddikti)}</td>
                  <td
                    style={{
                      fontWeight: 800,
                      color: r.selisih === 0 ? "#166534" : "#b45309",
                    }}
                  >
                    {fmt(r.selisih)}
                  </td>
                  <td>
                    <div className="u-progress-bar">
                      <div
                        className="u-progress-bar__fill"
                        style={{
                          width: `${r.persen}%`,
                          background:
                            r.persen >= 99
                              ? "#22c55e"
                              : r.persen >= 95
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      />
                      <span className="u-progress-bar__text">
                        {r.persen}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="u-text-muted" style={{ fontSize: 12 }}>
                    {new Date(r.lastSync).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync History */}
      <div className="u-card">
        <div className="u-card__header">
          <div className="u-card__title">Riwayat Sinkronisasi (7 Hari Terakhir)</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {history.map((h) => (
            <div
              key={h.date}
              style={{
                flex: "1 1 120px",
                background:
                  h.status === "success"
                    ? "linear-gradient(135deg, #047857, #34d399)"
                    : "linear-gradient(135deg, #b45309, #fbbf24)",
                borderRadius: 12,
                padding: "14px 16px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9 }}>
                {h.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>
                {h.success}/{h.total}
              </div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>
                {h.status === "success" ? "Semua Sinkron" : `${h.failed} Gagal`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
