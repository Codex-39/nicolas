import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const SESSION_KEY = 'nicolas_user_session';

    const fetchUserProfile = async (id) => {
        try {
            const { data, error } = await supabase
                .from('login_users')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error);
                return null;
            }
            return data;
        } catch (err) {
            console.error("Profile fetch exception:", err);
            return null;
        }
    };

    const fetchProfileAndSetUser = useCallback(async (sessionUser) => {
        if (!sessionUser) {
            setUser(null);
            return;
        }

        // Fetch latest profile in the background
        const profile = await fetchUserProfile(sessionUser.id);

        if (profile) {
            setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                photo: profile.photo || null,
                role: profile.role || 'user'
            });
            // Update local storage just in case
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                id: profile.id,
                email: profile.email,
                name: profile.name
            }));
        } else {
            // Unlikely to happen unless deleted from db
            setUser(null);
            localStorage.removeItem(SESSION_KEY);
        }
    }, []);

    useEffect(() => {
        // Restore session on App Startup
        const initSession = async () => {
            try {
                const sessionStr = localStorage.getItem(SESSION_KEY);
                if (sessionStr) {
                    const sessionUser = JSON.parse(sessionStr);
                    // Set base user state immediately (no spinner delay)
                    setUser({
                        id: sessionUser.id,
                        email: sessionUser.email,
                        name: sessionUser.name,
                        photo: null,
                        role: 'user'
                    });
                    // Fetch full profile in background
                    fetchProfileAndSetUser(sessionUser);
                }
            } catch (err) {
                console.error("Session restoration error:", err);
            } finally {
                setLoading(false);
            }
        };

        initSession();
    }, [fetchProfileAndSetUser]);

    const signup = async (userData) => {
        try {
            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('login_users')
                .select('email')
                .eq('email', userData.email)
                .single();
            
            if (existingUser) {
                return { success: false, message: "User already exists with this email" };
            }

            // Insert into users table
            const { data, error } = await supabase
                .from('login_users')
                .insert([
                    {
                        email: userData.email,
                        password: userData.password, // IMPORTANT: Normally you'd hash this!
                        name: userData.name,
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error("Profile creation error:", error);
                return { success: false, message: error.message };
            }

            if (data) {
                const sessionUser = { id: data.id, email: data.email, name: data.name };
                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
                
                setUser({
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    role: 'user'
                });
                return { success: true };
            }
            return { success: false, message: "Signup failed to return user data" };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase
                .from('login_users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code === 'PGRST116') {
                // User not found, automatically sign them up
                const { data: newUser, error: insertError } = await supabase
                    .from('login_users')
                    .insert([
                        {
                            email: email,
                            password: password, // IMPORTANT: Normally you'd hash this!
                            name: email.split('@')[0],
                            created_at: new Date().toISOString()
                        }
                    ])
                    .select()
                    .single();

                if (insertError) {
                    console.error("Auto-signup creation error:", insertError);
                    return { success: false, message: insertError.message };
                }

                if (newUser) {
                    const sessionUser = { id: newUser.id, email: newUser.email, name: newUser.name };
                    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
                    
                    setUser({
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        role: 'user'
                    });
                    return { success: true, isNewUser: true };
                }
                return { success: false, message: "Signup failed to return user data" };
            } else if (error) {
                return { success: false, message: error.message };
            }

            if (data) {
                // Compare passwords
                if (data.password === password) {
                    const sessionUser = { id: data.id, email: data.email, name: data.name };
                    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
                    
                    setUser({
                        id: data.id,
                        email: data.email,
                        name: data.name,
                        role: data.role || 'user'
                    });
                    return { success: true, isNewUser: false };
                } else {
                    return { success: false, message: "Invalid email or password" };
                }
            }
            return { success: false, message: "Login failed" };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const adminLogin = (email, password) => {
        if (email === "admin@nicolas.com" && password === "admin123") {
            const adminUser = {
                id: 'admin-id',
                name: "Nicolas Admin",
                email: "admin@nicolas.com",
                role: "admin"
            };
            setUser(adminUser);
            // Optionally, we could set admin session in localStorage too
            localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
            return { success: true };
        } else {
            return { success: false, message: "Invalid admin credentials" };
        }
    };

    const logout = async () => {
        // Just clear the local session since we aren't using Supabase auth tokens
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    const updateProfile = async (updates) => {
        if (!user) return { success: false, message: "No user logged in" };

        const { error } = await supabase
            .from('login_users')
            .update(updates)
            .eq('id', user.id);

        if (error) return { success: false, message: error.message };

        setUser(prev => ({ ...prev, ...updates }));
        
        // Update local session data too
        const sessionStr = localStorage.getItem(SESSION_KEY);
        if (sessionStr) {
            const sessionData = JSON.parse(sessionStr);
            localStorage.setItem(SESSION_KEY, JSON.stringify({ ...sessionData, ...updates }));
        }

        return { success: true };
    };

    const value = {
        user,
        role: user?.role || null,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        adminLogin,
        signup,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : (
                <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};


