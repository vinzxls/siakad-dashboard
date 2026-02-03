import { useMemo, useState } from "react";
import PelaporanKpi from "../../components/PelaporanKPI";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#1e5aa8", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

/* ================== UTIL ================== */
function formatID(n) {
  try {
    return Number(n).toLocaleString("id-ID");
  } catch {
    return n;
  }
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 10,
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            fontSize: 13,
          }}
        >
          <span style={{ color: "#6b7280", fontWeight: 800 }}>{p.name}</span>
          <span style={{ fontWeight: 900 }}>{formatID(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function Card({ title, right, children }) {
  return (
    <section className="card" style={{ display: "grid", gap: 12, borderRadius: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
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

function Donut({ data }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Bars({ data, xKey, yKey }) {
  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} interval={0} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={yKey} name="Jumlah" fill="#1e5aa8" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Lines({ data, xKey, yKey, name = "Tren" }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={yKey} name={name} stroke="#1e5aa8" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ================== PAGE ================== */
export default function PelaporanMasaStudiIPK() {
  const [tahun, setTahun] = useState("2024");
  const [fakultas, setFakultas] = useState("Semua");

  const data = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.05 : tahun === "2024" ? 1 : 0.92;

    const FAC_WEIGHT = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };
    const facFactor = FAC_WEIGHT[fakultas] ?? 0.2;

    // ===== KPI utama (dummy, tapi terasa beda per filter) =====
    const lulusan = Math.round(3400 * baseYear * facFactor);
    const tepatWaktu = Math.round(lulusan * (fakultas === "Kedokteran" ? 0.58 : 0.64));
    const tidakTepatWaktu = Math.max(0, lulusan - tepatWaktu);

    const ipkRata = Number(
      (
        3.18 +
        (tahun === "2025" ? 0.03 : tahun === "2023" ? -0.02 : 0) +
        (fakultas === "Teknik" ? -0.03 : fakultas === "Kedokteran" ? 0.04 : 0)
      ).toFixed(2)
    );

    const masaStudiRata = Number(
      (
        4.4 +
        (tahun === "2025" ? -0.05 : tahun === "2023" ? 0.08 : 0) +
        (fakultas === "Teknik" ? 0.12 : fakultas === "Hukum" ? -0.05 : 0)
      ).toFixed(2)
    );

    // ===== Donut: tepat vs tidak =====
    const donutKelulusan = [
      { label: "Tepat Waktu", value: tepatWaktu },
      { label: "Tidak Tepat", value: tidakTepatWaktu },
    ];

    // ===== Bar: distribusi IPK (dummy) =====
    const ipkDist = [
      { label: "< 2.00", value: Math.round(lulusan * 0.04) },
      { label: "2.00 – 2.99", value: Math.round(lulusan * 0.30) },
      { label: "3.00 – 3.49", value: Math.round(lulusan * 0.46) },
      { label: "≥ 3.50", value: Math.round(lulusan * 0.20) },
    ];

    // ===== Bar: distribusi masa studi (dummy) =====
    const masaStudiDist = [
      { label: "< 4 thn", value: Math.round(lulusan * 0.18) },
      { label: "4 – 4.5", value: Math.round(lulusan * 0.34) },
      { label: "4.5 – 5", value: Math.round(lulusan * 0.26) },
      { label: "5 – 6", value: Math.round(lulusan * 0.16) },
      { label: "> 6", value: Math.round(lulusan * 0.06) },
    ];

    // ===== Line: tren IPK (dummy) =====
    const trendIpk = ["2021", "2022", "2023", "2024", "2025"].map((y, i) => {
      const base = 3.12 + i * 0.03;
      const adj = fakultas === "Kedokteran" ? 0.05 : fakultas === "Teknik" ? -0.03 : 0;
      return { year: y, value: Number((base + adj).toFixed(2)) };
    });

    // ===== Table: ringkas top prodi (dummy) =====
    const topProdi = [
      ["Teknik Informatika", 240],
      ["Manajemen", 230],
      ["Hukum", 210],
      ["Ilmu Komunikasi", 190],
      ["Akuntansi", 175],
      ["PGSD", 160],
    ]
      .map(([name, base]) => ({
        name,
        lulusan: Math.max(10, Math.round(base * baseYear * (0.65 + facFactor))),
        ipk: Number((3.05 + (base % 7) * 0.05 + (fakultas === "Kedokteran" ? 0.05 : 0)).toFixed(2)),
        masa: Number((4.2 + (base % 5) * 0.12 + (fakultas === "Teknik" ? 0.15 : 0)).toFixed(2)),
      }))
      .sort((a, b) => b.lulusan - a.lulusan);

    const table = fakultas === "Semua" ? topProdi : topProdi.slice(0, 4);

    return {
      lulusan,
      tepatWaktu,
      tidakTepatWaktu,
      ipkRata,
      masaStudiRata,
      donutKelulusan,
      ipkDist,
      masaStudiDist,
      trendIpk,
      table,
    };
  }, [tahun, fakultas]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* HEADER + FILTER */}
      <div className="card" style={{ borderRadius: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Pelaporan – Checkpoint 2</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Ringkasan masa studi, IPK, dan kelulusan (placeholder).
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
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

          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
            Fakultas
            <select
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
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
              <option value="Semua">Semua</option>
              <option value="Hukum">Hukum</option>
              <option value="Teknik">Teknik</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="FISIP">FISIP</option>
              <option value="Kedokteran">Kedokteran</option>
            </select>
          </label>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.6fr 0.9fr", alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card title="Tepat Waktu vs Tidak Tepat Waktu">
              <Donut data={data.donutKelulusan} />
            </Card>

            <Card title="Distribusi IPK (Lulusan)">
              <Bars data={data.ipkDist} xKey="label" yKey="value" />
            </Card>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card title="Distribusi Masa Studi (Tahun)">
              <Bars data={data.masaStudiDist} xKey="label" yKey="value" />
            </Card>

            <Card title="Tren IPK Rata-rata">
              <Lines data={data.trendIpk} xKey="year" yKey="value" name="IPK" />
            </Card>
          </div>

          <Card title="Tabel Ringkas Top Prodi (Dummy)">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th style={{ padding: "10px 0" }}>Prodi</th>
                  <th style={{ padding: "10px 0" }}>Lulusan</th>
                  <th style={{ padding: "10px 0" }}>IPK</th>
                  <th style={{ padding: "10px 0" }}>Masa Studi</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((r) => (
                  <tr key={r.name}>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                      {r.name}
                    </td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                      {formatID(r.lulusan)}
                    </td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                      {r.ipk.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                      {r.masa.toFixed(2)} thn
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
              *Placeholder — nanti diganti API SIAKAD.
            </div>
          </Card>
        </div>

        {/* RIGHT KPI (COMPACT ✅) */}
        <div style={{ display: "grid", gap: 12 }}>
          <PelaporanKpi title="Total Lulusan" value={formatID(data.lulusan)} subtitle={`Tahun ${tahun}`} />
          <PelaporanKpi
            title="Tepat Waktu"
            value={formatID(data.tepatWaktu)}
            subtitle={`${Math.round((data.tepatWaktu / Math.max(1, data.lulusan)) * 100)}% dari lulusan`}
          />
          <PelaporanKpi title="IPK Rata-rata" value={data.ipkRata.toFixed(2)} subtitle="Rata-rata lulusan (dummy)" />
          <PelaporanKpi title="Masa Studi Rata-rata" value={`${data.masaStudiRata.toFixed(2)} thn`} subtitle="Estimasi masa studi" />

          <div className="card" style={{ borderRadius: 18, padding: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8 }}>Catatan</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#6b7280", display: "grid", gap: 6, fontSize: 12 }}>
              <li>Checkpoint 2 fokus IPK & masa studi.</li>
              <li>Filter mempengaruhi KPI & chart.</li>
              <li>Data dummy → siap mapping API.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
