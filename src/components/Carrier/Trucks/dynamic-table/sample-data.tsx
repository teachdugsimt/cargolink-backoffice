import React from 'react';
import moment from 'moment';

import { trucks } from './trucks';

interface Truck {
  id: number;
  name: string;
  plate_number: string;
  type: string;
  weigth: number;
  carrier_name: string;
  register_date: string;
}

function sortByDate(input: string) {
  return moment(input, 'DD-MM-YYYY HH:mm').format('YYYYMMDDHHmm');
}

export const caption = `Results found: ${trucks.length}`;

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
        key: 'name',
        content: 'Truck brand name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'plate_number',
        content: 'Truck plate number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'type',
        content: 'Truck type',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'weigth',
        content: 'Weigth capacity',
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
        key: 'register_date',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = trucks.map((truck: Truck, index: number) => ({
  key: `row-${index}-${truck.id}`,
  cells: [
    {
      key: truck.id,
      content: truck.id,
    },
    {
      key: truck.name,
      content: truck.name,
    },
    {
      key: truck.plate_number,
      content: truck.plate_number,
    },
    {
      key: truck.type,
      content: truck.type,
    },
    {
      key: truck.weigth,
      content: truck.weigth,
    },
    {
      key: truck.carrier_name,
      content: truck.carrier_name,
    },
    {
      key: sortByDate(truck.register_date),
      content: truck.register_date,
    },
  ],
}));
