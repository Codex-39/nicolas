import React, { useState } from 'react';
import { FileText, Send, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { RESUME_ANALYZER_PROMPTS } from '../../data/hrQuestions';

export default function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (!resumeText.trim()) return;

        setIsAnalyzing(true);
        
        // Simulating AI extraction
        setTimeout(() => {
            setResults(RESUME_ANALYZER_PROMPTS);
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto w-full space-y-8 animate-fade-in">
             <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl border border-indigo-800/50">
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                        <FileText className="w-8 h-8 md:w-12 md:h-12 text-indigo-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 tracking-tight">Resume & Project Analyzer</h2>
                        <p className="text-indigo-200 leading-relaxed max-w-xl text-sm md:text-lg opacity-90">
                            Paste your resume or project text. NICOLAS will predict high-probability interview questions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
                <form onSubmit={handleAnalyze}>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 px-2 tracking-wide uppercase">
                        <FileText className="w-4 h-4 text-purple-500" /> Input Text
                    </label>
                    <textarea 
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="e.g. Led a team of 4 to develop a full-stack dashboard..."
                        className="w-full h-40 md:h-48 p-4 md:p-6 bg-gray-50 dark:bg-gray-800 border-none rounded-xl md:rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-gray-900 outline-none resize-none transition-all leading-relaxed text-base md:text-lg"
                    />
                    <div className="flex justify-end mt-4 md:mt-6">
                        <button 
                            type="submit"
                            disabled={isAnalyzing || !resumeText.trim()}
                            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-xl md:rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 text-base md:text-lg"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Scanning Keywords...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    Generate Questions
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {results && (
                <div className="animate-slide-up space-y-6 pt-4">
                    <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4 px-2">
                        <AlertCircle className="w-6 h-6 text-purple-500" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Predicted Interview Questions</h3>
                    </div>
                    <div className="grid gap-4">
                        {results.map((q, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-900/50 p-6 border-l-4 border-purple-500 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group">
                                <span className="text-purple-300 dark:text-purple-800 font-black text-2xl leading-none mt-0.5 group-hover:text-purple-400 transition-colors">Q.</span>
                                <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">{q}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl mt-8">
                         <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">💡 Tip</h4>
                         <p className="text-indigo-800 dark:text-indigo-400 text-sm leading-relaxed">Prepare answers for these questions using the STAR framework. Ensure you can back up any metrics you claimed (like 'reduced by 40%') with the exact technical steps you took to achieve them.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
