import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Code2, AlertTriangle, PlayCircle, Terminal, HelpCircle, CheckCircle2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';

export default function DSAWorkspace({ problem, onBack, onComplete }) {
    const [editorValue, setEditorValue] = useState({});
    const [activeLeftTab, setActiveLeftTab] = useState('description');

    // CodeEditor already manages "running" state internally and returns results through onChange
    const handleCodeChange = (newValue) => {
        setEditorValue(newValue);
        
        // If a submission was run, CodeEditor updates _passedCount and _totalCount
        if (newValue._totalCount && newValue._passedCount === newValue._totalCount) {
             // Optional: Complete the problem logic
             // onComplete(problem.id);
        }
    };

    // Map `dsaProblems` properties to `CodeEditor` expected properties
    const mappedQuestion = {
        ...problem,
        starter_code: problem.starterCode,
        test_cases: problem.testCases.map(tc => ({
            input: tc.input,
            expected_output: tc.expected_output,
            is_sample: tc.is_sample
        }))
    };

    return (
        <div className="flex flex-col h-full md:h-[calc(100vh-120px)] animate-fade-in bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3 text-gray-900 dark:text-white truncate">
                            {problem.id}. {problem.title}
                            <span className={`shrink-0 text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-md border tracking-wide font-black ${
                                problem.difficulty === 'Easy' ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20' : 
                                problem.difficulty === 'Medium' ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' : 
                                'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'
                            }`}>
                                {problem.difficulty.toUpperCase()}
                            </span>
                        </h2>
                    </div>
                </div>
                
                {editorValue._totalCount && (
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono text-sm shadow-inner text-gray-700 dark:text-gray-300">
                        <Terminal className="w-4 h-4 text-gray-500" />
                        Result: 
                        <span className={`font-bold ${editorValue._passedCount === editorValue._totalCount ? 'text-green-500' : 'text-red-500'}`}>
                            {editorValue._passedCount}/{editorValue._totalCount}
                        </span>
                    </div>
                )}
            </div>

            {/* Main Content Split */}
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
                
                {/* Left Panel - Description & Hints */}
                <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shrink-0">
                    <div className="flex px-4 pt-4 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
                        <button 
                            onClick={() => setActiveLeftTab('description')}
                            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-colors border-b-2 ${
                                activeLeftTab === 'description' 
                                ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-800 rounded-t-lg' 
                                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-t-lg'
                            }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Description
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {activeLeftTab === 'description' && (
                            <div className="space-y-8 max-w-none prose prose-indigo dark:prose-invert">
                                {/* Problem Description */}
                                <div className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
                                    {problem.description}
                                </div>
                                
                                <hr className="border-gray-100 dark:border-gray-800" />

                                {/* Examples */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Code2 className="w-5 h-5 text-indigo-500" /> Examples
                                    </h3>
                                    <div className="space-y-4">
                                        {problem.examples.map((ex, idx) => (
                                            <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 shadow-sm">
                                                <div className="font-mono text-sm space-y-3">
                                                    <div className="flex">
                                                        <span className="text-gray-400 select-none w-20 shrink-0">Input:</span>
                                                        <span className="text-gray-800 dark:text-gray-200">{ex.input}</span>
                                                    </div>
                                                    <div className="flex">
                                                        <span className="text-gray-400 select-none w-20 shrink-0">Output:</span>
                                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{ex.output}</span>
                                                    </div>
                                                    {ex.explanation && (
                                                        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 font-sans text-sm">
                                                            {ex.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-gray-100 dark:border-gray-800" />

                                {/* Constraints */}
                                {problem.constraints && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Constraints
                                        </h3>
                                        <ul className="list-none space-y-2 p-0 m-0">
                                            {problem.constraints.map((c, idx) => (
                                                <li key={idx} className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg font-mono text-xs text-gray-700 dark:text-gray-300 inline-block mr-2 mb-2 border border-gray-100 dark:border-gray-700">
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className="w-full md:w-1/2 flex flex-col bg-[#1e1e1e] overflow-hidden min-h-[400px] md:min-h-0">
                    <div className="flex-1 p-2">
                         <div className="h-full rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10">
                            <CodeEditor 
                                question={mappedQuestion}
                                value={editorValue}
                                onChange={handleCodeChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
