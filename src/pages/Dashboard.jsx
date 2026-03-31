console.log("✅ DASHBOARD IS RENDERING");
console.log("🔥 THIS DASHBOARD FILE IS LOADING 🔥");

import { Compass, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/LearningContext";

/* ================= FEATURE CARD ================= */
// ... (FeatureCard component remains same)
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  path,
  bg,
  iconBg,
  textColor,
  startColor,
}) => (
  <Link
    to={path}
    className={`
      relative rounded-3xl p-6
      ${bg}
      border border-gray-100 dark:border-gray-800
      shadow-sm transition-shadow duration-300
      hover:shadow-md block
    `}
  >
    {/* Icon */}
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iconBg}`}
    >
      <Icon className={`w-6 h-6 ${textColor}`} />
    </div>

    {/* Title */}
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
      {title}
    </h3>

    {/* Description */}
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-6 leading-relaxed">
      {description}
    </p>

    {/* Start */}
    <div className={`flex items-center text-sm font-semibold ${startColor}`}>
      Start Now
      <ArrowRight className="w-4 h-4 ml-1" />
    </div>
  </Link>
);

/* ================= DASHBOARD ================= */

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { enrolledDomains, badges } = useLearning();

  /* FEATURE CARDS */
  const cards = [
    {
      title: t("selectDomain"),
      description: t("choosePath"),
      icon: Compass,
      path: "/domain-selection",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-400",
      startColor: "text-blue-800 dark:text-blue-300",
    },
    {
      title: t("gatePrep"),
      description:
        "Structured plans, syllabus tracking, and mock tests to crack GATE confidently.",
      icon: GraduationCap,
      path: "/gate-prep",
      bg: "bg-green-50 dark:bg-green-900/10",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-400",
      startColor: "text-green-800 dark:text-green-300",
    },
    {
      title: t("interviewPrep"),
      description: t("aceInterviews"),
      icon: Briefcase,
      path: "/interview-prep",
      bg: "bg-orange-50 dark:bg-orange-900/10",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      textColor: "text-orange-700 dark:text-orange-400",
      startColor: "text-orange-800 dark:text-orange-300",
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {t("welcomeBack")} {user.name}! 👋
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl">
          {t("readyToLearn")}
        </p>
      </header>

      {/* LEARNING PROGRESS (ALWAYS SKY BLUE) */}
      <section
        className="
          rounded-3xl p-6
          bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100
          dark:from-blue-900/20 dark:via-sky-900/20 dark:to-blue-900/30
          border border-blue-100 dark:border-blue-900/40
          shadow-sm
        "
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <GraduationCap className="w-6 h-6 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              {t("progress")}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Consistency beats intensity 🚀
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/70 dark:bg-gray-800 rounded-2xl text-center">
            <div className="text-2xl font-black text-blue-600">
              {Object.keys(enrolledDomains).length}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">
              Domains Enrolled
            </div>
          </div>

          <div className="p-4 bg-white/70 dark:bg-gray-800 rounded-2xl text-center">
            <div className="text-2xl font-black text-purple-600">
              {badges.length}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">
              Badges Earned
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
          {t("continueLearning")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <FeatureCard key={index} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
