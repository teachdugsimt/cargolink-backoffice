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
import provinceOptions from './province-options';
import { useMst } from '../../../stores/root-store';
import Alert from '../../alert';
import '../../../Layouts/css/style.css';

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const regionOptions: { value: any; label: any }[] = [
  { value: 1, label: 'ภาคเหนือ' },
  { value: 2, label: 'ภาคกลาง' },
  { value: 3, label: 'ภาคตะวันออกเฉียงเหนือ' },
  { value: 4, label: 'ภาคตะวันตก' },
  { value: 5, label: 'ภาคตะวันออก' },
  { value: 6, label: 'ภาคใต้' },
];

const stallHeightOption: { value: any; label: any }[] = [
  { value: 'LOW', label: 'LOW' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'HIGH', label: 'HIGH' },
];

const defaultAlertSetting = {
  icon: '',
  show: false,
  type: '',
  title: '',
  content: '',
};

interface Props {}

const AddTruck: React.FC<Props> = observer((props: any) => {
  const { carrierStore } = useMst();
  const { register, handleSubmit } = useForm();
  const [checkbox, setCheckbox] = useState(false);
  const [truckType, setTruckType] = useState({ value: 0, label: '' });
  const [region, setRegion] = useState({ value: 0, label: '' });
  const [province, setProvince] = useState({ value: 0, label: '' });
  const [stallHeight, setStallHeight] = useState({ value: 0, label: '' });
  const [filterProvince, setFilterProvince] = useState(provinceOptions);
  const [filterRegion, setFilterRegion] = useState(regionOptions);
  const [truckTypeOptions, setTruckTypeOptions] = useState();
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

  useEffect(() => {
    carrierStore.getAllTruckTypes();
  }, []);

  useEffect(() => {
    const { loading } = carrierStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: 'Loading',
    });
  }, [carrierStore.loading]);

  useEffect(() => {
    const { error_response } = carrierStore;
    console.log('error_response :> ', error_response);
    if (error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: error_response.title || '',
        content: error_response.content || '',
      });
    }
  }, [carrierStore.error_response]);

  useEffect(() => {
    const allTrucksTypes = JSON.parse(JSON.stringify(carrierStore.trucks_types));
    console.log('allTrucksTypes :>>', allTrucksTypes);
    const array =
      allTrucksTypes &&
      allTrucksTypes.map((truck: any) => ({
        value: truck.id,
        label: truck.name,
      }));
    setTruckTypeOptions(array);
  }, [carrierStore.trucks_types]);

  const onSubmit = (data: any) => {
    console.log(data);
    console.log(checkbox);
    console.log(region);
    console.log(province);
    console.log(truckType);
    if (data && region && truckType && province) {
      carrierStore.postTruck({
        loadingWeight: data.loadingWeight,
        registrationNumber: [data.registrationNumber],
        stallHeight: stallHeight.value,
        tipper: checkbox,
        truckPhotos: UploadFileStore.truckPhotos,
        truckType: truckType.value,
        workingZones: [
          {
            province: province.value,
            region: region.value,
          },
        ],
      });
    }
  };

  const onChangeRegion = (value: any) => {
    setRegion(value);
    const Region = provinceOptions.filter((e) => e.area == value.value);
    setFilterProvince(Region);
  };

  const onChangeProvince = (value: any) => {
    setProvince(value);
    const Province = regionOptions.filter((e) => e.value == value.area);
    setFilterRegion(Province);
  };

  return (
    <Card>
      <Alert setting={alertSetting} />
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>เลือกประเภทของรถของคุณ</span>
          <Select
            options={truckTypeOptions}
            placeholder="Select multiple"
            fullWidth
            onChange={(value: any) => setTruckType(value)}
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
          <Select
            options={stallHeightOption}
            placeholder="Select multiple"
            fullWidth
            onChange={(value: any) => setStallHeight(value)}
          />
          <span>ระบุจำนวนน้ำหนัก (ตัน)</span>
          <Input fullWidth>
            <input name="loadingWeight" type="number" ref={register} />
          </Input>
          <hr />
          <span>ข้อมูลรถของคุณ</span>
          <br />
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
          <Select options={filterRegion} placeholder="ภูมิภาค" fullWidth onChange={(value) => onChangeRegion(value)} />
          <Select
            options={filterProvince}
            placeholder="จังหวัด"
            fullWidth
            onChange={(value) => onChangeProvince(value)}
          />
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
