import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiHome, FiUsers, FiUserCheck, FiFileText, FiChevronDown, FiChevronRight, FiLogOut } from "react-icons/fi";
import unpattiLogo from "../assets/unpatti-logo.png";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [openMhs, setOpenMhs] = useState(pathname.includes("/mahasiswa-aktif") || pathname.includes("/mahasiswa-baru"));
  const [openKeluar, setOpenKeluar] = useState(pathname.includes("/mahasiswa-keluar"));
  const [openPelaporan, setOpenPelaporan] = useState(pathname.includes("/pelaporan"));

  const item = ({ isActive }) =>
    `u-menu__item${isActive ? " active" : ""}`;

  return (
    <aside className="u-sidebar">
      {/* Logo */}
      <div className="u-sidebar__logo">
        <img src={unpattiLogo} alt="UNPATTI" />
        <div className="u-sidebar__logo-text">
          <strong>Universitas Pattimura</strong>
          <span>Ambon, Maluku</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="u-menu">
        <div className="u-menu__label">Menu Utama</div>

        {/* Beranda */}
        <NavLink to="/akademik/beranda" className={item}>
          <span className="icon"><FiHome /></span>
          Beranda
        </NavLink>

        {/* Mahasiswa */}
        <button
          type="button"
          className="u-menu__toggle"
          onClick={() => setOpenMhs(v => !v)}
        >
          <span className="icon"><FiUsers /></span>
          Mahasiswa
          <span className="caret">{openMhs ? <FiChevronDown /> : <FiChevronRight />}</span>
        </button>
        {openMhs && (
          <div className="u-menu__sub">
            <NavLink to="/akademik/mahasiswa-aktif" className={item}>
              Mahasiswa Aktif
            </NavLink>
            <NavLink to="/akademik/mahasiswa-baru" className={item}>
              Mahasiswa Baru
            </NavLink>
          </div>
        )}

        {/* Mahasiswa Keluar */}
        <button
          type="button"
          className="u-menu__toggle"
          onClick={() => setOpenKeluar(v => !v)}
        >
          <span className="icon"><FiLogOut /></span>
          Mahasiswa Keluar
          <span className="caret">{openKeluar ? <FiChevronDown /> : <FiChevronRight />}</span>
        </button>
        {openKeluar && (
          <div className="u-menu__sub">
            <NavLink to="/akademik/mahasiswa-keluar" className={item}>
              Lulusan & Status Keluar
            </NavLink>
          </div>
        )}

        {/* Pelaporan */}
        <button
          type="button"
          className="u-menu__toggle"
          onClick={() => setOpenPelaporan(v => !v)}
        >
          <span className="icon"><FiFileText /></span>
          Pelaporan
          <span className="caret">{openPelaporan ? <FiChevronDown /> : <FiChevronRight />}</span>
        </button>
        {openPelaporan && (
          <div className="u-menu__sub">
            <NavLink to="/akademik/pelaporan/checkpoint-1" className={item}>
              Checkpoint 1
            </NavLink>
            <NavLink to="/akademik/pelaporan/checkpoint-2" className={item}>
              Checkpoint 2
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="u-sidebar__footer">
        Universitas Pattimura © 2026
      </div>
    </aside>
  );
}
