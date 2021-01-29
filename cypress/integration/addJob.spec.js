/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/auth/login');
  });

  it('ล็อคอินสำเร็จ', () => {
    cy.get('[style="margin-bottom: 2rem;"] > input').type('+660906083287', { delay: 200 });
    cy.get('[style="margin-bottom: 2rem; margin-top: 0px;"] > input').type('123456aA', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.url().should('include', 'http://localhost:8000/dashboard');
    cy.wait(3000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(2) > a').click();
    cy.url().should('include', 'http://localhost:8000/jobs');
    cy.wait(2000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)')
      .should('exist')
      .click({ multiple: true });
    cy.wait(2000);
    cy.get('.sc-efHXLn > .sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('[name="items[0].contactMobileNo"]').type('+660474572889', { delay: 200 });
  });
});
