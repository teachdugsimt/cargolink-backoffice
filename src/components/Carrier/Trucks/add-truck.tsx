import { Button } from '@paljs/ui/Button';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import Switch from '@material-ui/core/Switch';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import ImageUpload from './image-upload';
import { useMst } from '../../../stores/root-store';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
import { navigate } from 'gatsby';
import { UploadFileStore } from '../../../stores/upload-file-store';
import { useTranslation } from 'react-i18next';
import { EvaIcon } from '@paljs/ui/Icon';
import '../../../Layouts/css/style.css';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';

interface Props {}

const userOptions: any = [
  { value: 'LOW', label: 'dsdsa' },
  { value: 'MEDIUM', label: 'dsad' },
  { value: 'HIGH', label: 'dsad' },
];

const AddTruck: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { carrierStore, loginStore, masterTypeStore } = useMst();
  const truckPhotos = JSON.parse(JSON.stringify(UploadFileStore.truckPhotos));
  const { register, handleSubmit, errors, control } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      user: null,
      stallHeight: null,
      loadingWeight: null,
      registrationNumber: null,
      region: null,
      province: null,
      truckType: null,
      items: [{ registrationNumber: null }],
      zones: [{ region: null, province: null }],
    },
  });
  const [checkbox, setCheckbox] = useState(false);
  const [stallHeights, setStallHeights] = useState([]);
  const [filterProvince, setFilterProvince] = useState([]);
  const [filterRegion, setFilterRegion] = useState([]);
  const [truckTypeOptions, setTruckTypeOptions] = useState();
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [toggle, setToggle] = useState(false);
  const [isSelectRegion, setIsSelectRegion] = useState(false);
  const [valueTruck, setValueTruck] = useState(0);

  useEffect(() => {
    carrierStore.getAllTruckTypes();
    masterTypeStore.getAllRegion();
    if (valueTruck == 49 || valueTruck == 3) {
      const stalls: any = [
        { value: 'LOW', label: t('LOW') },
        { value: 'HIGH', label: t('HIGH') },
      ];
      setStallHeights(stalls);
    } else if (valueTruck == 26 || valueTruck == 42) {
      const stalls: any = [{ value: 'MEDIUM', label: t('MEDIUM') }];
      setStallHeights(stalls);
    } else {
      const stalls: any = [
        { value: 'LOW', label: t('LOW') },
        { value: 'MEDIUM', label: t('MEDIUM') },
        { value: 'HIGH', label: t('HIGH') },
      ];
      setStallHeights(stalls);
    }
  }, []);

  useEffect(() => {
    if (valueTruck == 49 || valueTruck == 3) {
      const stalls: any = [
        { value: 'LOW', label: t('LOW') },
        { value: 'HIGH', label: t('HIGH') },
      ];
      setStallHeights(stalls);
    } else if (valueTruck == 26 || valueTruck == 42) {
      const stalls: any = [{ value: 'MEDIUM', label: t('MEDIUM') }];
      setStallHeights(stalls);
    } else {
      const stalls: any = [
        { value: 'LOW', label: t('LOW') },
        { value: 'MEDIUM', label: t('MEDIUM') },
        { value: 'HIGH', label: t('HIGH') },
      ];
      setStallHeights(stalls);
    }
  }, [loginStore.language, valueTruck]);

  useEffect(() => {
    const { loading } = carrierStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: t('LOADING'),
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
    const { error_response } = masterTypeStore;
    if (error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: error_response.title || '',
        content: error_response.content || '',
      });
    }
  }, [masterTypeStore.error_response]);

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

  const onChangeTruckType = (event: { value: number; label: string }) => {
    setValueTruck(event.value);
  };

  const { fields: fieldsRegis, append: appendRegis, remove: removeRegis } = useFieldArray({
    control,
    name: 'items',
  });

  const { fields: fieldZone, append: appendZone, remove: removeZone } = useFieldArray({
    control,
    name: 'zones',
  });

  const onSubmit = (data: any) => {
    const { region, truckType, stallHeight, loadingWeight } = data;
    // console.log("data:>>", data.zones.map((e: any, i: any) => {
    //   return {
    //     province: e.province?.value,
    //     region: e.region.value,

    //   };
    // }))
    // console.log("registrationNumber:>>", [data.items.map((e: any, i: any) => {
    //   return e.registrationNumber
    // })])
    if (
      region.value &&
      truckType.value &&
      truckPhotos.front &&
      truckPhotos.back &&
      truckPhotos.left &&
      truckPhotos.left
    ) {
      carrierStore.postTruck({
        loadingWeight: loadingWeight,
        registrationNumber: [
          data.items.map((e: any, i: any) => {
            return e.registrationNumber;
          }),
        ],
        stallHeight: stallHeight && stallHeight.value ? stallHeight.value : '',
        tipper: checkbox,
        truckPhotos: UploadFileStore.truckPhotos,
        truckType: truckType.value,
        workingZones: data.zones.map((e: any, i: any) => {
          return {
            province: e.province?.value,
            region: e.region.value,
          };
        }),
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
            {t('user')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={
              <Select
                options={userOptions}
                status={errors.user ? 'Danger' : 'Basic'}
                placeholder={t('pleaseselect')}
                fullWidth
              />
            }
            id="user"
            control={control}
            valueName="selected"
            rules={{ required: 'Truck type cannot be null.' }}
            name="user"
            ref={register({ required: true })}
            aria-invalid={errors.user ? 'true' : 'false'}
          />
          {errors.user && (
            <span id="user" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('user')}
            </span>
          )}
          <p>
            {t('typeCar')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <Controller
            as={({ onChange, value }) => {
              return (
                <Select
                  options={truckTypeOptions}
                  status={errors.truckType ? 'Danger' : 'Basic'}
                  placeholder={t('pleaseselect')}
                  fullWidth
                  value={value}
                  onChange={(event: any) => {
                    onChange(event);
                    onChangeTruckType(event);
                  }}
                />
              );
            }}
            id="truckType"
            control={control}
            valueName="selected"
            rules={{ required: 'Truck type cannot be null.' }}
            name="truckType"
            ref={register({ required: true })}
            aria-invalid={errors.truckType ? 'true' : 'false'}
          />
          {errors.truckType && (
            <span id="fieldTruckType" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldTruckType')}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>{t('tipper')}</p>
            <Switch
              id="tipper"
              checked={checkbox}
              onChange={() => setCheckbox(!checkbox)}
              disabled={valueTruck == 26 || valueTruck == 42 || valueTruck == 36 ? false : true}
              color="primary"
              style={{ color: checkbox ? '#00B132' : '' }}
            />
          </div>
          <p>{t('stallHeight')}</p>
          <Controller
            as={
              <Select
                options={stallHeights}
                status={errors.stallHeight ? 'Danger' : 'Basic'}
                placeholder={t('pleaseselect')}
                fullWidth
                isDisabled={
                  valueTruck == 49 || valueTruck == 3 || valueTruck == 26 || valueTruck == 42 || valueTruck == 36
                    ? false
                    : true
                }
              />
            }
            id="stallHeight"
            control={control}
            valueName="selected"
            // rules={{ required: 'Stall height cannot be null.' }}
            name="stallHeight"
            // ref={register({ required: false })}
            aria-invalid={errors.stallHeight ? 'true' : 'false'}
          />
          {/* {errors.stallHeight && (
            <span
              id="fieldStallHeight"
              style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }}
              role="alert"
            >
              {t('fieldStallHeight')}
            </span>
          )} */}
          <p>
            {t('amountWeight')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <input
            id="loadingWeight"
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
            <span id="fieldWeight" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldWeight')}
            </span>
          )}
          {errors.loadingWeight && errors.loadingWeight.type === 'min' && (
            <span id="minWeight" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {fieldsRegis.map(({ id }, index) => {
              return (
                <div key={id}>
                  {index >= 1 ? <br /> : <></>}
                  <input
                    id="registrationNumber"
                    className="new-input-component"
                    name={`items[${index}].registrationNumber`}
                    type="text"
                    style={{
                      borderColor: errors.registrationNumber ? '#ff3d71' : '',
                    }}
                    ref={register({ required: true })}
                    aria-invalid={errors.registrationNumber ? 'true' : 'false'}
                  />
                  {errors.items && errors.items[index]?.registrationNumber && (
                    <span
                      id="fieldRegistrationNumber"
                      style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }}
                      role="alert"
                    >
                      {t('fieldRegistrationNumber')}
                      <br />
                    </span>
                  )}
                  {index == 0 ? (
                    <></>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.125rem' }}>
                      <Button
                        type="button"
                        size="Small"
                        shape="SemiRound"
                        style={{ backgroundColor: '#e03616', borderColor: '#e03616' }}
                        onClick={() => removeRegis(index)}
                      >
                        <EvaIcon name="minus-outline" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {fieldsRegis.length >= 2 ? (
            <></>
          ) : (
            // <Col offset={{ xs: 11 }} breakPoint={{ xs: 1 }}>
            <Button
              type="button"
              size="Small"
              shape="SemiRound"
              style={{ backgroundColor: '#253858', borderColor: '#253858', marginTop: '1.125rem' }}
              onClick={() => appendRegis({})}
            >
              <EvaIcon name="plus-outline" />
            </Button>
            // </Col>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            {t('uploadCar')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          <br />
          <ImageUpload submitted={toggle} />
          {toggle && (!truckPhotos.front || !truckPhotos.back || !truckPhotos.left || !truckPhotos.left) && (
            <span id="fieldUploadCar" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldUploadCar')}
            </span>
          )}
          <hr style={{ margin: '1.125rem 0' }} />
          <p>
            {t('zoneWork')} <span style={{ color: '#ff3d71' }}>*</span>
          </p>
          {fieldZone.map(({ id }, index) => {
            return (
              <div key={id}>
                {index >= 1 ? <br /> : <></>}
                <Row>
                  <Col breakPoint={{ xs: true }}>
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
                      id="region"
                      control={control}
                      valueName="selected"
                      rules={{ required: 'Region cannot be null.' }}
                      name={`zones[${index}].region`}
                      ref={register({ required: true })}
                      aria-invalid={errors.region ? 'true' : 'false'}
                    />
                    {errors.region && (
                      <span
                        id="fieldRegion"
                        style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }}
                        role="alert"
                      >
                        {t('fieldRegion')}
                        <br />
                      </span>
                    )}
                  </Col>
                  <Col breakPoint={{ xs: true }}>
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
                      id="province"
                      control={control}
                      valueName="selected"
                      // rules={{ required: 'Province cannot be null.' }}
                      name={`zones[${index}].province`}
                      // ref={register({ required: true })}
                      // aria-invalid={errors.province ? 'true' : 'false'}
                    />
                  </Col>
                  {index == 0 ? (
                    <></>
                  ) : (
                    <Button
                      type="button"
                      size="Small"
                      shape="SemiRound"
                      style={{ backgroundColor: '#e03616', borderColor: '#e03616' }}
                      onClick={() => removeZone(index)}
                    >
                      <EvaIcon name="minus-outline" />
                    </Button>
                  )}
                </Row>
                {index == 0 ? (
                  <></>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.125rem' }}>
                    {/*  <Row>
                           <Col offset={{ xs: 11.25 }} style={{ marginTop: '1.125rem' }}> */}
                    <Button
                      type="button"
                      size="Small"
                      shape="SemiRound"
                      style={{ backgroundColor: '#253858', borderColor: '#253858' }}
                      onClick={() => appendZone({})}
                    >
                      <EvaIcon name="plus-outline" />
                    </Button>
                    {/*    </Col>
                     </Row> */}
                  </div>
                )}
              </div>
            );
          })}
          {fieldZone.length >= 2 ? (
            <></>
          ) : (
            // <Col offset={{ xs: 11 }} breakPoint={{ xs: 1 }}>
            <Button
              type="button"
              size="Small"
              shape="SemiRound"
              style={{ backgroundColor: '#253858', borderColor: '#253858', marginTop: '1.125rem' }}
              onClick={() => appendZone({})}
            >
              <EvaIcon name="plus-outline" />
            </Button>
            // </Col>
          )}
          {/* {errors.province && (
            <span id="fieldProvince" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
              {t('fieldProvince')}
            </span>
          )} */}
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <Button
              id="back"
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
              id="confirm"
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
