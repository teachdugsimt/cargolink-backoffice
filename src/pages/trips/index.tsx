import React, { useState, useEffect, Children } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { navigate } from 'gatsby';
import Pagination, { PaginationPropTypes } from '@atlaskit/pagination';
import { useTranslation } from 'react-i18next';
import EmptyState from '@atlaskit/empty-state';
import { useMst } from '../../stores/root-store';
import styled from 'styled-components';
import Page from '@atlaskit/page';
import { observer } from 'mobx-react-lite';
import { TransportationStore } from '../../stores/transportation-store';
import SearchForm from '../../components/search-form';
import { IJob, quotations } from '../../services/transportation-api';
import { IProductType } from '../../services/product-type-api';
import { findProvince } from '../../utils';
import { momentFormatDateTime } from '../../components/simple-data';
import TableTree, { Cell, Header, Headers, Row, Rows, TableTreeDataHelper } from '@atlaskit/table-tree';

let uuid = 0;

interface Props {}
const tableTreeHelper = new TableTreeDataHelper({ key: 'id' });

const Trip: React.FC<Props> = observer((props: any) => {
  const { t } = useTranslation();
  const { masterTypeStore, loginStore } = useMst();
  const { pagination, list } = TransportationStore;
  const [itemsss, setitems] = useState<any>(null);

  useEffect(() => {
    let tmpData = JSON.parse(JSON.stringify(list));
    if (tmpData) {
      setitems(tableTreeHelper.updateItems(tmpData, itemsss, undefined));
    }
  }, [JSON.stringify(list)]);

  const _renderSubTree = (props: any) => {
    const quotations: quotations = props?.data?.quotations;
    console.log('Props :: ', quotations);

    return (
      <div>
        <h1>{props?.header || 'YEAH WOW!'}</h1>
      </div>
    );
  };

  function getChildren(parentItem: any) {
    if (parentItem.quotations) {
      return [
        {
          component: (props: any) => _renderSubTree(props),
          id: ++uuid,
          quotations: parentItem.quotations,
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
    TransportationStore.getTransportationList({
      page: 1,
      rowsPerPage: 10,
      ...(searchText ? { searchText } : undefined),
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
        ...(searchText ? { searchText } : undefined),
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
      ...(value ? { searchText: value } : undefined),
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
      <button onClick={() => navigate('/trips/add')}>ADD TRIP</button>

      <SearchForm onSearch={onSearch} style={{ width: 200 }} />
      <TableTree>
        <Headers>
          <Header width={'15%'}>ID</Header>
          <Header width={'15%'}>Product name</Header>
          <Header width={'15%'}>Product type</Header>
          <Header width={'15%'}>Price</Header>
          <Header width={'8%'}>Price type</Header>
          <Header width={'32%'}>Route</Header>
        </Headers>
        <Rows
          items={itemsss}
          render={({
            productName,
            id,
            price,
            quotations,
            priceType,
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
                  hasChildren={quotations && quotations.length > 0}
                >
                  <Cell singleLine>{id}</Cell>
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
                      <span className="fTime">{`${
                        from?.datetime ? momentFormatDateTime(from?.datetime, loginStore.language) : '-'
                      }`}</span>
                      <span className="tTime">
                        {to?.length ? momentFormatDateTime(to[0]?.dateTime, loginStore.language) : '-'}
                      </span>
                    </Address>
                  </Cell>
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

// import React, { useState, useEffect } from 'react';
// import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
// import PageHeader from '@atlaskit/page-header';
// import { navigate } from 'gatsby';
// import TableTree, { Cell, Header, Headers, Row, Rows, TableTreeDataHelper } from '@atlaskit/table-tree';
// import Pagination, { PaginationPropTypes } from '@atlaskit/pagination';
// import { useTranslation } from 'react-i18next';
// import EmptyState from '@atlaskit/empty-state';
// import { useMst } from '../../stores/root-store';
// import styled from 'styled-components';
// import Page from '@atlaskit/page';
// import { observer } from 'mobx-react-lite';
// import { TransportationStore } from '../../stores/transportation-store'
// import SearchForm from '../../components/search-form';
// import { IJob } from '../../services/transportation-api'
// import { IProductType } from '../../services/product-type-api';
// import { findProvince } from '../../utils';
// import { momentFormatDateTime } from '../../components/simple-data';

// const tableTreeHelper = new TableTreeDataHelper({ key: "id" });

// interface Props { }

// const Trip: React.FC<Props> = observer((props: any) => {
//   const { t } = useTranslation();
//   const { masterTypeStore, loginStore } = useMst();
//   const { pagination, list } = TransportationStore

//   const breadcrumbs = (
//     <Breadcrumbs>
//       <BreadcrumbsItem text={t('trip.management')} key="trips-management" />
//     </Breadcrumbs>
//   );

//   useEffect(() => {
//     if (!masterTypeStore.productTypes) masterTypeStore.getProductTypes()
//     TransportationStore.getTransportationList({
//       page: 1, rowsPerPage: 10,
//       ...(searchText ? { searchText } : undefined)
//     })
//   }, [])

//   const [searchText, setsearchText] = useState<string | null>(null)
//   const onSearch = (value: string) => {
//     if (value) {
//       setsearchText(value)
//       const tmpPagination = JSON.parse(JSON.stringify(TransportationStore.pagination))
//       const newOptions = { ...tmpPagination, currentPage: 1 }
//       TransportationStore.setPagination(newOptions)

//       TransportationStore.getTransportationList({
//         page: 1, rowsPerPage: tmpPagination.size,
//         searchText: value
//       })
//       console.log("Value :: ", value)
//     }
//   }

//   const [dataList, setdataList] = useState<IJob[] | null>(null)
//   const loadTableData = (parentItem: any) => {
//     // getData(parentItem).then((items: any) => {
//     //   console.log("Items in then :: ", items)
//     //   setdataList(tableTreeHelper.updateItems(items, dataList, parentItem))
//     // });
//   }

//   const handlePagination = (event: any) => {
//     event.persist();
//     setTimeout(() => {
//       console.log("change page to :: ", event.target?.innerText)
//       let currentPage = event.target?.innerText || 1
//       const tmpPagination = JSON.parse(JSON.stringify(TransportationStore.pagination))
//       const newOptions = { ...tmpPagination, currentPage: Number(currentPage) }
//       TransportationStore.setPagination(newOptions)
//       TransportationStore.getTransportationList({
//         page: currentPage, rowsPerPage: tmpPagination.size,
//         ...(searchText ? { searchText } : undefined)
//       })
//     }, 200)
//   }

//   useEffect(() => {
//     setdataList(JSON.parse(JSON.stringify(list)))
//   }, [JSON.stringify(list)])

//   const parsePagination = JSON.parse(JSON.stringify(pagination))
//   const { size, totalElements, totalPages, currentPage } = parsePagination

//   let pages: number[] = []
//   if (totalElements > 0) {
//     for (let i = 0; i < totalPages; i++) {
//       pages.push(i + 1)
//     }
//   } else pages.push(1)

//   let products: IProductType[] = []
//   if (masterTypeStore.productTypes) products = JSON.parse(JSON.stringify(masterTypeStore.productTypes))
//   console.log("Product type list :: ", products)
//   return (
//     <Page>
//       <PageHeader breadcrumbs={breadcrumbs}>{t('trip.management')}</PageHeader>
//       <button onClick={() => navigate('/trips/add')}>ADD TRIP</button>

//       <SearchForm onSearch={onSearch} style={{ width: 200 }} />
//       <TableTree>
//         <Headers>
//           <Header width={'15%'}>ID</Header>
//           <Header width={'15%'}>Product name</Header>
//           <Header width={'15%'}>Product type</Header>
//           <Header width={'15%'}>Price</Header>
//           <Header width={'8%'}>Price type</Header>
//           <Header width={'32%'}>Route</Header>

//         </Headers>
//         <Rows
//           load
//           items={dataList}
//           render={({ productName, id, price, quotations, priceType,
//             productTypeId, from, to, component: CustomComponent }: IJob) => {
//             const productType = products.length && products.find((prod) => prod.id === productTypeId);
//             const typeName = productType ? productType.name : '';
//             if (CustomComponent) return <CustomComponent header="I am the header" />
//             else return <Row
//               expandLabel="Expand"
//               collapseLabel="Collapse"
//               itemId={id}
//               items={quotations}
//               onExpand={loadTableData}
//               hasChildren={quotations && quotations.length > 0}
//             >
//               <Cell singleLine>{id}</Cell>
//               <Cell>{productName}</Cell>
//               <Cell>{typeName}</Cell>
//               <Cell>{price}</Cell>
//               <Cell>{priceType}</Cell>
//               <Cell><Address>
//                 <span className="from">{findProvince(from?.name) || '<No Address>'}</span>
//                 <span className="arrow">{'=>'}</span>
//                 {to?.length ? (
//                   <span className="to">{findProvince(to[0]?.name) || '<No Address>'}</span>
//                 ) : (
//                   '<No Address>'
//                 )}
//                 <span className="dot">{to?.length > 1 ? '...' : ''}</span>
//                 <span className="fTime">{`${from?.datetime ? momentFormatDateTime(from?.datetime, loginStore.language) : '-'
//                   }`}</span>
//                 <span className="tTime">
//                   {to?.length ? momentFormatDateTime(to[0]?.dateTime, loginStore.language) : '-'}
//                 </span>
//               </Address></Cell>
//             </Row>
//           }}
//         />
//       </TableTree>

//       {dataList && <div>
//         <Pagination
//           defaultSelectedIndex={currentPage - 1}
//           pages={pages}
//           onChange={handlePagination} />
//       </div>}

//     </Page>
//   );
// })

// export default Trip;
// const Address = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 40px 1fr 40px;
//   grid-template-areas:
//     'from arrow to dot'
//     'fTime arrow tTime dot';
//   gap: 2;

//   .from {
//     grid-area: from;
//     text-align: right;
//   }
//   .to {
//     grid-area: to;
//     text-align: left;
//   }
//   .fTime {
//     grid-area: fTime;
//     color: #ccc;
//     text-align: right;
//   }
//   .tTime {
//     grid-area: tTime;
//     color: #ccc;
//     text-align: left;
//   }
//   .arrow {
//     grid-area: arrow;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }
//   .dot {
//     grid-area: dot;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     font-weight: bold;
//   }
// `;
