import { useState, useRef, useEffect } from 'react';
import { INTERVIEW_TOPICS, INTERVIEW_ROUNDS } from '../data/mockData';
import { ONLINE_ASSESSMENTS, ASSESSMENT_QUESTIONS_MAP } from '../data/onlineAssessments';
import AssessmentInterface, { loadOAHistory, saveOAHistory } from '../components/AssessmentInterface';
import DSAProblemList from '../components/dsa/DSAProblemList';
import DSAWorkspace from '../components/dsa/DSAWorkspace';
import CoreSubjects from '../components/core/CoreSubjects';
import CoreSubjectDetail from '../components/core/CoreSubjectDetail';
import ProjectPrep from '../components/core/ProjectPrep';
import SystemDesign from '../components/systemDesign/SystemDesign';
import SystemCaseStudy from '../components/systemDesign/SystemCaseStudy';
import HRInterview from '../components/hr/HRInterview';
import { MessageSquare, Mic, Send, Bot, PlayCircle, Sparkles, BookOpen, ChevronRight, ArrowLeft, Clock, Target, Brain, Code2, Cpu, Building2, CheckCircle, XCircle, BarChart3, Eye, ChevronDown, ChevronUp, History, AlertCircle, Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLearning } from '../context/LearningContext';

const ICON_MAP = {
    brain: Brain,
    code: Code2,
    cpu: Cpu,
    building: Building2
};

const COLOR_MAP = {
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-500' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', badge: 'bg-purple-500' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', badge: 'bg-orange-500' }
};

const DIFF_MAP = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

