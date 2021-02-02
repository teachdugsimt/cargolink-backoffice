/// <reference types="cypress" />
import 'cypress-file-upload';

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/add-truck');
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

  it('', () => {
    cy.fixture('Truck1.png').then((fileContent) => {
      cy.get('#file-upload-front').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'Truck1.png',
        mimeType: 'image/png',
      });
    });
    // cy.get('#stallHeight').click().contains('สูง').click();
    // cy.wait(2000);
  });
});
