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

import { Accordion, AccordionItem } from '@paljs/ui/Accordion';
import { GoogleMapWithSearch } from '../google-map-with-search/old-google-map-with-search';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import { Box } from 'theme-ui';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Text } from '../text-span/text';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import th from 'date-fns/locale/th'
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

  const Required = <span style={{ color: '#FF3D71' }}>*</span>;
  const Error = ({ id, message }: { id?: string; message: string }) => (
    <span id={id} style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
      {message}
    </span>
  );
  return (
    <Wrapper className="add-job-wrapper">
      <CardHeader>
        <span>{t('addNewJob')}</span>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="form-add-data">
          <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <p>
                {t('user')} {Required}
              </p>
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
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('typeCar')} {Required}
              </p>
              <Controller
                name="truckType"
                control={control}
                render={({ onChange }) => <TruckTypesSelector onSelect={onChange} placeholder={t('pleaseselect')} />}
              />
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('truckAmount')} {Required}
              </p>
              <input
                type="number"
                className="new-input-component"
                style={{ borderColor: errors.truckAmount ? '#FF3D71' : '' }}
                name="truckAmount"
                id="truckAmount"
                ref={register({ required: true })}
                aria-invalid={errors.truckAmount ? 'true' : 'false'}
              />
              {errors.truckAmount && <Error message={t('fieldTruckAmount')} />}
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('productType')} {Required}
              </p>
              <Controller
                name="productType"
                control={control}
                render={({ onChange }) => <ProductTypesSelector onSelect={onChange} placeholder={t('pleaseselect')} />}
              />
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('productName')} {Required}
              </p>
              <input
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
              {errors.productName && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldproductName')}
                </span>
              )}
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('amountWeight')} {Required}
              </p>
              <input
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
              {errors.weight && errors.weight.type === 'required' && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldWeight')}
                </span>
              )}
              {errors.weight && errors.weight.type === 'min' && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('minWeight')}
                </span>
              )}
            </Col>
          </Row>
          <Divider />
          <GroupTitle>{t('priceData')}</GroupTitle>
          <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
              <BoldLabel>
                {t('deliveryPrice')} {Required}
              </BoldLabel>
              <FlexBoxCenter>
                <BoldLabel style={{ marginRight: 5 }}>{t('price')}</BoldLabel>
                <Controller
                  name="price"
                  control={control}
                  defaultValue={0}
                  render={({ onChange, value }) => (
                    <input
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
              </FlexBoxCenter>
            </Col>
          </Row>
          <Divider />
          <Row>
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
          </Row>
          <Row>
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
            </Col>
          </Row>
        </form>
      </CardBody>
    </Wrapper>
  );
});

export default AddJobContainer;

const Wrapper = styled.div`
  height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
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

const BoldLabel = styled.p`
  font-weight: bold;
`;
