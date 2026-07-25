import createPagination from './create-pagination';

describe('Creates pagination without "null" gaps', () => {
  test('Should display all available pages if totalPages <= 7', () => {
    expect(createPagination({ totalPages: 0, currentPage: 1 })).toEqual([]);
    expect(createPagination({ totalPages: 1, currentPage: 1 })).toEqual([1]);
    expect(createPagination({ totalPages: 7, currentPage: 2 })).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(createPagination({ totalPages: 7, currentPage: 42 })).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(createPagination({ totalPages: 1, currentPage: 42 })).toEqual([1]);
  });
});

describe('Creates pagination with one "null" gap if totalPages === 10', () => {
  test('Should handle the first three pages', () => {
    expect(createPagination({ totalPages: 10, currentPage: 1 })).toEqual([
      1,
      2,
      3,
      null,
      9,
      10,
    ]);

    expect(createPagination({ totalPages: 10, currentPage: 2 })).toEqual([
      1,
      2,
      3,
      null,
      9,
      10,
    ]);
    expect(createPagination({ totalPages: 10, currentPage: 3 })).toEqual([
      1,
      2,
      3,
      null,
      9,
      10,
    ]);
  });

  test('Should handle the last three pages', () => {
    expect(createPagination({ totalPages: 10, currentPage: 10 })).toEqual([
      1,
      2,
      null,
      8,
      9,
      10,
    ]);
    expect(createPagination({ totalPages: 10, currentPage: 9 })).toEqual([
      1,
      2,
      null,
      8,
      9,
      10,
    ]);
    expect(createPagination({ totalPages: 10, currentPage: 8 })).toEqual([
      1,
      2,
      null,
      8,
      9,
      10,
    ]);
  });
});

describe('Creates pagination with two "null" gaps if totalPages === 10', () => {
  test('Should handle the pages in the middle', () => {
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
