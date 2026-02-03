import { useMemo, useState } from "react";
import PelaporanKpi from "../../components/PelaporanKPI"; 
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

/* ================== UTIL ================== */
function formatID(n) {
  try {
    return Number(n).toLocaleString("id-ID");
  } catch {
    return n;
  }
}

function Card({ title, right, children }) {
  return (
    <section
      className="card"
      style={{ display: "grid", gap: 12, borderRadius: 18 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900 }}>{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* ================== PAGE ================== */
export default function PelaporanMahasiswaTahun() {
  const [tahun, setTahun] = useState("2024");

  const data = useMemo(() => {
    const base = tahun === "2025" ? 1.05 : tahun === "2024" ? 1 : 0.92;

    const total = Math.round(26500 * base);
    const aktif = Math.round(total * 0.82);
    const nonAktif = Math.max(0, total - aktif);

    const byAngkatan = ["2019", "2020", "2021", "2022", "2023", "2024"].map(
      (a, i) => ({
        angkatan: a,
        value: Math.round((5200 - i * 600) * base),
      })
    );

    const tren = [
      { year: "2021", value: 24000 },
      { year: "2022", value: 25000 },
      { year: "2023", value: 25800 },
      { year: "2024", value: 26500 },
      { year: "2025", value: 27200 },
    ].map((x) => ({ ...x, value: Math.round(x.value * base) }));

    return { total, aktif, nonAktif, byAngkatan, tren };
  }, [tahun]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* HEADER */}
      <div className="card" style={{ borderRadius: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 900 }}>
          Pelaporan – Checkpoint 1
        </div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Ringkasan mahasiswa berdasarkan tahun akademik (placeholder).
        </div>

        {/* filter kecil biar rapi */}
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
            Tahun
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              style={{
                marginLeft: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </label>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 0.9fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <div style={{ display: "grid", gap: 16 }}>
          <Card title="Distribusi Mahasiswa per Angkatan">
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={data.byAngkatan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="angkatan" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#1e5aa8"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Tren Total Mahasiswa">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.tren}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="value"
                  stroke="#1e5aa8"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* RIGHT KPI (COMPACT ✅) */}
        <div style={{ display: "grid", gap: 12 }}>
          <PelaporanKpi
            title="Total Mahasiswa"
            value={formatID(data.total)}
            subtitle={`Tahun ${tahun}`}
          />
          <PelaporanKpi
            title="Mahasiswa Aktif"
            value={formatID(data.aktif)}
            subtitle="Status aktif akademik"
          />
          <PelaporanKpi
            title="Mahasiswa Non Aktif"
            value={formatID(data.nonAktif)}
            subtitle="Perlu monitoring"
          />
        </div>
      </div>
    </div>
  );
}
