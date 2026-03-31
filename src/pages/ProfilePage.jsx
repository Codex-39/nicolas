import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Mail, Award, Edit, Rocket, Trophy, Star, Check, X, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { t } = useLanguage();
    const { badges, streak } = useLearning();
    const { user, updateProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");
    const [error, setError] = useState("");
    const [photoError, setPhotoError] = useState("");

    const fileInputRef = useRef(null);

    const handleSave = () => {
        if (!newName.trim()) {
            setError("Name cannot be empty");
            return;
        }
        updateProfile({ name: newName.trim() });
        setIsEditing(false);
        setError("");
    };

    const handleCancel = () => {
        setNewName(user.name);
        setIsEditing(false);
        setError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation: Image only
        if (!file.type.startsWith("image/")) {
            setPhotoError("Please select an image file (jpg, png, etc.)");
            return;
        }

        // Validation: Max 2MB
        if (file.size > 2 * 1024 * 1024) {
            setPhotoError("Image size must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            updateProfile({ photo: base64String });
            setPhotoError("");
        };
        reader.readAsDataURL(file);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    // Helper to get initials
    const getInitials = (name) => {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (!user) return null;

    return (
        <div className="space-y-8 animate-fade-in transition-colors duration-300">
            {/* Hidden Photo Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="flex items-center gap-2 text-sm text-blue-500 font-medium cursor-pointer hover:underline">
                <ArrowLeft className="w-4 h-4" />
                <Link to="/">{t('backToDashboard')}</Link>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="relative group">
                        <div
                            onClick={triggerFileSelect}
                            className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-1 cursor-pointer hover:scale-105 transition-transform duration-300"
                        >
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-4xl font-bold text-gray-900 dark:text-white border-4 border-white dark:border-gray-800 overflow-hidden relative">
                                {user.photo ? (
                                    <img
                                        src={user.photo}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getInitials(user.name)
                                )}
                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full border-4 border-white dark:border-gray-900 hover:scale-110 transition-transform shadow-lg z-10"
                            title="Edit Name"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {photoError && <p className="absolute -bottom-10 left-0 right-0 text-xs text-red-500 font-medium text-center">{photoError}</p>}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => {
                                                setNewName(e.target.value);
                                                if (error) setError("");
                                            }}
                                            className="text-2xl font-bold bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[250px]"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSave();
                                                if (e.key === 'Escape') handleCancel();
                                            }}
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-sm"
                                            >
                                                <Check className="w-4 h-4" /> Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold"
                                            >
                                                <X className="w-4 h-4" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                    {error && <p className="text-sm text-red-500 font-medium ml-1">{error}</p>}
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{user.name}</h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Student | Learning Enthusiast</p>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="w-4 h-4" /> India
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                <Mail className="w-4 h-4" /> {user.email}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-5 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center border border-blue-100 dark:border-blue-800 shadow-sm">
                            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{badges.length}</div>
                            <div className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-tighter">Badges</div>
                        </div>
                        <div className="px-5 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-center border border-orange-100 dark:border-orange-800 shadow-sm">
                            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{streak}</div>
                            <div className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-tighter">Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-500" />
                            Achievements
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {badges.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-3xl text-gray-400 italic">
                                No badges earned yet. Complete your first chapter!
                            </div>
                        ) : (
                            badges.map(badge => (
                                <div key={badge.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${badge.type === 'special' ? 'bg-indigo-50 dark:bg-indigo-900/20' :
                                        badge.type === 'domain' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                                            'bg-blue-50 dark:bg-blue-900/20'
                                        }`}>
                                        {badge.icon || '🎖️'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{badge.name}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            {badge.type.toUpperCase()} Achievement • {new Date(badge.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Rocket className="w-6 h-6 text-blue-500" />
                            Current Journey
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Keep pushing your limits! You've already made significant progress in your chosen domains.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
