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
    <Value>{content}</Value>
  </div>
);

const InputNumber = ({ label, onChange }: any) => (
  <>
    <Label style={{ flex: 2 }}>{`${label} :`}</Label>
    <div style={{ flex: 1 }}>
      <Textfield placeholder="-" type="number" min="0" onChange={onChange} />
    </div>
  </>
);

interface MasterTypeProps {
  id: string;
  name: string;
}

interface ITruckTypeSelectedOptionProps {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface Props {}

const UpdateTripInfo: React.FC<Props> = observer((props: any) => {
  const { jobStore, truckStore, truckTypesStore, productTypesStore } = useMst();
  const { t } = useTranslation();
  const [truckTypes, setTruckTypes] = useState<MasterTypeProps | any>({});
  const [truckTypeSelectedOption, setTruckTypeSelectedOption] = useState<Array<ITruckTypeSelectedOptionProps>>([]);
  const [productTypes, setProductTypes] = useState<MasterTypeProps | any>({});
  const [selectedOption, setSelectedOption] = useState('none');

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => {}}>
      <BreadcrumbsItem onClick={() => navigate('/trips')} text={t('trip.management')} key="trips-management" />
      <BreadcrumbsItem text={'Update trip information'} key="job-info" />
    </Breadcrumbs>
  );

  useEffect(() => {
    return () => {
      jobStore.clearJobs();
      truckStore.clearTrucks();
    };
  }, []);

  useEffect(() => {
    // jobStore.getJobById({ jobId: '3K1N5WL0' });
  }, [props.tripId]);

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

  console.log('truckStore.loading :>> ', truckStore.loading);

