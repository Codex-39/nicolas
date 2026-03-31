import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import { Menu, X } from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 relative">

      {/* ── MOBILE: Dark Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── LEFT SIDEBAR ── */}
      {/* Desktop: always visible; Mobile: drawer that slides in */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button – mobile only */}
        <button
          className="absolute top-4 right-4 z-50 p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-6">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
            NICOLAS
          </span>
          {/* Spacer to center the logo */}
          <div className="w-10" />
        </div>

        <Outlet />
      </main>

      {/* ── RIGHT PANEL (hidden on mobile/tablet) ── */}
      <aside className="hidden xl:block w-72 shrink-0">
        <RightPanel />
      </aside>

    </div>
  );
}
