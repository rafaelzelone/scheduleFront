import { ChevronLeft, ChevronRight } from 'lucide-react';
import './pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return (
    <div className="paginationContainer">
      <button 
        className="pageArrow" 
        onClick={() => !isFirstPage && onPageChange?.(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Anterior"
      >
        <ChevronLeft size={16} />
      </button>
      
      <div className="pageNumberActive">
        {currentPage}
      </div>

      <button 
        className="pageArrow" 
        onClick={() => !isLastPage && onPageChange?.(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Próximo"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}