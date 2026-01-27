import { useMemo, useState } from "react";
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

function Card({ title, right, children }) {
  return (
    <section className="card" style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

function KpiBig({ title, value, subtitle }) {
  return (
    <div className="card" style={{ padding: 20, borderRadius: 18, display: "grid", gap: 6 }}>
      <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.05 }}>{value}</div>
      {subtitle ? <div style={{ fontSize: 13, color: "#6b7280" }}>{subtitle}</div> : null}
    </div>
  );
}

function Donut({ data }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={80} outerRadius={120} paddingAngle={2}>
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

function SmartXAxisTick({ x, y, payload }) {
  const raw = String(payload?.value ?? "");

  // wrap jadi max 2 baris, masing-masing max 12 karakter
  const words = raw.split(" ");
  const lines = [];
  let line = "";

  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= 12) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = w;
    }
    if (lines.length === 2) break;
  }
  if (lines.length < 2 && line) lines.push(line);

  // kalau masih terlalu panjang, potong baris ke-2
  if (lines[1] && lines[1].length > 12) lines[1] = lines[1].slice(0, 11) + "…";
  // kalau label 1 kata panjang banget, potong baris 1
  if (!lines[1] && lines[0] && lines[0].length > 12) lines[0] = lines[0].slice(0, 11) + "…";

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" style={{ fontSize: 12, fill: "#111827" }}>
        {lines.map((t, i) => (
          <tspan key={i} x="0" dy={i === 0 ? 0 : 14}>
            {t}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function shortLabel(str, max = 12) {
  const s = String(str ?? "");
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function Bars({ data, xKey, yKey }) {
  const maxLen = Math.max(...data.map((d) => String(d?.[xKey] ?? "").length), 0);
  const needsSpace = maxLen > 12;

  return (
    <div style={{ height: 420 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: needsSpace ? 90 : 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            interval={0}
            height={needsSpace ? 90 : 60}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => shortLabel(v, 12)}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v) => formatID(v)}
            labelFormatter={(label) => String(label ?? "")} // tampilkan full label
          />
          <Bar dataKey={yKey} fill="#1e5aa8" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatID(n) {
  try { return Number(n).toLocaleString("id-ID"); } catch { return n; }
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 10, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 13 }}>
          <span style={{ color: "#6b7280", fontWeight: 800 }}>{p.name}</span>
          <span style={{ fontWeight: 900 }}>{formatID(p.value)}</span>
        </div>
      ))}
    </div>
  );
}


