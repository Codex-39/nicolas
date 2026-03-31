import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle, Layout, Code, Server, BookOpen, PenTool, GitMerge, FileText, Zap, Award } from 'lucide-react';

const STEPS = [
    { id: 'problem', name: 'Problem Statement' },
    { id: 'clarify', name: 'Clarification' },
    { id: 'design', name: 'High-Level Design' },
    { id: 'deepdive', name: 'Deep Dive' }
];

export default function SystemCaseStudy({ caseStudy, onBack }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [clarificationAnswers, setClarificationAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [mockEditor, setMockEditor] = useState("Client -> API Gateway -> Load Balancer -> Service\nService -> Read Replica (Cache Miss)\nService -> Cache (Redis)");

    const handleAnswerClarification = (questionIndex, optionIndex) => {
        setClarificationAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleEvaluation = () => {
        setShowResult(true);
    };

    return (
        <div className="flex flex-col h-full md:h-[calc(100vh-120px)] animate-fade-in bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3 text-gray-900 dark:text-white truncate">
                            {caseStudy.title} System Design
                        </h2>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="hidden md:flex items-center gap-2">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className="flex items-center">
                            <div className={`flex items-center justify-center h-8 px-4 rounded-full text-xs font-bold transition-all ${
                                currentStep === idx 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : currentStep > idx 
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                            }`}>
                                {currentStep > idx ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : `${idx + 1}. `}
                                {step.name}
                            </div>
                            {idx < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-700 mx-1" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 bg-white dark:bg-gray-950">
                    
                    {/* STEP 1: PROBLEM STATEMENT */}
                    {currentStep === 0 && (
                        <div className="max-w-3xl mx-auto w-full animate-slide-up">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-indigo-500" /> Defining the Problem
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                                {caseStudy.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl">
                                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2 text-lg">
                                        <Layout className="w-5 h-5" /> Functional Requirements
                                    </h4>
                                    <ul className="space-y-3">
                                        {caseStudy.requirements.functional.map((req, i) => (
                                            <li key={i} className="flex gap-3 text-blue-800 dark:text-blue-200">
                                                <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-500" /> 
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-6 rounded-2xl">
                                    <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2 text-lg">
                                        <Zap className="w-5 h-5" /> Non-Functional Requirements
                                    </h4>
                                    <ul className="space-y-3">
                                        {caseStudy.requirements.nonFunctional.map((req, i) => (
                                            <li key={i} className="flex gap-3 text-purple-800 dark:text-purple-200">
                                                <Server className="w-5 h-5 shrink-0 text-purple-500" /> 
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CLARIFICATION */}
                    {currentStep === 1 && (
                        <div className="max-w-3xl mx-auto w-full animate-slide-up">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <HelpCircle className="w-6 h-6 text-orange-500" /> Clarifying the Scope
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">Before jumping into the design, it's crucial to clarify assumptions. Answer the following questions internally to scope out the design phase:</p>
                            
                            <div className="space-y-8">
                                {caseStudy.clarifications.map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Q: {item.question}</h4>
                                        <div className="space-y-3">
                                            {item.options.map((opt, optIdx) => {
                                                const isSelected = clarificationAnswers[idx] === optIdx;
                                                const isCorrect = item.correct === optIdx;
                                                const showFeedback = clarificationAnswers[idx] !== undefined;

                                                let btnClass = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 text-gray-700 dark:text-gray-300";
                                                if (showFeedback) {
                                                    if (isCorrect) btnClass = "bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-300";
                                                    else if (isSelected && !isCorrect) btnClass = "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-300";
                                                } else if (isSelected) {
                                                    btnClass = "bg-indigo-50 border-indigo-400 text-indigo-800";
                                                }

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => !showFeedback && handleAnswerClarification(idx, optIdx)}
                                                        disabled={showFeedback}
                                                        className={`w-full text-left px-5 py-4 border-2 rounded-xl font-medium transition-all ${btnClass}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        {clarificationAnswers[idx] !== undefined && (
                                            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm">
                                                <strong>Feedback:</strong> {item.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: HIGH LEVEL DESIGN */}
                    {currentStep === 2 && (
                        <div className="w-full h-full flex flex-col animate-slide-up">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <PenTool className="w-6 h-6 text-emerald-500" /> High-Level Architecture
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Sketch out your component interactions. (In this mock simulator, use the text area to define your node connections via simple markup).</p>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
                                {/* Editor */}
                                <div className="bg-[#1e1e1e] rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-800">
                                    <div className="bg-gray-800 px-4 py-2 text-xs font-mono text-gray-400 border-b border-gray-700 flex justify-between">
                                        <span>draw.txt</span>
                                        <span>Syntax: A -&gt; B</span>
                                    </div>
                                    <textarea 
                                        value={mockEditor}
                                        onChange={(e) => setMockEditor(e.target.value)}
                                        className="flex-1 min-h-[250px] md:min-h-0 w-full bg-transparent text-emerald-400 p-4 font-mono text-sm leading-relaxed outline-none resize-none"
                                        spellCheck="false"
                                    />
                                </div>
                                {/* Provided Key Components List */}
                                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl overflow-y-auto">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Expected Core Components</h4>
                                    <div className="space-y-4">
                                        {caseStudy.keyComponents.map((comp, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-3">
                                                 <Server className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                                 <div>
                                                     <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{comp.name}</h5>
                                                     <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{comp.desc}</p>
                                                 </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: DEEP DIVE & RESULT */}
                    {currentStep === 3 && (
                        <div className="max-w-4xl mx-auto w-full animate-slide-up">
                            {!showResult ? (
                                <div className="text-center py-20">
                                    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <GitMerge className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready for Evaluation?</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 text-lg">
                                        In a real deep dive, you would discuss database sharding, caching strategies, and bottlenecks. Click below to generate the ideal mock evaluation for this system.
                                    </p>
                                    <button 
                                        onClick={handleEvaluation}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:shadow-2xl text-lg flex items-center gap-2 mx-auto"
                                    >
                                        <Award className="w-6 h-6" /> Generate Ideal Answer
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-fade-in pb-10">
                                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-8 rounded-3xl text-center">
                                        <h2 className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">95%</h2>
                                        <p className="text-green-800 dark:text-green-300 font-bold text-lg">Architecture Coverage Score</p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Ideal Deep Dive Feedback</h3>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">1. Data Model & Storage</h4>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    For {caseStudy.title}, relying on a NoSQL database ensures high write throughput. Data Partitioning is critical—sharding by User ID prevents hot partitions.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">2. Scaling & Load Balancing</h4>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Using consistent hashing on the Load Balancer ensures that WebSocket connections map efficiently to the same Presence or Chat servers without massive re-routing during node failures.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-2">3. Trade-offs Mentioned</h4>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Great job sacrificing strong consistency for high availability (AP over CP in CAP Theorem). In messaging or streaming, eventual consistency is perfectly acceptable.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center">
                                        <button onClick={onBack} className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold transition-colors">
                                           Return to Dashboard
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bottom Action Bar */}
                    {(!showResult || currentStep < 3) && (
                        <div className="mt-auto pt-8 flex justify-between">
                            <button 
                                onClick={() => setCurrentStep(prev => prev > 0 ? prev - 1 : 0)}
                                disabled={currentStep === 0}
                                className="px-6 py-3 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl disabled:opacity-0 transition-all"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => setCurrentStep(prev => prev < 3 ? prev + 1 : prev)}
                                disabled={currentStep === 3}
                                className="px-8 py-3 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-0 transition-all shadow-md flex items-center"
                            >
                                Next Step <ChevronRight className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                    )}

                </div>

                {/* Right Panel - Core Concepts Cheat Sheet */}
                <div className="hidden lg:flex w-64 xl:w-80 flex-col border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 xl:p-6 shrink-0 overflow-y-auto">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide text-sm">
                        <BookOpen className="w-4 h-4 text-indigo-500" /> Master Concepts
                    </h3>
                    <div className="space-y-5">
                        {caseStudy.concepts.map((concept, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-sm text-indigo-600 dark:text-indigo-400">{concept.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{concept.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
