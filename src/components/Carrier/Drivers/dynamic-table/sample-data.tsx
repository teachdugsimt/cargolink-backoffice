import React from 'react';
import moment from 'moment';

import { drivers } from './drivers';
import 'moment/locale/th';
moment.locale('th');
interface Driver {
  id: number;
  mobile_number: string;
  name: string;
  otp: number;
  carrier_name: string;
  status: string;
  register_date: string;
}
function sortByDate(input: string) {
  return moment(input, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll');
}

export const caption = `Results found: ${drivers.length}`;

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'Id',
        isSortable: true,
        // width: withWidth ? 5 : undefined,
      },
      {
        key: 'mobile_number',
        content: 'Mobile number of driver',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'name',
        content: "Driver's name",
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'otp',
        content: 'OTP',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'carrier_name',
        content: "Carrier's name",
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'status',
        content: 'Carrier status',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'register_date',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = drivers.map((driver: Driver, index: number) => ({
  key: `row-${index}-${driver.id}`,
  cells: [
    {
      key: driver.id,
      content: driver.id,
    },
    {
      key: driver.mobile_number,
      content: driver.mobile_number,
    },
    {
      key: driver.name,
      content: driver.name,
    },
    {
      key: driver.otp,
      content: driver.otp,
    },
    {
      key: driver.carrier_name,
      content: driver.carrier_name,
    },
    {
      key: driver.status,
      content: driver.status,
    },
    {
      key: sortByDate(driver.register_date),
      content: moment(driver.register_date, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll'),
    },
  ],
}));
