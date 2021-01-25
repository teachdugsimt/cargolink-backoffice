import React, { useEffect, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import { navigate } from 'gatsby';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';

const AddJobs: React.FC<{}> = observer(() => {
  const { shipperStore, carrierStore } = useMst();

  const { register, handleSubmit } = useForm();
  const [truckType, setTruckType] = useState({ value: 0, label: '' });
  const [productTypeId, setProductTypeId] = useState({ value: 0, label: '' });
  const [truckTypeOptions, setTruckTypeOptions] = useState();
  const [productTypeIdOptions, setProductTypeIdOptions] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

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
    if (data && truckType && productTypeId) {
      shipperStore.postJobs({
        truckType: truckType.value,
        weight: data.weight,
        from: {
          contactMobileNo: data.contactMobileNo,
          contactName: data.contactName,
          dateTime: moment(startDate).format('DD-MM-YYYY HH:mm'),
          // lat: "13.788485",
          // lng: "100.6079443",
          name: data.name,
        },
        to: [
          {
            contactMobileNo: data.contactMobileNo1,
            contactName: data.contactName1,
            dateTime: moment(toDate).format('DD-MM-YYYY HH:mm'),
            // lat: "13.7532001",
            // lng: "100.4878687",
            name: data.name1,
          },
        ],
        truckAmount: 1000,
        productTypeId: productTypeId.value,
        productName: data.productName,
        expiredTime: moment(toDate).subtract(1, 'days').format('DD-MM-YYYY HH:mm'),
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
          <p>ประเภทของรถที่คุณต้องการ *</p>
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
          <p>ข้อมูลสินค้าที่ต้องการส่ง *</p>
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
          <p>ระบุสถานที่ที่ส่งสินค้า *</p>
          <input className="new-input-component" type="text" name="contactName" ref={register} />
          <p>วัน-เวลา ส่งที่ต้องการ</p>
          <DatePicker
            className="new-input-component"
            showTimeSelect
            dateFormat="Pp"
            selected={startDate}
            onChange={(date: any) => setStartDate(date)}
          />
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลติดต่อจุดส่งสินค้า: </p>
            <p>ชื่อผู้ส่งสินค้า</p>
          </div>
          <input className="new-input-component" type="text" name="name" ref={register} />
          <p>เบอร์ติดต่อ</p>
          <input className="new-input-component" type="text" name="contactMobileNo" ref={register} />
          <hr style={{ margin: '1.125rem 0 0' }} />
          <p style={{ fontWeight: 'bold', backgroundColor: '#253858', padding: 10, color: 'white', marginBottom: 0 }}>
            จุดรับสินค้า
          </p>
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>จุดรับสินค้าที่ 1: </p>
            <p>ระบุสถานที่ที่เข้ารับสินค้า *</p>
          </div>
          <input className="new-input-component" type="text" name="contactName1" ref={register} />
          <p>วัน-เวลา รับสินค้าที่ต้องการ</p>
          <DatePicker
            className="new-input-component"
            showTimeSelect
            dateFormat="Pp"
            selected={toDate}
            onChange={(date: any) => setToDate(date)}
          />
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลติดต่อจุดรับสินค้า: </p>
            <p>ชื่อผู้รับสินค้า</p>
          </div>
          <input className="new-input-component" type="text" name="name1" ref={register} />
          <p>เบอร์ติดต่อ</p>
          <input className="new-input-component" type="text" name="contactMobileNo1" ref={register} />
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
