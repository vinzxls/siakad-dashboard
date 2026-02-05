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
  Legend,
} from "recharts";

/* ===================== THEME (Mahasiswa Baru: Emerald/Teal) ===================== */
const THEME = {
  emerald: "#0f766e",
  mint: "#34d399",
  teal: "#14b8a6",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  slate: "#0f172a",
  muted: "#6b7280",
  border: "#e5e7eb",
  soft: "#f8fafc",
};

const DONUT_COLORS = ["#0f766e", "#34d399", "#14b8a6", "#a7f3d0", "#d1fae5"];

/* ===================== UI ===================== */
function Card({ title, right, children }) {
  return (
    <section className="card" style={{ display: "grid", gap: 12, borderRadius: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontWeight: 1000, fontSize: 18 }}>{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

function KpiStripItem({ title, value, hint, accent }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: 18,
        padding: 16,
        display: "grid",
        gap: 6,
        borderLeft: `6px solid ${accent ?? THEME.emerald}`,
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 1000, lineHeight: 1.05, color: THEME.slate }}>{value}</div>
      {hint ? <div style={{ fontSize: 12, color: THEME.muted }}>{hint}</div> : null}
    </div>
  );
}

function KpiBig({ title, value, subtitle, accent }) {
  return (
    <div
      className="card"
      style={{
        padding: 20,
        borderRadius: 18,
        display: "grid",
        gap: 6,
        borderLeft: `6px solid ${accent ?? THEME.emerald}`,
      }}
    >
      <div style={{ fontSize: 14, color: THEME.muted, fontWeight: 900 }}>{title}</div>
      <div style={{ fontSize: 40, fontWeight: 1000, lineHeight: 1.05 }}>{value}</div>
      {subtitle ? <div style={{ fontSize: 13, color: THEME.muted }}>{subtitle}</div> : null}
    </div>
  );
}

