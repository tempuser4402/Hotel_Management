
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <main className="ml-67 min-h-screen overflow-x-hidden p-6">

        {/* Selected page renders here */}
        <Outlet />

      </main>

    </div>
  );
}
