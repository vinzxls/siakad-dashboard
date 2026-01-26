import Sidebar from "../components/Sidebar";
import Topbar from "../components/UnpattiTopbar";

export default function DashboardLayout({children}){
  return(
    <div className="dashboard-root">
      <Sidebar/>
      <div className="dashboard-main">
        <Topbar/>
        {children}
      </div>
    </div>
  );
}
