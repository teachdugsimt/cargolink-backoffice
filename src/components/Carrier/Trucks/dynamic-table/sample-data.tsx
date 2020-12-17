import React from 'react';
import moment from 'moment';

import { trucks } from './trucks';
import Truck30 from '../../../../images/Truck30.png';
import Truck9 from '../../../../images/Truck9.png';
import Truck20 from '../../../../images/Truck20.png';
import Truck12 from '../../../../images/Truck12.png';

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
        // width: withWidth ? 5 : undefined,
      },
      {
        key: 'plate_number',
        content: 'Truck plate number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'type',
        content: 'Truck type',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
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
      content: (
        <div>
          {truck.type == 'Truck30' ? (
            <img style={{ width: '50%' }} src={Truck30} />
          ) : truck.type == 'Truck9' ? (
            <img style={{ width: '50%' }} src={Truck9} />
          ) : truck.type == 'Truck20' ? (
            <img style={{ width: '50%' }} src={Truck20} />
          ) : (
            <img style={{ width: '50%' }} src={Truck12} />
          )}
        </div>
      ),
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
