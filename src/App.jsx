import { Routes, Route, Navigate } from "react-router-dom";

import DashboardHome from "./pages/DashboardHome";
import AkademikLayout from "./layouts/AkademikLayout";

import Beranda from "./pages/Beranda";
import MahasiswaAktif from "./pages/MahasiswaAktif";
import MahasiswaBaru from "./pages/MahasiswaBaru";
import MahasiswaKeluar from "./pages/MahasiswaKeluar";

import PelaporanCP1 from "./pages/pelaporanx/PelaporanMahasiswaTahun";
import PelaporanCP2 from "./pages/pelaporanx/PelaporanMasaStudiIPK";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />

      <Route path="/akademik" element={<AkademikLayout />}>
        <Route index element={<Navigate to="beranda" replace />} />
        <Route path="beranda" element={<Beranda />} />
        <Route path="mahasiswa-aktif" element={<MahasiswaAktif />} />
        <Route path="mahasiswa-baru" element={<MahasiswaBaru />} />
        <Route path="mahasiswa-keluar" element={<MahasiswaKeluar />} />

        <Route path="pelaporan">
          <Route index element={<Navigate to="checkpoint-1" replace />} />
          <Route path="checkpoint-1" element={<PelaporanCP1 />} />
          <Route path="checkpoint-2" element={<PelaporanCP2 />} />
        </Route>

        {/* Legacy redirects */}
        <Route path="lulusan" element={<Navigate to="/akademik/mahasiswa-keluar" replace />} />
        <Route path="snbp" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
        <Route path="snbt" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
        <Route path="mandiri" element={<Navigate to="/akademik/mahasiswa-baru" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
