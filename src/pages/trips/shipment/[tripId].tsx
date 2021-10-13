import React, { useState, useEffect, CSSProperties } from 'react';
import Textfield from '@atlaskit/textfield';
import { useMst } from '../../../stores/root-store';
import { observer } from 'mobx-react-lite';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { navigate } from 'gatsby';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Collapse from '../../../components/collapse/collapse';
import images from '../../../components/Themes/images';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import Select from 'react-select';
import { TripStore } from '../../../stores/trip-store';
import { DatePicker } from '@atlaskit/datetime-picker';

interface LocationProps {
  header: string;
  content: string;
  img: 'pinDrop' | 'pinDrop2';
}

const LEFT_RIGHT_SPACING: CSSProperties = {
  paddingLeft: 10,
  paddingRight: 10,
};

const PRICE_BOX: CSSProperties = {
  backgroundColor: '#fbfbfb',
  width: '100%',
  paddingLeft: 15,
  paddingRight: 15,
  marginBottom: 15,
};

const TRIANGLE_TOPLEFT: CSSProperties = {
  width: 120,
  height: 0,
  borderTop: '57px solid #ffc107',
  borderRight: '40px solid transparent',
  position: 'absolute',
  clear: 'both',
  top: 0,
  left: 0,
};

const INPUT_FORM: CSSProperties = {
  flex: '100%',
  display: 'flex',
  marginBottom: 20,
};

const Header = ({ text }: any) => (
  <>
    <div style={TRIANGLE_TOPLEFT}></div>
    <h4 style={{ ...LEFT_RIGHT_SPACING, margin: 0, position: 'relative', color: '#fff' }}>{text}</h4>
  </>
);

const Location = ({ content, header, img }: LocationProps) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <div style={{ flex: '5%', display: 'flex' }}>
      <img src={images[img]} style={{ width: 16, borderRadius: '50%', backgroundColor: '#ebeef3', padding: 2 }} />
    </div>
    <Value style={{ flex: '8%' }}>{`${header} :`}</Value>
    <Value style={{ flex: '87%' }}>{content}</Value>
  </div>
);

const Detail = ({ header, content, style = {} }: any) => (
  <div style={style}>
    <Label>{`${header} :`}</Label>
    {typeof content === 'string' ? <Value>{content}</Value> : content}
  </div>
);

const InputNumber = (args: any) => (
  <>
    <Label style={{ flex: 2 }}>{`${args.label ?? ''} :`}</Label>
    <div style={{ flex: 1 }}>
      <Textfield placeholder="-" type="number" min="0" {...args} />
    </div>
  </>
);

const currencyFormat = (val?: number): string => {
  if (!val) return '0';
  const parmcurrency = {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  };
  const formatter = Intl.NumberFormat('en-US', parmcurrency);
  return formatter.format(val).replace(parmcurrency.currency, '').trim();
};

interface MasterTypeProps {
  id: string;
  name: string;
}

interface ITruckTypeSelectedOptionProps {
  value: string;
  label: string;
  isDisabled?: boolean;
}

type SelectedShipperPaymentStatusOption = 'PAYMENT_DUE' | 'PAID' | 'VOID' | 'none' | undefined;

type SelectedCarrierPaymentStatusOption = 'PAID' | 'AWAITING' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'none' | undefined;

interface Props {}

