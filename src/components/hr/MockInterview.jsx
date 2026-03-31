import React, { useState, useEffect } from 'react';
import { HR_QUESTIONS } from '../../data/hrQuestions';
import { Bot, Mic, Play, Square, Loader2, FastForward, CheckCircle, BarChart, RefreshCcw } from 'lucide-react';

export default function MockInterview({ onBack }) {
    const [started, setStarted] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [currentText, setCurrentText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Filter to pick just 3 questions for the mock interview
    const interviewQuestions = HR_QUESTIONS.slice(0, 3);

    const handleSubmit = () => {
        if (!currentText.trim()) return;
        
        setAnswers(prev => ({
            ...prev,
            [currentIdx]: currentText
        }));

        setIsThinking(true);
        setTimeout(() => {
            setIsThinking(false);
            setCurrentText('');
            if (currentIdx < interviewQuestions.length - 1) {
                setCurrentIdx(prev => prev + 1);
            } else {
                setIsFinished(true);
            }
        }, 1500);
    };

    if (!started) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-10 max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6">
                    <Bot className="w-8 h-8 md:w-12 md:h-12 text-rose-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Simulated HR Interview</h3>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mb-8">
                    Practice your behavioral responses in a high-pressure, realistic setting. Our AI interviewer will ask you 3 critical questions and evaluate your clarity and structure.
                </p>
                <button 
                    onClick={() => setStarted(true)}
                    className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-xl md:rounded-2xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 text-base md:text-lg"
                >
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" /> Start Interview
                </button>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Complete</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Here is a breakdown of your communication performance based on the STAR method.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <h3 className="text-blue-800 dark:text-blue-300 font-bold mb-2 flex items-center gap-2"><BarChart className="w-5 h-5"/> Confidence Score</h3>
                        <p className="text-5xl font-black text-blue-600 dark:text-blue-400">85<span className="text-2xl text-blue-400/50">/100</span></p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <h3 className="text-purple-800 dark:text-purple-300 font-bold mb-2 flex items-center gap-2"><Mic className="w-5 h-5"/> Clarity Score</h3>
                        <p className="text-5xl font-black text-purple-600 dark:text-purple-400">92<span className="text-2xl text-purple-400/50">/100</span></p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Breakdown</h3>
                    {interviewQuestions.map((q, idx) => (
                        <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Q{idx + 1}. {q.question}</h4>
                            <div className="space-y-4 text-sm bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                <div>
                                    <span className="text-gray-500 font-bold block mb-1">Your Answer:</span>
                                    <p className="text-gray-700 dark:text-gray-300 italic">"{answers[idx]}"</p>
                                </div>
                                <div className="border-t border-rose-100 dark:border-rose-900/30 pt-3">
                                    <span className="text-rose-600 dark:text-rose-400 font-bold block mb-1">AI Feedback:</span>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Good context. However, try to frame it using the STAR format. You mentioned the situation, but the exact actions you took were slightly vague. Next time, focus 50% of your answer on your specific actions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-4">
                    <button onClick={onBack} className="flex items-center gap-2 font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <RefreshCcw className="w-5 h-5" /> Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const question = interviewQuestions[currentIdx];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in flex flex-col min-h-[500px]">
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
                {interviewQuestions.map((_, idx) => (
                    <div key={idx} className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <div 
                            className={`h-full bg-rose-500 transition-all duration-500 ${idx <= currentIdx ? 'w-full' : 'w-0'}`} 
                        ></div>
                    </div>
                ))}
            </div>

            {/* AI Interviewer Pane */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 md:p-8 shadow-lg relative mb-4 md:mb-6">
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-500 animate-pulse"></div> Active Recording
                </div>
                
                <div className="flex gap-4 md:gap-6 items-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 dark:bg-rose-900/30 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800/50">
                        <Bot className="w-6 h-6 md:w-8 md:h-8 text-rose-600" />
                    </div>
                    <div className="min-w-0 pr-12 md:pr-0">
                        <h4 className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 md:mb-2 italic">AI Interviewer</h4>
                        <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white leading-tight md:leading-snug">
                            {isThinking ? (
                                <span className="flex items-center gap-3 text-gray-500"><Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> Analyzing response...</span>
                            ) : (
                                `"${question.question}"`
                            )}
                        </h2>
                    </div>
                </div>
            </div>

            {/* User Input Area */}
            {!isThinking && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 md:p-6 shadow-sm flex-1 flex flex-col">
                    <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 md:mb-4 flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" /> Your Response
                    </label>
                    <textarea 
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        placeholder="Type out your response here..."
                        className="flex-1 w-full min-h-[150px] md:min-h-0 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white p-4 md:p-6 font-medium text-base md:text-lg focus:ring-2 focus:ring-rose-500 outline-none resize-none mb-4 md:mb-6 shadow-inner"
                        autoFocus
                    />
                    <div className="flex justify-end pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button 
                            onClick={handleSubmit}
                            disabled={!currentText.trim()}
                            className="bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            Next <FastForward className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
