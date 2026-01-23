import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "#f5f6f8",
      }}
    >
      <Sidebar />

      <main style={{ flex: 1, width: "100%", overflowX: "hidden" }}>
        <header
          style={{
            height: 56,
            background: "#ffffff",
            borderBottom: "1px solid #e6e6e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            fontWeight: 800,
          }}
        >
          <div>Dashboard Warehouse</div>
          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
            DASHBOARD UNPATTI
          </div>
        </header>

        <div style={{ padding: 16 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
