import React from 'react';
import { Database, Server, Network, Code, LayoutDashboard, ChevronRight } from 'lucide-react';

const TOPICS = [
    { id: 'dbms', title: 'DBMS', desc: 'Database Management Systems, SQL/NoSQL, Normalization', icon: Database, color: 'blue' },
    { id: 'os', title: 'Operating Systems', desc: 'Processes, Threads, Scheduling, Memory Management', icon: Server, color: 'emerald' },
    { id: 'cn', title: 'Computer Networks', desc: 'OSI Model, TCP/IP, Routing, Security Basics', icon: Network, color: 'purple' },
    { id: 'oops', title: 'OOPs', desc: 'Object-Oriented Programming, Principles, Design Patterns', icon: Code, color: 'orange' }
];

const COLORS = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-500',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-500',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-500',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-500',
};

export default function CoreSubjects({ onSelectTopic, onSelectProjects }) {
    return (
        <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">Core Computer Science</h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 px-4 md:px-0">Master the fundamental theoretical concepts often tested in technical interviews and prepare to discuss your practical project experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TOPICS.map(topic => {
                    const IconComp = topic.icon;
                    const colorClasses = COLORS[topic.color];
                    // Extract base class (first class) to use as the badge color
                    const badgeBg = colorClasses.split(' ')[0];
                    const iconColor = colorClasses.split(' ')[2]; 
                    
                    return (
                        <div 
                            key={topic.id} 
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all group flex flex-col h-full cursor-pointer"
                            onClick={() => onSelectTopic(topic)}
                        >
                            <div className="flex items-start gap-5 mb-4">
                                <div className={`w-14 h-14 ${badgeBg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                    <IconComp className={`w-7 h-7 ${iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{topic.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{topic.desc}</p>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-5">
                                <button className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl flex items-center justify-center transition-colors border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
                                    View Topics <ChevronRight className="w-4 h-4 ml-1.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12">
                <div 
                    onClick={onSelectProjects}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl text-white cursor-pointer transform hover:-translate-y-1 transition-all overflow-hidden relative group"
                >
                     <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Project Explanation Tool</h3>
                            <p className="text-indigo-100 max-w-xl">Use our AI assistant to generate clear, structured explanations for your resume projects, along with potential interview questions.</p>
                        </div>
                        <button className="whitespace-nowrap bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-md flex items-center">
                            Start Prep <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
