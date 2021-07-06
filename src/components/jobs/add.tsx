import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../stores/root-store';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ITruckType } from '../../services/truck-type-api';
import { IProductType } from '../../services/product-type-api';
import Spinner from '@atlaskit/spinner';
import { parseMobXToObject } from '../../utils';
import UserSelector from './user.selector';
import TruckTypesSelector from './truckType.selector';
import ProductTypesSelector from './productType.selector';
import PriceTypeToggle, { PriceTypeEnum } from './price-type-toggle';
import { breakPoints } from '../../utils';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { navigate } from 'gatsby';

import { Accordion, AccordionItem } from '@paljs/ui/Accordion';
import { GoogleMapWithSearch } from '../google-map-with-search/old-google-map-with-search';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import { Box } from 'theme-ui';
import { Text } from '../text-span/text';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { EvaIcon } from '@paljs/ui/Icon';
import { FormFooter } from '@atlaskit/form';

import th from 'date-fns/locale/th';
import PageHeader from '@atlaskit/page-header';
registerLocale('th', th);

interface IForm {
  contactMobileNo: string | null;
  contactName: string | null;
  name: string | null;
  productName: null;
  productTypeId: null;
  start: null;
  truckAmount: number | null;
  truckType: number | null;
  weight: number | null;
  items: any[];
  userId: string | null;
}
const AddJobContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore, truckTypesStore, productTypesStore } = useMst();

  const { register, control, handleSubmit, watch, errors } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      userId: null,
      contactMobileNo: null,
      contactName: null,
      name: null,
      productName: null,
      productTypeId: null,
      start: null,
      truckAmount: null,
      truckType: null,
      weight: null,
      items: [],
    } as IForm,
  });

  console.log('watch', watch());
  const startDate = watch('start');

  const fireError = (title: string, text: string) => {
    Swal.fire({
      icon: 'error',
      title,
      text,
    });
  };

  const onSubmit = (data: any) => {
    console.log('submitted', data);
  };

  const onSubmitLocation = (
    addr: string,
    region: { lat: number; lng: number },
    key: { address: string; region: string },
  ) => {
    control.setValue(key.address, addr);
    control.setValue(key.region, region);
  };

  const onSubmitLocation2 = (addr: string, region: { lat: number; lng: number }, indexx: number) => {
    control.setValue(`items[${indexx}].contactName`, addr);
    control.setValue(`items[${indexx}].region`, region);
  };

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const Required = <span style={{ color: '#FF3D71' }}>*</span>;
  const Error = ({ id, message }: { id?: string; message: string }) => (
    <ErrorInput id={id} role="alert">
      {message}
    </ErrorInput>
  );
  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/jobs')} text={t('jobsManagement')} key="jobs-management" />
      <BreadcrumbsItem text={t('addNewJob')} key="job-info" />
    </Breadcrumbs>
  );
  return (
    <Wrapper className="add-job-wrapper">
      <PageHeader breadcrumbs={breadcrumbs}>{t('addNewJob')}</PageHeader>
      <Form onSubmit={handleSubmit(onSubmit)} className="form-add-data">
        <Grid>
          <Item>
            <Label>
              {t('user')} {Required}
            </Label>
            <Controller
              name="userId"
              control={control}
              render={({ onChange }) => (
                <UserSelector
                  onUserSelect={onChange}
                  placeholder={t('typeUserToFind')}
                  noResultsMessage={t('noData')}
                />
              )}
            />
          </Item>
          <Item>
            <Label style={{ marginRight: 'auto' }}>
              {t('typeCar')} {Required}
            </Label>
            <Controller
              name="truckType"
              control={control}
              render={({ onChange }) => <TruckTypesSelector onSelect={onChange} placeholder={t('pleaseselect')} />}
            />
          </Item>
          <Item>
            <Label>
              {t('truckAmount')} {Required}
            </Label>
            <InputGroup>
              <Input
                type="number"
                className="new-input-component"
                style={{ borderColor: errors.truckAmount ? '#FF3D71' : '' }}
                name="truckAmount"
                id="truckAmount"
                ref={register({ required: true })}
                aria-invalid={errors.truckAmount ? 'true' : 'false'}
              />
              {errors.truckAmount ? <Error message={t('fieldTruckAmount')} /> : <ErrorInput>&nbsp;</ErrorInput>}
            </InputGroup>
          </Item>
        </Grid>
        <Divider />
        <Grid>
          <Item>
            <Label>
              {t('productType')} {Required}
            </Label>
            <Controller
              name="productType"
              control={control}
              render={({ onChange }) => <ProductTypesSelector onSelect={onChange} placeholder={t('pleaseselect')} />}
            />
          </Item>
          <Item>
            <Label>
              {t('productName')} {Required}
            </Label>
            <InputGroup>
              <Input
                className="new-input-component"
                type="text"
                name="productName"
                id="productName"
                ref={register({ required: true })}
                style={{
                  borderColor: errors.productName ? '#ff3d71' : '',
                }}
                aria-invalid={errors.productName ? 'true' : 'false'}
              />
              {errors.productName ? <Error message={t('fieldproductName')} /> : <ErrorInput>&nbsp;</ErrorInput>}
            </InputGroup>
          </Item>
          <Item>
            <Label>
              {t('amountWeight')} {Required}
            </Label>
            <InputGroup>
              <Input
                className="new-input-component"
                type="number"
                step="0.01"
                name="weight"
                id="weight"
                style={{
                  borderColor: errors.weight ? '#ff3d71' : '',
                }}
                ref={register({ required: true, min: 0 })}
                aria-invalid={errors.weight ? 'true' : 'false'}
              />
              {errors.weight && errors.weight.type === 'required' && <Error message={t('fieldWeight')} />}
              {errors.weight && errors.weight.type === 'min' && <Error message={t('minWeight')} />}
            </InputGroup>
          </Item>
        </Grid>
        <Divider />
        <GroupTitle>{t('priceData')}</GroupTitle>
        <Grid>
          <ItemLong>
            <BoldLabel>
              {t('deliveryPrice')} {Required}
            </BoldLabel>
            <PriceFields>
              <BoldLabel style={{ marginRight: 5 }}>{t('price')}</BoldLabel>
              <Controller
                name="price"
                control={control}
                defaultValue={0}
                render={({ onChange, value }) => (
                  <Input
                    className="new-input-component"
                    type="number"
                    value={value}
                    style={{ width: 'clamp(200px, 200px, 100%)' }}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )}
              />
              <p style={{ fontWeight: 'bold', marginRight: 20, marginLeft: 5 }}>{t('baht')}</p>
              <Controller
                name="priceType"
                control={control}
                defaultValue={PriceTypeEnum.PER_TRIP}
                render={({ onChange, value }) => (
                  <PriceTypeToggle priceType={value} onChange={(changeTo) => onChange(changeTo)} />
                )}
              />
            </PriceFields>
          </ItemLong>
        </Grid>
        <Divider />
        {/* <Row> Google Maps Broken CSS
            <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
              <p>
                {t('deliveryLocation')} {Required}
              </p>
              <Controller
                name="contactName"
                control={control}
                register={register({ required: true })}
                rules={{ required: 'Address can not null.' }}
                render={() => (
                  <>
                    <Accordion>
                      <AccordionItem uniqueKey={1} title={<Text tx={'selectLocation'} preset="content" />}>
                        <GoogleMapWithSearch
                          center={{ lat: 13.736717, lng: 100.523186 }}
                          height="500px"
                          zoom={15}
                          onAddressChange={(addr, region) =>
                            onSubmitLocation(addr, region, { address: 'contactName', region: 'pickupRegion' })
                          }
                        />
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
              />
              {errors.contactName && <Error message={t('fieldDeliveryLocation')} />}
            </Col>
          </Row> */}
        {/* <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <p>
                {t('dateStart')} {Required}
              </p>
              <Box sx={{ maxWidth: 400 }} as="form">
                <Controller
                  as={
                    <ReactDatePicker
                      className={errors.start ? 'errors-input-component' : 'new-input-component'}
                      locale={loginStore.language}
                      dateFormat="d MMM yyyy HH:mm"
                      selected={startDate ? new Date(startDate) : null}
                      showTimeSelect
                      dropdownMode="select"
                      isClearable
                      placeholderText={t('clickTime')}
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      shouldCloseOnSelect
                    />
                  }
                  control={control}
                  register={register({ required: true })}
                  rules={{ required: 'Start from cannot be null.' }}
                  name="start"
                  aria-invalid={errors.start ? 'true' : 'false'}
                  onChange={([selected]: any) => {
                    return { value: selected };
                  }}
                />
                {errors.start && <Error message={t('fieldDateStart')} />}
              </Box>
            </Col>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <div style={{ display: 'flex' }}>
                <BoldLabel style={{ marginRight: 5 }}>{t('deliveryPointInformation')}: </BoldLabel>
                <p>
                  {t('shipperName')} {Required}
                </p>
              </div>
              <input
                className="new-input-component"
                type="text"
                name="name"
                id="name"
                style={{ borderColor: errors.name ? '#FF3D71' : '' }}
                ref={register({ required: true })}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && <Error message={t('fieldShipperName')} />}
            </Col>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <p>
                {t('contactNumber')} {Required}
              </p>
              <input
                className="new-input-component"
                type="text"
                name="contactMobileNo"
                maxLength={10}
                style={{ borderColor: errors.contactMobileNo ? '#FF3D71' : '' }}
                ref={register({ required: true })}
                aria-invalid={errors.contactMobileNo ? 'true' : 'false'}
              />
              {errors.contactMobileNo && <Error message={t('fieldContactNumber')} />}
            </Col>
          </Row> */}
        {/* <Divider />
          <GroupTitle>{t('deliveryPoint')}</GroupTitle>
          {fields.map(({ id, contactName, name, contactMobileNo, exdate }, index) => {
            const toDate = watch(`items[${index}].exDate`);
            return (
              <Row key={id}>
                <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
                  <div style={{ display: 'flex' }}>
                    <BoldLabel style={{ marginRight: 5 }}>
                      {t('pickUpAt')} {index + 1}:{' '}
                    </BoldLabel>
                    <p>
                      {t('pickupLocation')} {Required}
                    </p>
                  </div>
                  <Controller
                    name={`items[${index}].region`}
                    control={control}
                    defaultValue=""
                    render={({ onChange, value }) => <></>}
                  />
                  <Controller
                    name={`items[${index}].contactName`}
                    control={control}
                    defaultValue=""
                    render={({ onChange, value }) => (
                      <Accordion>
                        <AccordionItem uniqueKey={1} title={<Text tx={'selectLocation'} preset="content" />}>
                          <GoogleMapWithSearch
                            center={{ lat: 13.736717, lng: 100.523186 }}
                            height="500px"
                            zoom={15}
                            onAddressChange={(addr, region) => onSubmitLocation2(addr, region, index)}
                          />
                        </AccordionItem>
                      </Accordion>
                    )}
                    register={register({ required: true })}
                    rules={{ required: 'Address can not null' }}
                  />
                  {errors.items && errors.items[index]?.contactName && <Error message={t('pickupLocation')} />}
                </Col>
                <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
                  <p>
                    {t('endDate')} {Required}
                  </p>
                  <Box sx={{ maxWidth: '400px' }} as="form">
                    <Controller
                      as={
                        <ReactDatePicker
                          className={
                            errors.items && errors.items[index]?.exdate
                              ? 'errors-input-component'
                              : 'new-input-component'
                          }
                          locale={loginStore.language}
                          dateFormat="d MMM yyyy HH:mm"
                          selected={toDate ? new Date(toDate) : null}
                          showTimeSelect
                          // todayButton="Today"
                          dropdownMode="select"
                          isClearable
                          placeholderText={t('clickTime')}
                          timeFormat="HH:mm"
                          timeIntervals={1}
                          shouldCloseOnSelect
                        />
                      }
                      control={control}
                      name={`items[${index}].exdate`}
                      rules={{ required: 'Department cannot be null.' }}
                      ref={register({ required: true })}
                      aria-invalid={errors.items && errors.items[index]?.exdate ? 'true' : 'false'}
                      defaultValue={toDate}
                      onChange={([selected]: any) => {
                        return { value: selected };
                      }}
                    />
                  </Box>
                  {errors.items && errors.items[index]?.exdate && <Error message={t('fieldDateStart')} />}
                </Col>
                <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex' }}>
                      <BoldLabel style={{ marginRight: 5 }}>{t('pickUpPointInformation')}: </BoldLabel>
                      <p>
                        {t('consigneeName')} {Required}
                      </p>
                    </div>
                    <input
                      className="new-input-component"
                      type="text"
                      name={`items[${index}].name`}
                      style={{
                        borderColor: errors.items && errors.items[index]?.name ? '#ff3d71' : '',
                      }}
                      ref={register({ required: true })}
                      aria-invalid={errors.items && errors.items[index]?.name ? 'true' : 'false'}
                      defaultValue={name}
                    />
                    {errors.items && errors.items[index]?.name && <Error message={t('fieldConsigneeName')} />}
                  </div>
                </Col>
                <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
                  <p>
                    {t('contactNumber')} {Required}
                  </p>
                  <input
                    className="new-input-component"
                    type="text"
                    name={`items[${index}].contactMobileNo`}
                    maxLength={10}
                    style={{
                      borderColor: errors.items && errors.items[index]?.contactMobileNo ? '#ff3d71' : '',
                    }}
                    defaultValue={contactMobileNo}
                    ref={register({ required: true })}
                    aria-invalid={errors.items && errors.items[index]?.contactMobileNo ? 'true' : 'false'}
                  />
                  {errors.items && errors.items[index]?.contactMobileNo && <Error message={t('fieldContactNumber')} />}
                </Col>
                {index > 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.125rem' }}>
                    <Button
                      type="button"
                      size="Small"
                      shape="SemiRound"
                      style={{ backgroundColor: '#E03616', borderColor: '#E03616' }}
                      onClick={() => remove(index)}
                    >
                      <EvaIcon name="minus-outline" />
                    </Button>
                  </div>
                ) : ''}
                <Divider />
              </Row>
            );
          })}
          <Button
            type="button"
            size="Small"
            shape="SemiRound"
            style={{ backgroundColor: '#253858', borderColor: '#253858' }}
            onClick={() => append({})}
          >
            <EvaIcon name="plus-outline" />
          </Button>
          <br />
          <br />
          <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Col>
              <FormFooter>
                <Button type="button" style={{
                  margin: '0 6px',
                  border: '1px solid #FBBC12',
                  backgroundColor: 'transparent',
                  color: '#fbbc12',
                }} onClick={() => navigate('/jobs')}>
                  <span>{t('back')}</span>
                </Button>
                <Button type="submit" style={{
                  margin: '0 6px',
                  border: '1px solid #FBBC12',
                  backgroundColor: '#FBBC12',
                  color: '#000',
                }}>
                  <span>{t('confirm')}</span>
                </Button>
              </FormFooter>
            </Col>
          </Row> */}
      </Form>
    </Wrapper>
  );
});

export default AddJobContainer;

const Wrapper = styled.div`
  min-height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  color: rgb(23, 43, 77);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 32px;
  margin-top: 0px;
  outline: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 !important;
`;

const Grid = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  p {
    width: fit-content;
  }
`;

const ItemLong = styled(Item)`
  grid-column: span 2;
`;

const PriceFields = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-left: 10px;
  margin-right: auto;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 300px;
  flex: 1;
`;

const Input = styled.input`
  width: auto !important;
  flex: 1;
`;

const ErrorInput = styled.span`
  color: #ff3d71;
  margin-left: 10px;
  margin-top: 5px;
  fontsize: 0.7375rem;
`;

const FlexBoxCenter = styled.div`
  align-items: center;
  display: flex;
`;

const Divider = styled.hr`
  margin: 1.125rem 0;
`;

const GroupTitle = styled.p`
  font-weight: bold;
  background-color: #253858;
  padding: 10px;
  color: white;
`;

const Label = styled.p`
  margin-right: 5px;
  min-width: fit-content;
`;

const BoldLabel = styled(Label)`
  font-weight: bold;
`;
