/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/auth/login');
  });

  it('login', () => {
    cy.get('form > :nth-child(1) > input').type('notwirachai@gmail.com', { delay: 100 });
    cy.get(':nth-child(2) > input').type('230240wewe', { delay: 100 });
    cy.get('.sc-bkbjAj').click();
    // cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
  });
});
