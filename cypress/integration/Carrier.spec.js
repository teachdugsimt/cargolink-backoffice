/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/dashboard');
  });

  it('test manu carrier', () => {
    cy.wait(1000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(1000);
    cy.get(':nth-child(3) > [href="#"]').click();
    cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(1) > a > .menu-title').click();
    cy.wait(2000);
    cy.get('body').click({ force: true });
    cy.wait(2000);
    cy.get('.sc-iBzFoy > :nth-child(2)').click();
    cy.wait(2000);
    cy.get('.sc-iBzFoy > :nth-child(3)').click();
    cy.wait(2000);
    cy.get('.Lnyfd').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('777', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear('777');
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('Individual', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear('Individual');
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
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
