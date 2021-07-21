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
import PriceTypeToggle, { PriceTypeEnum } from './price-type-toggle';
import UserSelector from './user.selector';
import ProductTypesSelector from '../productType.selector';
import TruckTypesSelector from '../../dropdowns/truckType.selector';
import PickUpPoint from './pick-up-point';
import Select from '@atlaskit/select';
import { STALL_HEIGHT, TIPPER_DUMP } from '../../truck/stall-height';

interface SelectValue {
  labal: any;
  value: string;
}

const AddJobContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [stalls, setStalls] = useState<SelectValue[]>([]);
  const [dumps, setDumps] = useState<SelectValue[]>([]);

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
                    {({ fieldProps }: any) => {
                      return (
                        <Fragment>
                          <TruckTypesSelector
                            {...fieldProps}
                            maxWidth="100%"
                            onSelect={(e: any) => {
                              fieldProps.onChange(e);

                              const stallOptions = STALL_HEIGHT(t, e);
                              setStalls(stallOptions);

                              const dumpOptions = TIPPER_DUMP(t, e);
                              setDumps(dumpOptions);
                            }}
                            placeholder={t('pleaseselect')}
                            language={loginStore.language}
                            noResultsMessage={t('noData')}
                          />
                        </Fragment>
                      );
                    }}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                  <Row between="xs">
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('stall')} name="stall" defaultValue={stalls[0]}>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Select
                              inputId="vehicle-stall-height"
                              className="single-select"
                              classNamePrefix="react-select"
                              options={stalls}
                              placeholder=""
                              {...fieldProps}
                              isDisabled={!stalls?.length || stalls?.length === 0}
                            />
                          </Fragment>
                        )}
                      </Field>
                    </Col>
                    <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                      <Field label={t('sale')} name="sale" defaultValue={dumps[0]}>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Select
                              inputId="vehicle-dump"
                              className="single-select"
                              classNamePrefix="react-select"
                              options={dumps}
                              placeholder=""
                              {...fieldProps}
                              isDisabled={!dumps?.length || dumps?.length === 0}
                            />
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
            <Field name="pickUpPoint">
              {({ fieldProps }: any) => (
                <Fragment>
                  <PickUpPoint {...fieldProps} />
                </Fragment>
              )}
            </Field>

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
