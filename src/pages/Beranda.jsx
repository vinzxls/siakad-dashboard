import unpattiLogo from "../assets/unpatti-logo.png";

export default function Beranda() {
  return (
    <div style={{ margin: "-20px -24px" }}>
      {/* Hero Section */}
      <div className="u-hero">
        <img src={unpattiLogo} alt="UNPATTI" />
        <div className="u-hero__title">DASHBOARD</div>
        <div className="u-hero__subtitle">Universitas Pattimura</div>

        <div className="u-hero__welcome">
          <strong>Selamat Datang</strong>
          <span>
            Dashboard Warehouse UNPATTI merupakan pusat visualisasi data universitas
            untuk monitoring dan pengambilan keputusan. Gunakan menu di sebelah kiri
            untuk mengakses data akademik.
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#0b2545",
          color: "#fff",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          opacity: 0.9,
        }}
      >
        <span>Universitas Pattimura | Ambon, Indonesia</span>
        <span>Dashboard Warehouse © 2026</span>
      </div>
    </div>
  );
}
