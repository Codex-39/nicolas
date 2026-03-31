import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BRANCH_DATA } from '../data/mockData';
import htmlBasicsQuestions from '../data/html_basics_questions.json';
import advancedHtmlQuestions from '../data/advanced_html_questions.json';
import cssBasicsQuestions from '../data/css_basics_questions.json';
import flexboxGridQuestions from '../data/flexbox_grid_questions.json';
import javascriptBasicsQuestions from '../data/javascript_basics_questions.json';
import advancedJavascriptQuestions from '../data/advanced_javascript_questions.json';
import reactQuestions from '../data/react_questions.json';
import nodeJsQuestions from '../data/node_js_questions.json';
import expressJsQuestions from '../data/express_js_questions.json';
import mongodbQuestions from '../data/mongodb_questions.json';
import mlFoundationsQuestions from '../data/ml_foundations_questions.json';
import mlAlgorithmsQuestions from '../data/ml_algorithms_questions.json';
import mlAdvancedQuestions from '../data/ml_advanced_questions.json';
import { useLearning } from '../context/LearningContext';
import { useNotifications } from '../context/NotificationContext';
import { CheckCircle, XCircle, AlertTriangle, Brain, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ChapterTest() {
    const { branchId, domainId, chapterId } = useParams();
    const navigate = useNavigate();
    const { completeChapter, logActivity } = useLearning();
    const { addNotification } = useNotifications();

    const branch = BRANCH_DATA[branchId];
    const domain = branch?.domains.find(d => d.id === domainId);
    const chapter = domain?.chapters.find(c => c.id === chapterId);

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Load and randomize questions once per attempt
    const chapterQuestions = useMemo(() => {
        let pool = [];
        if (chapterId === 'html-basics') {
            pool = [...htmlBasicsQuestions.questions];
        } else if (chapterId === 'advanced-html') {
            pool = [...advancedHtmlQuestions.questions];
        } else if (chapterId === 'css-basics') {
            pool = [...cssBasicsQuestions.questions];
        } else if (chapterId === 'flexbox-grid') {
            pool = [...flexboxGridQuestions.questions];
        } else if (chapterId === 'javascript-basics') {
            pool = [...javascriptBasicsQuestions.questions];
        } else if (chapterId === 'advanced-javascript') {
            pool = [...advancedJavascriptQuestions.questions];
        } else if (chapterId === 'react') {
            pool = [...reactQuestions.questions];
        } else if (chapterId === 'node-js') {
            pool = [...nodeJsQuestions.questions];
        } else if (chapterId === 'express-js') {
            pool = [...expressJsQuestions.questions];
        } else if (chapterId === 'mongodb') {
            pool = [...mongodbQuestions.questions];
        } else if (chapterId === 'ml-foundations') {
            pool = [...mlFoundationsQuestions.questions];
        } else if (chapterId === 'ml-algorithms') {
            pool = [...mlAlgorithmsQuestions.questions];
        } else if (chapterId === 'ml-advanced') {
            pool = [...mlAdvancedQuestions.questions];
        } else {
            return [];
        }

        // Shuffle and pick 10
        const shuffled = pool.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        // Shuffle options for each selected question
        return selected.map(q => {
            const optionsWithIndex = q.options.map((opt, i) => ({ text: opt, originalIndex: i }));
            const shuffledOptions = optionsWithIndex.sort(() => 0.5 - Math.random());
            return {
                ...q,
                shuffledOptions: shuffledOptions.map(o => o.text),
                correctShuffledIndex: shuffledOptions.findIndex(o => o.originalIndex === q.answer)
            };
        });
    }, [chapterId, submitted]); // Re-randomize when starting over (submitted toggles)

    const handleSubmit = () => {
        logActivity();
        let currentScore = 0;
        chapterQuestions.forEach((q, idx) => {
            if (answers[idx] === q.correctShuffledIndex) currentScore++;
        });

        const finalScore = Math.round((currentScore / chapterQuestions.length) * 100);
        setScore(finalScore);
        setSubmitted(true);

        if (finalScore >= 70) {
            completeChapter(domainId, chapterId, finalScore);
            addNotification(currentUser.email, {
                type: 'achievement',
                message: `Congratulations! You passed the ${chapter.topic} test with ${finalScore}%! 🏆`,
                title: 'Chapter Completed'
            });
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    if (!chapter) return <div className="p-12 text-center text-gray-500">Chapter not found.</div>;

    const getPerformanceInfo = (s) => {
        if (s >= 70) return { label: 'Passed', color: 'text-green-500', bg: 'bg-green-500', icon: <CheckCircle className="w-12 h-12" />, emoji: '🟩' };
        return { label: 'Failed', color: 'text-red-500', bg: 'bg-red-500', icon: <XCircle className="w-12 h-12" />, emoji: '🟥' };
    };

    if (submitted) {
        const perf = getPerformanceInfo(score);
        return (
            <div className="max-w-3xl mx-auto py-12 animate-fade-in text-center space-y-10">
                <div className="space-y-4">
                    <div className="flex justify-center">{perf.icon}</div>
                    <h1 className={`text-4xl font-extrabold ${perf.color}`}>{score >= 70 ? 'Passed!' : 'Try Again'}</h1>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">Your Score: {score}%</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Analysis</h3>
                    <div className="flex items-center gap-4 justify-center">
                        <div className={`px-4 py-2 rounded-full text-white font-bold ${perf.bg}`}>
                            {perf.emoji} {perf.label}
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {score >= 70
                            ? "Congratulations! You have passed the chapter and earned a badge. You can now proceed to the next chapter."
                            : "You didn't pass this time (Passing score: 70%). Revise the content and try again to unlock the next chapter."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(`/roadmap/${branchId}/${domainId}`)}
                        className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-10 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors shadow-md"
                    >
                        Return to Roadmap
                    </button>
                    {!(score >= 70) && (
                        <button
                            onClick={handleRetry}
                            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" /> Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 space-y-12 animate-fade-in pb-32">
            <header className="space-y-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm tracking-widest uppercase">
                    <Brain className="w-4 h-4" />
                    Chapter Assessment
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">{chapter.topic}</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">Complete this test to unlock the next chapter and earn your badge. Target: 70%</p>
            </header>

            <div className="space-y-8">
                {chapterQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Q{idx + 1}. {q.question}</h3>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${q.difficulty === 'hard' ? 'bg-red-100 text-red-600' :
                                q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                                }`}>
                                {q.difficulty}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {(q.shuffledOptions || q.options).map((opt, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => setAnswers({ ...answers, [idx]: optIdx })}
                                    className={`
                                        p-5 text-left rounded-2xl border-2 transition-all font-medium text-lg
                                        ${answers[idx] === optIdx
                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400'
                                            : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 text-gray-700 dark:text-gray-300'}
                                    `}
                                >
                                    <span className="mr-4 text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded shadow-sm">{String.fromCharCode(65 + optIdx)}</span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
                <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < chapterQuestions.length}
                    className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold text-xl shadow-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    SUBMIT CHAPTER TEST
                </button>
            </div>
        </div>
    );
}
