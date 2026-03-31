import React, { useState } from 'react';
import { HR_QUESTIONS } from '../../data/hrQuestions';
import { ChevronDown, ChevronUp, User, Briefcase, MessageCircle, AlertTriangle, ShieldCheck, Lightbulb } from 'lucide-react';

export default function HRQuestions() {
    const [expandedIds, setExpandedIds] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['All', ...new Set(HR_QUESTIONS.map(q => q.category))];
    const filteredQuestions = filterCategory === 'All' ? HR_QUESTIONS : HR_QUESTIONS.filter(q => q.category === filterCategory);

    const toggleAccordion = (id) => {
        setExpandedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getIcon = (category) => {
        switch(category) {
            case 'Introduction': return <User className="w-5 h-5 text-blue-500" />;
            case 'Strengths & Weaknesses': return <ShieldCheck className="w-5 h-5 text-green-500" />;
            case 'Conflict Handling': return <MessageCircle className="w-5 h-5 text-red-500" />;
            case 'Failure Stories': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'Leadership': return <Lightbulb className="w-5 h-5 text-amber-500" />;
            default: return <Briefcase className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1 overflow-x-auto whitespace-nowrap hide-scrollbar mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setFilterCategory(cat)} 
                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-all shadow-sm ${
                            filterCategory === cat 
                            ? 'bg-rose-500 text-white border-transparent' 
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:border-rose-200 dark:hover:border-rose-900'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredQuestions.map(item => {
                        const isExpanded = expandedIds.includes(item.id);
                        return (
                            <div key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                <button 
                                    className="w-full text-left p-6 flex items-start justify-between gap-4 focus:outline-none"
                                    onClick={() => toggleAccordion(item.id)}
                                >
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 dark:bg-gray-800 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                            {getIcon(item.category)}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg leading-snug mb-1">
                                                {item.question}
                                            </h4>
                                            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                                                {item.category}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className={`mt-2 shrink-0 p-1.5 rounded-full transition-transform duration-300 ${isExpanded ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-4 md:px-6 pb-6 pt-0 md:ml-[3.5rem] border-t border-gray-50 dark:border-gray-800/10">
                                        <div className="mt-4 md:mt-6 bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-3 md:p-4 rounded-r-xl">
                                            <h5 className="text-green-800 dark:text-green-400 font-bold mb-2 uppercase text-[10px] md:text-xs tracking-wider">Ideal Sample Answer</h5>
                                            <p className="text-gray-700 dark:text-gray-300 ml-1 leading-relaxed text-sm italic">"{item.sampleAnswer}"</p>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h5 className="text-gray-900 dark:text-white font-bold mb-3 uppercase text-[10px] md:text-xs tracking-wider">Pro Tips</h5>
                                            <ul className="space-y-1.5 md:space-y-2">
                                                {item.tips.map((tip, idx) => (
                                                    <li key={idx} className="flex gap-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">
                                                        <span className="text-rose-500 font-bold shrink-0">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
