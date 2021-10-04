import React, { useState, useEffect, Children } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { Link, navigate } from 'gatsby';
import Pagination, { PaginationPropTypes } from '@atlaskit/pagination';
import { useTranslation } from 'react-i18next';
import EmptyState from '@atlaskit/empty-state';
import { useMst } from '../../stores/root-store';
import styled from 'styled-components';
import Page from '@atlaskit/page';
import { observer } from 'mobx-react-lite';
import { TransportationStore } from '../../stores/transportation-store';
import SearchForm from '../../components/search-form';
import { IJob, ITrips, ITruck2 } from '../../services/transportation-api';
import { IProductType } from '../../services/product-type-api';
import { findProvince } from '../../utils';
import { momentFormatDateTime } from '../../components/simple-data';
import { formatPhoneNumber } from '../../utils';
import Rowy from '@paljs/ui/Row';
import Coly from '@paljs/ui/Col';
import TableTree, { Cell, Header, Headers, Row, Rows, TableTreeDataHelper } from '@atlaskit/table-tree';
import { TruckTypeStore } from '../../stores/truck-type-store';
import Button from '@atlaskit/button';

let uuid = 0;

interface Props { }
const tableTreeHelper = new TableTreeDataHelper({ key: 'id' });

const Trip: React.FC<Props> = observer((props: any) => {
  const { t } = useTranslation();
  const { masterTypeStore, truckTypesStore, loginStore } = useMst();
  const { pagination, list } = TransportationStore;
  const [itemsss, setitems] = useState<any>(null);

  useEffect(() => {
    let tmpData = JSON.parse(JSON.stringify(list));
    if (tmpData) {
      setitems(tableTreeHelper.updateItems(tmpData, itemsss, undefined));
    }
  }, [JSON.stringify(list)]);

  const getHeight = (stallHeight: string | null) => {
    switch (stallHeight) {
      case 'HEIGHT':
        return t('HIGH');
      case 'MEDIUM':
        return t('MEDIUM');
      case 'LOW':
        return t('LOW');
      default:
        return '-';
    }
  };

  const _renderSubTree = (props: any) => {
    const trips: ITrips[] = props.data.trips;
    console.log('Props :: ', trips);

    return (
      <Rowy style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }}>
        {trips.map((e: ITrips, i: number) => {
          const tmp: ITrips = e;
          const { id, truckType, registrationNumber, owner }: ITruck2 = tmp.truck;
          const parseTruckType = truckTypesStore.truckTypeNameById(truckType || 1)?.name || 'unknow_truck';
          return (
            <Coly key={`sub-col-${i}`} breakPoint={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
              <Rowy>
                <Coly breakPoint={{ md: 2, lg: 2 }}>
                  <span>รหัสรถ {id} , </span>
                </Coly>
                <Coly breakPoint={{ md: 2, lg: 2 }}>
                  <span>เจ้าของรถ {owner?.fullName || ''} , </span>
                </Coly>
                <Coly breakPoint={{ md: 2, lg: 2 }}>
                  <span>{parseTruckType} , </span>
                </Coly>
                {registrationNumber && (
                  <Coly breakPoint={{ md: 2, lg: 2 }}>
                    {registrationNumber.map((regis: string) => (
                      <span key={regis}>{regis}</span>
                    ))}
                  </Coly>
                )}
                <Coly breakPoint={{ md: 2, lg: 2 }}>
                  <span>ราคา {tmp?.price} , </span>
                </Coly>
                <Coly breakPoint={{ md: 2, lg: 2 }}>
                  <span>สถานะ {tmp?.status} , </span>
                </Coly>
              </Rowy>
            </Coly>
          );
        })}
      </Rowy>
    );
  };

  function getChildren(parentItem: any) {
    if (parentItem.trips) {
      return [
        {
          component: (props: any) => _renderSubTree(props),
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
    if (!masterTypeStore.productTypes) masterTypeStore.getProductTypes();
    if (!truckTypesStore.data) truckTypesStore.getTruckTypes();
    TransportationStore.getTransportationList({
      page: 1,
      rowsPerPage: 10,
      ...(searchText ? { where: { fullTextSearch: searchText } } : undefined),
    });
  }, []);

  const loadTableData = (parentItem?: any) => {
    if (parentItem && parentItem.childIds) {
      return;
    }
    console.log('On load [parent item] : ', parentItem);
    if (parentItem && parentItem != null) {
      getData(parentItem).then((items) => {
        console.log('ITEMS :: ', items);
        if (items) setitems(tableTreeHelper.updateItems(items, itemsss, parentItem));
      });
    }
  };

  const handlePagination = (event: any) => {
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
        ...(searchText ? { where: { fullTextSearch: searchText } } : undefined),
      });
    }, 200);
  };

  const [searchText, setsearchText] = useState<string | null>(null);
  const onSearch = (value: string) => {
    console.log('Value :: ', value);
    setsearchText(value);
    const tmpPagination = JSON.parse(JSON.stringify(TransportationStore.pagination));
    const newOptions = { ...tmpPagination, currentPage: 1 };
    TransportationStore.setPagination(newOptions);

    TransportationStore.getTransportationList({
      page: 1,
      rowsPerPage: tmpPagination.size,
      ...(value ? { where: { fullTextSearch: value } } : undefined),
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
  return (
    <Page>
      <PageHeader breadcrumbs={breadcrumbs}>{t('trip.management')}</PageHeader>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <SearchForm onSearch={onSearch} style={{ width: 200 }} />
        <Button appearance="warning" onClick={() => navigate('/trips/add')}>Add Shipment</Button>
      </div>
      <TableTree on>
        <Headers>
          <Header width={'15%'}>ID</Header>
          <Header width={'15%'}>Product name</Header>
          <Header width={'15%'}>Product type</Header>
          <Header width={'15%'}>Price</Header>
          <Header width={'8%'}>Price type</Header>
          <Header width={'32%'}>Route</Header>
          <Header width={'12%'}>Status</Header>
        </Headers>
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
                  hasChildren={trips && trips.length > 0}
                >
                  <Cell singleLine><Link to={`/trips/${id}`}>{id}</Link></Cell>
                  <Cell>{productName}</Cell>
                  <Cell>{typeName}</Cell>
                  <Cell>{price}</Cell>
                  <Cell>{priceType}</Cell>
                  <Cell>
                    <Address>
                      <span className="from">{findProvince(from?.name) || '<No Address>'}</span>
                      <span className="arrow">{'=>'}</span>
                      {to?.length ? (
                        <span className="to">{findProvince(to[0]?.name) || '<No Address>'}</span>
                      ) : (
                        '<No Address>'
                      )}
                      <span className="dot">{to?.length > 1 ? '...' : ''}</span>
                      <span className="fTime">{`${from?.datetime ? momentFormatDateTime(from?.datetime, loginStore.language) : '-'
                        }`}</span>
                      <span className="tTime">
                        {to?.length ? momentFormatDateTime(to[0]?.dateTime, loginStore.language) : '-'}
                      </span>
                    </Address>
                  </Cell>
                  <Cell>{status || '-'}</Cell>
                </Row>
              );
          }}
        />
      </TableTree>
      {itemsss && (
        <div>
          <Pagination defaultSelectedIndex={currentPage - 1} pages={pages} onChange={handlePagination} />
        </div>
      )}
    </Page>
  );
});
export default Trip;
const Address = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px 1fr 40px;
  grid-template-areas:
    'from arrow to dot'
    'fTime arrow tTime dot';
  gap: 2;

  .from {
    grid-area: from;
    text-align: right;
  }
  .to {
    grid-area: to;
    text-align: left;
  }
  .fTime {
    grid-area: fTime;
    color: #ccc;
    text-align: right;
  }
  .tTime {
    grid-area: tTime;
    color: #ccc;
    text-align: left;
  }
  .arrow {
    grid-area: arrow;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dot {
    grid-area: dot;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
`;
