import { NavLink } from "react-router-dom";
import { useState } from "react";
import unpattiLogo from "../assets/unpatti-logo.png";

export default function Sidebar() {
  const [openMahasiswa, setOpenMahasiswa] = useState(true);
  const [openPelaporan, setOpenPelaporan] = useState(true);

  const mainLink = ({ isActive }) => ({
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 15,
    lineHeight: 1.2,
    color: isActive ? "#fff" : "#0f172a",
    background: isActive ? "#1e5aa8" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  });

  const groupBtn = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 15,
    lineHeight: 1.2,
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    width: "100%",
  };

  const subLink = ({ isActive }) => ({
    padding: "8px 12px 8px 34px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
    lineHeight: 1.2,
    color: isActive ? "#1e5aa8" : "#334155",
    background: isActive ? "rgba(30,90,168,0.10)" : "transparent",
    display: "block",
    minHeight: 38,
  });

  const caret = (open) => (
    <span style={{ fontSize: 12, opacity: 0.7 }}>{open ? "▾" : "▸"}</span>
  );

  return (
    <aside
      style={{
        width: 280,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      {/* Header */}
      <div style={{ padding: 14, borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(30,90,168,0.10)",
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(30,90,168,0.20)",
            }}
          >
            <img
              src={unpattiLogo}
              alt="UNPATTI"
              style={{ width: 44, height: 44, objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "grid", gap: 2 }}>
            <div style={{ fontWeight: 1000, fontSize: 14, color: "#0f172a" }}>
              UNIVERSITAS PATTIMURA
            </div>
            <div style={{ fontWeight: 900, fontSize: 12, color: "#64748b" }}>
              AMBON
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ padding: 12, display: "grid", gap: 4, alignContent: "start" }}>
        {/* Beranda */}
        <NavLink to="/akademik/beranda" style={mainLink}>
          <span>Beranda</span>
        </NavLink>

        {/* Mahasiswa dropdown */}
        <button
          type="button"
          style={groupBtn}
          onClick={() => setOpenMahasiswa((v) => !v)}
        >
          <span>Mahasiswa</span>
          {caret(openMahasiswa)}
        </button>

        {openMahasiswa && (
          <div style={{ display: "grid", gap: 3, marginTop: 2, marginBottom: 6 }}>
            <NavLink to="/akademik/mahasiswa-aktif" style={subLink}>
              Mahasiswa Aktif
            </NavLink>

            {/* ✅ hanya 1 route Mahasiswa Baru */}
            <NavLink to="/akademik/mahasiswa-baru" style={subLink}>
              Mahasiswa Baru
            </NavLink>
          </div>
        )}

        <NavLink to="/akademik/lulusan" style={mainLink}>
          Lulusan
        </NavLink>

        {/* Pelaporan dropdown */}
        <button
          type="button"
          style={groupBtn}
          onClick={() => setOpenPelaporan((v) => !v)}
        >
          <span>Pelaporan</span>
          {caret(openPelaporan)}
        </button>

        {openPelaporan && (
          <div style={{ display: "grid", gap: 3, marginTop: 2, marginBottom: 6 }}>
            <NavLink to="/akademik/pelaporan/checkpoint-1" style={subLink}>
              Checkpoint 1
            </NavLink>
            <NavLink to="/akademik/pelaporan/checkpoint-2" style={subLink}>
              Checkpoint 2
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: 14,
          borderTop: "1px solid #e5e7eb",
          color: "#64748b",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        Universitas Pattimura © 2026
      </div>
    </aside>
  );
}
