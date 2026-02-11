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
  Legend,
} from "recharts";

/* ================== UTIL ================== */
function formatID(n) {
  try {
    return Number(n).toLocaleString("id-ID");
  } catch {
    return n;
  }
}

function pct(part, total) {
  const t = Math.max(1, Number(total) || 1);
  const p = (Number(part) || 0) / t;
  return `${Math.round(p * 100)}%`;
}

function Card({ title, right, children }) {
  return (
    <section className="card" style={{ display: "grid", gap: 12, borderRadius: 18 }}>
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

function Badge({ text, tone = "info" }) {
  const map = {
    info: { bg: "#eff6ff", fg: "#1e5aa8" },
    warn: { bg: "#fff7ed", fg: "#c2410c" },
    ok: { bg: "#ecfdf5", fg: "#047857" },
    danger: { bg: "#fef2f2", fg: "#b91c1c" },
  };
  const t = map[tone] ?? map.info;
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 900,
        padding: "6px 10px",
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

/** Progress input nilai (Matkul total -> sudah input -> finalized) */
function ProgressNilai({ totalMatkul, sudahInput, finalized }) {
  const steps = [
    { label: "Total MK", value: totalMatkul, tone: "info", hint: "Kelas aktif semester ini" },
    { label: "Sudah Input Nilai", value: sudahInput, tone: "ok", hint: "Nilai sudah masuk" },
    { label: "Finalisasi", value: finalized, tone: "warn", hint: "Nilai terkunci/final" },
  ];

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {steps.map((s, i) => {
        const w = Math.max(8, Math.round((s.value / Math.max(1, totalMatkul)) * 100));
        const bar =
          s.tone === "ok"
            ? "rgba(4,120,87,0.18)"
            : s.tone === "warn"
            ? "rgba(194,65,12,0.18)"
            : "rgba(30,90,168,0.18)";

        return (
          <div
            key={s.label}
            className="card"
            style={{
              borderRadius: 16,
              padding: 12,
              display: "grid",
              gap: 8,
              border: "1px solid #eef2f7",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge text={`${i + 1}. ${s.label}`} tone={s.tone} />
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>
                  {pct(s.value, totalMatkul)}
                </span>
              </div>
              <div style={{ fontWeight: 900 }}>{formatID(s.value)}</div>
            </div>

            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${w}%`, height: "100%", background: bar }} />
            </div>

            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>{s.hint}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ================== PAGE ================== */
export default function PelaporanMasaStudiIPK() {
  const [tahun, setTahun] = useState("2024");
  const [scope, setScope] = useState("Fakultas"); // Fakultas / Prodi

  const vm = useMemo(() => {
    const base = tahun === "2025" ? 1.06 : tahun === "2024" ? 1 : 0.92;

    // Penilaian akhir semester (dummy)
    const totalMatkul = Math.round(1480 * base);
    const sudahInput = Math.round(totalMatkul * (tahun === "2023" ? 0.72 : tahun === "2024" ? 0.81 : 0.88));
    const belumInput = Math.max(0, totalMatkul - sudahInput);

    const finalized = Math.round(sudahInput * (tahun === "2023" ? 0.70 : tahun === "2024" ? 0.78 : 0.86));
    const belumFinal = Math.max(0, sudahInput - finalized);

    // IPS/hasil belajar
    const ipsRata = (3.05 + (tahun === "2025" ? 0.07 : tahun === "2023" ? -0.05 : 0.02)).toFixed(2);
    const ipkRata = (3.10 + (tahun === "2025" ? 0.06 : tahun === "2023" ? -0.04 : 0.02)).toFixed(2);

    const mhsDinilai = Math.round(16800 * base);
    const mhsBermasalah = Math.round(mhsDinilai * (tahun === "2023" ? 0.14 : tahun === "2024" ? 0.12 : 0.10)); // IPS<2.00 (dummy)

    // Distribusi nilai A-E dibuat beda per tahun agar terlihat berubah
    const dist = (() => {
      if (tahun === "2025") return { A: 0.24, B: 0.36, C: 0.26, D: 0.10, E: 0.04 };
      if (tahun === "2024") return { A: 0.22, B: 0.34, C: 0.28, D: 0.11, E: 0.05 };
      return { A: 0.20, B: 0.32, C: 0.29, D: 0.12, E: 0.07 };
    })();

    const totalNilai = Math.round(mhsDinilai * 6.5); // proxy jumlah nilai (dummy)
    const nilaiA = Math.round(totalNilai * dist.A);
    const nilaiB = Math.round(totalNilai * dist.B);
    const nilaiC = Math.round(totalNilai * dist.C);
    const nilaiD = Math.round(totalNilai * dist.D);
    const nilaiE = Math.max(0, totalNilai - nilaiA - nilaiB - nilaiC - nilaiD);

    const nilaiSummary = { A: nilaiA, B: nilaiB, C: nilaiC, D: nilaiD, E: nilaiE, total: totalNilai };

    // Tren IPS
    const trenIps = [
      { sem: "2023-1", v: 3.01 },
      { sem: "2023-2", v: 3.04 },
      { sem: "2024-1", v: 3.06 },
      { sem: "2024-2", v: 3.09 },
      { sem: "2025-1", v: 3.12 },
    ].map((x) => ({
      ...x,
      v: Number((x.v + (tahun === "2023" ? -0.05 : tahun === "2025" ? 0.04 : 0)).toFixed(2)),
    }));

    // Ranking alert (MK belum input) per fakultas / prodi
    const rankingFakultas = [
      { label: "FKIP", total: Math.round(320 * base), belum: Math.round(62 * base) },
      { label: "FEB", total: Math.round(260 * base), belum: Math.round(55 * base) },
      { label: "FT", total: Math.round(240 * base), belum: Math.round(51 * base) },
      { label: "FH", total: Math.round(180 * base), belum: Math.round(38 * base) },
      { label: "FISIP", total: Math.round(160 * base), belum: Math.round(34 * base) },
    ]
      .map((x) => ({ ...x, persen: Math.round((x.belum / Math.max(1, x.total)) * 100) }))
      .sort((a, b) => b.persen - a.persen);

    const rankingProdi = [
      { label: "Teknik Informatika", total: Math.round(88 * base), belum: Math.round(22 * base) },
      { label: "Manajemen", total: Math.round(82 * base), belum: Math.round(20 * base) },
      { label: "Hukum", total: Math.round(74 * base), belum: Math.round(18 * base) },
      { label: "Ilmu Komunikasi", total: Math.round(68 * base), belum: Math.round(16 * base) },
      { label: "Akuntansi", total: Math.round(64 * base), belum: Math.round(15 * base) },
      { label: "Keperawatan", total: Math.round(58 * base), belum: Math.round(14 * base) },
    ]
      .map((x) => ({ ...x, persen: Math.round((x.belum / Math.max(1, x.total)) * 100) }))
      .sort((a, b) => b.persen - a.persen);

    const ranking = scope === "Prodi" ? rankingProdi : rankingFakultas;

    // Tabel contoh: MK belum input nilai (dummy)
    const pending = ranking.slice(0, 5).map((r, idx) => ({
      mk: idx % 2 === 0 ? "Statistika" : "Metodologi Penelitian",
      unit: r.label,
      kelas: `Kelas ${String.fromCharCode(65 + idx)}`,
      peserta: Math.round((35 + idx * 6) * base),
      status: "Belum input nilai",
    }));

    return {
      totalMatkul,
      sudahInput,
      belumInput,
      finalized,
      belumFinal,
      ipsRata,
      ipkRata,
      mhsDinilai,
      mhsBermasalah,
      nilaiSummary,
      trenIps,
      ranking,
      pending,
    };
  }, [tahun, scope]);

  // warna grade (match biru-putih, dengan aksen untuk D/E)
  const GRADE_COLORS = {
    A: "#1e5aa8",
    B: "#60a5fa",
    C: "#93c5fd",
    D: "#f59e0b",
    E: "#ef4444",
  };

  const riskTone = vm.mhsBermasalah > vm.mhsDinilai * 0.12 ? "warn" : "info";
  const inputTone = vm.belumInput > vm.totalMatkul * 0.2 ? "warn" : "ok";

  const scopeLabel = scope === "Prodi" ? "Program Studi" : "Fakultas";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* HEADER */}
      <div className="card" style={{ borderRadius: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Pelaporan – Checkpoint 2</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Penilaian akhir semester: progres input nilai, distribusi nilai, dan ringkasan IPS/IPK (placeholder).
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
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
            Monitoring
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
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
              <option value="Fakultas">Fakultas</option>
              <option value="Prodi">Prodi</option>
            </select>
          </label>

          <Badge text={`Nilai belum input: ${pct(vm.belumInput, vm.totalMatkul)}`} tone={inputTone} />
          <Badge text={`Mahasiswa berisiko: ${pct(vm.mhsBermasalah, vm.mhsDinilai)}`} tone={riskTone} />
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
          <Card title="Progress Input Nilai (Akhir Semester)">
            <ProgressNilai totalMatkul={vm.totalMatkul} sudahInput={vm.sudahInput} finalized={vm.finalized} />
          </Card>

          <Card
            title="Distribusi Nilai (A–E)"
            right={<span style={{ fontSize: 12, color: "#6b7280", fontWeight: 900 }}>Total: {formatID(vm.nilaiSummary.total)}</span>}
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={[vm.nilaiSummary]} barCategoryGap={20} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={() => "Distribusi"} />
                <YAxis />
                <Tooltip
                  formatter={(v, name) => [formatID(v), `Nilai ${name}`]}
                  labelFormatter={() => `Tahun ${tahun}`}
                />
                <Legend />
                <Bar dataKey="A" stackId="g" fill={GRADE_COLORS.A} radius={[10, 10, 0, 0]} />
                <Bar dataKey="B" stackId="g" fill={GRADE_COLORS.B} />
                <Bar dataKey="C" stackId="g" fill={GRADE_COLORS.C} />
                <Bar dataKey="D" stackId="g" fill={GRADE_COLORS.D} />
                <Bar dataKey="E" stackId="g" fill={GRADE_COLORS.E} />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(120px, 1fr))", gap: 10 }}>
              {["A", "B", "C", "D", "E"].map((g) => (
                <div
                  key={g}
                  className="card"
                  style={{
                    borderRadius: 14,
                    padding: 10,
                    border: "1px solid #eef2f7",
                    display: "grid",
                    gap: 4,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 1000, color: "#0f172a" }}>Nilai {g}</span>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: GRADE_COLORS[g] }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900 }}>{formatID(vm.nilaiSummary[g])}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>
                    {pct(vm.nilaiSummary[g], vm.nilaiSummary.total)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Tren IPS Rata-rata (Multi Semester)">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={vm.trenIps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sem" />
                <YAxis domain={[2.0, 4.0]} />
                <Tooltip formatter={(v) => v} />
                <Line dataKey="v" stroke="#1e5aa8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title={`Ranking ${scopeLabel}: MK Belum Input Nilai`} right={<Badge text="Butuh tindak lanjut" tone="warn" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vm.ranking} barCategoryGap={18} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(v, name) => {
                    if (name === "belum") return [formatID(v), "Belum input nilai"];
                    if (name === "total") return [formatID(v), "Total MK"];
                    return [formatID(v), name];
                  }}
                />
                <Bar dataKey="belum" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 6 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th style={{ padding: "10px 0" }}>{scopeLabel}</th>
                  <th style={{ padding: "10px 0" }}>Total MK</th>
                  <th style={{ padding: "10px 0" }}>Belum Input</th>
                  <th style={{ padding: "10px 0" }}>%</th>
                </tr>
              </thead>
              <tbody>
                {vm.ranking.map((r) => (
                  <tr key={r.label}>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.label}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{formatID(r.total)}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{formatID(r.belum)}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.persen}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Tindak Lanjut: Contoh MK Belum Input Nilai">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th style={{ padding: "10px 0" }}>Mata Kuliah</th>
                  <th style={{ padding: "10px 0" }}>{scopeLabel}</th>
                  <th style={{ padding: "10px 0" }}>Kelas</th>
                  <th style={{ padding: "10px 0" }}>Peserta</th>
                  <th style={{ padding: "10px 0" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {vm.pending.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.mk}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.unit}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.kelas}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{formatID(r.peserta)}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                      <Badge text={r.status} tone="warn" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              *Placeholder — nanti sumbernya dari status input nilai SIAKAD.
            </div>
          </Card>
        </div>

        {/* RIGHT KPI */}
        <div style={{ display: "grid", gap: 12 }}>
          <PelaporanKpi title="Total Mata Kuliah" value={formatID(vm.totalMatkul)} subtitle={`Tahun ${tahun}`} />
          <PelaporanKpi title="Sudah Input Nilai" value={formatID(vm.sudahInput)} subtitle={`${pct(vm.sudahInput, vm.totalMatkul)} dari total`} />
          <PelaporanKpi title="Belum Input Nilai" value={formatID(vm.belumInput)} subtitle="Prioritas monitoring" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <PelaporanKpi title="Finalisasi Nilai" value={formatID(vm.finalized)} subtitle={`${pct(vm.finalized, vm.sudahInput)} dari sudah input`} />
            <PelaporanKpi title="Belum Final" value={formatID(vm.belumFinal)} subtitle="Proses berjalan" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <PelaporanKpi title="IPS Rata-rata" value={vm.ipsRata} subtitle="Semester berjalan" />
            <PelaporanKpi title="IPK Rata-rata" value={vm.ipkRata} subtitle="Akumulatif (opsional)" />
          </div>

          <PelaporanKpi title="Mahasiswa Dinilai" value={formatID(vm.mhsDinilai)} subtitle="Populasi penilaian" />
          <PelaporanKpi title="Mahasiswa Berisiko" value={formatID(vm.mhsBermasalah)} subtitle="IPS < 2.00 (dummy)" />
        </div>
      </div>
    </div>
  );
}
