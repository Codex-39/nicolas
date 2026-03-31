import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANCH_DATA } from '../data/mockData';
import {
    ArrowLeft, ArrowRight, Globe, BarChart2, Cpu, Book, Sparkles,
    User, Target, Zap, Settings, Home, Terminal, Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLearning } from '../context/LearningContext';
import ChatbotModal from '../components/common/ChatbotModal';

// JSON Data Imports
import cseQuestions from '../data/cse_Q.json';
import eceQuestions from '../data/ece_Q.json';

const BranchCard = ({ branch, onSelect }) => {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Cpu': return <Cpu className="w-8 h-8 text-blue-500" />;
            case 'Zap': return <Zap className="w-8 h-8 text-yellow-500" />;
            case 'Terminal': return <Terminal className="w-8 h-8 text-green-500" />;
            case 'Settings': return <Settings className="w-8 h-8 text-orange-500" />;
            case 'Home': return <Home className="w-8 h-8 text-indigo-500" />;
            default: return <Cpu className="w-8 h-8 text-gray-500" />;
        }
    };

    return (
        <button
            onClick={() => onSelect(branch.id)}
            className="flex items-center p-4 md:p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-lg transition-all text-left group"
        >
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-800 mr-4 md:mr-5 group-hover:scale-110 transition-all duration-300">
                {getIcon(branch.icon)}
            </div>
            <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white uppercase leading-tight">{branch.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">{branch.fullName}</p>
            </div>
        </button>
    );
};

const DomainCard = ({ domain, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(domain.id)}
            className="flex items-center p-5 md:p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all text-left group w-full"
        >
            <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">{domain.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{domain.description || "Explore specialized topics and master your field."}</p>
                <div className="flex items-center text-blue-500 dark:text-blue-400 text-xs md:text-sm font-semibold mt-2 group-hover:translate-x-1 transition-transform">
                    Start Learning <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1" />
                </div>
            </div>
        </button>
    );
};