const UpdateTripInfo: React.FC<Props> = observer((props: any) => {
  const { jobStore, truckStore, truckTypesStore, productTypesStore } = useMst();
  const { t } = useTranslation();
  const [jobDetail, setJobDetail] = useState<any>({});
  const [truckDetail, setTruckDetail] = useState<any>({});
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [truckTypes, setTruckTypes] = useState<MasterTypeProps | any>({});
  const [truckTypeSelectedOption, setTruckTypeSelectedOption] = useState<Array<ITruckTypeSelectedOptionProps>>([]);
  const [productTypes, setProductTypes] = useState<MasterTypeProps | any>({});
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>('none');
  const [selectedShipperPaymentStatus, setSelectedShipperPaymentStatus] = useState<SelectedShipperPaymentStatusOption>(
    'none',
  );
  const [selectedCarrierPaymentStatus, setSelectedCarrierPaymentStatus] = useState<SelectedCarrierPaymentStatusOption>(
    'none',
  );
  const [weightStart, setWeightStart] = useState<number>(0);
  const [weightEnd, setWeightEnd] = useState<number>(0);
  const [shipperPricePerTon, setShipperPricePerTon] = useState<number>(0);
  const [carrierPricePerTon, setCarrierPricePerTon] = useState<number>(0);
  const [shipperFeePercentage, setShipperFeePercentage] = useState<number>(1);
  const [carrierFeePercentage, setCarrierFeePercentage] = useState<number>(1);
  const [shipperBillStartDate, setShipperBillStartDate] = useState<string | undefined>();
  const [shipperPaymentRecieveDate, setShipperPaymentRecieveDate] = useState<string | undefined>();
  const [carrierPaymentDate, setCarrierPaymentDate] = useState<string | undefined>();

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => {}}>
      <BreadcrumbsItem onClick={() => navigate('/trips')} text={t('trip.management')} key="trips-management" />
      <BreadcrumbsItem text={'Update trip information'} key="job-info" />
    </Breadcrumbs>
  );

  console.log('weightStart :>> ', weightStart);

  useEffect(() => {
    return () => {
      jobStore.clearJobs();
      truckStore.clearTrucks();
    };
  }, []);

  useEffect(() => {
    // jobStore.getJobById({ jobId: '3K1N5WL0' });
    TripStore.getTripDetail(props.tripId);
  }, [props.tripId]);

  useEffect(() => {
    if (TripStore.tripDetail) {
      const tripDetail = JSON.parse(JSON.stringify(TripStore.tripDetail));
      setJobDetail(tripDetail.job);
      setTruckDetail(tripDetail.truck);
      const bankAccountData =
        tripDetail?.bankAccount?.map((acc: any) => ({
          value: acc.id,
          label: `${acc.accountNo} / ${acc.accountName} / ${acc.bankName}`,
        })) ?? [];
      setBankAccounts(bankAccountData);

      if (tripDetail.job?.payment) {
        tripDetail.job.payment?.pricePerTon && setShipperPricePerTon(+tripDetail.job.payment.pricePerTon);
        tripDetail.job.payment?.feePercentage && setShipperFeePercentage(+tripDetail.job.payment.feePercentage);
        tripDetail.job.payment?.paymentStatus && setSelectedShipperPaymentStatus(tripDetail.job.payment.paymentStatus);
        tripDetail.job.payment?.billStartDate && setShipperBillStartDate(tripDetail.job.payment.billStartDate);
        tripDetail.job.payment?.paymentDate && setShipperPaymentRecieveDate(tripDetail.job.payment.paymentDate);
      }

      if (tripDetail.truck?.payment) {
        tripDetail.truck.payment?.pricePerTon && setCarrierPricePerTon(+tripDetail.truck.payment.pricePerTon);
        tripDetail.truck.payment?.feePercentage && setCarrierFeePercentage(+tripDetail.truck.payment.feePercentage);
        tripDetail.truck.payment?.paymentStatus &&
          setSelectedCarrierPaymentStatus(tripDetail.truck.payment.paymentStatus);
        tripDetail.truck.payment?.paymentDate && setCarrierPaymentDate(tripDetail.truck.payment.paymentDate);
      }

      if (tripDetail?.weightStart) {
        setWeightStart(+tripDetail.weightStart);
      }

      if (tripDetail?.weightEnd) {
        setWeightEnd(+tripDetail.weightEnd);
      }
    }
  }, [JSON.stringify(TripStore.tripDetail)]);

  useEffect(() => {
    if (!truckTypesStore.data) {
      truckTypesStore.getTruckTypes();
    } else {
      const truckTypeData = JSON.parse(JSON.stringify(truckTypesStore.data));
      const truckTypeOptions = truckTypeData.map((truckType: any) => ({
        value: truckType.id.toString(),
        label: truckType.name,
      }));
      setTruckTypeSelectedOption(truckTypeOptions);

      const newTruckType = truckTypeData.reduce(
        (obj: any, item: any) => ({
          ...obj,
          [item['id']]: item.name,
        }),
        {},
      );
      setTruckTypes(newTruckType);
    }
  }, [truckTypesStore.data]);

  useEffect(() => {
    if (!productTypesStore.data) {
      productTypesStore.getProductTypes();
    } else {
      const newProductType = JSON.parse(JSON.stringify(productTypesStore.data)).reduce(
        (obj: any, item: any) => ({
          ...obj,
          [item['id']]: item.name,
        }),
        {},
      );
      setProductTypes(newProductType);
    }
  }, [productTypesStore.data]);

  const onCalculateShipperPrice = (e: any) => {
    const amount = +e.currentTarget.value;
    setShipperPricePerTon(amount);
    // const cal = (amount + weightEnd)
  };

  const onSubmiit = (): void => {
    const data = {
      shipperPricePerTon: +shipperPricePerTon,
      shipperPaymentStatus: selectedShipperPaymentStatus === 'none' ? undefined : selectedShipperPaymentStatus,
      shipperBillStartDate: shipperBillStartDate,
      shipperPaymentDate: shipperPaymentRecieveDate,
      weightStart: +weightStart,
      weightEnd: +weightEnd,
      carrierPricePerTon: +carrierPricePerTon,
      bankAccountId: selectedBankAccount === 'none' ? undefined : selectedBankAccount,
      carrierPaymentStatus: selectedCarrierPaymentStatus === 'none' ? undefined : selectedCarrierPaymentStatus,
      carrierPaymentDate: carrierPaymentDate,
    };
    console.log('data :>> ', data);
    TripStore.update(props.tripId, data);
    navigate('/trips');
  };

  const shipperPaymentOptions = [
    {
      value: 'PAYMENT_DUE',
      label: 'รอเก็บเงิน',
    },
    {
      value: 'PAID',
      label: 'เก็บเงินแล้ว',
    },
    {
      value: 'VOID',
      label: 'ยกเลิก',
    },
  ];

  const carrierPaymentOptions = [
    {
      value: 'AWAITING',
      label: 'รออนุมัติ',
    },
    {
      value: 'APPROVED',
      label: 'อนุมัติ',
    },
    {
      value: 'REJECTED',
      label: 'ไม่อนุมัติ',
    },
    {
      value: 'ISSUED',
      label: 'ดำเนินการแล้ว',
    },
    {
      value: 'PAID',
      label: 'ชำระเงินแล้ว',
    },
  ];

  console.log('truckStore.loading :>> ', truckStore.loading);

  if (TripStore.error_response) {
    return <h1>{TripStore.error_response.content}</h1>;
  }

  return (
    <Page>
      <PageHeader breadcrumbs={breadcrumbs}>{'Update trip information'}</PageHeader>
      <ButtonGroup>
        <ButtonBack onClick={() => navigate('/trips')}>{t('back')}</ButtonBack>
        <ButtonConfrim onClick={onSubmiit}>{t('confirm')}</ButtonConfrim>
      </ButtonGroup>

      <Grid layout="fluid" spacing="compact">
        <GridColumn medium={6}>
          <div style={LEFT_RIGHT_SPACING}>
            <div>
              <Box style={{ position: 'relative', marginTop: 5 }}>
                <Collapse
                  isExpanded
                  topic={<Header text={'รายละเอียดงาน'} />}
                  children={
                    <Row style={LEFT_RIGHT_SPACING}>
                      <Col display={'flex'} flex={1} flexFlow={'row wrap'} style={{ paddingTop: 15 }}>
                        <Col flex={'0 1 calc(33.33% - 8px)'}>
                          <Detail
                            header={'ประเภท'}
                            content={
                              productTypes[jobDetail?.productTypeId] ??
                              (productTypes?.length ? '-' : <Spinner size="medium" />)
                            }
                          />
                        </Col>
                        <Col flex={'0 1 calc(33.33% - 8px)'}>
                          <Detail header={'ชื่อสินค้า'} content={jobDetail?.productName} />
                        </Col>
                        <Col flex={'0 1 calc(33.33% - 8px)'}>
                          <Detail header={'วันที่'} content={jobDetail?.from?.dateTime} />
                        </Col>

                        <Col flex={'0 1 calc(33.33% - 8px)'}>
                          <Detail header={'ชื่อเจ้าของ'} content={jobDetail?.owner?.fullName} />
                        </Col>
                        <Col flex={'0 1 calc(33.33% - 8px)'}>
                          <Detail header={'เบอร์โทรเจ้าของ'} content={jobDetail?.owner?.mobileNo} />
                        </Col>

                        <div style={{ width: '100%', margin: '0 4px' }}>
                          <Label>{'สถานที่ :'}</Label>
                          <Location header={'จาก'} content={jobDetail?.from?.name} img={'pinDrop'} />
                          {jobDetail?.to?.map((data: any, index: number) => (
                            <Location key={`location-${index}`} content={data?.name} header={'ถึง'} img={'pinDrop2'} />
                          ))}
                        </div>

                        <Label>{'ข้อมูลสินค้า :'}</Label>
                        <Box style={PRICE_BOX}>
                          <div style={{ display: 'flex', flexFlow: 'row wrap', padding: 10 }}>
                            <div style={INPUT_FORM}>
                              <InputNumber
                                label={'ราคาต่อตัน'}
                                value={shipperPricePerTon || undefined}
                                onChange={onCalculateShipperPrice}
                              />
                            </div>

                            <Detail
                              header={'จำนวนเงิน'}
                              content={
                                <Value>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd)}
                                  </ValueSmall>
                                  <ValueSmall>(น้ำหนักลง) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(shipperPricePerTon)}
                                  </ValueSmall>
                                  <ValueSmall>(ราคาต่อตัน) =</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd * shipperPricePerTon)}
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </Value>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'ค่าธรรมเนียม'}
                              content={
                                <Value>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd * shipperPricePerTon)}
                                  </ValueSmall>
                                  <ValueSmall>(จำนวนเงิน) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {`${shipperFeePercentage}%`}
                                  </ValueSmall>
                                  <ValueSmall>{'='}</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd * shipperPricePerTon * (shipperFeePercentage / 100))}
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </Value>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'สุทธิ'}
                              content={
                                <Value>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(
                                      weightEnd * shipperPricePerTon -
                                        weightEnd * shipperPricePerTon * (shipperFeePercentage / 100),
                                    )}
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </Value>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />
                          </div>
                        </Box>

                        <Label>{'ข้อมูลการรับเงิน :'}</Label>
                        <Box style={{ ...PRICE_BOX, paddingBottom: 30 }}>
                          <div style={{ display: 'flex' }}>
                            <Col style={{ paddingRight: 10 }}>
                              <Detail
                                header={'สถานะ'}
                                content={
                                  <Select
                                    menuPlacement={'auto'}
                                    value={shipperPaymentOptions.filter((option: any) => {
                                      return option.value === selectedShipperPaymentStatus;
                                    })}
                                    options={shipperPaymentOptions}
                                    onChange={(e: any) => setSelectedShipperPaymentStatus(e.value)}
                                    placeholder={'-'}
                                    id={'job-select-payment-status'}
                                  />
                                }
                              />
                            </Col>
                            <Col style={{ padding: '0 10px' }}>
                              <Detail
                                header={'วันที่วางบิล'}
                                content={
                                  <DatePicker
                                    defaultValue={shipperBillStartDate || undefined}
                                    dateFormat="DD/MM/YYYY"
                                    onChange={(date) => setShipperBillStartDate(date)}
                                  />
                                }
                              />
                            </Col>
                            <Col style={{ paddingLeft: 10 }}>
                              <Detail
                                header={'วันที่รับเงิน'}
                                content={
                                  <DatePicker
                                    defaultValue={shipperPaymentRecieveDate || undefined}
                                    dateFormat="DD/MM/YYYY"
                                    onChange={(date) => setShipperPaymentRecieveDate(date)}
                                  />
                                }
                              />
                            </Col>
                          </div>
                        </Box>
                      </Col>
                    </Row>
                  }
                />
              </Box>
            </div>
          </div>
        </GridColumn>

        <GridColumn medium={6}>
          <div style={LEFT_RIGHT_SPACING}>
            <div>
              <Box style={{ position: 'relative', marginTop: 5 }}>
                <Collapse
                  isExpanded
                  topic={<Header text={'รายละเอียดรถ'} />}
                  children={
                    <Row style={LEFT_RIGHT_SPACING}>
                      <Col display={'flex'} flex={1} flexFlow={'row wrap'} style={{ paddingTop: 15 }}>
                        <Col flex={'100%'}>
                          <h3>{truckDetail.registrationNumber ? truckDetail.registrationNumber.join(' / ') : '-'}</h3>
                        </Col>
                        <Col flex={'0 1 calc(50% - 8px)'}>
                          <Detail header={'พนักงานขับรถ'} content={truckDetail?.owner?.fullName} />
                        </Col>
                        <Col flex={'0 1 calc(50% - 8px)'}>
                          <Detail header={'วันที่'} content={jobDetail?.from?.dateTime} />
                        </Col>

                        <Label>{'ข้อมูลสินค้า'}</Label>
                        <Box style={PRICE_BOX}>
                          <div style={{ display: 'flex', flexFlow: 'row wrap', padding: 10 }}>
                            <div style={INPUT_FORM}>
                              <InputNumber
                                label={'น้ำหนักขึ้น'}
                                value={weightStart || undefined}
                                onChange={(e: any) => setWeightStart(e.currentTarget.value)}
                              />
                            </div>

                            <div style={INPUT_FORM}>
                              <InputNumber
                                label={'น้ำหนักลง'}
                                value={weightEnd || undefined}
                                onChange={(e: any) => setWeightEnd(e.currentTarget.value)}
                              />
                            </div>

                            <div style={INPUT_FORM}>
                              <InputNumber
                                label={'ราคาต่อตัน'}
                                value={carrierPricePerTon || undefined}
                                onChange={(e: any) => setCarrierPricePerTon(e.currentTarget.value)}
                              />
                            </div>

                            <Detail
                              header={'จำนวนเงิน'}
                              content={
                                <Value>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd)}
                                  </ValueSmall>
                                  <ValueSmall>(น้ำหนักลง) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(carrierPricePerTon)}
                                  </ValueSmall>
                                  <ValueSmall>(ราคาต่อตัน) =</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd * carrierPricePerTon)}
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </Value>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'ค่าธรรมเนียม'}
                              content={
                                <Value>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd * carrierPricePerTon)}
                                  </ValueSmall>
                                  <ValueSmall>(จำนวนเงิน) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {`${carrierFeePercentage}%`}
                                  </ValueSmall>
                                  <ValueSmall>{'='}</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(weightEnd * carrierPricePerTon * (carrierFeePercentage / 100))}
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </Value>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'สุทธิ'}
                              content={
                                <Value>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    {currencyFormat(
                                      weightEnd * carrierPricePerTon -
                                        weightEnd * carrierPricePerTon * (carrierFeePercentage / 100),
                                    )}
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </Value>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />
                          </div>
                        </Box>

                        <Label>{'ข้อมูลการจ่ายเงิน :'}</Label>
                        <Box style={{ ...PRICE_BOX, paddingBottom: 30 }}>
                          <Col display={'flex'} flex={1} flexFlow={'row wrap'} style={{ paddingTop: 15 }}>
                            <div style={{ flex: '100%', display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                              <Label style={{ flex: 1 }}>{`${'เลขบัญชี'} :`}</Label>
                              <div style={{ flex: 2 }}>
                                <Select
                                  value={bankAccounts.filter((option: any) => {
                                    return option.value === selectedBankAccount;
                                  })}
                                  options={bankAccounts}
                                  onChange={(e: any) => setSelectedBankAccount(e.value)}
                                  placeholder={'ระบุบัญชี'}
                                  id={'truck-select-bank-account'}
                                />
                              </div>
                            </div>
                            <Col style={{ paddingRight: 10 }}>
                              <Detail
                                header={'สถานะการจ่าย'}
                                content={
                                  <Select
                                    menuPlacement={'auto'}
                                    value={carrierPaymentOptions.filter((option: any) => {
                                      return option.value === selectedCarrierPaymentStatus;
                                    })}
                                    options={carrierPaymentOptions}
                                    onChange={(e: any) => setSelectedCarrierPaymentStatus(e.value)}
                                    placeholder={'-'}
                                    id={'truck-select-payment-status'}
                                  />
                                }
                              />
                            </Col>
                            <Col style={{ paddingLeft: 10 }}>
                              <Detail
                                header={'วันที่'}
                                content={
                                  carrierPaymentDate ? (
                                    <DatePicker
                                      defaultValue={carrierPaymentDate}
                                      dateFormat="DD/MM/YYYY"
                                      onChange={(date) => setCarrierPaymentDate(date)}
                                    />
                                  ) : (
                                    <DatePicker
                                      defaultValue={undefined}
                                      dateFormat="DD/MM/YYYY"
                                      onChange={(date) => setCarrierPaymentDate(date)}
                                    />
                                  )
                                }
                              />
                            </Col>
                          </Col>
                        </Box>
                      </Col>
                    </Row>
                  }
                />
              </Box>
            </div>
          </div>
        </GridColumn>
      </Grid>
    </Page>
  );
});

