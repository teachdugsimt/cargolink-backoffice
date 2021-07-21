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
import PageHeader from '@atlaskit/page-header';
import styled from 'styled-components';
import TextArea from '@atlaskit/textarea';
import SearchIcon from '@atlaskit/icon/glyph/search';
import PriceTypeToggle, { PriceTypeEnum } from './price-type-toggle';
import DateTimePicker from './datetimePicker';
import RouteWidget from '../../route/widgets/route';
import Select from '@atlaskit/select';
import th from 'date-fns/locale/th';
import images from '../../Themes/images';
import UserSelector from './user.selector';
import ProductTypesSelector from '../productType.selector';
import TruckTypesSelector from '../../dropdowns/truckType.selector';

const AddJobContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore, jobStore } = useMst();
  const { currentJob } = jobStore;

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
                  <Field label={t('jobOwner')} name="่jobOwner" isRequired>
                    {({ fieldProps }: any) => {
                      return (
                        <Fragment>
                          <UserSelector
                            {...fieldProps}
                            maxWidth="100%"
                            onSelect={fieldProps.onChange}
                            placeholder={t('pleaseselect')}
                            noResultsMessage={t('noData')}
                          />
                        </Fragment>
                      );
                    }}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={t('productType')} name="productType" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <ProductTypesSelector
                          {...fieldProps}
                          maxWidth="100%"
                          onSelect={fieldProps.onChange}
                          placeholder={t('pleaseselect')}
                          language={loginStore.language}
                        />
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={t('productName')} name="productName" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="" {...fieldProps} />
                      </Fragment>
                    )}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={t(`amountWeight`)} name="amountWeight">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield
                          type="number"
                          placeholder=""
                          {...fieldProps}
                          elemAfterInput={<ElemInput>ตัน</ElemInput>}
                        />
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
            </div>

            <br />
            <Header>{t('desiredVehicle')}</Header>
            <div>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Field label={t('typeCar')} name="typeCar" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <TruckTypesSelector
                          {...fieldProps}
                          maxWidth="100%"
                          onSelect={fieldProps.onChange}
                          placeholder={t('pleaseselect')}
                          language={loginStore.language}
                        />
                      </Fragment>
                    )}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('stall')} name="stall">
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                            {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('sale')} name="sale">
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
                  <Field label={t('amount')} name="amount">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield
                          type="number"
                          placeholder=""
                          {...fieldProps}
                          elemAfterInput={<ElemInput>คัน</ElemInput>}
                        />
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
            </div>

            <br />
            <Header>{t('pickUpPoint')}</Header>
            <div>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Row between="xs" style={{ alignItems: 'flex-end' }}>
                    <Col breakPoint={{ xs: 3, md: 2.5, lg: 3 }}>
                      <Field
                        label={t('operator')}
                        name="operator"
                        defaultValue={{ label: 'ขึ้น', value: 'UP' }}
                        isRequired
                      >
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Select
                              inputId="single-select-example"
                              className="single-select"
                              classNamePrefix="react-select"
                              options={[
                                { label: 'ขึ้น', value: 'UP' },
                                { label: 'ลง', value: 'DOWN' },
                              ]}
                              {...fieldProps}
                            />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 7, md: 6.5, lg: 7 }}>
                      <Field label={t('dateTime')} name="dateTime" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <DateTimePicker {...fieldProps} locale={loginStore.language} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                  </Row>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 7, lg: 8, xl: 9 }} style={{ paddingRight: 0 }}>
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
                      breakPoint={{ xs: 3, lg: 3, xl: 2 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 0 }}
                    >
                      <Button type="button" style={{ backgroundColor: 'white', marginTop: 16 }}>
                        <img src={images.homeSearch} style={{ width: 50, height: 50 }} />
                      </Button>
                    </Col>
                  </Row>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('consigneeName')} name="consigneeName">
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('contactNumber')} name="contactNumber">
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder="" {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                  </Row>
                  <FormFooter>
                    <SubmitButton type="button">เพิ่ม</SubmitButton>
                  </FormFooter>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <RouteWidget from={currentJob?.from} to={currentJob?.to} status={currentJob?.status} />
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
