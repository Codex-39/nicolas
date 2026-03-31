import { ArrowLeft, Flame, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useLearning } from '../context/LearningContext';

const StreakGraph = () => {
    const { t } = useLanguage();
    const { activityHistory } = useLearning();

    // Generate dates for the last 371 days (53 weeks) to fill the grid properly
    const today = new Date();
    const dates = [];

    // Find the start date (Sunday of the week 52 weeks ago)
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    const startDay = startDate.getDay(); // 0 is Sunday
    startDate.setDate(startDate.getDate() - startDay);

    for (let i = 0; i < 371; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        dates.push({
            date: dateStr,
            displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            isActive: activityHistory.includes(dateStr)
        });
    }

    const getColor = (isActive) => {
        return isActive
            ? 'bg-green-500 dark:bg-green-500 hover:scale-125'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';
    };

    return (
        <div className="bg-white dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto transition-colors">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    {t('daysOfLearning')}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{t('less')}</span>
                    <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span>{t('more')}</span>
                </div>
            </div>

            <div className="flex gap-1.5 min-w-max pb-4">
                {/* Render columns (weeks) */}
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1.5">
                        {/* 7 days per week */}
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const dateData = dates[weekIndex * 7 + dayIndex];
                            if (!dateData) return null;

                            return (
                                <div
                                    key={dayIndex}
                                    className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 cursor-pointer relative group ${getColor(dateData.isActive)}`}
                                >
                                    {/* Custom Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                        {dateData.isActive ? `Learned on: ${dateData.displayDate}` : `No activity: ${dateData.displayDate}`}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function StreakPage() {
    const { t } = useLanguage();
    const { streak, longestStreak, activeDays } = useLearning();

    return (
        <div className="space-y-10 animate-fade-in transition-colors duration-300 pb-12">
            <div className="flex items-center gap-2 text-sm text-blue-500 font-medium cursor-pointer hover:underline">
                <ArrowLeft className="w-4 h-4" />
                <Link to="/">{t('backToDashboard')}</Link>
            </div>

            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Flame className="w-4 h-4" />
                    Consistency is Power
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                    {t('dailyStreak')}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl">{t('consistencyKey')}</p>
            </header>

            {/* Current Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-3xl text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group">
                    <Flame className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="text-5xl font-black">{streak}</div>
                        <div className="text-sm font-bold uppercase tracking-widest mt-2">{t('currentStreak')}</div>
                        <p className="text-orange-100 text-xs mt-4">Day {streak}. You're on fire! 🔥</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{longestStreak}</div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-2">{t('longestStreak')}</div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: `${Math.min((streak / (longestStreak || 1)) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-4xl font-black text-purple-600 dark:text-purple-400">{activeDays}</div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-2">{t('totalActiveDays')}</div>
                    <p className="text-xs text-gray-500 mt-4">Building a legendary legacy.</p>
                </div>
            </div>

            {/* The Graph */}
            <StreakGraph />
        </div>
    );
}
