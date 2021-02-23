import React from 'react';
import moment from 'moment';
import 'moment/locale/th';
moment.locale('th');

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        // width: withWidth ? 5 : undefined,
      },
      {
        key: 'working_zones',
        content: 'Working Zones',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'truck_plate_number',
        content: 'Truck plate number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'truck_type',
        content: 'Truck type',
        shouldTruncate: true,
        isSortable: false,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'weigth_capacity',
        content: 'Weigth capacity',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'stall_height',
        content: 'Stall height',
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
        key: 'register_date',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const head = createHead(true);
