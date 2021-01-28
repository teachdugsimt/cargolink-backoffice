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
// import DatePicker from 'react-datepicker';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
import { Box } from 'theme-ui';
import { EvaIcon } from '@paljs/ui/Icon';
import th from 'date-fns/locale/th';
registerLocale('th', th);

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
      items: [{ contactMobileNo: null, contactName: null, exdate: null, name: null }],
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
      content: 'Loading',
    });
  }, [shipperStore.loading]);

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
    const allTrucksTypes = JSON.parse(JSON.stringify(carrierStore.trucks_types));
    const array =
      allTrucksTypes &&
      allTrucksTypes.map((truck: any) => ({
        value: truck.id,
        label: truck.name,
      }));
    setTruckTypeOptions(array);
  }, [carrierStore.trucks_types]);

  useEffect(() => {
    const allProductTypeId = JSON.parse(JSON.stringify(shipperStore.product_types));
    const array =
      allProductTypeId &&
      allProductTypeId.map((product: any) => ({
        value: product.id,
        label: product.name,
      }));
    setProductTypeIdOptions(array);
  }, [shipperStore.product_types]);

  const onSubmit = (data: any) => {
    if (data && data.truckType.value && data.productTypeId.value) {
      shipperStore.postJobs({
        truckType: data.truckType.value,
        weight: data.weight,
        from: {
          contactMobileNo: data.contactMobileNo,
          contactName: data.contactName,
          dateTime: moment(data.start).format('DD-MM-YYYY HH:mm'),
          // lat: "13.788485",
          // lng: "100.6079443",
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
            };
          }),
        truckAmount: data.truckAmount,
        productTypeId: data.productTypeId.value,
        productName: data.productName,
        // expiredTime: moment(new Date().toDateString()).subtract(1, 'days').format('DD-MM-YYYY HH:mm'),
        expiredTime: moment(new Date().toDateString()).add(2, 'days').format('DD-MM-YYYY HH:mm'),
      });
    }
  };

  return (
    <Card>
      <Alert setting={alertSetting} />
      <CardHeader>
        <span>{t('addDataCar')}</span>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="form-add-data">
          <p>
            {t('typeCar')} <span style={{ color: '#ff3d71' }}>*</span>
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
          <p>
            {t('truckAmount')} <span style={{ color: '#ff3d71' }}>*</span>
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
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            {t('productType')} <span style={{ color: '#ff3d71' }}>*</span>
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
          <p>
            {t('productName')} <span style={{ color: '#ff3d71' }}>*</span>
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
          <p>
            {t('amountWeight')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input
            className="new-input-component"
            type="number"
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
          <hr style={{ margin: '1.125rem 0 0' }} />
          <p style={{ fontWeight: 'bold', backgroundColor: '#253858', padding: 10, color: 'white' }}>
            {t('deliveryPoint')}
          </p>
          <p>
            {t('deliveryLocation')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input
            className="new-input-component"
            type="text"
            name="contactName"
            id="contactName"
            style={{
              borderColor: errors.contactName ? '#ff3d71' : '',
            }}
            ref={register({ required: true })}
            aria-invalid={errors.contactName ? 'true' : 'false'}
          />
          {errors.contactName && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldDeliveryLocation')}
            </span>
          )}
          <p>
            {t('dateStart')} <span style={{ color: '#ff3d71' }}>*</span>
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
                  placeholderText="Click to select time"
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
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>{t('deliveryPointInformation')}: </p>
            <p>
              {t('shipperName')} <span style={{ color: '#ff3d71' }}>*</span>
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
          <p>
            {t('contactNumber')} <span style={{ color: '#ff3d71' }}>*</span>
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
            {t('pickUp')}
          </p>
          {fields.map(({ id, contactName, name, contactMobileNo, exdate }, index) => {
            const toDate = watch(`items[${index}].exdate`);
            return (
              <div key={id}>
                <div style={{ display: 'flex' }}>
                  <p style={{ fontWeight: 'bold', marginRight: 5 }}>
                    {t('pickUpAt')} {index == 0 ? 1 : index + 1}:{' '}
                  </p>
                  <p>
                    {t('pickupLocation')} <span style={{ color: '#ff3d71' }}>*</span>
                  </p>
                </div>
                <input
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
                {errors.items && errors.items[index]?.contactName && (
                  <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                    {t('fieldPickupLocation')}
                  </span>
                )}
                <p>
                  {t('endDate')} <span style={{ color: '#ff3d71' }}>*</span>
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
                        placeholderText="Click to select time"
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
                <div style={{ display: 'flex' }}>
                  <p style={{ fontWeight: 'bold', marginRight: 5 }}>{t('pickUpPointInformation')}: </p>
                  <p>
                    {t('consigneeName')} <span style={{ color: '#ff3d71' }}>*</span>
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
                <p>
                  {t('contactNumber')} <span style={{ color: '#ff3d71' }}>*</span>
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
              </div>
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
          <div style={{ display: 'flex' }}>
            <Button
              type="button"
              status="Warning"
              shape="Rectangle"
              fullWidth
              onClick={() => navigate('/jobs')}
              style={{ marginRight: 10, backgroundColor: '#FBBC12', borderColor: '#FBBC12' }}
            >
              กลับ
            </Button>
            <Button
              status="Success"
              type="submit"
              shape="Rectangle"
              fullWidth
              style={{ backgroundColor: '#00B132', borderColor: '#00B132' }}
            >
              ยืนยัน
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
});
export default AddJobs;
