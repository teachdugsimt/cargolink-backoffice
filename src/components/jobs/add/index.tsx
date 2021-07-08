import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Swal from 'sweetalert2';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ITruckType } from '../../../services/truck-type-api';
import { IProductType } from '../../../services/product-type-api';
import Spinner from '@atlaskit/spinner';
import { parseMobXToObject } from '../../../utils';
import UserSelector from './user.selector';
import TruckTypesSelector from '../../dropdowns/truckType.selector';
import ProductTypesSelector from '../productType.selector';
import PriceTypeToggle, { PriceTypeEnum } from './price-type-toggle';
import { breakPoints } from '../../../utils';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { navigate } from 'gatsby';

import { Accordion, AccordionItem } from '@paljs/ui/Accordion';
import { GoogleMapWithSearch } from '../../google-map-with-search/old-google-map-with-search';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import { Box } from 'theme-ui';
import { Text } from '../../text-span/text';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { EvaIcon } from '@paljs/ui/Icon';
import { FormFooter } from '@atlaskit/form';
import DateTimePicker from './datetimePicker';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import EditorDividerIcon from '@atlaskit/icon/glyph/editor/divider';

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
  items: {
    contactMobileNo: string | null;
    contactName: string | null;
    exDate: string | null;
    name: string | null;
    region: string | null;
  }[];
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
      items: [{ contactMobileNo: null, contactName: null, exdate: null, name: null, region: null }],
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
    <Breadcrumbs onExpand={() => {}}>
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
                <UserSelector onSelect={onChange} placeholder={t('typeUserToFind')} noResultsMessage={t('noData')} />
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
              render={({ onChange }) => (
                <ProductTypesSelector
                  onSelect={onChange}
                  placeholder={t('pleaseselect')}
                  language={loginStore.language}
                />
              )}
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
        </Grid>
        <Grid>
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
        <Grid>
          <ItemLong style={{ display: 'flex', maxWidth: 'none', justifyContent: 'flex-start' }}>
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
        <GroupTitle>{t('priceData')}</GroupTitle>
        <Divider />
        <Grid>
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
          <Item>
            <Label>
              {t('dateStart')} {Required}
            </Label>
            <DateTimePickerGroup>
              <Controller
                control={control}
                register={register({ required: true })}
                rules={{ required: 'Start from cannot be null.' }}
                name="start"
                aria-invalid={errors.start ? 'true' : 'false'}
                render={({ value, onChange }) => (
                  <DateTimePicker value={value} onChange={onChange} locale={loginStore.language} />
                )}
              />
              {errors.start && <Error message={t('fieldDateStart')} />}
            </DateTimePickerGroup>
          </Item>
          <Item>
            <Label>
              {t('shipperName')} {Required}
            </Label>
            <InputGroup>
              <Input
                className="new-input-component"
                type="text"
                name="name"
                id="name"
                style={{ borderColor: errors.name ? '#FF3D71' : '' }}
                ref={register({ required: true })}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && <Error message={t('fieldShipperName')} />}
            </InputGroup>
          </Item>
          <Item>
            <Label>
              {t('contactNumber')} {Required}
            </Label>
            <InputGroup>
              <Input
                className="new-input-component"
                type="text"
                name="contactMobileNo"
                maxLength={10}
                style={{ borderColor: errors.contactMobileNo ? '#FF3D71' : '' }}
                ref={register({ required: true })}
                aria-invalid={errors.contactMobileNo ? 'true' : 'false'}
              />
              {errors.contactMobileNo && <Error message={t('fieldContactNumber')} />}
            </InputGroup>
          </Item>
        </Grid>
        <Divider />
        <GroupTitle>{t('deliveryPoint')}</GroupTitle>
        {fields.map(({ id, contactName, name, contactMobileNo, exdate }, index) => {
          const toDate = watch(`items[${index}].exDate`);
          return (
            <Grid key={id}>
              <BoldLabel style={{ marginRight: 5 }}>
                {t('pickUpAt')} {index + 1}:{' '}
              </BoldLabel>
              <ItemHorizontalLong>
                <div style={{ display: 'flex' }}>
                  <Label>
                    {t('pickupLocation')} {Required}
                  </Label>
                </div>
                <Controller
                  name={`items[${index}].region`}
                  control={control}
                  defaultValue=""
                  render={({ onChange, value }) => <></>}
                />
                {/* <Controller //? hide for now due to broken css
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
                {errors.items && errors.items[index]?.contactName && <Error message={t('pickupLocation')} />} */}
              </ItemHorizontalLong>
              <Item>
                <Label>
                  {t('endDate')} {Required}
                </Label>
                <DateTimePickerGroup>
                  <Controller
                    control={control}
                    name={`items[${index}].exdate`}
                    register={register({ required: true })}
                    rules={{ required: 'Department cannot be null.' }}
                    ref={register({ required: true })}
                    aria-invalid={errors.items && errors.items[index]?.exdate ? 'true' : 'false'}
                    defaultValue={toDate}
                    render={({ value, onChange }) => (
                      <DateTimePicker value={value} onChange={onChange} locale={loginStore.language} />
                    )}
                  />
                  {errors.items && errors.items[index]?.exdate && <Error message={t('fieldDateStart')} />}
                </DateTimePickerGroup>
              </Item>
              <Item>
                <Label>
                  {t('consigneeName')} {Required}
                </Label>
                <InputGroup>
                  <Input
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
                </InputGroup>
              </Item>
              <Item>
                <Label>
                  {t('contactNumber')} {Required}
                </Label>
                <InputGroup>
                  <Input
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
                </InputGroup>
              </Item>
              {index > 0 ? (
                <ItemLongEnd style={{ marginTop: '1.125rem' }}>
                  <MinusButton appearance="danger" onClick={() => remove(index)}>
                    <EditorDividerIcon label="remove" size="Small" />
                  </MinusButton>
                </ItemLongEnd>
              ) : (
                ''
              )}
              <ItemLong>
                <Divider />
              </ItemLong>
            </Grid>
          );
        })}
        <Grid>
          <ItemLongEnd style={{ marginTop: '1.125rem' }}>
            <PlusButton onClick={() => append({})}>
              <AddIcon label="add" primaryColor="white" />
            </PlusButton>
          </ItemLongEnd>
          <br />
          <ItemLongEnd>
            <FormFooter>
              <BackButton type="button" onClick={() => navigate('/jobs')}>
                <span>{t('back')}</span>
              </BackButton>
              <SubmitButton type="submit">
                <span>{t('confirm')}</span>
              </SubmitButton>
            </FormFooter>
          </ItemLongEnd>
        </Grid>
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
  margin-bottom: 4rem;
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
  max-width: 550px;

  p {
    width: fit-content;
  }
`;

const ItemHorizontal = styled(Item)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const ItemHorizontalLong = styled(ItemHorizontal)`
  grid-column: span 2;
`;

const ItemLong = styled(Item)`
  grid-column: span 2;
  max-width: none;
`;
const ItemLongEnd = styled(ItemLong)`
  justify-content: flex-end;
`;

const PriceFields = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
  margin-left: 10px;
  max-width: 600px;
`;

const DateTimePickerGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;

  & > div {
    min-width: 190px;
    max-width: 360px;
  }
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
  flex: 1;
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

const MinusButton = styled(Button)`
  padding-top: 5px;
`;

const PlusButton = styled(Button)`
  padding-top: 5px;
  background-color: #253858;
  border-color: #253858;

  &:hover {
    svg {
      color: #252858 !important;
      fill: #252858 !important;
    }
  }
`;

const BackButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #fbbc12;
  color: #fbbc12;
  margin: 0 6px;
`;

const SubmitButton = styled(Button)`
  margin: 0 6px;
  border: 1px solid #fbbc12;
  background-color: #fbbc12;
  color: black;
`;
