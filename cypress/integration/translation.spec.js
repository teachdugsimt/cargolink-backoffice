/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/auth/login');
  });

  it('ทดสอบการไม่กรอก รหัสผ่าน', () => {
    cy.wait(1000);
    cy.get('#language').click();
    cy.wait(1000);
    cy.get('#th').click();
    cy.wait(1000);
    cy.get('#subTitle').should('contain', 'เข้าสู่ระบบด้วยหมายเลขโทรศัพท์ของคุณ');
    cy.get('#loginDescription').should('contain', 'ยังไม่มีบัญชี? สมัครสมาชิก');
    cy.get('#forgotPassword').should('contain', 'ลืมรหัสผ่าน?');
    cy.get('#phoneNumber').invoke('attr', 'placeholder').should('contain', 'หมายเลขโทรศัพท์');
    cy.get('#password').invoke('attr', 'placeholder').should('contain', 'รหัสผ่าน');
    cy.wait(1000);
    cy.get('#login').click();
    cy.wait(1000);
    cy.get('#loginError1').should('contain', '* กรุณาใส่หมายเลขโทรศัพท์ที่ถูกต้อง');
    cy.get('#loginError2').should('contain', '* กรุณาใส่รหัสผ่านที่ถูกต้อง');
    cy.wait(2000);
  });
});
