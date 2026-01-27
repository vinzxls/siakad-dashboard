import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/unpatti-logo.png";

const Item = ({ to, label, icon="•" }) => (
  <NavLink
    to={to}
    className={({isActive}) => `unpatti-item ${isActive ? "active" : ""}`}
  >
    <span style={{ width:18, display:"inline-flex", justifyContent:"center" }}>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar(){
  const [openMahasiswa, setOpenMahasiswa] = useState(true);
  const [openMaba, setOpenMaba] = useState(true);

  return (
    <aside className="unpatti-sidebar">
      <div className="unpatti-logoBox">
        <div className="unpatti-logoInner">
          <img src={logo} alt="UNPATTI" />
          <div className="text">
            <b>UNIVERSITAS PATTIMURA</b>
            <span>AMBON</span>
          </div>
        </div>
      </div>

      <nav className="unpatti-menu">
        <Item to="/akademik/beranda" label="Beranda" icon="🏠" />

        <button className="unpatti-toggle" onClick={() => setOpenMahasiswa(v=>!v)} type="button">
          <span style={{ width:18, display:"inline-flex", justifyContent:"center" }}>👥</span>
          <span>Mahasiswa</span>
          <span style={{ marginLeft:"auto", opacity:0.6 }}>{openMahasiswa ? "▾":"▸"}</span>
        </button>
        {openMahasiswa && (
          <div className="unpatti-sub">
            <Item to="/akademik/mahasiswa-aktif" label="Mahasiswa Aktif" />
          </div>
        )}

        <button className="unpatti-toggle" onClick={() => setOpenMaba(v=>!v)} type="button">
          <span style={{ width:18, display:"inline-flex", justifyContent:"center" }}>🧑‍🎓</span>
          <span>Mahasiswa Baru</span>
          <span style={{ marginLeft:"auto", opacity:0.6 }}>{openMaba ? "▾":"▸"}</span>
        </button>
        {openMaba && (
          <div className="unpatti-sub">
            <Item to="/akademik/snbp" label="SNBP" />
            <Item to="/akademik/snbt" label="SNBT" />
            <Item to="/akademik/mandiri" label="Mandiri" />
            <Item to="/akademik/lulusan" label="Lulusan" />
          </div>
        )}
      </nav>

      <footer className="unpatti-footer">
        Universitas Pattimura © 2026
      </footer>
    </aside>
  );
}
