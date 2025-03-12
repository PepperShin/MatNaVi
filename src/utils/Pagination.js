// src/utils/Pagination.js

export const paginate = (items, currentPage, itemsPerPage) => {
  const start = (currentPage - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
};