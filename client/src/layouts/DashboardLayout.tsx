import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#243027]">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="lg:pl-[246px]">
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-76px)] bg-[#f7f5ef]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;