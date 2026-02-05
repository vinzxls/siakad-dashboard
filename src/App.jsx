import { Routes, Route, Navigate } from "react-router-dom";

import DashboardHome from "./pages/DashboardHome";
import AkademikLayout from "./layouts/AkademikLayout";

import Beranda from "./pages/Beranda";
import MahasiswaAktif from "./pages/MahasiswaAktif";
import MahasiswaBaru from "./pages/MahasiswaBaru";
import Lulusan from "./pages/Lulusan";

import PelaporanMahasiswaTahun from "./pages/pelaporan/PelaporanMahasiswaTahun";
import PelaporanMasaStudiIPK from "./pages/pelaporan/PelaporanMasaStudiIPK";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />

      <Route path="/akademik" element={<AkademikLayout />}>
        <Route index element={<Navigate to="beranda" replace />} />
        <Route path="beranda" element={<Beranda />} />
        <Route path="mahasiswa-aktif" element={<MahasiswaAktif />} />
        <Route path="mahasiswa-baru" element={<MahasiswaBaru />} />

        {/* redirect route lama */}
        <Route path="snbp" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
        <Route path="snbt" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
        <Route path="mandiri" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
        <Route path="mandiri-rpl" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
        <Route path="prestasi" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
        <Route path="afirmasi" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />

        <Route path="lulusan" element={<Lulusan />} />

        <Route path="pelaporan">
          <Route index element={<Navigate to="checkpoint-1" replace />} />
          <Route path="checkpoint-1" element={<PelaporanMahasiswaTahun />} />
          <Route path="checkpoint-2" element={<PelaporanMasaStudiIPK />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
