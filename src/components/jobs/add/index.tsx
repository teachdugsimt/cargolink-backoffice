import React, { useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { navigate } from 'gatsby';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage } from '@atlaskit/form';
import Button from '@atlaskit/button';
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
            <GroupItem>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Field label={t('jobOwner')} name="่jobOwner" isRequired>
                    {({ fieldProps }: any) => {
                      return (
                        <Fragment>
                          <UserSelector
                            {...fieldProps}
                            maxWidth="100%"
                            onSelect={fieldProps.onChange}
                            placeholder={t('jobOwner')}
                            noResultsMessage={t('noData')}
                          />
                        </Fragment>
                      );
                    }}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <Field label={t('productType')} name="productType" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <ProductTypesSelector
                          {...fieldProps}
                          maxWidth="100%"
                          onSelect={fieldProps.onChange}
                          placeholder={t('productType')}
                          language={loginStore.language}
                        />
                      </Fragment>
                    )}
                  </Field>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Field label={t('productName')} name="productName" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder={t('productName')} {...fieldProps} />
                      </Fragment>
                    )}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <Field label={t(`amountWeight`)} name="amountWeight">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield
                          type="number"
                          placeholder={t('amountWeight')}
                          {...fieldProps}
                          elemAfterInput={<ElemInput>ตัน</ElemInput>}
                        />
                      </Fragment>
                    )}
                  </Field>
                </div>
              </div>

              <br />
              <Header>{t('desiredVehicle')}</Header>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
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
                            placeholder={t('typeCar')}
                            language={loginStore.language}
                            noResultsMessage={t('noData')}
                          />
                        </Fragment>
                      );
                    }}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1, marginRight: 10 }}>
                      <Field label={t('stall')} name="stall" defaultValue={stalls[0]}>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Select
                              inputId="vehicle-stall-height"
                              className="single-select"
                              classNamePrefix="react-select"
                              options={stalls}
                              placeholder={t('stall')} 
                              {...fieldProps}
                              isDisabled={!stalls?.length || stalls?.length === 0}
                            />
                          </Fragment>
                        )}
                      </Field>
                    </div>
                    <div style={{ flex: 1, marginLeft: 10 }}>
                      <Field label={t('sale')} name="sale" defaultValue={dumps[0]}>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Select
                              inputId="vehicle-dump"
                              className="single-select"
                              classNamePrefix="react-select"
                              options={dumps}
                              placeholder={t('sale')}
                              {...fieldProps}
                              isDisabled={!dumps?.length || dumps?.length === 0}
                            />
                          </Fragment>
                        )}
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Field label={t('amount')} name="amount">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield
                          type="number"
                          placeholder={t('amount')}
                          {...fieldProps}
                          elemAfterInput={<ElemInput>คัน</ElemInput>}
                        />
                      </Fragment>
                    )}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}></div>
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
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 'auto', marginRight: 10 }}>
                      <Field label={t('freightRate')} name="freightRate" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Textfield placeholder={t('freightRate')} {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </div>
                    <div style={{ flex: 'auto', marginLeft: 10, display: 'flex', alignItems: 'flex-end' }}>
                      <Field label="" name="priceType" isRequired>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <PriceTypeToggle {...fieldProps} />
                          </Fragment>
                        )}
                      </Field>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}></div>
              </div>
            </GroupItem>
            <FormFooter>
              <SubmitButton type="submit">{t('add')}</SubmitButton>
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

const GroupItem = styled.div`
  display: flex;
  flex-direction: column;
`;
