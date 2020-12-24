import React from 'react';
import { Button, ButtonLink } from '@paljs/ui/Button';
import moment from 'moment';

import { users } from './users';

import { Icon } from 'react-icons-kit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import 'moment/locale/th';
moment.locale('th');
interface User {
  id: number;
  full_name: string;
  status: string;
  phone: string;
  register_date: string;
  date_approve: string;
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

function sortByDate(input: string) {
  return moment(input, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll');
}

export const caption = `Results found: ${users.length}`;

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'Id',
        isSortable: true,
        width: withWidth ? 5 : undefined,
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
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'register_date',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'status',
        content: 'Status',
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
        key: 'action',
        content: 'Action',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = users.map((user: User, index: number) => ({
  key: `row-${index}-${user.id}`,
  cells: [
    {
      key: user.id,
      content: user.id,
    },
    {
      key: user.phone,
      content: user.phone,
    },
    {
      key: user.full_name,
      content: user.full_name,
    },
    {
      key: sortByDate(user.register_date),
      content: moment(user.register_date, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll'),
    },
    {
      key: user.status,
      content: user.status,
    },
    {
      key: sortByDate(user.date_approve),
      content: moment(user.date_approve, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll'),
    },
    {
      key: user.id,
      content: (
        <Button appearance="ghost" status="Basic" size="Small">
          <Icon icon={ic_delete} />
        </Button>
      ),
    },
  ],
}));
