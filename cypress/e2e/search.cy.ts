import { allCharacters, allReactions } from '../../src/__mocks/data';

const { baseUrl } = Cypress.config();

describe('Search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/reactions', {
      body: { reactions: allReactions },
      statusCode: 200,
    }).as('getReactions');

    cy.intercept('/api/characters?*', (req) => {
      const name = new URL(req.url).searchParams.get('name');
      const page = Number(new URL(req.url).searchParams.get('page')) ?? 1;

      if (name === 'Han Solo') {
        // response with 1 result (1 page)
        req.reply({
          results: [allCharacters[0]],
          total: 1,
          page: null,
          limit: 4,
          next: null,
          previous: null,
        });
        return;
      }

      if (name === 'Obi-Wan Kenobi') {
        const dummyData = [
          {
            ...allCharacters[25],
            name: `Obi-Wan Kenobi Page${page}`, // something unique on each page to search for
          },
          ...allCharacters.slice(1, 4),
        ];

        // response with 7 results (2 pages)
        req.reply({
          results: dummyData,
          total: 7,
          page,
          limit: 4,
          next: `/api/characters?page=${Math.min(page + 1, 2)}&limit=4&name=Obi-Wan%20Kenobi`,
          previous: null,
        });
        return;
      }

      if (name === 'qwe') {
        req.reply({
          results: [],
          total: 0,
          page: 1,
          limit: 4,
          next: null,
          previous: null,
        });
        return;
      }

      const dummyData = [
        {
          ...allCharacters[0],
          name: `Character Page${page}`, // something unique on each page to search for
        },
        ...allCharacters.slice(1, 4),
      ];

      req.reply({
        results: dummyData,
        total: 40,
        page,
        limit: 4,
        next: `/api/characters?page=${Math.min(page + 1, 10)}&limit=4&name=`,
        previous: null,
      });
    }).as('getCharacters');
  });

  it('Should search for a character', () => {
    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByTestId('search-input').type('Han Solo{enter}');
    cy.wait('@getCharacters');
    cy.findByText('Han Solo');
    cy.url().should('eq', `${baseUrl}/?page=1&name=Han+Solo`);
  });

  it('Should paginate search results', () => {
    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByTestId('search-input').type('Obi-Wan Kenobi{enter}');
    cy.wait('@getCharacters');
    cy.findByText('Obi-Wan Kenobi Page1');
    cy.url().should('eq', `${baseUrl}/?page=1&name=Obi-Wan+Kenobi`);

    cy.findByTestId('pagination-button-1').should(
      'have.class',
      'lumx-button--is-active',
    );
    cy.findByTestId('pagination-button-2')
      .should('not.have.class', 'lumx-button--is-active')
      .click();

    cy.wait('@getCharacters');
    cy.findByText('Obi-Wan Kenobi Page2');
    cy.url().should('eq', `${baseUrl}/?page=2&name=Obi-Wan+Kenobi`);

    cy.findByTestId('pagination-button-1').should(
      'not.have.class',
      'lumx-button--is-active',
    );
    cy.findByTestId('pagination-button-2').should(
      'have.class',
      'lumx-button--is-active',
    );
  });

  it('Deep-links to a valid search result and page from the URL', () => {
    cy.visit('/?page=2&name=Obi-Wan+Kenobi');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('Obi-Wan Kenobi Page2');
    cy.findByTestId('pagination-button-2').should(
      'have.class',
      'lumx-button--is-active',
    );
    cy.findByTestId('search-input').should('have.value', 'Obi-Wan Kenobi');
  });

  it('Should clear input and search results', () => {
    cy.visit('/?page=2&name=Obi-Wan+Kenobi');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('Obi-Wan Kenobi Page2');
    cy.findByTestId('search-input').should('have.value', 'Obi-Wan Kenobi');
    cy.findByTestId('search-input').clear();
    cy.findByTestId('search-input').type('Han Solo');
    cy.findByTestId('search-input-clear').click();

    cy.wait('@getCharacters');
    cy.findByTestId('search-input').should('have.value', '');
    cy.url().should('eq', `${baseUrl}/?page=1`);
    cy.findByText('Character Page1');
  });

  it('Should handle invalid search', () => {
    cy.visit('/?name=qwe');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('Character Page1').should('not.exist');
    cy.findByText('No characters found for “qwe”');
  });
});
