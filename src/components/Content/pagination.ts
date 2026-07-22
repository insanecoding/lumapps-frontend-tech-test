import range from 'lodash/range';
import { Nullable } from '../../types';

// todo: unit test it
// todo: add E2E tests
// todo: compare to the pagination from the next.js guide
const createPagination = (
  total: number,
  limit: number,
  active: number,
): Array<Nullable<number>> => {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 5) {
    return range(1, totalPages + 1); // a sequence from 1 to totalPages, including both ends
  }

  if (active <= 2) return [1, 2, 3, null, totalPages];

  if (active === 3) return [1, 2, 3, 4, null, totalPages];

  if (active === totalPages - 2) {
    return [
      1,
      null,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  if (active >= totalPages - 1) {
    return [1, null, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, null, active - 1, active, active + 1, null, totalPages];
};

export default createPagination;
