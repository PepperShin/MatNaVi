//src/components/Pagination.jsx
// 페이지네이션 컴포넌트 -> 화면 구성 요소
// 페이지네이션 컴포넌트는 현재 페이지, 전체 페이지 수, 페이지 변경 함수를 전달받아 페이지네이션 ui 렌더링링

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return (
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 py-1 border rounded"
        >
          ◀
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 py-1 border rounded"
        >
          ▶
        </button>
      </div>
    );
  }
  