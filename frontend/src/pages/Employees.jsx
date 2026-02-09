import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employeesApi, divisionsApi } from '../services/api';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

export default function Employees() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Data state
    const [employees, setEmployees] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter state
    const [searchName, setSearchName] = useState(searchParams.get('name') || '');
    const [selectedDivision, setSelectedDivision] = useState(searchParams.get('division_id') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        division: '',
        position: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Success message
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch divisions on mount
    useEffect(() => {
        fetchDivisions();
    }, []);

    // Fetch employees when filters change
    useEffect(() => {
        fetchEmployees();
    }, [currentPage, searchName, selectedDivision]);

    // Update URL params
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchName) params.set('name', searchName);
        if (selectedDivision) params.set('division_id', selectedDivision);
        if (currentPage > 1) params.set('page', currentPage.toString());
        setSearchParams(params, { replace: true });
    }, [searchName, selectedDivision, currentPage, setSearchParams]);

    const fetchDivisions = async () => {
        try {
            const { data } = await divisionsApi.getAll();
            if (data.status === 'success') {
                setDivisions(data.data.divisions);
            }
        } catch (error) {
            console.error('Error fetching divisions:', error);
        }
    };

    const fetchEmployees = async () => {
        setIsLoading(true);
        setError('');

        try {
            const params = { page: currentPage };
            if (searchName) params.name = searchName;
            if (selectedDivision) params.division_id = selectedDivision;

            const { response, data } = await employeesApi.getAll(params);

            if (response.ok && data.status === 'success') {
                setEmployees(data.data.employees);
                setPagination(data.pagination);
            } else {
                setError(data.message || 'Gagal memuat data');
            }
        } catch (error) {
            setError('Terjadi kesalahan saat memuat data');
            console.error('Error fetching employees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchEmployees();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openCreateModal = () => {
        setFormData({ name: '', phone: '', division: '', position: '' });
        setImageFile(null);
        setImagePreview(null);
        setModalMode('create');
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setFormData({
            name: employee.name,
            phone: employee.phone,
            division: employee.division.id,
            position: employee.position,
        });
        setImageFile(null);
        setImagePreview(employee.image);
        setModalMode('edit');
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('division', formData.division);
            formDataToSend.append('position', formData.position);
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            let response, data;

            if (modalMode === 'create') {
                ({ response, data } = await employeesApi.create(formDataToSend));
            } else {
                ({ response, data } = await employeesApi.update(selectedEmployee.id, formDataToSend));
            }

            if (response.ok && data.status === 'success') {
                setIsModalOpen(false);
                setSuccessMessage(modalMode === 'create' ? 'Karyawan berhasil ditambahkan' : 'Karyawan berhasil diperbarui');
                fetchEmployees();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(data.message || 'Gagal menyimpan data');
            }
        } catch (error) {
            setError('Terjadi kesalahan saat menyimpan data');
            console.error('Error saving employee:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteModal = (employee) => {
        setEmployeeToDelete(employee);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;

        setIsDeleting(true);

        try {
            const { response, data } = await employeesApi.delete(employeeToDelete.id);

            if (response.ok && data.status === 'success') {
                setIsDeleteModalOpen(false);
                setEmployeeToDelete(null);
                setSuccessMessage('Karyawan berhasil dihapus');
                fetchEmployees();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(data.message || 'Gagal menghapus data');
            }
        } catch (error) {
            setError('Terjadi kesalahan saat menghapus data');
            console.error('Error deleting employee:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Data Karyawan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kelola data karyawan perusahaan
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-sky-500/25"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Karyawan
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {successMessage}
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={selectedDivision}
                            onChange={(e) => {
                                setSelectedDivision(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value="">Semua Divisi</option>
                            {divisions.map((div) => (
                                <option key={div.id} value={div.id}>{div.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tidak ada karyawan</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Mulai dengan menambahkan karyawan baru.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Karyawan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        No. Telepon
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Divisi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Posisi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {employee.image ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={employee.image} alt={employee.name} />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                                                            <span className="text-sky-600 dark:text-sky-400 font-medium text-sm">
                                                                {employee.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {employee.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">{employee.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300">
                                                {employee.division.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {employee.position}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openEditModal(employee)}
                                                className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(employee)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.last_page}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? 'Tambah Karyawan' : 'Edit Karyawan'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Foto (opsional)
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16">
                                {imagePreview ? (
                                    <img className="h-16 w-16 rounded-full object-cover" src={imagePreview} alt="Preview" />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 dark:file:bg-sky-900/30 file:text-sky-700 dark:file:text-sky-400 hover:file:bg-sky-100 dark:hover:file:bg-sky-900/50"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            No. Telepon <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Division */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Divisi <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.division}
                            onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                        >
                            <option value="">Pilih Divisi</option>
                            {divisions.map((div) => (
                                <option key={div.id} value={div.id}>{div.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Posisi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Konfirmasi Hapus"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-900 dark:text-white">{employeeToDelete?.name}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
