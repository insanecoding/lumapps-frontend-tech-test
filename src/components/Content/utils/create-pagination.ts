import range from 'lodash/range';
import type { Nullable } from '../../../types';

// todo: add E2E tests
const createPagination = ({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}): Array<Nullable<number>> => {
  if (totalPages <= 5) {
    return range(1, totalPages + 1); // a sequence from 1 to totalPages, including both ends
  }

  if (currentPage <= 2) return [1, 2, 3, null, totalPages];

  if (currentPage === 3) return [1, 2, 3, 4, null, totalPages];

  if (currentPage === totalPages - 2) {
    return [
      1,
      null,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 1) {
    return [1, null, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    null,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    null,
    totalPages,
  ];
};

export default createPagination;
