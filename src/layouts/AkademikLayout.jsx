import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/UnpattiTopbar";
import "../styles/unpatti.css";

export default function AkademikLayout() {
  return (
    <div className="u-app">
      <Sidebar />
      <div className="u-content">
        <Topbar />
        <div className="u-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
