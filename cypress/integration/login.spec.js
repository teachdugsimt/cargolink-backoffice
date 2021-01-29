/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/auth/login');
  });

  it('ทดสอบการไม่กรอก รหัสผ่าน', () => {
    cy.wait(1000);
    cy.get('[style="margin-bottom: 2rem;"] > input').type('+660474572889', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.get('.custom-checkbox');
    cy.get('[style="color: rgb(255, 61, 113); margin-left: 10px; font-size: small;"]').should(
      'contain',
      '* กรุณาใส่รหัสผ่านที่ถูกต้อง',
    );
    cy.wait(2000);
  });

  it('ทดสอบการไม่กรอก เบอร์โทร', () => {
    cy.wait(1000);
    cy.get('[style="margin-bottom: 2rem; margin-top: 0px;"] > input').type('230240wewe', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.get('[style="color: rgb(255, 61, 113); margin-left: 10px; font-size: small;"]').should(
      'contain',
      '* กรุณาใส่หมายเลขโทรศัพท์ที่ถูกต้อง',
    );
    cy.wait(2000);
  });

  it('ทดสอบการไม่กรอก เบอร์โทร และ รหัสผ่าน', () => {
    cy.wait(1000);
    cy.get('.sc-bkbjAj').click().click();
    cy.get('[style="color: rgb(255, 61, 113); margin-left: 10px; font-size: small;"]').should(
      'contain',
      '* กรุณาใส่หมายเลขโทรศัพท์ที่ถูกต้อง',
    );
    cy.get('[style="color: rgb(255, 61, 113); margin-left: 10px; font-size: small;"]').should(
      'contain',
      '* กรุณาใส่รหัสผ่านที่ถูกต้อง',
    );
    cy.wait(3000);
  });

  it('ทดสอบการกรอก รหัสผ่าน ผิด', () => {
    cy.wait(1000);
    cy.get('[style="margin-bottom: 2rem;"] > input').type('+660474572889', { delay: 200 });
    cy.get('[style="margin-bottom: 2rem; margin-top: 0px;"] > input').type('Tham1234', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.get('#swal2-content').should('contain', 'Phone Number or Password is invalid');
    cy.wait(2000);
    cy.get('.swal2-confirm').click();
    cy.wait(1000);
  });

  it('ทดสอบการกรอก เบอร์โทร ผิด', () => {
    cy.wait(1000);
    cy.get('[style="margin-bottom: 2rem;"] > input').type('+66047457288', { delay: 200 });
    cy.get('[style="margin-bottom: 2rem; margin-top: 0px;"] > input').type('Tham12345', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.get('#swal2-content').should('contain', 'Invalid entry for phone number');
    cy.wait(2000);
    cy.get('.swal2-confirm').click();
    cy.wait(1000);
  });

  it('ล็อคอินสำเร็จ ทดสอบเลือกเมนู และเลือกภาษา', () => {
    cy.get('[style="margin-bottom: 2rem;"] > input').type('+660474572889', { delay: 200 });
    cy.get('[style="margin-bottom: 2rem; margin-top: 0px;"] > input').type('Tham12345', { delay: 200 });
    cy.get('.sc-bkbjAj').click();
    cy.url().should('include', 'http://localhost:8000/dashboard');
    cy.wait(3000);
    cy.get('.Header__HeaderStyle-hhdliK > :nth-child(1) > .sc-kEqYlL > :nth-child(1)').click();
    cy.wait(2000);
    // cy.get(':nth-child(2) > [href="#"]').click();
    // cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(1) > a').click();
    cy.url().should('include', 'http://localhost:8000/shipper-account');
    cy.wait(2000);
    cy.get(':nth-child(2) > .menu-items > :nth-child(2) > a').click();
    cy.url().should('include', 'http://localhost:8000/jobs');
    cy.wait(2000);
    // cy.get(':nth-child(3) > [href="#"]').click();
    // cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(1) > a').click();
    cy.url().should('include', 'http://localhost:8000/carrier-account');
    cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(2) > a').click();
    cy.url().should('include', 'http://localhost:8000/trucks');
    cy.wait(2000);
    cy.get(':nth-child(3) > .menu-items > :nth-child(3) > a').click();
    cy.url().should('include', 'http://localhost:8000/drivers');
    cy.wait(2000);
    // cy.get(':nth-child(4) > a').click();
    // cy.wait(2000);
    cy.get(':nth-child(4) > a').click();
    cy.url().should('include', 'http://localhost:8000/user-management');
    cy.wait(2000);
    cy.get('#mui-component-select-language').should('be.visible').click();
    cy.wait(2000);
    cy.get('.MuiList-root > [tabindex="-1"]').should('be.visible').click();
    cy.wait(2000);
    cy.get('#mui-component-select-language').should('be.visible').click();
    cy.wait(2000);
    cy.get('.MuiList-root > [tabindex="-1"]').should('be.visible').click();
    cy.wait(2000);
  });
});
