import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Initial dummy data
const initialData = [
    { id: generateId(), name: 'Ahmad Fauzi', email: 'ahmad@email.com', phone: '081234567890', address: 'Jakarta Selatan', createdAt: Date.now() - 86400000 * 10 },
    { id: generateId(), name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567891', address: 'Bandung', createdAt: Date.now() - 86400000 * 9 },
    { id: generateId(), name: 'Citra Dewi', email: 'citra@email.com', phone: '081234567892', address: 'Surabaya', createdAt: Date.now() - 86400000 * 8 },
    { id: generateId(), name: 'Dewi Lestari', email: 'dewi@email.com', phone: '081234567893', address: 'Yogyakarta', createdAt: Date.now() - 86400000 * 7 },
    { id: generateId(), name: 'Eko Prasetyo', email: 'eko@email.com', phone: '081234567894', address: 'Semarang', createdAt: Date.now() - 86400000 * 6 },
    { id: generateId(), name: 'Fitri Handayani', email: 'fitri@email.com', phone: '081234567895', address: 'Malang', createdAt: Date.now() - 86400000 * 5 },
    { id: generateId(), name: 'Gunawan Wibowo', email: 'gunawan@email.com', phone: '081234567896', address: 'Solo', createdAt: Date.now() - 86400000 * 4 },
    { id: generateId(), name: 'Hendra Kurniawan', email: 'hendra@email.com', phone: '081234567897', address: 'Medan', createdAt: Date.now() - 86400000 * 3 },
    { id: generateId(), name: 'Indah Permata', email: 'indah@email.com', phone: '081234567898', address: 'Makassar', createdAt: Date.now() - 86400000 * 2 },
    { id: generateId(), name: 'Joko Widodo', email: 'joko@email.com', phone: '081234567899', address: 'Palembang', createdAt: Date.now() - 86400000 * 1 },
    { id: generateId(), name: 'Kartika Sari', email: 'kartika@email.com', phone: '081234567800', address: 'Denpasar', createdAt: Date.now() },
    { id: generateId(), name: 'Lina Marlina', email: 'lina@email.com', phone: '081234567801', address: 'Pontianak', createdAt: Date.now() },
];

const ITEMS_PER_PAGE = 5;

export default function DataManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useLocalStorage('crud_items', initialData);

    const initialPage = parseInt(searchParams.get('page')) || 1;
    const initialSearch = searchParams.get('search') || '';
    const initialAction = searchParams.get('action') || '';

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isModalOpen, setIsModalOpen] = useState(initialAction === 'create');
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set('page', currentPage.toString());
        if (searchTerm) params.set('search', searchTerm);
        setSearchParams(params, { replace: true });
    }, [currentPage, searchTerm, setSearchParams]);

    useEffect(() => {
        if (searchParams.get('action') === 'create' && !isModalOpen) {
            searchParams.delete('action');
            setSearchParams(searchParams, { replace: true });
        }
    }, [isModalOpen, searchParams, setSearchParams]);

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return items;
        const term = searchTerm.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.email.toLowerCase().includes(term) ||
            item.phone.includes(term) ||
            item.address.toLowerCase().includes(term)
        );
    }, [items, searchTerm]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [searchTerm, totalPages, currentPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const openCreateModal = () => {
        setFormData({ name: '', email: '', phone: '', address: '' });
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setFormData({
            name: item.name,
            email: item.email,
            phone: item.phone,
            address: item.address
        });
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: '', email: '', phone: '', address: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingItem) {
            setItems(items.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData }
                    : item
            ));
        } else {
            const newItem = {
                id: generateId(),
                ...formData,
                createdAt: Date.now()
            };
            setItems([...items, newItem]);
        }

        closeModal();
    };

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
        setDeleteConfirm(null);
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-[#E8ECF4] placeholder-gray-400 dark:placeholder-[#5A6178] focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500/50 focus:border-transparent transition-all";

    return (
        <div className="relative space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/[0.05] blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-0 -left-48 w-[400px] h-[400px] rounded-full bg-violet-600/[0.04] blur-[120px] animate-pulse" style={{ animationDuration: '14s' }} />
            </div>

            <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#E8ECF4]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Data Management
                        </h1>
                        <p className="text-gray-500 dark:text-[#5A6178] text-sm mt-1">
                            Total {filteredItems.length} data {searchTerm && `(filtered from ${items.length})`}
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Data
                    </button>
                </div>

                {/* Search */}
                <div className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#141824]/70 p-4">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#5A6178]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Cari berdasarkan nama, email, telepon, atau alamat..."
                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-900 dark:text-[#E8ECF4] placeholder-gray-400 dark:placeholder-[#5A6178] focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500/50 focus:border-transparent transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#5A6178] hover:text-gray-600 dark:hover:text-[#E8ECF4] transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#141824]/70 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/[0.06]">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#5A6178] uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#5A6178] uppercase tracking-wider hidden md:table-cell">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#5A6178] uppercase tracking-wider hidden lg:table-cell">Telepon</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#5A6178] uppercase tracking-wider hidden lg:table-cell">Alamat</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-[#5A6178] uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                                {paginatedItems.length > 0 ? (
                                    paginatedItems.map((item) => (
                                        <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-medium flex-shrink-0 ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all">
                                                        {item.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-[#E8ECF4]">{item.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-[#5A6178] md:hidden">{item.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-[#E8ECF4]/80 hidden md:table-cell">{item.email}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-[#E8ECF4]/80 hidden lg:table-cell">{item.phone}</td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-gray-600 dark:text-[#E8ECF4]/80">{item.address}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2 rounded-lg text-blue-600 dark:text-violet-400 hover:bg-blue-50 dark:hover:bg-violet-500/10 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(item)}
                                                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 dark:text-[#5A6178] text-base">
                                                    {searchTerm ? 'Tidak ada data yang cocok' : 'Belum ada data'}
                                                </p>
                                                {!searchTerm && (
                                                    <button
                                                        onClick={openCreateModal}
                                                        className="mt-4 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-lg shadow-violet-500/25"
                                                    >
                                                        Tambah Data Pertama
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination info and controls */}
                    {filteredItems.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500 dark:text-[#5A6178]">
                                Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} dari {filteredItems.length} data
                            </p>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingItem ? 'Edit Data' : 'Tambah Data Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputClass}
                            placeholder="Masukkan nama"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputClass}
                            placeholder="Masukkan email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1">
                            Telepon
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={inputClass}
                            placeholder="Masukkan nomor telepon"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E8ECF4] mb-1">
                            Alamat
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className={inputClass}
                            placeholder="Masukkan alamat"
                            required
                        />
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-white/[0.08] text-gray-700 dark:text-[#E8ECF4] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-lg shadow-violet-500/25"
                        >
                            {editingItem ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Konfirmasi Hapus"
            >
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 dark:text-[#5A6178] mb-6">
                        Apakah Anda yakin ingin menghapus data <span className="font-semibold text-gray-900 dark:text-[#E8ECF4]">{deleteConfirm?.name}</span>?
                    </p>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-white/[0.08] text-gray-700 dark:text-[#E8ECF4] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => handleDelete(deleteConfirm.id)}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-lg shadow-red-500/25"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
