import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded px-3 py-1 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        이전
      </button>

      {pageNumbers.map((number) => {
        const isActive = currentPage === number;
        console.log(
          `- 렌더링 중인 버튼 숫자: ${number}, 전달받은 currentPage: ${currentPage}, 활성화 여부 (isActive): ${isActive}`
        );

        return (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`h-8 w-8 rounded transition-colors ${
              isActive
                ? "bg-gray-200 text-primary-blue font-bold hover:bg-gray-300"
                : "bg-primary text-primary-blue"
            }`}
          >
            {number}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded px-3 py-1 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        다음
      </button>
    </nav>
  );
};

export default Pagination;
