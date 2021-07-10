import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';
import images from '../../Themes/images';
import { momentFormatDateTime } from '../../simple-data';
import { Button } from '@paljs/ui/Button';
import { IJobNull } from '../../../stores/job-store';
import { IJob } from '../../../services/job-api';
import { TFunction } from 'i18next';
import { IProductType } from '../../../services/product-type-api';

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
            <div style={{ borderBottom: '2px solid #253858' }}>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                  <img src={images.pinDrop2} style={{ width: 18 }} />
                  <span style={{ fontWeight: 'bold', margin: '0 5px' }}>From:</span>
                  {`${job.from?.name || '-'}`}
                </span>
                <span style={{ padding: '2px 0', display: 'flex' }}>
                  <div style={{ border: '1px dashed black', margin: '0 13px 0 10px' }} />
                  <Icon style={{ color: '#FBBC12', marginRight: 5 }} icon={ic_access_time} />
                  {` ${job.from?.dateTime ? momentFormatDateTime(job.from?.dateTime, language) : '-'}`}
                </span>
              </div>
              <div style={{ marginBottom: 5 }}>
                {job &&
                  job.to &&
                  job.to.map((e: any, i: number) => {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }} key={i}>
                        <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                          {i === 0 ? <img src={images.pinDrop} style={{ width: 18 }} /> : <div style={{ width: 18 }} />}
                          <span style={{ fontWeight: 'bold', margin: '0 5px' }}>To:</span>
                          {`${e?.name || '-'}`}
                        </span>
                        <span style={{ padding: 2, marginLeft: 23 }}>
                          <Icon style={{ color: '#FBBC12' }} icon={ic_access_time} />
                          {` ${e?.dateTime ? momentFormatDateTime(e?.dateTime, language) : '-'}`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
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
    }
  });
}