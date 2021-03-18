import React from 'react';
import { Button, ButtonLink } from '@paljs/ui/Button';
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

const dateFormat = (date: string) => {
  const d = moment(date, 'DD-MM-YYYY HH:mm');
  return d.isValid() ? d.add(543, 'year').format('ll') : '';
};

const headerContent = (value: string) => {
  return <div style={{ textAlign: 'center' }}>{value}</div>;
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
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'phone',
        // content: headerContent('Phone number'),
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'full_name',
        // content: headerContent('Full name'),
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'emaiil',
        // content: headerContent('Email'),
        content: 'Email',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'register_date',
        // content: headerContent('Register Date'),
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'job_count',
        // content: headerContent('Job Count'),
        content: 'Job Count',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'truck_count',
        // content: headerContent('Truck Count'),
        content: 'Truck Count',
        shouldTruncate: true,
        isSortable: true,
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

export const createRow = (shippers: any, language: string) => {
  return shippers.map((shipper: Shipper, index: number) => ({
    key: `row-${index}-${shipper.id}`,
    cells: [
      {
        key: shipper.id,
        content: index + 1,
      },
      {
        key: shipper.phoneNumber,
        content: shipper.phoneNumber || '-',
      },
      {
        key: shipper.fullName,
        content: shipper.fullName || '-',
      },
      {
        key: shipper.email,
        content: shipper.email || '-',
      },
      {
        key: sortByDate(shipper.registerDate),
        content: dateFormat(shipper.registerDate),
      },
      {
        key: shipper.jobCount,
        content: numberContent(shipper.jobCount),
      },
      {
        key: shipper.truckCount,
        content: numberContent(shipper.truckCount),
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
