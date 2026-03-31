import React, { useState, useEffect } from 'react';
import { Clock, Calculator, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Code2 } from 'lucide-react';
import VirtualCalculator from './VirtualCalculator';
import CodeEditor from './CodeEditor';

const OA_HISTORY_KEY = 'nicolas_online_assessment_history';

export function loadOAHistory() {
    try { return JSON.parse(localStorage.getItem(OA_HISTORY_KEY)) || []; }
    catch { return []; }
}

export function saveOAHistory(history) {
    localStorage.setItem(OA_HISTORY_KEY, JSON.stringify(history));
}

export default function AssessmentInterface({ testName, questions, duration, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [showCalculator, setShowCalculator] = useState(false);
    const [activeSection, setActiveSection] = useState(() => questions[0]?.section || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [responses, setResponses] = useState({});
    const [statuses, setStatuses] = useState(
        questions.reduce((acc, q, idx) => {
            acc[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
            return acc;
        }, {})
    );

    const sections = Array.from(new Set(questions.map(q => q.section)));
    const currentQuestion = questions[currentIndex];

    // Persist responses to sessionStorage for refresh protection
    useEffect(() => {
        try { sessionStorage.setItem('oa_responses', JSON.stringify(responses)); } catch {}
    }, [responses]);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('oa_responses');
            if (saved) setResponses(JSON.parse(saved));
        } catch {}
    }, []);

    // Timer — use ref to always call submitTest with latest responses
    const responsesRef = React.useRef(responses);
    useEffect(() => { responsesRef.current = responses; }, [responses]);

    useEffect(() => {
        if (timeLeft <= 0) {
            // Auto-submit on timeout using latest snapshot via ref
            const responseSnapshot = { ...responsesRef.current };
            setIsSubmitting(true);
            submitTest(responseSnapshot);
            return;
        }
        const id = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(id);
    }, [timeLeft]);

    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const handleSectionChange = (sec) => {
        setActiveSection(sec);
        const idx = questions.findIndex(q => q.section === sec);
        if (idx >= 0) handleNavigate(idx);
    };

    // ─── Answer Handlers ─────────────────────────────────────
    const handleOptionSelect = (key) => {
        if (currentQuestion.type === 'MCQ') {
            setResponses({ ...responses, [currentQuestion.id]: key });
        } else if (currentQuestion.type === 'MSQ') {
            const cur = responses[currentQuestion.id] || [];
            const next = cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key];
            setResponses({ ...responses, [currentQuestion.id]: next });
        }
    };

    const handleNATChange = (e) => {
        setResponses({ ...responses, [currentQuestion.id]: e.target.value });
    };

    const handleCodeChange = (val) => {
        setResponses({ ...responses, [currentQuestion.id]: val });
    };

    // ─── Navigation ──────────────────────────────────────────
    const updateStatus = (id, s) => setStatuses(prev => ({ ...prev, [id]: s }));

    const hasAnswered = (qId) => {
        const ans = responses[qId];
        if (ans === undefined || ans === '') return false;
        if (Array.isArray(ans) && ans.length === 0) return false;
        if (typeof ans === 'object' && !Array.isArray(ans)) {
            // Coding: check if any language has code different from starter
            const q = questions.find(q => q.id === qId);
            if (q?.type === 'CODING') {
                const lang = ans._selectedLang || 'python';
                return ans[lang] && ans[lang] !== (q.starter_code?.[lang] || '');
            }
        }
        return true;
    };

    const handleNavigate = (newIdx) => {
        if (newIdx < 0 || newIdx >= questions.length) return;
        const curId = questions[currentIndex].id;
        if (statuses[curId] === 'not_visited') updateStatus(curId, 'not_answered');
        setCurrentIndex(newIdx);
        setActiveSection(questions[newIdx].section);
        if (statuses[questions[newIdx].id] === 'not_visited') updateStatus(questions[newIdx].id, 'not_answered');
    };

    const handleSaveNext = () => {
        updateStatus(currentQuestion.id, hasAnswered(currentQuestion.id) ? 'answered' : 'not_answered');
        handleNavigate(currentIndex + 1);
    };

    const handleClearResponse = () => {
        const next = { ...responses };
        delete next[currentQuestion.id];
        setResponses(next);
        updateStatus(currentQuestion.id, 'not_answered');
    };

    const handleMarkReviewNext = () => {
        updateStatus(currentQuestion.id, hasAnswered(currentQuestion.id) ? 'marked_answered' : 'marked');
        handleNavigate(currentIndex + 1);
    };

    const handleSubmitClick = () => {
        if (isSubmitting) return; // Guard: prevent double submission

        const unattemptedQs = questions.filter(q => !hasAnswered(q.id)).length;

        let msg = 'Are you sure you want to submit the test?';
        if (unattemptedQs > 0) {
            msg = `You still have ${unattemptedQs} unattempted questions.\n\nAre you sure you want to submit the test?`;
        }

        if (window.confirm(msg)) {
            // Snapshot responses synchronously — do NOT rely on state timing
            const responseSnapshot = { ...responses };

            setIsSubmitting(true);
            console.log("========== SUBMIT TEST TRIGGERED ==========");
            console.log("Response snapshot:", responseSnapshot);
            console.log("Statuses:", statuses);

            // Pass snapshot directly — no setTimeout, fully deterministic
            submitTest(responseSnapshot);
        }
    };

    // ─── Evaluation ──────────────────────────────────────────
    // Accepts a responseSnapshot to avoid reading from stale React state
    const submitTest = (responseSnapshot) => {
        console.log("========== STARTING EVALUATION ==========");
        let totalMarks = 0, correct = 0, incorrect = 0, unattempted = 0;
        const sectionStats = {};
        sections.forEach(s => (sectionStats[s] = { totalElements: 0, score: 0 }));
        const codingResults = [];

        // Helper scoped to the snapshot — avoids any stale closure on `responses`
        const snapshotHasAnswered = (qId) => {
            const ans = responseSnapshot[qId];
            if (ans === undefined || ans === '') return false;
            if (Array.isArray(ans) && ans.length === 0) return false;
            if (typeof ans === 'object' && !Array.isArray(ans)) {
                const q = questions.find(q => q.id === qId);
                if (q?.type === 'CODING') {
                    const lang = ans._selectedLang || 'python';
                    return ans[lang] && ans[lang] !== (q.starter_code?.[lang] || '');
                }
            }
            return true;
        };

        questions.forEach(q => {
            const ans = responseSnapshot[q.id];
            const answered = snapshotHasAnswered(q.id);
            sectionStats[q.section].totalElements++;

            console.log(`Evaluating ${q.id} (${q.type}) - Answered: ${answered}`, ans);

            if (!answered) { unattempted++; return; }

            if (q.type === 'MCQ') {
                if (ans === q.correct_answer) {
                    totalMarks += q.marks; sectionStats[q.section].score += q.marks; correct++;
                    console.log(`[${q.id}] MCQ Correct (+${q.marks})`);
                } else {
                    totalMarks -= q.negative_marks; sectionStats[q.section].score -= q.negative_marks; incorrect++;
                    console.log(`[${q.id}] MCQ Incorrect (-${q.negative_marks})`);
                }
            } else if (q.type === 'MSQ') {
                const ca = [...(q.correct_answers || [])].sort();
                const ua = [...(ans || [])].sort();
                if (JSON.stringify(ca) === JSON.stringify(ua)) {
                    totalMarks += q.marks; sectionStats[q.section].score += q.marks; correct++;
                    console.log(`[${q.id}] MSQ Correct (+${q.marks})`);
                } else {
                    incorrect++;
                    console.log(`[${q.id}] MSQ Incorrect (0)`);
                }
            } else if (q.type === 'NAT') {
                const val = parseFloat(ans);
                const [lo, hi] = q.answer_range;
                if (val >= lo && val <= hi) {
                    totalMarks += q.marks; sectionStats[q.section].score += q.marks; correct++;
                    console.log(`[${q.id}] NAT Correct (+${q.marks})`);
                } else {
                    incorrect++;
                    console.log(`[${q.id}] NAT Incorrect (0)`);
                }
            } else if (q.type === 'CODING') {
                const passed = ans?._passedCount || 0;
                const total = ans?._totalCount || q.test_cases?.length || 1;
                const ratio = total > 0 ? passed / total : 0;
                const earned = +(q.marks * ratio).toFixed(2);

                totalMarks += earned; sectionStats[q.section].score += earned;
                if (ratio === 1) correct++; else if (passed > 0) correct++; else incorrect++;

                codingResults.push({ id: q.id, question: q.question, passed, total, earned, maxMarks: q.marks });
                console.log(`[${q.id}] CODING Evaluated - Passed: ${passed}/${total}, Earned: ${earned}`);
            }
        });

        console.log("Evaluation Results:", { totalMarks, correct, incorrect, unattempted, codingResults });

        sessionStorage.removeItem('oa_responses');

        onComplete({
            score: totalMarks.toFixed(2),
            correct, incorrect, unattempted,
            totalMaxMarks: questions.reduce((s, q) => s + q.marks, 0),
            sectionStats,
            responses: responseSnapshot,  // pass snapshot, not stale state
            status: statuses,
            codingResults
        });
    };

    // ─── Helpers ──────────────────────────────────────────────
    const getCount = (st) => Object.values(statuses).filter(s => s === st).length;
    const getStatusColor = (st) => {
        switch (st) {
            case 'answered': return 'bg-green-500 text-white';
            case 'not_answered': return 'bg-red-500 text-white';
            case 'not_visited': return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            case 'marked': return 'bg-purple-600 text-white';
            case 'marked_answered': return 'bg-purple-600 text-white';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    const isCoding = currentQuestion.type === 'CODING';

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] max-h-screen border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-md font-sans">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3 md:p-4 bg-indigo-600 dark:bg-indigo-800 text-white shadow-md z-10">
                <div className="font-bold text-base md:text-xl truncate">{testName}</div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowCalculator(!showCalculator)} className="flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-500 px-3 py-1 rounded text-sm transition-colors" title="Calculator">
                        <Calculator className="w-4 h-4" /> <span className="hidden md:inline">Calculator</span>
                    </button>
                    <div className="flex items-center gap-2 font-mono text-lg bg-gray-900/40 px-3 py-1 rounded">
                        <Clock className="w-4 h-4 text-yellow-300" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                {/* Left: Question */}
                <div className="flex flex-col flex-1 h-full min-w-0">
                    {/* Section Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-x-auto">
                        {sections.map(sec => (
                            <button key={sec} onClick={() => handleSectionChange(sec)}
                                className={`px-5 py-2.5 font-bold text-sm transition-colors whitespace-nowrap ${activeSection === sec ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white dark:bg-gray-900' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >{sec}</button>
                        ))}
                    </div>

                    {/* Question Header */}
                    <div className="px-6 py-2.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-3">
                            <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded text-xs">Q.{currentIndex + 1}</span>
                            <span className="uppercase tracking-wider text-xs flex items-center gap-1">
                                {isCoding && <Code2 className="w-3.5 h-3.5" />}
                                {currentQuestion.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="text-green-600 dark:text-green-400">+{currentQuestion.marks}</span>
                            {currentQuestion.negative_marks > 0 && <span className="text-red-500">-{currentQuestion.negative_marks}</span>}
                        </div>
                    </div>

                    {/* Question Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="text-base md:text-lg text-gray-900 dark:text-white font-medium leading-relaxed">
                            {currentQuestion.question}
                        </div>

                        {isCoding && currentQuestion.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">Description</p>
                                <p>{currentQuestion.description}</p>
                                {currentQuestion.constraints && (
                                    <>
                                        <p className="font-bold text-gray-800 dark:text-gray-200 mt-3 mb-1">Constraints</p>
                                        <pre className="text-xs whitespace-pre-wrap text-gray-500 dark:text-gray-400">{currentQuestion.constraints}</pre>
                                    </>
                                )}
                            </div>
                        )}

                        {/* MCQ / MSQ options */}
                        {(currentQuestion.type === 'MCQ' || currentQuestion.type === 'MSQ') && (
                            <div className="space-y-2.5 mt-4">
                                {Object.entries(currentQuestion.options).map(([key, value]) => {
                                    const checked = currentQuestion.type === 'MCQ'
                                        ? responses[currentQuestion.id] === key
                                        : (responses[currentQuestion.id] || []).includes(key);
                                    return (
                                        <label key={key} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${checked ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                                            <input
                                                type={currentQuestion.type === 'MCQ' ? 'radio' : 'checkbox'}
                                                name={`q-${currentQuestion.id}`}
                                                checked={checked}
                                                onChange={() => handleOptionSelect(key)}
                                                className={`mt-0.5 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 ${currentQuestion.type === 'MCQ' ? 'rounded-full' : 'rounded'}`}
                                            />
                                            <div className="ml-3">
                                                <span className="font-bold mr-1.5 text-gray-600 dark:text-gray-300">{key}.</span>
                                                <span className="text-gray-800 dark:text-gray-200">{value}</span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        {/* NAT */}
                        {currentQuestion.type === 'NAT' && (
                            <div className="max-w-sm mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your numerical answer:</label>
                                <input type="number" step="any" value={responses[currentQuestion.id] || ''} onChange={handleNATChange} placeholder="0.00"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        )}

                        {/* CODING */}
                        {isCoding && (
                            <div className="mt-4">
                                <CodeEditor
                                    question={currentQuestion}
                                    value={responses[currentQuestion.id]}
                                    onChange={handleCodeChange}
                                />
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex gap-2">
                            <button onClick={handleMarkReviewNext} className="px-3 py-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 font-semibold rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-xs whitespace-nowrap">Mark for Review & Next</button>
                            <button onClick={handleClearResponse} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xs whitespace-nowrap">Clear Response</button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleNavigate(currentIndex - 1)} disabled={currentIndex === 0} className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-xs disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                                <ArrowLeft className="w-3.5 h-3.5" /> Previous
                            </button>
                            <button onClick={handleSaveNext} className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs whitespace-nowrap">
                                Save & Next <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Palette */}
                <div className="w-full md:w-72 flex flex-col bg-gray-50 dark:bg-gray-900 h-52 md:h-full shrink-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800">
                    {/* Stats */}
                    <div className="p-3 grid grid-cols-2 gap-y-1.5 text-xs font-medium border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-1.5"><span className="w-5 h-5 flex items-center justify-center rounded bg-green-500 text-white text-[10px]">{getCount('answered')}</span> Answered</div>
                        <div className="flex items-center gap-1.5"><span className="w-5 h-5 flex items-center justify-center rounded bg-red-500 text-white text-[10px]">{getCount('not_answered')}</span> Not Answered</div>
                        <div className="flex items-center gap-1.5"><span className="w-5 h-5 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px]">{getCount('not_visited')}</span> Not Visited</div>
                        <div className="flex items-center gap-1.5"><span className="w-5 h-5 flex items-center justify-center rounded bg-purple-600 text-white text-[10px]">{getCount('marked') + getCount('marked_answered')}</span> Marked</div>
                    </div>

                    {/* Section Label */}
                    <div className="px-3 py-2 font-bold text-xs bg-indigo-100 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 border-b border-gray-200 dark:border-gray-800 shrink-0">
                        {activeSection} Questions
                    </div>

                    {/* Palette Grid */}
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="grid grid-cols-5 gap-1.5">
                            {questions.map((q, idx) => {
                                if (q.section !== activeSection) return null;
                                return (
                                    <button key={q.id} onClick={() => handleNavigate(idx)}
                                        className={`w-9 h-9 flex items-center justify-center rounded font-bold text-xs transition-transform hover:scale-105 ${getStatusColor(statuses[q.id])} ${idx === currentIndex ? 'ring-3 ring-indigo-300 dark:ring-indigo-600/50' : ''}`}
                                    >{idx + 1}</button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
                        <button onClick={handleSubmitClick} disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                            {isSubmitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </div>
            </div>

            {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
        </div>
    );
}