export default function InterviewPrep() {
    const { t } = useLanguage();
    const { logActivity } = useLearning();
    const [activeTab, setActiveTab] = useState('prep');
    // steps: selection, roundDetail, chat, feedback, oa-dashboard, oa-test, oa-result, oa-review, oa-history
    const [step, setStep] = useState('selection');
    const [selectedRound, setSelectedRound] = useState(null);
    const [topic, setTopic] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Online Assessment state
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [oaResult, setOaResult] = useState(null);
    const [oaHistory, setOaHistory] = useState(loadOAHistory());
    const [reviewAttempt, setReviewAttempt] = useState(null);
    const [expandedHistoryId, setExpandedHistoryId] = useState(null);

    // New states for DSA and Core rounds
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

    const startInterview = (t) => {
        logActivity();
        setTopic(t);
        setStep('chat');
        setMessages([
            { id: 1, sender: 'bot', text: `Hello! I'm your AI Interviewer for ${t.name}. Let's start with a simple question: Tell me about yourself and why you are interested in this field.` }
        ]);
    };

    const viewRound = (round) => {
        logActivity();
        if (round.id === 'online-assessment') {
            setStep('oa-dashboard');
            return;
        }
        if (round.id === 'technical-round-1') {
            setStep('dsa-problems');
            return;
        }
        if (round.id === 'technical-round-2') {
            setStep('core-dashboard');
            return;
        }
        if (round.id === 'system-design') {
            setStep('system-design-dashboard');
            return;
        }
        if (round.id === 'hr-prep') {
            setStep('hr-dashboard');
            return;
        }
        setSelectedRound(round);
        setStep('roundDetail');
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (step === 'chat') scrollToBottom();
    }, [messages, step]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const botMsg = {
                id: Date.now() + 1, sender: 'bot',
                text: messages.length >= 4
                    ? "Great! We have enough information. Let's wrap up this session. Click 'Finish' to see your feedback."
                    : "Thanks for sharing. That's a solid answer. Let's move to a technical question. Can you explain a challenging problem you solved recently?"
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1500);
    };

    // ─── OA Handlers ─────────────────────────────────────────
    const handleStartAssessment = (assessment) => {
        logActivity();
        setSelectedAssessment(assessment);
        setStep('oa-test');
    };

    const handleAssessmentComplete = (data) => {
        setOaResult(data);
        const entry = {
            id: Date.now(),
            testName: selectedAssessment.name,
            testId: selectedAssessment.id,
            date: new Date().toISOString(),
            ...data
        };
        const updated = [entry, ...oaHistory];
        setOaHistory(updated);
        saveOAHistory(updated);
        setStep('oa-result');
    };

    const handleDeleteAttempt = (id) => {
        const updated = oaHistory.filter(a => a.id !== id);
        setOaHistory(updated);
        saveOAHistory(updated);
    };

    // ─── Render: OA Test ─────────────────────────────────────
    if (step === 'oa-test' && selectedAssessment) {
        const questions = ASSESSMENT_QUESTIONS_MAP[selectedAssessment.id] || [];
        return (
            <AssessmentInterface
                testName={selectedAssessment.name}
                questions={questions}
                duration={selectedAssessment.duration}
                onComplete={handleAssessmentComplete}
            />
        );
    }

    return (
        <div className="h-full flex flex-col transition-colors duration-300">
            <header className="mb-4 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Interview Preparation</h1>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">Master your technical job search through structured modules and AI-led practice sessions.</p>
            </header>

            {/* ─── Selection View ─────────────────────────────── */}
            {step === 'selection' && (
                <>
                    <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1 rounded-2xl w-full sm:w-fit mb-8 overflow-x-auto whitespace-nowrap">
                        <button onClick={() => setActiveTab('prep')} className={`flex-1 sm:flex-none px-4 md:px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'prep' ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            Preparation Modules
                        </button>
                        <button onClick={() => setActiveTab('mock')} className={`flex-1 sm:flex-none px-4 md:px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'mock' ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            AI Mock Interview
                        </button>
                    </div>

                    {activeTab === 'prep' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {INTERVIEW_ROUNDS.map(round => (
                                <button
                                    key={round.id}
                                    onClick={() => viewRound(round)}
                                    className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col group h-full"
                                >
                                    <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{round.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-1">{round.desc}</p>
                                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                                        View Module <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {INTERVIEW_TOPICS.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => startInterview(t)}
                                    className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-lg transition-all text-left flex flex-col group h-full"
                                >
                                    <div className="bg-pink-100 dark:bg-pink-900/40 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors">
                                        <MessageSquare className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-1">{t.count} practice questions</p>
                                    <div className="mt-4 flex items-center text-sm font-medium text-pink-600 dark:text-pink-400">
                                        Start Session <PlayCircle className="w-4 h-4 ml-2" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ─── Round Detail View ─────────────────────────── */}
            {step === 'roundDetail' && selectedRound && (
                <div className="max-w-4xl mx-auto w-full animate-fade-in">
                    <button onClick={() => setStep('selection')} className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to modules
                    </button>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl p-5 md:p-10 border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-500">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">{selectedRound.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 text-sm md:text-lg leading-relaxed">{selectedRound.desc}</p>
                        <div className="space-y-12">
                            {selectedRound.sections.map((section, idx) => (
                                <div key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center text-sm mr-3 shrink-0">{idx + 1}</span>
                                        {section.title}
                                    </h3>
                                    <div className="prose prose-pink dark:prose-invert max-w-none ml-11">
                                        <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">{section.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Chat View ─────────────────────────────────── */}
            {step === 'chat' && (
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden max-w-4xl mx-auto w-full shadow-lg h-full">
                    <div className="bg-pink-50 dark:bg-pink-900/20 p-4 border-b border-pink-100 dark:border-pink-900/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-200 dark:bg-pink-800/50 rounded-full"><Bot className="w-5 h-5 text-pink-700 dark:text-pink-300" /></div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">AI Interviewer</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{topic.name} Session</p>
                            </div>
                        </div>
                        <button onClick={() => setStep('feedback')} className="text-sm text-pink-700 dark:text-pink-300 font-bold hover:underline">Finish & Get Feedback</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-pink-600 text-white rounded-br-none shadow-md shadow-pink-200 dark:shadow-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm'}`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none p-4 shadow-sm flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-pink-400 dark:bg-pink-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-pink-400 dark:bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-pink-400 dark:bg-pink-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                        <button type="button" className="p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><Mic className="w-5 h-5" /></button>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your answer here..." className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none" autoFocus />
                        <button type="submit" disabled={!input.trim()} className="p-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"><Send className="w-5 h-5" /></button>
                    </form>
                </div>
            )}

            {/* ─── Feedback View ──────────────────────────────── */}
            {step === 'feedback' && (
                <div className="max-w-2xl mx-auto w-full animate-fade-in bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-lg">
                    <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles className="w-10 h-10 text-yellow-600 dark:text-yellow-400" /></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Feedback Summary</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Based on your responses for {topic?.name}</p>
                    <div className="text-left space-y-4 mb-8">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl">
                            <h4 className="font-bold text-green-800 dark:text-green-300 text-sm mb-1 uppercase tracking-wider">Strengths</h4>
                            <p className="text-green-700 dark:text-green-400 text-sm">Clear communication style. Good structure in answers.</p>
                        </div>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl">
                            <h4 className="font-bold text-red-800 dark:text-red-300 text-sm mb-1 uppercase tracking-wider">Improvements</h4>
                            <p className="text-red-700 dark:text-red-400 text-sm">Try to provide more specific examples using the STAR method.</p>
                        </div>
                    </div>
                    <button onClick={() => setStep('selection')} className="bg-gray-900 dark:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">Start New Session</button>
                </div>
            )}

            {/* ─── DSA Views ─────────────────────────────────── */}
            {step === 'dsa-problems' && (
                <div className="animate-fade-in space-y-8">
                    <button onClick={() => setStep('selection')} className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-bold">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to modules
                    </button>
                    <DSAProblemList 
                        onSelectProblem={(p) => { setSelectedProblem(p); setStep('dsa-workspace'); }} 
                        solvedProblems={solvedProblems} 
                    />
                </div>
            )}

            {step === 'dsa-workspace' && selectedProblem && (
                <DSAWorkspace 
                    problem={selectedProblem} 
                    onBack={() => setStep('dsa-problems')} 
                    onComplete={(id) => setSolvedProblems(prev => prev.includes(id) ? prev : [...prev, id])}
                />
            )}

            {/* ─── Core Subjects Views ────────────────────────── */}
            {step === 'core-dashboard' && (
                <div className="animate-fade-in space-y-8">
                    <button onClick={() => setStep('selection')} className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-bold">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to modules
                    </button>
                    <CoreSubjects 
                        onSelectTopic={(t) => { setSelectedTopic(t); setStep('core-detail'); }}
                        onSelectProjects={() => setStep('project-prep')}
                    />
                </div>
            )}

            {step === 'core-detail' && selectedTopic && (
                <CoreSubjectDetail 
                    topic={selectedTopic} 
                    onBack={() => setStep('core-dashboard')} 
                />
            )}

            {step === 'project-prep' && (
                <ProjectPrep onBack={() => setStep('core-dashboard')} />
            )}

            {/* ─── System Design Views ────────────────────────── */}
            {step === 'system-design-dashboard' && (
                <div className="animate-fade-in space-y-8">
                    <button onClick={() => setStep('selection')} className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-bold">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to modules
                    </button>
                    <SystemDesign onSelectCaseStudy={(cs) => { setSelectedCaseStudy(cs); setStep('system-case-study'); }} />
                </div>
            )}

            {step === 'system-case-study' && selectedCaseStudy && (
                <SystemCaseStudy 
                    caseStudy={selectedCaseStudy} 
                    onBack={() => setStep('system-design-dashboard')} 
                />
            )}

            {/* ─── HR Interview Views ─────────────────────────── */}
            {step === 'hr-dashboard' && (
                <div className="animate-fade-in space-y-8">
                    <button onClick={() => setStep('selection')} className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-bold">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to modules
                    </button>
                    <HRInterview onBack={() => setStep('selection')} />
                </div>
            )}

            {/* ─── OA Dashboard ───────────────────────────────── */}
            {step === 'oa-dashboard' && (
                <div className="animate-fade-in space-y-8">
                    <button onClick={() => setStep('selection')} className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to modules
                    </button>

                    <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Online Assessment</h2>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Practice with timed assessments that mirror real company online tests.</p>
                    </div>

                    {/* Assessment Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ONLINE_ASSESSMENTS.map(assessment => {
                            const IconComp = ICON_MAP[assessment.icon] || Brain;
                            const colors = COLOR_MAP[assessment.color] || COLOR_MAP.blue;
                            const pastAttempts = oaHistory.filter(a => a.testId === assessment.id);
                            const bestScore = pastAttempts.length > 0 ? Math.max(...pastAttempts.map(a => parseFloat(a.score))) : null;

                            return (
                                <div key={assessment.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all group">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <IconComp className={`w-6 h-6 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{assessment.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{assessment.description}</p>
                                        </div>
                                    </div>

                                    {/* Meta Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                            <Target className="w-3 h-3" /> {assessment.questionCount} Questions
                                        </span>
                                        <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {assessment.duration} min
                                        </span>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${DIFF_MAP[assessment.difficulty]}`}>
                                            {assessment.difficulty}
                                        </span>
                                    </div>

                                    {bestScore !== null && (
                                        <div className="text-sm mb-4 flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-yellow-500" />
                                            <span className="text-green-600 dark:text-green-400 font-semibold">Best: {bestScore}/{assessment.totalMarks}</span>
                                            <span className="text-gray-400">·</span>
                                            <span className="text-gray-500 text-xs">{pastAttempts.length} attempt{pastAttempts.length > 1 ? 's' : ''}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleStartAssessment(assessment)}
                                        className={`w-full ${colors.badge} hover:opacity-90 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2`}
                                    >
                                        <PlayCircle className="w-4 h-4" /> Start Test
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Attempt History */}
                    {oaHistory.length > 0 && (
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                <History className="w-5 h-5 text-orange-500" /> Attempt History
                            </h3>
                            <div className="space-y-3">
                                {oaHistory.map(attempt => (
                                    <div key={attempt.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setExpandedHistoryId(expandedHistoryId === attempt.id ? null : attempt.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${parseFloat(attempt.score) > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                    {parseFloat(attempt.score) > 0 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{attempt.testName}</span>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(attempt.date).toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{attempt.score}/{attempt.totalMaxMarks}</span>
                                                {expandedHistoryId === attempt.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                            </div>
                                        </button>
                                        {expandedHistoryId === attempt.id && (
                                            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="grid grid-cols-3 gap-3 my-3">
                                                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/10 rounded-lg"><div className="text-xl font-bold text-green-600">{attempt.correct}</div><div className="text-xs text-gray-500">Correct</div></div>
                                                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/10 rounded-lg"><div className="text-xl font-bold text-red-500">{attempt.incorrect}</div><div className="text-xs text-gray-500">Incorrect</div></div>
                                                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"><div className="text-xl font-bold text-gray-600 dark:text-gray-300">{attempt.unattempted}</div><div className="text-xs text-gray-500">Unattempted</div></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setReviewAttempt(attempt); setStep('oa-review'); }}
                                                        className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center gap-1.5">
                                                        <Eye className="w-4 h-4" /> Review
                                                    </button>
                                                    <button onClick={() => handleDeleteAttempt(attempt.id)} className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm font-semibold">Delete</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── OA Result View ─────────────────────────────── */}
            {step === 'oa-result' && oaResult && (
                <OAResultView
                    data={oaResult}
                    questions={ASSESSMENT_QUESTIONS_MAP[selectedAssessment?.id] || []}
                    testName={selectedAssessment?.name || 'Test'}
                    onBack={() => setStep('oa-dashboard')}
                    onReview={() => { setReviewAttempt({ responses: oaResult.responses }); setStep('oa-review'); }}
                />
            )}

            {/* ─── OA Review View ─────────────────────────────── */}
            {step === 'oa-review' && reviewAttempt && (
                <OAReviewView
                    questions={ASSESSMENT_QUESTIONS_MAP[selectedAssessment?.id || oaHistory.find(a => a.id === reviewAttempt.id)?.testId] || []}
                    responses={reviewAttempt.responses}
                    onBack={() => setStep('oa-dashboard')}
                />
            )}
        </div>
    );
}

/* ─── Result Component ───────────────────────────────────────── */
function OAResultView({ data, questions, testName, onBack, onReview }) {
    const pct = ((parseFloat(data.score) / data.totalMaxMarks) * 100).toFixed(1);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center py-6">
                <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{testName} — Completed!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Here is your performance report</p>
                <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{data.score}<span className="text-2xl text-gray-400">/{data.totalMaxMarks}</span></div>
                <div className="text-sm text-gray-500 mt-1">{pct}%</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 p-4 rounded-2xl text-center">
                    <CheckCircle className="w-7 h-7 text-green-600 mx-auto mb-1" /><div className="text-2xl font-bold text-green-600">{data.correct}</div><div className="text-xs text-gray-500">Correct</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl text-center">
                    <XCircle className="w-7 h-7 text-red-500 mx-auto mb-1" /><div className="text-2xl font-bold text-red-500">{data.incorrect}</div><div className="text-xs text-gray-500">Incorrect</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl text-center">
                    <AlertCircle className="w-7 h-7 text-gray-400 mx-auto mb-1" /><div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{data.unattempted}</div><div className="text-xs text-gray-500">Unattempted</div>
                </div>
            </div>

            {/* Section-wise */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-indigo-600" /> Section-wise Performance</h3>
                <div className="space-y-4">
                    {data.sectionStats && Object.entries(data.sectionStats).map(([sec, stats]) => {
                        const secQs = questions.filter(q => q.section === sec);
                        const secMax = secQs.reduce((s, q) => s + q.marks, 0);
                        const pct = secMax > 0 ? Math.max(0, (stats.score / secMax) * 100) : 0;
                        return (
                            <div key={sec}>
                                <div className="flex justify-between items-center mb-1"><span className="font-bold text-gray-800 dark:text-gray-200">{sec}</span><span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.score.toFixed(2)}/{secMax}</span></div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Coding Results */}
            {data.codingResults && data.codingResults.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><Code2 className="w-5 h-5 text-green-600" /> Coding Results</h3>
                    <div className="space-y-3">
                        {data.codingResults.map(cr => (
                            <div key={cr.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{cr.question}</p>
                                    <p className="text-xs text-gray-500">{cr.passed}/{cr.total} test cases passed</p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <span className={`text-sm font-bold ${cr.passed === cr.total ? 'text-green-600' : cr.passed > 0 ? 'text-yellow-600' : 'text-red-500'}`}>{cr.earned}/{cr.maxMarks}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={onReview} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"><Eye className="w-5 h-5" /> Review Answers</button>
                <button onClick={onBack} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Back to Dashboard</button>
            </div>
        </div>
    );
}

/* ─── Review Component ────────────────────────────────────────── */
function OAReviewView({ questions, responses, onBack }) {
    const [filterSection, setFilterSection] = useState('ALL');
    const sections = ['ALL', ...Array.from(new Set(questions.map(q => q.section)))];
    const filtered = filterSection === 'ALL' ? questions : questions.filter(q => q.section === filterSection);

    const getResult = (q) => {
        const ans = responses[q.id];
        if (ans === undefined || ans === '' || (Array.isArray(ans) && ans.length === 0)) return 'unattempted';
        if (q.type === 'MCQ') return ans === q.correct_answer ? 'correct' : 'incorrect';
        if (q.type === 'MSQ') {
            const ca = [...(q.correct_answers || [])].sort();
            const ua = [...ans].sort();
            return JSON.stringify(ca) === JSON.stringify(ua) ? 'correct' : 'incorrect';
        }
        if (q.type === 'NAT') {
            const val = parseFloat(ans);
            const [lo, hi] = q.answer_range;
            return val >= lo && val <= hi ? 'correct' : 'incorrect';
        }
        if (q.type === 'CODING') {
            if (typeof ans === 'object' && ans._passedCount !== undefined) {
                return ans._passedCount === ans._totalCount ? 'correct' : ans._passedCount > 0 ? 'partial' : 'incorrect';
            }
            return 'unattempted';
        }
        return 'unattempted';
    };

    const borderMap = { correct: 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10', incorrect: 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10', partial: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/10', unattempted: 'border-gray-200 dark:border-gray-800' };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Answer Review</h2>
                <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 flex items-center gap-1">← Back</button>
            </div>

            <div className="flex gap-2 flex-wrap">
                {sections.map(sec => (
                    <button key={sec} onClick={() => setFilterSection(sec)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${filterSection === sec ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{sec === 'ALL' ? 'All' : sec}</button>
                ))}
            </div>

            <div className="space-y-4">
                {filtered.map((q) => {
                    const result = getResult(q);
                    const ans = responses[q.id];
                    const globalIdx = questions.findIndex(qq => qq.id === q.id);
                    return (
                        <div key={q.id} className={`p-5 rounded-2xl border-2 ${borderMap[result] || borderMap.unattempted}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-2 py-0.5 rounded text-sm">Q{globalIdx + 1}</span>
                                    <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">{q.type} · {q.section}</span>
                                </div>
                                <div>
                                    {result === 'correct' && <span className="text-sm text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Correct</span>}
                                    {result === 'incorrect' && <span className="text-sm text-red-500 font-bold flex items-center gap-1"><XCircle className="w-4 h-4" /> Incorrect</span>}
                                    {result === 'partial' && <span className="text-sm text-yellow-600 font-bold">Partial</span>}
                                    {result === 'unattempted' && <span className="text-sm text-gray-400 font-bold">Unattempted</span>}
                                </div>
                            </div>

                            <p className="text-gray-900 dark:text-white font-medium mb-4">{q.question}</p>

                            {(q.type === 'MCQ' || q.type === 'MSQ') && q.options && (
                                <div className="space-y-2">
                                    {Object.entries(q.options).map(([key, value]) => {
                                        const isCorrect = q.type === 'MCQ' ? key === q.correct_answer : (q.correct_answers || []).includes(key);
                                        const isUser = q.type === 'MCQ' ? ans === key : Array.isArray(ans) && ans.includes(key);
                                        let style = 'border-gray-200 dark:border-gray-700';
                                        if (isCorrect) style = 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-600';
                                        if (isUser && !isCorrect) style = 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600';
                                        return (
                                            <div key={key} className={`flex items-center justify-between p-3 border rounded-xl ${style}`}>
                                                <div className="flex items-center gap-2"><span className="font-bold text-gray-600 dark:text-gray-300">{key}.</span><span className="text-gray-800 dark:text-gray-200">{value}</span></div>
                                                <div className="flex gap-1 text-xs font-bold shrink-0">
                                                    {isCorrect && <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">Correct</span>}
                                                    {isUser && <span className={`${isCorrect ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-500 bg-red-100 dark:bg-red-900/30'} px-2 py-0.5 rounded`}>Your Answer</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {q.type === 'NAT' && (
                                <div className="space-y-1 text-sm">
                                    <div className="text-gray-600 dark:text-gray-400">Your answer: <strong className={result === 'correct' ? 'text-green-600' : 'text-red-500'}>{ans !== undefined && ans !== '' ? ans : '—'}</strong></div>
                                    <div className="text-gray-600 dark:text-gray-400">Correct range: <strong className="text-green-600">{q.answer_range[0]} – {q.answer_range[1]}</strong></div>
                                </div>
                            )}

                            {q.type === 'CODING' && (
                                <div className="text-sm">
                                    {ans && typeof ans === 'object' && ans._passedCount !== undefined ? (
                                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                                            <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">{ans._passedCount}/{ans._totalCount} test cases passed</div>
                                            <div className="text-xs text-gray-500">Language: {ans._selectedLang || 'python'}</div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No code submitted.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="text-center py-6">
                <button onClick={onBack} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Back to Dashboard</button>
            </div>
        </div>
    );
}
