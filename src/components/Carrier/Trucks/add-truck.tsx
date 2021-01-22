import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import Switch from '@material-ui/core/Switch';
import { useForm } from 'react-hook-form';
import { UploadFileStore } from '../../../stores/upload-file-store';
import ImageUpload from './image-upload';
import { useMst } from '../../../stores/root-store';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
import { regionOptions, stallHeightOption, provinceOptions } from './dynamic-table/sample-data';
import { navigate } from 'gatsby';
import '../../../Layouts/css/style.css';

interface Props {}

const AddTruck: React.FC<Props> = observer((props: any) => {
  const { carrierStore } = useMst();
  const { register, handleSubmit } = useForm();
  const [checkbox, setCheckbox] = useState(false);
  const [truckType, setTruckType] = useState({ value: 0, label: '' });
  const [region, setRegion] = useState({ value: 0, label: '' });
  const [province, setProvince] = useState({ value: 0, label: '' });
  const [stallHeight, setStallHeight] = useState({ value: '', label: '' });
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
    const array =
      allTrucksTypes &&
      allTrucksTypes.map((truck: any) => ({
        value: truck.id,
        label: truck.name,
      }));
    setTruckTypeOptions(array);
  }, [carrierStore.trucks_types]);

  const onSubmit = (data: any) => {
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

  const onChangeRegion = (event: { value: number; label: string }) => {
    setRegion(event);
    const Region = provinceOptions.filter((e) => e.area === event.value);
    setFilterProvince(Region);
  };

  const onChangeProvince = (event: { value: number; label: string; area: number }) => {
    setProvince(event);
    const Province = regionOptions.filter((e) => e.value === event.area);
    setFilterRegion(Province);
  };

  return (
    <Card>
      <Alert setting={alertSetting} />
      <CardHeader>
        <span>เพิ่มข้อมูลรถ</span>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="form-add-truck">
          <p>เลือกประเภทของรถของคุณ</p>
          <Select
            options={truckTypeOptions}
            placeholder="Select multiple"
            fullWidth
            onChange={(value: any) => setTruckType(value)}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>รถมีที่ดั้มหรือไม่</p>
            <Switch checked={checkbox} onChange={() => setCheckbox(!checkbox)} color="primary" />
          </div>
          <p>ความสูงของคอกรถ (หน่วยเป็นเมตร)</p>
          <Select
            options={stallHeightOption}
            placeholder="Select multiple"
            fullWidth
            onChange={(value: any) => setStallHeight(value)}
          />
          <p>ระบุจำนวนน้ำหนัก (ตัน)</p>
          <input className="new-input-component" name="loadingWeight" type="number" ref={register} />
          <hr style={{ margin: '1.125rem 0 0' }} />
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลรถของคุณ: </p>
            <p>เลขทะเบียนรถ</p>
          </div>
          <input className="new-input-component" name="registrationNumber" type="text" ref={register} />
          <hr style={{ margin: '1.125rem 0' }} />
          <p>อัพโหลดรูปภาพรถ</p>
          <br />
          <ImageUpload />
          <hr style={{ margin: '1.125rem 0' }} />
          <p>โซนที่วิ่งงาน</p>
          <Select
            options={filterRegion}
            placeholder="ภูมิภาค"
            fullWidth
            onChange={(event: any) => onChangeRegion(event)}
          />
          <br />
          <Select
            options={filterProvince}
            placeholder="จังหวัด"
            fullWidth
            onChange={(event: any) => onChangeProvince(event)}
          />
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <Button
              type="button"
              status="Warning"
              shape="SemiRound"
              fullWidth
              style={{ marginRight: 20, backgroundColor: '#FBBC12', borderColor: '#FBBC12' }}
              onClick={() => navigate('/trucks')}
            >
              กลับ
            </Button>
            <Button
              status="Success"
              type="submit"
              shape="SemiRound"
              fullWidth
              style={{ backgroundColor: '#3f51b5', borderColor: '#3f51b5' }}
            >
              ยืนยัน
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
});
export default AddTruck;
