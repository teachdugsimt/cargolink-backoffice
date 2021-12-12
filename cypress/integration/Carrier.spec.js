/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/dashboard');
  });

  it('ทดสอบหน้า เมนู Carrier account', () => {
    cy.wait(1000);
    cy.get('#actions-menu').click();
    cy.wait(1000);
    cy.get('li').eq(5).click();
    cy.url().should('include', 'http://localhost:8000/carrier-account');
    cy.wait(2000);
    cy.get('#actions-menu').should('exist').click({ multiple: true });
    cy.wait(2000);
    cy.get('#pending').click();
    cy.wait(2000);
    cy.get('#approved').click();
    cy.wait(2000);
    cy.get('#all').click();
    cy.wait(2000);
    cy.get('#inputSearch').type('777', { delay: 300 });
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').clear('777');
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').type('Individual', { delay: 300 });
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').clear('Individual');
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').type('Company', { delay: 300 });
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').clear('Company');
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('[page="1"]').click();
    cy.wait(2000);
    cy.get('[page="2"]').click();
    cy.wait(2000);
    cy.get('[page="3"]').click();
    cy.wait(2000);
    cy.get('[page="1"]').click();
    cy.wait(2000);
  });
});
