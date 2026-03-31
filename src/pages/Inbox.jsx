import React, { useEffect } from 'react';
import { Bell, MessageSquare, UserPlus, Trophy, Sparkles, CheckCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';

export default function Inbox() {
    const { t } = useLanguage();
    const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

    // Mark all as read when entering the inbox
    useEffect(() => {
        markAllAsRead();
    }, []);

    // Helper for relative time (basic)
    const getRelativeTime = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${diffInDays}d ago`;
    };

    return (
        <div className="space-y-6 animate-fade-in transition-colors duration-300 max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('inbox')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('notificationsDesc') || 'Stay updated with your latest activity.'}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                        Clear all
                    </button>
                </div>
            </header>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your inbox is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xs">When you get notifications about your progress and friends, they will show up here.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => !notif.read && markAsRead(notif.id)}
                            className={`group flex items-center p-5 rounded-2xl border transition-all cursor-pointer ${notif.read
                                ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 hover:border-blue-200 dark:hover:border-blue-700 shadow-sm'
                                }`}
                        >
                            <div className={`p-3.5 rounded-2xl mr-5 shrink-0 transition-transform group-hover:scale-110 ${notif.type === 'friend_request' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                notif.type === 'motivation' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                    notif.type === 'achievement' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                }`}>
                                {notif.type === 'friend_request' && <UserPlus className="w-5 h-5 font-bold" />}
                                {notif.type === 'motivation' && <Sparkles className="w-5 h-5 font-bold" />}
                                {notif.type === 'achievement' && <Trophy className="w-5 h-5 font-bold" />}
                                {notif.type === 'system' && <Bell className="w-5 h-5 font-bold" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <p className={`text-sm md:text-base ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white font-bold'}`}>
                                        {notif.fromEmail && <span className="text-blue-600 dark:text-blue-400">{notif.fromEmail.split('@')[0]} </span>}
                                        {notif.message}
                                    </p>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0 whitespace-nowrap mt-1">
                                        {getRelativeTime(notif.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {!notif.read && (
                                <div className="ml-4 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
