import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

/** Warna dashboard (placeholder) */
const COLORS = ["#1e5aa8", "#60a5fa", "#93c5fd", "#bfdbfe"];
const FAC_COLORS = {
  Hukum: "#6366f1",
  Teknik: "#2563eb",
  Ekonomi: "#16a34a",
  FISIP: "#f59e0b",
  Kedokteran: "#ef4444",
};

/** Komponen Card (judul + optional right) */
function Card({ title, right, children, style }) {
  return (
    <section
      className="card"
      style={{
        display: "grid",
        gap: 12,
        borderRadius: 18,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** KPI kanan (stack) */
function KpiRight({ value, label }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: 18,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 22,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1 }}>
          {value}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #eef2f7",
          padding: "12px 14px",
          display: "flex",
          justifyContent: "center",
          gap: 8,
          color: "#111827",
          fontWeight: 800,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** Donut Jenjang (kiri atas) */
function DonutJenjang({ data }) {
  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={72}
            outerRadius={110}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Bar Fakultas (kiri atas) */
function BarFakultas({ data }) {
  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={18}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1e5aa8" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Line Tren (single line) */
function LineSimple({ data, xKey, yKey }) {
  return (
    <div style={{ height: 330 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#1e5aa8"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Multi line tren per fakultas (opsional, tetap layout seperti Figma) */
function LineFakultas({ data, fakultas }) {
  return (
    <div style={{ height: 330 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tahun" />
          <YAxis />
          <Tooltip />
          <Legend />

          {fakultas === "Semua" ? (
            <>
              <Line
                type="monotone"
                dataKey="Hukum"
                stroke={FAC_COLORS.Hukum}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Teknik"
                stroke={FAC_COLORS.Teknik}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Ekonomi"
                stroke={FAC_COLORS.Ekonomi}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="FISIP"
                stroke={FAC_COLORS.FISIP}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Kedokteran"
                stroke={FAC_COLORS.Kedokteran}
                strokeWidth={2}
                dot={false}
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey={fakultas}
              stroke={FAC_COLORS[fakultas] ?? "#2563eb"}
              strokeWidth={3}
              dot
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Tren Transfer Eksternal (Masuk vs Keluar) */
function LineTransferTrend({ data }) {
  return (
    <div style={{ height: 330 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tahun" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Masuk"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Keluar"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Net"
            stroke="#1e5aa8"
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** BAR Horizontal Mutasi Internal Antar Fakultas */
function MutasiInternalFakultas({ data }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barCategoryGap={14}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="fakultas" width={110} />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#2563eb" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** TABLE Mutasi Internal Antar Prodi */
function MutasiInternalProdi({ data }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table width="100%" style={{ borderCollapse: "collapse", minWidth: 520 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: "10px 8px" }}>Prodi</th>
            <th style={{ padding: "10px 8px" }}>Masuk</th>
            <th style={{ padding: "10px 8px" }}>Keluar</th>
            <th style={{ padding: "10px 8px" }}>Net</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x) => (
            <tr key={x.prodi} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "10px 8px", fontWeight: 800 }}>{x.prodi}</td>
              <td style={{ padding: "10px 8px" }}>{x.masuk}</td>
              <td style={{ padding: "10px 8px" }}>{x.keluar}</td>
              <td
                style={{
                  padding: "10px 8px",
                  fontWeight: 900,
                  color: x.net >= 0 ? "#16a34a" : "#ef4444",
                }}
              >
                {x.net}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
        *Mutasi internal = pindah prodi/fakultas di dalam UNPATTI (bukan keluar kampus).
      </div>
    </div>
  );
}

export default function MahasiswaAktif() {
  const [tahun, setTahun] = useState("2024");
  const [fakultas, setFakultas] = useState("Semua");

  /** Dummy data (nanti diganti API SIAKAD) */
  const vm = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.05 : tahun === "2024" ? 1 : 0.92;

    const FAC_WEIGHT = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };
    const facFactor = FAC_WEIGHT[fakultas] ?? 1;

    const totalAktif = Math.round(26000 * baseYear * facFactor);
    const isiKrs = Math.round(totalAktif * 0.78);
    const nonAktif = Math.round(totalAktif * 0.12);
    const ipkRata = (
      3.12 + (tahun === "2025" ? 0.04 : tahun === "2023" ? -0.03 : 0)
    ).toFixed(2);

    const byJenjang = [
      { label: "Profesor", value: Math.round(totalAktif * 0.08) },
      { label: "S1", value: Math.round(totalAktif * 0.78) },
      { label: "S2", value: Math.round(totalAktif * 0.12) },
      { label: "S3", value: Math.round(totalAktif * 0.02) },
    ];

    const barFakultas = [
      { label: "Hukum", value: Math.round(5200 * baseYear) },
      { label: "FISIP", value: Math.round(4800 * baseYear) },
      { label: "FEB", value: Math.round(6100 * baseYear) },
      { label: "FKIP", value: Math.round(8200 * baseYear) },
      { label: "Lainnya", value: Math.round(3400 * baseYear) },
    ];

    const trenAktif = [
      { label: "2021", value: Math.round(24000 * 0.92 * facFactor) },
      { label: "2022", value: Math.round(24800 * 0.96 * facFactor) },
      { label: "2023", value: Math.round(25500 * 1.0 * facFactor) },
      { label: "2024", value: Math.round(26000 * 1.02 * facFactor) },
      { label: "2025", value: Math.round(26600 * 1.05 * facFactor) },
    ];

    const trenFakultas = [
      { tahun: 2020, Hukum: 2100, Teknik: 3200, Ekonomi: 2800, FISIP: 2400, Kedokteran: 900 },
      { tahun: 2021, Hukum: 2200, Teknik: 3400, Ekonomi: 2900, FISIP: 2500, Kedokteran: 950 },
      { tahun: 2022, Hukum: 2300, Teknik: 3600, Ekonomi: 3000, FISIP: 2600, Kedokteran: 1000 },
      { tahun: 2023, Hukum: 2400, Teknik: 3800, Ekonomi: 3100, FISIP: 2700, Kedokteran: 1050 },
      { tahun: 2024, Hukum: 2500, Teknik: 4000, Ekonomi: 3200, FISIP: 2800, Kedokteran: 1100 },
    ];

    const ipkTrend = [
      { label: "2021", value: 3.08 },
      { label: "2022", value: 3.12 },
      { label: "2023", value: 3.10 },
      { label: "2024", value: 3.14 },
      { label: "2025", value: 3.16 },
    ];

    // Rekap transfer eksternal (ini yang card paling bawah)
    const transfer = [
      { label: "Masuk (Eksternal)", value: Math.round(180 * baseYear) },
      { label: "Keluar (Eksternal)", value: Math.round(120 * baseYear) },
      { label: "Total", value: Math.round(300 * baseYear) },
    ];

    // Tren transfer eksternal (ini yang chart line masuk/keluar)
    const transferTrend = [
      { tahun: 2021, Masuk: Math.round(160 * baseYear), Keluar: Math.round(110 * baseYear) },
      { tahun: 2022, Masuk: Math.round(170 * baseYear), Keluar: Math.round(115 * baseYear) },
      { tahun: 2023, Masuk: Math.round(180 * baseYear), Keluar: Math.round(120 * baseYear) },
      { tahun: 2024, Masuk: Math.round(190 * baseYear), Keluar: Math.round(125 * baseYear) },
      { tahun: 2025, Masuk: Math.round(200 * baseYear), Keluar: Math.round(130 * baseYear) },
    ].map((x) => ({ ...x, Net: x.Masuk - x.Keluar }));

    // ====== TAMBAHAN: MUTASI INTERNAL (FAKULTAS + PRODI) ======
    const mutasiInternalFakultas = [
      { fakultas: "Teknik", jumlah: Math.round(140 * baseYear) },
      { fakultas: "Ekonomi", jumlah: Math.round(110 * baseYear) },
      { fakultas: "FISIP", jumlah: Math.round(95 * baseYear) },
      { fakultas: "Hukum", jumlah: Math.round(70 * baseYear) },
      { fakultas: "Kedokteran", jumlah: Math.round(40 * baseYear) },
    ];

    const mutasiInternalProdi = [
      { prodi: "Informatika", masuk: Math.round(45 * baseYear), keluar: Math.round(30 * baseYear) },
      { prodi: "Manajemen", masuk: Math.round(38 * baseYear), keluar: Math.round(42 * baseYear) },
      { prodi: "Ilmu Hukum", masuk: Math.round(22 * baseYear), keluar: Math.round(35 * baseYear) },
      { prodi: "Akuntansi", masuk: Math.round(31 * baseYear), keluar: Math.round(28 * baseYear) },
      { prodi: "Teknik Sipil", masuk: Math.round(26 * baseYear), keluar: Math.round(20 * baseYear) },
    ]
      .map((x) => ({ ...x, net: x.masuk - x.keluar }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net)); // biar terlihat yang paling signifikan

    return {
      totalAktif,
      isiKrs,
      nonAktif,
      ipkRata,
      byJenjang,
      barFakultas,
      trenAktif,
      trenFakultas,
      ipkTrend,
      transfer,
      transferTrend,
      mutasiInternalFakultas,
      mutasiInternalProdi,
    };
  }, [tahun, fakultas]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* HEADER + FILTER (mirip figma) */}
      <div
        className="card"
        style={{
          borderRadius: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Mahasiswa Aktif</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Data placeholder — nanti diganti API SIAKAD.
            <b style={{ marginLeft: 6 }}>Transfer dibedakan: eksternal vs mutasi internal.</b>
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

      {/* GRID UTAMA (kiri besar + kanan KPI stack) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 0.9fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Row 1: Donut + Bar (sejajar seperti figma) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card title="Mahasiswa Aktif Berdasarkan Jenjang" style={{ minHeight: 380 }}>
              <DonutJenjang data={vm.byJenjang} />
            </Card>

            <Card title="Mahasiswa Aktif Berdasarkan Fakultas" style={{ minHeight: 380 }}>
              <BarFakultas data={vm.barFakultas} />
            </Card>
          </div>

          {/* Row 2: Tren Mahasiswa Aktif (full width) */}
          <Card title="Tren Mahasiswa Aktif" style={{ minHeight: 420 }}>
            <LineSimple data={vm.trenAktif} xKey="label" yKey="value" />
          </Card>

          {/* Row 3: Tren Transfer (EKSTERNAL) */}
          <Card
            title="Tren Transfer Eksternal (Masuk vs Keluar)"
            right={<span style={{ fontWeight: 900, color: "#6b7280" }}>Net = Masuk - Keluar</span>}
            style={{ minHeight: 420 }}
          >
            <LineTransferTrend data={vm.transferTrend} />
          </Card>

          <Card
            title="IPK Mahasiswa Aktif"
            right={<span style={{ fontWeight: 900 }}>Rata-rata: {vm.ipkRata}</span>}
            style={{ minHeight: 420 }}
          >
            <LineSimple data={vm.ipkTrend} xKey="label" yKey="value" />
          </Card>


          {/* ====== TAMBAHAN: MUTASI INTERNAL (FAKULTAS + PRODI) ====== */}
          <Card
            title="Mutasi Internal Antar Fakultas"
            right={<span style={{ fontWeight: 900, color: "#6b7280" }}>Pindah fakultas di UNPATTI</span>}
            style={{ minHeight: 380 }}
          >
            <MutasiInternalFakultas data={vm.mutasiInternalFakultas} />
          </Card>

          <Card
            title="Mutasi Internal Antar Prodi"
            right={<span style={{ fontWeight: 900, color: "#6b7280" }}>Masuk/Keluar prodi (internal)</span>}
            style={{ minHeight: 360 }}
          >
            <MutasiInternalProdi data={vm.mutasiInternalProdi} />
          </Card>

          {/* Row 4: IPK (full width) */}
          

          {/* Row 5: Mahasiswa Transfer (EKSTERNAL) */}
          <Card
            title="Mahasiswa Transfer Eksternal"
            right={<span style={{ fontWeight: 900, color: "#6b7280" }}>Rekap tahunan</span>}
            style={{ minHeight: 360 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {vm.transfer.map((x) => (
                <div key={x.label} className="card" style={{ borderRadius: 16, padding: 16 }}>
                  <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 900 }}>{x.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 900 }}>{x.value.toLocaleString("id-ID")}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 10 }}>
              *Eksternal = perpindahan lintas kampus (masuk/keluar UNPATTI).
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (KPI stack seperti figma) */}
        <div style={{ display: "grid", gap: 16 }}>
          <KpiRight value={vm.totalAktif.toLocaleString("id-ID")} label="Mahasiswa Aktif" />
          <KpiRight value={vm.isiKrs.toLocaleString("id-ID")} label="Mahasiswa Isi KRS" />
          <KpiRight value={vm.nonAktif.toLocaleString("id-ID")} label="Mahasiswa Non Aktif" />
          <KpiRight value={vm.ipkRata} label="IPK Rata-rata Semester" />
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#6b7280" }}></div>
    </div>
  );
}
