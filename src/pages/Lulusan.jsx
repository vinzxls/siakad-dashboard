import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function formatID(n) {
  try {
    return Number(n).toLocaleString("id-ID");
  } catch {
    return n;
  }
}

function Badge({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        background: "#eaf2ff",
        color: "#1e5aa8",
      }}
    >
      {children}
    </span>
  );
}

function KpiColor({ title, value, note, tone = "blue" }) {
  // tone: blue | teal | purple | orange
  const tones = {
    blue: {
      bg: "linear-gradient(135deg, #1e5aa8 0%, #60a5fa 100%)",
      chip: "#dbeafe",
      icon: "#ffffff",
    },
    teal: {
      bg: "linear-gradient(135deg, #0f766e 0%, #22c55e 120%)",
      chip: "#d1fae5",
      icon: "#ffffff",
    },
    purple: {
      bg: "linear-gradient(135deg, #6d28d9 0%, #a78bfa 110%)",
      chip: "#ede9fe",
      icon: "#ffffff",
    },
    orange: {
      bg: "linear-gradient(135deg, #b45309 0%, #fb923c 120%)",
      chip: "#ffedd5",
      icon: "#ffffff",
    },
  };

  const t = tones[tone] ?? tones.blue;

  return (
    <div
      className="kpi-color"
      style={{
        borderRadius: 18,
        padding: 18,
        color: "#fff",
        background: t.bg,
        boxShadow: "0 16px 30px rgba(0,0,0,0.12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* highlight bubble */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
        }}
      />
      <div style={{ display: "grid", gap: 6, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: 0.2 }}>{title}</div>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.18)",
              color: t.icon,
              fontWeight: 900,
            }}
            title={title}
          >
            ●
          </span>
        </div>

        {note ? (
          <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.35 }}>{note}</div>
        ) : null}

        <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.05 }}>
          {value}
        </div>

        <div
          style={{
            marginTop: 2,
            display: "inline-flex",
            alignSelf: "start",
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.22)",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          Mahasiswa
        </div>
      </div>
    </div>
  );
}

