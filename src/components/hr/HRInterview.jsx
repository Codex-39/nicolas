import React, { useState } from 'react';
import { Users, BookOpen, Bot, FileText, ChevronRight } from 'lucide-react';
import HRQuestions from './HRQuestions';
import MockInterview from './MockInterview';
import ResumeAnalyzer from './ResumeAnalyzer';

export default function HRInterview({ onBack }) {
    const [activeTab, setActiveTab] = useState('questions');

    const tabs = [
        { id: 'questions', name: 'Behavioral Prep', icon: BookOpen, component: <HRQuestions /> },
        { id: 'mock', name: 'AI Mock Interview', icon: Bot, component: <MockInterview onBack={() => setActiveTab('questions')}/> },
        { id: 'resume', name: 'Resume Analyzer', icon: FileText, component: <ResumeAnalyzer /> }
    ];

    return (
        <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">HR & Behavioral Interview Prep</h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 px-4">Master the STAR method, anticipate culture-fit questions, and practice your delivery with our AI simulator.</p>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex bg-gray-50 dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mx-auto max-w-3xl overflow-x-auto whitespace-nowrap hide-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-400 shadow-md transform scale-[1.02]' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                        <tab.icon className="w-5 h-5 flex-shrink-0" />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Active Content rendering */}
            <div className="pt-6 relative min-h-[500px]">
                {tabs.find(t => t.id === activeTab)?.component}
            </div>
        </div>
    );
}
