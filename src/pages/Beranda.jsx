import KpiCard from "../components/KpiCard";
import StatSection from "../components/StatSection";


export default function BerandaAkademik() {
  const items = [
    { title: "Total Mahasiswa", value: "18,240", icon: "👥", className: "statcard--purple" },
    {title: "Mahasiswa Baru", value: "3,200", icon: "🎓", className: "statcard--green" },
    {title: "Lulusan Tahun Ini", value: "2,500", icon: "🏅", className: "statcard--orange" },
    { title: "Mahasiswa Aktif", value: "16,910", icon: "✅", className: "statcard--blue" },
    {title: "pendaftaran Ulang", value: "15,580", icon: "🔄", className: "statcard--yellow" },
    

  ];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <StatSection items={items} />
    </div>
  );
}