  // const jobDetail = jobStore.currentJob ? JSON.parse(JSON.stringify(jobStore.currentJob)) : {};
  const jobDetail = {
    id: '3K1N5WL0',
    productTypeId: 8,
    productName: 'Tum Machine 1',
    truckType: '1',
    weight: 0,
    requiredTruckAmount: 0,
    publicAsCgl: false,
    from: {
      name: '1048 ถ. เพชรเกษม ตำบลสนามจันทร์ อำเภอเมืองนครปฐม นครปฐม 73000 ประเทศไทย',
      dateTime: '18-07-2021 15:30',
      contactName: 'tum',
      contactMobileNo: '0978884444',
      lat: '13.808213008243886',
      lng: '100.05329774692655',
    },
    to: [
      {
        name: '2 ซ. เพชรบุรี 47 แยก 10 แขวง บางกะปิ เขตห้วยขวาง กรุงเทพมหานคร 10310 ประเทศไทย',
        dateTime: '19-07-2021 14:30',
        contactName: 'art',
        contactMobileNo: '0989998888',
        lat: '13.748751027827597',
        lng: '100.58322547003627',
      },
    ],
    owner: {
      id: 678,
      fullName: 'Tum',
      companyName: 'Tum',
      email: '',
      mobileNo: '+66822451306',
      avatar: {
        object: '',
      },
      userId: 'GL5O0EZ6',
    },
    status: 'NEW',
    price: 900,
    priceType: 'PER_TRIP',
    tipper: false,
    trips: [
      {
        id: '15Z3XLPG',
        owner: {
          id: 680,
          email: null,
          avatar: {
            object:
              '07915b70bd545e137bfb0e06042fdee4fffc9479999449a785612fdf45b3e216195dc9d495ba475b9d35e26694839fae6ead73cdea33f88c40b1add477709985',
          },
          fullName: 'แอนดรูว์ ทรานสปอร์ต 22',
          mobileNo: '+66815722022',
          companyName: 'แอนดรูว์ ทรานสปอร์ต 22',
          userId: '4LN7YEKY',
        },
        price: 900,
        status: 'OPEN',
        tipper: false,
        weight: 1,
        truckId: 'EZQWEEZ1',
        bookingId: '',
        createdAt: '2021-09-21T16:08:51',
        priceType: null,
        truckType: 6,
        updatedAt: '2021-09-21T16:08:51',
        phoneNumber: '+66815722022',
        stallHeight: 'LOW',
        workingZones: [
          {
            region: 1,
            province: 3,
          },
          {
            region: 1,
            province: 6,
          },
          {
            region: 1,
            province: 5,
          },
        ],
        approveStatus: 'INACTIVE',
        registrationNumber: ['กข 1234'],
      },
      {
        id: '2NZO6K47',
        owner: {
          id: 680,
          email: null,
          avatar: {
            object:
              '07915b70bd545e137bfb0e06042fdee4fffc9479999449a785612fdf45b3e216195dc9d495ba475b9d35e26694839fae6ead73cdea33f88c40b1add477709985',
          },
          fullName: 'แอนดรูว์ ทรานสปอร์ต 22',
          mobileNo: '+66815722022',
          companyName: 'แอนดรูว์ ทรานสปอร์ต 22',
          userId: '4LN7YEKY',
        },
        price: 900,
        status: 'OPEN',
        tipper: false,
        weight: 1,
        truckId: 'MK7EDELQ',
        bookingId: '',
        createdAt: '2021-09-21T16:10:00',
        priceType: null,
        truckType: 1,
        updatedAt: '2021-09-21T16:10:00',
        phoneNumber: '+66815722022',
        stallHeight: 'LOW',
        workingZones: [
          {
            region: 1,
            province: 10,
          },
        ],
        approveStatus: 'INACTIVE',
        registrationNumber: ['112234'],
      },
      {
        id: 'G4ZWYKMP',
        owner: {
          id: 548,
          email: 'sorn84913@gmail.com',
          avatar: {
            object: null,
          },
          fullName: 'คุณศร  พัทลุง',
          mobileNo: '+66926910336',
          companyName: 'คุณศร  พัทลุง',
          userId: 'R3K047Z9',
        },
        price: 650,
        status: 'IN_PROGRESS',
        tipper: false,
        weight: 0.2,
        truckId: '2NZO9YK4',
        bookingId: '15Z3XLPG',
        createdAt: '2021-07-16T07:07:48',
        priceType: 'PER_TRIP',
        truckType: 2,
        updatedAt: '2021-07-22T19:15:26',
        phoneNumber: '+66926910336',
        stallHeight: 'LOW',
        workingZones: [],
        approveStatus: 'INACTIVE',
        registrationNumber: ['TEST-art6'],
      },
      {
        id: '23K16L0J',
        owner: {
          id: 684,
          email: 'test-sylvia-art-001@gmail.com',
          avatar: {
            object:
              'a7a9e3a1bfab45cdf65783b23326ddf68384faed15a00b718d7fffff5f1d6406a69c9281a5fef8aa8500ef7a08d02a6f0420f039fd6ecc1df6d3ff918bd84adb',
          },
          fullName: 'Sylvia Artzyy',
          mobileNo: '+66814592283',
          companyName: 'Sylvia Artzyy',
          userId: 'DLG498ZX',
        },
        price: 900,
        status: 'OPEN',
        tipper: false,
        weight: 1,
        truckId: '2NZO1YZ4',
        bookingId: '',
        createdAt: '2021-09-15T11:32:58',
        priceType: null,
        truckType: 5,
        updatedAt: '2021-09-29T02:27:06',
        phoneNumber: '+66814592283',
        stallHeight: 'LOW',
        workingZones: [],
        approveStatus: 'INACTIVE',
        registrationNumber: ['ฟก-5222', 'หจ-3344'],
      },
    ],
    quotations: [
      {
        id: '15Z3XLPG',
        fullName: 'คุณศร  พัทลุง',
        avatar: {
          object: null,
        },
        truck: {
          id: '2NZO9YK4',
          owner: {
            id: 548,
            email: 'sorn84913@gmail.com',
            avatar: {
              object: null,
            },
            fullName: 'คุณศร  พัทลุง',
            mobileNo: '+66926910336',
            companyName: 'คุณศร  พัทลุง',
            userId: 'R3K047Z9',
          },
          tipper: false,
          workingZones: [],
          createdAt: '16-07-2021 07:07',
          updatedAt: '22-07-2021 19:15',
          truckType: 2,
          stallHeight: 'LOW',
          truckPhotos: null,
          approveStatus: 'INACTIVE',
          loadingWeight: 1,
          registrationNumber: ['TEST-art6'],
          phoneNumber: '+66926910336',
        },
        bookingDatetime: '18-07-2021 15:30',
      },
    ],
  };

  const truckDetail = {
    id: '9KP9Q3ZR',
    approveStatus: 'INACTIVE',
    loadingWeight: 1,
    registrationNumber: ['GG-wp52'],
    stallHeight: 'LOW',
    tipper: false,
    truckType: 10,
    createdAt: '2021-09-23T08:13:46.000Z',
    updatedAt: '2021-09-29T00:23:33.000Z',
    quotationNumber: '0',
    workingZones: [
      {
        region: 2,
        province: 46,
      },
      {
        region: 2,
        province: 47,
      },
    ],
    owner: {
      id: 612,
      fullName: 'Art tist zysa',
      companyName: 'Art tist zysa',
      email: 'arttistzys@gmail.com',
      mobileNo: '+66929818252',
      avatar: {
        object:
          '8e4aca19957a4f63469e9145092ba38ddeeb7f1b8ceeebe7b690fa77aac6a89b49d5edaaca619a777c9b10c2a4729ea0e4aba210712c6c2e176ecb460509828a',
      },
      userId: 'DLG448ZX',
    },
  };

