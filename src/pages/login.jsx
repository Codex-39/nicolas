import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Pencil, Pen, Book, Mail, Lock, ArrowRight, User, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FloatingIcon = ({ Icon, top, left, delay, size = 24 }) => (
  <div
    className="absolute text-blue-600/10 dark:text-blue-400/10 animate-float pointer-events-none"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      animationDelay: `${delay}s`,
      fontSize: size
    }}
  >
    <Icon size={size} />
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const { login, signup, adminLogin } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const validate = () => {
    const newErrors = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!validate()) return;

    if (isAdminMode) {
      const result = adminLogin(formData.email, formData.password);
      if (result.success) {
        navigate("/admin-dashboard");
      } else {
        setAuthError(result.message);
      }
    } else if (isSignUp) {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (result.success) {
        navigate("/");
      } else {
        setAuthError(result.message);
      }
    } else {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setAuthError(result.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setAuthError("");
    setFormData({ name: "", email: "", password: "" });
  };

  const floatingIcons = [
    { Icon: GraduationCap, top: 10, left: 15, delay: 0, size: 40 },
    { Icon: Pencil, top: 20, left: 80, delay: 1, size: 30 },
    { Icon: Book, top: 70, left: 10, delay: 2, size: 35 },
    { Icon: Pen, top: 80, left: 85, delay: 1.5, size: 25 },
    { Icon: GraduationCap, top: 40, left: 90, delay: 3, size: 28 },
    { Icon: Book, top: 15, left: 45, delay: 0.5, size: 32 },
    { Icon: Pencil, top: 85, left: 40, delay: 2.5, size: 24 },
    { Icon: Pen, top: 50, left: 5, delay: 4, size: 30 },
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
      {/* Background Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingIcons.map((icon, index) => (
          <FloatingIcon key={index} {...icon} />
        ))}
      </div>

      {/* Login Card Container */}
      <div className={`relative z-10 w-full max-w-md px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${isAdminMode ? 'bg-gray-900 shadow-gray-200' : 'bg-blue-600 shadow-blue-200'} text-white shadow-lg mb-6 animate-fade-in`}>
              <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              NICOLAS
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {isAdminMode ? "Admin Portal" : (isSignUp ? "Create Account" : "Welcome Back")}
            </h2>
            <p className="text-gray-500 text-sm">
              {isAdminMode ? "Access system level controls" : (isSignUp ? "Start your learning journey today" : "Login to continue your learning journey")}
            </p>
          </div>

          {/* Admin Toggle */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setIsSignUp(false);
                setAuthError("");
                setFormData({ name: "", email: "", password: "" });
              }}
              className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              {isAdminMode ? "Back to User Login" : "Log in as Admin"}
            </button>
          </div>

          {/* Tabs - Hidden in Admin Mode */}
          {!isAdminMode && (
            <div className="flex bg-gray-100/50 p-1.5 rounded-2xl mb-8">
              <button
                onClick={() => { if (isSignUp) toggleMode(); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { if (!isSignUp) toggleMode(); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Global Error message */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-shake">
              <AlertCircle size={20} />
              <span className="font-medium">{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-2xl text-gray-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${errors.name ? 'border-red-200 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-100 focus:ring-blue-500/20 focus:border-blue-500'}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 ml-1 font-medium">{errors.name}</p>}
              </div>
            )}


            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-2xl text-gray-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${errors.email ? 'border-red-200 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-100 focus:ring-blue-500/20 focus:border-blue-500'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-1 font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                {!isSignUp && (
                  <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-2xl text-gray-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${errors.password ? 'border-red-200 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-100 focus:ring-blue-500/20 focus:border-blue-500'}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 ml-1 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="group relative w-full flex items-center justify-center py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center" />
        </div>

        {/* Help Text */}
        <p className="mt-8 text-center text-xs text-gray-400 font-medium tracking-wide flex items-center justify-center uppercase">
          <span className="w-8 h-[1px] bg-gray-200 mr-3"></span>
          Elevating Education Through Intelligence
          <span className="w-8 h-[1px] bg-gray-200 ml-3"></span>
        </p>
      </div>
    </div>
  );
}
