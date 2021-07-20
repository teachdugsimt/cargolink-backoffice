import React, { useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { navigate } from 'gatsby';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage } from '@atlaskit/form';
import Button from '@atlaskit/button';
import { Row, Col } from '@paljs/ui';
import Textfield from '@atlaskit/textfield';
import th from 'date-fns/locale/th';
import PageHeader from '@atlaskit/page-header';
import styled from 'styled-components';
import TextArea from '@atlaskit/textarea';
import SearchIcon from '@atlaskit/icon/glyph/search';
import PriceTypeToggle, { PriceTypeEnum } from './price-type-toggle';

const AddJobContainer: React.FC = observer(() => {
  const { t } = useTranslation();

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => {}}>
      <BreadcrumbsItem onClick={() => navigate('/jobs')} text={t('jobsManagement')} key="jobs-management" />
      <BreadcrumbsItem text={t('addNewJob')} key="job-info" />
    </Breadcrumbs>
  );

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('addNewJob')}</PageHeader>
      <Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
        {({ formProps }: any) => (
          <form {...formProps}>
            <div>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label="เจ้าของงาน" name="example1" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} />
                        {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                      </Fragment>
                    )}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={`ประเภทสินค้า`} name="example1" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} />
                        {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label="ชื่อสินค้า" name="example2" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} />
                      </Fragment>
                    )}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={`น้ำหนักสินค้า`} name="example1">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} elemAfterInput={<ElemInput>ตัน</ElemInput>} />
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
            </div>

            <br />
            <Header>รถที่ต้องการ</Header>
            <div>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label="ประเภทรถที่ต้องการ" name="example1" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} />
                        {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                      </Fragment>
                    )}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label="คอก" name="example1">
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                            {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={`การลงสินค้า`} name="example1">
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                            {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={`จำนวน`} name="example1">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} elemAfterInput={<ElemInput>คัน</ElemInput>} />
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
            </div>

            <br />
            <Header>จุดขึ้นลงสินค้า</Header>
            <div>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Row between="xs" style={{ alignItems: 'flex-end' }}>
                    <Col breakPoint={{ xs: 3, md: 2.5, lg: 3 }}>
                      <Field label="ตัวดำเนินการ" name="example2" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 7, md: 6.5, lg: 7 }}>
                      <Field label={`วัน-เวลา`} name="example1" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                  </Row>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 6.5, md: 7, xl: 8 }} style={{ paddingRight: 0 }}>
                      <Field label={t('Address')} name="address" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <TextArea
                              resize="auto"
                              // defaultValue="Add a message here"
                              style={{ height: 100 }}
                              {...fieldProps}
                            />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col
                      breakPoint={{ xs: 3.5, md: 3, xl: 2 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 0 }}
                    >
                      <div style={{ paddingTop: 35 }}>
                        <Button type="button" appearance="primary" style={{ padding: 0, backgroundColor: 'white' }}>
                          <div style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                            <SearchIcon primaryColor="lightgray" /> ค้นหา
                          </div>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('consigneeName')} name="example2">
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('contactNumber')} name="example1">
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                  </Row>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={`ที่อยู่`} name="ex1">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} />
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col
                  breakPoint={{ xs: 12, md: 5, lg: 5.5 }}
                  style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}
                >
                  <Button type="button" appearance="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </div>

            <br />
            <Header>ระยะทาง xxxx กิโลเมตร</Header>
            <Header>ราคาที่แนะนำ xxxx บาท</Header>
            <div>
              <Row>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 11.3, lg: 5 }}>
                      <Field label="อัตราค่าขนส่ง" name="example1" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                            {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 12, lg: 5 }} style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Field label="" name="priceType" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <PriceTypeToggle {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <FormFooter>
              <SubmitButton type="submit">Submit</SubmitButton>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
});

export default AddJobContainer;

const ElemInput = styled.div`
  padding: 8px 6px;
`;

const Header = styled.h3`
  font-style: inherit;
  color: #172b4d;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 32px;
  margin-top: 0;
  outline: none;
  margin-bottom: 0px;
`;

const SubmitButton = styled(Button)`
  border: 1px solid #fbbc12;
  background-color: #fbbc12;
  color: black;
`;