function Lines({ data, xKey, yKey }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <SmartXAxisTick dataKey={xKey} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={yKey} stroke="#1e5aa8" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function PenerimaanDashboard({ jalurKey = "snbp", title = "SNBP" }) {
  const [tahun, setTahun] = useState("2024");
  const [fakultas, setFakultas] = useState("Semua");

  const data = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.06 : tahun === "2024" ? 1 : 0.9;
    const jalurFactor = jalurKey === "snbp" ? 0.34 : jalurKey === "snbt" ? 0.41 : 0.25;

    // bobot fakultas supaya beda-beda
    const FAC_WEIGHT = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };
    const facFactor = FAC_WEIGHT[fakultas] ?? 0.2;

    // KPI utama
    const pendaftar = Math.round(12500 * baseYear * jalurFactor * facFactor);
    const diterima = Math.round(pendaftar * (jalurKey === "snbp" ? 0.55 : jalurKey === "snbt" ? 0.5 : 0.45));
    const registrasi = Math.round(diterima * 0.82);
    const tidakRegistrasi = Math.max(0, diterima - registrasi);

    // Donut registrasi
    const registrasiDonut = [
      { label: "Registrasi", value: registrasi },
      { label: "Tidak Registrasi", value: tidakRegistrasi },
    ];

    // Gender donut (berdasarkan registrasi)
    const laki = Math.round(registrasi * 0.48);
    const perempuan = Math.max(0, registrasi - laki);
    const genderDonut = [
      { label: "Laki-laki", value: laki },
      { label: "Perempuan", value: perempuan },
    ];

    // Trend (line) pendaftar/diterima/registrasi per tahun 
    const trend = [
      { year: "2021", pendaftar: Math.round(10500 * 0.92 * jalurFactor * facFactor), diterima: Math.round(10500 * 0.92 * jalurFactor * facFactor * 0.5), registrasi: Math.round(10500 * 0.92 * jalurFactor * facFactor * 0.5 * 0.82) },
      { year: "2022", pendaftar: Math.round(11200 * 0.96 * jalurFactor * facFactor), diterima: Math.round(11200 * 0.96 * jalurFactor * facFactor * 0.5), registrasi: Math.round(11200 * 0.96 * jalurFactor * facFactor * 0.5 * 0.82) },
      { year: "2023", pendaftar: Math.round(11800 * 1.0 * jalurFactor * facFactor), diterima: Math.round(11800 * 1.0 * jalurFactor * facFactor * 0.5), registrasi: Math.round(11800 * 1.0 * jalurFactor * facFactor * 0.5 * 0.82) },
      { year: "2024", pendaftar: Math.round(12500 * 1.02 * jalurFactor * facFactor), diterima: Math.round(12500 * 1.02 * jalurFactor * facFactor * 0.5), registrasi: Math.round(12500 * 1.02 * jalurFactor * facFactor * 0.5 * 0.82) },
      { year: "2025", pendaftar: Math.round(13200 * 1.05 * jalurFactor * facFactor), diterima: Math.round(13200 * 1.05 * jalurFactor * facFactor * 0.5), registrasi: Math.round(13200 * 1.05 * jalurFactor * facFactor * 0.5 * 0.82) },
    ];

    // Top Prodi (bar + table)
    const topProdi = [
      ["Teknik Informatika", 320],
      ["Manajemen", 290],
      ["Hukum", 260],
      ["Kedokteran", 240],
      ["Ilmu Komunikasi", 220],
      ["Akuntansi", 200],
    ]
      .map(([prodi, base]) => ({
        name: prodi,
        value: Math.max(10, Math.round(base * baseYear * (0.75 + jalurFactor) * facFactor)),
      }))
      .sort((a, b) => b.value - a.value);

    // Asal sekolah (bar + table)
    const asalSekolah = [
      ["SMA Negeri 1 Ambon", 90],
      ["SMA Negeri 2 Ambon", 82],
      ["SMA Kristen 1", 75],
      ["SMA Negeri 3 Ambon", 70],
      ["SMK Negeri 1", 62],
    ]
      .map(([sekolah, base]) => ({
        name: sekolah,
        value: Math.max(5, Math.round(base * baseYear * (0.75 + jalurFactor) * facFactor)),
      }))
      .sort((a, b) => b.value - a.value);

    // Pendaftar vs diterima (bar)
    const pd = [
      { name: "Pendaftar", value: pendaftar },
      { name: "Diterima", value: diterima },
      { name: "Registrasi", value: registrasi },
    ];

    return {
      pendaftar,
      diterima,
      registrasi,
      tidakRegistrasi,
      registrasiDonut,
      genderDonut,
      pd,
      trend,
      topProdi,
      asalSekolah,
    };
  }, [tahun, fakultas, jalurKey]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Filter Bar */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Statistik penerimaan jalur {title} berdasarkan tahun & fakultas.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
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
                fontSize: 15,
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
                fontSize: 15,
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
            <Card
              title="Pendaftar vs Diterima vs Registrasi"
              right={
                <span style={{ fontWeight: 900 }}>
                  Rasio diterima: {Math.round((data.diterima / Math.max(1, data.pendaftar)) * 100)}%
                </span>
              }
            >
              <Bars data={data.pd} xKey="name" yKey="value" />
            </Card>

            <Card title="Registrasi vs Tidak Registrasi">
              <Donut data={data.registrasiDonut} />
              <div style={{ display: "grid", gap: 10 }}>
                {data.registrasiDonut.map((x) => (
                  <div
                    key={x.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: 10,
                      fontSize: 14,
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{x.label}</div>
                    <div style={{ fontWeight: 900 }}>{x.value.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card title="Mahasiswa Registrasi Berdasarkan Gender">
              <Donut data={data.genderDonut} />
              <div style={{ display: "grid", gap: 10 }}>
                {data.genderDonut.map((x) => (
                  <div
                    key={x.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: 10,
                      fontSize: 14,
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{x.label}</div>
                    <div style={{ fontWeight: 900 }}>{x.value.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Top Asal Sekolah (Registrasi)">
              <Bars data={data.asalSekolah} xKey="name" yKey="value" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: "10px 0" }}>Sekolah</th>
                    <th style={{ padding: "10px 0" }}>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {data.asalSekolah.map((r) => (
                    <tr key={r.name}>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.name}</td>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                        {r.value.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <Card title="Tren Pendaftar">
            <Lines data={data.trend} xKey="year" yKey="pendaftar" />
          </Card>

          <Card title="Top Program Studi (Diterima/Registrasi)">
            <Bars data={data.topProdi} xKey="name" yKey="value" />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th style={{ padding: "10px 0" }}>Program Studi</th>
                  <th style={{ padding: "10px 0" }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {data.topProdi.map((r) => (
                  <tr key={r.name}>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.name}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                      {r.value.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* RIGHT KPI */}
        <div style={{ display: "grid", gap: 16 }}>
          <KpiBig
            title="Total Pendaftar"
            value={data.pendaftar.toLocaleString("id-ID")}
            subtitle={`Tahun ${tahun} • Fakultas ${fakultas}`}
          />
          <KpiBig
            title="Total Diterima"
            value={data.diterima.toLocaleString("id-ID")}
            subtitle={`Rasio: ${Math.round((data.diterima / Math.max(1, data.pendaftar)) * 100)}%`}
          />
          <KpiBig
            title="Registrasi"
            value={data.registrasi.toLocaleString("id-ID")}
            subtitle={`Dari diterima: ${Math.round((data.registrasi / Math.max(1, data.diterima)) * 100)}%`}
          />
          <KpiBig
            title="Tidak Registrasi"
            value={data.tidakRegistrasi.toLocaleString("id-ID")}
            subtitle="Perlu monitoring"
          />

          <div className="card" style={{ borderRadius: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Catatan</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#6b7280", display: "grid", gap: 8 }}>
              <li>Chart aktif (Recharts) untuk SNBP/SNBT/Mandiri otomatis.</li>
              <li>Filter Tahun/Fakultas mempengaruhi KPI & chart.</li>
              <li>Data masih dummy, tinggal ganti API.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
