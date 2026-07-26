import React from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@lumx/react';

import createPagination from '../../utils/create-pagination';

import styles from './index.module.scss';

const PaginationButtons: React.FC<{
  totalItems: number;
  pageLimit: number;
  currentPage: number;
}> = ({ totalItems, pageLimit, currentPage }) => {
  const totalPages = Math.ceil(totalItems / pageLimit);
  const [_, setSearchParams] = useSearchParams();

  const goToPage = (page: number) => {
    setSearchParams((params) => {
      params.set('page', `${page}`);
      return params; // mutating the callback before return is a recommended way in React Router docs
    });
  };

  return (
    <nav
      className={styles.pagination}
      aria-label="Pagination"
      data-testid="pagination-buttons"
    >
      <Button
        emphasis="medium"
        onClick={() => goToPage(currentPage - 1)}
        isDisabled={currentPage === 1}
        data-testid="pagination-button-previous"
        aria-label="Previous page"
      >
        {'<'}
      </Button>
      {createPagination({ totalPages, currentPage }).map((item, index) =>
        item === null ? (
          <span key={`delimiter-${index}`} aria-hidden="true">
            ...
          </span>
        ) : (
          <Button
            emphasis="medium"
            key={item}
            isActive={item === currentPage}
            aria-current={item === currentPage ? 'page' : undefined}
            aria-label={`Page ${item}`}
            onClick={() => {
              if (item === currentPage) return;
              goToPage(item);
            }}
            data-testid={`pagination-button-${item}`}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        emphasis="medium"
        onClick={() => goToPage(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        data-testid="pagination-button-next"
        aria-label="Next page"
      >
        {'>'}
      </Button>
    </nav>
  );
};

export default PaginationButtons;
