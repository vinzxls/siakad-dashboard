import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: isActive ? "#ffffff" : "#111827",
  background: isActive ? "#2563eb" : "transparent",
  fontWeight: isActive ? 800 : 600,
});

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        background: "#ffffff",
        borderRight: "1px solid #e6e6e6",
        padding: 12,
      }}
    >
      <div style={{ fontWeight: 900, margin: "8px 10px 16px" }}>SIAKAD DWH</div>

      <div style={{ margin: "10px 10px 6px", fontSize: 12, color: "#6b7280" }}>
        MENU
      </div>

      <nav style={{ display: "grid", gap: 6 }}>
        <NavLink to="/beranda" style={linkStyle}>
          Beranda
        </NavLink>

        <NavLink to="/mahasiswa-baru" style={linkStyle}>
          Mahasiswa Baru
        </NavLink>
        <NavLink to="/total-pendaftar" style={linkStyle}>
          Total Pendaftar
        </NavLink>

        <NavLink to="/mahasiswa-aktif" style={linkStyle}>
          Mahasiswa Aktif
        </NavLink>

        <div style={{ marginTop: 10, marginLeft: 10, fontSize: 12, color: "#6b7280" }}>
          Penerimaan
        </div>
        <NavLink to="/snbp" style={linkStyle}>
          SNBP
        </NavLink>
        <NavLink to="/snbt" style={linkStyle}>
          SNBT
        </NavLink>
        <NavLink to="/mandiri" style={linkStyle}>
          Mandiri
        </NavLink>

        <div style={{ marginTop: 10, marginLeft: 10, fontSize: 12, color: "#6b7280" }}>
          Lainnya
        </div>
        <NavLink to="/kelulusan" style={linkStyle}>
          Kelulusan
        </NavLink>
        <NavLink to="/prestasi" style={linkStyle}>
          Prestasi
        </NavLink>
        <NavLink to="/afirmasi" style={linkStyle}>
          Afirmasi
        </NavLink>
      </nav>
    </aside>
  );
}
