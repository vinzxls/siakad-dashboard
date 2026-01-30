import KpiCard from "../components/KpiCard";

export default function Beranda() {
  return (
    <div className="page-wrap">
      <h2>Beranda</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        <KpiCard title="Mahasiswa Aktif" value="18.200" />
        <KpiCard title="Mahasiswa Baru" value="5.200" />
        <KpiCard title="Lulusan" value="3.400" />
        <KpiCard title="Pendaftar" value="12.500" />
      </div>
    </div>
  );
}
