/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/dashboard');
  });

  it('key password', () => {
    cy.wait(1000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(1000);
    cy.get(':nth-child(2) > [href="#"]').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(1) > a').click();
    cy.wait(2000);
    cy.get('body').click();
    cy.wait(1000);
    cy.get('.sc-efHXLn > :nth-child(2)').click();
    cy.wait(2000);
    cy.get('.sc-efHXLn > :nth-child(3)').click();
    cy.wait(2000);
    cy.get('.sc-efHXLn > :nth-child(1)').click();
    cy.wait(2000);
  });
});
