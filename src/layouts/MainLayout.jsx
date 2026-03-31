import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

      {/* LEFT SIDEBAR */}
      <aside className="w-64">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-8 py-6">
        <Outlet />
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-72">
        <RightPanel />
      </aside>

    </div>
  );
}
