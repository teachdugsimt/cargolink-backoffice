import React, { useEffect, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import styled from 'styled-components';
import { Card, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import { navigate } from 'gatsby';
import moment from 'moment';

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const AddJobs: React.FC<{}> = observer(({}) => {
  const { shipperStore } = useMst();

  const { register, handleSubmit } = useForm();
  const [truckType, setTruckType] = useState([]);
  const [productTypeId, setProductTypeId] = useState([]);

  const truckTypeOptions: { value: any; label: any }[] = [
    { value: 1, label: 'รถขนสินค้าแบบกระบะตู้1' },
    { value: 2, label: 'รถขนสินค้าแบบกระบะตู้2' },
    { value: 3, label: 'รถขนสินค้าแบบกระบะตู้3' },
    { value: 4, label: 'รถขนสินค้าแบบกระบะตู้4' },
  ];

  const productTypeIdOption: { value: any; label: any }[] = [
    { value: 1, label: 'สินค้าการเกษตร1' },
    { value: 2, label: 'สินค้าการเกษตร2' },
    { value: 3, label: 'สินค้าการเกษตร3' },
    { value: 4, label: 'สินค้าการเกษตร4' },
    { value: 5, label: 'สินค้าการเกษตร5' },
  ];

  const onSubmit = (data) => {
    console.log(data);
    console.log(truckType.value, productTypeId.value);
    if (data && truckType && productTypeId) {
      shipperStore.postJobs({
        truckType: truckType.value,
        weight: data.weight,
        from: {
          contactMobileNo: data.contactMobileNo,
          contactName: data.contactName,
          dateTime: data.dateTime,
          // lat: "13.788485",
          // lng: "100.6079443",
          name: data.contactName,
        },
        to: [
          {
            contactMobileNo: data.contactMobileNo1,
            contactName: data.contactName1,
            dateTime: data.dateTime1,
            // lat: "13.7532001",
            // lng: "100.4878687",
            name: data.name1,
          },
        ],
        truckAmount: 1000,
        productTypeId: productTypeId.value,
        productName: data.productName,
        expiredTime: moment(new Date().toDateString()).add(3, 'days').format('DD-MM-YYYY HH:mm'),
      });
    }
  };
  console.log(moment(new Date().toDateString()).add(3, 'days').format('DD-MM-YYYY HH:mm'));

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>ประเภทของรถที่คุณต้องการ *</span>
          <Select
            name="truckType"
            options={truckTypeOptions}
            placeholder="Select multiple"
            onChange={(value) => setTruckType(value)}
            fullWidth
          />
          <span>จำนวนคันรถที่ต้องการ</span>
          <Input fullWidth>
            <input type="number" ref={register} name="truckAmount" />
          </Input>
          <hr />
          <span>ข้อมูลสินค้าที่ต้องการส่ง *</span>
          <Select
            name="productTypeId"
            options={productTypeIdOption}
            placeholder="Select multiple"
            onChange={(value) => setProductTypeId(value)}
            fullWidth
          />
          <span>ระบุชื่อสินค้าของคุณ</span>
          <Input fullWidth>
            <input type="text" name="productName" ref={register} />
          </Input>
          <span>ระบุจำนวนน้ำหนัก (ตัน)</span>
          <Input fullWidth>
            <input type="number" name="weight" ref={register} />
          </Input>
          <hr />
          <span>จุดรับสินค้า *</span>
          <br />
          <span>ระบุสถานที่ที่เข้ารับสินค้า</span>
          <Input fullWidth>
            <input type="text" name="contactName" ref={register} />
          </Input>
          <span>วัน-เวลา รับสินค้าที่ต้องการ</span>
          <Input fullWidth>
            <input type="text" name="dateTime" ref={register} />
          </Input>
          <span>ข้อมูลติดต่อจุดรับสินค้า</span>
          <br />
          <span>ชื่อผู้รับสินค้า</span>
          <Input fullWidth>
            <input type="text" name="name" ref={register} />
          </Input>
          <span>เบอร์ติดต่อ</span>
          <Input fullWidth>
            <input type="text" name="contactMobileNo" ref={register} />
          </Input>
          <hr />
          <span>จุดรับสินค้าที่1 *</span>
          <br />
          <span>ระบุสถานที่ที่เข้ารับสินค้า</span>
          <Input fullWidth>
            <input type="text" name="contactName1" ref={register} />
          </Input>
          <span>วัน-เวลา รับสินค้าที่ต้องการ</span>
          <Input fullWidth>
            <input type="text" name="dateTime1" ref={register} />
          </Input>
          <span>ข้อมูลติดต่อจุดรับสินค้า</span>
          <br />
          <span>ชื่อผู้รับสินค้า</span>
          <Input fullWidth>
            <input type="text" name="name1" ref={register} />
          </Input>
          <span>เบอร์ติดต่อ</span>
          <Input fullWidth>
            <input type="text" name="contactMobileNo1" ref={register} />
          </Input>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button status="Success" type="submit" shape="SemiRound" fullWidth>
              ยืนยัน
            </Button>
            <Button status="Warning" type="button" onClick={() => navigate('/jobs')} fullWidth>
              กลับ
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
});
export default AddJobs;
