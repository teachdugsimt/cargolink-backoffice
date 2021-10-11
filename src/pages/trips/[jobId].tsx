import React, { useState, useEffect, CSSProperties, useCallback, memo } from 'react';
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
import styled from 'styled-components';
import Collapse from '../../components/collapse/collapse';
import images from '../../components/Themes/images';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { DatePicker } from '@atlaskit/datetime-picker';
import Button from '@atlaskit/button';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import LottieView from 'react-lottie';
import Spinner from '@atlaskit/spinner';
import SearchIcon from '@atlaskit/icon/glyph/search';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Select from 'react-select';
import { TransportationStore } from '../../stores/transportation-store';
import moment from 'moment';

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

const TRASH: CSSProperties = {
  color: '#ff0000',
  position: 'absolute',
  right: 0,
  paddingRight: 15,
  cursor: 'pointer',
};

const DROP_BOX_SHOW: CSSProperties = {
  position: 'relative',
  marginTop: 15,
  minHeight: 200,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  border: '1px dashed #cfcfcf',
  borderRadius: 5,
  transitionProperty: 'all',
  transitionDuration: '0.5s',
  transitionTimingFunction: 'ease',
};

const DROP_BOX_HIDE: CSSProperties = {
  minHeight: 0,
  transitionProperty: 'all',
  transitionDuration: '0.5s',
  transitionTimingFunction: 'ease',
  maxHeight: 735,
  overflowX: 'scroll',
};

const DROP_BOX_CONTENT: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const SEARCH_ICON: CSSProperties = {
  position: 'absolute',
  left: 9,
  top: 7,
  color: '#cfcfcf',
  zIndex: 99,
};

const LOADING_ICON: CSSProperties = {
  position: 'absolute',
  right: 50,
  top: 5,
  color: '#cfcfcf',
  zIndex: 99,
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

const NEW_ICON: CSSProperties = {
  position: 'absolute',
  top: -14,
  left: -1,
};

const TruckAnimate = () => (
  <LottieView
    options={{
      autoplay: true,
      loop: true,
      animationData: require('../../images/animations/trruck-loading.json'),
    }}
  />
);

const Dots = () => (
  <LottieView
    options={{
      autoplay: true,
      loop: true,
      animationData: require('../../images/animations/dots-loading.json'),
    }}
    width={60}
    height={40}
  />
);

const Image = memo(
  ({ src, id, onError }: any) => (
    <img
      src={src}
      style={{
        width: 25,
        borderRadius: '50%',
        backgroundColor: '#ebeef3',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
      }}
      onError={onError}
    />
  ),
  (prevProps, nextProps) => {
    if (prevProps.id === nextProps.id) {
      return true;
    }
    return false;
  },
);

const Header = ({ text }: any) => (
  <>
    <div style={TRIANGLE_TOPLEFT}></div>
    <h4 style={{ ...LEFT_RIGHT_SPACING, margin: 0, position: 'relative', color: '#fff' }}>{text}</h4>
  </>
);

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
  padding: '5px 15px',
  margin: `0 0 15px 0`,
  borderRadius: 5,
  position: 'relative',
  overflow: 'hidden',
  background: isDragging ? '#ffc107' : '#fff',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
  background: isDraggingOver ? 'lightblue' : '#ebeef3',
  padding: '15px 15px 5px 15px',
  margin: '3px',
  flex: 1,
  borderRadius: 5,
});

const Location = ({ content, header, img }: LocationProps) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
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

