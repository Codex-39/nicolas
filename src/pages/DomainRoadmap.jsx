import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BRANCH_DATA } from '../data/mockData';
import { useLearning } from '../context/LearningContext';
import { ArrowLeft, CheckCircle, PlayCircle, Trophy, ListTodo, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DomainRoadmap() {
    const { branchId, domainId } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { enrolledDomains, addTodo, toggleTodo } = useLearning();

    const branch = BRANCH_DATA[branchId];
    const domain = branch?.domains.find(d => d.id === domainId);
    const roadmap = domain?.chapters || [];
    const myProgress = enrolledDomains[domainId] || { completedChapters: [], todoList: [] };

    if (!domain) return <div className="p-12 text-center text-gray-500">Domain not found.</div>;

    const allCompleted = roadmap.length > 0 && roadmap.every(chapter => myProgress.completedChapters.includes(chapter.id));

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
            <button onClick={() => navigate('/domain-selection')} className="flex items-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Selection
            </button>

            <header className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">{branch?.fullName}</div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{domain.name} <span className="text-blue-500">Roadmap</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">{domain.description}</p>
                </div>

                {allCompleted && (
                    <Link
                        to={`/domain-test/${branchId}/${domainId}`}
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Trophy className="w-5 h-5" /> TAKE DOMAIN END TEST
                    </Link>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {roadmap.map((chapter, index) => {
                        const isCompleted = myProgress.completedChapters.includes(chapter.id);
                        const isUnlocked = index === 0 || myProgress.completedChapters.includes(roadmap[index - 1].id);

                        return (
                            <div
                                key={chapter.id}
                                className={`
                                    relative p-6 rounded-2xl border-2 transition-all
                                    ${isCompleted ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
                                        isUnlocked ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800' :
                                            'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60 grayscale cursor-not-allowed'}
                                `}
                            >
                                <div className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold
                                            ${isCompleted ? 'bg-green-500 text-white' :
                                                isUnlocked ? 'bg-blue-500 text-white' :
                                                    'bg-gray-300 dark:bg-gray-700 text-white'}
                                        `}>
                                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                                        </div>
                                        {index !== roadmap.length - 1 && (
                                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 min-h-[50px] mt-2"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{chapter.topic}</h3>
                                            {isCompleted && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">CHAPTER BADGE EARNED 🎖️</span>}
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{chapter.desc}</p>

                                        {isUnlocked ? (
                                            <div className="pt-4">
                                                <Link
                                                    to={`/chapter/${branchId}/${domainId}/${chapter.id}`}
                                                    className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                                                >
                                                    <PlayCircle className="w-4 h-4" />
                                                    {isCompleted ? 'Revise Content' : 'Start Learning'}
                                                </Link>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-red-500 font-semibold mt-2">Complete previous chapter to unlock</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <ListTodo className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Domain To-Do</h2>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.target.todo;
                            if (input.value.trim()) {
                                addTodo(domainId, input.value);
                                input.value = '';
                            }
                        }} className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    name="todo"
                                    placeholder="Add task..."
                                    className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </form>

                        <ul className="mt-6 space-y-3">
                            {myProgress.todoList?.map(task => (
                                <li
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl group"
                                >
                                    <button
                                        onClick={() => toggleTodo(domainId, task.id)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}
                                    >
                                        {task.completed && <CheckCircle className="w-3 h-3" />}
                                    </button>
                                    <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {task.text}
                                    </span>
                                </li>
                            ))}
                            {(!myProgress.todoList || myProgress.todoList.length === 0) && (
                                <li className="text-center py-4 text-gray-400 text-sm">No tasks added yet.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
