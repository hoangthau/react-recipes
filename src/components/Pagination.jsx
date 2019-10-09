import React from 'react';

const Pagination = ({ currentPage, pages, goTo }) => (
  <div className="pagination">
    {pages.map(item => (
      <button
        className={currentPage === item ? 'active-page' : ''}
        key={item}
        onClick={() => goTo(item)}
      >
        {item}
      </button>
    ))}
  </div>
);

export default Pagination;