const DetailSmall = ({ header, content, style = {} }: any) => (
  <div style={style}>
    <Label style={{ margin: '5px 0' }}>{`${header} :`}</Label>
    <ValueSmall>{content}</ValueSmall>
  </div>
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

let truckPage: number = 1;

const TripsInfo: React.FC<Props> = observer((props: any) => {
  const { jobStore, truckStore, truckTypesStore, productTypesStore } = useMst();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({
    truckSelected: [],
    trucks: [],
  });
  const [truckTypes, setTruckTypes] = useState<MasterTypeProps | any>({});
  const [truckTypeSelectedOption, setTruckTypeSelectedOption] = useState<Array<ITruckTypeSelectedOptionProps>>([]);
  const [productTypes, setProductTypes] = useState<MasterTypeProps | any>({});
  const [searchTruck, setSearchTruck] = useState<any>('');
  const [isDragStart, setIsDragStart] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState('none');

  useEffect(() => {
    return () => {
      jobStore.clearJobs();
      truckStore.clearTrucks();
    };
  }, []);

  useEffect(() => {
    // jobStore.getJobById({ jobId: props.jobId });
    TransportationStore.getJobDetail(props.jobId);
  }, [props.jobId]);

  useEffect(() => {
    if (TransportationStore.jobDetail) {
      const jobDetail = JSON.parse(JSON.stringify(TransportationStore.jobDetail));
      const trucks: any = [];
      if (jobDetail?.trips) {
        const truckList = jobDetail.trips.map((trip: any) => ({ ...trip.truck, old: true }));
        trucks.push(...truckList);
      } else if (jobDetail?.quotations) {
        const truckList = jobDetail.quotations.map((quot: any) => ({ ...quot.truck, old: true }));
        trucks.push(...truckList);
      }

      console.log('trucks :>> ', trucks);

      trucks.length &&
        setState((prev: any) => ({
          ...prev,
          truckSelected: trucks,
        }));
    }
  }, [JSON.stringify(TransportationStore.jobDetail)]);

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

  useEffect(() => {
    if (truckStore.truckList?.content?.length) {
      setState((prev: any) => ({
        ...prev,
        trucks: JSON.parse(JSON.stringify(truckStore.truckList?.content)),
      }));
    }
  }, [JSON.stringify(truckStore.truckList)]);

  const droppableIds: any = {
    droppable1: 'trucks',
    droppable2: 'truckSelected',
  };

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => {}}>
      <BreadcrumbsItem onClick={() => navigate('/trips')} text={t('trip.management')} key="trips-management" />
      <BreadcrumbsItem text={t('job.info')} key="job-info" />
    </Breadcrumbs>
  );

  const getList = (id: string): any => state[droppableIds[id]];

  const onDragEnd = (result: any) => {
    setIsDragStart(false);
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items: object = reorder(getList(source.droppableId), source.index, destination.index);

      let copiedState: any = Object.assign({}, state);

      if (source.droppableId === 'droppable2') {
        copiedState.truckSelected = items;
      } else if (source.droppableId === 'droppable1') {
        copiedState.trucks = items;
      }

      setState(copiedState);
    } else {
      const result: any = move(getList(source.droppableId), getList(destination.droppableId), source, destination);

      setState({
        trucks: result.droppable1 ? result.droppable1 : state.trucks,
        truckSelected: result.droppable2 ? result.droppable2 : state.truckSelected,
      });
    }
  };

  const onChangeValueTruck = (e: any) => {
    const value = e.target.value;
    setSearchTruck(value);
  };

  const onSubmitTruck = (truckTypeId?: number) => {
    if (!truckTypeId) {
      const truckOptions = truckTypeSelectedOption;
      if (truckOptions[truckOptions.length - 1].value.includes('truck-selected-')) {
        truckOptions.pop();
      }
      const value = `truck-selected-${Math.floor(Date.now() / 1000)}`;
      truckOptions.push({
        value: value,
        label: searchTruck,
        isDisabled: true,
      });
      setTruckTypeSelectedOption(truckOptions);
      setSelectedOption(value);
    }
    truckStore.clearTrucks();
    truckStore.getTrucksListWithoutEmptyContent({
      page: 1,
      descending: true,
      ...(truckTypeId ? { truckTypes: JSON.stringify([truckTypeId]) } : { searchText: searchTruck }),
    });
    truckPage = 1;
  };

  const loadMoreTruck = (truckTypeId?: number) => {
    truckStore.getTrucksListWithoutEmptyContent({
      page: ++truckPage,
      descending: true,
      ...(truckTypeId ? { truckTypes: JSON.stringify([truckTypeId]) } : { searchText: searchTruck }),
    });
  };

  const onSelectedTruckOptions = (e: any) => {
    setSelectedOption(e.value);
    setSearchTruck('');
    onSubmitTruck(+e.value);
  };

  const onImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = images.pinDrop;
  };

  const removeTruck = (truckId: string) => {
    console.log('truckId :>> ', truckId);
    const truckDetail = state.truckSelected.find((truck: any) => truck.id === truckId);
    const newTruckList = state.trucks;
    newTruckList.push(truckDetail);

    const removeTruckList = state.truckSelected.filter((truck: any) => truck.id !== truckId);

    setState({
      trucks: newTruckList,
      truckSelected: removeTruckList,
    });
  };

  const truckDroppable = {
    droppableId: 'droppable1',
    listId: 'trucks',
    title: 'Search trucks',
    onChange: onChangeValueTruck,
    onSubmit: onSubmitTruck,
  };

  const truckSelectedDroppable = {
    droppableId: 'droppable2',
    listId: 'truckSelected',
    title: '',
  };

  console.log('truckStore.loading :>> ', truckStore.loading);

  const jobDetail = TransportationStore.jobDetail ? JSON.parse(JSON.stringify(TransportationStore.jobDetail)) : {};
  console.log(
    'JSON.parse(JSON.stringify(TransportationStore.jobDetail)) :>> ',
    JSON.parse(JSON.stringify(TransportationStore.jobDetail)),
  );
  console.log('jobDetail :>> ', jobDetail);

  return (
    <Page>
      <PageHeader breadcrumbs={breadcrumbs}>{t('job.info')}</PageHeader>
      <ButtonGroup>
        <ButtonBack onClick={() => navigate('/trips')}>{t('back')}</ButtonBack>
        <ButtonConfrim>{t('confirm')}</ButtonConfrim>
      </ButtonGroup>
      <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={() => setIsDragStart(true)}>
        <Grid layout="fluid" spacing="compact">
          <GridColumn medium={7}>
            <div style={LEFT_RIGHT_SPACING}>
              <div>
                <Box style={{ position: 'relative', overflow: 'hidden', marginTop: 5 }}>
                  <Collapse
                    isExpanded
                    topic={<Header text={'งานที่เลือก'} />}
                    children={
                      <Row style={LEFT_RIGHT_SPACING}>
                        <Col display={'flex'} flex={1} flexWrap={'wrap'}>
                          <div style={{ width: '100%' }}>
                            <Detail header={'ชื่อสินค้า'} content={jobDetail?.productName} />
                          </div>

                          <Col flex={1}>
                            <Detail
                              header={'ประเภท'}
                              content={
                                productTypes[jobDetail?.productTypeId] ??
                                (productTypes?.length ? '-' : <Spinner size="medium" />)
                              }
                            />
                          </Col>
                          <Col flex={1}>
                            <Detail
                              header={'วันที่'}
                              content={
                                jobDetail?.loadingDatetime ? moment(jobDetail.loadingDatetime).format('DD/MM/YY') : '-'
                              }
                            />
                          </Col>
                          <Col flex={1}>
                            <Detail header={'ชื่อเจ้าของ'} content={jobDetail?.owner?.fullName} />
                          </Col>
                          <Col flex={1}>
                            <Detail header={'เบอร์โทรเจ้าของ'} content={jobDetail?.owner?.mobileNo} />
                          </Col>

                          <div style={{ width: '100%' }}>
                            <Label>{'สถานที่ :'}</Label>
                            <Location header={'จาก'} content={jobDetail?.from?.name} img={'pinDrop'} />
                            {jobDetail?.to?.map((data: any, index: number) => (
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
                                  truckTypes[jobDetail?.truckType] ??
                                  (Object.keys(truckTypes)?.length ? '-' : <Spinner size="medium" />)
                                }
                                style={{ flex: 1 }}
                              />

                              <Detail
                                header={'จำนวนรถที่ต้องการ'}
                                content={`${jobDetail?.requiredTruckAmount ?? '-'} คัน`}
                                style={{ flex: 1, color: '#ffc107' }}
                              />

                              <Detail
                                header={'การลงสินค้า'}
                                content={jobDetail?.tipper ? 'ดั้มพ์' : 'ไม่ดั้มพ์'}
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

                <Box style={{ backgroundColor: '#ebeef3', position: 'relative', overflow: 'hidden' }}>
                  <Collapse
                    isExpanded
                    topic={<Header text={'รถที่เลือก'} />}
                    children={
                      <div style={isDragStart ? DROP_BOX_SHOW : DROP_BOX_HIDE}>
                        {isDragStart && !state.truckSelected?.length && (
                          <div style={DROP_BOX_CONTENT}>
                            <TruckAnimate />
                          </div>
                        )}
                        <Droppable key={`truck-selected-droppable-1`} droppableId={truckSelectedDroppable.droppableId}>
                          {(provided: any, snapshot: any) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                              {state[truckSelectedDroppable.listId] &&
                                state[truckSelectedDroppable.listId].map((item: any, index: number) => (
                                  <Draggable
                                    key={`${truckSelectedDroppable.listId}-${item.id}-${index}`}
                                    draggableId={`${truckSelectedDroppable.listId}-${item.id}-${index}`}
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
                                          overflow: 'visible',
                                          ...(!item.old ? { border: '2px solid #ffc107' } : undefined),
                                        }}
                                      >
                                        {!item.old && (
                                          <div style={NEW_ICON}>
                                            {/* <New key={item.id} /> */}
                                            <NewText>{'ใหม่'}</NewText>
                                          </div>
                                        )}
                                        <div style={{ flex: 2 }}>
                                          <Row style={{ marginBottom: 0 }}>
                                            <div>
                                              <Value style={{ marginBottom: 0 }}>
                                                {item.registrationNumber ? item.registrationNumber.join(' / ') : '-'}
                                              </Value>
                                            </div>
                                          </Row>
                                          <Row style={{ marginBottom: 0 }}>
                                            <Col flex={1}>
                                              <Detail
                                                header={'ประเภท'}
                                                content={
                                                  truckTypes[item.truckType] ??
                                                  (Object.keys(truckTypes)?.length ? '-' : <Spinner size="medium" />)
                                                }
                                              />
                                            </Col>
                                            <Col flex={1}>
                                              <Detail header={'ความสูงคอกรถ'} content={item.stallHeight ?? '-'} />
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
                                        <span style={TRASH} onClick={() => removeTruck(item.id)}>
                                          <TrashIcon label={'trash-icon'} size={'small'} />
                                        </span>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    }
                  />
                </Box>
              </div>
            </div>
          </GridColumn>
          <GridColumn medium={5}>
            <div
              style={{
                ...LEFT_RIGHT_SPACING,
                maxHeight: 1290,
                ...(state.trucks?.length >= 2 ? { overflowX: 'scroll' } : undefined),
              }}
            >
              <Droppable
                key={`truck-droppable-1`}
                droppableId={truckDroppable.droppableId}
                // isDropDisabled={truckDroppable.droppable}
              >
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      ...getListStyle(snapshot.isDraggingOver),
                      border: '1px solid #cfcfcf',
                    }}
                  >
                    <Form onSubmit={() => truckDroppable.onSubmit()}>
                      {({ formProps }: any) => (
                        <form {...formProps} style={{ paddingBottom: 20 }}>
                          <div style={{ position: 'relative' }}>
                            <span style={SEARCH_ICON}>
                              <SearchIcon label={'search-icon'} size={'medium'} />
                            </span>
                            <Field name={truckDroppable.title}>
                              {({ fieldProps }: any) => (
                                <Select
                                  {...fieldProps}
                                  value={truckTypeSelectedOption.filter((option: any) => {
                                    return option.value === selectedOption;
                                  })}
                                  options={truckTypeSelectedOption}
                                  onInputChange={(newValue: string) => setSearchTruck(newValue)}
                                  onChange={(e: any) => onSelectedTruckOptions(e)}
                                  placeholder={'Search trucks'}
                                  id={'truck-select-options'}
                                />
                              )}
                            </Field>
                            {(truckStore.loading || truckTypesStore.loading) && (
                              <span style={LOADING_ICON}>
                                <Spinner size={'small'} />
                              </span>
                            )}
                          </div>
                        </form>
                      )}
                    </Form>
                    <div>
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
                                <Row style={{ marginBottom: 0, paddingBottom: 5 }}>
                                  <div>
                                    <Value style={{ marginBottom: 0 }}>
                                      {item.registrationNumber ? item.registrationNumber.join(' / ') : '-'}
                                    </Value>
                                  </div>
                                </Row>
                                <Row style={{ marginBottom: 10 }}>
                                  <Col flex={1}>
                                    <DetailSmall
                                      header={'ประเภท'}
                                      content={
                                        truckTypes[item.truckType] ??
                                        (Object.keys(truckTypes)?.length ? '-' : <Spinner size="medium" />)
                                      }
                                    />
                                  </Col>
                                  <Col flex={1}>
                                    <DetailSmall header={'ความสูงคอกรถ'} content={item.stallHeight} />
                                  </Col>
                                </Row>
                                <Row
                                  style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px dashed #ebeef3',
                                    margin: 0,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: snapshot.isDragging ? '#fff' : '#ffc107' }}>
                                      <ArrowLeftIcon label={'chevron-down'} size={'medium'} />
                                    </span>
                                    <ValueSmall
                                      style={{ color: snapshot.isDragging ? '#fff' : '#ffc107', paddingLeft: 5 }}
                                    >
                                      {'เลือกรถคันนี้'}
                                    </ValueSmall>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <div>
                                      <span>
                                        <ValueSmall>{item.owner?.fullName}</ValueSmall>
                                      </span>
                                    </div>
                                    <div style={{ paddingLeft: 10 }}>
                                      <Image
                                        src={`${process.env.API_ENDPOINT}/api/v1/media/file-stream?attachCode=${item.owner?.avatar?.object}`}
                                        id={item.id}
                                        onError={onImageError}
                                      />
                                    </div>
                                  </div>
                                </Row>
                              </div>
                            )}
                          </Draggable>
                        ))}
                    </div>
                    {provided.placeholder}
                    {truckStore.truckList?.content && truckPage < (truckStore.truckList.totalPages ?? 0) && (
                      <div style={{ paddingBottom: 5, display: 'flex', justifyContent: 'center' }}>
                        <ButtonLoadMore onClick={() => loadMoreTruck(selectedOption ? +selectedOption : undefined)}>
                          <span style={{ width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {!truckStore.loading ? <MoreIcon label={'more-icon'} size={'medium'} /> : <Dots />}
                          </span>
                        </ButtonLoadMore>
                      </div>
                    )}
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

export default TripsInfo;

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

const ValueSmall = styled.span`
  font-size: 14px;
  margin: 5px 0;
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
