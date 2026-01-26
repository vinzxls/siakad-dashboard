import { useLocation } from "react-router-dom";

function titleFromPath(pathname){
  const p = pathname.toLowerCase();
  if (p.includes("/akademik/mahasiswa-aktif")) return "MAHASISWA AKTIF";
  if (p.includes("/akademik/snbp")) return "SNBP";
  if (p.includes("/akademik/snbt")) return "SNBT";
  if (p.includes("/akademik/mandiri")) return "MANDIRI";
  return "BERANDA";
}

export default function UnpattiTopbar(){
  const { pathname } = useLocation();
  const pageTitle = titleFromPath(pathname);

  return (
    <>
      <div className="unpatti-topbar">
        <div className="brand">
          <b>DASHBOARD</b>
          <span>unpatti.ac.id</span>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:12, opacity:0.9, fontWeight:800 }}>GANJIL</div>
          <div style={{ fontSize:28, fontWeight:900, lineHeight:1 }}>2025/2026</div>
        </div>
      </div>

      <div className="unpatti-breadcrumb">
        <div>Akademik / {pageTitle}</div>
        <div className="title">{pageTitle}</div>
      </div>
    </>
  );
}
