/// <reference types="cypress" />
import 'cypress-file-upload';

context('Window', () => {
  before(() => {
    // Cypress.Commands.add('login', () => {
    //   cy.request({
    //     method: 'POST',
    //     url: 'http://localhost:8000/api/mobile/v1/auth/login',
    //     body: {
    //         loginId: '+660474572889',
    //         password: 'Tham12345',
    //         userType:0
    //     }
    //   })
    //   .then((resp) => {
    //     window.localStorage.setItem('jwt', resp.body.token)
    //   })
    // })
    cy.request('POST', 'http://localhost:8000/api/mobile/v1/auth/login', {
      loginId: '+660474572889',
      password: 'Tham12345',
      userType: 0,
    });
  });

  beforeEach(() => {
    cy.wait(3000);
    cy.visit('http://localhost:8000/add-truck');
    const data = localStorage.getItem('rootState');
    console.log('data:>>', data);
    cy.wait(3000);
  });

  it('', () => {
    // cy.get('#phoneNumber').type('+660474572889', { delay: 200 });
    // cy.get('#password').type('Tham12345', { delay: 200 });
    // cy.get('.text').contains('จดจำฉัน').click();
    // cy.get('#login').click();
    // cy.url().should('include', 'http://localhost:8000/dashboard');
    // cy.wait(3000);
    // cy.get('#actions-menu').click();
    // cy.wait(1000);
    // cy.get('li').eq(6).click();
    // cy.url().should('include', 'http://localhost:8000/trucks');
    // cy.wait(2000);
    // cy.get('#actions-menu').should('exist').click({ multiple: true });
    // cy.wait(1000);
    // cy.get('#addNewTruck').click();
    // cy.wait(2000);
  });

  // it('ทดสอบไม่กรอกข้อมูล', () => {
  //   cy.wait(2000);
  //   cy.get('#confirm').click();
  //   cy.get('#fieldTruckType').should('contain', 'ต้องระบุประเภทรถบรรทุกในฟิลด์นี้');
  //   cy.get('#fieldStallHeight').should('contain', 'ต้องระบุความสูงในฟิลด์นี้');
  //   cy.get('#fieldWeight').should('contain', 'ต้องระบุน้ำหนักในฟิลด์นี้');
  //   cy.get('#fieldRegistrationNumber').should('contain', 'ต้องระบุเลขทะเบียนรถในฟิลด์นี้');
  //   cy.get('#fieldUploadCar').should('contain', 'ต้องอัพโหลดรูปภาพรถในฟิลด์นี้');
  //   cy.get('#fieldRegion').should('contain', 'ต้องระบุภูมิภาคในฟิลด์นี');
  //   cy.wait(2000);
  // });

  it('ทดสอบกรอกข้อมูลครบถ้วน', () => {
    // cy.wait(2000);
    // cy.get('#file-upload-front').attachFile('Truck1.png');
    // cy.wait(2000);
    // cy.get('#file-upload-back').attachFile('Truck2.png');
    // cy.wait(2000);
    // cy.get('#file-upload-left').attachFile('Truck3.png');
    // cy.wait(2000);
    // cy.get('#file-upload-right').attachFile('Truck4.png');
    // cy.wait(2000);
    // cy.get('#stallHeight').click().contains('สูง').click();
    // cy.wait(2000);
    // cy.get('#region').click().contains('ทั่วประเทศ').click();
    // cy.wait(2000);
  });
});