  const bankAccounts = [
    {
      label: 'บัญชี 1111111',
      value: '1',
    },
    {
      label: 'บัญชี 2222222',
      value: '2',
    },
  ];
  console.log('JSON.parse(JSON.stringify(jobStore.currentJob)) :>> ', JSON.parse(JSON.stringify(jobStore.currentJob)));
  console.log('jobDetail :>> ', jobDetail);

  return (
    <Page>
      <PageHeader breadcrumbs={breadcrumbs}>{'Update trip information'}</PageHeader>
      <ButtonGroup>
        <ButtonBack onClick={() => navigate('/trips')}>{t('back')}</ButtonBack>
        <ButtonConfrim>{t('confirm')}</ButtonConfrim>
      </ButtonGroup>

      <Grid layout="fluid" spacing="compact">
        <GridColumn medium={6}>
          <div style={LEFT_RIGHT_SPACING}>
            <div>
              <Box style={{ position: 'relative', overflow: 'hidden', marginTop: 5 }}>
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
                                onChange={(e: any) => console.log(e.currentTarget.value)}
                              />
                            </div>

                            <Detail
                              header={'จำนวนเงิน'}
                              content={
                                <>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    90
                                  </ValueSmall>
                                  <ValueSmall>(น้ำหนักลง) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    200
                                  </ValueSmall>
                                  <ValueSmall>(ราคาต่อตัน) =</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    18,000
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'ค่าธรรมเนียม'}
                              content={
                                <>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    18,000
                                  </ValueSmall>
                                  <ValueSmall>(จำนวนเงิน) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    1%
                                  </ValueSmall>
                                  <ValueSmall>{'='}</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    180
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'สุทธิ'}
                              content={
                                <>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    17,820
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />
                          </div>
                        </Box>

                        <Label>{'ข้อมูลการรับเงิน :'}</Label>
                        <Box style={PRICE_BOX}>
                          <div style={{ display: 'flex' }}>
                            <Detail header={'สถานะ'} content={'รับเงินแล้ว'} style={{ flex: 1 }} />
                            <Detail header={'วันที่วางบิล'} content={'12/10/21'} style={{ flex: 1 }} />
                            <Detail header={'วันที่รับเงิน'} content={'12/10/21'} style={{ flex: 1 }} />
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
              <Box style={{ position: 'relative', overflow: 'hidden', marginTop: 5 }}>
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
                          <Detail header={'พนักงานขับรถ'} content={truckDetail?.owner.fullName} />
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
                                onChange={(e: any) => console.log(e.currentTarget.value)}
                              />
                            </div>

                            <div style={INPUT_FORM}>
                              <InputNumber
                                label={'น้ำหนักลง'}
                                onChange={(e: any) => console.log(e.currentTarget.value)}
                              />
                            </div>

                            <div style={INPUT_FORM}>
                              <InputNumber
                                label={'ราคาต่อตัน'}
                                onChange={(e: any) => console.log(e.currentTarget.value)}
                              />
                            </div>

                            <Detail
                              header={'จำนวนเงิน'}
                              content={
                                <>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    90
                                  </ValueSmall>
                                  <ValueSmall>(น้ำหนักลง) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    200
                                  </ValueSmall>
                                  <ValueSmall>(ราคาต่อตัน) =</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    18,000
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'ค่าธรรมเนียม'}
                              content={
                                <>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    18,000
                                  </ValueSmall>
                                  <ValueSmall>(จำนวนเงิน) x</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    1%
                                  </ValueSmall>
                                  <ValueSmall>{'='}</ValueSmall>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    180
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />

                            <Detail
                              header={'สุทธิ'}
                              content={
                                <>
                                  <ValueSmall color={'#ffc107'} fontSize={16}>
                                    17,820
                                  </ValueSmall>
                                  <ValueSmall>บาท</ValueSmall>
                                </>
                              }
                              style={{ flex: '100%', display: 'flex', justifyContent: 'space-between' }}
                            />
                          </div>
                        </Box>

                        <Label>{'ข้อมูลการจ่ายเงิน :'}</Label>
                        <Box style={PRICE_BOX}>
                          <Col display={'flex'} flex={1} flexFlow={'row wrap'} style={{ paddingTop: 15 }}>
                            <div style={{ flex: '100%', display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                              <Label style={{ flex: 1 }}>{`${'เลขบัญชี'} :`}</Label>
                              <div style={{ flex: 2 }}>
                                <Select
                                  value={bankAccounts.filter((option: any) => {
                                    return option.value === selectedOption;
                                  })}
                                  options={bankAccounts}
                                  onChange={(e: any) => setSelectedOption(e.value)}
                                  placeholder={'ระบุบัญชี'}
                                  id={'truck-select-bank-account'}
                                />
                              </div>
                            </div>
                            <Detail header={'วันที่วางบิล'} content={'12/10/21'} style={{ flex: 1 }} />
                            <Detail header={'วันที่รับเงิน'} content={'12/10/21'} style={{ flex: 1 }} />
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
