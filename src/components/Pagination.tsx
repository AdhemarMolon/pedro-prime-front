import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, loading }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious || loading}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2 mx-4">
        {/* Mostrar páginas próximas */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            // Mostrar primeira página, última página e páginas próximas à atual
            return (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            );
          })
          .map((page, index, array) => {
            // Adicionar "..." se houver gap
            const showEllipsis = index > 0 && page - array[index - 1] > 1;
            
            return (
              <div key={page} className="flex items-center">
                {showEllipsis && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                <Button
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              </div>
            );
          })}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || loading}
        className="flex items-center gap-2"
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;