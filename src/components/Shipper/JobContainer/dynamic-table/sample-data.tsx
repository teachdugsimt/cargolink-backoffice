import React from 'react';

import { Button, ButtonLink } from '@paljs/ui/Button';
import styled from 'styled-components';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import { jobpost } from './jobpost';

import { Icon } from 'react-icons-kit';
import { edit } from 'react-icons-kit/fa/edit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';

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

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
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
        key: 'valid_unit',
        content: 'Valid unit',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'status',
        content: 'Status',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = jobpost.map((jobpost: Jobpost, index: number) => ({
  key: `row-${index}-${jobpost.id}`,
  cells: [
    {
      content: (
        <NameWrapper>
          <span style={{ padding: '10px 0px', color: '#f8bc18', fontWeight: 'bold' }}>{jobpost.job_no}</span>
          <Button status="Success" size="Tiny" shape="Round">{`Frieght: ${nf.format(jobpost.freight)} Baht`}</Button>
        </NameWrapper>
      ),
    },
    {
      content: jobpost.name_shipper,
    },
    {
      key: jobpost.type,
      content: (
        <div>
          {jobpost.type == 'vegetable' ? (
            <img style={{ width: '50%' }} src={vegetables} />
          ) : jobpost.type == 'carbon' ? (
            <img style={{ width: '50%' }} src={charcoal} />
          ) : (
            <img style={{ width: '50%' }} src={woods} />
          )}
        </div>
      ),
    },
    {
      content: (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              <span style={{ fontWeight: 'bold' }}>From: </span>
              {`${jobpost.route.from.address}`}
            </span>
            <span>
              <Icon style={{ color: '#f8bc18' }} icon={ic_access_time} />
              {` ${jobpost.route.from.date}`}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              <span style={{ fontWeight: 'bold' }}>To: </span>
              {`${jobpost.route.to.address}`}
            </span>
            <span>
              <Icon style={{ color: '#f8bc18' }} icon={ic_access_time} />
              {` ${jobpost.route.to.date}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      content: jobpost.valid_unit,
    },
    {
      content: jobpost.status,
    },
    // {
    //   key: createKey(president.pp),
    //   content: (
    //     <div>
    //       <Button appearance="ghost" status="Basic" size="Small">
    //         <Icon icon={edit} />
    //       </Button>
    //       <Button appearance="ghost" status="Basic" size="Small">
    //         <Icon icon={ic_delete} />
    //       </Button>
    //     </div>
    //   ),
    // },
  ],
}));
