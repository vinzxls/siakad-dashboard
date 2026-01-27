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

const COLORS = ["#1e5aa8", "#60a5fa", "#93c5fd", "#bfdbfe"];

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
    <div
      className="card"
      style={{
        padding: 20,
        borderRadius: 18,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 800 }}>
        {title}
      </div>
      <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.05 }}>
        {value}
      </div>
      {subtitle ? (
        <div style={{ fontSize: 13, color: "#6b7280" }}>{subtitle}</div>
      ) : null}
    </div>
  );
}

function DonutJenjang({ data }) {
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


function BarAngkatan({ data }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <SmartXAxisTick dataKey="angkatan" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1e5aa8" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LineTren({ data }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <SmartXAxisTick dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1e5aa8"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function MahasiswaAktif() {
  const [tahun, setTahun] = useState("2024");
  const [fakultas, setFakultas] = useState("Semua");

  const data = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.05 : tahun === "2024" ? 1 : 0.92;

    // Biar beda per fakultas (bukan sekadar semua vs bukan semua)
    const FAC_WEIGHT = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };
    const facFactor = FAC_WEIGHT[fakultas] ?? 0.2;

    const totalAktif = Math.round(18200 * baseYear * facFactor);

    const isiKrs = Math.round(totalAktif * 0.78);
    const belumKrs = Math.max(0, totalAktif - isiKrs);

    const byJenjang = [
      { label: "D3", value: Math.round(totalAktif * 0.08) },
      { label: "S1", value: Math.round(totalAktif * 0.78) },
      { label: "S2", value: Math.round(totalAktif * 0.12) },
      { label: "S3", value: Math.round(totalAktif * 0.02) },
    ];

    const angkatan = ["2019", "2020", "2021", "2022", "2023", "2024"].map(
      (a, i) => ({
        angkatan: a,
        value: Math.max(
          80,
          Math.round((2600 - i * 300) * baseYear * (0.65 + facFactor))
        ),
      })
    );

    const tren = [
      { label: "2021", value: Math.round(17000 * 0.92 * facFactor) },
      { label: "2022", value: Math.round(17600 * 0.96 * facFactor) },
      { label: "2023", value: Math.round(18000 * 1.0 * facFactor) },
      { label: "2024", value: Math.round(18200 * 1.02 * facFactor) },
      { label: "2025", value: Math.round(18600 * 1.05 * facFactor) },
    ];

    const ipk = {
      rata: (3.18 + (tahun === "2025" ? 0.03 : tahun === "2023" ? -0.02 : 0)).toFixed(2),
      lt2: Math.round(totalAktif * 0.08),
      bt2_3: Math.round(totalAktif * 0.42),
      bt3_35: Math.round(totalAktif * 0.38),
      gt35: Math.round(totalAktif * 0.12),
    };

    const transfer = {
      total: Math.round(180 * baseYear * (fakultas === "Semua" ? 1 : 0.55)),
      masuk: Math.round(120 * baseYear),
      keluar: Math.round(60 * baseYear),
    };

    return {
      facFactor,
      totalAktif,
      isiKrs,
      belumKrs,
      byJenjang,
      angkatan,
      tren,
      ipk,
      transfer,
    };
  }, [tahun, fakultas]);

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
          <div style={{ fontSize: 20, fontWeight: 900 }}>Mahasiswa Aktif</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Statistik mahasiswa aktif berdasarkan tahun & fakultas.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
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
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1.6fr 0.9fr",
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card title="Mahasiswa Aktif Berdasarkan Jenjang">
              <DonutJenjang data={data.byJenjang} />
              <div style={{ display: "grid", gap: 8 }}>
                {data.byJenjang.map((x) => (
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

            <Card title="Mahasiswa Aktif Berdasarkan Angkatan">
              <BarAngkatan data={data.angkatan} />
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                Angkatan teratas:{" "}
                <b style={{ color: "#111827" }}>
                  {data.angkatan[0].angkatan}
                </b>{" "}
                ({data.angkatan[0].value.toLocaleString("id-ID")})
              </div>
            </Card>
          </div>

          <Card title="Tren Mahasiswa Aktif">
            <LineTren data={data.tren} />
          </Card>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card
              title="IPK Mahasiswa Aktif"
              right={<span style={{ fontWeight: 900 }}>Rata-rata: {data.ipk.rata}</span>}
            >
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  ["IPK < 2.00", data.ipk.lt2],
                  ["2.00 – 2.99", data.ipk.bt2_3],
                  ["3.00 – 3.49", data.ipk.bt3_35],
                  [">= 3.50", data.ipk.gt35],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: 10,
                      fontSize: 14,
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{k}</div>
                    <div style={{ fontWeight: 900 }}>{v.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Mahasiswa Transfer">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="card" style={{ padding: 16, borderRadius: 16 }}>
                  <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 900 }}>
                    Transfer Masuk
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900 }}>
                    {data.transfer.masuk.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="card" style={{ padding: 16, borderRadius: 16 }}>
                  <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 900 }}>
                    Transfer Keluar
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900 }}>
                    {data.transfer.keluar.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
                Total transfer:{" "}
                <b style={{ color: "#111827" }}>
                  {data.transfer.total.toLocaleString("id-ID")}
                </b>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT KPI */}
        <div style={{ display: "grid", gap: 16 }}>
          <KpiBig
            title="Total Mahasiswa Aktif"
            value={data.totalAktif.toLocaleString("id-ID")}
            subtitle={`Tahun ${tahun} • Fakultas ${fakultas}`}
          />
          <KpiBig
            title="Mahasiswa Isi KRS"
            value={data.isiKrs.toLocaleString("id-ID")}
            subtitle={`~${Math.round((data.isiKrs / Math.max(1, data.totalAktif)) * 100)}% dari total aktif`}
          />
          <KpiBig
            title="Mahasiswa Belum KRS"
            value={data.belumKrs.toLocaleString("id-ID")}
            subtitle="Perlu follow-up akademik"
          />

          <div className="card" style={{ borderRadius: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Catatan</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#6b7280", display: "grid", gap: 8 }}>
              <li>Chart sudah aktif (Recharts).</li>
              <li>Filter Tahun/Fakultas mempengaruhi KPI & chart.</li>
              <li>Nanti tinggal ganti data dummy jadi API.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#6b7280" }}>
        *Layout dibuat besar untuk dashboard.
      </div>
    </div>
  );
}
