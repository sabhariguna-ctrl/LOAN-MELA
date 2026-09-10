import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function Adminmain() {
  const [isSidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 1024
  );

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <>
      <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="bg-slate-50 min-h-screen">
        <div className={`w-full transition-all duration-300 pt-16 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-[72px]'}`}>
          <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}