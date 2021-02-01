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
import { navigate } from 'gatsby';
import { UploadFileStore } from '../../../stores/upload-file-store';
import { useTranslation } from 'react-i18next';
import '../../../Layouts/css/style.css';

interface Props {}

const AddTruck: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { carrierStore, loginStore, masterTypeStore } = useMst();
  const truckPhotos = JSON.parse(JSON.stringify(UploadFileStore.truckPhotos));
  const { register, handleSubmit, errors, control } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [checkbox, setCheckbox] = useState(false);
  const [stallHeights, setStallHeights] = useState([]);
  const [filterProvince, setFilterProvince] = useState([]);
  const [filterRegion, setFilterRegion] = useState([]);
  const [truckTypeOptions, setTruckTypeOptions] = useState();
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [toggle, setToggle] = useState(false);
  const [isSelectRegion, setIsSelectRegion] = useState(false);

  useEffect(() => {
    carrierStore.getAllTruckTypes();
    masterTypeStore.getAllRegion();
    const stalls: any = [
      { value: 'LOW', label: t('LOW') },
      { value: 'MEDIUM', label: t('MEDIUM') },
      { value: 'HIGH', label: t('HIGH') },
    ];
    setStallHeights(stalls);
  }, []);

  useEffect(() => {
    const stalls: any = [
      { value: 'LOW', label: t('LOW') },
      { value: 'MEDIUM', label: t('MEDIUM') },
      { value: 'HIGH', label: t('HIGH') },
    ];
    setStallHeights(stalls);
  }, [loginStore.language]);

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
    const { success_response } = carrierStore;
    if (success_response) navigate('/trucks');
  }, [carrierStore.success_response]);

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
    const trucks_types = JSON.parse(JSON.stringify(carrierStore.trucks_types));
    if (trucks_types?.length) {
      const array = trucks_types.map((truck: any) => ({
        value: truck.id,
        label: truck.name,
      }));
      setTruckTypeOptions(array);
    }
  }, [carrierStore.trucks_types, carrierStore.trucks_types?.length]);

  useEffect(() => {
    const regions = JSON.parse(JSON.stringify(masterTypeStore.regions));
    if (regions?.length) {
      const regionOptions = regions.map((region: any) => {
        return { value: region.id, label: region.name };
      });
      setFilterRegion(regionOptions);
    }
  }, [masterTypeStore.regions]);

  useEffect(() => {
    const provinces = JSON.parse(JSON.stringify(masterTypeStore.provinces));
    if (provinces?.length) {
      const provinceOptions = provinces.map((region: any) => {
        return { value: region.id, label: region.name };
      });
      setFilterProvince(provinceOptions);
    }
  }, [masterTypeStore.provinces, masterTypeStore.provinces?.length]);

  const onChangeRegion = (event: { value: number; label: string }) => {
    setIsSelectRegion(true);
    masterTypeStore.getAllProvince({
      regionId: event.value,
    });
  };

  const onSubmit = (data: any) => {
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

  return (
    <Card>
      <Alert setting={alertSetting} />
      <CardHeader>
        <span>{t('addDataCar')}</span>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="form-add-data">
          <p>
            {t('typeCar')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                options={truckTypeOptions}
                status={errors.truckType ? 'Danger' : 'Basic'}
                placeholder={t('pleaseselect')}
                fullWidth
              />
            }
            control={control}
            valueName="selected"
            rules={{ required: 'Truck type cannot be null.' }}
            name="truckType"
            ref={register({ required: true })}
            aria-invalid={errors.truckType ? 'true' : 'false'}
          />
          {errors.truckType && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldTruckType')}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>{t('tipper')}</p>
            <Switch
              checked={checkbox}
              onChange={() => setCheckbox(!checkbox)}
              color="primary"
              style={{ color: checkbox ? '#00B132' : '' }}
            />
          </div>
          <p>
            {t('stallHeight')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                options={stallHeights}
                status={errors.stallHeight ? 'Danger' : 'Basic'}
                placeholder={t('pleaseselect')}
                fullWidth
              />
            }
            id="stallHeight"
            control={control}
            valueName="selected"
            rules={{ required: 'Stall height cannot be null.' }}
            name="stallHeight"
            ref={register({ required: true })}
            aria-invalid={errors.stallHeight ? 'true' : 'false'}
          />
          {errors.stallHeight && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldStallHeight')}
            </span>
          )}
          <p>
            {t('amountWeight')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input
            className="new-input-component"
            name="loadingWeight"
            type="number"
            step="0.01"
            style={{
              borderColor: errors.loadingWeight ? '#ff3d71' : '',
            }}
            ref={register({ required: true, min: 0 })}
            aria-invalid={errors.loadingWeight ? 'true' : 'false'}
          />
          {errors.loadingWeight && errors.loadingWeight.type === 'required' && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldWeight')}
            </span>
          )}
          {errors.loadingWeight && errors.loadingWeight.type === 'min' && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('minWeight')}
            </span>
          )}
          <hr style={{ margin: '1.125rem 0 0' }} />
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', marginRight: 5 }}>ข้อมูลรถของคุณ: </p>
            <p>
              {t('registrationNumber')} <span style={{ color: '#ff3d71' }}>*</span>
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
              {t('fieldRegistrationNumber')}
            </span>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            {t('uploadCar')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <br />
          <ImageUpload submitted={toggle} />
          {toggle && (!truckPhotos.front || !truckPhotos.back || !truckPhotos.left || !truckPhotos.left) && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldUploadCar')}
            </span>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            {t('zoneWork')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={({ onChange, value }) => {
              return (
                <Select
                  status={errors.region ? 'Danger' : 'Basic'}
                  options={filterRegion}
                  placeholder={t('region')}
                  fullWidth
                  value={value}
                  onChange={(event: any) => {
                    onChangeRegion(event);
                    onChange(event);
                  }}
                />
              );
            }}
            control={control}
            valueName="selected"
            rules={{ required: 'Region cannot be null.' }}
            name="region"
            ref={register({ required: true })}
            aria-invalid={errors.region ? 'true' : 'false'}
          />
          {errors.region && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldRegion')}
              <br />
            </span>
          )}
          <br />
          <Controller
            as={({ onChange, value }) => {
              return (
                <Select
                  status={errors.province ? 'Danger' : 'Basic'}
                  options={filterProvince}
                  placeholder={t('province')}
                  fullWidth
                  value={value}
                  onChange={(event: any) => {
                    onChange(event);
                  }}
                  isDisabled={!isSelectRegion}
                />
              );
            }}
            control={control}
            valueName="selected"
            rules={{ required: 'Province cannot be null.' }}
            name="province"
            ref={register({ required: true })}
            aria-invalid={errors.province ? 'true' : 'false'}
          />

          {errors.province && (
            <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldProvince')}
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
              {t('back')}
            </Button>
            <Button
              status="Success"
              type="submit"
              shape="Rectangle"
              fullWidth
              style={{ backgroundColor: '#00B132', borderColor: '#00B132' }}
              onClick={() => setToggle(true)}
            >
              {t('confirm')}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
});
export default AddTruck;
