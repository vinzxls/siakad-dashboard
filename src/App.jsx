import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

// pages
import Beranda from "./pages/Beranda";
import MahasiswaBaru from "./pages/MahasiswaBaru";
import TotalPendaftar from "./pages/TotalPendaftar";
import MahasiswaAktif from "./pages/MahasiswaAktif";
import SNBP from "./pages/SNBP";
import SNBT from "./pages/SNBT";
import Mandiri from "./pages/Mandiri";
import Kelulusan from "./pages/Kelulusan";
import Prestasi from "./pages/Prestasi";
import Afirmasi from "./pages/Afirmasi";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/beranda" replace />} />
        <Route path="beranda" element={<Beranda />} />

        <Route path="mahasiswa-baru" element={<MahasiswaBaru />} />
        <Route path="total-pendaftar" element={<TotalPendaftar />} />

        <Route path="mahasiswa-aktif" element={<MahasiswaAktif />} />

        <Route path="snbp" element={<SNBP />} />
        <Route path="snbt" element={<SNBT />} />
        <Route path="mandiri" element={<Mandiri />} />

        <Route path="kelulusan" element={<Kelulusan />} />
        <Route path="prestasi" element={<Prestasi />} />
        <Route path="afirmasi" element={<Afirmasi />} />

        <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
      </Route>
    </Routes>
  );
}
