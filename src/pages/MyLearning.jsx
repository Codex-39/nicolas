import React from 'react';
import { BookOpen, PlayCircle, BarChart2, Rocket, Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLearning } from '../context/LearningContext';
import { BRANCH_DATA } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function MyLearning() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { enrolledDomains, badges } = useLearning();

    const enrolledList = Object.values(enrolledDomains);

    return (
        <div className="space-y-8 animate-fade-in transition-colors duration-300">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('myLearning')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t('learningDesc') || 'Track your courses and progress.'}</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{badges.length} Badges</span>
                    </div>
                </div>
            </header>

            {enrolledList.length === 0 ? (
                <div className="p-20 text-center bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">No active learning paths</h2>
                    <p className="text-gray-500 mb-6">Start your journey by picking a domain.</p>
                    <button onClick={() => navigate('/domain-selection')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Pick Your Domain</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledList.map(item => {
                        const branch = BRANCH_DATA[item.branchId];
                        const domain = branch?.domains.find(d => d.id === item.id);
                        const totalChapters = domain?.chapters?.length || 0;
                        const progressPercent = totalChapters > 0 ? (item.completedChapters.length / totalChapters) * 100 : 0;

                        return (
                            <div key={item.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                        {branch?.shortName}
                                    </span>
                                    {item.isCompleted && <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full flex items-center gap-1"><Trophy className="w-3 h-3" /> Completed</span>}
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{domain?.name || item.id}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-6">{domain?.description}</p>

                                <div className="flex items-center gap-4 text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">
                                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <BookOpen className="w-4 h-4 text-blue-500" /> {item.completedChapters.length}/{totalChapters} Chapters
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                            <span>Progress</span>
                                            <span className="text-blue-500">{Math.round(progressPercent)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/roadmap/${item.branchId}/${item.id}`)}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg"
                                    >
                                        <PlayCircle className="w-5 h-5" /> Resume Path
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
