import { useMemo, useState } from "react";
import {ResponsiveContainer,PieChart,Pie,Cell,Tooltip,BarChart,Bar,XAxis,YAxis,CartesianGrid,LineChart,ine,} from "recharts";

const COLORS = ["#1e5aa8", "#60a5fa", "#93c5fd", "#bfdbfe"];

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
    <div
      className="card"
      style={{
        padding: 20,
        borderRadius: 18,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.05 }}>{value}</div>
      {subtitle ? <div style={{ fontSize: 13, color: "#6b7280" }}>{subtitle}</div> : null}
    </div>
  );
}

function PlaceholderChart({ label }) {
  return (
    <div
      style={{
        height: 320,
        border: "2px dashed #cbd5e1",
        borderRadius: 16,
        display: "grid",
        placeItems: "center",
        color: "#6b7280",
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: 0.4,
        background: "#fafafa",
      }}
    >
      {label} (Chart – Step berikutnya)
    </div>
  );
}

export default function MahasiswaAktif() {
  const [tahun, setTahun] = useState("2024");
  const [fakultas, setFakultas] = useState("Semua");

  // Dummy yang "berasa warehouse": berubah by tahun & fakultas (biar tidak statis)
  const data = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.05 : tahun === "2024" ? 1 : 0.92;
    const facFactor = fakultas === "Semua" ? 1 : 0.35;

    const totalAktif = Math.round(18200 * baseYear * (fakultas === "Semua" ? 1 : 0.42));
    const isiKrs = Math.round(totalAktif * 0.78);
    const belumKrs = totalAktif - isiKrs;

    const byJenjang = [
      { label: "D3", value: Math.round(totalAktif * 0.08) },
      { label: "S1", value: Math.round(totalAktif * 0.78) },
      { label: "S2", value: Math.round(totalAktif * 0.12) },
      { label: "S3", value: Math.round(totalAktif * 0.02) },
    ];

    const angkatan = ["2019", "2020", "2021", "2022", "2023", "2024"].map((a, i) => ({
      angkatan: a,
      value: Math.max(120, Math.round((2800 - i * 320) * baseYear * (0.8 + facFactor))),
    }));

    const ipk = {
      rata: (3.18 + (tahun === "2025" ? 0.03 : tahun === "2023" ? -0.02 : 0)).toFixed(2),
      lt2: Math.round(totalAktif * 0.08),
      bt2_3: Math.round(totalAktif * 0.42),
      bt3_35: Math.round(totalAktif * 0.38),
      gt35: Math.round(totalAktif * 0.12),
    };

    const transfer = {
      total: Math.round(180 * baseYear * (fakultas === "Semua" ? 1 : 0.6)),
      masuk: Math.round(120 * baseYear),
      keluar: Math.round(60 * baseYear),
    };

    return {
      totalAktif,
      isiKrs,
      belumKrs,
      byJenjang,
      angkatan,
      ipk,
      transfer,
    };
  }, [tahun, fakultas]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Filter Bar (besar, dashboard feel) */}
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
            Statistik mahasiswa aktif berdasarkan tahun & fakultas (dummy terpusat).
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>
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

          <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>
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
            </select>
          </label>
        </div>
      </div>

      {/* MAIN GRID: kiri charts, kanan KPI */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1.6fr 0.9fr",
          alignItems: "start",
        }}
      >
        {/* LEFT: Charts & Tables */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Row 1: Jenjang + Angkatan */}
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Card title="Mahasiswa Aktif Berdasarkan Jenjang">
              <PlaceholderChart label="Donut Jenjang (D3/S1/S2/S3)" />
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
                    <div style={{ fontWeight: 800 }}>{x.label}</div>
                    <div style={{ fontWeight: 900 }}>{x.value.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Mahasiswa Aktif Berdasarkan Angkatan">
              <PlaceholderChart label="Bar Angkatan" />
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                Top angkatan (dummy):{" "}
                <b style={{ color: "#111827" }}>{data.angkatan[0].angkatan}</b> –{" "}
                {data.angkatan[0].value.toLocaleString("id-ID")}
              </div>
            </Card>
          </div>

          {/* Row 2: Tren */}
          <Card title="Tren Mahasiswa Aktif">
            <PlaceholderChart label="Line Tren (per tahun/per semester)" />
          </Card>

          {/* Row 3: IPK + Transfer */}
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Card title="IPK Mahasiswa Aktif" right={<span style={{ fontWeight: 900 }}>Rata-rata: {data.ipk.rata}</span>}>
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
                    <div style={{ fontWeight: 800 }}>{k}</div>
                    <div style={{ fontWeight: 900 }}>{v.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Mahasiswa Transfer">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="card" style={{ padding: 16, borderRadius: 16 }}>
                  <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 800 }}>Transfer Masuk</div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{data.transfer.masuk.toLocaleString("id-ID")}</div>
                </div>
                <div className="card" style={{ padding: 16, borderRadius: 16 }}>
                  <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 800 }}>Transfer Keluar</div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{data.transfer.keluar.toLocaleString("id-ID")}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
                Total transfer: <b style={{ color: "#111827" }}>{data.transfer.total.toLocaleString("id-ID")}</b>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT: KPI Column */}
        <div style={{ display: "grid", gap: 16 }}>
          <KpiBig
            title="Total Mahasiswa Aktif"
            value={data.totalAktif.toLocaleString("id-ID")}
            subtitle={`Tahun ${tahun} • Fakultas ${fakultas}`}
          />
          <KpiBig
            title="Mahasiswa Isi KRS"
            value={data.isiKrs.toLocaleString("id-ID")}
            subtitle={`~${Math.round((data.isiKrs / data.totalAktif) * 100)}% dari total aktif`}
          />
          <KpiBig
            title="Mahasiswa Belum KRS"
            value={data.belumKrs.toLocaleString("id-ID")}
            subtitle="Perlu follow-up akademik"
          />

          <div className="card" style={{ borderRadius: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Catatan</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#6b7280", display: "grid", gap: 8 }}>
              <li>Chart masih placeholder (Step chart berikutnya).</li>
              <li>Data dummy sudah “berelasi” via filter Tahun & Fakultas.</li>
              <li>Nanti tinggal ganti source dari API.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Responsive note */}
      <div style={{ fontSize: 12, color: "#6b7280" }}>
        *Catatan: Layout ini dibuat besar untuk dashboard. Kalau layar kecil, nanti kita buat versi responsive (Step sesudah chart).
      </div>
    </div>
  );
}
