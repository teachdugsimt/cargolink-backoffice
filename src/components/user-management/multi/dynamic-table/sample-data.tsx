import React from 'react';
import { Button, ButtonLink } from '@paljs/ui/Button';
import moment from 'moment';

import { Icon } from 'react-icons-kit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import { DateFormat } from '../../../simple-data';

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

export const createRow = (users: any, language: string) => {
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
          key: moment(user.registerDate, 'DD-MM-YYYY HH:mm').format('YYYYMMDDHHmm'),
          content: DateFormat(user.registerDate, language),
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
