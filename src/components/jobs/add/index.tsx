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
import RouteWidget from '../../route/widgets/route';
import Select from '@atlaskit/select';
import { STALL_HEIGHT, TIPPER_DUMP } from '../../truck/stall-height';
import { useForm, Controller } from 'react-hook-form';

interface SelectValue {
  labal: any;
  value: string;
}

const AddJobContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [stalls, setStalls] = useState<SelectValue[]>([]);
  const [dumps, setDumps] = useState<SelectValue[]>([]);
  const [pickup, setPickup] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, watch, errors, setValue, control, getValues } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      jobOwner: null,
      productType: null,
      productName: null,
      amountWeight: null,
      typeCar: null,
      stall: null,
      sale: null,
      amount: null,
      freightRate: null,
      priceType: null
    },
  });

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/jobs')} text={t('jobsManagement')} key="jobs-management" />
      <BreadcrumbsItem text={t('addNewJob')} key="job-info" />
    </Breadcrumbs>
  );

  const isDisabled = false;

  const onSubmit = (formState: any) => {
    console.log('form submitted', formState);
    setIsSubmitted(true);
    if (pickup?.from && pickup?.to[0]) {
      console.log('form submitted', formState);
      console.log('form pickup', pickup);
    }
  };

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('addNewJob')}</PageHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <GroupItem>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field label={t('jobOwner')} name="jobOwner" isRequired>
                {({ fieldProps }: any) => {
                  return (
                    <Fragment>
                      <Controller
                        control={control}
                        name="jobOwner"
                        render={({ onChange, value }) => {
                          return (
                            <UserSelector
                              {...fieldProps}
                              maxWidth="100%"
                              value={value}
                              onChange={onChange}
                              onSelect={fieldProps.onChange}
                              placeholder={t('jobOwner')}
                              noResultsMessage={t('noData')}
                            />
                          );
                        }}
                        rules={{ required: true }}
                      />
                      {errors.jobOwner && <ErrorMessage>{t('field่JobOwner')}</ErrorMessage>}
                    </Fragment>
                  );
                }}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Field label={t('productType')} name="productType" isRequired>
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Controller
                      control={control}
                      name="productType"
                      render={({ onChange, value }) => {
                        return (
                          <ProductTypesSelector
                            {...fieldProps}
                            maxWidth="100%"
                            value={value}
                            onChange={onChange}
                            onSelect={fieldProps.onChange}
                            placeholder={t('productType')}
                            language={loginStore.language}
                          />
                        );
                      }}
                      rules={{ required: true }}
                    />
                    {errors.productType && <ErrorMessage>{t('fieldCarOwner')}</ErrorMessage>}
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
                    <Textfield
                      name="productName"
                      ref={register({ required: true })}
                      isInvalid={!!errors.productName}
                      placeholder={t('productName')}/>
                    {errors.productName && <ErrorMessage>{t('fieldCarOwner')}</ErrorMessage>}
                  </Fragment>
                )}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Field label={t(`amountWeightWithoutTon`)} name="amountWeight">
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Textfield
                      name="amountWeight"
                      ref={register({ required: false })}
                      type="number"
                      placeholder={t('amountWeightWithoutTon')}
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
                      <Controller
                        control={control}
                        name="typeCar"
                        render={({ onChange, value }) => {
                          return (
                            <TruckTypesSelector
                              {...fieldProps}
                              maxWidth="100%"
                              value={value}
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
                          );
                        }}
                        rules={{ required: true }}
                      />
                      {errors.typeCar && <ErrorMessage>{t('fieldCarOwner')}</ErrorMessage>}
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
                        <Controller
                          control={control}
                          name="stall"
                          render={({ onChange, value }) => {
                            return (
                              <Select
                                inputId="vehicle-stall-height"
                                className="single-select"
                                classNamePrefix="react-select"
                                value={value}
                                onChange={onChange}
                                options={stalls}
                                placeholder={t('stall')}
                                {...fieldProps}
                                isDisabled={!stalls?.length || stalls?.length === 0}
                              />
                            );
                          }}
                        />
                      </Fragment>
                    )}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <Field label={t('sale')} name="sale" defaultValue={dumps[0]}>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Controller
                          control={control}
                          name="stall"
                          render={({ onChange, value }) => {
                            return (
                              <Select
                                inputId="vehicle-dump"
                                className="single-select"
                                classNamePrefix="react-select"
                                value={value}
                                onChange={onChange}
                                options={dumps}
                                placeholder={t('sale')}
                                {...fieldProps}
                                isDisabled={!dumps?.length || dumps?.length === 0}
                              />
                            );
                          }}
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
                      name="amount"
                      ref={register({ required: false })}
                      placeholder={t('amount')}
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
          {isSubmitted && (!pickup?.from || !pickup?.to[0]) && <ErrorMessage>{t('fieldTypeCar')}</ErrorMessage>}
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <PickUpPoint pickup={pickup} setPickup={setPickup} />

              <br />
              <Header>ระยะทาง xxxx กิโลเมตร</Header>
              <Header>ราคาที่แนะนำ xxxx บาท</Header>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 'auto', marginRight: 10 }}>
                  <Field label={t('freightRate')} name="freightRate" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield
                          name="freightRate"
                          isInvalid={!!errors.freightRate}
                          ref={register({ required: true })}
                          placeholder={t('freightRate')} />
                           {errors.freightRate && <ErrorMessage>{t('fieldCarOwner')}</ErrorMessage>}
                      </Fragment>
                    )}
                  </Field>
                </div>
                <div style={{ marginLeft: 10, display: 'flex', alignItems: 'flex-end' }}>
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
            <div style={{ flex: 1, marginLeft: 10 }}>
              <RouteWidget
                from={pickup?.from}
                to={pickup?.to}
                setTo={(to: any) => setPickup({ ...pickup, to })}
                status="NEW"
              />
            </div>
          </div>
        </GroupItem>
        <FormFooter>
          <Button type="button" style={BottomBackStyled} onClick={() => navigate('/jobs')} testId="backButton">
            <BackText>{t('back')}</BackText>
          </Button>
          <Button
            type="submit"
            isDisabled={isDisabled}
            style={
              isDisabled
                ? {
                  ...BottomSubmitStyled,
                  backgroundColor: '#D8D8D8',
                  border: 'none',
                }
                : BottomSubmitStyled
            }
            testId="submitButton"
          >
            <SubmitText>{t('confirm')}</SubmitText>
          </Button>
        </FormFooter>
      </form>
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

const BackText = styled.span`
  color: #fbbc12;
`;

const SubmitText = styled.span`
  color: #000;
`;

const BottomStyled = {
  margin: '0 6px',
};

const BottomBackStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: 'transparent',
};

const BottomSubmitStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: '#FBBC12',
};

const GroupItem = styled.div`
  display: flex;
  flex-direction: column;
`;
