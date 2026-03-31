import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BRANCH_DATA } from '../data/mockData';
import { useLearning } from '../context/LearningContext';
import { ArrowLeft, BookOpen, Video, FileText, CheckCircle, ChevronRight, Play } from 'lucide-react';

export default function ChapterContent() {
    const { branchId, domainId, chapterId } = useParams();
    const navigate = useNavigate();
    const { logActivity } = useLearning();
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    const branch = BRANCH_DATA[branchId];
    const domain = branch?.domains.find(d => d.id === domainId);
    const chapter = domain?.chapters.find(c => c.id === chapterId);

    useEffect(() => {
        logActivity();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
            if (isBottom) setScrolledToBottom(true);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!chapter) return <div className="p-12 text-center text-gray-500">Chapter not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8 animate-fade-in">
            <button
                onClick={() => navigate(`/roadmap/${branchId}/${domainId}`)}
                className="flex items-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap
            </button>

            <header className="space-y-4">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm tracking-widest uppercase">
                    <BookOpen className="w-4 h-4" />
                    Chapter Content
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{chapter.topic}</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">{chapter.desc}</p>
            </header>

            <section className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                {/* Video Content */}
                {chapter.video && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <Video className="w-5 h-5 text-red-500" /> Video Tutorial
                        </h2>
                        <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
                            <iframe
                                className="w-full h-full"
                                src={chapter.video}
                                title={chapter.topic}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Written Content */}
                <div className="space-y-8 prose dark:prose-invert max-w-none">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-6">
                        <FileText className="w-5 h-5 text-blue-500" /> Learning Material
                    </h2>

                    {chapter.sections ? (
                        <div className="space-y-10">
                            {chapter.sections.map((section, idx) => (
                                <div key={idx} className="space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-blue-500 pl-4">
                                        {section.title}
                                    </h3>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            {chapter.content}
                            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                <h4 className="font-bold mb-2">Key Takeaways:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Understanding the core principles of {chapter.topic}.</li>
                                    <li>Real-world applications and industry standards.</li>
                                    <li>Best practices for implementation.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resources */}
                {chapter.resources && (
                    <div className="space-y-4 pt-6 border-t dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">External Resources</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {chapter.resources.map((res, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{res.name}</span>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-none text-center px-4 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"
                                        >
                                            View Notes
                                        </a>
                                        <a
                                            href={res.url}
                                            download
                                            className="flex-1 sm:flex-none text-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
                                        >
                                            Download PDF
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Verification & Test Navigation */}
            <div className="sticky bottom-8 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${scrolledToBottom ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'} transition-colors`}>
                        <CheckCircle className={`w-6 h-6 ${scrolledToBottom ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                            {scrolledToBottom ? 'Content Verified' : 'Read to Complete'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {scrolledToBottom ? 'You can now start the chapter test.' : 'Scroll to the end to unlock the test.'}
                        </p>
                    </div>
                </div>

                <Link
                    to={scrolledToBottom ? `/test/${branchId}/${domainId}/${chapterId}` : '#'}
                    className={`
                        px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all
                        ${scrolledToBottom ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}
                    `}
                    onClick={(e) => !scrolledToBottom && e.preventDefault()}
                >
                    START CHAPTER TEST <Play className="w-4 h-4 fill-current" />
                </Link>
            </div>
        </div>
    );
}
