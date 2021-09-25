import React, { useState, useEffect, CSSProperties } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Form, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { useMst } from '../../stores/root-store';
import { observer } from 'mobx-react-lite';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { navigate } from 'gatsby';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import styled from 'styled-components';
import Collapse from '../../components/collapse/collapse';
import images from '../../components/Themes/images';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { DatePicker } from '@atlaskit/datetime-picker';
import Button from '@atlaskit/button';

interface LocationProps {
  header: string;
  content: string;
  img: 'pinDrop' | 'pinDrop2';
}

const LEFT_RIGHT_SPACING: CSSProperties = {
  paddingLeft: 10,
  paddingRight: 10,
};

const VEHICLE_DETAIL_BOX: CSSProperties = {
  backgroundColor: '#fbfbfb',
  width: '100%',
  paddingLeft: 15,
  paddingRight: 15,
};

const VEHICLE_BACKGROUND_IMGAE: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: '-25%',
  opacity: 0.4,
  display: 'flex',
  alignItems: 'baseline',
};

const reorder = (list: [], startIndex: number, endIndex: number): object => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source: any, destination: any, droppableSource: any, droppableDestination: any): {} => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  let result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any): CSSProperties => ({
  userSelect: 'none',
  padding: '10px 15px',
  margin: `0 0 15px 0`,
  borderRadius: 5,
  position: 'relative',
  overflow: 'hidden',
  background: isDragging ? 'lightgreen' : '#fff',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
  background: isDraggingOver ? 'lightblue' : '#ebeef3',
  padding: 15,
  margin: '3px',
  flex: 1,
  borderRadius: 5,
});

const Location = ({ content, header, img }: LocationProps) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <div style={{ flex: '5%' }}>
      <img src={images[img]} style={{ width: 16, borderRadius: '50%', backgroundColor: '#ebeef3', padding: 2 }} />
    </div>
    <Value style={{ flex: '10%' }}>{`${header} :`}</Value>
    <Value style={{ flex: '85%' }}>{content}</Value>
  </div>
);

const Detail = ({ header, content, style = {} }: any) => (
  <div style={style}>
    <Label>{`${header} :`}</Label>
    <Value>{content}</Value>
  </div>
);

interface State {
  jobs: object;
  trucks: object;
}

interface JobItemProps {
  value: string;
  label: string;
}

interface Props {}

