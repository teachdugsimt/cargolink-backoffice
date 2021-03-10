import React from 'react';
import { Button, ButtonLink } from '@paljs/ui/Button';
import moment from 'moment';

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

function sortByDate(input: string) {
  return moment(input, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll');
}

export const sortabled: any = {
  phoneNumber: true, //! Note that: DESC = true, ASC = fasle
  fullName: true,
  registerDate: true,
  jobCount: true,
  truckCount: true,
};

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      // {
      //   key: 'id',
      //   content: 'Id',
      //   isSortable: true,
      //   width: withWidth ? 5 : undefined,
      // },
      {
        key: 'phoneNumber',
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'fullName',
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'registerDate',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'jobCount',
        content: 'job count',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'truckCount',
        content: 'truck count',
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

export const createRow = (users: any, t: any) => {
  return users.map((user: any, index: number) => {
    return {
      key: `row-${index}-${user.phoneNumber}`,
      cells: [
        // {
        //   key: user.id,
        //   content: user.id,
        // },
        {
          key: user.phoneNumber,
          content: user.phoneNumber,
        },
        {
          key: user.fullName,
          content: user.fullName,
        },
        {
          key: sortByDate(user.registerDate),
          content: sortByDate(user.registerDate),
        },
        {
          key: user.jobCount,
          content: user.jobCount,
        },
        {
          key: user.truckCount,
          content: user.truckCount,
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
    };
  });
};
