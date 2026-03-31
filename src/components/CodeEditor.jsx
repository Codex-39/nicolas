import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, ChevronDown, Loader2 } from 'lucide-react';

const LANGUAGES = [
    { id: 'python', label: 'Python 3' },
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'c', label: 'C' }
];

export default function CodeEditor({ question, value, onChange }) {
    const [language, setLanguage] = useState('python');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [activeTab, setActiveTab] = useState('editor'); // editor | testcases | output

    // Initialise the code editor with starter code if user hasn't typed anything
    const currentCode = value?.[language] ?? question.starter_code?.[language] ?? '';

    const handleCodeChange = (e) => {
        onChange({
            ...(value || {}),
            [language]: e.target.value,
            _selectedLang: language
        });
    };

    const handleLanguageSwitch = (lang) => {
        setLanguage(lang);
        // If user hasn't written code in the new language yet, load starter
        if (!value?.[lang]) {
            onChange({
                ...(value || {}),
                [lang]: question.starter_code?.[lang] ?? '',
                _selectedLang: lang
            });
        }
    };

    // Simulated code execution
    const handleRunCode = () => {
        setIsRunning(true);
        setActiveTab('output');

        setTimeout(() => {
            const sampleCases = question.test_cases.filter(tc => tc.is_sample);
            const codeText = currentCode.toLowerCase();

            // Simple heuristic: if the code contains a reasonable pattern, pass the tests
            const hasLoop = codeText.includes('for') || codeText.includes('while') || codeText.includes('reduce') || codeText.includes('sum');
            const hasReturn = codeText.includes('return') || codeText.includes('print');
            const hasLogic = hasLoop && hasReturn;
            const passRate = hasLogic ? 0.85 : (hasReturn ? 0.5 : 0.2);

            const results = sampleCases.map((tc, index) => ({
                input: tc.input,
                expected: tc.expected_output,
                actual: Math.random() < passRate ? tc.expected_output : 'Wrong Answer',
                passed: Math.random() < passRate,
                time: (Math.random() * 0.2 + 0.01).toFixed(3)
            }));

            setTestResults(results);
            setIsRunning(false);
        }, 1500);
    };

    // Run all test cases (submission simulation)
    const handleRunAll = () => {
        setIsRunning(true);
        setActiveTab('output');

        setTimeout(() => {
            const codeText = currentCode.toLowerCase();
            const hasLoop = codeText.includes('for') || codeText.includes('while') || codeText.includes('reduce') || codeText.includes('sum');
            const hasReturn = codeText.includes('return') || codeText.includes('print');
            const hasLogic = hasLoop && hasReturn;
            const passRate = hasLogic ? 0.8 : (hasReturn ? 0.4 : 0.1);

            const results = question.test_cases.map((tc, index) => ({
                input: tc.input,
                expected: tc.expected_output,
                actual: Math.random() < passRate ? tc.expected_output : 'Wrong Answer',
                passed: Math.random() < passRate,
                time: (Math.random() * 0.3 + 0.01).toFixed(3),
                hidden: !tc.is_sample
            }));

            setTestResults(results);
            setIsRunning(false);

            // Save results as part of the answer
            const passed = results.filter(r => r.passed).length;
            onChange({
                ...(value || {}),
                [language]: currentCode,
                _selectedLang: language,
                _testResults: results,
                _passedCount: passed,
                _totalCount: results.length
            });
        }, 2000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = e.target;
            const newCode = currentCode.substring(0, selectionStart) + '    ' + currentCode.substring(selectionEnd);
            onChange({
                ...(value || {}),
                [language]: newCode,
                _selectedLang: language
            });
            // Set cursor position after state update
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
            }, 0);
        }
    };

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-900">
            {/* Language Selector Bar */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
                <div className="flex gap-1">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.id}
                            onClick={() => handleLanguageSwitch(lang.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                                language === lang.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                    >
                        {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        Run
                    </button>
                    <button
                        onClick={handleRunAll}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Code Editor Area */}
            <div className="relative">
                <div className="flex">
                    {/* Line Numbers */}
                    <div className="bg-gray-800 text-gray-500 text-xs font-mono py-4 px-2 text-right select-none min-w-[40px] border-r border-gray-700">
                        {currentCode.split('\n').map((_, i) => (
                            <div key={i} className="leading-6">{i + 1}</div>
                        ))}
                    </div>
                    {/* Textarea */}
                    <textarea
                        value={currentCode}
                        onChange={handleCodeChange}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 outline-none resize-none min-h-[280px] leading-6 caret-white"
                        spellCheck="false"
                        placeholder="// Write your code here..."
                    />
                </div>
            </div>

            {/* Bottom Panel Tabs */}
            <div className="border-t border-gray-700 bg-gray-800">
                <div className="flex border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('testcases')}
                        className={`px-4 py-2 text-xs font-bold transition-colors ${
                            activeTab === 'testcases' ? 'text-white border-b-2 border-blue-500 bg-gray-900' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Test Cases
                    </button>
                    <button
                        onClick={() => setActiveTab('output')}
                        className={`px-4 py-2 text-xs font-bold transition-colors ${
                            activeTab === 'output' ? 'text-white border-b-2 border-blue-500 bg-gray-900' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Output {testResults && `(${testResults.filter(r => r.passed).length}/${testResults.length})`}
                    </button>
                </div>

                <div className="bg-gray-900 p-4 max-h-48 overflow-y-auto">
                    {activeTab === 'testcases' && (
                        <div className="space-y-3">
                            {question.test_cases.filter(tc => tc.is_sample).map((tc, i) => (
                                <div key={i} className="text-xs font-mono">
                                    <div className="text-gray-400 mb-1">Sample Test Case {i + 1}:</div>
                                    <div className="bg-gray-800 p-2 rounded mb-1">
                                        <span className="text-gray-500">Input: </span>
                                        <span className="text-yellow-300">{tc.input}</span>
                                    </div>
                                    <div className="bg-gray-800 p-2 rounded">
                                        <span className="text-gray-500">Expected: </span>
                                        <span className="text-green-400">{tc.expected_output}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'output' && (
                        <div className="space-y-2">
                            {isRunning ? (
                                <div className="flex items-center gap-2 text-yellow-300 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Running test cases...
                                </div>
                            ) : testResults ? (
                                <>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-sm font-bold ${testResults.every(r => r.passed) ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {testResults.filter(r => r.passed).length}/{testResults.length} test cases passed
                                        </span>
                                    </div>
                                    {testResults.map((result, i) => (
                                        <div key={i} className={`flex items-center gap-3 p-2 rounded text-xs font-mono ${result.passed ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                                            {result.passed ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-gray-400">
                                                    {result.hidden ? `Hidden Case ${i + 1}` : `Case ${i + 1}`}:
                                                </span>
                                                {!result.hidden && (
                                                    <span className="text-gray-300 ml-2">
                                                        Input: {result.input} → {result.passed ? <span className="text-green-400">{result.expected}</span> : <span className="text-red-400">{result.actual}</span>}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-gray-500 shrink-0">{result.time}s</span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-gray-500 text-sm">Click "Run" to execute your code against sample test cases.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
