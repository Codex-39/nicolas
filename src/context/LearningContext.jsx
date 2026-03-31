import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { supabase } from '../lib/supabaseClient';
import { BRANCH_DATA } from '../data/mockData';

const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    const [enrolledDomains, setEnrolledDomains] = useState({});
    const [activeDomainId, setActiveDomainId] = useState(null);
    const [badges, setBadges] = useState([]);
    const [activityHistory, setActivityHistory] = useState([]);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [activeDays, setActiveDays] = useState(0);
    const [loading, setLoading] = useState(true);

    // Load data from Supabase — uses getSession() directly to avoid timing issues on refresh
    useEffect(() => {
        const loadProgress = async () => {
            // Get session from localStorage
            const sessionStr = localStorage.getItem('nicolas_user_session');
            const sessionUser = sessionStr ? JSON.parse(sessionStr) : null;
            const userId = sessionUser?.id;

            if (!userId) {
                setEnrolledDomains({});
                setActiveDomainId(null);
                setBadges([]);
                setActivityHistory([]);
                setStreak(0);
                setLongestStreak(0);
                setActiveDays(0);
                setLoading(false);
                return;
            }

            setLoading(true);

            // Fetch chapter progress from Supabase progress table
            const { data: progressData, error: progressError } = await supabase
                .from('progress')
                .select('*')
                .eq('user_id', userId);

            if (progressError) {
                console.error("Error loading progress:", progressError);
            } else {
                // Reconstruct enrolledDomains from progress records
                const newEnrolledDomains = {};
                progressData.forEach(record => {
                    const domainId = record.course;

                    // Skip special marker records
                    if (!domainId) return;

                    // Infer branchId from BRANCH_DATA
                    let branchId = 'default';
                    for (const bId in BRANCH_DATA) {
                        if (BRANCH_DATA[bId].domains && BRANCH_DATA[bId].domains.some(d => d.id === domainId)) {
                            branchId = bId;
                            break;
                        }
                    }

                    if (!newEnrolledDomains[domainId]) {
                        newEnrolledDomains[domainId] = {
                            id: domainId,
                            branchId: branchId,
                            progress: 0,
                            completedChapters: [],
                            chapterScores: {},
                            isCompleted: false,
                            todoList: []
                        };
                    }

                    if (record.chapter === '__domain_complete__') {
                        newEnrolledDomains[domainId].isCompleted = true;
                    } else if (record.completed && record.chapter && record.chapter !== '__enrolled__') {
                        if (!newEnrolledDomains[domainId].completedChapters.includes(record.chapter)) {
                            newEnrolledDomains[domainId].completedChapters.push(record.chapter);
                        }
                        if (record.score !== undefined) {
                            newEnrolledDomains[domainId].chapterScores[record.chapter] = record.score;
                        }
                    }
                });
                setEnrolledDomains(newEnrolledDomains);
            }

            // Fetch metadata (badges, streaks) from localStorage
            const metaStr = localStorage.getItem(`nicolas_metadata_${userId}`);

            if (metaStr) {
                const meta = JSON.parse(metaStr);
                setBadges(meta.badges || []);
                setActivityHistory(meta.activityHistory || []);
                setStreak(meta.streak || 0);
                setLongestStreak(meta.longestStreak || 0);
                setActiveDays((meta.activityHistory || []).length);
            }

            setLoading(false);
        };

        loadProgress();
    }, [user]);

    // Centralized save function
    const saveProgressToSupabase = async (updates) => {
        const sessionStr = localStorage.getItem('nicolas_user_session');
        const sessionUser = sessionStr ? JSON.parse(sessionStr) : null;
        const userId = sessionUser?.id;
        if (!userId) return;

        // If updating a chapter completion
        if (updates.chapterUpdate) {
            const { domainId, chapterId, completed, score } = updates.chapterUpdate;

            // Delete any existing record to prevent duplicates
            await supabase
                .from('progress')
                .delete()
                .eq('user_id', userId)
                .eq('course', domainId)
                .eq('chapter', chapterId);

            const { error } = await supabase
                .from('progress')
                .insert({
                    user_id: userId,
                    course: domainId,
                    chapter: chapterId,
                    completed: completed,
                    score: score || 0,
                    created_at: new Date().toISOString()
                });

            if (error) console.error("Error saving chapter progress:", error);
        }

        // Save metadata (badges, streaks, history) to localStorage
        const metadata = {
            badges: updates.badges || badges,
            activityHistory: updates.activityHistory || activityHistory,
            streak: updates.streak !== undefined ? updates.streak : streak,
            longestStreak: updates.longestStreak !== undefined ? updates.longestStreak : longestStreak,
        };

        localStorage.setItem(`nicolas_metadata_${userId}`, JSON.stringify(metadata));
    };

    // Helper to calculate streaks
    const calculateStreaks = (history) => {
        if (!history || history.length === 0) return { current: 0, longest: 0 };
        const sortedDates = [...new Set(history)].sort((a, b) => new Date(b) - new Date(a));
        let current = 0;
        let longest = 0;
        let tempLongest = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let isStreakActive = sortedDates[0] === today || sortedDates[0] === yesterday;

        if (isStreakActive) {
            let lastDate = new Date(sortedDates[0]);
            current = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const currentDate = new Date(sortedDates[i]);
                const diffTime = Math.abs(lastDate - currentDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    current++;
                    lastDate = currentDate;
                } else {
                    break;
                }
            }
        }
        const ascDates = [...sortedDates].reverse();
        tempLongest = 1;
        longest = 1;
        for (let i = 1; i < ascDates.length; i++) {
            const prev = new Date(ascDates[i - 1]);
            const curr = new Date(ascDates[i]);
            const diffDays = Math.ceil(Math.abs(curr - prev) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                tempLongest++;
            } else {
                tempLongest = 1;
            }
            if (tempLongest > longest) longest = tempLongest;
        }
        return { current, longest: Math.max(longest, current) };
    };

    const logActivity = () => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];

        if (activityHistory.includes(today)) return;

        const newHistory = [...activityHistory, today];
        const stats = calculateStreaks(newHistory);

        setActivityHistory(newHistory);
        setStreak(stats.current);
        setLongestStreak(stats.longest);
        setActiveDays(newHistory.length);

        saveProgressToSupabase({
            activityHistory: newHistory,
            streak: stats.current,
            longestStreak: stats.longest
        });
    };

    // Enroll in a new domain
    const enrollInDomain = async (branchId, domainId) => {
        if (!enrolledDomains[domainId]) {
            setEnrolledDomains(prev => ({
                ...prev,
                [domainId]: {
                    id: domainId,
                    branchId: branchId,
                    progress: 0,
                    completedChapters: [],
                    chapterScores: {},
                    isCompleted: false,
                    todoList: []
                }
            }));

            const sessionStr = localStorage.getItem('nicolas_user_session');
            const sessionUser = sessionStr ? JSON.parse(sessionStr) : null;
            const userId = sessionUser?.id;

            if (userId) {
                // Check if enrollment record already exists
                const { data: existing } = await supabase
                    .from('progress')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('course', domainId)
                    .eq('chapter', '__enrolled__')
                    .maybeSingle();

                if (!existing) {
                    const { error } = await supabase
                        .from('progress')
                        .insert({
                            user_id: userId,
                            course: domainId,
                            chapter: '__enrolled__',
                            completed: false,
                            score: 0,
                            created_at: new Date().toISOString()
                        });
                    if (error) console.error("Error persisting enrollment:", error);
                }
            }
        }
        setActiveDomainId(domainId);
    };

    // Mark chapter as completed
    const completeChapter = (domainId, chapterId, score = 0) => {
        setEnrolledDomains(prev => {
            const domain = prev[domainId];
            if (!domain) return prev;

            const newCompleted = domain.completedChapters.includes(chapterId)
                ? domain.completedChapters
                : [...domain.completedChapters, chapterId];

            return {
                ...prev,
                [domainId]: {
                    ...domain,
                    completedChapters: newCompleted,
                    chapterScores: {
                        ...domain.chapterScores,
                        [chapterId]: score
                    }
                }
            };
        });

        saveProgressToSupabase({
            chapterUpdate: { domainId, chapterId, completed: true, score }
        });

        // Award badge
        const badgeId = `chapter_${domainId}_${chapterId}`;
        if (!badges.find(b => b.id === badgeId)) {
            addBadge({
                id: badgeId,
                name: `${chapterId} Champion`,
                domainId: domainId,
                type: 'chapter',
                icon: '🎖️',
                date: new Date().toISOString()
            });
        }
    };

    const addBadge = (badge) => {
        if (badges.find(b => b.id === badge.id)) return;

        const newBadges = [...badges, badge];
        setBadges(newBadges);

        if (user) {
            addNotification(user.email, {
                type: 'achievement',
                message: `Unlocked achievement: ${badge.name}! 🏆`
            });
        }

        saveProgressToSupabase({ badges: newBadges });
    };

    const completeDomain = (domainId, score = 0) => {
        const isRocket = score >= 45;
        setEnrolledDomains(prev => {
            const domain = prev[domainId];
            if (!domain) return prev;
            return {
                ...prev,
                [domainId]: { ...domain, isCompleted: true }
            };
        });

        saveProgressToSupabase({
            chapterUpdate: { domainId, chapterId: '__domain_complete__', completed: true, score }
        });

        addBadge({
            id: `domain_${domainId}`,
            name: `${domainId} Specialist`,
            domainId: domainId,
            type: 'domain',
            icon: '🏆',
            date: new Date().toISOString()
        });

        if (isRocket) {
            addBadge({
                id: `rocket_${domainId}`,
                name: `🚀 Rocket Learner`,
                domainId: domainId,
                type: 'special',
                icon: '🚀',
                date: new Date().toISOString()
            });
        }
    };

    const addTodo = (domainId, task) => {
        setEnrolledDomains(prev => {
            const domain = prev[domainId];
            if (!domain) return prev;
            return {
                ...prev,
                [domainId]: {
                    ...domain,
                    todoList: [...domain.todoList, { id: Date.now(), text: task, completed: false }]
                }
            };
        });
    };

    const toggleTodo = (domainId, todoId) => {
        setEnrolledDomains(prev => {
            const domain = prev[domainId];
            if (!domain) return prev;
            return {
                ...prev,
                [domainId]: {
                    ...domain,
                    todoList: domain.todoList.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
                }
            };
        });
        logActivity();
    };

    return (
        <LearningContext.Provider value={{
            enrolledDomains,
            activeDomainId,
            setActiveDomainId,
            badges,
            streak,
            longestStreak,
            activeDays,
            activityHistory,
            enrollInDomain,
            completeChapter,
            completeDomain,
            addTodo,
            toggleTodo,
            logActivity,
            loading
        }}>
            {children}
        </LearningContext.Provider>
    );
};

export const useLearning = () => {
    const context = useContext(LearningContext);
    if (!context) {
        throw new Error("useLearning must be used within a LearningProvider");
    }
    return context;
};