function Card({ title, ribbon, children }) {
  return (
    <section className="card" style={{ borderRadius: 18, overflow: "hidden" }}>
      <div className={`lulusan-ribbon ${ribbon || "blue"}`}>
        <div style={{ fontWeight: 900 }}>{title}</div>
      </div>
      <div style={{ padding: 14 }}>{children}</div>
    </section>
  );
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
        boxShadow: "0 10px 20px rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 13 }}>
          <span style={{ color: "#6b7280", fontWeight: 800 }}>{p.name}</span>
          <span style={{ fontWeight: 900 }}>
            {typeof p.value === "number" ? formatID(p.value) : String(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Lulusan() {
  const [periodeAkhir, setPeriodeAkhir] = useState(2025);
  const [fakultas, setFakultas] = useState("Semua");

const vm = useMemo(() => {
  const years = [periodeAkhir - 5, periodeAkhir - 4, periodeAkhir - 3, periodeAkhir - 2, periodeAkhir - 1, periodeAkhir];

  // Data dasar (seperti screenshot)
  const lulusanByYearRaw = {
    2020: 0,
    2021: 4521,
    2022: 4372,
    2023: 6179,
    2024: 5492,
    2025: 4915,
  };

  const ipkByYearRaw = {
    2020: 0,
    2021: 3.32,
    2022: 3.32,
    2023: 3.31,
    2024: 3.30,
    2025: 3.38,
  };

  const lamaStudiByYearRaw = {
    2020: 4.8,
    2021: 4.8,
    2022: 4.6,
    2023: 3.9,
    2024: 3.7,
    2025: 4.0,
  };

  // Faktor fakultas
  const facWeight = {
    Semua: 1,
    Hukum: 0.22,
    Teknik: 0.28,
    Ekonomi: 0.24,
    FISIP: 0.18,
    Kedokteran: 0.08,
  };
  const facFactor = facWeight[fakultas] ?? 1;

  // Untuk scaling total (kalau Semua = 1, kalau fakultas = proporsi)
  const scaleTotal = fakultas === "Semua" ? 1 : facFactor;

  // IPK bias per fakultas (biar terasa beda)
  const ipkBias =
    fakultas === "Kedokteran" ? 0.06 :
    fakultas === "Teknik" ? -0.04 :
    fakultas === "Hukum" ? 0.01 :
    fakultas === "Ekonomi" ? 0.02 :
    fakultas === "FISIP" ? 0.00 :
    0;

  // Lama studi bias per fakultas
  const lamaBias =
    fakultas === "Teknik" ? 0.20 :
    fakultas === "Kedokteran" ? 0.15 :
    fakultas === "Hukum" ? -0.05 :
    fakultas === "Ekonomi" ? 0.05 :
    0;

  // Tepat waktu rate per fakultas
  const tepatRate =
    fakultas === "Kedokteran" ? 0.90 :
    fakultas === "Teknik" ? 0.88 :
    fakultas === "Hukum" ? 0.92 :
    fakultas === "Ekonomi" ? 0.91 :
    fakultas === "FISIP" ? 0.89 :
    0.90;

  const lulusanByYear = years.map((y) => {
    const baseTotal = lulusanByYearRaw[y] ?? 0;
    const total = Math.round(baseTotal * scaleTotal);

    const ipkBase = ipkByYearRaw[y] ?? 0;
    const ipk = ipkBase ? Number((ipkBase + ipkBias).toFixed(2)) : 0;

    const lamaBase = lamaStudiByYearRaw[y] ?? 0;
    const lama = lamaBase ? Number((lamaBase + lamaBias).toFixed(1)) : 0;

    // tepat waktu % untuk tabel
    const tepat = y === 2020 ? 0 : Math.round(tepatRate * 100);

    // cumlaude per tahun (proporsional dengan total & sedikit variasi)
    const cumlaudeRate =
      fakultas === "Kedokteran" ? 0.10 :
      fakultas === "Ekonomi" ? 0.08 :
      fakultas === "Hukum" ? 0.07 :
      fakultas === "Teknik" ? 0.06 :
      0.07;

    const cumlaude = y === 2020 ? 0 : Math.max(0, Math.round(total * cumlaudeRate));

    return {
      year: String(y),
      total,
      ipk,
      lama,
      tepat,
      cumlaude,
    };
  });

  // KPI
  const totalTercatat = 106391; // global, biarkan tetap

  // total 5 tahun terakhir (2021-2025)
  const total5Tahun = lulusanByYear.slice(1).reduce((a, b) => a + b.total, 0);

  // rata-rata ipk 5 tahun (abaikan 2020)
  const ipkList = lulusanByYear.slice(1).map((x) => x.ipk).filter((x) => x > 0);
  const ipkRata2 = ipkList.length
    ? Number((ipkList.reduce((a, b) => a + b, 0) / ipkList.length).toFixed(2))
    : 0;

  // total cumlaude 5 tahun
  const cumlaude5 = lulusanByYear.slice(1).reduce((a, b) => a + b.cumlaude, 0);

  // Per fakultas (kalau pilih Semua, tampil semua; kalau pilih fakultas tertentu, tetap tampil tapi disesuaikan)
  const fakultasList = [
    "FKIP","FEBIS","HUKUM","FISIP","TEKNIK","PASCA","FKEDOK","FAPERTA","FAPERIK","SAINTEK","PSDKU ARU","PSDKU MBD",
  ];

  const perFakultas = fakultasList.map((f, i) => {
    const base = Math.max(120, Math.round(9276 / (i + 1)));
    // kalau Semua: tampil full; kalau pilih fakultas: kecilkan agar “filter terasa”
    const scaled = Math.round(base * (fakultas === "Semua" ? 1 : scaleTotal));
    return { fakultas: f, total: scaled };
  });

  return { years, lulusanByYear, totalTercatat, total5Tahun, ipkRata2, cumlaude5, perFakultas };
}, [periodeAkhir, fakultas]);


  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* HEADER BESAR */}
      <div className="card" style={{ borderRadius: 18, overflow: "hidden" }}>
        <div
          style={{
            background: "linear-gradient(90deg, #0b3c7a 0%, #1e5aa8 50%, #0ea5e9 120%)",
            padding: "22px 16px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 0.2 }}>
            Laporan Kelulusan Mahasiswa
          </div>
          <div style={{ fontSize: 20, opacity: 0.95 }}>
            Periode {vm.years[0]} – {vm.years[5]}
          </div>
        </div>

        {/* filter kecil kanan */}
        <div style={{ padding: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Badge>5 Tahun Terakhir</Badge>
            <Badge>{fakultas}</Badge>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 900 }}>
              Periode Akhir
              <select
                value={periodeAkhir}
                onChange={(e) => setPeriodeAkhir(Number(e.target.value))}
                style={{
                  marginLeft: 10,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 900,
                }}
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>  
              </select>
            </label>

            <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 900 }}>
              Fakultas/Prodi
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
                  fontWeight: 900,
                }}
              >
                <option value="Semua">Pilih Fakultas/Prodi</option>
                <option value="Hukum">Hukum</option>
                <option value="Teknik">Teknik</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="FISIP">FISIP</option>
                <option value="Kedokteran">Kedokteran</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* KPI GRID (lebih berwarna) */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(4, minmax(240px, 1fr))" }}>
        <KpiColor
          tone="blue"
          title="Total Lulusan Terdaftar"
          value={formatID(vm.totalTercatat)}
          note="Jumlah total lulusan UNPATTI yang terintegrasi pada sistem."
        />
        <KpiColor
          tone="teal"
          title="Total Lulusan"
          value={formatID(vm.total5Tahun)}
          note="Akumulasi 5 tahun terakhir."
        />
        <KpiColor
          tone="purple"
          title="Rata-rata IPK"
          value={vm.ipkRata2.toFixed(2)}
          note="Rata-rata IPK 5 tahun terakhir."
        />
        <KpiColor
          tone="orange"
          title="Total Cumlaude"
          value={formatID(vm.cumlaude5)}
          note="Cumlaude 5 tahun terakhir."
        />
      </div>

      {/* CHART ROW 1 */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Card title="Jumlah Lulusan 5 Tahun Terakhir" ribbon="blue">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vm.lulusanByYear}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="total" name="Jumlah Lulusan" stroke="#0ea5e9" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Jumlah Lulusan Per Fakultas 5 Tahun Terakhir" ribbon="teal">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vm.perFakultas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fakultas" interval={0} tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="total" name="Total" stroke="#22c55e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* CHART ROW 2 */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <Card title="Rata-rata Lama Studi 5 Tahun Terakhir" ribbon="orange">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vm.lulusanByYear}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="lama"
                  name="Lama Studi (Tahun)"
                  stroke="#fb923c"
                  fill="#fed7aa"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Rata-rata IPK 5 Tahun Terakhir" ribbon="purple">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vm.lulusanByYear}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 4]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="ipk" name="IPK" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* TABLE */}
      <div className="card" style={{ borderRadius: 18, overflow: "hidden" }}>
        <div className="lulusan-table-title">Tabel Lulusan 5 Tahun Terakhir</div>
        <div style={{ padding: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "12px 10px" }}>Tahun</th>
                <th style={{ padding: "12px 10px" }}>Total Lulusan</th>
                <th style={{ padding: "12px 10px" }}>Rata-rata IPK</th>
                <th style={{ padding: "12px 10px" }}>Lulus Tepat Waktu (%)</th>
                <th style={{ padding: "12px 10px" }}>Lulusan Cumlaude</th>
              </tr>
            </thead>
            <tbody>
              {vm.lulusanByYear
                .slice()
                .reverse()
                .map((r, idx) => (
                  <tr
                    key={r.year}
                    style={{
                      background: idx % 2 === 0 ? "#f8fafc" : "#ffffff",
                    }}
                  >
                    <td style={{ padding: "14px 10px", borderTop: "1px solid #e5e7eb", fontWeight: 900 }}>
                      {r.year}
                    </td>
                    <td style={{ padding: "14px 10px", borderTop: "1px solid #e5e7eb", fontWeight: 900 }}>
                      {formatID(r.total)}
                    </td>
                    <td style={{ padding: "14px 10px", borderTop: "1px solid #e5e7eb", fontWeight: 900 }}>
                      {r.ipk ? r.ipk.toFixed(2).replace(".", ",") : "0"}
                    </td>
                    <td style={{ padding: "14px 10px", borderTop: "1px solid #e5e7eb", fontWeight: 900 }}>
                      {r.tepat}%
                    </td>
                    <td style={{ padding: "14px 10px", borderTop: "1px solid #e5e7eb", fontWeight: 900 }}>
                      {formatID(r.cumlaude)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
            
          </div>
        </div>
      </div>
    </div>
  );
}
