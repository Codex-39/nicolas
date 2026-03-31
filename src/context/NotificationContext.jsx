import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async (email) => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_email', email)
            .order('created_at', { ascending: false });

        if (error) console.error("Error loading notifications:", error);
        else setNotifications(data || []);
    };

    // Sync state when user changes (login/logout)
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        loadNotifications(user.email);

        // Subscription for new notifications
        const channel = supabase
            .channel(`notifications:${user.email}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_email=eq.${user.email}`
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'notifications',
                filter: `user_email=eq.${user.email}`
            }, (payload) => {
                setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'notifications',
                filter: `user_email=eq.${user.email}`
            }, (payload) => {
                setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
            })
            .subscribe();

        // Generate daily motivation if needed
        generateDailyMotivation(user.email);

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Add a notification for a specific user
    const addNotification = useCallback(async (targetEmail, notif) => {
        const { error } = await supabase.from('notifications').insert([{
            user_email: targetEmail,
            type: notif.type,
            message: notif.message,
            from_email: notif.fromEmail || null,
            title: notif.title || null,
            read: false
        }]);

        if (error) console.error("Error adding notification:", error);
    }, []);

    const markAsRead = async (notifId) => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notifId);

        if (error) console.error("Error marking notification as read:", error);
        else setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    };

    const markAllAsRead = async () => {
        if (!user) return;
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_email', user.email)
            .eq('read', false);

        if (error) console.error("Error marking all as read:", error);
        else setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = async () => {
        if (!user) return;
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_email', user.email);

        if (error) console.error("Error clearing notifications:", error);
        else setNotifications([]);
    };

    const generateDailyMotivation = async (email) => {
        const today = new Date().toISOString().split('T')[0];

        // Fetch metadata from localStorage since we don't have supabase.auth anymore
        if (!user || !user.id) return;
        const metaStr = localStorage.getItem(`nicolas_metadata_${user.id}`);
        const metadata = metaStr ? JSON.parse(metaStr) : {};
        if (metadata.last_motivation === today) return;

        const motivationalMessages = [
            "You're one step closer to cracking your dream career! 🔥",
            "Consistency builds mastery. Keep at it today! 🚀",
            "Ready to conquer a new domain? Your potential is limitless. ✨",
            "Small steps every day lead to big results. Focus on one chapter! 📖",
            "Don't stop now, your progress is inspiring! 💪"
        ];

        const randomMsg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

        await addNotification(email, {
            type: 'motivation',
            message: randomMsg
        });

        // Update local metadata with new date
        metadata.last_motivation = today;
        localStorage.setItem(`nicolas_metadata_${user.id}`, JSON.stringify(metadata));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount: notifications.filter(n => !n.read).length,
            markAsRead,
            markAllAsRead,
            clearAll,
            addNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
