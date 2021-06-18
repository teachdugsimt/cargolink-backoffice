import React, { useEffect, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import { navigate } from 'gatsby';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { GoogleMapWithSearch } from '../../google-map-with-search/google-map-with-search';
import { Text } from '../../text-span/text'
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
import { Box } from 'theme-ui';
import { EvaIcon } from '@paljs/ui/Icon';
import { Accordion, AccordionItem } from '@paljs/ui/Accordion';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import PriceTypeToggle, { PriceTypeEnum } from './price-type-toggle';
import { FormFooter } from '@atlaskit/form';
import th from 'date-fns/locale/th';
registerLocale('th', th);

const userOptions: any = [
  { value: 'virachai', label: 'virachai' },
  { value: 'miww', label: 'Miww' },
  { value: 'cargolink', label: 'cargolink' },
];

const AddJobs: React.FC<{}> = observer(() => {
  const { t } = useTranslation();
  const { shipperStore, carrierStore, loginStore } = useMst();

  const { register, control, handleSubmit, watch, errors } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
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
    },
  });
  const [truckTypeOptions, setTruckTypeOptions] = useState();
  const [productTypeIdOptions, setProductTypeIdOptions] = useState();
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const startDate = watch('start');

  console.log('jobType:>>', productTypeIdOptions);

  useEffect(() => {
    carrierStore.getAllTruckTypes();
    shipperStore.getProductTypes();
  }, []);

  useEffect(() => {
    const { loading } = shipperStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: t('LOADING'),
    });
  }, [shipperStore.loading]);

  useEffect(() => {
    const { success_response } = shipperStore;
    if (success_response) navigate('/jobs');
  }, [shipperStore.success_response]);

  useEffect(() => {
    const { error_response } = shipperStore;
    if (error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: error_response.title || '',
        content: error_response.content || '',
      });
    }
  }, [shipperStore.error_response]);

  useEffect(() => {
    const trucks_types = JSON.parse(JSON.stringify(carrierStore.trucks_types));
    if (trucks_types?.length) {
      const array = trucks_types.map((truck: any) => ({
        value: truck.id,
        label: truck.name,
      }));
      setTruckTypeOptions(array);
    }
  }, [carrierStore.trucks_types, carrierStore.trucks_types?.length]);

  useEffect(() => {
    const allProductTypeId = JSON.parse(JSON.stringify(shipperStore.product_types));
    const array =
      allProductTypeId &&
      allProductTypeId.map((product: any) => ({
        value: product.id,
        label: product.name,
      }));
    setProductTypeIdOptions(array);
  }, [shipperStore.product_types, shipperStore.product_types?.length]);

  const onSubmit = (data: any) => {
    console.log("Onsubmmit data :: ", data)

    if (data && data.truckType.value && data.productTypeId.value) {
      const a = new Date()
      const expiredDate = moment(a).add(2, 'days');
      console.log("Expired Date new date () :: ", expiredDate.format("DD-MM-YYYY HH:mm"))
      console.log("Expired time with - 1 day :: ", moment(data.start).subtract(1, 'days').format("DD-MM-YYYY HH:mm"))
      console.log('Check receive time <= expired time :: ', data.start <= expiredDate)
      if (data.start <= expiredDate) {
        alert("Check loading date please")
      } else {
        shipperStore.postJobs({
          truckType: data.truckType.value,
          weight: data.weight,
          from: {
            contactMobileNo: data.contactMobileNo,
            contactName: data.contactName,
            dateTime: moment(data.start).format('DD-MM-YYYY HH:mm'),
            lat: data?.pickupRegion?.lat,
            lng: data?.pickupRegion?.lng,
            name: data.name,
          },
          to:
            data &&
            data.items &&
            data.items.map((e: any, i: any) => {
              return {
                contactMobileNo: e.contactMobileNo,
                contactName: e.contactName,
                dateTime: moment(e.exdate).format('DD-MM-YYYY HH:mm'),
                name: e.name,
                lat: e?.region?.lat,
                lng: e?.region?.lng
              };
            }),
          truckAmount: data.truckAmount,
          productTypeId: data.productTypeId.value,
          productName: data.productName,
          expiredTime: moment(data.start).subtract(1, 'days').format("DD-MM-YYYY HH:mm"),
        });
      }
    }
  };

  let formControllerValue = control.getValues()

  const onSubmitLocation = (addr: string, region: { lat: number, lng: number }, key: { address: string, region: string }) => {
    control.setValue(key.address, addr)
    control.setValue(key.region, region)
  }
  const onSubmitLocation2 = (addr: string, region: { lat: number, lng: number }, indexx: number) => {
    control.setValue(`items[${indexx}].contactName`, addr)
    control.setValue(`items[${indexx}].region`, region)
  }

  const Required = <span style={{ color: '#FF3D71' }}>*</span>

  return (
    <div>
      <Alert setting={alertSetting} />
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
                as={
                  <Select
                    options={userOptions}
                    status={errors.user ? 'Danger' : 'Basic'}
                    placeholder={t('pleaseselect')}
                    fullWidth
                  />
                }
                id="user"
                control={control}
                valueName="selected"
                rules={{ required: 'Truck type cannot be null.' }}
                name="user"
                ref={register({ required: true })}
                aria-invalid={errors.user ? 'true' : 'false'}
              />
              {errors.user && (
                <span id="user" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('user')}
                </span>
              )}
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('typeCar')} {Required}
              </p>
              <Controller
                as={
                  <Select
                    options={truckTypeOptions}
                    status={errors.truckType ? 'Danger' : 'Basic'}
                    placeholder={t('pleaseselect')}
                    fullWidth
                  />
                }
                control={control}
                valueName="selected"
                rules={{ required: 'Truck Type cannot be null.' }}
                name="truckType"
                ref={register({ required: true })}
                aria-invalid={errors.truckType ? 'true' : 'false'}
              />
              {errors.truckType && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldTruckType')}
                </span>
              )}
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('truckAmount')} {Required}
              </p>
              <input
                className="new-input-component"
                type="number"
                style={{
                  borderColor: errors.truckAmount ? '#ff3d71' : '',
                }}
                name="truckAmount"
                id="truckAmount"
                ref={register({ required: true })}
                aria-invalid={errors.truckAmount ? 'true' : 'false'}
              />
              {errors.truckAmount && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldTruckAmount')}
                </span>
              )}
            </Col>
          </Row>

          <hr style={{ margin: '1.125rem 0' }} />
          <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <p>
                {t('productType')} {Required}
              </p>
              <Controller
                as={
                  <Select
                    options={productTypeIdOptions}
                    status={errors.productTypeId ? 'Danger' : 'Basic'}
                    placeholder={t('pleaseselect')}
                    fullWidth
                  />
                }
                control={control}
                valueName="selected"
                rules={{ required: 'Product Type cannot be null.' }}
                name="productTypeId"
                ref={register({ required: true })}
                aria-invalid={errors.productTypeId ? 'true' : 'false'}
              />
              {errors.productTypeId && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldproductType')}
                </span>
              )}
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

          <hr style={{ margin: '1.125rem 0 0' }} />
          <p style={{ fontWeight: 'bold', backgroundColor: '#253858', padding: 10, color: 'white' }}>
            {t('priceData')}
          </p>
          <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
              <p style={{ fontWeight: 'bold' }}>
                {t('deliveryPrice')} {Required}
              </p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ fontWeight: 'bold', marginRight: 5 }}>{t('price')}</p>
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
                  )} />
                <p style={{ fontWeight: 'bold', marginRight: 20, marginLeft: 5 }}>{t('baht')}</p>
                <Controller
                  name="priceType"
                  control={control}
                  defaultValue={PriceTypeEnum.PER_TRIP}
                  render={({ onChange, value }) => (
                    <PriceTypeToggle priceType={value} onChange={(changeTo) => onChange(changeTo)} />
                  )}
                />
              </div>
            </Col>
          </Row>

          <hr style={{ margin: '1.125rem 0 0' }} />
          <p style={{ fontWeight: 'bold', backgroundColor: '#253858', padding: 10, color: 'white' }}>
            {t('pickUp')}
          </p>
          <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
              <p>
                {t('deliveryLocation')} {Required}
              </p>
              <Controller
                name="pickupRegion"
                control={control}
                defaultValue=""
                render={({ onChange, value }) => <></>}
              />
              <Controller
                name="contactName"
                control={control}
                defaultValue=""
                render={({ onChange, value }) => <>
                  <Accordion>
                    <AccordionItem uniqueKey={1} title={<Text tx={"selectLocation"} preset="content" />}>
                      <GoogleMapWithSearch
                        center={{ lat: 13.736717, lng: 100.523186 }}
                        height="500px"
                        zoom={15}
                        onAddressChange={(addr, region) => onSubmitLocation(addr, region, { address: "contactName", region: "pickupRegion" })}
                      />
                    </AccordionItem>
                  </Accordion>
                </>}
                register={register({ required: true })}
                rules={{ required: 'Address can not null.' }}
              />
              {errors.contactName && (
                <span style={{ color: '#ff3d71', marginLeft: 10, marginTop: 20, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldDeliveryLocation')}
                </span>
              )}
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <p>
                {t('dateStart')} {Required}
              </p>
              <Box sx={{ maxWidth: '400px' }} as="form" onSubmit={handleSubmit((data) => console.log(data))}>
                <Controller
                  as={
                    <ReactDatePicker
                      className={errors.start ? 'errors-input-component' : 'new-input-component'}
                      locale={loginStore.language}
                      dateFormat="d MMM yyyy HH:mm"
                      selected={startDate ? new Date(startDate) : null}
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
                  register={register({ required: true })}
                  rules={{ required: 'Start from cannot be null.' }}
                  name="start"
                  aria-invalid={errors.start ? 'true' : 'false'}
                  onChange={([selected]: any) => {
                    return { value: selected };
                  }}
                />
              </Box>
              {errors.start && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldDateStart')}
                </span>
              )}
            </Col>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <div style={{ display: 'flex' }}>
                <p style={{ fontWeight: 'bold', marginRight: 5 }}>{t('deliveryPointInformation')}: </p>
                <p>
                  {t('shipperName')} {Required}
                </p>
              </div>
              <input
                className="new-input-component"
                type="text"
                name="name"
                id="name"
                style={{
                  borderColor: errors.name ? '#ff3d71' : '',
                }}
                ref={register({ required: true })}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldShipperName')}
                </span>
              )}
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
                style={{
                  borderColor: errors.contactMobileNo ? '#ff3d71' : '',
                }}
                ref={register({ required: true })}
                aria-invalid={errors.contactMobileNo ? 'true' : 'false'}
              />
              {errors.contactMobileNo && (
                <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                  {t('fieldContactNumber')}
                </span>
              )}
            </Col>
          </Row>
          <hr style={{ margin: '1.125rem 0 0' }} />
          <p
            style={{
              fontWeight: 'bold',
              backgroundColor: '#253858',
              padding: 10,
              color: 'white',
              marginBottom: 0,
            }}
          >
            {t('deliveryPoint')}
          </p>
          {fields.map(({ id, contactName, name, contactMobileNo, exdate }, index) => {
            const toDate = watch(`items[${index}].exdate`);
            return (
              <Row key={id}>
                <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
                  <div style={{ display: 'flex' }}>
                    <p style={{ fontWeight: 'bold', marginRight: 5 }}>
                      {t('pickUpAt')} {index == 0 ? 1 : index + 1}:{' '}
                    </p>
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
                    render={({ onChange, value }) => <>
                      <Accordion>
                        <AccordionItem uniqueKey={1} title={<Text tx={"selectLocation"} preset="content" />}>
                          <GoogleMapWithSearch
                            center={{ lat: 13.736717, lng: 100.523186 }}
                            height="500px"
                            zoom={15}
                            onAddressChange={(addr, region) => onSubmitLocation2(addr, region, index)}
                          />
                        </AccordionItem>
                      </Accordion>
                    </>}
                    register={register({ required: true })}
                    rules={{ required: 'Address can not null.' }}
                  />
                  {errors.items && errors.items[index]?.contactName && (
                    <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                      {t('fieldPickupLocation')}
                    </span>
                  )}
                </Col>
                {/* <input
                  className="new-input-component"
                  type="text"
                  style={{
                    borderColor: errors.items && errors.items[index]?.contactName ? '#ff3d71' : '',
                  }}
                  name={`items[${index}].contactName`}
                  defaultValue={contactName}
                  ref={register({ required: true })}
                  aria-invalid={errors.items && errors.items[index]?.contactName ? 'true' : 'false'}
                />
               */}
                <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
                  <p>
                    {t('endDate')} {Required}
                  </p>
                  <Box sx={{ maxWidth: '400px' }} as="form" onSubmit={handleSubmit((data) => console.log(data))}>
                    <Controller
                      as={
                        <ReactDatePicker
                          className={
                            errors.items && errors.items[index]?.exdate ? 'errors-input-component' : 'new-input-component'
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
                  {errors.items && errors.items[index]?.exdate && (
                    <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                      {t('fieldDateStart')}
                    </span>
                  )}
                </Col>
                <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
                  <div style={{ display: 'flex' }}>
                    <p style={{ fontWeight: 'bold', marginRight: 5 }}>{t('pickUpPointInformation')}: </p>
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
                  {errors.items && errors.items[index]?.name && (
                    <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                      {t('fieldConsigneeName')}
                    </span>
                  )}
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
                  {errors.items && errors.items[index]?.contactMobileNo && (
                    <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                      {t('fieldContactNumber')}
                    </span>
                  )}
                </Col>
                {index == 0 ? (
                  <></>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.125rem' }}>
                    <Button
                      type="button"
                      size="Small"
                      shape="SemiRound"
                      style={{ backgroundColor: '#e03616', borderColor: '#e03616' }}
                      onClick={() => remove(index)}
                    >
                      <EvaIcon name="minus-outline" />
                    </Button>
                  </div>
                )}
                <hr style={{ margin: '1.125rem 0 0' }} />
              </Row>
            );
          })}
          <Button
            type="button"
            size="Small"
            shape="SemiRound"
            style={{ backgroundColor: '#253858', borderColor: '#253858', marginTop: '1.125rem' }}
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
          </Row>
        </form>
      </CardBody>
    </div>
  );
});
export default AddJobs;
