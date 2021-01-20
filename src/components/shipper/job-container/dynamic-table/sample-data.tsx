import React from 'react';

import { Button, ButtonLink } from '@paljs/ui/Button';
import styled from 'styled-components';

import { jobpost } from './jobpost';

import { Icon } from 'react-icons-kit';
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';
import moment from 'moment';
import 'moment/locale/th';
moment.locale('th');
import vegetables from '../../../../images/vegetables.png';
import charcoal from '../../../../images/charcoal.png';
import woods from '../../../../images/woods.png';
interface Jobpost {
  id: number;
  job_no: string;
  freight: number;
  name_shipper: string;
  type: string;
  route: {
    from: {
      address: string;
      date: string;
    };
    to: {
      address: string;
      date: string;
    };
  };
  valid_unit: string;
  status: string;
}

// function sortByDate(input: string) {
//   return moment(input).format('LLL');
// }

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const nf = new Intl.NumberFormat();

export const caption = `Results found: ${jobpost.length}`;

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
        width: withWidth ? 15 : undefined,
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

export const createRow = (jobs: any) => {
  return jobs.map((jobpost: any, index: number) => ({
    key: `row-${index}-${jobpost.id}`,
    cells: [
      {
        key: jobpost.id,
        content: <span style={{ padding: '10px 0px', color: '#f8bc18', fontWeight: 'bold' }}>{jobpost.id}</span>,
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
        key: jobpost.productTypeId,
        content: jobpost.productTypeId,
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
                <Icon style={{ color: '#f8bc18' }} icon={ic_access_time} />
                {` ${moment(jobpost.from?.dateTime, 'DD-MM-YYYY HH:mm').add(543, 'year').format('LLL')}`}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
              <span style={{ padding: 2, marginTop: 8 }}>
                <span style={{ fontWeight: 'bold' }}>To: </span>
                {`${jobpost.to[0]?.name}`}
              </span>
              <span>
                <Icon style={{ color: '#f8bc18' }} icon={ic_access_time} />
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
  }));
};