/* ===================== CHART HELPERS ===================== */
function SmartXAxisTick({ x, y, payload }) {
  const raw = String(payload?.value ?? "");
  const words = raw.split(" ");
  const lines = [];
  let line = "";

  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= 12) line = next;
    else {
      if (line) lines.push(line);
      line = w;
    }
    if (lines.length === 2) break;
  }
  if (lines.length < 2 && line) lines.push(line);

  if (lines[1] && lines[1].length > 12) lines[1] = lines[1].slice(0, 11) + "…";
  if (!lines[1] && lines[0] && lines[0].length > 12) lines[0] = lines[0].slice(0, 11) + "…";

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" style={{ fontSize: 12, fill: THEME.slate }}>
        {lines.map((t, i) => (
          <tspan key={i} x="0" dy={i === 0 ? 0 : 14}>
            {t}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function formatID(n) {
  try {
    return Number(n).toLocaleString("id-ID");
  } catch {
    return n;
  }
}

/* ===================== CHARTS ===================== */
function Donut({ data }) {
  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={80} outerRadius={120} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatID(v)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Bars({ data, xKey, yKey, fill = THEME.emerald }) {
  const maxLen = Math.max(...data.map((d) => String(d?.[xKey] ?? "").length), 0);
  const needsSpace = maxLen > 12;

  return (
    <div style={{ height: 420 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: needsSpace ? 90 : 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} interval={0} height={needsSpace ? 90 : 60} tick={<SmartXAxisTick />} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatID(v)} labelFormatter={(label) => String(label ?? "")} />
          <Bar dataKey={yKey} fill={fill} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* Chart khusus: Perbandingan jalur (SNBP/SNBT/Mandiri) */
function JalurBars({ data }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={18} margin={{ top: 10, right: 16, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatID(v)} />
          <Bar dataKey="value" fill={THEME.emerald} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* Mandiri breakdown: RPL/Afirmasi/Prestasi */
function MandiriBreakdownBars({ data }) {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={18} margin={{ top: 10, right: 16, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatID(v)} />
          <Legend />
          <Bar dataKey="value" fill={THEME.violet} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ===================== PAGE ===================== */
export default function MahasiswaBaru() {
  const [tahun, setTahun] = useState("2024");

  // ✅ Jalur dibuat lengkap (termasuk sub Mandiri)
  const [jalur, setJalur] = useState("Semua");
  const [fakultas, setFakultas] = useState("Semua");

  const vm = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.06 : tahun === "2024" ? 1 : 0.9;

    const FAC_WEIGHT = {
      Semua: 1,
      Hukum: 0.22,
      Teknik: 0.28,
      Ekonomi: 0.24,
      FISIP: 0.18,
      Kedokteran: 0.08,
    };
    const facFactor = FAC_WEIGHT[fakultas] ?? 1;

    // ====== baseline per jalur (sebelum filter jalur diterapkan) ======
    const totalAll = Math.round(5200 * baseYear * facFactor);

    const snbpAll = Math.round(totalAll * 0.34);
    const snbtAll = Math.round(totalAll * 0.41);
    const mandiriAll = Math.max(0, totalAll - snbpAll - snbtAll);

    // Mandiri breakdown
    const rplAll = Math.round(mandiriAll * 0.25);
    const afirmasiAll = Math.round(mandiriAll * 0.35);
    const prestasiAll = Math.max(0, mandiriAll - rplAll - afirmasiAll);

    // ====== faktor filter jalur untuk “ringkasan umum” (KPI, asal, gender, top prodi) ======
    let jalurFactor = 1;
    if (jalur === "SNBP") jalurFactor = 0.34;
    else if (jalur === "SNBT") jalurFactor = 0.41;
    else if (jalur === "Mandiri (Semua)") jalurFactor = 0.25;
    else if (jalur === "Mandiri — RPL") jalurFactor = 0.25 * 0.25;
    else if (jalur === "Mandiri — Afirmasi") jalurFactor = 0.25 * 0.35;
    else if (jalur === "Mandiri — Prestasi") jalurFactor = 0.25 * 0.40;

    // Total terfilter (untuk chart umum seperti asal/gender/top prodi)
    const total = Math.max(1, Math.round(5200 * baseYear * jalurFactor * facFactor));
    const registrasi = Math.round(total * 0.9);
    const belumRegistrasi = Math.max(0, total - registrasi);

    // Gender
    const laki = Math.round(total * 0.5);
    const perempuan = Math.max(0, total - laki);
    const gender = [
      { label: "Laki-laki", value: laki },
      { label: "Perempuan", value: perempuan },
    ];

    // Asal wilayah
    const asal = [
      { label: "Maluku", value: Math.round(total * 0.62) },
      { label: "Papua", value: Math.round(total * 0.14) },
      { label: "Sulawesi", value: Math.round(total * 0.12) },
      { label: "Jawa", value: Math.round(total * 0.08) },
    ];
    const asalSum = asal.reduce((a, b) => a + b.value, 0);
    asal.push({ label: "Lainnya", value: Math.max(0, total - asalSum) });
    const asalBar = asal.map((x) => ({ name: x.label, value: x.value }));

    // Top prodi (umum, ikut filter jalur & fakultas)
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

    // Section data (tidak ikut jalur filter — ini “komposisi intake tahunan”)
    const nasionalBar = [
      { name: "SNBP", value: snbpAll },
      { name: "SNBT", value: snbtAll },
    ];

    const jalurCompare = [
      { name: "SNBP", value: snbpAll },
      { name: "SNBT", value: snbtAll },
      { name: "Mandiri", value: mandiriAll },
    ];

    const mandiriBreakdown = [
      { name: "RPL", value: rplAll },
      { name: "Afirmasi", value: afirmasiAll },
      { name: "Prestasi", value: prestasiAll },
    ];

    // Detail card numbers (untuk Mandiri detail)
    const mandiriDetail = {
      total: mandiriAll,
      rpl: rplAll,
      afirmasi: afirmasiAll,
      prestasi: prestasiAll,
    };

    return {
      total,
      registrasi,
      belumRegistrasi,
      gender,
      asal,
      asalBar,
      topProdi,

      // section intake
      jalurCompare,
      nasionalBar,
      mandiriBreakdown,
      mandiriDetail,

      // summary
      tahun,
      jalur,
      fakultas,
    };
  }, [tahun, jalur, fakultas]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* ===== Header + Filters (emerald vibe) ===== */}
      <div
        className="card"
        style={{
          borderRadius: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          border: `1px solid ${THEME.border}`,
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 1000, color: THEME.slate }}>
            Mahasiswa Baru
          </div>
          <div style={{ fontSize: 13, color: THEME.muted }}>
            Fokus intake: <b>SNBP</b>, <b>SNBT</b>, dan <b>Mandiri</b> (RPL/Afirmasi/Prestasi).
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 13, color: THEME.muted, fontWeight: 900 }}>
            Tahun
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              style={{
                marginLeft: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${THEME.border}`,
                background: "#fff",
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </label>

          <label style={{ fontSize: 13, color: THEME.muted, fontWeight: 900 }}>
            Jalur
            <select
              value={jalur}
              onChange={(e) => setJalur(e.target.value)}
              style={{
                marginLeft: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${THEME.border}`,
                background: "#fff",
                fontSize: 15,
                fontWeight: 900,
                minWidth: 180,
              }}
            >
              <option value="Semua">Semua</option>
              <option value="SNBP">SNBP</option>
              <option value="SNBT">SNBT</option>
              <option value="Mandiri (Semua)">Mandiri (Semua)</option>
              <option value="Mandiri — RPL">Mandiri — RPL</option>
              <option value="Mandiri — Afirmasi">Mandiri — Afirmasi</option>
              <option value="Mandiri — Prestasi">Mandiri — Prestasi</option>
            </select>
          </label>

          <label style={{ fontSize: 13, color: THEME.muted, fontWeight: 900 }}>
            Fakultas
            <select
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
              style={{
                marginLeft: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${THEME.border}`,
                background: "#fff",
                fontSize: 15,
                fontWeight: 900,
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

      {/* ===== KPI STRIP (horizontal feel) ===== */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(4, 1fr)" }}>
        <KpiStripItem
          title="Total Mahasiswa Baru (Terfilter)"
          value={formatID(vm.total)}
          hint={`Tahun ${vm.tahun} • Jalur ${vm.jalur}`}
          accent={THEME.emerald}
        />
        <KpiStripItem
          title="Registrasi"
          value={formatID(vm.registrasi)}
          hint={`~${Math.round((vm.registrasi / Math.max(1, vm.total)) * 100)}% dari total`}
          accent={THEME.mint}
        />
        <KpiStripItem
          title="Belum Registrasi"
          value={formatID(vm.belumRegistrasi)}
          hint="Butuh follow-up"
          accent={THEME.amber}
        />
        <KpiStripItem
          title="Fokus Fakultas"
          value={vm.fakultas}
          hint="Filter mempengaruhi semua ringkasan"
          accent={THEME.violet}
        />
      </div>

      {/* ===== MAIN GRID ===== */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.6fr 0.9fr", alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Section: Komposisi Jalur (overview) */}
          <Card
            title="Komposisi Jalur Penerimaan"
            right={<span style={{ fontWeight: 900, color: THEME.muted }}>SNBP • SNBT • Mandiri</span>}
          >
            <JalurBars data={vm.jalurCompare} />
          </Card>

          {/* Section: Nasional */}
          <Card
            title="SNBP & SNBT (Seleksi Nasional)"
            right={<span style={{ fontWeight: 900, color: THEME.muted }}>Komposisi tahunan</span>}
          >
            <JalurBars data={vm.nasionalBar} />
            <div style={{ display: "grid", gap: 8 }}>
              {vm.nasionalBar.map((x) => (
                <div
                  key={x.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: 10,
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontWeight: 1000 }}>{x.name}</div>
                  <div style={{ fontWeight: 1000 }}>{formatID(x.value)}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section: Mandiri overview */}
          <Card
            title="Mandiri (Overview)"
            right={<span style={{ fontWeight: 900, color: THEME.muted }}>RPL • Afirmasi • Prestasi</span>}
          >
            <MandiriBreakdownBars
              data={[
                { name: "RPL", value: vm.mandiriDetail.rpl },
                { name: "Afirmasi", value: vm.mandiriDetail.afirmasi },
                { name: "Prestasi", value: vm.mandiriDetail.prestasi },
              ]}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              <div className="card" style={{ borderRadius: 16, padding: 14, borderLeft: `6px solid ${THEME.violet}` }}>
                <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>Total Mandiri</div>
                <div style={{ fontSize: 22, fontWeight: 1000 }}>{formatID(vm.mandiriDetail.total)}</div>
              </div>
              <div className="card" style={{ borderRadius: 16, padding: 14, borderLeft: `6px solid ${THEME.teal}` }}>
                <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>RPL</div>
                <div style={{ fontSize: 22, fontWeight: 1000 }}>{formatID(vm.mandiriDetail.rpl)}</div>
              </div>
              <div className="card" style={{ borderRadius: 16, padding: 14, borderLeft: `6px solid ${THEME.amber}` }}>
                <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>Afirmasi</div>
                <div style={{ fontSize: 22, fontWeight: 1000 }}>{formatID(vm.mandiriDetail.afirmasi)}</div>
              </div>
              <div className="card" style={{ borderRadius: 16, padding: 14, borderLeft: `6px solid ${THEME.violet}` }}>
                <div style={{ fontSize: 12, color: THEME.muted, fontWeight: 900 }}>Prestasi</div>
                <div style={{ fontSize: 22, fontWeight: 1000 }}>{formatID(vm.mandiriDetail.prestasi)}</div>
              </div>
            </div>
          </Card>

          {/* Mandiri detail blocks (3 kolom) */}
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, 1fr)" }}>
            <Card title="Mandiri RPL" right={<span style={{ fontWeight: 900, color: THEME.muted }}>pengalaman kerja</span>}>
              <KpiBig
                title="Jumlah (tahunan)"
                value={formatID(vm.mandiriDetail.rpl)}
                subtitle="RPL = rekognisi pembelajaran lampau"
                accent={THEME.teal}
              />
            </Card>

            <Card title="Mandiri Afirmasi" right={<span style={{ fontWeight: 900, color: THEME.muted }}>pemerataan akses</span>}>
              <KpiBig
                title="Jumlah (tahunan)"
                value={formatID(vm.mandiriDetail.afirmasi)}
                subtitle="Afirmasi = jalur dukungan/kebijakan"
                accent={THEME.amber}
              />
            </Card>

            <Card title="Mandiri Prestasi" right={<span style={{ fontWeight: 900, color: THEME.muted }}>akademik/non-akademik</span>}>
              <KpiBig
                title="Jumlah (tahunan)"
                value={formatID(vm.mandiriDetail.prestasi)}
                subtitle="Prestasi = jalur berbasis achievement"
                accent={THEME.violet}
              />
            </Card>
          </div>

          {/* Existing: Asal wilayah + Gender (tetap, tapi vibe intake) */}
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card title="Sebaran Mahasiswa Baru Berdasarkan Asal Wilayah" right={<span style={{ fontWeight: 900, color: THEME.muted }}>terfilter</span>}>
              <Bars data={vm.asalBar} xKey="name" yKey="value" fill={THEME.emerald} />
              <div style={{ display: "grid", gap: 8 }}>
                {vm.asal.map((x) => (
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
                    <div style={{ fontWeight: 1000 }}>{x.label}</div>
                    <div style={{ fontWeight: 1000 }}>{formatID(x.value)}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Mahasiswa Baru Berdasarkan Jenis Kelamin" right={<span style={{ fontWeight: 900, color: THEME.muted }}>terfilter</span>}>
              <Donut data={vm.gender} />
              <div style={{ display: "grid", gap: 10 }}>
                {vm.gender.map((x) => (
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
                    <div style={{ fontWeight: 1000 }}>{x.label}</div>
                    <div style={{ fontWeight: 1000 }}>{formatID(x.value)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Existing: Top prodi */}
          <Card title="Top Program Studi (Mahasiswa Baru)" right={<span style={{ fontWeight: 900, color: THEME.muted }}>terfilter</span>}>
            <Bars data={vm.topProdi} xKey="name" yKey="value" fill={THEME.teal} />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: THEME.muted }}>
                  <th style={{ padding: "10px 0" }}>Program Studi</th>
                  <th style={{ padding: "10px 0" }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {vm.topProdi.map((r) => (
                  <tr key={r.name}>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 1000 }}>{r.name}</td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 1000 }}>{formatID(r.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* RIGHT KPI (tetap seperti gaya kamu, tapi emerald accent) */}
        <div style={{ display: "grid", gap: 16 }}>
          <KpiBig
            title="Total Mahasiswa Baru (Terfilter)"
            value={formatID(vm.total)}
            subtitle={`Tahun ${tahun} • Jalur ${jalur} • Fakultas ${fakultas}`}
            accent={THEME.emerald}
          />
          <KpiBig
            title="Registrasi"
            value={formatID(vm.registrasi)}
            subtitle={`~${Math.round((vm.registrasi / Math.max(1, vm.total)) * 100)}% dari total`}
            accent={THEME.mint}
          />
          <KpiBig
            title="Belum Registrasi"
            value={formatID(vm.belumRegistrasi)}
            subtitle="Butuh follow-up"
            accent={THEME.amber}
          />

          <div className="card" style={{ borderRadius: 18 }}>
            <div style={{ fontWeight: 1000, fontSize: 16, marginBottom: 10 }}>
              Catatan
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: THEME.muted, display: "grid", gap: 8 }}>
              <li>Dropdown Jalur mencakup Mandiri (Semua) & sub-jalur (RPL/Afirmasi/Prestasi).</li>
              <li>Chart “Komposisi Jalur” & “Mandiri Overview” menunjukkan komposisi tahunan (bukan hasil filter jalur).</li>
              <li>Asal/Gender/Top Prodi mengikuti filter (Tahun/Jalur/Fakultas).</li>
              <li>Nanti data dummy tinggal diganti API SIAKAD.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
