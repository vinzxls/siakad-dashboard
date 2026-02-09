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

function FunnelProgress({ total, registrasi, krs, approved }) {
  const steps = [
    { label: "Total Aktif", value: total, tone: "info" },
    { label: "Registrasi", value: registrasi, tone: "ok" },
    { label: "Isi KRS", value: krs, tone: "info" },
    { label: "KRS Disetujui", value: approved, tone: "warn" },
  ];

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {steps.map((s, i) => {
        const w = Math.max(8, Math.round((s.value / Math.max(1, total)) * 100));
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
                  {pct(s.value, total)}
                </span>
              </div>
              <div style={{ fontWeight: 900 }}>{formatID(s.value)}</div>
            </div>

            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${w}%`, height: "100%", background: bar }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================== PAGE ================== */
export default function PelaporanMahasiswaTahun() {
  const [tahun, setTahun] = useState("2024");
  const [scope, setScope] = useState("Fakultas"); // Fakultas / Prodi
  const [unit, setUnit] = useState("Semua");

  const fakultasList = ["Semua", "FKIP", "FEB", "FT", "FH", "FISIP"];
  const prodiList = [
    "Semua",
    "Teknik Informatika",
    "Manajemen",
    "Hukum",
    "Ilmu Komunikasi",
    "Akuntansi",
    "Keperawatan",
  ];

  const vm = useMemo(() => {
    const baseTahun = tahun === "2025" ? 1.06 : tahun === "2024" ? 1 : 0.92;

    const FAC_WEIGHT = {
      Semua: 1,
      FKIP: 0.28,
      FEB: 0.22,
      FT: 0.19,
      FH: 0.16,
      FISIP: 0.15,
    };

    const PRODI_WEIGHT = {
      Semua: 1,
      "Teknik Informatika": 0.20,
      Manajemen: 0.18,
      Hukum: 0.16,
      "Ilmu Komunikasi": 0.14,
      Akuntansi: 0.12,
      Keperawatan: 0.10,
    };

    const unitFactor =
      scope === "Prodi"
        ? PRODI_WEIGHT[unit] ?? 0.15
        : FAC_WEIGHT[unit] ?? 0.18;

    const baseAktifUniv = Math.round(21000 * baseTahun);
    const aktif = unit === "Semua" ? baseAktifUniv : Math.round(baseAktifUniv * unitFactor);

    const rRegistrasi = tahun === "2023" ? 0.80 : tahun === "2024" ? 0.86 : 0.90;
    const rKrs = tahun === "2023" ? 0.78 : tahun === "2024" ? 0.83 : 0.88;
    const rApprove = tahun === "2023" ? 0.70 : tahun === "2024" ? 0.78 : 0.85;

    const registrasi = Math.round(aktif * rRegistrasi);
    const krs = Math.round(registrasi * rKrs);
    const approved = Math.round(krs * rApprove);

    const belumRegistrasi = Math.max(0, aktif - registrasi);
    const belumKrs = Math.max(0, registrasi - krs);
    const belumApprove = Math.max(0, krs - approved);

    const rataSks = (
      18.2 +
      (tahun === "2025" ? 0.4 : tahun === "2023" ? -0.6 : 0) +
      (unit === "Semua" ? 0 : -0.2)
    ).toFixed(1);

    const addDrop = Math.round(620 * baseTahun * (unit === "Semua" ? 1 : 0.35));

    const trenKrs = [
      { week: "M1", value: Math.round(krs * 0.18) },
      { week: "M2", value: Math.round(krs * 0.34) },
      { week: "M3", value: Math.round(krs * 0.28) },
      {
        week: "M4",
        value: Math.max(
          0,
          krs -
            (Math.round(krs * 0.18) +
              Math.round(krs * 0.34) +
              Math.round(krs * 0.28))
        ),
      },
    ];

    const rankingFakultas = [
      { label: "FKIP", total: Math.round(5600 * baseTahun), belumKrs: Math.round(880 * baseTahun) },
      { label: "FEB", total: Math.round(4200 * baseTahun), belumKrs: Math.round(640 * baseTahun) },
      { label: "FT", total: Math.round(3600 * baseTahun), belumKrs: Math.round(520 * baseTahun) },
      { label: "FH", total: Math.round(2800 * baseTahun), belumKrs: Math.round(410 * baseTahun) },
      { label: "FISIP", total: Math.round(2400 * baseTahun), belumKrs: Math.round(350 * baseTahun) },
    ]
      .map((x) => ({ ...x, persen: Math.round((x.belumKrs / Math.max(1, x.total)) * 100) }))
      .sort((a, b) => b.persen - a.persen);

    const rankingProdi = [
      { label: "Teknik Informatika", total: Math.round(1200 * baseTahun), belumKrs: Math.round(220 * baseTahun) },
      { label: "Manajemen", total: Math.round(980 * baseTahun), belumKrs: Math.round(210 * baseTahun) },
      { label: "Hukum", total: Math.round(860 * baseTahun), belumKrs: Math.round(180 * baseTahun) },
      { label: "Ilmu Komunikasi", total: Math.round(740 * baseTahun), belumKrs: Math.round(170 * baseTahun) },
      { label: "Akuntansi", total: Math.round(690 * baseTahun), belumKrs: Math.round(155 * baseTahun) },
      { label: "Keperawatan", total: Math.round(640 * baseTahun), belumKrs: Math.round(140 * baseTahun) },
    ]
      .map((x) => ({ ...x, persen: Math.round((x.belumKrs / Math.max(1, x.total)) * 100) }))
      .sort((a, b) => b.persen - a.persen);

    const ranking = scope === "Prodi" ? rankingProdi : rankingFakultas;

    const scopeLabel = scope === "Prodi" ? "Program Studi" : "Fakultas";
    const unitLabel = unit === "Semua" ? "Semua" : unit;

    return {
      aktif,
      registrasi,
      krs,
      approved,
      belumRegistrasi,
      belumKrs,
      belumApprove,
      rataSks,
      addDrop,
      trenKrs,
      ranking,
      scopeLabel,
      unitLabel,
    };
  }, [tahun, scope, unit]);

  function handleChangeScope(next) {
    setScope(next);
    setUnit("Semua");
  }

  const unitOptions = scope === "Prodi" ? prodiList : fakultasList;

  // ✅ aturan kamu: ranking hanya tampil kalau unit = Semua
  const showRanking = unit === "Semua";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* HEADER */}
      <div className="card" style={{ borderRadius: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Pelaporan – Checkpoint 1</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Aktivitas awal semester: registrasi, pengisian KRS, dan validasi (placeholder).
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
            Scope
            <select
              value={scope}
              onChange={(e) => handleChangeScope(e.target.value)}
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

          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 800 }}>
            {scope === "Prodi" ? "Program Studi" : "Fakultas"}
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
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
              {unitOptions.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <Badge
            text={`Belum KRS: ${pct(vm.belumKrs, vm.registrasi)}`}
            tone={vm.belumKrs > vm.registrasi * 0.18 ? "warn" : "info"}
          />
          <Badge
            text={`Belum Registrasi: ${pct(vm.belumRegistrasi, vm.aktif)}`}
            tone={vm.belumRegistrasi > vm.aktif * 0.12 ? "warn" : "info"}
          />
        </div>
      </div>

      {/* MAIN */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr", gap: 16, alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "grid", gap: 16 }}>
          <Card
            title="Progress Aktivitas Awal Semester (Funnel)"
            right={
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 900 }}>
                {vm.scopeLabel}: {vm.unitLabel} • Tahun {tahun}
              </span>
            }
          >
            <FunnelProgress total={vm.aktif} registrasi={vm.registrasi} krs={vm.krs} approved={vm.approved} />
          </Card>

          <Card
            title="Tren Pengisian KRS (Minggu 1–4)"
            right={
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 900 }}>
                {vm.scopeLabel}: {vm.unitLabel}
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={vm.trenKrs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(v) => formatID(v)} />
                <Line dataKey="value" stroke="#1e5aa8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* ✅ RANKING hanya saat unit = Semua */}
          {showRanking ? (
            <Card title={`Ranking ${vm.scopeLabel}: Belum Isi KRS`} right={<Badge text="Butuh follow-up" tone="warn" />}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={vm.ranking} barCategoryGap={18} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(v, name) => {
                      if (name === "belumKrs") return [formatID(v), "Belum KRS"];
                      if (name === "total") return [formatID(v), "Total"];
                      return [formatID(v), name];
                    }}
                  />
                  <Bar dataKey="belumKrs" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 6 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: "10px 0" }}>{vm.scopeLabel}</th>
                    <th style={{ padding: "10px 0" }}>Total</th>
                    <th style={{ padding: "10px 0" }}>Belum KRS</th>
                    <th style={{ padding: "10px 0" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {vm.ranking.map((r) => (
                    <tr key={r.label}>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.label}</td>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{formatID(r.total)}</td>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{formatID(r.belumKrs)}</td>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>{r.persen}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : null}
        </div>

        {/* RIGHT KPI */}
        <div style={{ display: "grid", gap: 12 }}>
          <PelaporanKpi
            title="Mahasiswa Aktif Semester Ini"
            value={formatID(vm.aktif)}
            subtitle={`${vm.scopeLabel}: ${vm.unitLabel} • Tahun ${tahun}`}
          />
          <PelaporanKpi title="Sudah Registrasi" value={formatID(vm.registrasi)} subtitle={`${pct(vm.registrasi, vm.aktif)} dari aktif`} />
          <PelaporanKpi title="Sudah Isi KRS" value={formatID(vm.krs)} subtitle={`${pct(vm.krs, vm.registrasi)} dari registrasi`} />
          <PelaporanKpi title="KRS Disetujui" value={formatID(vm.approved)} subtitle={`${pct(vm.approved, vm.krs)} dari isi KRS`} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <PelaporanKpi title="Belum Registrasi" value={formatID(vm.belumRegistrasi)} subtitle="Butuh follow-up" />
            <PelaporanKpi title="Belum Isi KRS" value={formatID(vm.belumKrs)} subtitle="Prioritas monitoring" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <PelaporanKpi title="Belum Approve KRS" value={formatID(vm.belumApprove)} subtitle="Proses validasi" />
            <PelaporanKpi title="Rata-rata SKS" value={vm.rataSks} subtitle="Beban studi" />
          </div>

          <PelaporanKpi title="Add/Drop KRS" value={formatID(vm.addDrop)} subtitle="Perubahan KRS" />
        </div>
      </div>
    </div>
  );
}
