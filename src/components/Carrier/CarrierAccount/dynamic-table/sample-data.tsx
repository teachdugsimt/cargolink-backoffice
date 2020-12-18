import React from 'react';
import { Button, ButtonLink } from '@paljs/ui/Button';

import { carriers } from './carriers';

import { Icon } from 'react-icons-kit';
import { edit } from 'react-icons-kit/fa/edit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import moment from 'moment';

interface Carrier {
  id: number;
  full_name: string;
  member_type: string;
  phone: string;
  register_date: string;
  sales_code: string;
  date_approve: string;
}

function sortByDate(input: string) {
  return moment(input, 'DD-MM-YYYY HH:mm').format('ll');
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

export const caption = `Results found: ${carriers.length}`;

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        width: withWidth ? 5 : undefined,
      },
      {
        key: 'phone',
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 12 : undefined,
      },
      {
        key: 'full_name',
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'member_type',
        content: 'Member Type',
        shouldTruncate: true,
      },
      {
        key: 'register_date',
        content: 'Register Date',
        shouldTruncate: true,
      },
      {
        key: 'date_approval',
        content: 'Approve Date',
        shouldTruncate: true,
      },
      {
        key: 'sales_code',
        content: 'Sales code',
        shouldTruncate: true,
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

export const rows = carriers.map((carrier: Carrier, index: number) => ({
  key: `row-${index}-${carrier.id}`,
  cells: [
    {
      key: carrier.id,
      content: carrier.id,
    },
    {
      key: carrier.phone,
      content: carrier.phone,
    },
    {
      key: carrier.full_name,
      content: carrier.full_name,
    },
    {
      key: carrier.member_type,
      content: carrier.member_type,
    },
    {
      key: sortByDate(carrier.register_date),
      content: moment(carrier.register_date, 'DD-MM-YYYY HH:mm').format('ll'),
    },
    {
      key: carrier.date_approve,
      content: carrier.date_approve,
    },
    {
      key: carrier.sales_code,
      content: carrier.sales_code,
    },
    {
      key: carrier.id,
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
