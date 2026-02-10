import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import logoAksamedia from '../assets/logo_aksamedia.webp';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { themePreference, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(username, password);

            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const themeOptions = [
        { value: 'light', label: '☀️' },
        { value: 'dark', label: '🌙' },
        { value: 'system', label: '💻' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0C0E14] dark:to-[#0C0E14] px-4 py-12 transition-colors relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* ═══════ Ambient Glow Orbs ═══════ */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/[0.08] blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full bg-cyan-500/[0.06] blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-500/[0.04] blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 flex space-x-1 bg-white dark:bg-[#141824]/80 dark:backdrop-blur-xl rounded-xl p-1 shadow-lg dark:shadow-none border border-gray-200 dark:border-white/[0.06] z-20">
                {themeOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`p-2 rounded-lg transition-all ${themePreference === option.value
                            ? 'bg-sky-100 dark:bg-violet-500/20 shadow-sm dark:shadow-[0_0_10px_rgba(108,92,231,0.15)]'
                            : 'hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                            }`}
                        title={option.value}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src={logoAksamedia} alt="Aksamedia" className="h-12 mx-auto dark:invert dark:brightness-200" />
                    <p className="text-gray-600 dark:text-[#5A6178] mt-2 text-sm">
                        Full Stack Developer Test
                    </p>
                </div>

                {/* Login Card */}
                <div className="relative bg-white dark:bg-[#141824]/80 dark:backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-[0_0_40px_rgba(108,92,231,0.08)] p-8 border border-gray-200 dark:border-white/[0.06]">
                    {/* Card inner glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violet-500/[0.08] blur-[60px] pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-cyan-500/[0.06] blur-[50px] pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E8ECF4] mb-1 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Selamat Datang
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-[#5A6178] text-center mb-6">
                            Masuk ke dashboard admin
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#5A6178]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-[#E8ECF4] placeholder-gray-400 dark:placeholder-[#5A6178] focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500/50 focus:border-transparent transition-all"
                                        placeholder="Masukkan username"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#5A6178]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-[#E8ECF4] placeholder-gray-400 dark:placeholder-[#5A6178] focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500/50 focus:border-transparent transition-all"
                                        placeholder="Masukkan password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#5A6178] hover:text-gray-600 dark:hover:text-[#E8ECF4] transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-sky-500 dark:from-violet-600 dark:to-violet-500 hover:from-sky-700 hover:to-sky-600 dark:hover:from-violet-500 dark:hover:to-violet-400 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-sky-500/25 dark:shadow-violet-500/30"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </form>

                        {/* Hint */}
                        <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
                            <p className="text-xs text-gray-500 dark:text-[#5A6178] text-center">
                                <span className="font-medium text-gray-600 dark:text-[#E8ECF4]/60">Hint:</span> username: <code className="bg-gray-200 dark:bg-violet-500/15 dark:text-violet-300 px-1.5 py-0.5 rounded-md text-xs">admin</code> | password: <code className="bg-gray-200 dark:bg-violet-500/15 dark:text-violet-300 px-1.5 py-0.5 rounded-md text-xs">pastibisa</code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 dark:text-[#5A6178] text-xs mt-6">
                    © 2026 Aksamedia · All rights reserved.
                </p>
            </div>
        </div>
    );
}
