//src/component/PaginationComponent.jsx

import { Pagination } from 'react-bootstrap';

export default function PaginationComponent({ totalItems, itemsPerPage = 5, onPageChange, activePage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  let pages = [];
  for (let number = 1; number <= totalPages; number++) {
    pages.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>{pages}</Pagination>
  );
}