import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  MessageSquare,
  Users,
  Moon,
  Sun,
  LogOut,
  LogIn,
  Languages,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const navItems = [
  { name: "dashboard", path: "/", icon: LayoutDashboard },
  { name: "inbox", path: "/inbox", icon: Inbox },
  { name: "friends", path: "/friends", icon: Users },
  { name: "groupDiscussions", path: "/discussions", icon: MessageSquare },
  { name: "myLearning", path: "/learning", icon: BookOpen },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "ta", label: "Tamil" },
  { code: "ml", label: "Malayalam" },
  { code: "kn", label: "Kannada" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { logout, isLoggedIn } = useAuth();
  const { unreadCount } = useNotifications();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const isDark = theme === "dark";

  return (
    <aside className="w-64 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-4 py-6 flex flex-col transition-colors duration-300 overflow-y-auto">

      {/* LOGO */}
      <div className="flex items-center justify-center mb-8 mt-2 lg:mt-0">
        <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
          NICOLAS
        </h1>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-1 flex-1">
        {navItems.map(({ name, path, icon: Icon }) => {
          const itemBadge = name === "inbox" && unreadCount > 0 ? unreadCount : null;

          return (
            <NavLink
              key={name}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-gray-700"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
                }`
              }
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  location.pathname === path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                }`}
              />
              <span className="flex-1 truncate">{t(name)}</span>
              {itemBadge && (
                <span className="text-[10px] font-black bg-red-600 text-white min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full shadow-lg shadow-red-500/30">
                  {itemBadge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* SETTINGS SECTION */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t("settings")}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 text-gray-400 shrink-0" />
          )}
          <span className="truncate">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all"
          >
            <Languages className="w-5 h-5 text-purple-500 shrink-0" />
            <span className="flex-1 text-left truncate">
              {LANGUAGES.find((l) => l.code === language)?.label}
            </span>
          </button>

          {showLangMenu && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 max-h-48 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    language === lang.code
                      ? "text-blue-600 font-bold"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Login / Logout */}
        <button
          onClick={() => {
            if (isLoggedIn) {
              logout();
              navigate("/login");
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isLoggedIn
              ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          }`}
        >
          {isLoggedIn ? (
            <LogOut className="w-5 h-5 shrink-0" />
          ) : (
            <LogIn className="w-5 h-5 shrink-0" />
          )}
          <span className="truncate">{isLoggedIn ? t("logout") : "Login"}</span>
        </button>
      </div>
    </aside>
  );
}
