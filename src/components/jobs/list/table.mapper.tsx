import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';
import images from '../../Themes/images';
import { momentFormatDateTime } from '../../simple-data';
import { Button } from '@paljs/ui/Button';
import { IJobNull } from '../../../stores/job-store';
import { IJob } from '../../../services/job-api';
import { TFunction } from 'i18next';

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
      key: 'productName',
      content: 'Product Name',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'companyName',
      content: 'Name of  shipper',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'productTypeId',
      content: 'Type of goods',
      shouldTruncate: true,
      isSortable: true,
    },
    {
      key: 'route',
      content: 'Route',
      shouldTruncate: true,
    },
    {
      key: 'weight',
      content: 'Weight',
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
  products: any,
  language: string,
  t: TFunction,
  onDetail: (id: string) => any,
) => {
  return jobs.map((job, index) => {
    const productType = products?.length && products.find((prod: any) => prod.id === job.productTypeId);
    const typeName = productType ? productType.name : '';
    let status = jobStatus[`jobStatus${job.status}`];
    if (!status) status = job.status;
    return {
      key: `row-${index}-${job.id}`,
      cells: [
        {
          key: job.id,
          content: (
            <Button status="Control" onClick={() => onDetail(job.id || '')}>
              <span style={{ padding: '10px 0px', color: '#FBBC12', fontWeight: 'bold' }}>{job.id}</span>
            </Button>
          ),
        },
        {
          key: job.productName,
          content: job.productName || '-',
        },
        {
          key: job.owner?.fullName,
          content: job.owner?.fullName || '-',
        },
        {
          key: typeName,
          content: typeName || '-',
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
          key: job.weight,
          content: job.weight,
        },
        {
          key: t(status),
          content: t(status),
        },
      ],
    }
  });
}