import React, { useEffect, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import { navigate } from 'gatsby';
import moment from 'moment';
// import DatePicker from 'react-datepicker';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
import { Box } from 'theme-ui';
import { EvaIcon } from '@paljs/ui/Icon';

const AddJobs: React.FC<{}> = observer(() => {
  const { shipperStore, carrierStore } = useMst();

  const { register, control, handleSubmit, watch, errors } = useForm({
    mode: 'onChanges',
    reValidateMode: 'onChange',
    defaultValues: {
      items: [{ contactName: '' }],
    },
  });
  const [truckType, setTruckType] = useState({ value: 0, label: '' });
  const [productTypeId, setProductTypeId] = useState({ value: 0, label: '' });
  const [truckTypeOptions, setTruckTypeOptions] = useState();
  const [productTypeIdOptions, setProductTypeIdOptions] = useState();
  // const [startDate, setStartDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());
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
        <span>เพิ่มข้อมูลรถ</span>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="form-add-data">
          <p>
            ประเภทของรถที่คุณต้องการ <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                options={truckTypeOptions}
                status={errors.truckType ? 'Danger' : 'Basic'}
                placeholder="Select multiple"
                onChange={(value: any) => setTruckType(value)}
                fullWidth
              />
            }
            control={control}
            valueName="selected"
            rules={{ required: 'Department cannot be null.' }}
            name="truckType"
            ref={register({ required: true })}
            aria-invalid={errors.truckType ? 'true' : 'false'}
          />
          {errors.truckType && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <p>
            จำนวนคันรถที่ต้องการ <span style={{ color: '#ff3d71' }}>*</span>
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            ข้อมูลสินค้าที่ต้องการส่ง <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                options={productTypeIdOptions}
                status={errors.productTypeId ? 'Danger' : 'Basic'}
                placeholder="Select multiple"
                onChange={(value: any) => setProductTypeId(value)}
                fullWidth
              />
            }
            control={control}
            valueName="selected"
            rules={{ required: 'Department cannot be null.' }}
            name="productTypeId"
            ref={register({ required: true })}
            aria-invalid={errors.productTypeId ? 'true' : 'false'}
          />
          {errors.productTypeId && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <p>
            ระบุชื่อสินค้าของคุณ <span style={{ color: '#ff3d71' }}>*</span>
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <p>
            ระบุจำนวนน้ำหนัก (ตัน) <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input
            className="new-input-component"
            type="number"
            name="weight"
            id="weight"
            style={{
              borderColor: errors.weight ? '#ff3d71' : '',
            }}
            ref={register({ required: true })}
            aria-invalid={errors.weight ? 'true' : 'false'}
          />
          {errors.weight && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <hr style={{ margin: '1.125rem 0 0' }} />
          <p style={{ fontWeight: 'bold', backgroundColor: '#253858', padding: 10, color: 'white' }}>จุดส่งสินค้า</p>
          <p>
            ระบุสถานที่ที่ส่งสินค้า <span style={{ color: '#ff3d71' }}>*</span>
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <p>
            วัน-เวลา ส่งที่ต้องการ <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Box sx={{ maxWidth: '400px' }} as="form" onSubmit={handleSubmit((data) => console.log(data))}>
            <Controller
              as={
                <ReactDatePicker
                  className={errors.start ? 'errors-input-component' : 'new-input-component'}
                  dateFormat="d MMM yyyy"
                  selected={startDate ? new Date(startDate) : null}
                  showTimeSelect
                  todayButton="Today"
                  dropdownMode="select"
                  isClearable
                  placeholderText="Click to select time"
                  shouldCloseOnSelect
                />
              }
              control={control}
              register={register({ required: true })}
              rules={{ required: 'Department cannot be null.' }}
              name="start"
              aria-invalid={errors.start ? 'true' : 'false'}
              onChange={([selected]: any) => {
                return { value: selected };
              }}
            />
          </Box>
          {errors.start && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลติดต่อจุดส่งสินค้า: </p>
            <p>
              ชื่อผู้ส่งสินค้า <span style={{ color: '#ff3d71' }}>*</span>
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <p>
            เบอร์ติดต่อ <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input
            className="new-input-component"
            type="text"
            name="contactMobileNo"
            style={{
              borderColor: errors.contactMobileNo ? '#ff3d71' : '',
            }}
            ref={register({ required: true })}
            aria-invalid={errors.contactMobileNo ? 'true' : 'false'}
          />
          {errors.contactMobileNo && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
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
            จุดรับสินค้า
          </p>
          {fields.map(({ id, contactName, name, contactMobileNo, exdate }, index) => {
            const toDate = watch(`items[${index}].exdate`);
            return (
              <div key={id}>
                <div style={{ display: 'flex' }}>
                  <p style={{ fontWeight: 'bold', marginRight: 5 }}>จุดรับสินค้าที่ {index == 0 ? 1 : index + 1}: </p>
                  <p>
                    ระบุสถานที่ที่เข้ารับสินค้า <span style={{ color: '#ff3d71' }}>*</span>
                  </p>
                </div>
                <input
                  className="new-input-component"
                  type="text"
                  style={{
                    borderColor: errors.items?.filter((e) => e.contactName) ? '#ff3d71' : '',
                  }}
                  name={`items[${index}].contactName`}
                  defaultValue={contactName}
                  ref={register({ required: true })}
                  aria-invalid={errors.items?.filter((e) => e.contactName) ? 'true' : 'false'}
                />
                {errors.items?.filter((e) => e.contactName) && (
                  <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
                    This field is required
                  </span>
                )}
                <p>
                  วัน-เวลา รับสินค้าที่ต้องการ <span style={{ color: '#ff3d71' }}>*</span>
                </p>
                <Box sx={{ maxWidth: '400px' }} as="form" onSubmit={handleSubmit((data) => console.log(data))}>
                  <Controller
                    as={
                      <ReactDatePicker
                        className={
                          errors.items?.filter((e) => e.exdate) ? 'errors-input-component' : 'new-input-component'
                        }
                        dateFormat="d MMM yyyy"
                        selected={toDate ? new Date(toDate) : null}
                        showTimeSelect
                        todayButton="Today"
                        dropdownMode="select"
                        isClearable
                        placeholderText="Click to select time"
                        shouldCloseOnSelect
                      />
                    }
                    control={control}
                    name={`items[${index}].exdate`}
                    rules={{ required: 'Department cannot be null.' }}
                    ref={register({ required: true })}
                    aria-invalid={errors.items?.filter((e) => e.exdate) ? 'true' : 'false'}
                    defaultValue={toDate}
                    onChange={([selected]: any) => {
                      return { value: selected };
                    }}
                  />
                </Box>
                {errors.items?.filter((e) => e.exdate) && (
                  <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
                    This field is required
                  </span>
                )}
                <div style={{ display: 'flex' }}>
                  <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลติดต่อจุดรับสินค้า: </p>
                  <p>
                    ชื่อผู้รับสินค้า <span style={{ color: '#ff3d71' }}>*</span>
                  </p>
                </div>
                <input
                  className="new-input-component"
                  type="text"
                  name={`items[${index}].name`}
                  style={{
                    borderColor: errors.items?.filter((e) => e.name) ? '#ff3d71' : '',
                  }}
                  ref={register({ required: true })}
                  aria-invalid={errors.items?.filter((e) => e.name) ? 'true' : 'false'}
                  defaultValue={name}
                />
                {errors.items?.filter((e) => e.name) && (
                  <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
                    This field is required
                  </span>
                )}
                <p>
                  เบอร์ติดต่อ <span style={{ color: '#ff3d71' }}>*</span>
                </p>
                <input
                  className="new-input-component"
                  type="text"
                  name={`items[${index}].contactMobileNo`}
                  style={{
                    borderColor: errors.items?.filter((e) => e.contactMobileNo) ? '#ff3d71' : '',
                  }}
                  defaultValue={contactMobileNo}
                  ref={register({ required: true })}
                  aria-invalid={errors.items?.filter((e) => e.contactMobileNo) ? 'true' : 'false'}
                />
                {errors.items?.filter((e) => e.contactMobileNo) && (
                  <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
                    This field is required
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
