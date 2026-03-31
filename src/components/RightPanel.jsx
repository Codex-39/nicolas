import { Link } from "react-router-dom";
import { Flame, Calendar, Tag } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/LearningContext";

export default function RightPanel() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { streak, activeDays } = useLearning();

  // Helper to get initials
  // ... (getInitials remains same)
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <aside className="w-80 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 hidden lg:flex flex-col h-full p-8 font-sans transition-colors duration-300">

      {/* User Profile - Link to /profile */}
      <div className="flex flex-col items-center mb-10 text-center">
        <Link to="/profile" className="group">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mb-3 shadow-sm group-hover:scale-105 transition-transform duration-200 overflow-hidden border-2 border-white dark:border-gray-800">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors">{user.name}</h3>
        </Link>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      <div className="space-y-4">
        {/* Daily Streak - Link to /streak */}
        <Link to="/streak" className="block group">
          <div className="bg-[#FFF4F0] dark:bg-orange-900/10 rounded-2xl p-5 relative overflow-hidden border border-transparent group-hover:border-orange-200 dark:group-hover:border-orange-800 transition-colors">
            <div className="relative z-10">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dailyChallenge')}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{streak} days</span>
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Keep it up! 🚀</p>
            </div>
          </div>
        </Link>

        {/* ACTIVE DAYS */}
        <div className="rounded-2xl bg-green-50 dark:bg-green-900/10 p-4 flex items-center gap-3 shadow-sm">
          <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Active Days
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {activeDays} days
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total learning time
            </p>
          </div>
        </div>

        {/* INTERESTS */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 backdrop-blur p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Interests
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {t('webDevelopment')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              Machine Learning
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              {t('dataScience')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
