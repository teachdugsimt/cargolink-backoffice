import React, { useState, useEffect, Fragment, CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { navigate } from 'gatsby';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage } from '@atlaskit/form';
import Button from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import PageHeader from '@atlaskit/page-header';
import styled from 'styled-components';
import PriceTypeToggle, { PriceTypeEnum } from './price-type-toggle';
import UserSelector from './user.selector';
import ProductTypesSelector from '../productType.selector';
import TruckTypesSelector from '../../dropdowns/truckType.selector';
import PickUpPoint from './pick-up-point';
import RouteWidget from '../../route/widgets/route';
import Select from '@atlaskit/select';
import { STALL_HEIGHT, TIPPER_DUMP } from '../../truck/stall-height';
import { useForm, Controller } from 'react-hook-form';
import jobApi, { PostJobParams, CreateJobResponse } from '../../../services/job-api';
import Swal from 'sweetalert2';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { findProvince } from '../../../utils';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { AsyncPaginate } from 'react-select-async-paginate';
import { TransportationStore } from '../../../stores/transportation-store';

const SEARCH_ICON: CSSProperties = {
  position: 'absolute',
  left: 9,
  top: 7,
  color: '#cfcfcf',
  zIndex: 99,
};

interface JobItemProps {
  value: string;
  label: string;
}

interface MasterTypeProps {
  id: string;
  name: string;
}
interface SelectValue {
  labal: any;
  value: string;
}

const AddJobContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore, versatileStore } = useMst();
  const [dumps, setDumps] = useState<SelectValue[]>([]);
  const [pickup, setPickup] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, watch, errors, setValue, control, getValues } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      userId: null,
      productTypeId: null,
      productName: null,
      weight: null,
      truckType: null,
      tipper: null,
      truckAmount: null,
      price: null,
      priceType: 'PER_TRIP',
    },
  });

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/jobs')} text={t('jobsManagement')} key="jobs-management" />
      <BreadcrumbsItem text={t('addNewJob')} key="job-info" />
    </Breadcrumbs>
  );

  const isDisabled = false;

  const onSubmit = (formState: any) => {
    setIsSubmitted(true);
    if (pickup?.from && pickup?.to && pickup?.to[0]) {
      const { from, to } = pickup;

      const payload: PostJobParams = {
        truckType: formState?.truckType,
        truckAmount: formState?.truckAmount ? parseInt(formState.truckAmount) : null,
        productTypeId: formState?.productTypeId,
        productName: formState?.productName,
        weight: formState?.weight ? parseInt(formState.weight) : null,
        price: formState?.price ? parseInt(formState.price) : null,
        tipper: formState?.tipper?.value,
        priceType: formState?.priceType,
        expiredTime: moment(from.dateTime).subtract(1, 'days').format('DD-MM-YYYY HH:mm:ss'),
        publicAsCgl: true, // เป็นเจ้าของงานจริง หรือเป็น cargolink
        from: {
          name: from?.name,
          dateTime: moment(from.dateTime).format('DD-MM-YYYY HH:mm:ss'),
          contactName: from?.contactName,
          contactMobileNo: from?.contactMobileNo,
          lat: from?.location?.lat,
          lng: from?.location?.lng,
        },
        to: to.map((e: any) => {
          return {
            name: e?.name,
            dateTime: moment(e.dateTime).format('DD-MM-YYYY HH:mm:ss'),
            contactName: e?.contactName,
            contactMobileNo: e?.contactMobileNo,
            lat: e?.location?.lat,
            lng: e?.location?.lng,
          };
        }),
        platform: 0, // 0 = website, 1 = mobile
        userId: formState?.userId,
        ...(jobDetail ? { family: { parent: jobDetail.id, child: null } } : undefined)
      };

      const MODAL_TIMEOUT = 1000;

      Swal.fire({
        didOpen: () => {
          Swal.showLoading();
          jobApi
            .createJob(payload)
            .then((response) => {
              if (response && response.status < 300) {
                Swal.hideLoading();
                const data = (response as AxiosResponse<CreateJobResponse>).data;
                console.log('add job response', data);

                Swal.update({
                  icon: 'success',
                  titleText: '',
                  text: t('createJobSuccess'),
                  showConfirmButton: false,
                });
                return setTimeout(() => {
                  // Swal.close();
                  navigate('/jobs');
                }, MODAL_TIMEOUT);
              } else {
                Swal.fire({
                  icon: 'error',
                  text: t('createJobErrorByUser'),
                });
                console.error('create job: job error', response);
              }
            })
            .catch((error) => {
              console.error('Error while create this job', error);
              Swal.fire({
                icon: 'error',
                text: 'Error while create this job',
              });
            });
        },
      });
    }
  };
  const [searchJob, setSearchJob] = useState<any>('');
  const [jobs, setJobs] = useState<Array<JobItemProps>>([]);
  const [jobDetail, setJobDetail] = useState<any>(null);
  const [productTypes, setProductTypes] = useState<MasterTypeProps | any>({});
  const filterJob = async (inputValue: string): Promise<any> => {
    if (inputValue.length < 3) {
      return [];
    }

    console.log('Requesting ...');
    // await jobStore.getJobsListWithoutEmptyContent({ page: 1, descending: true, textSearch: inputValue });
    await TransportationStore.searchJob({
      page: 1,
      descending: true,
      searchText: inputValue,
    });
    if (TransportationStore.search_list?.length) {
      const items = JSON.parse(JSON.stringify(TransportationStore.search_list)).map((job: any) => ({
        label: `${job.productName} | ${productTypes[job.productTypeId]} | ${job.from.name}, ${job.from.contactName}, ${job.from.contactMobileNo
          }`,
        value: job.id,
      }));
      setJobs(items);
      return Promise.resolve(items);
    }
    return Promise.resolve([]);
  };
  const loadOptions = async (inputValue: string, loadedOptions: any): Promise<any> => {
    const response = await filterJob(inputValue);

    return {
      options: response,
      hasMore: false,
      // additional: {
      //   page: page + 1,
      // },
      cacheUniqs: true,
    };
  };
  const wrappedLoadOptions = (...args: any): Promise<any> =>
    new Promise((resolve) => loadOptions(...args).then((value) => resolve(value)));
  const onSelected = (val: any) => {
    setSearchJob(val);
    const jobDetail = JSON.parse(JSON.stringify(TransportationStore.search_list)).find((job: any) => job.id === val.value);
    setJobDetail(jobDetail);
  };

  useEffect(() => {
    if (!versatileStore.list || !versatileStore.listDropdown) versatileStore.find()
  }, [])

  console.log("Job detail on select :: ", jobDetail)

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('addNewJob')}</PageHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <GroupItem>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}>
              <Field label={"เป็นงานย่อยของ"} name="parentJobId">
                {({ fieldProps }: any) => {

                  return (<div style={{ position: 'relative' }}>
                    <span style={SEARCH_ICON}>
                      <SearchIcon label={'search-icon'} size={'medium'} />
                    </span>
                    <AsyncPaginate
                      id={'main-async-select-job'}
                      cacheOptions
                      defaultOptions
                      debounceTimeout={500}
                      value={searchJob}
                      placeholder={'Search job'}
                      loadOptions={wrappedLoadOptions}
                      noOptionsMessage={() => 'No results'}
                      onChange={onSelected}
                    />
                  </div>)

                }}
              </Field>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field label={t('jobOwner')} name="userId" isRequired>
                {({ fieldProps }: any) => {
                  return (
                    <Fragment>
                      <Controller
                        control={control}
                        name="userId"
                        render={({ onChange, value }) => {
                          return (
                            <UserSelector
                              {...fieldProps}
                              maxWidth="100%"
                              value={value}
                              onSelect={onChange}
                              placeholder={t('jobOwner')}
                              noResultsMessage={t('noData')}
                            />
                          );
                        }}
                        rules={{ required: true }}
                      />
                      {errors.userId && <ErrorMessage>{t('field่JobOwner')}</ErrorMessage>}
                    </Fragment>
                  );
                }}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Field label={t('productType')} name="productTypeId" isRequired>
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Controller
                      control={control}
                      name="productTypeId"
                      render={({ onChange, value }) => {
                        return (
                          <ProductTypesSelector
                            {...fieldProps}
                            maxWidth="100%"
                            value={value}
                            onSelect={onChange}
                            placeholder={t('productType')}
                            language={loginStore.language}
                          />
                        );
                      }}
                      rules={{ required: true }}
                    />
                    {errors.productTypeId && <ErrorMessage>{t('fieldproductType')}</ErrorMessage>}
                  </Fragment>
                )}
              </Field>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field label={t('productName')} name="productName" isRequired>
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Textfield
                      name="productName"
                      ref={register({ required: true })}
                      isInvalid={!!errors.productName}
                      placeholder={t('productName')}
                    />
                    {errors.productName && <ErrorMessage>{t('fieldproductName')}</ErrorMessage>}
                  </Fragment>
                )}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Field label={t(`amountWeightWithoutTon`)} name="weight">
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Textfield
                      name="weight"
                      ref={register({ required: false })}
                      type="number"
                      placeholder={t('amountWeightWithoutTon')}
                      elemAfterInput={<ElemInput>ตัน</ElemInput>}
                    />
                  </Fragment>
                )}
              </Field>
            </div>
          </div>

          <br />
          <Header>{t('desiredVehicle')}</Header>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field label={t('typeCar')} name="truckType" isRequired>
                {({ fieldProps }: any) => {
                  return (
                    <Fragment>
                      <Controller
                        control={control}
                        name="truckType"
                        render={({ onChange, value }) => {
                          return (
                            <TruckTypesSelector
                              {...fieldProps}
                              maxWidth="100%"
                              value={value}
                              onSelect={(e: any) => {
                                onChange(e);
                                const dumpOptions = TIPPER_DUMP(t, e);
                                setDumps(dumpOptions);
                              }}
                              placeholder={t('typeCar')}
                              language={loginStore.language}
                              noResultsMessage={t('noData')}
                            />
                          );
                        }}
                        rules={{ required: true }}
                      />
                      {errors.truckType && <ErrorMessage>{t('fieldTypeCar')}</ErrorMessage>}
                    </Fragment>
                  );
                }}
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field label={t('amount')} name="truckAmount">
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Textfield
                      type="number"
                      name="truckAmount"
                      ref={register({ required: false })}
                      placeholder={t('amount')}
                      elemAfterInput={<ElemInput>คัน</ElemInput>}
                    />
                  </Fragment>
                )}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}></div>
          </div>

          <br />
          <Header>{t('pickUpPoint')}</Header>
          {isSubmitted && (!pickup?.from || !pickup?.to || !pickup?.to[0]) && (
            <ErrorMessage>{t('fieldPickUpPoint')}</ErrorMessage>
          )}
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <PickUpPoint pickup={pickup} setPickup={setPickup} />

              <br />
              <Header>ระยะทาง xxxx กิโลเมตร</Header>
              <Header>ราคาที่แนะนำ xxxx บาท</Header>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 'auto', marginRight: 10 }}>
                  <Field label={t('freightRate')} name="price" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield
                          type="number"
                          name="price"
                          isInvalid={!!errors.price}
                          ref={register({ required: true })}
                          placeholder={t('freightRate')}
                        />
                        {errors.price && <ErrorMessage>{t('fieldFreightRate')}</ErrorMessage>}
                      </Fragment>
                    )}
                  </Field>
                </div>
                <div style={{ marginLeft: 10, display: 'flex', alignItems: 'flex-end' }}>
                  <Field label="" name="priceType" isRequired>
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Controller
                          control={control}
                          name="priceType"
                          render={({ onChange, value }) => {
                            return <PriceTypeToggle {...fieldProps} priceType={value} onChange={onChange} />;
                          }}
                        />
                      </Fragment>
                    )}
                  </Field>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <RouteWidget
                from={pickup?.from}
                to={pickup?.to}
                setTo={(to: any) => setPickup({ ...pickup, to })}
                status="NEW"
              />
            </div>
          </div>
        </GroupItem>
        <FormFooter>
          <Button type="button" style={BottomBackStyled} onClick={() => navigate('/jobs')} testId="backButton">
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

export default AddJobContainer;

const ElemInput = styled.div`
  padding: 8px 6px;
`;

const Header = styled.h3`
  font-style: inherit;
  color: #172b4d;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 32px;
  margin-top: 0;
  outline: none;
  margin-bottom: 0px;
`;

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
