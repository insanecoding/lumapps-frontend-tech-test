import { allCharacters, allReactions } from '../../src/__mocks/data';

const { baseUrl } = Cypress.config();

describe('Pagination', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/reactions', {
      body: { reactions: allReactions },
      statusCode: 200,
    }).as('getReactions');

    cy.intercept('/api/characters?*', (req) => {
      const pageRaw = Number(new URL(req.url).searchParams.get('page'));

      if (isNaN(pageRaw)) {
        req.reply({
          results: [],
          total: 30,
          page: null,
          limit: 4,
          next: null,
          previous: null,
        });
        return;
      }

      const page = pageRaw ?? 1;
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

  it('The pagination buttons should navigate the pages and update the URL', () => {
    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);

    // first page
    cy.findByTestId('pagination-button-1').should(
      'have.class',
      'lumx-button--is-active',
    );
    cy.findByTestId('pagination-button-previous').should('be.disabled');
    cy.findByTestId('pagination-button-next').should('not.be.disabled');
    cy.url().should('eq', `${baseUrl}/`);
    cy.findByText('Character Page1');

    // page 2
    cy.findByTestId('pagination-button-2').should(
      'not.have.class',
      'lumx-button--is-active',
    );
    cy.findByTestId('pagination-button-2').click();
    cy.wait('@getCharacters');
    cy.url().should('eq', `${baseUrl}/?page=2`);
    cy.findByText('Character Page2');
    cy.findByTestId('pagination-button-2').should(
      'have.class',
      'lumx-button--is-active',
    );

    // next page to page 3
    cy.findByTestId('pagination-button-next').click();
    cy.wait('@getCharacters');
    cy.url().should('eq', `${baseUrl}/?page=3`);
    cy.findByText('Character Page3');

    // last page
    cy.findByTestId('pagination-button-10').click();
    cy.wait('@getCharacters');
    cy.url().should('eq', `${baseUrl}/?page=10`);
    cy.findByText('Character Page10');
    cy.findByTestId('pagination-button-next').should('be.disabled');
    cy.findByTestId('pagination-button-previous').should('not.be.disabled');

    // page 8
    cy.findByTestId('pagination-button-8').click();
    cy.wait('@getCharacters');
    cy.url().should('eq', `${baseUrl}/?page=8`);
    cy.findByText('Character Page8');

    // previous page to page 7
    cy.findByTestId('pagination-button-previous').click();
    cy.wait('@getCharacters');
    cy.url().should('eq', `${baseUrl}/?page=7`);
    cy.findByText('Character Page7');
    cy.get('@getCharacters.all').then((interceptions) => {
      expect(interceptions).to.have.length(6); // the API called 6 times
    });

    cy.findByTestId('pagination-button-7').click();
    cy.get('@getCharacters.all').then((interceptions) => {
      expect(interceptions).to.have.length(6); // still 6 API calls because it doesn't re-fetch for the same page
    });
  });

  it('Should handle invalid page', () => {
    cy.visit('/?page=qwe');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('Character Page1').should('not.exist');
    cy.findByText('No characters found');
  });

  it('Clicking on the header logo leads to the starting page', () => {
    cy.visit('/?page=qwe');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.url().should('eq', `${baseUrl}/?page=qwe`);

    cy.findByTestId('header-logo').click();
    cy.wait('@getCharacters');
    cy.url().should('eq', `${baseUrl}/`);
    cy.findByText('Character Page1');
  });

  it('Deep-links to a valid page from the URL', () => {
    cy.visit('/?page=5');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('Character Page5');
    cy.findByTestId('pagination-button-5').should(
      'have.class',
      'lumx-button--is-active',
    );
  });
});
