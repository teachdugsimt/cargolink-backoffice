/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/auth/login');
  });

  // it('ทดสอบการไม่กรอก รหัสผ่าน', () => {
  //   cy.wait(1000);
  //   cy.get('#phoneNumber').type('+660474572889', { delay: 200 });
  //   cy.get('#phoneNumber').invoke('attr', 'placeholder').should('contain', 'หมายเลขโทรศัพท์');
  //   cy.wait(1000);
  //   cy.get('#login').click();
  //   cy.wait(1000);
  //   cy.get('#loginError2').should('contain', '* กรุณาใส่รหัสผ่านที่ถูกต้อง');
  //   cy.wait(2000);
  // });

  // it('ทดสอบการไม่กรอก เบอร์โทร', () => {
  //   cy.wait(1000);
  //   cy.get('#password').type('230240wewe', { delay: 200 });
  //   cy.get('#login').click();
  //   cy.get('#loginError1').should('contain', '* กรุณาใส่หมายเลขโทรศัพท์ที่ถูกต้อง');
  //   cy.wait(2000);
  // });

  // it('ทดสอบการไม่กรอก เบอร์โทร และ รหัสผ่าน', () => {
  //   cy.wait(1000);
  //   cy.get('#login').click();
  //   cy.get('#loginError1').should('contain', '* กรุณาใส่หมายเลขโทรศัพท์ที่ถูกต้อง');
  //   cy.get('#loginError2').should('contain', '* กรุณาใส่รหัสผ่านที่ถูกต้อง');
  //   cy.wait(3000);
  // });

  // it('ทดสอบการกรอก รหัสผ่าน ผิด', () => {
  //   cy.wait(1000);
  //   cy.get('#phoneNumber').type('+660474572889', { delay: 200 });
  //   cy.get('#password').type('Tham1234', { delay: 200 });
  //   cy.get('#login').click();
  //   cy.get('#swal2-content').should('contain', 'Phone Number or Password is invalid');
  //   cy.wait(2000);
  //   cy.get('.swal2-confirm').should('be.visible').click();
  //   cy.wait(1000);
  // });

  // it('ทดสอบการกรอก เบอร์โทร ผิด', () => {
  //   cy.wait(1000);
  //   cy.get('#phoneNumber').type('+66047457288', { delay: 200 });
  //   cy.get('#password').type('Tham12345', { delay: 200 });
  //   cy.get('#login').click();
  //   cy.get('#swal2-content').should('contain', 'Invalid entry for phone number');
  //   cy.wait(2000);
  //   cy.get('.swal2-confirm').should('be.visible').click();
  //   cy.wait(1000);
  // });

  it('ล็อคอินสำเร็จ ทดสอบเลือกเมนู ', () => {
    cy.get('#phoneNumber').type('+660474572889', { delay: 200 });
    cy.get('#password').type('Tham12345', { delay: 200 });
    cy.get('.text').contains('จดจำฉัน').click();
    cy.get('#login').click();
    cy.url().should('include', 'http://localhost:8000/dashboard');
    cy.wait(3000);
    cy.get('#actions-menu').click();
    cy.wait(2000);
    cy.get('#Shipper account').click();
    cy.url().should('include', 'http://localhost:8000/shipper-account');
    cy.wait(2000);
    cy.get('#Jobs').click();
    cy.url().should('include', 'http://localhost:8000/jobs');
    cy.wait(2000);
    cy.get('#Carrier account').click();
    cy.url().should('include', 'http://localhost:8000/carrier-account');
    cy.wait(2000);
    cy.get('#Trucks').click();
    cy.url().should('include', 'http://localhost:8000/trucks');
    cy.wait(2000);
    cy.get('#Drivers').click();
    cy.url().should('include', 'http://localhost:8000/drivers');
    cy.wait(2000);
    cy.get('#User Management').click();
    cy.url().should('include', 'http://localhost:8000/user-management');
    cy.wait(2000);
  });
});
