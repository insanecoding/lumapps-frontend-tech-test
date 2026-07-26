import range from 'lodash/range';
import type { Nullable } from '../types';

const createPagination = ({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}): Array<Nullable<number>> => {
  if (totalPages <= 7) {
    return range(1, totalPages + 1); // a sequence from 1 to totalPages, including both ends
  }

  if (currentPage <= 3) {
    return [1, 2, 3, null, totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, null, totalPages - 2, totalPages - 1, totalPages];
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
