/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/dashboard');
  });

  it('ทดสอบหน้า เมนู Shipper account', () => {
    cy.wait(1000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(1000);
    // cy.get(':nth-child(2) > [href="#"]').click();
    // cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(1) > a').click();
    cy.wait(1000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)')
      .should('exist')
      .click({ multiple: true });
    cy.wait(2000);
    cy.get('.sc-efHXLn > :nth-child(2)').click();
    cy.wait(2000);
    cy.get('.sc-efHXLn > :nth-child(3)').click();
    cy.wait(2000);
    cy.get('.Lnyfd').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('john', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear('john');
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
