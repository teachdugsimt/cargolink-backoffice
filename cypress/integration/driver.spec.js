/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/dashboard');
  });

  it('ทดสอบหน้า เมนู Drivers', () => {
    cy.wait(1000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(1000);
    // cy.get(':nth-child(3) > [href="#"]').click();
    // cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(3) > a').click();
    cy.wait(2000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)')
      .should('exist')
      .click({ multiple: true });
    cy.wait(1000);
    cy.get('.sc-efHXLn > :nth-child(2)').click();
    cy.wait(2000);
    cy.get('.sc-efHXLn > :nth-child(3)').click();
    cy.wait(2000);
    cy.get('.sc-efHXLn > :nth-child(1)').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('สมหญิง', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear('สมหญิง');
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type(' สวอนโลจิสติกส์', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear(' สวอนโลจิสติกส์');
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('ซี', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear('ซี');
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').type('อัพธาม', { delay: 300 });
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.sc-dIvqjp > input').clear('อัพธาม');
    cy.get('[style="display: flex; align-items: center;"] > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.css-sqyeu9-ButtonBase > .css-1tl7tmz-ButtonBase > .sc-cBoprd').click();
    cy.wait(2000);
    cy.get('.css-sqyeu9-ButtonBase > .css-1tl7tmz-ButtonBase > .sc-cBoprd').click();
    cy.wait(2000);
  });
});
