import React, { useState, useEffect } from 'react';
import { Clock, Calculator, HelpCircle, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import VirtualCalculator from './VirtualCalculator';

export default function MockTestInterface({ testName, questions, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 mins
    const [showCalculator, setShowCalculator] = useState(false);
    const [activeSection, setActiveSection] = useState('GA');

    // Responses: key=question_id, value=answer (string, array of strings, or number)
    const [responses, setResponses] = useState({});
    
    // Status mapping: 'not_visited', 'not_answered', 'answered', 'marked', 'marked_answered'
    const [statuses, setStatuses] = useState(
        questions.reduce((acc, q, idx) => {
            acc[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
            return acc;
        }, {})
    );

    // Initial setup for sections
    const sections = Array.from(new Set(questions.map((q) => q.section)));
    const sectionQuestions = questions.filter((q) => q.section === activeSection);
    
    // Find the current question object
    const currentQuestion = questions[currentIndex];

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            submitTest();
            return;
        }
        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    // Format timer
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Handle section change
    const handleSectionChange = (section) => {
        setActiveSection(section);
        const firstQIdx = questions.findIndex(q => q.section === section);
        handleNavigate(firstQIdx);
    };

    // Answer handlers
    const handleOptionSelect = (optionKey) => {
        if (currentQuestion.type === 'MCQ') {
            setResponses({ ...responses, [currentQuestion.id]: optionKey });
        } else if (currentQuestion.type === 'MSQ') {
            const currentAns = responses[currentQuestion.id] || [];
            let newAns;
            if (currentAns.includes(optionKey)) {
                newAns = currentAns.filter(key => key !== optionKey);
            } else {
                newAns = [...currentAns, optionKey];
            }
            setResponses({ ...responses, [currentQuestion.id]: newAns });
        }
    };

    const handleNATChange = (e) => {
        setResponses({ ...responses, [currentQuestion.id]: e.target.value });
    };

    // Navigation and status handlers
    const updateStatus = (id, newStatus) => {
        setStatuses(prev => ({ ...prev, [id]: newStatus }));
    };

    const handleNavigate = (newIndex) => {
        if (newIndex < 0 || newIndex >= questions.length) return;
        
        // Mark current as not_answered if it was not_visited or untouched and not explicitly saved
        const currentId = questions[currentIndex].id;
        if (statuses[currentId] === 'not_visited' || statuses[currentId] === 'not_answered') {
            updateStatus(currentId, 'not_answered'); 
        }

        setCurrentIndex(newIndex);
        setActiveSection(questions[newIndex].section);
        
        // Mark new question as not_answered if it was not_visited
        const newId = questions[newIndex].id;
        if (statuses[newId] === 'not_visited') {
            updateStatus(newId, 'not_answered');
        }
    };

    const handleSaveNext = () => {
        const hasAnswered = 
            responses[currentQuestion.id] !== undefined && 
            responses[currentQuestion.id] !== '' && 
            (!Array.isArray(responses[currentQuestion.id]) || responses[currentQuestion.id].length > 0);

        if (hasAnswered) {
            updateStatus(currentQuestion.id, 'answered');
        } else {
            updateStatus(currentQuestion.id, 'not_answered');
        }
        handleNavigate(currentIndex + 1);
    };

    const handleClearResponse = () => {
        const newResponses = { ...responses };
        delete newResponses[currentQuestion.id];
        setResponses(newResponses);
        updateStatus(currentQuestion.id, 'not_answered');
    };

    const handleMarkReviewNext = () => {
        const hasAnswered = 
            responses[currentQuestion.id] !== undefined && 
            responses[currentQuestion.id] !== '' && 
            (!Array.isArray(responses[currentQuestion.id]) || responses[currentQuestion.id].length > 0);
            
        if (hasAnswered) {
            updateStatus(currentQuestion.id, 'marked_answered');
        } else {
            updateStatus(currentQuestion.id, 'marked');
        }
        handleNavigate(currentIndex + 1);
    };

    // Evaluation on Submit
    const submitTest = () => {
        let totalMarks = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;
        
        const sectionStats = {};
        sections.forEach(s => sectionStats[s] = { totalElements: 0, score: 0 });

        questions.forEach(q => {
            const ans = responses[q.id];
            const hasAnswered = ans !== undefined && ans !== '' && (!Array.isArray(ans) || ans.length > 0);
            
            sectionStats[q.section].totalElements++;

            if (!hasAnswered) {
                unattemptedCount++;
                return;
            }

            let isCorrect = false;

            if (q.type === 'MCQ') {
                isCorrect = ans === q.correct_answer;
                if (isCorrect) {
                    totalMarks += q.marks;
                    sectionStats[q.section].score += q.marks;
                    correctCount++;
                } else {
                    totalMarks -= q.negative_marks;
                    sectionStats[q.section].score -= q.negative_marks;
                    incorrectCount++;
                }
            } else if (q.type === 'MSQ') {
                const correctArr = [...(q.correct_answers || [])].sort();
                const userArr = [...ans].sort();
                isCorrect = JSON.stringify(correctArr) === JSON.stringify(userArr);
                
                if (isCorrect) {
                    totalMarks += q.marks;
                    sectionStats[q.section].score += q.marks;
                    correctCount++;
                } else {
                    // No negative marks for MSQ
                    incorrectCount++;
                }
            } else if (q.type === 'NAT') {
                const val = parseFloat(ans);
                const [min, max] = q.answer_range;
                isCorrect = val >= min && val <= max;
                
                if (isCorrect) {
                    totalMarks += q.marks;
                    sectionStats[q.section].score += q.marks;
                    correctCount++;
                } else {
                    // No negative marks for NAT
                    incorrectCount++;
                }
            }
        });

        onComplete({
            score: totalMarks.toFixed(2),
            correct: correctCount,
            incorrect: incorrectCount,
            unattempted: unattemptedCount,
            totalMaxMarks: questions.reduce((sum, q) => sum + q.marks, 0),
            sectionStats: sectionStats,
            responses: responses,
            status: statuses
        });
    };

    // Palette count helpers
    const getCount = (state) => Object.values(statuses).filter(s => s === state).length;

    // Palette color map
    const getStatusColor = (status) => {
        switch (status) {
            case 'answered': return 'bg-green-500 text-white';
            case 'not_answered': return 'bg-red-500 text-white';
            case 'not_visited': return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            case 'marked': return 'bg-purple-600 text-white';
            case 'marked_answered': return 'bg-purple-600 text-white relative after:content-[""] after:w-2 after:h-2 after:bg-green-400 after:rounded-full after:absolute after:bottom-1 after:right-1';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] max-h-screen border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-md font-sans">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3 md:p-4 bg-blue-600 dark:bg-blue-800 text-white shadow-md z-10">
                <div className="font-bold text-base md:text-xl truncate flex-1 mr-2">{testName}</div>
                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <button 
                        onClick={() => setShowCalculator(!showCalculator)} 
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-500 px-2 md:px-3 py-1 rounded transition-colors"
                        title="Virtual Calculator"
                    >
                        <Calculator className="w-4 h-4" /> <span className="hidden md:inline">Calculator</span>
                    </button>
                    <div className="flex items-center gap-1.5 md:gap-2 font-mono text-base md:text-xl bg-gray-900/40 px-2 md:px-3 py-1 rounded">
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
                
                {/* Left Column: Question Area */}
                <div className="flex flex-col flex-1 h-full max-h-full min-w-0">
                    {/* Section Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-x-auto">
                        {sections.map(sec => (
                            <button
                                key={sec}
                                onClick={() => handleSectionChange(sec)}
                                className={`px-6 py-3 font-bold transition-colors whitespace-nowrap outline-none ${
                                    activeSection === sec 
                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-white dark:bg-gray-900' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {sec}
                            </button>
                        ))}
                    </div>

                    {/* Question Header */}
                    <div className="px-4 md:px-6 py-2.5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">Q.{currentIndex + 1}</span>
                            <span className="uppercase tracking-wider">{currentQuestion.type}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-green-600 dark:text-green-400">Marks: +{currentQuestion.marks}</span>
                            {currentQuestion.negative_marks > 0 && <span className="text-red-500">-Negative: {currentQuestion.negative_marks}</span>}
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        <div className="text-lg md:text-xl text-gray-900 dark:text-white font-medium leading-relaxed">
                            {currentQuestion.question}
                        </div>
                        
                        {(currentQuestion.question.toLowerCase().includes('image') || currentQuestion.question.toLowerCase().includes('figure')) && (
                            <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 p-4 rounded-xl flex items-start gap-4 text-yellow-800 dark:text-yellow-300">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm">Refer to the given figure. (Image rendering not configured for this specific placeholder question).</p>
                            </div>
                        )}

                        <div className="mt-8">
                            {/* Render Options for MCQ/MSQ */}
                            {(currentQuestion.type === 'MCQ' || currentQuestion.type === 'MSQ') && (
                                <div className="space-y-3">
                                    {Object.entries(currentQuestion.options).map(([key, value]) => {
                                        const isChecked = currentQuestion.type === 'MCQ' 
                                            ? responses[currentQuestion.id] === key
                                            : (responses[currentQuestion.id] || []).includes(key);

                                        return (
                                            <label 
                                                key={key} 
                                                className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                                                    isChecked 
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500 dark:ring-blue-400' 
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                }`}
                                            >
                                                <input
                                                    type={currentQuestion.type === 'MCQ' ? 'radio' : 'checkbox'}
                                                    name={`q-${currentQuestion.id}`}
                                                    checked={isChecked}
                                                    onChange={() => handleOptionSelect(key)}
                                                    className={`mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 ${currentQuestion.type === 'MCQ' ? 'rounded-full' : 'rounded'}`}
                                                />
                                                <div className="ml-4">
                                                    <span className="font-bold mr-2 text-gray-700 dark:text-gray-300">{key}.</span> 
                                                    <span className="text-gray-800 dark:text-gray-200">{value}</span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Render NAT input */}
                            {currentQuestion.type === 'NAT' && (
                                <div className="max-w-sm">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your numerical answer:</label>
                                    <input 
                                        type="number"
                                        step="any"
                                        value={responses[currentQuestion.id] || ''}
                                        onChange={handleNATChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Use the virtual calculator if required to compute the final value.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={handleMarkReviewNext}
                                className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 font-semibold rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-sm whitespace-nowrap"
                            >
                                Mark for Review & Next
                            </button>
                            <button 
                                onClick={handleClearResponse}
                                className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm whitespace-nowrap"
                            >
                                Clear Response
                            </button>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                            <button 
                                onClick={() => handleNavigate(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                <ArrowLeft className="w-4 h-4" /> Previous
                            </button>
                            <button 
                                onClick={handleSaveNext}
                                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm whitespace-nowrap dropdown-toggle"
                            >
                                Save & Next <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information & Palette */}
                <div className="w-full md:w-80 flex flex-col bg-gray-50 dark:bg-gray-900 h-64 md:h-full shrink-0 border-t md:border-t-0 border-gray-200 dark:border-gray-800">
                    
                    {/* User Profile Dummy */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-gray-950">
                        <div className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=Candidate`} alt="avatar" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white truncate">Candidate</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Roll: GATE25XXXXX</div>
                        </div>
                    </div>

                    {/* Stats Legend */}
                    <div className="p-4 grid grid-cols-2 gap-y-2 text-xs font-medium border-b border-gray-200 dark:border-gray-800 overflow-y-auto max-h-40">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded bg-green-500 text-white shrink-0">{getCount('answered')}</span>
                            <span className="text-gray-700 dark:text-gray-300 leading-tight">Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded bg-red-500 text-white shrink-0">{getCount('not_answered')}</span>
                            <span className="text-gray-700 dark:text-gray-300 leading-tight">Not Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 shrink-0">{getCount('not_visited')}</span>
                            <span className="text-gray-700 dark:text-gray-300 leading-tight">Not Visited</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded bg-purple-600 text-white shrink-0">{getCount('marked')}</span>
                            <span className="text-gray-700 dark:text-gray-300 leading-tight">Marked for Review</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded bg-purple-600 text-white relative after:content-[''] after:w-1.5 after:h-1.5 after:bg-green-400 after:rounded-full after:absolute after:bottom-1 after:right-1 shrink-0">{getCount('marked_answered')}</span>
                            <span className="text-gray-700 dark:text-gray-300 leading-tight">Answered & Marked for Review</span>
                        </div>
                    </div>

                    {/* Question Palette Header */}
                    <div className="px-4 py-2 pr-2 font-bold text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200 border-y border-gray-200 dark:border-gray-800 flex justify-between items-center shrink-0">
                        <span>{activeSection} Questions</span>
                    </div>

                    {/* Question Palette Grid */}
                    <div className="flex-1 overflow-y-auto p-4 content-start">
                        <div className="grid grid-cols-5 md:grid-cols-4 gap-2">
                            {questions.map((q, idx) => {
                                if (q.section !== activeSection) return null;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => handleNavigate(idx)}
                                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded font-bold text-sm transition-transform hover:scale-105 active:scale-95 ${getStatusColor(statuses[q.id])} ${idx === currentIndex ? 'ring-4 ring-blue-300 dark:ring-blue-600/50 outline-none' : ''}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Final Submit Button */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
                        <button 
                            onClick={() => {
                                if(confirm('Are you sure you want to submit the test?')) submitTest();
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>
            </div>

            {/* Virtual Calculator Overlay */}
            {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
        </div>
    );
}