export default UpdateTripInfo;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Col = styled.div<{ flex?: number | string; display?: 'flex'; flexFlow?: string }>`
  flex: ${(props: any) => props?.flex ?? 1};
  display: ${(props) => props?.display ?? 'block'};
  flex-flow: ${(props) => props?.flexFlow ?? 'nowrap'};
  margin: 0 4px;
`;

const Box = styled.div`
  padding: 10px;
  border: 1px solid #cfcfcf;
  border-radius: 5px;
  margin-top: 15px;
`;

const Label = styled.p`
  color: #999;
  font-size: 13px;
  margin: 10px 0 10px 0;
`;

const Value = styled.p`
  font-size: 16px;
  margin: 10px 0 10px 0;
`;

const ValueSmall = styled.span<{ color?: string; fontSize?: number }>`
  font-size: ${({ fontSize }) => fontSize ?? 13}px;
  padding: 0 4px;
  color: ${({ color }) => color ?? '#999'};
`;

const ButtonGroup = styled.div`
  position: absolute;
  right: 15px;
  top: 50px;
`;

const ButtonBack = styled(Button)`
  border: 1px solid #ffc107 !important;
  color: #ffc107 !important;
  background-color: transparent !important;
  width: 100px !important;

  &:hover {
    color: white !important;
    background: #ffc107 !important;
  }
`;

const ButtonConfrim = styled(Button)`
  border: 1px solid #ffc107 !important;
  color: #000 !important;
  background-color: #ffc107 !important;
  width: 100px !important;
  margin-left: 15px !important;

  &:hover {
    color: #ffc107 !important;
    background: #fff !important;
  }
`;

const ButtonLoadMore = styled(Button)`
  border: 1px solid #cccccc !important;
  color: #000 !important;
  background-color: #cccccc !important;
  align-items: center;
`;

const NewText = styled.span`
  font-size: 10px;
  padding: 0 10px;
  background-color: #ffc107;
  border-radius: 3px;
  color: #fff;
`;
