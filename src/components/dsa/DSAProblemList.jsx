import React, { useState } from 'react';
import { Search, Filter, Code2, AlertCircle, PlayCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DSA_PROBLEMS } from '../../data/dsaProblems';

const DIFF_COLORS = {
    'Easy': 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    'Medium': 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    'Hard': 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
};

export default function DSAProblemList({ onSelectProblem, solvedProblems = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    
    // Extract unique topics for potential future topic filtering
    const allTopics = [...new Set(DSA_PROBLEMS.flatMap(p => p.topic.split(', ')))];
    const [topicFilter, setTopicFilter] = useState('All');

    const filteredProblems = DSA_PROBLEMS.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
        const matchesTopic = topicFilter === 'All' || p.topic.includes(topicFilter);
        return matchesSearch && matchesDiff && matchesTopic;
    });

    return (
        <div className="max-w-6xl mx-auto w-full animate-fade-in space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none flex-1 md:flex-none cursor-pointer"
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        
                        <select
                            value={topicFilter}
                            onChange={(e) => setTopicFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none flex-1 md:flex-none cursor-pointer"
                        >
                            <option value="All">All Topics</option>
                            {allTopics.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                                <th className="pb-4 font-semibold pl-4">Status</th>
                                <th className="pb-4 font-semibold">Title</th>
                                <th className="pb-4 font-semibold">Difficulty</th>
                                <th className="pb-4 font-semibold hidden md:table-cell">Topics</th>
                                <th className="pb-4 font-semibold text-right pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.length > 0 ? (
                                filteredProblems.map((problem) => {
                                    const isSolved = solvedProblems.includes(problem.id);
                                    return (
                                        <tr 
                                            key={problem.id} 
                                            className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                            onClick={() => onSelectProblem(problem)}
                                        >
                                            <td className="py-4 pl-4">
                                                {isSolved ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                                                )}
                                            </td>
                                            <td className="py-4 font-bold text-gray-900 dark:text-white">{problem.id}. {problem.title}</td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${DIFF_COLORS[problem.difficulty]}`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td className="py-4 hidden md:table-cell">
                                                <div className="flex flex-wrap gap-1">
                                                    {problem.topic.split(', ').slice(0, 2).map((t, idx) => (
                                                        <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded text-xs">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    {problem.topic.split(', ').length > 2 && (
                                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded text-xs">
                                                            +{problem.topic.split(', ').length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <button className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end w-full font-semibold text-sm">
                                                    Solve <ChevronRight className="w-4 h-4 ml-1" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 dark:text-gray-400">
                                        <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                        <p>No problems found matching your filters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
