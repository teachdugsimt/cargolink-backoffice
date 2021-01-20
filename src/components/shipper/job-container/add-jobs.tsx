import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { Card, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const AddJobs = (props: any) => {
  const submit = () => {};

  const positionOptions: { value: any; label: any }[] = [
    { value: 1, label: 'รถขนสินค้าแบบกระบะตู้' },
    { value: 'topLeft', label: 'Top-Left' },
    { value: 'bottomRight', label: 'Bottom-Right' },
    { value: 'bottomLeft', label: 'Bottom-Left' },
  ];

  const statusOption: { value: any; label: any }[] = [
    { label: 'สินค้าการเกษตร', value: 'สินค้าการเกษตร' },
    { value: 'Info', label: 'Info' },
    { value: 'Success', label: 'Success' },
    { value: 'Danger', label: 'Danger' },
    { value: 'Primary', label: 'Primary' },
  ];

  return (
    <Card>
      <CardBody>
        <form>
          <span>ประเภทของรถที่คุณต้องการ *</span>
          <Select options={positionOptions} isMulti placeholder="Select multiple" fullWidth />
          <span>จำนวนคันรถที่ต้องการ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <hr />
          <span>ข้อมูลสินค้าที่ต้องการส่ง *</span>
          <Select options={statusOption} isMulti placeholder="Select multiple" fullWidth />
          <span>ระบุชื่อสินค้าของคุณ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>ระบุจำนวนน้ำหนัก (ตัน)</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <hr />
          <span>จุดรับสินค้า *</span>
          <br />
          <span>ระบุสถานที่ที่เข้ารับสินค้า</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>วันรับสินค้าที่ต้องการ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>เวลารับสินค้าที่ต้องการ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>ข้อมูลติดต่อจุดรับสินค้า</span>
          <br />
          <span>ชื่อผู้รับสินค้า</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>เบอร์ติดต่อ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <hr />
          <span>จุดรับสินค้าที่1 *</span>
          <br />
          <span>ระบุสถานที่ที่เข้ารับสินค้า</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>วันรับสินค้าที่ต้องการ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>เวลารับสินค้าที่ต้องการ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>ข้อมูลติดต่อจุดรับสินค้า</span>
          <br />
          <span>ชื่อผู้รับสินค้า</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <span>เบอร์ติดต่อ</span>
          <Input fullWidth>
            <input type="text" />
          </Input>
          <Button status="Success" type="submit" shape="SemiRound" onClick={() => submit()} fullWidth>
            ยืนยัน
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
export default AddJobs;
