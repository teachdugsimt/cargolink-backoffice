import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';
import moment from 'moment';
import 'moment/locale/th';
moment.locale('th');

const nf = new Intl.NumberFormat();

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'job_no',
        content: 'Job No.',
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'product_name',
        content: 'Product Name',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'name_shipper',
        content: 'Name of  shipper',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'type',
        content: 'Type of goods',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'route',
        content: 'Route',
        shouldTruncate: true,
        // width: withWidth ? 50 : undefined,
      },
      {
        key: 'weight',
        content: 'Weight',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const head = createHead(true);

export const createRow = (jobs: any, products: any) => {
  return jobs.map((jobpost: any, index: number) => {
    const productType = products?.length && products.find((prod: any) => prod.id === jobpost.productTypeId);
    const typeName = productType ? productType.name : '';
    return {
      key: `row-${index}-${jobpost.id}`,
      cells: [
        {
          key: jobpost.id,
          content: <span style={{ padding: '10px 0px', color: '#FBBC12', fontWeight: 'bold' }}>{jobpost.id}</span>,
        },
        {
          key: jobpost.productName,
          content: jobpost.productName,
        },
        {
          key: jobpost.owner?.companyName,
          content: jobpost.owner?.companyName,
        },
        {
          key: typeName,
          content: typeName,
        },
        {
          key: jobpost.from?.name,
          content: (
            <div style={{ borderBottom: '2px solid black' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ padding: 2 }}>
                  <span style={{ fontWeight: 'bold' }}>From: </span>
                  {`${jobpost.from?.name}`}
                </span>
                <span>
                  <Icon style={{ color: '#FBBC12' }} icon={ic_access_time} />
                  {` ${moment(jobpost.from?.dateTime, 'DD-MM-YYYY HH:mm').add(543, 'year').format('LLL')}`}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
                <span style={{ padding: 2, marginTop: 8 }}>
                  <span style={{ fontWeight: 'bold' }}>To: </span>
                  {`${jobpost.to[0]?.name}`}
                </span>
                <span>
                  <Icon style={{ color: '#FBBC12' }} icon={ic_access_time} />
                  {` ${moment(jobpost.to[0]?.dateTime, 'DD-MM-YYYY HH:mm').add(543, 'year').format('LLL')}`}
                </span>
              </div>
            </div>
          ),
        },
        {
          key: jobpost.weight,
          content: <span>{jobpost.weight}</span>,
        },
      ],
    };
  });
};
