import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Card, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import Switch from '@material-ui/core/Switch';
import { useForm } from 'react-hook-form';
import { UploadFileStore } from '../../../stores/upload-file-store';
import ImageUpload from './image-upload';
import '../../../Layouts/css/style.css';
import provinceOptions from './province-options';
import { useMst } from '../../../stores/root-store';

const ButtonGroup = styled(Button)`
  height: fit-content;
  background-color: white;
  padding: 2px 5px 0px;
`;

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const truckTypeOptions: { value: any; label: any }[] = [
  { value: 1, label: 'รถขนสินค้าแบบกระบะตู้' },
  { value: 2, label: 'Top-Left' },
  { value: 3, label: 'Bottom-Right' },
  { value: 4, label: 'Bottom-Left' },
];

const regionOptions: { value: any; label: any }[] = [
  { value: 1, label: 'ภาคเหนือ' },
  { value: 2, label: 'ภาคกลาง' },
  { value: 3, label: 'ภาคตะวันออกเฉียงเหนือ' },
  { value: 4, label: 'ภาคตะวันตก' },
  { value: 5, label: 'ภาคตะวันออก' },
  { value: 6, label: 'ภาคใต้' },
];

interface Props {}

const AddTruck: React.FC<Props> = observer((props: any) => {
  const { carrierStore } = useMst();
  const { register, handleSubmit } = useForm();
  const [checkbox, setCheckbox] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [haveImage, setHaveImage] = useState(false);
  const [render, setRender] = useState(false);
  const [disable, setDisable] = useState(false);
  const [truckType, setTruckType] = useState();
  const [region, setRegion] = useState();
  const [province, setProvince] = useState();
  const [filterProvince, setFilterProvince] = useState(provinceOptions);
  const [filterRegion, setFilterRegion] = useState(regionOptions);

  const onSubmit = (data) => {
    console.log(data);
    console.log(checkbox);
  };

  const onRemoveImg = (index: number) => {
    const images = pictures.filter((img, i) => i != index);
    setPictures(images);
  };

  const onChangeRegion = (value) => {
    setRegion(value);
    const Region = provinceOptions.filter((e) => e.area == value.value);
    setFilterProvince(Region);
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>เลือกประเภทของรถของคุณ</span>
          <Select
            options={truckTypeOptions}
            placeholder="Select multiple"
            fullWidth
            onChange={(value) => setTruckType(value)}
          />
          <span>รถมีที่ดั้มหรือไม่</span>
          <Switch
            checked={checkbox}
            onChange={() => setCheckbox(!checkbox)}
            color="primary"
            style={{ color: checkbox ? '#00d68f' : '' }}
          />
          <br />
          <span>ความสูงของคอกรถ (หน่วยเป็นเมตร)</span>
          <Input fullWidth>
            <input name="stallHeight" type="text" ref={register} />
          </Input>
          <hr />
          <span>ข้อมูลรถของคุณ</span>
          <span>เลขทะเบียนรถ</span>
          <Input fullWidth>
            <input name="registrationNumber" type="text" ref={register} />
          </Input>
          <hr />
          <span>อัพโหลดรูปภาพรถ</span>
          <br />
          <ImageUpload />
          <hr />
          <span>โซนที่วิ่งงาน</span>
          <Select options={regionOptions} placeholder="ภูมิภาค" fullWidth onChange={(value) => onChangeRegion(value)} />
          <Select options={filterProvince} placeholder="จังหวัด" fullWidth onChange={(value) => setProvince(value)} />
          <br />
          <Button status="Success" type="submit" shape="SemiRound" fullWidth>
            ยืนยัน
          </Button>
        </form>
      </CardBody>
    </Card>
  );
});
export default AddTruck;