const AddTrip: React.FC<Props> = observer(() => {
  const { jobStore, truckTypesStore, productTypesStore } = useMst();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({
    jobs: [],
    // trucks: getItems(5, 10)
    trucks: [
      {
        id: '9KP9Q3ZR',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['GG-wp52'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 10,
        createdAt: '2021-09-23T08:13:46.000Z',
        updatedAt: '2021-09-23T08:13:46.000Z',
        quotationNumber: '0',
        workingZones: [
          {
            region: 2,
            province: 47,
          },
          {
            region: 2,
            province: 46,
          },
        ],
        owner: {
          id: 612,
          fullName: 'Art tist zys',
          companyName: 'Art tist zys',
          email: 'Weaver_kenzellll@gmail.com',
          mobileNo: '+66929818252',
          avatar: {
            object:
              '8e4aca19957a4f63469e9145092ba38ddeeb7f1b8ceeebe7b690fa77aac6a89b49d5edaaca619a777c9b10c2a4729ea0e4aba210712c6c2e176ecb460509828a',
          },
          userId: 'DLG448ZX',
        },
      },
      {
        id: 'DZXGPWLO',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['GG-wp53'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 4,
        createdAt: '2021-09-23T08:06:18.000Z',
        updatedAt: '2021-09-23T08:11:45.000Z',
        quotationNumber: '0',
        workingZones: [
          {
            region: 2,
            province: 39,
          },
          {
            region: 2,
            province: 42,
          },
          {
            region: 2,
            province: 43,
          },
          {
            region: 2,
            province: 40,
          },
          {
            region: 2,
            province: 41,
          },
        ],
        owner: {
          id: 612,
          fullName: 'Art tist zys',
          companyName: 'Art tist zys',
          email: 'Weaver_kenzellll@gmail.com',
          mobileNo: '+66929818252',
          avatar: {
            object:
              '8e4aca19957a4f63469e9145092ba38ddeeb7f1b8ceeebe7b690fa77aac6a89b49d5edaaca619a777c9b10c2a4729ea0e4aba210712c6c2e176ecb460509828a',
          },
          userId: 'DLG448ZX',
        },
      },
      {
        id: '4LN7OYKY',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['GG-wp56'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 4,
        createdAt: '2021-09-22T15:13:34.000Z',
        updatedAt: '2021-09-22T15:13:34.000Z',
        quotationNumber: '0',
        workingZones: [
          {
            region: 2,
            province: 40,
          },
          {
            region: 2,
            province: 39,
          },
        ],
        owner: {
          id: 612,
          fullName: 'Art tist zys',
          companyName: 'Art tist zys',
          email: 'Weaver_kenzellll@gmail.com',
          mobileNo: '+66929818252',
          avatar: {
            object:
              '8e4aca19957a4f63469e9145092ba38ddeeb7f1b8ceeebe7b690fa77aac6a89b49d5edaaca619a777c9b10c2a4729ea0e4aba210712c6c2e176ecb460509828a',
          },
          userId: 'DLG448ZX',
        },
      },
      {
        id: 'XKJVY7K8',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['GG-wp55'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 4,
        createdAt: '2021-09-22T12:44:06.000Z',
        updatedAt: '2021-09-22T12:44:06.000Z',
        quotationNumber: '0',
        workingZones: [
          {
            region: 2,
            province: 40,
          },
          {
            region: 2,
            province: 39,
          },
        ],
        owner: {
          id: 612,
          fullName: 'Art tist zys',
          companyName: 'Art tist zys',
          email: 'Weaver_kenzellll@gmail.com',
          mobileNo: '+66929818252',
          avatar: {
            object:
              '8e4aca19957a4f63469e9145092ba38ddeeb7f1b8ceeebe7b690fa77aac6a89b49d5edaaca619a777c9b10c2a4729ea0e4aba210712c6c2e176ecb460509828a',
          },
          userId: 'DLG448ZX',
        },
      },
      {
        id: 'GL5OVMZ6',
        approveStatus: 'INACTIVE',
        loadingWeight: 0,
        registrationNumber: ['CE-9844', 'CB-0988'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 0,
        createdAt: '2021-09-21T16:15:15.000Z',
        updatedAt: '2021-09-21T16:15:15.000Z',
        quotationNumber: '0',
        workingZones: [],
        owner: {
          id: 684,
          fullName: 'Sylvia Art',
          companyName: 'Sylvia Art',
          email: null,
          mobileNo: '+66814592282',
          avatar: {
            object:
              'a7a9e3a1bfab45cdf65783b23326ddf68384faed15a00b718d7fffff5f1d6406a69c9281a5fef8aa8500ef7a08d02a6f0420f039fd6ecc1df6d3ff918bd84adb',
          },
          userId: 'DLG498ZX',
        },
      },
      {
        id: 'MK7EDELQ',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['112234'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 1,
        createdAt: '2021-09-21T16:10:00.000Z',
        updatedAt: '2021-09-21T16:10:00.000Z',
        quotationNumber: '0',
        workingZones: [
          {
            region: 1,
            province: 10,
          },
        ],
        owner: {
          id: 680,
          fullName: 'แอนดรูว์ ทรานสปอร์ต 22',
          companyName: 'แอนดรูว์ ทรานสปอร์ต 22',
          email: null,
          mobileNo: '+66815722022',
          avatar: {
            object:
              '07915b70bd545e137bfb0e06042fdee4fffc9479999449a785612fdf45b3e216195dc9d495ba475b9d35e26694839fae6ead73cdea33f88c40b1add477709985',
          },
          userId: '4LN7YEKY',
        },
      },
      {
        id: 'EZQWEEZ1',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['กข 1234'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 6,
        createdAt: '2021-09-21T16:08:51.000Z',
        updatedAt: '2021-09-21T16:08:51.000Z',
        quotationNumber: '0',
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
        owner: {
          id: 680,
          fullName: 'แอนดรูว์ ทรานสปอร์ต 22',
          companyName: 'แอนดรูว์ ทรานสปอร์ต 22',
          email: null,
          mobileNo: '+66815722022',
          avatar: {
            object:
              '07915b70bd545e137bfb0e06042fdee4fffc9479999449a785612fdf45b3e216195dc9d495ba475b9d35e26694839fae6ead73cdea33f88c40b1add477709985',
          },
          userId: '4LN7YEKY',
        },
      },
      {
        id: 'QVKE00KE',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['TT-0001', 'TT-0002'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 4,
        createdAt: '2021-09-21T11:50:49.000Z',
        updatedAt: '2021-09-21T11:51:15.000Z',
        quotationNumber: '0',
        workingZones: [
          {
            region: 2,
            province: 43,
          },
          {
            region: 2,
            province: 44,
          },
        ],
        owner: {
          id: 612,
          fullName: 'Art tist zys',
          companyName: 'Art tist zys',
          email: 'Weaver_kenzellll@gmail.com',
          mobileNo: '+66929818252',
          avatar: {
            object:
              '8e4aca19957a4f63469e9145092ba38ddeeb7f1b8ceeebe7b690fa77aac6a89b49d5edaaca619a777c9b10c2a4729ea0e4aba210712c6c2e176ecb460509828a',
          },
          userId: 'DLG448ZX',
        },
      },
      {
        id: 'WEL929ZP',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['FE-0099'],
        stallHeight: 'LOW',
        tipper: true,
        truckType: 4,
        createdAt: '2021-09-20T18:33:45.000Z',
        updatedAt: '2021-09-20T18:42:38.000Z',
        quotationNumber: '0',
        workingZones: [],
        owner: {
          id: 612,
          fullName: 'Art tist zys',
          companyName: 'Art tist zys',
          email: 'Weaver_kenzellll@gmail.com',
          mobileNo: '+66929818252',
          avatar: {
            object:
              '8e4aca19957a4f63469e9145092ba38ddeeb7f1b8ceeebe7b690fa77aac6a89b49d5edaaca619a777c9b10c2a4729ea0e4aba210712c6c2e176ecb460509828a',
          },
          userId: 'DLG448ZX',
        },
      },
      {
        id: '2NZO1YZ4',
        approveStatus: 'INACTIVE',
        loadingWeight: 1,
        registrationNumber: ['ฟก-5222'],
        stallHeight: 'LOW',
        tipper: false,
        truckType: 5,
        createdAt: '2021-09-15T11:32:58.000Z',
        updatedAt: '2021-09-17T13:28:01.000Z',
        quotationNumber: '0',
        workingZones: [
          {
            region: 7,
            province: 7,
          },
          {
            region: 1,
            province: 9,
          },
          {
            region: 2,
            province: 39,
          },
        ],
        owner: {
          id: 684,
          fullName: 'Sylvia Art',
          companyName: 'Sylvia Art',
          email: null,
          mobileNo: '+66814592282',
          avatar: {
            object:
              'a7a9e3a1bfab45cdf65783b23326ddf68384faed15a00b718d7fffff5f1d6406a69c9281a5fef8aa8500ef7a08d02a6f0420f039fd6ecc1df6d3ff918bd84adb',
          },
          userId: 'DLG498ZX',
        },
      },
    ],
  });
  const [jobs, setJobs] = useState<Array<JobItemProps>>([]);
  const [jobDetail, setJobDetail] = useState<any>(null);
  const [truckTypes, setTruckTypes] = useState<Array<any>>([]);
  const [productTypes, setProductTypes] = useState<Array<any>>([]);
  const [searchJob, setSearchJob] = useState<any>('');
  const [searchTruck, setSearchTruck] = useState<any>('');

  useEffect(() => {
    return () => {
      jobStore.clearJobs();
    };
  }, []);

  useEffect(() => {
    if (!truckTypesStore.data) {
      truckTypesStore.getTruckTypes();
    } else {
      setTruckTypes(JSON.parse(JSON.stringify(truckTypesStore.data)));
    }
  }, [truckTypesStore.data]);

  useEffect(() => {
    if (!productTypesStore.data) {
      productTypesStore.getProductTypes();
    } else {
      setProductTypes(JSON.parse(JSON.stringify(productTypesStore.data)));
    }
  }, [productTypesStore.data]);

  useEffect(() => {
    console.log('jobStore.data_jobs?.content?.length :>> ', jobStore.data_jobs?.content?.length);
    if (jobStore.data_jobs?.content?.length) {
      const items = JSON.parse(JSON.stringify(jobStore.data_jobs?.content)).map((job: any) => ({
        label: `${job.productName} | ${job.from.name}, ${job.from.contactName}, ${job.from.contactMobileNo}`,
        value: job.id,
      }));
      setJobs(items);
    }
  }, [JSON.stringify(jobStore.data_jobs)]);

  useEffect(() => {
    let delayDebounceFn: any;
    if (searchJob.length >= 3) {
      delayDebounceFn = setTimeout(() => {
        console.log('Requesting ...');
        jobStore.getJobsList({ page: 1, descending: true, textSearch: searchJob });
      }, 200);
    } else {
      clearTimeout(delayDebounceFn);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [searchJob]);

  const droppableIds: any = {
    droppable1: 'jobs',
    droppable2: 'trucks',
  };

  console.log('jobs :>> ', jobs);

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => {}}>
      <BreadcrumbsItem onClick={() => navigate('/trips')} text={t('trip.management')} key="trips-management" />
      <BreadcrumbsItem text={'Bulk cargo management'} key="bulk-cargo-management" />
    </Breadcrumbs>
  );

  const Header = ({ text }: any) => <h4 style={{ ...LEFT_RIGHT_SPACING, margin: 0 }}>{text}</h4>;

  const getList = (id: string): any => state[droppableIds[id]];

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items: object = reorder(getList(source.droppableId), source.index, destination.index);

      let copiedState: any = Object.assign({}, state);

      if (source.droppableId === 'droppable1') {
        copiedState.jobs = items;
      } else if (source.droppableId === 'droppable2') {
        copiedState.trucks = items;
      }

      setState(copiedState);
    } else {
      const result: any = move(getList(source.droppableId), getList(destination.droppableId), source, destination);

      setState({
        jobs: result.droppable1 ? result.droppable1 : state.jobs,
        trucks: result.droppable2 ? result.droppable2 : state.trucks,
      });
    }
  };

  const onChangeValueJob = (value: string) => setSearchJob(value);

  const onChangeValueTruck = (e: any) => {
    const value = e.target.value;
    setSearchTruck(value);
  };

  const onSubmitJob = () => {
    jobStore.getJobsList({ page: 1, descending: true, textSearch: searchJob });
  };

  const onSubmitTruck = () => {
    console.log('Submit truck');
  };

  const onSelected = (val: any) => {
    const jobDetail = JSON.parse(JSON.stringify(jobStore.data_jobs?.content)).find((job: any) => job.id === val.value);
    setJobDetail(jobDetail);
  };

  const jobDroppable = {
    droppableId: 'droppable1',
    listId: 'jobs',
    title: 'Search jobs',
    // droppable: false,
    onChange: onChangeValueJob,
    onSubmit: onSubmitJob,
  };

  const truckDroppable = {
    droppableId: 'droppable2',
    listId: 'trucks',
    title: 'Search trucks',
    // droppable: true,
    onChange: onChangeValueTruck,
    onSubmit: onSubmitTruck,
  };

  return (
    <Page>
      <PageHeader breadcrumbs={breadcrumbs}>{'Bulk cargo management'}</PageHeader>
      <ButtonGroup>
        <ButtonBack onClick={() => navigate('/trips')}>{t('back')}</ButtonBack>
        <ButtonConfrim>{t('confirm')}</ButtonConfrim>
      </ButtonGroup>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid layout="fluid" spacing="compact">
          <GridColumn medium={7}>
            <div style={LEFT_RIGHT_SPACING}>
              {/* <Select
              hasAutocomplete
              items={jobs}
              placeholder={'Search job'}
              noMatchesFound={'No match ...'}
              shouldFitContainer
              onFilterChange={onChangeValueJob}
              onSelected={() => console.log('onSelected')}
            /> */}

              <div>
                <Select options={jobs} onChange={onSelected} onInputChange={onChangeValueJob} />
              </div>

              {jobDetail && (
                <div>
                  <Box>
                    <Collapse
                      isExpanded
                      topic={<Header text={'งานที่เลือก'} />}
                      children={
                        <Row style={LEFT_RIGHT_SPACING}>
                          <Col display={'flex'} flex={1} flexWrap={'wrap'}>
                            <Col flex={1}>
                              <Detail
                                header={'ประเภท'}
                                content={
                                  productTypes?.find((prod: any) => prod.id === jobDetail.productTypeId)?.name ?? '-'
                                }
                              />
                            </Col>
                            <Col flex={1}>
                              <Detail header={'วันที่'} content={jobDetail.from.dateTime} />
                            </Col>
                            <Col flex={1}>
                              <Detail header={'ผู้ติดต่อ'} content={jobDetail.owner?.fullName} />
                            </Col>
                            <Col flex={1}>
                              <Detail header={'เบอร์โทร'} content={jobDetail.owner?.mobileNo} />
                            </Col>

                            <div style={{ width: '100%' }}>
                              <Label>{'สถานที่ :'}</Label>
                              <Location header={'จาก'} content={jobDetail.from?.name} img={'pinDrop'} />
                              {jobDetail.to?.map((data: any, index: number) => (
                                <Location
                                  key={`location-${index}`}
                                  content={data?.name}
                                  header={'ถึง'}
                                  img={'pinDrop2'}
                                />
                              ))}
                            </div>

                            <Box style={VEHICLE_DETAIL_BOX}>
                              <div style={{ display: 'flex' }}>
                                <Detail
                                  header={'ประเภทรถ'}
                                  content={
                                    truckTypes?.find((type: any) => type.id === +jobDetail.truckType)?.name ?? '-'
                                  }
                                  style={{ flex: 1 }}
                                />

                                <Detail
                                  header={'จำนวนรถที่ต้องการ'}
                                  content={`${jobDetail.requiredTruckAmount} คัน`}
                                  style={{ flex: 1 }}
                                />

                                <Detail
                                  header={'การลงสินค้า'}
                                  content={jobDetail.tipper ? 'ดั้มพ์' : 'ไม่ดั้มพ์'}
                                  style={{ flex: 1 }}
                                />

                                <Detail header={'คอก'} content={'-'} style={{ flex: 1 }} />
                              </div>
                            </Box>
                          </Col>
                        </Row>
                      }
                    />
                  </Box>

                  <Box style={{ backgroundColor: '#ebeef3' }}>
                    <Collapse
                      isExpanded
                      topic={<Header text={'รถที่เลือก'} />}
                      children={
                        <Droppable
                          key={`truck-droppable-1`}
                          droppableId={jobDroppable.droppableId}
                          // isDropDisabled={jobDroppable.droppable}
                        >
                          {(provided: any, snapshot: any) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                              {jobStore.loading && <h1>Loading ...</h1>}
                              {state[jobDroppable.listId] &&
                                state[jobDroppable.listId].map((item: any, index: number) => (
                                  <Draggable
                                    key={`${jobDroppable.listId}-${item.id}-${index}`}
                                    draggableId={`${jobDroppable.listId}-${item.id}-${index}`}
                                    index={index}
                                  >
                                    {(provided: any, snapshot: any) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          ...getItemStyle(snapshot.isDragging, provided.draggableProps.style),
                                          display: 'flex',
                                          paddingTop: 10,
                                          paddingBottom: 10,
                                        }}
                                      >
                                        <div style={{ flex: 2 }}>
                                          <Row style={{ marginBottom: 0 }}>
                                            <div>
                                              <Value style={{ marginBottom: 0 }}>
                                                {item.registrationNumber.join(' / ')}
                                              </Value>
                                            </div>
                                          </Row>
                                          <Row style={{ marginBottom: 0 }}>
                                            <Col flex={1}>
                                              <Detail
                                                header={'ประเภท'}
                                                content={
                                                  truckTypes?.find((type: any) => type.id === +item.truckType)?.name ??
                                                  '-'
                                                }
                                              />
                                            </Col>
                                            <Col flex={1}>
                                              <Detail header={'ความสูงคอกรถ'} content={item.stallHeight} />
                                            </Col>
                                          </Row>
                                        </div>
                                        <div style={{ flex: 1, paddingLeft: 15, borderLeft: '1px solid #ebeef3' }}>
                                          <Label>{'วันที่เรื่มงาน :'}</Label>
                                          <DatePicker
                                            defaultValue={new Date().toISOString()}
                                            dateFormat="DD/MM/YYYY"
                                            onChange={(date) => console.log('date :>> ', date)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      }
                    />
                  </Box>
                </div>
              )}
            </div>
          </GridColumn>
          <GridColumn medium={5}>
            <div style={LEFT_RIGHT_SPACING}>
              <Droppable
                key={`truck-droppable-1`}
                droppableId={truckDroppable.droppableId}
                // isDropDisabled={truckDroppable.droppable}
              >
                {(provided: any, snapshot: any) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    <Form onSubmit={truckDroppable.onSubmit}>
                      {({ formProps }: any) => (
                        <form {...formProps} style={{ marginBottom: 20 }}>
                          <Field name={truckDroppable.title}>
                            {({ fieldProps }: any) => (
                              <Textfield
                                placeholder={truckDroppable.title}
                                {...fieldProps}
                                onChange={(e: any) => truckDroppable.onChange(e)}
                              />
                            )}
                          </Field>
                        </form>
                      )}
                    </Form>
                    {jobStore.loading && <h1>Loading ...</h1>}
                    {state[truckDroppable.listId] &&
                      state[truckDroppable.listId].map((item: any, index: number) => (
                        <Draggable
                          key={`${truckDroppable.listId}-${item.id}-${index}`}
                          draggableId={`${truckDroppable.listId}-${item.id}-${index}`}
                          index={index}
                        >
                          {(provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              <Row style={{ marginBottom: 0, paddingBottom: 10 }}>
                                <div>
                                  <Value style={{ marginBottom: 0 }}>{item.registrationNumber.join(' / ')}</Value>
                                </div>
                              </Row>
                              <Row style={{ marginBottom: 10 }}>
                                <Col flex={3}>
                                  <Detail
                                    header={'ประเภท'}
                                    content={truckTypes?.find((type: any) => type.id === +item.truckType)?.name ?? '-'}
                                  />
                                </Col>
                                <Col flex={4}>
                                  <Detail header={'ความสูงคอกรถ'} content={item.stallHeight} />
                                </Col>
                              </Row>
                              <Row
                                style={{
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  borderTop: '1px dashed #ebeef3',
                                  margin: 0,
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ color: '#ffc107' }}>
                                    <ArrowLeftIcon label={'chevron-down'} size={'large'} />
                                  </span>
                                  <Value style={{ color: '#ffc107' }}>{'เลือกรถคันนี้'}</Value>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <div>
                                    <span>
                                      <Value>{item.owner?.fullName}</Value>
                                    </span>
                                  </div>
                                  <div style={{ paddingLeft: 10 }}>
                                    <img
                                      src={images.pinDrop}
                                      style={{ width: 35, borderRadius: '50%', backgroundColor: '#ebeef3', padding: 2 }}
                                    />
                                  </div>
                                </div>
                              </Row>
                              <div style={VEHICLE_BACKGROUND_IMGAE}>
                                {item.truckType && (
                                  <img src={images[`Truck${item.truckType}`] ?? undefined} style={{ width: 250 }} />
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </GridColumn>
        </Grid>
      </DragDropContext>
    </Page>
  );
});

export default AddTrip;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Col = styled.div<{ flex: number; display?: 'flex'; flexWrap?: 'wrap' }>`
  flex: ${(props) => props.flex | 1};
  display: ${(props) => props?.display ?? 'block'};
  flex-wrap: ${(props) => props?.flexWrap ?? 'nowrap'};
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

const ButtonGroup = styled.div`
  position: absolute;
  right: 15px;
  top: 50px;
`;

const ButtonBack = styled(Button)`
  border: 1px solid #ffc107;
  color: #ffc107 !important;
  background-color: transparent;
  width: 100px;

  &:hover {
    color: white !important;
    background: #ffc107;
  }
`;

const ButtonConfrim = styled(Button)`
  border: 1px solid #ffc107;
  color: #000 !important;
  background-color: #ffc107;
  width: 100px;
  margin-left: 15px;

  &:hover {
    color: #ffc107 !important;
    background: #fff;
  }
`;
