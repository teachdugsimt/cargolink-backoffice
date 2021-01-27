import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import Switch from '@material-ui/core/Switch';
import { useForm, Controller } from 'react-hook-form';
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
  const { register, handleSubmit, errors, control } = useForm();
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
    console.log('data:>>', data);
    if (data && data.region.value && data.truckType.value && data.province.value) {
      carrierStore.postTruck({
        loadingWeight: data.loadingWeight,
        registrationNumber: [data.registrationNumber],
        stallHeight: data.stallHeight.value,
        tipper: checkbox,
        truckPhotos: UploadFileStore.truckPhotos,
        truckType: data.truckType.value,
        workingZones: [
          {
            province: data.province.value,
            region: data.region.value,
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
        <form onSubmit={handleSubmit(onSubmit)} className="form-add-data">
          <p>
            เลือกประเภทของรถของคุณ <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                options={truckTypeOptions}
                status={errors.truckType ? 'Danger' : 'Basic'}
                placeholder="Select multiple"
                fullWidth
                onChange={(value: any) => setTruckType(value)}
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>รถมีที่ดั้มหรือไม่</p>
            <Switch
              checked={checkbox}
              onChange={() => setCheckbox(!checkbox)}
              color="primary"
              style={{ color: checkbox ? '#00B132' : '' }}
            />
          </div>
          <p>
            ความสูงของคอกรถ (หน่วยเป็นเมตร) <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                options={stallHeightOption}
                status={errors.stallHeight ? 'Danger' : 'Basic'}
                placeholder="Select multiple"
                fullWidth
                onChange={(value: any) => setStallHeight(value)}
              />
            }
            control={control}
            valueName="selected"
            rules={{ required: 'Department cannot be null.' }}
            name="stallHeight"
            ref={register({ required: true })}
            aria-invalid={errors.stallHeight ? 'true' : 'false'}
          />
          {errors.stallHeight && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <p>
            ระบุจำนวนน้ำหนัก (ตัน) <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input
            className="new-input-component"
            name="loadingWeight"
            type="number"
            style={{
              borderColor: errors.loadingWeight ? '#ff3d71' : '',
            }}
            ref={register({ required: true })}
            aria-invalid={errors.loadingWeight ? 'true' : 'false'}
          />
          {errors.loadingWeight && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <hr style={{ margin: '1.125rem 0 0' }} />
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลรถของคุณ: </p>
            <p>
              เลขทะเบียนรถ <span style={{ color: '#ff3d71' }}>*</span>
            </p>
          </div>
          <input
            className="new-input-component"
            name="registrationNumber"
            type="text"
            style={{
              borderColor: errors.registrationNumber ? '#ff3d71' : '',
            }}
            ref={register({ required: true })}
            aria-invalid={errors.registrationNumber ? 'true' : 'false'}
          />
          {errors.registrationNumber && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            อัพโหลดรูปภาพรถ <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <br />
          <ImageUpload />
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            โซนที่วิ่งงาน <span style={{ color: '#ff3d71' }}>*</span>
          </p>

          <Controller
            as={
              <Select
                status={errors.stallHeight ? 'Danger' : 'Basic'}
                options={filterRegion}
                placeholder="ภูมิภาค"
                fullWidth
                onChange={(event: any) => onChangeRegion(event)}
              />
            }
            control={control}
            valueName="selected"
            rules={{ required: 'Department cannot be null.' }}
            name="region"
            ref={register({ required: true })}
            aria-invalid={errors.region ? 'true' : 'false'}
          />
          {errors.region && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <br />
          <Controller
            as={
              <Select
                status={errors.province ? 'Danger' : 'Basic'}
                options={filterProvince}
                placeholder="จังหวัด"
                fullWidth
                onChange={(event: any) => onChangeProvince(event)}
              />
            }
            control={control}
            valueName="selected"
            rules={{ required: 'Department cannot be null.' }}
            name="province"
            ref={register({ required: true })}
            aria-invalid={errors.province ? 'true' : 'false'}
          />

          {errors.province && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }} role="alert">
              This field is required
            </span>
          )}
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <Button
              type="button"
              status="Warning"
              shape="Rectangle"
              fullWidth
              onClick={() => navigate('/trucks')}
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
export default AddTruck;
