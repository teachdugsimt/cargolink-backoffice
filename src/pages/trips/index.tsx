import React, { useState, useEffect, CSSProperties } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { Link, navigate } from 'gatsby';
import Pagination from '@atlaskit/pagination';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../stores/root-store';
import styled from 'styled-components';
import Page from '@atlaskit/page';
import { observer } from 'mobx-react-lite';
import { TransportationStore } from '../../stores/transportation-store';
import SearchForm from '../../components/search-form';
import { IJob, ITrips, WhereTransportation } from '../../services/transportation-api';
import { IProductType } from '../../services/product-type-api';
import { findRegionFromProvince } from '../../utils';
import { momentFormatDateTime } from '../../components/simple-data';
import * as Paljs from '@paljs/ui';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import TableTree, { Cell, Header, Headers, Row, Rows, TableTreeDataHelper } from '@atlaskit/table-tree';
import Button from '@atlaskit/button';
import '../../styles/custom-tbody.css';
import { ITruckType } from '../../services/truck-type-api';
import LottieView from 'react-lottie';
import items from '../../Layouts/menu-item';

let uuid = 0;

const MAIN_COLOR = '#f4f6f9';
const BORDER_WIDTH = 2;
const PADDING_LEFT1: CSSProperties = {
  paddingLeft: 1.5,
};
const PADDING_LEFT_12: CSSProperties = {
  paddingLeft: 12.5,
};
const PADDING_LEFT_10: CSSProperties = {
  paddingLeft: 10,
};
const PADDING_LEFT_25: CSSProperties = {
  paddingLeft: 25,
};

const HeaderCrop = {
  backgroundColor: MAIN_COLOR,
  borderRadius: 7.5,
  paddingTop: 10,
  paddingBottom: 10,
};

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}
const createHead = (withWidth: boolean) => {
  return {
    // key: "user_truck_doc",
    cells: [
      {
        key: 'licensePlate',
        content: <span className="text-padding-left">License Plate</span>,
        width: withWidth ? 20 : undefined,
      },
      {
        key: 'truckId',
        content: 'Truck ID',
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'owner',
        content: 'Owner',
        width: withWidth ? 20 : undefined,
      },
      {
        key: 'truckType',
        content: 'Truck type',
        width: withWidth ? 30 : undefined,
      },
      {
        key: 'tripStatus',
        content: 'Trip status',
        width: withWidth ? 20 : undefined,
      },
      {
        key: 'price',
        content: 'Price',
        width: withWidth ? 20 : undefined,
      },
      {
        key: 'edit',
        content: '',
        width: withWidth ? 6 : undefined,
      },
    ],
  };
};
interface Props { }
const tableTreeHelper = new TableTreeDataHelper({ key: 'id' });

let expandList: string[] = [];

