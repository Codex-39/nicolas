import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, MessageCircle, CheckCircle, XCircle, UserCheck, Users, Clock, UserMinus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../lib/supabaseClient';

export default function Friends() {
    const { t } = useLanguage();
    const { user: currentUser } = useAuth();
    const { addNotification } = useNotifications();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('find');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const loadData = async () => {
            setLoading(true);

            // 1. Fetch all users for discovery
            const { data: usersData } = await supabase.from('login_users').select('*');
            setAllUsers(usersData || []);

            // 2. Fetch my friends (accepted status)
            const { data: friendsData } = await supabase
                .from('friends')
                .select('*')
                .or(`sender_email.eq.${currentUser.email},receiver_email.eq.${currentUser.email}`)
                .eq('status', 'accepted');

            const friendList = (friendsData || []).map(f =>
                f.sender_email === currentUser.email ? f.receiver_email : f.sender_email
            );
            setFriends(friendList);

            // 3. Fetch pending requests sent to me
            const { data: requestsData } = await supabase
                .from('friends')
                .select('*')
                .eq('receiver_email', currentUser.email)
                .eq('status', 'pending');

            const formattedRequests = (requestsData || []).map(r => ({
                from: r.sender_email,
                fromName: usersData?.find(u => u.email === r.sender_email)?.name || r.sender_email,
                id: r.id
            }));
            setRequests(formattedRequests);

            setLoading(false);
        };

        loadData();
    }, [currentUser]);

    if (!currentUser || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-500 font-medium">Loading friends...</p>
            </div>
        );
    }

    const handleSendRequest = async (targetUser) => {
        const { error } = await supabase.from('friends').insert([{
            sender_email: currentUser.email,
            receiver_email: targetUser.email,
            status: 'pending'
        }]);

        if (error) {
            console.error("Error sending friend request:", error);
            return;
        }

        addNotification(targetUser.email, {
            type: 'friend_request',
            fromEmail: currentUser.email,
            message: `sent you a friend request.`
        });

        setSearchTerm('');
        // Optimization: Refresh look
    };

    const handleAcceptRequest = async (request) => {
        const { error } = await supabase
            .from('friends')
            .update({ status: 'accepted' })
            .eq('id', request.id);

        if (error) {
            console.error("Error accepting friend request:", error);
            return;
        }

        setFriends(prev => [...prev, request.from]);
        setRequests(prev => prev.filter(r => r.id !== request.id));

        addNotification(request.from, {
            type: 'system',
            message: `${currentUser.name} accepted your friend request! 🎉`
        });
    };

    const handleRejectRequest = async (request) => {
        const { error } = await supabase
            .from('friends')
            .delete()
            .eq('id', request.id);

        if (error) {
            console.error("Error rejecting friend request:", error);
            return;
        }

        setRequests(prev => prev.filter(r => r.id !== request.id));
    };

    const handleRemoveFriend = async (friendEmail) => {
        const { error } = await supabase
            .from('friends')
            .delete()
            .or(`and(sender_email.eq.${currentUser.email},receiver_email.eq.${friendEmail}),and(sender_email.eq.${friendEmail},receiver_email.eq.${currentUser.email})`);

        if (error) {
            console.error("Error removing friend:", error);
            return;
        }

        setFriends(prev => prev.filter(e => e !== friendEmail));
    };

    const discoverableUsers = allUsers.filter(u =>
        u.email !== currentUser.email &&
        !friends.includes(u.email)
    );

    const myFriendsList = allUsers.filter(u => friends.includes(u.email));

    return (
        <div className="space-y-8 animate-fade-in transition-colors duration-300">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('friends')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('friendsDesc') || 'Connect and grow with your peers.'}</p>
                </div>
            </header>

            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
                {[
                    { id: 'friends', label: 'My Friends', icon: Users, count: friends.length },
                    { id: 'find', label: 'Find Friends', icon: Search },
                    { id: 'requests', label: 'Requests', icon: Clock, count: requests.length }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {activeTab === 'find' && (
                    <>
                        <div className="relative group max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search students by name or email..."
                                className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-gray-900 dark:text-white transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {discoverableUsers
                                .filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((user) => (
                                    <UserCard
                                        key={user.email}
                                        user={user}
                                        onAction={() => handleSendRequest(user)}
                                        actionType="add"
                                        isPending={false} // Would need a separate fetch for sent requests
                                    />
                                ))}
                        </div>
                    </>
                )}

                {activeTab === 'friends' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myFriendsList.length > 0 ? (
                            myFriendsList.map((user) => (
                                <UserCard
                                    key={user.email}
                                    user={user}
                                    onAction={() => handleRemoveFriend(user.email)}
                                    actionType="remove"
                                />
                            ))
                        ) : (
                            <EmptyState message="You haven't added any friends yet. Go to Find Friends to start connecting!" />
                        )}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <div key={req.from} className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center font-bold text-blue-600">
                                            {req.fromName?.charAt(0) || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{req.fromName}</p>
                                            <p className="text-xs text-gray-500 truncate">{req.from}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAcceptRequest(req)}
                                            className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleRejectRequest(req)}
                                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Ignore
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="No pending friend requests." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function UserCard({ user, onAction, actionType, isPending }) {
    return (
        <div className="group bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.name || user.email.split('@')[0]}</h3>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">{user.email}</p>
            </div>
            <div className="shrink-0">
                {isPending ? (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-xl" title="Pending">
                        <Clock className="w-5 h-5" />
                    </div>
                ) : actionType === 'add' ? (
                    <button
                        onClick={onAction}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-110 transition-all shadow-lg shadow-blue-500/20"
                        title="Add Friend"
                    >
                        <UserPlus className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={onAction}
                        className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                        title="Remove Friend"
                    >
                        <UserMinus className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs">{message}</p>
        </div>
    );
}
