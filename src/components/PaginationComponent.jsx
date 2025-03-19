// src/components/PaginationComponent.jsx

import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap';

function PaginationComponent ({ totalItems, onPageChange })  {

    const itemsPerPage = 5; // 한 페이지당 5개
    const totalPages = Math.ceil(totalItems / itemsPerPage); // 전체 페이지 개수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

    // 현재 페이지가 속한 그룹을 계산 (예: 1~5, 6~10, 11~15 ...)
    const groupSize = 5;
    const currentGroup = Math.ceil(currentPage / groupSize);
    const startPage = (currentGroup - 1) * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        onPageChange(pageNumber); // 부모 컴포넌트에 현재 페이지 전달
    };


    return (
      <div className="d-flex justify-content-center mt-4">
          <Pagination>
              <Pagination.Prev
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
              />

              {/* 5개씩 묶어서 페이지 버튼 표시 */}
              {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
                  <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                  >
                      {page}
                  </Pagination.Item>
              ))}

              <Pagination.Next
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
              />
          </Pagination>
      </div>
  );
}

export default PaginationComponent;