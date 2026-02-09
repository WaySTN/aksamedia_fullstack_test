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

    useEffect(() => {
        fetchDashboardData();
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
                // Get first 5 employees for recent list
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

    const statCards = [
        {
            label: 'Total Karyawan',
            value: stats.totalEmployees,
            icon: '👥',
            color: 'from-blue-500 to-blue-600',
            link: '/employees'
        },
        {
            label: 'Total Divisi',
            value: stats.totalDivisions,
            icon: '🏢',
            color: 'from-green-500 to-green-600',
            link: '/employees'
        },
        {
            label: 'Akun Admin',
            value: 1,
            icon: '🔐',
            color: 'from-purple-500 to-purple-600',
            link: '/profile'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-500 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2">
                    Selamat Datang, {user?.name}! 👋
                </h1>
                <p className="text-sky-100">
                    Dashboard untuk mengelola data karyawan perusahaan. Data tersinkronisasi dengan server.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link}
                        className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {isLoading ? (
                                        <span className="inline-block w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/employees"
                        className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-2xl">👥</span>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Data Karyawan</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Kelola karyawan</p>
                        </div>
                    </Link>
                    <Link
                        to="/employees"
                        className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-2xl">➕</span>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Tambah Karyawan</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Buat data baru</p>
                        </div>
                    </Link>
                    <Link
                        to="/profile"
                        className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-2xl">👤</span>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Edit Profile</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ubah data profil</p>
                        </div>
                    </Link>
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border-2 border-dashed border-sky-300 dark:border-sky-700">
                        <span className="text-2xl">🔗</span>
                        <div>
                            <p className="font-medium text-sky-700 dark:text-sky-300">API Connected</p>
                            <p className="text-sm text-sky-600 dark:text-sky-400">Backend Laravel</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Employees */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Karyawan Terbaru</h2>
                    <Link to="/employees" className="text-sm text-sky-600 dark:text-sky-400 hover:underline">
                        Lihat Semua →
                    </Link>
                </div>
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : recentEmployees.length > 0 ? (
                    <div className="space-y-3">
                        {recentEmployees.map((employee) => (
                            <div
                                key={employee.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                                <div className="flex items-center space-x-4">
                                    {employee.image ? (
                                        <img className="w-10 h-10 rounded-full object-cover" src={employee.image} alt={employee.name} />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-medium">
                                            {employee.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{employee.position}</p>
                                    </div>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300">
                                    {employee.division.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <span className="text-4xl">📭</span>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Belum ada karyawan</p>
                        <Link
                            to="/employees"
                            className="inline-block mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                        >
                            Tambah Karyawan Pertama
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
