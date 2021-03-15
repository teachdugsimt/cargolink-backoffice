import React from 'react';

import { Button, ButtonLink } from '@paljs/ui/Button';

import { shippers } from './shippers';
import moment from 'moment';

import { Icon } from 'react-icons-kit';
import { edit } from 'react-icons-kit/fa/edit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import 'moment/locale/th';
moment.locale('th');
interface Shipper {
  id: number;
  fullName: string;
  phoneNumber: string;
  registerDate: string;
  email: string;
  jobCount: number;
  truckCount: number;
  member_type?: string;
  date_approve?: string;
  sales_code?: string;
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

function sortByDate(input: string) {
  return moment(input, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll');
}

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

export const createRow = (shippers: any, language: string) => {
  return shippers.map((shipper: Shipper, index: number) => ({
    key: `row-${index}-${shipper.id}`,
    cells: [
      {
        key: shipper.id,
        content: shipper.id,
      },
      {
        key: shipper.phoneNumber,
        content: shipper.phoneNumber,
      },
      {
        key: shipper.phoneNumber,
        content: shipper.phoneNumber,
      },
      {
        key: shipper.member_type,
        content: shipper.member_type,
      },
      {
        key: sortByDate(shipper.registerDate),
        content: moment(shipper.registerDate, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll'),
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
};
