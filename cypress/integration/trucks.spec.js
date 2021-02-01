/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/dashboard');
  });

  it('ทดสอบหน้า เมนู Trucks', () => {
    cy.wait(1000);
    cy.get('#actions-menu').click();
    cy.wait(1000);
    cy.get('li').eq(6).click();
    cy.url().should('include', 'http://localhost:8000/trucks');
    cy.wait(2000);
    cy.get('#actions-menu').should('exist').click({ multiple: true });
    cy.wait(1000);
    cy.get('#pending').click();
    cy.wait(2000);
    cy.get('#approved').click();
    cy.wait(2000);
    cy.get('#all').click();
    cy.wait(2000);
    cy.get('#inputSearch').type('รร', { delay: 300 });
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').clear('รร');
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').type('84964', { delay: 300 });
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').clear('84964');
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').type('F55', { delay: 300 });
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').clear('F55');
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').type('ง', { delay: 300 });
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#inputSearch').clear('ง');
    cy.get('#search').click();
    cy.wait(2000);
    cy.get('#addNewTruck').click();
    cy.wait(2000);
  });
});
