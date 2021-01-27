import { Button } from '@paljs/ui/Button';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import Switch from '@material-ui/core/Switch';
import { useForm, Controller } from 'react-hook-form';
import ImageUpload from './image-upload';
import { useMst } from '../../../stores/root-store';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
import { regionOptions, stallHeightOption, provinceOptions } from './dynamic-table/sample-data';
import { navigate } from 'gatsby';
import '../../../Layouts/css/style.css';
import { UploadFileStore } from '../../../stores/upload-file-store';

const provinces = provinceOptions.sort((a, b) => {
  if (a.label < b.label) return -1;
  if (a.label > b.label) return 1;
  return 0;
});

interface Props {}

const AddTruck: React.FC<Props> = observer((props) => {
  const { carrierStore } = useMst();
  const truckPhotos = JSON.parse(JSON.stringify(UploadFileStore.truckPhotos));
  const { register, handleSubmit, errors, control } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [checkbox, setCheckbox] = useState(false);
  const [filterProvince, setFilterProvince] = useState(provinces);
  const [filterRegion, setFilterRegion] = useState(regionOptions);
  const [truckTypeOptions, setTruckTypeOptions] = useState();
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [toggle, setToggle] = useState(false);

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
    const { region, truckType, province } = data;
    if (
      data &&
      region.value &&
      truckType.value &&
      province.value &&
      truckPhotos.front &&
      truckPhotos.back &&
      truckPhotos.left &&
      truckPhotos.left
    ) {
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
    const provincesFillterByRegion = provinces.filter((e) => e.area === event.value);
    console.log('onChangeRegion :> ', provincesFillterByRegion);
    setFilterProvince(provincesFillterByRegion);
  };

  const onChangeProvince = (event: { value: number; label: string; area: number }) => {
    const regionsFillterByProvince = regionOptions.filter((e) => e.value === event.area);
    setFilterRegion(regionsFillterByProvince);
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
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
            ref={register({ required: true, min: 0 })}
            aria-invalid={errors.loadingWeight ? 'true' : 'false'}
          />
          {errors.loadingWeight && errors.loadingWeight.type === 'required' && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              This field is required
            </span>
          )}
          {errors.loadingWeight && errors.loadingWeight.type === 'min' && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              ต้องมีค่ามากกว่าหรือเท่ากับ 0
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              This field is required
            </span>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            อัพโหลดรูปภาพรถ <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <br />
          <ImageUpload submitted={toggle} />
          {toggle && (!truckPhotos.front || !truckPhotos.back || !truckPhotos.left || !truckPhotos.left) && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              This field is required
            </span>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            โซนที่วิ่งงาน <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                status={errors.region ? 'Danger' : 'Basic'}
                options={filterRegion}
                placeholder="ภูมิภาค"
                fullWidth
              />
            }
            onChange={(event: any) => onChangeRegion(event)}
            control={control}
            valueName="selected"
            rules={{ required: 'Department cannot be null.' }}
            name="region"
            ref={register({ required: true })}
            aria-invalid={errors.region ? 'true' : 'false'}
          />
          {errors.region && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              This field is required
              <br />
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
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
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
              onClick={() => setToggle(true)}
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
