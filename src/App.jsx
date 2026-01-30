import { Routes, Route, Navigate } from "react-router-dom";

import DashboardHome from "./pages/DashboardHome";
import AkademikLayout from "./layouts/AkademikLayout";

import Beranda from "./pages/Beranda";
import MahasiswaAktif from "./pages/MahasiswaAktif";
import MahasiswaBaru from "./pages/MahasiswaBaru";
import SNBP from "./pages/SNBP";
import SNBT from "./pages/SNBT";
import Mandiri from "./pages/Mandiri";
import Lulusan from "./pages/Lulusan";

import PelaporanMahasiswaTahun from "./pages/Pelaporan/PelaporanMahasiswaTahun";
import PelaporanMasaStudiIPK from "./pages/Pelaporan/PelaporanMasaStudiIPK";
import PelaporanMhsDanLulusan from "./pages/Pelaporan/PelaporanMhsDanLulusan";


export default function App() {
  return (
    <Routes>
      {/* DASHBOARD HOME */}
      <Route path="/" element={<DashboardHome />} />

      {/* AKADEMIK */}
      <Route path="/akademik" element={<AkademikLayout />}>
        <Route index element={<Navigate to="beranda" replace />} />
        <Route path="beranda" element={<Beranda />} />
        <Route path="mahasiswa-aktif" element={<MahasiswaAktif />} />
        <Route path="mahasiswa-baru" element={<MahasiswaBaru />} />
        <Route path="snbp" element={<SNBP />} />
        <Route path="snbt" element={<SNBT />} />
        <Route path="mandiri" element={<Mandiri />} />
        <Route path="lulusan" element={<Lulusan />} /> {/* ✅ FIX */}
        <Route path="Pelaporan/mahasiswa-tahun" element={<PelaporanMahasiswaTahun />} />
        <Route path="Pelaporan/masa-studi-ipk" element={<PelaporanMasaStudiIPK />} />
        <Route path="Pelaporan/mhs-dan-lulusan" element={<PelaporanMhsDanLulusan />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