export default function DomainSelection() {
    const navigate = useNavigate();
    const { enrollInDomain } = useLearning();

    const [selectedBranch, setSelectedBranch] = useState(null);
    const [mode, setMode] = useState('choice'); // choice, manual, ai
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [suggestionResult, setSuggestionResult] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Debugging Chatbot toggle
    useEffect(() => {
        if (isChatOpen) console.log("State set: isChatOpen = true");
        else console.log("State set: isChatOpen = false");
    }, [isChatOpen]);

    // Dynamic data based on branch
    const branchSpecificData = useMemo(() => {
        if (!selectedBranch) return null;
        const branchKey = selectedBranch.toLowerCase();

        // Base domains from mockData
        const baseDomains = BRANCH_DATA[branchKey]?.domains || [];

        if (branchKey === 'cse') {
            return {
                questions: cseQuestions.questions,
                domains: baseDomains
            };
        } else if (branchKey === 'ece') {
            return {
                questions: eceQuestions.questions,
                domains: baseDomains
            };
        }

        // Fallback for other branches
        return {
            questions: [], // No AI survey for other branches yet
            domains: baseDomains
        };
    }, [selectedBranch]);

    const handleDomainSelect = (dId) => {
        enrollInDomain(selectedBranch, dId);
        navigate(`/roadmap/${selectedBranch}/${dId}`);
    };

    const handleAISuggestion = async (finalAnswers) => {
        setIsAnalyzing(true);
        setAiError(null);

        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        const prompt = `
            You are NICOLAS (Neural Intelligent Career & Learning Assistant).
            A student in the ${selectedBranch} engineering branch has answered a survey.
            
            Student's Answers:
            ${finalAnswers.map((ans, i) => `Q: ${branchSpecificData.questions[i].question}\nA: ${ans}`).join('\n')}
            
            Based ONLY on these answers, suggest the BEST specific domain for them to specialize in.
            
            Rules:
            1. Response must be a JSON object: {"suggested_domain": "Domain Name", "reason": "1-2 sentence explanation"}.
            2. Be specific and professional.
        `;

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) throw new Error("API request failed");

            const data = await response.json();
            const result = JSON.parse(data.choices[0].message.content);

            setSuggestionResult(result);
        } catch (error) {
            console.error("AI Error:", error);
            setAiError("NICOLAS is having trouble thinking. Please try choosing a domain manually.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnswerSelect = (option) => {
        const newAnswers = [...answers, option];
        setAnswers(newAnswers);

        if (step < branchSpecificData.questions.length - 1) {
            setStep(step + 1);
        } else {
            handleAISuggestion(newAnswers);
        }
    };

    // Stage 1: Branch Selection
    const renderContent = () => {
        if (!selectedBranch) {
            return (
                <div className="max-w-4xl mx-auto py-8 md:py-12 space-y-8 md:space-y-12 animate-fade-in px-4">
                    <div className="text-center space-y-3 md:space-y-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Select Your Branch</h1>
                        <p className="text-base md:text-xl text-gray-500 dark:text-gray-400">Choose your engineering discipline to see available domains.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {Object.entries(BRANCH_DATA).map(([id, branch]) => (
                            <BranchCard key={id} branch={{ ...branch, id }} onSelect={setSelectedBranch} />
                        ))}
                    </div>
                </div>
            );
        }

        // Stage 2: Mode Choice within Branch
        if (mode === 'choice') {
            const branch = BRANCH_DATA[selectedBranch.toLowerCase()];
            return (
                <div className="max-w-4xl mx-auto py-8 md:py-12 space-y-8 md:space-y-12 animate-fade-in px-4">
                    <button onClick={() => setSelectedBranch(null)} className="flex items-center text-sm md:text-base text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Branch Selection
                    </button>

                    <div className="text-center space-y-3 md:space-y-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Path for {branch.name}</h1>
                        <p className="text-base md:text-xl text-gray-500 dark:text-gray-400">Choose how you want to find your specialization.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <button
                            onClick={() => {
                                console.log("AI Suggestion Clicked");
                                setIsChatOpen(true);
                            }}
                            className="p-8 md:p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl text-white text-left space-y-4 md:space-y-6 shadow-xl hover:scale-[1.02] transition-transform group relative overflow-hidden"
                        >
                            <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-blue-200" />
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold">AI Suggestion</h2>
                                <p className="text-blue-100 mt-2 text-sm md:text-base opacity-90">Let NICOLAS analyze your goals and suggest the best {branch.name} domain.</p>
                            </div>
                            <div className="pt-2 md:pt-4 flex items-center font-bold text-sm md:text-base">Get Started <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" /></div>
                        </button>

                        <button
                            onClick={() => setMode('manual')}
                            className="p-8 md:p-10 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl md:rounded-3xl text-left space-y-4 md:space-y-6 shadow-sm hover:border-blue-500 transition-all group"
                        >
                            <User className="w-10 h-10 md:w-12 md:h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">View All Domains</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base">See all available specialized domains for {branch.name}.</p>
                            </div>
                            <div className="pt-2 md:pt-4 flex items-center font-bold text-blue-500 text-sm md:text-base">View List <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" /></div>
                        </button>
                    </div>
                </div>
            );
        }

        if (mode === 'ai') {
            if (suggestionResult) {
                return (
                    <div className="max-w-2xl mx-auto py-12 space-y-8 animate-fade-in text-center">
                        <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                            <Sparkles className="w-16 h-16 text-blue-200 mx-auto" />
                            <div className="space-y-2">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-200">NICOLAS Suggests</h2>
                                <h1 className="text-4xl font-extrabold">{suggestionResult.suggested_domain}</h1>
                            </div>
                            <p className="text-xl text-blue-50 font-medium italic">"{suggestionResult.reason}"</p>

                            <div className="pt-6 grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => {
                                        // Try to find a match in mock data
                                        const match = branchSpecificData.domains.find(d =>
                                            d.name.toLowerCase().includes(suggestionResult.suggested_domain.toLowerCase()) ||
                                            suggestionResult.suggested_domain.toLowerCase().includes(d.name.toLowerCase())
                                        );
                                        handleDomainSelect(match?.id || branchSpecificData.domains[0].id);
                                    }}
                                    className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-50 transition-colors"
                                >
                                    Start Learning This Path <ArrowRight className="ml-2 w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        setSuggestionResult(null);
                                        setStep(0);
                                        setAnswers([]);
                                        setMode('manual');
                                    }}
                                    className="w-full py-4 bg-blue-500/20 text-white border border-white/20 rounded-2xl font-bold hover:bg-blue-500/30 transition-colors"
                                >
                                    Explorer Other Domains
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }

            if (isAnalyzing) {
                return (
                    <div className="max-w-2xl mx-auto py-24 text-center space-y-6 animate-fade-in">
                        <div className="relative w-24 h-24 mx-auto">
                            <Loader2 className="w-24 h-24 text-blue-500 animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analyzing Your Responses</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">NICOLAS is calculating your perfect {selectedBranch} specialization...</p>
                        </div>
                        {aiError && (
                            <p className="text-red-500 font-medium animate-pulse">{aiError}</p>
                        )}
                    </div>
                );
            }

            const currentQ = branchSpecificData.questions[step];
            return (
                <div className="max-w-2xl mx-auto py-12 space-y-12 animate-fade-in">
                    <button
                        onClick={() => {
                            if (step > 0) {
                                setStep(step - 1);
                                setAnswers(answers.slice(0, -1));
                            } else {
                                setMode('choice');
                            }
                        }}
                        className="flex items-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">AI SUGGESTION FOR {selectedBranch}</div>
                            <div className="text-sm font-bold text-gray-400">Question {step + 1} of {branchSpecificData.questions.length}</div>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-500"
                                style={{ width: `${((step + 1) / branchSpecificData.questions.length) * 100}%` }}
                            ></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white pt-4">{currentQ?.question}</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQ?.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswerSelect(opt)}
                                className="w-full p-6 text-left bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all font-medium text-gray-700 dark:text-gray-300 group flex justify-between items-center"
                            >
                                <span>{opt}</span>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // Manual Mode (default return if no early returns hit inside branch selection)
        return (
            <div className="space-y-6 md:space-y-8 animate-fade-in px-4 py-6 md:py-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <button onClick={() => setMode('choice')} className="flex items-center text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 md:mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Specialized {selectedBranch} Domains</h1>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Select the field you want to specialize in.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {(branchSpecificData?.domains || []).map(domain => (
                        <DomainCard key={domain.id} domain={domain} onSelect={handleDomainSelect} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {renderContent()}
            <ChatbotModal 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                domain={selectedBranch} 
            />
        </>
    );
}