const Trip: React.FC<Props> = observer((props: any) => {
  const head = createHead(true);
  const { t } = useTranslation();
  const { masterTypeStore, truckTypesStore, loginStore } = useMst();
  const { pagination, list } = TransportationStore;
  const [itemsss, setitems] = useState<any>(null);

  const normalFilter: WhereTransportation = { trips: 'NOT_NULL' };

  // const Dots = (data: any) => (<LottieView
  //   style={{ height: 32, width: 32, backgroundColor: color.backgroundWhite }}
  //   colorFilters={[{ keypath: 'palette 01', color: data.color }, { keypath: 'palette 02', color: data.color }]}
  // />)
  const Dots = (props: any) => (
    <LottieView
      options={{
        autoplay: true,
        loop: true,
        animationData: require(`../../images/animations/${props.point}.json`),
      }}
      width={30}
      height={30}
    />
  );

  const addIndexToRowsData = (arr: IJob[]) => {
    if (!arr) return [];
    else {
      let tmp = arr.map((e, i) => {
        return { ...e, index: i };
      });
      console.log();
      return tmp;
    }
  };

  useEffect(() => {
    let tmpData = JSON.parse(JSON.stringify(list));
    if (tmpData) {
      setitems(tableTreeHelper.updateItems(addIndexToRowsData(tmpData), itemsss, undefined));
    }
  }, [JSON.stringify(list)]);

  const generateSubTreeRows = (tripList: ITrips[], parentItem: IJob) => {
    const rows = tripList.map((tripItem: ITrips, index: number) => {
      const { truck } = tripItem;
      const registrationKey: string = truck?.registrationNumber
        ? truck.registrationNumber.join(',')
        : 'registrationNumber';
      const tripId: string = tripItem?.id || '';
      const masterTruckData: ITruckType[] | null = JSON.parse(JSON.stringify(truckTypesStore.data));

      setTimeout(() => {
        const subtreeTableCsss: any = document.querySelector('.sc-ArjOu');
        const rowsCss: any = document.querySelectorAll('.sc-carGAA');
        if (subtreeTableCsss) subtreeTableCsss.style.cssText += `border-bottom: 0px;`;
        if (rowsCss)
          rowsCss.forEach((eachRow: any, indexRow: number) => {
            if (indexRow != rowsCss.length - 1) {
              eachRow.style.cssText += `border-bottom: ${BORDER_WIDTH}px solid ${MAIN_COLOR};`;
            }
          });

        setTimeout(() => {
          const cssRow = document.querySelectorAll('.styled__TreeRowContainer-sc-56yt3z-0.dTlZWA');
          if (cssRow) {
            cssRow.forEach((el: any, index: number) => {
              const lastSlot = itemsss[itemsss.length - 1];
              if (index == itemsss.length - 1 && parentItem.id == lastSlot.id) {
                el.style.cssText += `border-bottom: 0px solid ${MAIN_COLOR};`;
              }
            });
          }
        }, 300);
      }, 100);

      const truckTypeParse = masterTruckData
        ? masterTruckData.find((e) => e.id == tripItem?.truck?.truckType)?.name
        : '';
      return {
        key: `row-${index}-${createKey(registrationKey)}`,
        cells: [
          {
            key: `${index}-${createKey(registrationKey)}`,
            content: (
              <span className="text-padding-left">
                {truck?.registrationNumber ? truck.registrationNumber.join(',') : ''}
              </span>
            ),
          },
          {
            key: createKey(tripId),
            content: tripId,
          },
          {
            key: 'owner' + `-${index}`,
            content: tripItem?.truck?.owner?.fullName || '',
          },
          {
            key: `truck-type-${index}-${truckTypeParse}}`,
            content: truckTypeParse,
          },
          {
            key: `status-${index}-${createKey(tripItem.status)}`,
            content: <span>{tripItem?.status ? t(tripItem.status) : "-"}</span>,
          },
          {
            key: `price-trip-${tripItem.price}`,
            content: tripItem.price || "-",
          },
          {
            key: `trips-edit-${tripItem.id}`,
            content: <Link to={`/trips/shipment/${tripItem.id}`}>Edit</Link>,
          },
        ],
      };
    });
    return rows;
  };

  const _renderSubTreeTable = (subItem: ITrips[], parentItem: IJob) => {
    return (
      <Paljs.Col breakPoint={{ xs: 11.6, md: 11.6 }} style={{}}>
        <Paljs.Col breakPoint={{ xs: 12, md: 12 }} style={{ borderRadius: 2.5 }}>
          <DynamicTableStateless
            head={head}
            rows={generateSubTreeRows(subItem, parentItem)}
            isFixedSize
            onSort={() => console.log('onSort')}
            onSetPage={() => console.log('onSetPage')}
          />
        </Paljs.Col>
      </Paljs.Col>
    );
  };

  const _renderSubTree = (props: any, parentItem: IJob) => {
    const trips: ITrips[] = props.data.trips;
    console.log('Props :: ', trips);

    // const el: any = document.querySelector('#tabletreeitem-3K1N5WL0');
    const el: any = document.querySelectorAll(`[id^='tabletreeitem-']`);
    console.log('EL ele   :: ', el);
    if (el)
      el.forEach((e: any) => {
        e.style.cssText += ` border-top: ${BORDER_WIDTH}px dashed ${MAIN_COLOR};
      border-right: ${BORDER_WIDTH}px solid ${MAIN_COLOR};
      border-bottom: ${BORDER_WIDTH}px solid ${MAIN_COLOR};
      border-left:   ${BORDER_WIDTH}px solid  ${MAIN_COLOR}; border-radius: 5px`;
      });

    return (
      <Paljs.Row style={{ paddingTop: 5, paddingBottom: 10, marginLeft: 0.5, marginRight: 0.5, paddingRight: 12 }}>
        {_renderSubTreeTable(trips, parentItem)}
      </Paljs.Row>
    );
  };

  function getChildren(parentItem: any) {
    if (parentItem.trips) {
      expandList.push(parentItem.id);
      return [
        {
          component: (props: any) => _renderSubTree(props, parentItem),
          id: ++uuid,
          trips: parentItem.trips,
        },
      ];
    }
    return [
      {
        title: 'There Will Be Code',
        id: ++uuid,
        page: 2,
        numbering: '1.1',
        hasChildren: true,
      },
    ];
  }

  function fetchChildrenOf(parentItem: any) {
    return Promise.resolve(getChildren(parentItem));
  }

  function getData(parentItem: any) {
    if (parentItem) return fetchChildrenOf(parentItem);
    return;
  }

  useEffect(() => {
    let tmtItemsss = itemsss;
    if (tmtItemsss) {
      setTimeout(() => {
        const cssRow = document.querySelectorAll('.styled__TreeRowContainer-sc-56yt3z-0.dTlZWA');
        console.log('UseEffect Expand list => ', expandList);
        if (cssRow) {
          const lastSlot = itemsss[itemsss.length - 1];
          cssRow.forEach((el: any, i: number) => {
            const lastRowIsExpand = expandList.find((exl) => exl == lastSlot.id);
            el.style.cssText += `width: 100%; maxHeight: 120px;
            border-left: 2px solid ${MAIN_COLOR};
            border-right: 2px solid ${MAIN_COLOR};
            border-top: 2px solid ${MAIN_COLOR};
            border-bottom: 0px solid white;
            border-radius: 5px`;
            if (i == 0) el.style.cssText += ` margin-top: 15px; `;
            else if (i != cssRow.length - 1) el.style.cssText += ``;
            else el.style.cssText += `border-bottom: ${lastRowIsExpand ? 0 : 2}px solid ${MAIN_COLOR};`;
          });
        }
      }, 500);
    }
  }, [JSON.stringify(itemsss)]);

  useEffect(() => {
    //
    console.log('Component Did mount Pagination :: ', JSON.parse(JSON.stringify(pagination)));
    const cssHeaderDiv: any = document.querySelector('.styled__Header-sc-56yt3z-7');
    const cssHeader: any = document.querySelector('.styled__HeadersContainer-sc-56yt3z-1');
    if (cssHeader) cssHeader.style['border-bottom-width'] = '0px';
    if (cssHeaderDiv) cssHeaderDiv.style.cssText += `padding: 10px 0 0 0`;

    if (!masterTypeStore.productTypes) masterTypeStore.getProductTypes();
    if (!truckTypesStore.data) truckTypesStore.getTruckTypes();

    TransportationStore.getTransportationList({
      page: pagination.currentPage || 1,
      rowsPerPage: 10,
      ...(searchText ? { where: { fullTextSearch: searchText, ...normalFilter } } : { where: normalFilter }),
    });

    return () => {
      console.log('Component Will UNmount !! => ', JSON.parse(JSON.stringify(pagination)));
    };
  }, []);

  const loadTableData = (parentItem?: any) => {
    if (parentItem && parentItem.childIds) {
      return;
    }
    console.log('On load [parent item] : ', parentItem);
    if (parentItem && parentItem != null) {
      getData(parentItem).then((items) => {
        console.log('ITEMS :: ', items);
        if (items) setitems(tableTreeHelper.updateItems(addIndexToRowsData(items), itemsss, parentItem));
      });
    }
  };

  const handlePagination = (event: any) => {
    setitems(null);
    event.persist();
    setTimeout(() => {
      console.log('change page to :: ', event.target?.innerText);
      let currentPage = event.target?.innerText || 1;
      const tmpPagination = JSON.parse(JSON.stringify(TransportationStore.pagination));
      const newOptions = { ...tmpPagination, currentPage: Number(currentPage) };
      TransportationStore.setPagination(newOptions);
      TransportationStore.getTransportationList({
        page: currentPage,
        rowsPerPage: tmpPagination.size,
        ...(searchText ? { where: { fullTextSearch: searchText, ...normalFilter } } : { where: normalFilter }),
      });
    }, 200);
  };

  const [searchText, setsearchText] = useState<string | null>(null);
  const onSearch = (value: string) => {
    setitems(null);
    console.log('Value :: ', value);
    setsearchText(value);
    const tmpPagination = JSON.parse(JSON.stringify(TransportationStore.pagination));
    const newOptions = { ...tmpPagination, currentPage: 1 };
    TransportationStore.setPagination(newOptions);

    TransportationStore.getTransportationList({
      page: 1,
      rowsPerPage: tmpPagination.size,
      ...(value ? { where: { fullTextSearch: value, ...normalFilter } } : { where: normalFilter }),
    });
  };

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('trip.management')} key="trips-management" />
    </Breadcrumbs>
  );

  const parsePagination = JSON.parse(JSON.stringify(pagination));
  const { size, totalElements, totalPages, currentPage } = parsePagination;

  let pages: number[] = [];
  if (totalElements > 0) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i + 1);
    }
  } else pages.push(1);

  let products: IProductType[] = [];
  if (masterTypeStore.productTypes) products = JSON.parse(JSON.stringify(masterTypeStore.productTypes));
  console.log('ITTEMSSS :: ', itemsss);

  const newNode = document.createElement('p');

  return (
    <Page>
      <PageHeader breadcrumbs={breadcrumbs}>{t('trip.management')}</PageHeader>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <SearchForm onSearch={onSearch} style={{ width: 200 }} />
        <Button appearance="warning" onClick={() => navigate('/trips/add')}>
          Add Shipment
        </Button>
      </div>
      <TableTree on>
        <Paljs.Col style={HeaderCrop}>
          <Headers>
            <Header width={'15%'} style={PADDING_LEFT_12}>
              ID
            </Header>
            <Header width={'10%'} style={PADDING_LEFT1}>
              Product name
            </Header>
            <Header width={'10%'} style={PADDING_LEFT1}>
              Product type
            </Header>
            <Header width={'10%'} style={PADDING_LEFT1}>
              Price
            </Header>
            <Header width={'10%'} style={PADDING_LEFT1}>
              Price type
            </Header>
            <Header width={'30%'} style={PADDING_LEFT1}>
              Route
            </Header>
            <Header width={'10%'} style={PADDING_LEFT1}>
              Status
            </Header>
            <Header width={'5%'}> </Header>
          </Headers>
        </Paljs.Col>
        <Rows
          items={itemsss}
          render={({
            productName,
            id,
            price,
            trips,
            priceType,
            status,
            productTypeId,
            from,
            to,
            children,
            index,
            component: CustomComponent,
          }: IJob) => {
            const productType = products.length && products.find((prod) => prod.id === productTypeId);
            const typeName = productType ? productType.name : '';

            if (CustomComponent) return <CustomComponent />;
            else
              return (
                <Row
                  expandLabel="Expand"
                  collapseLabel="Collapse"
                  itemId={id}
                  items={children}
                  onExpand={loadTableData}
                  onCollapse={(ee: any) => {
                    const findLastRowIsExpand = expandList.find((item) => item == ee.id);
                    if (findLastRowIsExpand) {
                      expandList.forEach((item: any, index: number) => {
                        if (item == ee.id) expandList.splice(index, 1);
                      });
                    }
                    const lastSlot: IJob | null = itemsss[itemsss.length - 1];
                    if (ee && lastSlot && ee?.id == lastSlot?.id) {
                      const cssRow = document.querySelectorAll('.styled__TreeRowContainer-sc-56yt3z-0.dTlZWA');
                      if (cssRow) {
                        cssRow.forEach((el: any, index: number) => {
                          if (index == itemsss.length - 1) {
                            el.style.cssText += `border-bottom: 2px solid ${MAIN_COLOR};`;
                          }
                        });
                      }
                    }
                  }}
                  hasChildren={trips && trips.length > 0}
                >
                  <Cell singleLine style={PADDING_LEFT_25}>
                    {id}
                  </Cell>
                  <Cell style={PADDING_LEFT_10}>{productName}</Cell>
                  <Cell style={PADDING_LEFT_10}>{typeName}</Cell>
                  <Cell style={PADDING_LEFT_10}>{price}</Cell>
                  <Cell style={PADDING_LEFT_10}>{priceType}</Cell>
                  <Cell style={PADDING_LEFT_10}>
                    <Address>
                      <div className="container">
                        <div className="from-root">
                          <div className="dots">
                            <Dots point={'loading-point'} />
                          </div>
                        </div>

                        <div className="form">
                          <span className="light-text">
                            {t('from')} :{' '}
                            <span style={{ color: 'black' }}>
                              {findRegionFromProvince(from?.name) || '<No Address>'}
                            </span>
                          </span>
                          <span className="light-text">{`${from?.dateTime ? momentFormatDateTime(from?.dateTime, loginStore.language) : '-'
                            }`}</span>
                        </div>
                      </div>

                      <div className="container">
                        <div className="from-root">
                          <div className="dots">
                            <Dots point={'delivery-point'} />
                          </div>
                        </div>
                        <div className="form">
                          <span className="light-text">
                            {t("to")} :{' '}
                            <span style={{ color: 'black' }}>
                              {findRegionFromProvince(to[0]?.name) || '<No Address>'}
                            </span>
                          </span>
                          <span className="light-text">
                            {to && Array.isArray(to) && to[0] && to[0].dateTime && to.length
                              ? momentFormatDateTime(to[0]?.dateTime, loginStore.language)
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </Address>
                  </Cell>
                  <Cell style={PADDING_LEFT_10}>{status ? t(status) : '-'}</Cell>
                  <Cell style={PADDING_LEFT_10}>
                    <Link to={`/trips/${id}`}>
                      <div className="see-list-trip">
                        <span className="see-list-span">{t('see')}</span>
                      </div>
                    </Link>
                  </Cell>
                </Row>
              );
          }}
        />
      </TableTree>
      {itemsss && (
        <div style={{ marginTop: 10 }}>
          <Pagination defaultSelectedIndex={currentPage - 1} pages={pages} onChange={handlePagination} />
        </div>
      )}
    </Page>
  );
});
export default Trip;
const Address = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .from-root {
    flex-direction: row;
  }
  .dots {
    display: flex;
    flex-direction: column;
    width: 30px;
    height: 30px;
    height: 100%;
    justify-content: center;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .container {
    display: flex;
    flex-direction: row;
  }

  .addr-container {
    display: flex;
  }

  .light-text {
    color: lightgrey;
  }
`;
