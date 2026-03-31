import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle, FileText } from 'lucide-react';

const TOPIC_QA = {
    dbms: [
        { q: "What is Normalization?", a: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller (and less redundant) tables and defining relationships between them." },
        { q: "Explain the ACID properties.", a: "ACID stands for Atomicity, Consistency, Isolation, and Durability. These are a set of properties of database transactions intended to guarantee data validity despite errors, power failures, and other mishaps." },
        { q: "What is an Index in SQL?", a: "An index is a performance tuning method of allowing faster retrieval of records from a database table. An index creates an entry for each value and it will be faster to retrieve data." },
        { q: "Difference between DROP, TRUNCATE, and DELETE?", a: "DELETE is a DML command used to delete rows (can be rolled back). TRUNCATE is a DDL command that removes all rows (cannot be rolled back easily, faster). DROP is a DDL command that removes the entire table structure and data." }
    ],
    os: [
        { q: "What is a Process vs Thread?", a: "A process is a program in execution containing its own memory space. A thread is a lightweight segment of a process; threads within the same process share the same memory space and resources." },
        { q: "Explain Deadlock and its necessary conditions.", a: "Deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process. Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait." },
        { q: "What is Virtual Memory?", a: "Virtual memory is a memory management capability of an OS that uses hardware and software to allow a computer to compensate for physical memory shortages by temporarily transferring data from random access memory (RAM) to disk storage." },
        { q: "Difference between paging and segmentation?", a: "Paging divides memory into fixed-size blocks (pages), while segmentation divides memory into variable-size blocks based on logical division (like functions or arrays)." }
    ],
    cn: [
        { q: "What are the layers of the OSI Model?", a: "Physical, Data Link, Network, Transport, Session, Presentation, Application (Please Do Not Throw Sausage Pizza Away)." },
        { q: "TCP vs UDP", a: "TCP (Transmission Control Protocol) is connection-oriented, reliable, guarantees delivery (e.g., HTTP, FTP). UDP (User Datagram Protocol) is connectionless, faster, but does not guarantee delivery (e.g., DNS, Video Streaming)." },
        { q: "What is DNS?", a: "Domain Name System translates human-readable domain names (like www.google.com) into IP addresses that computers use to identify each other on the network." },
        { q: "Explain the concept of an IP Address vs MAC Address.", a: "An IP address is a logical address configured by the network and provides routing over the internet. A MAC address is a physical address burned into the NIC by the manufacturer." }
    ],
    oops: [
        { q: "What are the 4 pillars of OOPs?", a: "Encapsulation (hiding data), Abstraction (hiding implementation details), Inheritance (reusing code), and Polymorphism (one name, many forms)." },
        { q: "Abstract Class vs Interface", a: "An abstract class can have both abstract and concrete methods, and supports single inheritance. An interface has only abstract methods (prior to Java 8) and supports multiple inheritance." },
        { q: "What is Method Overloading vs Overriding?", a: "Overloading is compile-time polymorphism where tools have the same name but different parameters. Overriding is runtime polymorphism where a subclass provides a specific implementation of a method already defined in its parent class." },
        { q: "What is a Constructor?", a: "A constructor is a special block of code that initializes a newly created object. It has the same name as the class and no return type." }
    ]
};

export default function CoreSubjectDetail({ topic, onBack }) {
    const [expandedIds, setExpandedIds] = useState([]);
    const questions = TOPIC_QA[topic.id] || [];

    const toggleAccordion = (idx) => {
        setExpandedIds(prev => 
            prev.includes(idx) ? prev.filter(id => id !== idx) : [...prev, idx]
        );
    };

    return (
        <div className="max-w-4xl mx-auto w-full animate-fade-in space-y-6">
            <button 
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 font-semibold"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Core Subjects
            </button>

            <div className={`bg-${topic.color}-50 dark:bg-${topic.color}-900/10 border border-${topic.color}-100 dark:border-${topic.color}-900/50 rounded-2xl p-8 mb-8 flex items-center gap-6`}>
                <div className={`w-16 h-16 bg-${topic.color}-100 dark:bg-${topic.color}-900/40 rounded-2xl flex items-center justify-center shrink-0`}>
                    <topic.icon className={`w-8 h-8 text-${topic.color}-600 dark:text-${topic.color}-400`} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{topic.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{topic.desc}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Frequently Asked Questions
                    </h3>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {questions.length} items
                    </span>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {questions.map((item, idx) => {
                        const isExpanded = expandedIds.includes(idx);
                        return (
                            <div key={idx} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                <button 
                                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none"
                                    onClick={() => toggleAccordion(idx)}
                                >
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg leading-snug pr-8">
                                        <span className="text-blue-500 mr-2">Q{idx + 1}.</span>
                                        {item.q}
                                    </h4>
                                    <div className={`mt-1 shrink-0 p-1 rounded-full transition-transform duration-300 ${isExpanded ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'text-gray-400'}`}>
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-800/10 ml-8 text-base">
                                        <div className="flex gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <div>{item.a}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="mt-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-6 text-amber-800 dark:text-amber-400">
                <h4 className="font-bold mb-2 flex items-center">💡 Interview Tip</h4>
                <p className="text-sm opacity-90">When explaining these core concepts, try to provide a real-world analogy. For example, explain threads as workers in a kitchen sharing the same ingredients (memory space).</p>
            </div>
        </div>
    );
}
