import React, { useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function ChatbotModal({ isOpen, onClose, domain }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Append domain if available
  const iframeSrc = domain 
    ? `https://chatbot-sigma-murex-12.vercel.app/?domain=${encodeURIComponent(domain)}`
    : "https://chatbot-sigma-murex-12.vercel.app/";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center animate-fade-in sm:p-4 md:p-6">
      
      <div className="w-full sm:w-[95%] max-w-7xl h-full sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-none sm:rounded-[2rem] overflow-hidden relative shadow-2xl flex flex-col animate-slide-up border border-white/10">

        {/* Header / Close Button */}
        <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-white font-black text-xl">N</span>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                        NICOLAS AI
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Active Assistant</span>
                    </div>
                </div>
            </div>
            
            <button
                onClick={() => {
                    console.log("Closing Chatbot");
                    onClose();
                }}
                className="group bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-2.5 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
            >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
        </div>

        {/* Chatbot Iframe Content */}
        <div className="flex-1 w-full relative bg-white dark:bg-gray-950">
            {/* Loading Spinner Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-gray-950">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-sm font-medium">Connecting to NICOLAS...</p>
            </div>
            
            <iframe
                src={iframeSrc}
                className="w-full h-full border-none absolute inset-0 z-10"
                title="AI Chatbot"
                allow="microphone"
                loading="eager"
            />
        </div>
      </div>

    </div>
  );
}
