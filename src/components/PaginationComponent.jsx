// src/components/PaginationComponent.jsx

import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap';

function PaginationComponent ({ totalItems, onPageChange })  {

    const itemsPerPage = 5; // 한 페이지당 5개
    const totalPages = Math.ceil(totalItems / itemsPerPage); // 전체 페이지 개수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    
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

        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
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