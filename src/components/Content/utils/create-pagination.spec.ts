import createPagination from './create-pagination';

describe('Creates pagination without "null" gaps', () => {
  test('Should display all available pages if totalPages <= 5', () => {
    expect(createPagination({ totalPages: 0, currentPage: 1 })).toEqual([]);
    expect(createPagination({ totalPages: 1, currentPage: 1 })).toEqual([1]);
    expect(createPagination({ totalPages: 5, currentPage: 2 })).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(createPagination({ totalPages: 5, currentPage: 42 })).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(createPagination({ totalPages: 1, currentPage: 42 })).toEqual([1]);
  });
});

describe('Creates pagination with one "null" gap', () => {
  test('Should display the first/last page and the pages before/after the current page at the beginning', () => {
    expect(createPagination({ totalPages: 10, currentPage: 1 })).toEqual([
      1,
      2,
      3,
      null,
      10,
    ]);

    expect(createPagination({ totalPages: 10, currentPage: 2 })).toEqual([
      1,
      2,
      3,
      null,
      10,
    ]);
    expect(createPagination({ totalPages: 10, currentPage: 3 })).toEqual([
      1,
      2,
      3,
      4,
      null,
      10,
    ]);
  });

  test('Should display the first/last page and the pages before/after the current page at the end', () => {
    expect(createPagination({ totalPages: 10, currentPage: 10 })).toEqual([
      1,
      null,
      8,
      9,
      10,
    ]);
    expect(createPagination({ totalPages: 10, currentPage: 9 })).toEqual([
      1,
      null,
      8,
      9,
      10,
    ]);
    expect(createPagination({ totalPages: 10, currentPage: 8 })).toEqual([
      1,
      null,
      7,
      8,
      9,
      10,
    ]);
  });
});

describe('Creates pagination with two "null" gaps', () => {
  test('Should display the first/last page, a gap, the pages before/after the current page and another gap', () => {
    expect(createPagination({ totalPages: 10, currentPage: 4 })).toEqual([
      1,
      null,
      3,
      4,
      5,
      null,
      10,
    ]);

    expect(createPagination({ totalPages: 10, currentPage: 5 })).toEqual([
      1,
      null,
      4,
      5,
      6,
      null,
      10,
    ]);

    expect(createPagination({ totalPages: 10, currentPage: 6 })).toEqual([
      1,
      null,
      5,
      6,
      7,
      null,
      10,
    ]);

    expect(createPagination({ totalPages: 10, currentPage: 7 })).toEqual([
      1,
      null,
      6,
      7,
      8,
      null,
      10,
    ]);
  });
});
