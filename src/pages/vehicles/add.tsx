import React, { Fragment, useState } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';
import { navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../stores/root-store';
import styled from 'styled-components';

import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage, ValidMessage } from '@atlaskit/form';

import ImageUpload, { Image } from '../../components/truck/widgets/image-upload';
import TruckTypesSelector from '../../components/dropdowns/truckType.selector';
import { STALL_HEIGHT, TIPPER_DUMP } from '../../components/truck/stall-height';
import Select from '@atlaskit/select';
import MultiSelect from '@atlaskit/multi-select';
import { useForm, Controller } from 'react-hook-form';
import UserSelector from '../../components/jobs/add/user.selector';
import truckApi, { PostTruckParams, TruckRequestParams } from '../../services/truck-api';
import Swal from 'sweetalert2';
import { AxiosResponse } from 'axios';

interface SelectValue {
  labal: any;
  value: string;
}

interface SelectContent {
  content: string;
  value: string;
}

const AddTrucks = observer(() => {
  const { t } = useTranslation();
  const { loginStore, truckStore } = useMst();
  const [vehicleImages, setVehicleImages] = useState<Image>({ front: null, back: null, left: null, right: null });
  const [stalls, setStalls] = useState<SelectValue[]>([]);
  const [dumps, setDumps] = useState<SelectValue[]>([]);
  const [regisVehicles, setRegisVehicles] = useState<SelectContent[] | null>([]);
  const { register, handleSubmit, watch, errors, setValue, control, getValues } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      carrierId: null,
      truckTypes: null,
      stallHeight: null,
      tipper: null,
      registrationNumber: null,
    },
  });

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem onClick={() => navigate('/vehicles')} text={t('vehicle.management')} key="vehicle-management" />
      <BreadcrumbsItem text={t('vehicle.add')} key="vehicle-add" />
    </Breadcrumbs>
  );

  const isDisabled = false;

  const selectItems = [{ items: [] }];

  const onSubmit = (formState: any) => {
    const payload: PostTruckParams = {
      carrierId: formState.carrierId,
      truckTypes: formState.truckTypes,
      stallHeight: formState?.stallHeight?.value,
      tipper: formState?.tipper?.value,
      registrationNumber: formState?.registrationNumber?.map((e: any) => e.content),
      truckPhotos: vehicleImages,
    };
    const MODAL_TIMEOUT = 1000;

    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
        truckApi
          .addTruck(payload)
          .then((response) => {
            if (response && response.status < 300) {
              Swal.hideLoading();
              // response as AxiosResponse<TruckRequestParams>
              console.log('add truck response', response);
              const data = (response as any).data;
              console.log('add truck response', data);
              Swal.update({
                icon: 'success',
                titleText: '',
                text: t('createTruckSuccess'),
                showConfirmButton: false,
              });
              return setTimeout(() => {
                Swal.close();
                navigate('/vehicles');
              }, MODAL_TIMEOUT);
            } else {
              Swal.fire({
                icon: 'error',
                text: t('createTruckErrorByUser'),
              });
              console.error('create truck: truck error', response);
            }
          })
          .catch((error) => {
            console.error('Error while create this truck', error);
            Swal.fire({
              icon: 'error',
              text: 'Error while create this truck',
            });
          });
      },
    });
  };

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('vehicle.add')}</PageHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <GroupItem>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field label={t('carOwner')} name="carrierId" isRequired>
                {({ fieldProps }: any) => {
                  return (
                    <Fragment>
                      <Controller
                        control={control}
                        name="carrierId"
                        render={({ onChange, value }) => {
                          return (
                            <UserSelector
                              {...fieldProps}
                              maxWidth="100%"
                              value={value}
                              onSelect={onChange}
                              placeholder={t('carOwner')}
                              noResultsMessage={t('noData')}
                            />
                          );
                        }}
                        rules={{ required: true }}
                      />
                      {errors.carrierId && <ErrorMessage>{t('fieldCarOwner')}</ErrorMessage>}
                    </Fragment>
                  );
                }}
              </Field>
              <Field label={t('typeCar')} name="truckTypes" isRequired>
                {({ fieldProps, error, meta: { valid } }: any) => (
                  <Fragment>
                    <Controller
                      control={control}
                      name="truckTypes"
                      render={({ onChange, value }) => {
                        return (
                          <TruckTypesSelector
                            {...fieldProps}
                            maxWidth="100%"
                            value={value}
                            onSelect={(e: any) => {
                              onChange(e);

                              const stallOptions = STALL_HEIGHT(t, e);
                              setStalls(stallOptions);

                              const dumpOptions = TIPPER_DUMP(t, e);
                              setDumps(dumpOptions);
                            }}
                            placeholder={t('pleaseselect')}
                            language={loginStore.language}
                            isInvalid={!!errors.truckTypes}
                          />
                        );
                      }}
                      rules={{ required: true }}
                    />
                    {errors.truckTypes && <ErrorMessage>{t('fieldTypeCar')}</ErrorMessage>}
                  </Fragment>
                )}
              </Field>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Field label={t('stall')} name="stallHeight" defaultValue={stalls[0]}>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Controller
                          control={control}
                          name="stallHeight"
                          render={({ onChange, value }) => {
                            return (
                              <Select
                                inputId="vehicle-stall-height"
                                className="single-select"
                                classNamePrefix="react-select"
                                options={stalls}
                                placeholder={t('stall')}
                                {...fieldProps}
                                value={value}
                                onChange={onChange}
                                isDisabled={!stalls?.length || stalls?.length === 0}
                              />
                            );
                          }}
                        />
                      </Fragment>
                    )}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <Field label={t('sale')} name="tipper" defaultValue={dumps[0]}>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Controller
                          control={control}
                          name="tipper"
                          render={({ onChange, value }) => {
                            return (
                              <Select
                                inputId="vehicle-dump"
                                className="single-select"
                                classNamePrefix="react-select"
                                options={dumps}
                                placeholder={t('sale')}
                                {...fieldProps}
                                value={value}
                                onChange={onChange}
                                isDisabled={!dumps?.length || dumps?.length === 0}
                              />
                            );
                          }}
                        />
                      </Fragment>
                    )}
                  </Field>
                </div>
              </div>
              <Field label={t(`registrationNumber`)} name="registrationNumber" isRequired>
                {({ fieldProps }: any) => {
                  return (
                    <Fragment>
                      <Controller
                        control={control}
                        name="registrationNumber"
                        render={({ onChange, value }) => {
                          return (
                            <MultiSelect
                              items={selectItems}
                              placeholder={`${t('registrationNumber')}`}
                              value={value}
                              onNewItemCreated={(e: any) => {
                                const licenses = JSON.parse(JSON.stringify(regisVehicles)) || [];
                                licenses.push(e.item);
                                onChange(licenses);
                                setRegisVehicles(licenses);
                              }}
                              onSelectedChange={(e: any) => {
                                if (e.items?.length === 0) {
                                  onChange(null);
                                  setRegisVehicles(null);
                                } else {
                                  onChange(e.items);
                                  setRegisVehicles(e.items);
                                }
                              }}
                              shouldAllowCreateItem
                              shouldFitContainer
                              isInvalid={!!errors.registrationNumber}
                            />
                          );
                        }}
                        rules={{ required: true }}
                      />
                      {errors.registrationNumber ? (
                        <ErrorMessage>{t('fieldRegistrationNumber')}</ErrorMessage>
                      ) : (
                        <HelperMessage>{t('registrationsTrailers')}</HelperMessage>
                      )}
                    </Fragment>
                  );
                }}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Field label="" name="upload">
                {({ fieldProps }: any) => (
                  <Fragment>
                    <ImageUpload vehicleImages={vehicleImages} setVehicleImages={setVehicleImages} />
                  </Fragment>
                )}
              </Field>
            </div>
          </div>
        </GroupItem>
        <FormFooter>
          <Button type="button" style={BottomBackStyled} onClick={() => navigate('/vehicles')} testId="backButton">
            <BackText>{t('back')}</BackText>
          </Button>
          <Button
            type="submit"
            isDisabled={isDisabled}
            style={
              isDisabled
                ? {
                    ...BottomSubmitStyled,
                    backgroundColor: '#D8D8D8',
                    border: 'none',
                  }
                : BottomSubmitStyled
            }
            testId="submitButton"
          >
            <SubmitText>{t('confirm')}</SubmitText>
          </Button>
        </FormFooter>
      </form>
    </div>
  );
});

export default AddTrucks;

const BackText = styled.span`
  color: #fbbc12;
`;

const SubmitText = styled.span`
  color: #000;
`;

const BottomStyled = {
  margin: '0 6px',
};

const BottomBackStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: 'transparent',
};

const BottomSubmitStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: '#FBBC12',
};

const GroupItem = styled.div`
  display: flex;
  flex-direction: column;
`;
