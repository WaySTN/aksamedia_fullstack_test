import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setShowSuccess(false);

        try {
            const { response, data } = await authApi.updateProfile({
                name,
                email,
                phone
            });

            if (response.ok && data.status === 'success') {
                updateUser({
                    name: data.data.user.name,
                    email: data.data.user.email,
                    phone: data.data.user.phone
                });

                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                setError(data.message || 'Gagal memperbarui profil');
            }
        } catch (err) {
            console.error('Update profile error:', err);
            setError('Terjadi kesalahan saat menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-20 -right-32 w-72 h-72 rounded-full bg-violet-600/[0.06] blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-32 w-60 h-60 rounded-full bg-cyan-500/[0.05] blur-[80px]" />

            <div className="relative rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#141824]/80 shadow-xl dark:shadow-none overflow-hidden">
                {/* Header */}
                <div className="relative overflow-hidden px-6 py-8">
                    {/* Header background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500 dark:from-violet-600/80 dark:to-cyan-600/60" />
                    <div className="absolute inset-0 dark:bg-[#141824]/30" />
                    {/* Header glow orbs */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 dark:bg-violet-400/20 blur-[40px]" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 dark:bg-cyan-400/15 blur-[30px]" />

                    <div className="relative z-10 flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 dark:bg-white/[0.08] backdrop-blur-xl flex items-center justify-center text-white text-3xl font-bold ring-2 ring-white/20 dark:ring-violet-400/30" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{user?.name}</h1>
                            <p className="text-sky-100 dark:text-violet-200/80">@{user?.username}</p>
                            <p className="text-sky-200 dark:text-cyan-300/60 text-sm mt-1">{user?.division_name}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Success Message */}
                    {showSuccess && (
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-emerald-500/10 border border-green-200 dark:border-emerald-500/20">
                            <p className="text-sm text-green-600 dark:text-emerald-400 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Profile berhasil diperbarui!
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Username (read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#5A6178] mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={user?.username || ''}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/[0.06] bg-gray-100 dark:bg-white/[0.02] text-gray-500 dark:text-[#5A6178] cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 dark:text-[#5A6178] mt-1">Username tidak dapat diubah</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1">
                            Nama Lengkap <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-[#E8ECF4] placeholder-gray-400 dark:placeholder-[#5A6178] focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500/50 focus:border-transparent transition-all"
                            placeholder="Masukkan nama lengkap"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1">
                            No. Telepon <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-[#E8ECF4] placeholder-gray-400 dark:placeholder-[#5A6178] focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500/50 focus:border-transparent transition-all"
                            placeholder="Masukkan nomor telepon"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1">
                            Email <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-[#E8ECF4] placeholder-gray-400 dark:placeholder-[#5A6178] focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500/50 focus:border-transparent transition-all"
                            placeholder="Masukkan email"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-sky-500 dark:from-violet-600 dark:to-violet-500 hover:from-sky-700 hover:to-sky-600 dark:hover:from-violet-500 dark:hover:to-violet-400 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-sky-500/25 dark:shadow-violet-500/25"
                    >
                        {isSaving ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            </span>
                        ) : (
                            'Simpan Perubahan'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
