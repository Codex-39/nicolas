import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, CheckCircle, Code, ListPlus, HelpCircle, Loader2 } from 'lucide-react';

export default function ProjectPrep({ onBack }) {
    const [projectDesc, setProjectDesc] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!projectDesc.trim()) return;

        setIsGenerating(true);
        setResult(null);

        // Simulate API call for AI generation
        setTimeout(() => {
            setResult({
                explanation: "The project is a comprehensive solution that leverages modern web technologies to solve a specific user problem. It clearly demonstrates full-stack capabilities, particularly focusing on responsive design and efficient data handling. The architecture implies a strong understanding of component-based UI and decoupled backend services.",
                features: [
                    "User Authentication & Authorization (JWT based)",
                    "Real-time data synchronization using WebSockets",
                    "Responsive Dashboard with Data Visualization",
                    "RESTful API integration with error handling"
                ],
                techStack: "React, Node.js, Express, MongoDB, Tailwind CSS",
                questions: [
                    "Why did you choose React over other frameworks for this project?",
                    "How did you handle state management across complex components?",
                    "Can you explain how you ensured the security of user data?",
                    "What was the most challenging bug you faced during development and how did you resolve it?"
                ]
            });
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto w-full animate-fade-in space-y-6">
             <button 
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 font-semibold"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Core Subjects
            </button>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex gap-6 items-center flex-col md:flex-row">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Project Explanation Tool</h2>
                        <p className="text-indigo-100 leading-relaxed text-sm md:text-base max-w-2xl">
                            Paste a brief description of your resume project below. Our AI will analyze it and generate an elevator pitch, key highlights, and likely interview questions you should prepare for.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <form onSubmit={handleGenerate}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Project Description
                    </label>
                    <textarea 
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        placeholder="e.g., A full-stack e-commerce application built with React, Node.js, and MongoDB. Includes a shopping cart, Stripe integration for payments, and an admin dashboard for inventory management..."
                        className="w-full h-40 p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4 leading-relaxed"
                    />
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            disabled={isGenerating || !projectDesc.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Generate Analysis
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            {result && (
                <div className="mt-8 space-y-6 animate-slide-up">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Analysis Results
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Elevator Pitch */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl md:col-span-2">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2 text-lg">
                                <Sparkles className="w-5 h-5" /> Elevated Explanation
                            </h4>
                            <p className="text-blue-900 dark:text-blue-100 leading-relaxed">
                                {result.explanation}
                            </p>
                        </div>

                        {/* Tech Stack & Features */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl h-full shadow-sm">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Code className="w-5 h-5 text-indigo-500" /> Key Tech Stack
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.techStack.split(', ').map((tech, idx) => (
                                        <span key={idx} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-semibold border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl h-full shadow-sm">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ListPlus className="w-5 h-5 text-emerald-500" /> Highlight Features
                            </h4>
                            <ul className="space-y-3">
                                {result.features.map((feature, idx) => (
                                    <li key={idx} className="flex gap-2 text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Likely Questions */}
                        <div className="md:col-span-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-8 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-6 flex items-center gap-2 text-xl">
                                <HelpCircle className="w-6 h-6" /> Possible Interview Questions
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {result.questions.map((q, idx) => (
                                    <div key={idx} className="bg-white dark:bg-gray-900/50 p-4 border border-amber-100 dark:border-amber-800/40 rounded-xl hover:shadow-md transition-shadow group flex items-start gap-4">
                                         <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
                                            {idx + 1}
                                         </div>
                                        <p className="text-amber-950 dark:text-amber-100 font-medium leading-normal">{q}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
