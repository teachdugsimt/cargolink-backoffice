import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';
import images from '../../../Themes/images';
import { momentFormatDateTime } from '../../../simple-data';

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
      {
        key: 'status',
        content: 'Status',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const head = createHead(true);

const jobStatus = {
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

export const createRow = (jobs: any, products: any, language: string, t: any) => {
  console.log('jobs:>>', jobs);
  return jobs.map((job: any, index: number) => {
    const productType = products?.length && products.find((prod: any) => prod.id === job.productTypeId);
    const typeName = productType ? productType.name : '';
    let status = jobStatus[`jobStatus${job.status}`];
    if (!status) status = job.status;
    return {
      key: `row-${index}-${job.id}`,
      cells: [
        {
          key: job.id,
          content: <span style={{ padding: '10px 0px', color: '#FBBC12', fontWeight: 'bold' }}>{job.id}</span>,
        },
        {
          key: job.productName,
          content: job.productName,
        },
        {
          key: job.owner?.companyName,
          content: job.owner?.companyName,
        },
        {
          key: typeName,
          content: typeName,
        },
        {
          key: job.from?.name,
          content: (
            <div style={{ borderBottom: '2px solid #253858' }}>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                  <img src={images.pinDrop2} style={{ width: 18 }} />
                  <span style={{ fontWeight: 'bold', margin: '0 5px' }}>From:</span>
                  {`${job.from?.name}`}
                </span>
                <span style={{ padding: '2px 0', display: 'flex' }}>
                  <div style={{ border: '1px dashed black', margin: '0 13px 0 10px' }} />
                  <Icon style={{ color: '#FBBC12', marginRight: 5 }} icon={ic_access_time} />
                  {` ${momentFormatDateTime(job.from?.dateTime, language)}`}
                </span>
              </div>
              <div style={{ marginBottom: 5 }}>
                {job.to.map((e: any, i: number) => {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }} key={i}>
                      <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                        {i === 0 ? <img src={images.pinDrop} style={{ width: 18 }} /> : <div style={{ width: 18 }} />}
                        <span style={{ fontWeight: 'bold', margin: '0 5px' }}>To:</span>
                        {`${e?.name}`}
                      </span>
                      <span style={{ padding: 2, marginLeft: 23 }}>
                        <Icon style={{ color: '#FBBC12' }} icon={ic_access_time} />
                        {` ${momentFormatDateTime(e?.dateTime, language)}`}
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
    };
  });
};
