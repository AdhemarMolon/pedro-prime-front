import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  loading,
  totalItems,
  itemsPerPage = 12
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Calcular quais páginas mostrar
  const getVisiblePages = () => {
    const delta = 2; // Páginas ao redor da atual
    const range = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
      {/* Info Text */}
      {totalItems && (
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Mostrando <span className="font-semibold text-blue-600">{startItem}-{endItem}</span> de{' '}
          <span className="font-semibold text-blue-600">{totalItems}</span> resultados
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || loading}
          className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="px-2 py-2">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                disabled={loading}
                className={`
                  w-10 h-10 text-sm font-medium transition-all duration-200
                  ${isCurrentPage 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
              >
                {loading && isCurrentPage ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  pageNumber
                )}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || loading}
          className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Jump to Page (Optional for large datasets) */}
      {totalPages > 10 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 order-3">
          <span>Ir para:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            placeholder="Página"
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (value >= 1 && value <= totalPages) {
                  onPageChange(value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;