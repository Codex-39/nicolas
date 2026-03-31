import React, { useState, useEffect } from 'react';
import { Users, Mail, ShieldCheck, LogOut, ArrowRight, BarChart3, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('login_users')
                .select('*');

            if (error) console.error("Error fetching users:", error);
            else setAllUsers(data || []);
        };

        fetchUsers();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredUsers = allUsers.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-sm">
                            <ShieldCheck className="w-5 h-5" />
                            Admin Console
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">System Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Monitoring Nicolas learning ecosystem activity.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm self-start"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                        <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/5 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Total Registered Users</div>
                            <div className="text-5xl font-black text-gray-900 dark:text-white">{allUsers.length}</div>
                            <div className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                View all <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                        <BarChart3 className="absolute -right-4 -bottom-4 w-32 h-32 text-purple-500/5 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Active Roles</div>
                            <div className="text-5xl font-black text-gray-900 dark:text-white">1</div>
                            <div className="mt-6 text-gray-400 font-medium text-sm">Role: Student</div>
                        </div>
                    </div>

                    <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg shadow-blue-500/20">
                        <div className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">System Status</div>
                        <div className="text-3xl font-black">Online</div>
                        <p className="mt-4 text-white/80 text-sm font-medium">All local modules operational.</p>
                    </div>
                </div>

                {/* Directory */}
                <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <Mail className="w-6 h-6 text-gray-400" />
                            User Directory
                        </h2>
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Name</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Access Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filteredUsers.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-gray-500 dark:text-gray-400 font-medium">{user.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                Student
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-12 text-center text-gray-400 italic">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
