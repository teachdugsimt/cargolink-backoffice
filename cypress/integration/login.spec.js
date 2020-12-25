/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/auth/login');
  });

  it('key password', () => {
    cy.wait(1000);
    cy.get('form > :nth-child(1) > input').type('+660474572889', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.get('.custom-checkbox');
    cy.get('h1').should('contain', 'Login');
    cy.wait(2000);
  });

  it('key email', () => {
    cy.wait(1000);
    cy.get(':nth-child(2) > input').type('230240wewe', { delay: 200 });
    cy.get('.sc-bkbjAj').click().click();
    cy.get('h1').should('contain', 'Login');
    cy.wait(2000);
  });

  it('key email and password', () => {
    cy.wait(1000);
    cy.get('.sc-bkbjAj').click().click();
    cy.wait(3000);
  });

  it('login', () => {
    cy.get('form > :nth-child(1) > input').type('+660474572889', { delay: 200 });
    cy.get(':nth-child(2) > input').type('Tham1234', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.swal2-confirm').click();
    cy.wait(1000);
    cy.get('.sc-dIvqjp > input').clear('');
    cy.get('form > :nth-child(1) > input').type('+66047457288', { delay: 200 });
    cy.get(':nth-child(2) > input').type('Tham12345', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.wait(2000);
    cy.get('.swal2-confirm').click();
    cy.wait(1000);
    cy.get('.sc-dIvqjp > input').clear('');
    cy.get('form > :nth-child(1) > input').type('+660474572889', { delay: 200 });
    cy.get(':nth-child(2) > input').type('Tham12345', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > [href="#"]').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(1) > a').click();
    cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(2) > a').click();
    cy.wait(2000);
    cy.get(':nth-child(3) > [href="#"]').click();
    cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(1) > a').click();
    cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(2) > a').click();
    cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(3) > a').click();
    cy.wait(2000);
    cy.get(':nth-child(4) > a').click();
    cy.wait(2000);
    cy.get('.sc-bdnylx > :nth-child(1) > :nth-child(1) > a').click();
    cy.wait(2000);
    cy.get('#mui-component-select-language').click();
    cy.wait(2000);
    cy.get('.MuiList-root > [tabindex="-1"]').click();
    cy.wait(2000);
    cy.get('#mui-component-select-language').click();
    cy.wait(2000);
    cy.get('.MuiList-root > [tabindex="-1"]').click();
    cy.wait(2000);
  });
});
