import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import AkademikLayout from "./layouts/AkademikLayout";

import Beranda from "./pages/Beranda";
import MahasiswaAktif from "./pages/MahasiswaAktif";
import SNBP from "./pages/SNBP";
import SNBT from "./pages/SNBT";
import Mandiri from "./pages/Mandiri";

// Placeholder pages
const Stub = ({ title }) => (
  <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:16 }}>
    <h2 style={{ margin:0 }}>{title}</h2>
    <div style={{ marginTop:8, color:"#6b7280" }}>Placeholder (isi nanti)</div>
  </div>
);

export default function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Landing />} />

      {/* Akademik */}
      <Route path="/akademik" element={<AkademikLayout />}>
        <Route index element={<Navigate to="beranda" replace />} />
        <Route path="beranda" element={<Beranda />} />
        <Route path="mahasiswa-aktif" element={<MahasiswaAktif />} />
        <Route path="snbp" element={<SNBP />} />
        <Route path="snbt" element={<SNBT />} />
        <Route path="mandiri" element={<Mandiri />} />
      </Route>

      {/* Domain lain (placeholder) */}
      <Route path="/sdm" element={<Stub title="SDM" />} />
      <Route path="/beasiswa" element={<Stub title="Beasiswa" />} />
      <Route path="/akreditasi" element={<Stub title="Akreditasi" />} />
      <Route path="/keuangan" element={<Stub title="Keuangan" />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
