import { useMemo, useState } from "react";

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

export default function PenerimaanDashboard({ jalurKey = "snbp", title = "SNBP" }) {
  const [tahun, setTahun] = useState("2024");
  const [fakultas, setFakultas] = useState("Semua");

  const data = useMemo(() => {
    const baseYear = tahun === "2025" ? 1.06 : tahun === "2024" ? 1 : 0.9;
    const jalurFactor = jalurKey === "snbp" ? 0.34 : jalurKey === "snbt" ? 0.41 : 0.25;
    const FAC_WEIGHT = {Semua: 1,Hukum: 0.22,Teknik: 0.28,Ekonomi: 0.24,FISIP: 0.18,Kedokteran: 0.08};
    const facFactor = FAC_WEIGHT[fakultas] ?? 0.2;

    const pendaftar = Math.round(12500 * baseYear * jalurFactor * facFactor);
    const diterima = Math.round(pendaftar * 0.52);
    const registrasi = Math.round(diterima * 0.82);
    const tidakRegistrasi = Math.max(0, diterima - registrasi);

    const gender = {
      laki: Math.round(registrasi * 0.48),
      perempuan: registrasi - Math.round(registrasi * 0.48),
    };

    const topProdi = [
      ["Teknik Informatika", Math.round(320 * baseYear * facFactor)],
      ["Manajemen", Math.round(290 * baseYear * facFactor)],
      ["Hukum", Math.round(260 * baseYear * facFactor)],
      ["Kedokteran", Math.round(240 * baseYear * facFactor)],
      ["Ilmu Komunikasi", Math.round(220 * baseYear * facFactor)],
      ["Akuntansi", Math.round(200 * baseYear * facFactor)],
    ].map(([prodi, val]) => ({ prodi, val: Math.max(30, val) }));

    const asalSekolah = [
      ["SMA Negeri 1 Ambon", Math.round(90 * baseYear * facFactor)],
      ["SMA Negeri 2 Ambon", Math.round(82 * baseYear * facFactor)],
      ["SMA Kristen 1", Math.round(75 * baseYear * facFactor)],
      ["SMA Negeri 3 Ambon", Math.round(70 * baseYear * facFactor)],
      ["SMK Negeri 1", Math.round(62 * baseYear * facFactor)],
    ].map(([s, val]) => ({ sekolah: s, val: Math.max(10, val) }));

    return {
      pendaftar,
      diterima,
      registrasi,
      tidakRegistrasi,
      gender,
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
            Statistik penerimaan jalur {title} berdasarkan tahun & fakultas (dummy).
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
            <Card title="Pendaftar vs Diterima">
              <PlaceholderChart label="Bar/Line Pendaftar vs Diterima" />
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                Rasio diterima:{" "}
                <b style={{ color: "#111827" }}>
                  {Math.round((data.diterima / Math.max(1, data.pendaftar)) * 100)}%
                </b>
              </div>
            </Card>

            <Card title="Registrasi vs Tidak Registrasi">
              <PlaceholderChart label="Donut Registrasi" />
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  ["Registrasi", data.registrasi],
                  ["Tidak Registrasi", data.tidakRegistrasi],
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
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <Card title="Mahasiswa Registrasi Berdasarkan Gender">
              <PlaceholderChart label="Donut Gender" />
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  ["Laki-laki", data.gender.laki],
                  ["Perempuan", data.gender.perempuan],
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

            <Card title="Top Asal Sekolah (Registrasi)">
              <PlaceholderChart label="Bar Top Sekolah" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: "10px 0" }}>Sekolah</th>
                    <th style={{ padding: "10px 0" }}>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {data.asalSekolah.map((r) => (
                    <tr key={r.sekolah}>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 800 }}>
                        {r.sekolah}
                      </td>
                      <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                        {r.val.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <Card title="Top Program Studi (Diterima/Registrasi)">
            <PlaceholderChart label="Bar Top Prodi" />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th style={{ padding: "10px 0" }}>Program Studi</th>
                  <th style={{ padding: "10px 0" }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {data.topProdi.map((r) => (
                  <tr key={r.prodi}>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 800 }}>
                      {r.prodi}
                    </td>
                    <td style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", fontWeight: 900 }}>
                      {r.val.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* RIGHT KPI */}
        <div style={{ display: "grid", gap: 16 }}>
          <KpiBig title="Total Pendaftar" value={data.pendaftar.toLocaleString("id-ID")} subtitle={`Tahun ${tahun} • Fakultas ${fakultas}`} />
          <KpiBig title="Total Diterima" value={data.diterima.toLocaleString("id-ID")} subtitle={`Rasio: ${Math.round((data.diterima / Math.max(1, data.pendaftar)) * 100)}%`} />
          <KpiBig title="Registrasi" value={data.registrasi.toLocaleString("id-ID")} subtitle={`Dari diterima: ${Math.round((data.registrasi / Math.max(1, data.diterima)) * 100)}%`} />
          <KpiBig title="Tidak Registrasi" value={data.tidakRegistrasi.toLocaleString("id-ID")} subtitle="Perlu monitoring" />

          <div className="card" style={{ borderRadius: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Catatan</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#6b7280", display: "grid", gap: 8 }}>
              <li>Chart masih placeholder (Step chart berikutnya).</li>
              <li>Filter Tahun/Fakultas mempengaruhi KPI & tabel.</li>
              <li>Engine ini dipakai SNBP/SNBT/Mandiri.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
