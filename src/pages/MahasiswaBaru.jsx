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
} from "recharts";

const COLORS = ["#1e5aa8", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

function Card({ title, right, children }) {
  return (
    <section className="card" style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
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
          <Tooltip />
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

function formatID(n) {
  try { return Number(n).toLocaleString("id-ID"); } catch { return n; }
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
          <SmartXAxisTick
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


export default function MahasiswaBaru() {
  const [tahun, setTahun] = useState("2024");
  const [jalur, setJalur] = useState("Semua");
  const [fakultas, setFakultas] = useState("Semua");

  const data = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.06 : tahun === "2024" ? 1 : 0.9;

    const jalurFactor = jalur === "Semua" ? 1 : jalur === "SNBP" ? 0.34 : jalur === "SNBT" ? 0.41 : 0.25;

    const FAC_WEIGHT = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };
    const facFactor = FAC_WEIGHT[fakultas] ?? 0.2;

    const total = Math.round(5200 * baseYear * jalurFactor * facFactor);
    const registrasi = Math.round(total * 0.9);
    const belumRegistrasi = Math.max(0, total - registrasi);

    const laki = Math.round(total * 0.5);
    const perempuan = Math.max(0, total - laki);

    const gender = [
      { label: "Laki-laki", value: laki },
      { label: "Perempuan", value: perempuan },
    ];

    const asal = [
      { label: "Maluku", value: Math.round(total * 0.62) },
      { label: "Papua", value: Math.round(total * 0.14) },
      { label: "Sulawesi", value: Math.round(total * 0.12) },
      { label: "Jawa", value: Math.round(total * 0.08) },
    ];
    const asalSum = asal.reduce((a, b) => a + b.value, 0);
    asal.push({ label: "Lainnya", value: Math.max(0, total - asalSum) });

    const asalBar = asal.map((x) => ({ name: x.label, value: x.value }));

    const topProdi = [
      ["Teknik Informatika", 520],
      ["Manajemen", 460],
      ["Hukum", 420],
      ["Kedokteran", 380],
      ["Ilmu Komunikasi", 340],
      ["Akuntansi", 310],
    ]
      .map(([prodi, base]) => ({
        name: prodi,
        value: Math.max(25, Math.round(base * baseYear * jalurFactor * facFactor)),
      }))
      .sort((a, b) => b.value - a.value);

    return { total, registrasi, belumRegistrasi, gender, asal, asalBar, topProdi };
  }, [tahun, jalur, fakultas]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Filter Bar */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>Mahasiswa Baru</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Ringkasan mahasiswa baru berdasarkan tahun, jalur, dan fakultas.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
            Tahun
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              style={{ marginLeft: 10, padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", fontSize: 15, fontWeight: 800 }}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </label>

          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
            Jalur
            <select
              value={jalur}
              onChange={(e) => setJalur(e.target.value)}
              style={{ marginLeft: 10, padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", fontSize: 15, fontWeight: 800 }}
            >
              <option value="Semua">Semua</option>
              <option value="SNBP">SNBP</option>
              <option value="SNBT">SNBT</option>
              <option value="Mandiri">Mandiri</option>
            </select>
          </label>

          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
            Fakultas
            <select
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
              style={{ marginLeft: 10, padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", fontSize: 15, fontWeight: 800 }}
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

      {/* GRID */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.6fr 0.9fr", alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card title="Sebaran Mahasiswa Baru Berdasarkan Asal Wilayah">
              <Bars data={data.asalBar} xKey="name" yKey="value" />
              <div style={{ display: "grid", gap: 8 }}>
                {data.asal.map((x) => (
                  <div key={x.label} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 10, fontSize: 14 }}>
                    <div style={{ fontWeight: 900 }}>{x.label}</div>
                    <div style={{ fontWeight: 900 }}>{x.value.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Mahasiswa Baru Berdasarkan Jenis Kelamin">
              <Donut data={data.gender} />
              <div style={{ display: "grid", gap: 10 }}>
                {data.gender.map((x) => (
                  <div key={x.label} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 10, fontSize: 14 }}>
                    <div style={{ fontWeight: 900 }}>{x.label}</div>
                    <div style={{ fontWeight: 900 }}>{x.value.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card title="Top Program Studi (Mahasiswa Baru)">
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
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.value.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* RIGHT KPI */}
        <div style={{ display: "grid", gap: 16 }}>
          <KpiBig
            title="Total Mahasiswa Baru"
            value={data.total.toLocaleString("id-ID")}
            subtitle={`Tahun ${tahun} • Jalur ${jalur} • Fakultas ${fakultas}`}
          />
          <KpiBig
            title="Registrasi"
            value={data.registrasi.toLocaleString("id-ID")}
            subtitle={`~${Math.round((data.registrasi / Math.max(1, data.total)) * 100)}% dari total`}
          />
          <KpiBig
            title="Belum Registrasi"
            value={data.belumRegistrasi.toLocaleString("id-ID")}
            subtitle="Butuh follow-up"
          />

          <div className="card" style={{ borderRadius: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Catatan</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#6b7280", display: "grid", gap: 8 }}>
              <li>Chart sudah aktif (Recharts).</li>
              <li>Filter Tahun/Jalur/Fakultas mempengaruhi KPI & chart.</li>
              <li>Nanti tinggal ganti data dummy jadi API.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
