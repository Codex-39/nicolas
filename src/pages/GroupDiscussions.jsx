import React, { useState, useEffect, useRef } from 'react';
import { Users, Hash, ArrowRight, Send, ArrowLeft, MoreVertical, Paperclip, Smile, MessageCircle, Plus, UserPlus, Copy, LogOut, Trash, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function GroupDiscussion() {
    const { t } = useLanguage();
    const { user: currentUser } = useAuth();
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [myGroups, setMyGroups] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef(null);
    const menuRef = useRef(null);

    // Form states
    const [groupName, setGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');

    const emojis = ['👋', '😊', '😂', '🔥', '🚀', '💯', '👏', '🙌', '💡', '📚', '💻', '✨', '✅', '❌', '🙏', '❤️'];

    // Load Groups List
    useEffect(() => {
        if (!currentUser) return;

        const loadGroups = async () => {
            const { data: memberData } = await supabase
                .from('group_members')
                .select('group_id')
                .eq('user_email', currentUser.email);

            if (memberData?.length > 0) {
                const groupIds = memberData.map(m => m.group_id);
                const { data: groupsData } = await supabase
                    .from('groups')
                    .select('*')
                    .in('id', groupIds);
                setMyGroups(groupsData || []);
            } else {
                setMyGroups([]);
            }
        };

        loadGroups();
    }, [currentUser]);

    // Load Messages & Subscription
    useEffect(() => {
        if (!activeGroup) return;

        const loadMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('group_id', activeGroup.id)
                .order('created_at', { ascending: true });
            setMessages(data || []);
        };

        loadMessages();

        // Realtime subscription
        const channel = supabase
            .channel(`group:${activeGroup.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `group_id=eq.${activeGroup.id}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState();
                const online = Object.values(newState).flat().map(p => p.email);
                setOnlineUsers([...new Set(online)]);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ email: currentUser.email, online_at: new Date().toISOString() });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeGroup, currentUser]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeGroup]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || !inviteCode.trim()) return;

        const { data: existing } = await supabase
            .from('groups')
            .select('id')
            .eq('group_code', inviteCode.trim().toUpperCase())
            .single();

        if (existing) {
            setError('This Code is already taken. Try another.');
            return;
        }

        const { data: groupData, error: groupErr } = await supabase
            .from('groups')
            .insert([{
                group_name: groupName.trim(),
                group_code: inviteCode.trim().toUpperCase(),
                admin_email: currentUser.email
            }])
            .select()
            .single();

        if (groupErr) {
            setError(groupErr.message);
            return;
        }

        // Add creator as member
        await supabase.from('group_members').insert([{
            group_id: groupData.id,
            user_email: currentUser.email
        }]);

        setMyGroups(prev => [...prev, groupData]);
        setIsCreateModalOpen(false);
        setGroupName('');
        setInviteCode('');
        setError('');
        setActiveGroup(groupData);
    };

    const handleJoinGroup = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        const { data: group, error: groupErr } = await supabase
            .from('groups')
            .select('*')
            .eq('group_code', joinCode.trim().toUpperCase())
            .single();

        if (groupErr || !group) {
            setError('Group not found. Check the Code and try again.');
            return;
        }

        const { data: existingMember } = await supabase
            .from('group_members')
            .select('*')
            .eq('group_id', group.id)
            .eq('user_email', currentUser.email)
            .single();

        if (existingMember) {
            setError('You are already a member of this group.');
            return;
        }

        await supabase.from('group_members').insert([{
            group_id: group.id,
            user_email: currentUser.email
        }]);

        setMyGroups(prev => [...prev, group]);
        setIsJoinModalOpen(false);
        setJoinCode('');
        setError('');
        setActiveGroup(group);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !activeGroup) return;

        const { error } = await supabase.from('messages').insert([{
            group_id: activeGroup.id,
            sender_email: currentUser.email,
            message: newMessage.trim()
        }]);

        if (error) console.error("Error sending message:", error);

        setNewMessage('');
        setIsEmojiOpen(false);
    };

    const handleLeaveGroup = async () => {
        await supabase
            .from('group_members')
            .delete()
            .eq('group_id', activeGroup.id)
            .eq('user_email', currentUser.email);

        setMyGroups(prev => prev.filter(g => g.id !== activeGroup.id));
        setActiveGroup(null);
        setIsMenuOpen(false);
    };

    const handleDeleteGroup = async () => {
        // SQL might need cascading deletes or manual cleanup
        await supabase.from('groups').delete().eq('id', activeGroup.id);
        setMyGroups(prev => prev.filter(g => g.id !== activeGroup.id));
        setActiveGroup(null);
        setIsMenuOpen(false);
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(activeGroup.group_code);
        alert(`Group Code ${activeGroup.group_code} copied!`);
        setIsMenuOpen(false);
    };

    const addEmoji = (emoji) => {
        setNewMessage(prev => prev + emoji);
    };

    if (activeGroup) {
        const isAdmin = activeGroup.admin_email === currentUser.email;

        return (
            <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveGroup(null)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                            <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{activeGroup.group_name}</h3>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                {onlineUsers.length} ONLINE
                            </p>
                        </div>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={copyInviteCode} className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                                    <Copy className="w-4 h-4 text-blue-500" /> Copy Group Code
                                </button>
                                <button onClick={handleLeaveGroup} className="w-full px-4 py-2.5 text-left text-sm font-bold text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 flex items-center gap-3 transition-colors">
                                    <LogOut className="w-4 h-4" /> Leave Group
                                </button>
                                {isAdmin && (
                                    <button onClick={handleDeleteGroup} className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 transition-colors">
                                        <Trash className="w-4 h-4" /> Delete Group
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50"
                    style={{
                        backgroundImage: `url('https://i.pinimg.com/originals/97/c2/da/97c2da5bd1f7607797745778a48e778a.jpg')`,
                        backgroundBlendMode: 'overlay',
                        backgroundSize: 'cover'
                    }}
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 text-purple-600" />
                            </div>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No messages yet.</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender_email === currentUser?.email;
                            const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className={`max-w-[80%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                        {!isMe && (
                                            <div className="flex items-center gap-1.5 ml-1 mb-0.5">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{msg.sender_email.split('@')[0]}</span>
                                            </div>
                                        )}
                                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm group relative ${isMe
                                            ? 'bg-purple-600 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                                            }`}>
                                            {msg.message}
                                            <div className={`text-[10px] mt-1 flex items-center gap-2 justify-end ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                                                {time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 relative">
                    {isEmojiOpen && (
                        <div className="absolute bottom-full left-4 mb-2 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 grid grid-cols-4 md:grid-cols-8 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {emojis.map(e => (
                                <button key={e} type="button" onClick={() => addEmoji(e)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all text-xl">
                                    {e}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl focus-within:ring-2 ring-purple-500/20 transition-all border border-transparent focus-within:border-purple-500/30">
                        <button
                            type="button"
                            onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                            className={`p-2 rounded-xl transition-colors ${isEmojiOpen ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' : 'text-gray-400 hover:text-purple-600'}`}
                        >
                            <Smile className="w-6 h-6" />
                        </button>
                        <input
                            type="text"
                            placeholder="Message group..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white px-2 placeholder:text-gray-400 font-medium"
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                                setError('');
                            }}
                        />
                        <button
                            disabled={!newMessage.trim()}
                            className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:grayscale disabled:scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in transition-colors duration-300 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('groupDiscussions')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('groupsDesc') || 'Create discovery channels or join shared group prepared by your peers.'}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => setIsJoinModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Join Group
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl text-sm font-black hover:bg-purple-700 hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Group
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {myGroups.length > 0 ? (
                    myGroups.map((group) => {
                        return (
                            <div
                                key={group.id}
                                onClick={() => setActiveGroup(group)}
                                className="group bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

                                <div className="flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                            <Hash className="w-7 h-7 text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors uppercase tracking-tight mb-2 truncate">{group.group_name}</h3>

                                    <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Group Code: {group.group_code}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-all transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-sm mb-6">
                            <Users className="w-10 h-10 text-gray-200" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">No groups found</h2>
                        <p className="text-gray-500 max-w-xs mt-2 font-medium">Join a group via Code or create your own community.</p>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Create Group</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateGroup} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Group Name</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    placeholder="e.g. Competitive Coding"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Unique Group Code</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. DSA_HUB"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all uppercase tracking-widest"
                                    value={inviteCode}
                                    onChange={(e) => {
                                        setInviteCode(e.target.value.replace(/\s/g, '_'));
                                        setError('');
                                    }}
                                />
                                {error && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">{error}</p>}
                            </div>

                            <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                                Create & Launch
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Join Group Modal */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Join Community</h2>
                            <button onClick={() => setIsJoinModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleJoinGroup} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Paste Group Code</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    placeholder="ENTER_GROUP_CODE"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all uppercase tracking-widest"
                                    value={joinCode}
                                    onChange={(e) => {
                                        setJoinCode(e.target.value);
                                        setError('');
                                    }}
                                />
                                {error && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">{error}</p>}
                            </div>

                            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                                Join Now
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
