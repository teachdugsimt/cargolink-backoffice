/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/dashboard');
  });

  it('key shipper', () => {
    cy.wait(1000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(1000);
    cy.get(':nth-child(2) > [href="#"]').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(1) > a').click();
    cy.wait(1000);
    cy.get('body').click();
    cy.wait(2000);
    cy.get('.sc-iBzFoy > :nth-child(2)').click();
    cy.wait(2000);
    cy.get('.sc-iBzFoy > :nth-child(3)').click();
    cy.wait(2000);
    cy.get('.Lnyfd').click();
    cy.wait(2000);
  });

  it('key search john', () => {
    cy.wait(2000);
    cy.visit('http://localhost:8000/shipper-account');
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('john', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
  });

  it('key search Company', () => {
    cy.wait(2000);
    cy.visit('http://localhost:8000/shipper-account');
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('Company', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear('Company');
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
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
