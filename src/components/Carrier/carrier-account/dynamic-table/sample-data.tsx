import React from 'react';
import { Button } from '@paljs/ui/Button';
import { Icon } from 'react-icons-kit';
import { edit } from 'react-icons-kit/fa/edit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import moment from 'moment';
import { DateFormat } from '../../../simple-data';
import 'moment/locale/th';
moment.locale('th');
interface Carrier {
  id: number;
  fullname: string;
  phoneNumber: string;
  registerDate: string;
  email: string;
  jobCount: number;
  truckCount: number;
  member_type?: string;
  date_approve?: string;
  sales_code?: string;
}

function sortByDate(input: string) {
  return moment(input, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll');
}

const headerContent = (value: string) => {
  return <span style={{ textAlign: 'center' }}>{value}</span>;
};

const numberContent = (num: number | string) => {
  return <div style={{ textAlign: 'right' }}>{num}</div>;
};

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        // content: headerContent('ID'),
        content: 'ID',
        isSortable: true,
        width: withWidth ? 5 : undefined,
      },
      {
        key: 'phone',
        // content: headerContent('Phone number'),
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 12 : undefined,
      },
      {
        key: 'full_name',
        // content: headerContent('Full name'),
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'email',
        // content: headerContent('Email'),
        content: 'Email',
        shouldTruncate: true,
      },
      {
        key: 'register_date',
        // content: headerContent('Register Date'),
        content: 'Register Date',
        shouldTruncate: true,
      },
      {
        key: 'job_count',
        // content: headerContent('Job Count'),
        content: 'Job Count',
        shouldTruncate: true,
      },
      {
        key: 'truck_count',
        // content: headerContent('Truck Count'),
        content: 'Truck Count',
        shouldTruncate: true,
      },
      {
        key: 'action',
        // content: headerContent('Action'),
        content: 'Action',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

export const createRow = (carriers: any, language: string) => {
  return carriers.map((carrier: Carrier, index: number) => ({
    key: `row-${index}-${carrier.id}`,
    cells: [
      {
        key: carrier.id,
        content: index + 1,
      },
      {
        key: carrier.phoneNumber,
        content: carrier.phoneNumber || '-',
      },
      {
        key: carrier.fullname,
        content: carrier.fullname || '-',
      },
      {
        key: carrier.email,
        content: carrier.email || '-',
      },
      {
        key: sortByDate(carrier.registerDate),
        content: DateFormat(carrier.registerDate, language),
      },
      {
        key: carrier.jobCount,
        content: numberContent(carrier.jobCount),
      },
      {
        key: carrier.truckCount,
        content: numberContent(carrier.truckCount),
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
};
