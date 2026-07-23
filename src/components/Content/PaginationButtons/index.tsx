import React from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@lumx/react';

import createPagination from '../utils/create-pagination';

import styles from './index.module.scss';

const PaginationButtons: React.FC<{
  totalItems: number;
  pageLimit: number;
  currentPage: number;
}> = ({ totalItems, pageLimit, currentPage }) => {
  const totalPages = Math.ceil(totalItems / pageLimit);
  const [_, setSearchParams] = useSearchParams();

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        emphasis="medium"
        onClick={() => {
          setSearchParams((params) => {
            params.set('page', `${currentPage - 1}`);
            return params;
          });
        }}
        isDisabled={currentPage === 1}
      >
        {'<'}
      </Button>
      {createPagination({ totalPages, currentPage }).map((item, index) =>
        item === null ? (
          <span key={`delimiter-${index}`}>...</span>
        ) : (
          <Button
            emphasis="medium"
            key={item}
            isActive={item === currentPage}
            onClick={() => {
              if (item === currentPage) return;

              setSearchParams((params) => {
                params.set('page', `${item}`);
                return params;
              });
            }}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        emphasis="medium"
        onClick={() => {
          setSearchParams((params) => {
            params.set('page', `${currentPage + 1}`);
            return params;
          });
        }}
        isDisabled={currentPage === totalPages}
      >
        {'>'}
      </Button>
    </nav>
  );
};

export default PaginationButtons;
