import React from 'react';
import styled from 'styled-components';
import { momentFormatDateTime } from '../../simple-data';
import { IJobNull } from '../../../stores/job-store';
import { IJob } from '../../../services/job-api';
import { TFunction } from 'i18next';
import { IProductType } from '../../../services/product-type-api';
import { findProvince } from '../../../utils';

export const sortable: any = {
  id: true, //! Note that: DESC = true, ASC = fasle
  productName: true,
  companyName: true,
  productTypeId: true,
  route: true,
  weight: true,
  status: true,
};

export const createTableHeader = () => ({
  cells: [
    {
      key: 'id',
      content: 'Job No.',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'productType',
      content: 'Product Type',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'productName',
      content: 'Product Name',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'price',
      content: 'Price',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'priceType',
      content: 'Price Type',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'route',
      content: 'Route',
      shouldTruncate: true,
    },
    {
      key: 'owner',
      content: 'Owner',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'status',
      content: 'Status',
      shouldTruncate: true,
      isSortable: true,
    },
  ],
});

const jobStatus: any = {
  jobStatus1: 'OPEN',
  jobStatus3: 'IN-PROGRESS',
  jobStatus4: 'IN-PROGRESS',
  jobStatus7: 'COMPLETED',
  jobStatus9: 'IN-PROGRESS',
  jobStatus17: 'IN-PROGRESS',
  jobStatus20: 'IN-PROGRESS',
  jobStatus21: 'IN-PROGRESS',
  jobStatus23: 'IN-PROGRESS',
};

export const tableHeaders = createTableHeader();

export const createTableRows = (
  jobs: (IJob | IJobNull)[],
  products: IProductType[],
  language: string,
  t: TFunction,
  onDetail: (id: string) => any,
) => {
  return jobs.map((job, index) => {
    const productType = products.length && products.find((prod) => prod.id === job.productTypeId);
    const typeName = productType ? productType.name : '';
    let status = jobStatus[`jobStatus${job.status}`];
    if (!status) status = job.status;
    const priceType = ((priceType: 'PER_TRIP' | 'PER_TON' | null) => {
      switch (priceType) {
        case 'PER_TRIP':
          return t('perTrip');
        case 'PER_TON':
          return t('perTon');
        default:
          return null;
      }
    })(job.priceType);
    return {
      key: `row-${index}-${job.id}`,
      cells: [
        {
          key: job.id,
          content: (
            <span onClick={() => onDetail(job.id || '')} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              {job.id}
            </span>
          ),
        },
        {
          key: job.productTypeId,
          content: typeName || '-',
        },
        {
          key: job.productName,
          content: job.productName || '-',
        },
        {
          key: job.price,
          content: job.price || '-',
        },
        {
          key: job.priceType,
          content: priceType || '-',
        },
        {
          key: job.from?.name,
          content: (
            <Address>
              <span className="from">{findProvince(job.from?.name, language) || '<No Address>'}</span>
              <span className="arrow">{'=>'}</span>
              {job.to?.length ? <span className="to">{job.to[0]?.name}</span> : '<No Address>'}
              <span className="dot">{job?.to?.length > 1 ? '...' : ''}</span>
              <span className="fTime">{`${
                job.from?.dateTime ? momentFormatDateTime(job.from?.dateTime, language) : '-'
              }`}</span>
              <span className="tTime">
                {job.to?.length ? momentFormatDateTime(job.to[0]?.dateTime, language) : '-'}
              </span>
            </Address>
          ),
        },
        {
          key: job.owner?.fullName,
          content: job.owner?.fullName || '-',
        },
        {
          key: t(status),
          content: t(status),
        },
      ],
    };
  });
};

const Address = styled.div`
  display: grid;
  grid-template-columns: 1fr 20px 1fr 10px;
  grid-template-areas:
    'from arrow to dot'
    'fTime arrow tTime dot';
  gap: 2;

  .from {
    grid-area: from;
  }
  .to {
    grid-area: to;
  }
  .fromTime {
    grid-area: fTime;
  }
  .toTime {
    grid-area: tTime;
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
