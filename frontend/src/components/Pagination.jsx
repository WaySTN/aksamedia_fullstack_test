export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const halfShow = Math.floor(showPages / 2);
            let startPage = Math.max(1, currentPage - halfShow);
            let endPage = Math.min(totalPages, currentPage + halfShow);

            if (currentPage <= halfShow) {
                endPage = showPages;
            }
            if (currentPage > totalPages - halfShow) {
                startPage = totalPages - showPages + 1;
            }

            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                if (i > 1 && i < totalPages) {
                    pages.push(i);
                }
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-1 mt-6">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1
                    ? 'bg-gray-100 dark:bg-white/[0.03] text-gray-400 dark:text-[#5A6178] cursor-not-allowed'
                    : 'bg-white dark:bg-white/[0.04] text-gray-700 dark:text-[#E8ECF4] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-300 dark:border-white/[0.08] hover:border-violet-500/30'
                    }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === currentPage
                        ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(108,92,231,0.3)]'
                        : page === '...'
                            ? 'bg-transparent text-gray-500 dark:text-[#5A6178] cursor-default'
                            : 'bg-white dark:bg-white/[0.04] text-gray-700 dark:text-[#E8ECF4] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-300 dark:border-white/[0.08] hover:border-violet-500/30'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages
                    ? 'bg-gray-100 dark:bg-white/[0.03] text-gray-400 dark:text-[#5A6178] cursor-not-allowed'
                    : 'bg-white dark:bg-white/[0.04] text-gray-700 dark:text-[#E8ECF4] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-300 dark:border-white/[0.08] hover:border-violet-500/30'
                    }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
