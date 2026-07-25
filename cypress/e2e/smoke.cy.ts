import { allCharacters, allReactions } from '../../src/__mocks/data';

describe('Smoke test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/reactions', {
      body: { reactions: allReactions },
      statusCode: 200,
    }).as('getReactions');

    cy.intercept('GET', '/api/characters?*', {
      body: {
        results: allCharacters.slice(0, 4),
        total: 30,
        page: 1,
        limit: 4,
        next: '/api/characters?page=2&limit=4&name=',
        previous: null,
      },
      statusCode: 200,
    }).as('getCharacters');
  })

  it('Loads the page, shows four cards and pagination', () => {
    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findAllByTestId('character-card').should('have.length', 4);
    cy.findByTestId('pagination-buttons');
  });

  it('Make sure a card has all fields', () => {
    cy.visit('/');
    cy.wait(['@getReactions', '@getCharacters']);
    cy.findAllByTestId('character-card')
      .first()
      .within(() => {
        cy.findByTestId('character-name').should('have.text', 'Han Solo');

        cy.get('[data-testid^="flag-heading"]').should('have.length', 2);
        cy.findByTestId('flag-heading-species').should('have.text', 'Human');
        cy.findByTestId('flag-heading-birthYear').should('have.text', '29 BBY');

        cy.findByTestId('card-description').should(
          'have.text',
          'A charismatic and quick-witted smuggler, Han Solo is the legendary captain of the Millennium Falcon. Known for his daring maneuvers, sharp tongue, and unwavering loyalty to his friends, Han—alongside his Wookiee co-pilot Chewbacca—became a pivotal figure in the Rebellion, helping to topple the Empire and later supporting the Resistance.',
        );

        cy.findByTestId('affiliations').children().should('have.length', 3);
        cy.findByTestId('affiliations').contains('Rebel Alliance');
        cy.findByTestId('affiliations').contains('Resistance');
        cy.findByTestId('affiliations').contains("Smugglers' Alliance");

        cy.findAllByTestId('reaction-chip').should('have.length', 2);
        cy.findByTestId('reaction-chip-container').contains('�');
        cy.findByTestId('reaction-chip-container').contains('⭐');
      });
  });
});
