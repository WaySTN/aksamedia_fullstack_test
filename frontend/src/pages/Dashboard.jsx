import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { employeesApi, divisionsApi } from '../services/api';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDivisions: 0,
    });
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchDashboardData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [employeesRes, divisionsRes] = await Promise.all([
                employeesApi.getAll(),
                divisionsApi.getAll(),
            ]);

            if (employeesRes.data.status === 'success') {
                setStats(prev => ({
                    ...prev,
                    totalEmployees: employeesRes.data.pagination.total,
                }));
                setRecentEmployees(employeesRes.data.data.employees.slice(0, 5));
            }

            if (divisionsRes.data.status === 'success') {
                setStats(prev => ({
                    ...prev,
                    totalDivisions: divisionsRes.data.data.divisions.length,
                }));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const greeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const statCards = [
        {
            label: 'Total Karyawan',
            value: stats.totalEmployees,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            ),
            glowColor: 'violet',
            link: '/employees',
        },
        {
            label: 'Total Divisi',
            value: stats.totalDivisions,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
            ),
            glowColor: 'cyan',
            link: '/employees',
        },
        {
            label: 'Akun Admin',
            value: 1,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            glowColor: 'emerald',
            link: '/profile',
        },
    ];

    const quickActions = [
        {
            label: 'Data Karyawan',
            desc: 'Kelola semua karyawan',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            ),
            link: '/employees',
        },
        {
            label: 'Tambah Karyawan',
            desc: 'Buat data baru',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
            ),
            link: '/employees',
        },
        {
            label: 'Edit Profil',
            desc: 'Ubah data akun',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            ),
            link: '/profile',
        },
        {
            label: 'API Status',
            desc: 'Backend connected',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            ),
            link: null,
            status: 'online',
        },
    ];

    const glowStyles = {
        violet: {
            iconBg: 'bg-violet-500/15',
            iconText: 'text-violet-400',
            border: 'border-violet-500/20 hover:border-violet-500/50',
            glow: 'hover:shadow-[0_0_25px_rgba(108,92,231,0.15)]',
            bar: 'bg-violet-500',
        },
        cyan: {
            iconBg: 'bg-cyan-500/15',
            iconText: 'text-cyan-400',
            border: 'border-cyan-500/20 hover:border-cyan-500/50',
            glow: 'hover:shadow-[0_0_25px_rgba(0,210,211,0.15)]',
            bar: 'bg-cyan-500',
        },
        emerald: {
            iconBg: 'bg-emerald-500/15',
            iconText: 'text-emerald-400',
            border: 'border-emerald-500/20 hover:border-emerald-500/50',
            glow: 'hover:shadow-[0_0_25px_rgba(46,213,115,0.15)]',
            bar: 'bg-emerald-500',
        },
    };

    return (
        <div className="relative min-h-screen font-['DM_Sans']" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* ═══════ Ambient Glow Orbs ═══════ */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/[0.07] blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-violet-500/[0.04] blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            <div className="relative z-10 space-y-8">
                {/* ═══════ HERO SECTION ═══════ */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141824]/80 p-8 md:p-10">
                    {/* Hero inner glow */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-violet-600/[0.12] blur-[80px]" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-500/[0.08] blur-[60px]" />

                    <div className="relative z-10">
                        {/* Date pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                            <span className="text-xs font-medium text-violet-300 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                {formatDate()}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {greeting()}, <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{user?.name}</span> 👋
                        </h1>
                        <p className="text-[#5A6178] text-base max-w-lg">
                            Dashboard untuk mengelola data karyawan perusahaan. Data tersinkronisasi secara real-time dengan server.
                        </p>

                        {/* Hero inline stats */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(46,213,115,0.5)]" />
                                <span className="text-sm text-[#E8ECF4]">
                                    {isLoading ? '...' : stats.totalEmployees} Karyawan Aktif
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,210,211,0.5)]" />
                                <span className="text-sm text-[#E8ECF4]">
                                    {isLoading ? '...' : stats.totalDivisions} Divisi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════ STAT CARDS ═══════ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {statCards.map((stat, index) => {
                        const style = glowStyles[stat.glowColor];
                        return (
                            <Link
                                key={index}
                                to={stat.link}
                                className={`group relative overflow-hidden rounded-xl p-6 bg-[#141824]/70 border transition-all duration-300 hover:-translate-y-1 ${style.border} ${style.glow}`}
                            >
                                {/* Card hover glow accent */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.glowColor === 'violet' ? 'bg-gradient-to-br from-violet-600/[0.05] to-transparent' : stat.glowColor === 'cyan' ? 'bg-gradient-to-br from-cyan-500/[0.05] to-transparent' : 'bg-gradient-to-br from-emerald-500/[0.05] to-transparent'}`} />

                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#5A6178] mb-1">{stat.label}</p>
                                        <p className="text-4xl font-bold text-[#E8ECF4]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                            {isLoading ? (
                                                <span className="inline-block w-14 h-10 bg-white/[0.06] rounded-lg animate-pulse" />
                                            ) : (
                                                stat.value
                                            )}
                                        </p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${style.iconBg} ${style.iconText} group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                </div>

                                {/* Bottom glow bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                                    <div className={`h-full ${style.bar} opacity-0 group-hover:opacity-60 transition-opacity duration-500 shadow-[0_0_10px_currentColor]`} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* ═══════ QUICK ACTIONS ═══════ */}
                <div className="rounded-xl border border-white/[0.06] bg-[#141824]/70 p-6">
                    <h2 className="text-lg font-semibold text-[#E8ECF4] mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map((action, i) =>
                            action.link ? (
                                <Link
                                    key={i}
                                    to={action.link}
                                    className="group flex items-center gap-3 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 group-hover:scale-110 transition-all duration-300">
                                        {action.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#E8ECF4]">{action.label}</p>
                                        <p className="text-xs text-[#5A6178]">{action.desc}</p>
                                    </div>
                                    <svg className="w-4 h-4 ml-auto text-[#5A6178] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                                        {action.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-emerald-300">{action.label}</p>
                                        <p className="text-xs text-emerald-400/60">{action.desc}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(46,213,115,0.6)] animate-pulse" />
                                        <span className="text-xs font-medium text-emerald-400">Live</span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* ═══════ RECENT EMPLOYEES ═══════ */}
                <div className="rounded-xl border border-white/[0.06] bg-[#141824]/70 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-[#E8ECF4]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Karyawan Terbaru
                        </h2>
                        <Link
                            to="/employees"
                            className="group flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Lihat Semua
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] animate-pulse">
                                    <div className="w-11 h-11 rounded-full bg-white/[0.06]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-white/[0.06] rounded-md w-1/3" />
                                        <div className="h-3 bg-white/[0.04] rounded-md w-1/4" />
                                    </div>
                                    <div className="h-6 w-20 bg-white/[0.04] rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : recentEmployees.length > 0 ? (
                        <div className="space-y-2">
                            {recentEmployees.map((employee, idx) => (
                                <div
                                    key={employee.id}
                                    className="group flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-violet-500/20 hover:bg-white/[0.02] transition-all duration-300"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar with ring glow */}
                                        {employee.image ? (
                                            <img
                                                className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all"
                                                src={employee.image}
                                                alt={employee.name}
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all">
                                                {employee.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-[#E8ECF4]">{employee.name}</p>
                                            <p className="text-xs text-[#5A6178]">{employee.position}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/15 group-hover:border-violet-500/30 transition-colors">
                                        {employee.division.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-[#5A6178] mb-4">Belum ada data karyawan</p>
                            <Link
                                to="/employees"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors shadow-[0_0_20px_rgba(108,92,231,0.25)]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Karyawan Pertama
                            </Link>
                        </div>
                    )}
                </div>

                {/* ═══════ FOOTER ═══════ */}
                <div className="text-center pb-6">
                    <p className="text-xs text-[#5A6178]">
                        © 2026 Aksamedia · Full Stack Developer Test
                    </p>
                </div>
            </div>
        </div>
    );
}
