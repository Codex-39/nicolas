import React from 'react';
import { Server, Database, Activity, RefreshCw, ChevronRight, LayoutTemplate } from 'lucide-react';
import { SYSTEM_DESIGN_CASES } from '../../data/systemDesign';

export default function SystemDesign({ onSelectCaseStudy }) {
    const diffColor = {
        'Beginner': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800',
        'Intermediate': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        'Advanced': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800'
    };

    return (
        <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Server className="w-6 h-6 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">System Design Simulator</h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 px-4">Master the art of designing scalable, highly available systems by walking through real-world FAANG-level interview case studies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SYSTEM_DESIGN_CASES.map(study => (
                    <div 
                        key={study.id} 
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full cursor-pointer"
                        onClick={() => onSelectCaseStudy(study)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                                <LayoutTemplate className="w-6 h-6 text-indigo-500" />
                            </div>
                            <span className={`px-3 py-1 font-bold text-xs rounded-full border ${diffColor[study.difficulty]}`}>
                                {study.difficulty}
                            </span>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{study.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{study.description}</p>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <Activity className="w-4 h-4" /> {study.estimatedTime}
                            </span>
                            <button className="text-indigo-600 dark:text-indigo-400 opacity-80 group-hover:opacity-100 font-bold text-sm tracking-wide flex items-center">
                                Start Case <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><RefreshCw className="w-6 h-6 text-indigo-400" /> New to System Design?</h3>
                        <p className="text-indigo-200">Start with the Beginner case study (URL Shortener) to understand the basics of load balancing and database scaling.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
