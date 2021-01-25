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

const AddJobs: React.FC<{}> = observer(() => {
  const { shipperStore, carrierStore } = useMst();

  const { register, control, handleSubmit, watch } = useForm({
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

  const startDate = watch('strat');

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
    console.log(data);
    console.log(data.items);
    if (data && truckType && productTypeId) {
      shipperStore.postJobs({
        truckType: truckType.value,
        weight: data.weight,
        from: {
          contactMobileNo: data.contactMobileNo,
          contactName: data.contactName,
          dateTime: moment(data.strat).format('DD-MM-YYYY HH:mm'),
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
        productTypeId: productTypeId.value,
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
          <Select
            name="truckType"
            options={truckTypeOptions}
            placeholder="Select multiple"
            onChange={(value: any) => setTruckType(value)}
            fullWidth
          />
          <p>จำนวนคันรถที่ต้องการ</p>
          <input className="new-input-component" type="number" ref={register} name="truckAmount" />
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            ข้อมูลสินค้าที่ต้องการส่ง <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Select
            name="productTypeId"
            options={productTypeIdOptions}
            placeholder="Select multiple"
            onChange={(value: any) => setProductTypeId(value)}
            fullWidth
          />
          <p>ระบุชื่อสินค้าของคุณ</p>
          <input className="new-input-component" type="text" name="productName" ref={register} />
          <p>ระบุจำนวนน้ำหนัก (ตัน)</p>
          <input className="new-input-component" type="number" name="weight" ref={register} />
          <hr style={{ margin: '1.125rem 0 0' }} />
          <p style={{ fontWeight: 'bold', backgroundColor: '#253858', padding: 10, color: 'white' }}>จุดส่งสินค้า</p>
          <p>
            ระบุสถานที่ที่ส่งสินค้า <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input className="new-input-component" type="text" name="contactName" ref={register} />
          <p>วัน-เวลา ส่งที่ต้องการ</p>
          <Box sx={{ maxWidth: '400px' }} as="form" onSubmit={handleSubmit((data) => console.log(data))}>
            <Controller
              as={
                <ReactDatePicker
                  className="new-input-component"
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
              name="strat"
              onChange={([selected]: any) => {
                return { value: selected };
              }}
              required
            />
          </Box>
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลติดต่อจุดส่งสินค้า: </p>
            <p>ชื่อผู้ส่งสินค้า</p>
          </div>
          <input className="new-input-component" type="text" name="name" ref={register} />
          <p>เบอร์ติดต่อ</p>
          <input className="new-input-component" type="text" name="contactMobileNo" ref={register} />
          {fields.map(({ id, contactName, name, contactMobileNo, exdate }, index) => {
            const toDate = watch(`items[${index}].exdate`);
            return (
              <div key={id}>
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
                <div style={{ display: 'flex' }}>
                  <p style={{ fontWeight: 'bold', marginRight: 5 }}>จุดรับสินค้าที่ {index == 0 ? 1 : index + 1}: </p>
                  <p>
                    ระบุสถานที่ที่เข้ารับสินค้า <span style={{ color: '#ff3d71' }}>*</span>
                  </p>
                </div>
                <input
                  className="new-input-component"
                  type="text"
                  ref={register()}
                  name={`items[${index}].contactName`}
                  defaultValue={contactName}
                />
                <p>วัน-เวลา รับสินค้าที่ต้องการ</p>
                <Box sx={{ maxWidth: '400px' }} as="form" onSubmit={handleSubmit((data) => console.log(data))}>
                  <Controller
                    as={
                      <ReactDatePicker
                        className="new-input-component"
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
                    ref={register()}
                    name={`items[${index}].exdate`}
                    defaultValue={toDate}
                    onChange={([selected]: any) => {
                      return { value: selected };
                    }}
                    required
                  />
                </Box>
                <div style={{ display: 'flex' }}>
                  <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลติดต่อจุดรับสินค้า: </p>
                  <p>ชื่อผู้รับสินค้า</p>
                </div>
                <input
                  className="new-input-component"
                  type="text"
                  ref={register()}
                  name={`items[${index}].name`}
                  defaultValue={name}
                />
                <p>เบอร์ติดต่อ</p>
                <input
                  className="new-input-component"
                  type="text"
                  name={`items[${index}].contactMobileNo`}
                  defaultValue={contactMobileNo}
                  ref={register()}
                />
                <Button type="button" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            );
          })}
          <Button type="button" onClick={() => append({})}>
            Append
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
