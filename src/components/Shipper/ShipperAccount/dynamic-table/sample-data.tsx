import React from 'react';

import { Button, ButtonLink } from '@paljs/ui/Button';
import styled from 'styled-components';

import { shippers } from './shippers';

import { Icon } from 'react-icons-kit';
import { edit } from 'react-icons-kit/fa/edit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';

interface Shipper {
  id: number;
  full_name: string;
  member_type: string;
  phone: string;
  register_date: string;
  date_approve: string;
  sales_code: string;
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}
const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

export const caption = `Results found: ${shippers.length}`;

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'phone',
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'full_name',
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'member_type',
        content: 'Member Type',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'register_date',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'date_approve',
        content: 'Date of approval',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'sales_code',
        content: 'Sales code',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'action',
        content: 'Action',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = shippers.map((shipper: Shipper, index: number) => ({
  key: `row-${index}-${shipper.id}`,
  cells: [
    {
      key: shipper.id,
      content: shipper.id,
    },
    {
      key: shipper.phone,
      content: shipper.phone,
    },
    {
      key: shipper.full_name,
      content: shipper.full_name,
    },
    {
      key: shipper.member_type,
      content: shipper.member_type,
    },
    {
      key: shipper.register_date,
      content: shipper.register_date,
    },
    {
      key: shipper.date_approve,
      content: shipper.date_approve,
    },
    {
      key: shipper.sales_code,
      content: shipper.sales_code,
    },
    {
      key: shipper.id,
      content: (
        <div>
          <Button appearance="ghost" status="Basic" size="Small">
            <Icon icon={edit} />
          </Button>
          <Button appearance="ghost" status="Basic" size="Small">
            <Icon icon={ic_delete} />
          </Button>
        </div>
      ),
    },
  ],
}));
