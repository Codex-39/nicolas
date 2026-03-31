import { useState, useEffect } from 'react';
import { GATE_SYLLABUS } from '../data/mockData';
import { GATE_2025_SET_1 } from '../data/gate2025set1';
import MockTestInterface from '../components/MockTestInterface';
import { BookOpen, CheckCircle, XCircle, ArrowRight, Play, History, Trophy, Target, BarChart3, Eye, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HISTORY_KEY = 'nicolas_gate_attempt_history';

function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export default function GatePrep() {
    const { t } = useLanguage();
    // steps: selection, dashboard, test, result, review, history
    const [step, setStep] = useState('selection');
    const [branch, setBranch] = useState('CSE');
    const [resultData, setResultData] = useState(null);
    const [attemptHistory, setAttemptHistory] = useState(loadHistory());
    const [reviewAttempt, setReviewAttempt] = useState(null);
    const [expandedHistoryId, setExpandedHistoryId] = useState(null);

    const branches = ['CSE', 'ECE', 'MECH', 'CIVIL'];
    const syllabus = GATE_SYLLABUS[branch] || GATE_SYLLABUS['CSE'];

    // Available mock tests
    const mockTests = [
        { id: 'gate-2025-set-1', name: 'GATE 2025 Set 1', questions: GATE_2025_SET_1, duration: 180, totalMarks: 100 }
    ];

    const handleStartTest = () => {
        setStep('test');
    };

    const handleTestComplete = (data) => {
        setResultData(data);
        // Save to history
        const entry = {
            id: Date.now(),
            testName: 'GATE 2025 Set 1',
            date: new Date().toISOString(),
            score: data.score,
            totalMaxMarks: data.totalMaxMarks,
            correct: data.correct,
            incorrect: data.incorrect,
            unattempted: data.unattempted,
            sectionStats: data.sectionStats,
            responses: data.responses,
            status: data.status
        };
        const updatedHistory = [entry, ...attemptHistory];
        setAttemptHistory(updatedHistory);
        saveHistory(updatedHistory);
        setStep('result');
    };

    const handleReviewAttempt = (attempt) => {
        setReviewAttempt(attempt);
        setStep('review');
    };

    const handleDeleteAttempt = (id) => {
        const updated = attemptHistory.filter(a => a.id !== id);
        setAttemptHistory(updated);
        saveHistory(updated);
    };

    // Render full test interface
    if (step === 'test') {
        return (
            <MockTestInterface
                testName="GATE 2025 — Computer Science (Set 1)"
                questions={GATE_2025_SET_1}
                onComplete={handleTestComplete}
            />
        );
    }

    return (
        <div className="space-y-8 transition-colors duration-300">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('gatePreparation')}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{t('crackGate')}</p>
            </header>

            {/* Branch Selection */}
            {step === 'selection' && (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 max-w-xl mx-auto text-center shadow-sm">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('selectBranch')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {branches.map(b => (
                            <button
                                key={b}
                                onClick={() => { setBranch(b); setStep('dashboard'); }}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400 font-bold transition-all text-gray-700 dark:text-gray-300"
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Dashboard View */}
            {step === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Syllabus Card */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {t('syllabusTracker')}
                                </h2>
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-bold">{branch}</span>
                            </div>
                            <div className="space-y-4">
                                {syllabus.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.topic}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.weightage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mock Tests List */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Available Mock Tests
                            </h2>
                            <div className="space-y-4">
                                {mockTests.map(test => {
                                    const pastAttempts = attemptHistory.filter(a => a.testName === test.name);
                                    const bestScore = pastAttempts.length > 0 ? Math.max(...pastAttempts.map(a => parseFloat(a.score))) : null;
                                    return (
                                        <div key={test.id} className="p-5 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{test.name}</h3>
                                                    <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span>{test.questions.length} Questions</span>
                                                        <span>{test.duration} Minutes</span>
                                                        <span>{test.totalMarks} Marks</span>
                                                    </div>
                                                    {bestScore !== null && (
                                                        <div className="mt-2 text-sm">
                                                            <span className="text-green-600 dark:text-green-400 font-semibold">Best: {bestScore}/{test.totalMarks}</span>
                                                            <span className="text-gray-400 mx-2">·</span>
                                                            <span className="text-gray-500">{pastAttempts.length} attempt{pastAttempts.length > 1 ? 's' : ''}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleStartTest}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shrink-0"
                                                >
                                                    <Play className="w-4 h-4 fill-current" /> Start
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Attempt History */}
                        {attemptHistory.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <History className="w-5 h-5 text-orange-500" /> Attempt History
                                </h2>
                                <div className="space-y-3">
                                    {attemptHistory.map((attempt) => (
                                        <div key={attempt.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setExpandedHistoryId(expandedHistoryId === attempt.id ? null : attempt.id)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${parseFloat(attempt.score) >= 33 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                        {parseFloat(attempt.score) >= 33 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 dark:text-white">{attempt.testName}</span>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(attempt.date).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{attempt.score}/{attempt.totalMaxMarks}</span>
                                                    {expandedHistoryId === attempt.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </div>
                                            </button>
                                            {expandedHistoryId === attempt.id && (
                                                <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="grid grid-cols-3 gap-3 my-3">
                                                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                                                            <div className="text-xl font-bold text-green-600">{attempt.correct}</div>
                                                            <div className="text-xs text-gray-500">Correct</div>
                                                        </div>
                                                        <div className="text-center p-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                                            <div className="text-xl font-bold text-red-500">{attempt.incorrect}</div>
                                                            <div className="text-xs text-gray-500">Incorrect</div>
                                                        </div>
                                                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <div className="text-xl font-bold text-gray-600 dark:text-gray-300">{attempt.unattempted}</div>
                                                            <div className="text-xs text-gray-500">Unattempted</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-3">
                                                        <button onClick={() => handleReviewAttempt(attempt)} className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center gap-1.5">
                                                            <Eye className="w-4 h-4" /> Review Answers
                                                        </button>
                                                        <button onClick={() => handleDeleteAttempt(attempt.id)} className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm font-semibold">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-purple-600 dark:bg-purple-700 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">{t('readyToTest')}</h3>
                            <p className="text-purple-100 text-sm mb-6">{t('takeMockTest')}</p>
                            <button
                                onClick={handleStartTest}
                                className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-current" /> {t('startMockTest')}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">{t('studyStatistics')}</h3>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>{t('topicsCovered')}</span>
                                <span className="font-bold text-gray-900 dark:text-white">12/45</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <p className="text-xs text-center text-gray-400 dark:text-gray-500">{t('keepStudying')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Result Screen */}
            {step === 'result' && resultData && (
                <ResultView
                    data={resultData}
                    questions={GATE_2025_SET_1}
                    onBack={() => setStep('dashboard')}
                    onReview={() => {
                        setReviewAttempt({ responses: resultData.responses });
                        setStep('review');
                    }}
                />
            )}

            {/* Review Screen */}
            {step === 'review' && reviewAttempt && (
                <ReviewView
                    questions={GATE_2025_SET_1}
                    responses={reviewAttempt.responses}
                    onBack={() => setStep('dashboard')}
                />
            )}
        </div>
    );
}

/* ─── Result View ─────────────────────────────────────────── */
function ResultView({ data, questions, onBack, onReview }) {
    const totalMax = data.totalMaxMarks;
    const pct = ((parseFloat(data.score) / totalMax) * 100).toFixed(1);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Hero Score */}
            <div className="text-center py-8">
                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <Trophy className="w-14 h-14 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Test Completed!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Here is your performance report</p>
                <div className="text-6xl font-black text-purple-600 dark:text-purple-400 mb-1">{data.score}<span className="text-3xl text-gray-400">/{totalMax}</span></div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{pct}% Score</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 p-5 rounded-2xl text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-600">{data.correct}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Correct</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-5 rounded-2xl text-center">
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-500">{data.incorrect}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Incorrect</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">{data.unattempted}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Unattempted</div>
                </div>
            </div>

            {/* Section-wise Performance */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" /> Section-wise Performance
                </h3>
                <div className="space-y-4">
                    {data.sectionStats && Object.entries(data.sectionStats).map(([section, stats]) => {
                        const sectionQs = questions.filter(q => q.section === section);
                        const sectionMax = sectionQs.reduce((sum, q) => sum + q.marks, 0);
                        const barPct = sectionMax > 0 ? Math.max(0, (stats.score / sectionMax) * 100) : 0;
                        return (
                            <div key={section}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{section === 'GA' ? 'General Aptitude' : 'Computer Science'}</span>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">{stats.score.toFixed(2)}/{sectionMax}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${barPct}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={onReview} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    <Eye className="w-5 h-5" /> Review Answers
                </button>
                <button onClick={onBack} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Back to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

/* ─── Review View ─────────────────────────────────────────── */
function ReviewView({ questions, responses, onBack }) {
    const [filterSection, setFilterSection] = useState('ALL');
    const sections = ['ALL', ...Array.from(new Set(questions.map(q => q.section)))];

    const filtered = filterSection === 'ALL' ? questions : questions.filter(q => q.section === filterSection);

    const getResult = (q) => {
        const ans = responses[q.id];
        const hasAnswered = ans !== undefined && ans !== '' && (!Array.isArray(ans) || ans.length > 0);
        if (!hasAnswered) return 'unattempted';

        if (q.type === 'MCQ') return ans === q.correct_answer ? 'correct' : 'incorrect';
        if (q.type === 'MSQ') {
            const correctArr = [...(q.correct_answers || [])].sort();
            const userArr = [...ans].sort();
            return JSON.stringify(correctArr) === JSON.stringify(userArr) ? 'correct' : 'incorrect';
        }
        if (q.type === 'NAT') {
            const val = parseFloat(ans);
            const [min, max] = q.answer_range;
            return val >= min && val <= max ? 'correct' : 'incorrect';
        }
        return 'unattempted';
    };

    const resultStyles = {
        correct: 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10',
        incorrect: 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10',
        unattempted: 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50'
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Answer Review</h2>
                <button onClick={onBack} className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 flex items-center gap-1">
                    ← Back to Dashboard
                </button>
            </div>

            {/* Section Filters */}
            <div className="flex gap-2">
                {sections.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setFilterSection(sec)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${filterSection === sec ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        {sec === 'ALL' ? 'All' : sec}
                    </button>
                ))}
            </div>

            {/* Questions Review */}
            <div className="space-y-4">
                {filtered.map((q, idx) => {
                    const result = getResult(q);
                    const userAns = responses[q.id];
                    const globalIdx = questions.findIndex(qq => qq.id === q.id);
                    return (
                        <div key={q.id} className={`p-5 rounded-2xl border-2 ${resultStyles[result]} transition-colors`}>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-2 py-0.5 rounded text-sm">Q{globalIdx + 1}</span>
                                    <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">{q.type} · {q.section}</span>
                                    <span className="text-xs font-medium text-gray-500">({q.marks} marks)</span>
                                </div>
                                <div>
                                    {result === 'correct' && <span className="flex items-center gap-1 text-sm text-green-600 font-bold"><CheckCircle className="w-4 h-4" /> Correct ✓</span>}
                                    {result === 'incorrect' && <span className="flex items-center gap-1 text-sm text-red-500 font-bold"><XCircle className="w-4 h-4" /> Incorrect ✗</span>}
                                    {result === 'unattempted' && <span className="text-sm text-gray-400 font-bold">Unattempted</span>}
                                </div>
                            </div>

                            {/* Question Text */}
                            <p className="text-gray-900 dark:text-white font-medium mb-4">{q.question}</p>

                            {(q.question.toLowerCase().includes('image') || q.question.toLowerCase().includes('figure')) && (
                                <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                                    Refer to the given figure.
                                </div>
                            )}

                            {/* Options Review for MCQ/MSQ */}
                            {(q.type === 'MCQ' || q.type === 'MSQ') && q.options && (
                                <div className="space-y-2">
                                    {Object.entries(q.options).map(([key, value]) => {
                                        const isCorrectAnswer = q.type === 'MCQ' ? key === q.correct_answer : (q.correct_answers || []).includes(key);
                                        const isUserAnswer = q.type === 'MCQ' ? userAns === key : Array.isArray(userAns) && userAns.includes(key);

                                        let optStyle = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900';
                                        if (isCorrectAnswer) optStyle = 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-600';
                                        if (isUserAnswer && !isCorrectAnswer) optStyle = 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600';

                                        return (
                                            <div key={key} className={`flex items-center justify-between p-3 border rounded-xl ${optStyle}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-600 dark:text-gray-300">{key}.</span>
                                                    <span className="text-gray-800 dark:text-gray-200">{value}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                                                    {isCorrectAnswer && <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">Correct</span>}
                                                    {isUserAnswer && <span className={`${isCorrectAnswer ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-500 bg-red-100 dark:bg-red-900/30'} px-2 py-0.5 rounded`}>Your Answer</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* NAT Review */}
                            {q.type === 'NAT' && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Your answer: <strong className={result === 'correct' ? 'text-green-600' : 'text-red-500'}>{userAns !== undefined && userAns !== '' ? userAns : '—'}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Correct range: <strong className="text-green-600">{q.answer_range[0]} – {q.answer_range[1]}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="text-center py-6">
                <button onClick={onBack} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
