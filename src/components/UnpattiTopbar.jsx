import { useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const PAGE_TITLES = {
  beranda: "BERANDA",
  "mahasiswa-aktif": "MAHASISWA AKTIF",
  "mahasiswa-baru": "MAHASISWA BARU",
  "mahasiswa-keluar": "MAHASISWA KELUAR",
  "checkpoint-1": "PELAPORAN – CP1",
  "checkpoint-2": "PELAPORAN – CP2",
};

function getPageTitle(pathname) {
  const p = pathname.toLowerCase();
  for (const [key, title] of Object.entries(PAGE_TITLES)) {
    if (p.includes(key)) return title;
  }
  return "BERANDA";
}

function getBreadcrumb(pathname) {
  const p = pathname.toLowerCase();
  if (p.includes("mahasiswa-aktif")) return "Mahasiswa > Mahasiswa Aktif";
  if (p.includes("mahasiswa-baru")) return "Mahasiswa Baru";
  if (p.includes("mahasiswa-keluar")) return "Mahasiswa Keluar";
  if (p.includes("checkpoint-1")) return "Pelaporan > Checkpoint 1";
  if (p.includes("checkpoint-2")) return "Pelaporan > Checkpoint 2";
  return "Beranda";
}

export default function UnpattiTopbar() {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <>
      {/* Dark top bar */}
      <div className="u-topbar">
        <div className="u-topbar__brand">
          <FiHome size={18} />
          <div>
            DASHBOARD
            <small>unpatti.ac.id</small>
          </div>
        </div>
        <div className="u-topbar__semester">
          <small>Ganjil</small>
          <br />
          <strong>2025/2026</strong>
        </div>
      </div>

      {/* Blue breadcrumb bar */}
      <div className="u-breadcrumb">
        <div className="u-breadcrumb__path">Akademik &gt; {breadcrumb}</div>
        <div className="u-breadcrumb__title">
          <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginRight: 4 }}>
            Akademik
          </span>
          {pageTitle}
        </div>
      </div>
    </>
  );
}
