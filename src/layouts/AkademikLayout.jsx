import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/UnpattiTopbar";
import "../styles/unpatti.css";

export default function AkademikLayout() {
  return (
    <div className="unpatti-app">
      <Sidebar />
      <div className="unpatti-content">
        <Topbar />
        <div className="unpatti-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
