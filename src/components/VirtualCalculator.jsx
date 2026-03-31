import React, { useState } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';

export default function VirtualCalculator({ onClose }) {
    const [display, setDisplay] = useState('0');
    const [isMinimized, setIsMinimized] = useState(false);

    const handleInput = (val) => {
        if (display === '0' && val !== '.') {
            setDisplay(val);
        } else {
            setDisplay(display + val);
        }
    };

    const handleClear = () => setDisplay('0');

    const handleCalculate = () => {
        try {
            // Unsafe eval for a simple simulation, ideally use a safe math parser
            const result = eval(display); 
            setDisplay(String(result));
        } catch (e) {
            setDisplay('Error');
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-xl shadow-xl flex items-center gap-3 cursor-pointer z-50 hover:bg-blue-700" onClick={() => setIsMinimized(false)}>
                <span className="font-bold">Calculator</span>
                <Maximize2 className="w-4 h-4" />
            </div>
        );
    }

    return (
        <div className="fixed top-20 right-10 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 w-72 z-50 overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center cursor-move">
                <span className="font-bold text-sm">GATE Calculator</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(true)} className="hover:text-blue-200 transition-colors"><Minimize2 className="w-4 h-4" /></button>
                    <button onClick={onClose} className="hover:text-red-300 transition-colors"><X className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="p-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-2 text-right mb-4 text-xl font-mono text-gray-800 dark:text-white overflow-hidden h-10 flex items-center justify-end">
                    {display}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                        <button 
                            key={btn}
                            onClick={() => btn === '=' ? handleCalculate() : handleInput(btn)}
                            className={`p-2 rounded font-bold transition-colors ${
                                btn === '=' ? 'bg-blue-600 text-white hover:bg-blue-700 col-span-2' : 
                                ['/', '*', '-', '+'].includes(btn) ? 'bg-gray-300 dark:bg-gray-600 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500' :
                                'bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        >
                            {btn}
                        </button>
                    ))}
                    <button onClick={handleClear} className="col-span-4 mt-2 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600 transition-colors">
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}
