import { allCharacters, allReactions } from '../../src/__mocks/data';

describe('Edge cases for characters', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/reactions', {
      body: { reactions: allReactions },
      statusCode: 200,
    }).as('getReactions');
  });

  it('Should display a loader while fetching characters and reactions', () => {
    cy.intercept('GET', '/api/characters?*', {
      body: {
        results: allCharacters.slice(0, 4),
        total: 4,
        page: 1,
        limit: 4,
        next: null,
        previous: null,
      },
      statusCode: 200,
      delay: 2000,
    }).as('getCharacters');

    cy.visit('/');
    cy.findByText('Loading...');
    cy.findByText('Loading...').should('not.exist');
    cy.findByText('Han Solo');
  });

  it('Should notify if no characters', () => {
    cy.intercept('GET', '/api/characters?*', {
      body: {
        results: [],
        total: 0,
        page: 1,
        limit: 4,
        next: null,
        previous: null,
      },
      statusCode: 200,
    }).as('getCharacters');

    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('No characters found');
  });

  it('Should suggest re-fetching if the characters call failed', () => {
    cy.intercept('GET', '/api/characters?*', { statusCode: 500 }).as(
      'getCharacters',
    );

    cy.visit('/');
    cy.findByText('Loading...');
    cy.findByText(
      'Could not load characters. Check your connection and try again',
      { timeout: 15000 },
    );
    cy.get('@getCharacters.all').then((interceptions) => {
      expect(interceptions).to.have.length(4); // the initial call + 3 retry attempts
    });

    cy.intercept('GET', '/api/characters?*', {
      body: {
        results: allCharacters.slice(0, 4),
        total: 4,
        page: 1,
        limit: 4,
        next: null,
        previous: null,
      },
      statusCode: 200,
    }).as('getCharacters');

    cy.findByTestId('refetch-characters').click();
    cy.wait('@getCharacters');
    cy.findByText('Han Solo');
  });
});

describe('Edge cases for reactions', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/characters?*', {
      body: {
        results: allCharacters.slice(0, 4),
        total: 4,
        page: 1,
        limit: 4,
        next: null,
        previous: null,
      },
      statusCode: 200,
    }).as('getCharacters');
  });

  it('Should display less richer cards and not fail if no reactions', () => {
    cy.intercept('GET', '/api/reactions', {
      body: { reactions: [] },
      statusCode: 200,
    }).as('getReactions');

    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('Han Solo');
    cy.findByTestId('reaction-chip-container').should('not.exist');
  });

  it('Should display less richer cards and not fail if reaction error', () => {
    cy.intercept('GET', '/api/reactions', { statusCode: 500 }).as(
      'getReactions',
    );

    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findByText('Loading...', { timeout: 15000 }).should('not.exist'); // wait long while it's retrying 3 times

    cy.findByText('Han Solo');
    cy.findByTestId('reaction-chip-container').should('not.exist');
  });
});
