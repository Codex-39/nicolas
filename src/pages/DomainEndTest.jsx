import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BRANCH_DATA } from '../data/mockData';
import { useLearning } from '../context/LearningContext';
import { Trophy, Timer, Calculator, Rocket, AlertCircle, RefreshCcw, ArrowLeft, CheckCircle } from 'lucide-react';

export default function DomainEndTest() {
    const { branchId, domainId } = useParams();
    const navigate = useNavigate();
    const { completeDomain } = useLearning();

    const branch = BRANCH_DATA[branchId];
    const domain = branch?.domains.find(d => d.id === domainId);

    const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Generate 50 questions for the end test
    const [questions] = useState(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        question: `Complex Question #${i + 1} for ${domain?.name || 'Domain'}: Deep assessment of core concepts and practical application.`,
        options: ["Option A: Industry Standard Approach", "Option B: Optimized Alternative", "Option C: Legacy Method", "Option D: Experimental Theory"],
        correct: Math.floor(Math.random() * 4)
    })));

    useEffect(() => {
        if (timeLeft <= 0 && !submitted) {
            handleSubmit();
        }
        if (!submitted && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, submitted]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) correctCount++;
        });

        setScore(correctCount);
        setSubmitted(true);

        if (correctCount >= 20) {
            completeDomain(domainId, correctCount);
        }
    };

    if (!domain) return <div className="p-12 text-center text-gray-500">Domain not found.</div>;

    if (submitted) {
        const isPassed = score >= 20;
        const isRocket = score >= 45;

        return (
            <div className="max-w-4xl mx-auto py-12 animate-fade-in text-center space-y-12 pb-24">
                <div className="space-y-6">
                    {isRocket ? <Rocket className="w-24 h-24 text-blue-500 mx-auto animate-bounce" /> :
                        isPassed ? <Trophy className="w-24 h-24 text-yellow-500 mx-auto" /> :
                            <AlertCircle className="w-24 h-24 text-red-500 mx-auto" />}

                    <h1 className={`text-5xl font-black ${isPassed ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
                        {isRocket ? "UNSTOPPABLE! 🚀" : isPassed ? "CONGRATULATIONS!" : "NOT QUITE THERE"}
                    </h1>
                    <p className="text-3xl font-bold text-blue-600">Final Score: {score} / 50</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl space-y-8 max-w-2xl mx-auto">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Performance Summary</h3>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-4 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${(score / 50) * 100}%` }}></div>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        {isRocket ? `You have mastered ${domain.name} with an exceptional score! The special Rocket Badge has been awarded to your profile for your outstanding performance.` :
                            isPassed ? `You have successfully completed the ${domain.name} specialization and earned your Completion Badge. You can now showcase this achievement on your profile.` :
                                `You need at least 20/50 to pass this domain. Don't worry, you can retake the test. Focus on the core concepts you missed and try again.`}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isPassed ? (
                            <button
                                onClick={() => navigate('/learning')}
                                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg"
                            >
                                GO TO MY LEARNING
                            </button>
                        ) : (
                            <button
                                onClick={() => { setSubmitted(false); setAnswers({}); setTimeLeft(3 * 60 * 60); }}
                                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-5 h-5" /> RETAKE TEST
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 space-y-12 animate-fade-in pb-32">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg flex justify-between items-center">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{domain.name} CAPSTONE</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                        <span className="flex items-center gap-1"><Calculator className="w-4 h-4" /> 50 Questions</span>
                        <span className="flex items-center gap-1 text-red-500"><Timer className="w-4 h-4" /> {formatTime(timeLeft)}</span>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
                >
                    SUBMIT FINAL EXAM
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full uppercase">Question {idx + 1}</span>
                            {answers[idx] !== undefined && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">{q.question}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {q.options.map((opt, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => setAnswers({ ...answers, [idx]: optIdx })}
                                    className={`
                                        p-4 text-left rounded-xl border-2 transition-all font-medium text-sm
                                        ${answers[idx] === optIdx
                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:border-gray-200 text-gray-700 dark:text-gray-300'}
                                    `}
                                >
                                    <span className="mr-3 font-bold opacity-50">{String.fromCharCode(65 + optIdx)}.</span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
