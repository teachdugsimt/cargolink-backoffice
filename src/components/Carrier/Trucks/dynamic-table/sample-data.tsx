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
      },
      {
        key: 'workingZones',
        content: 'Working Zones',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'registrationNumber',
        content: 'Truck plate number',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'truckType',
        content: 'Truck type',
        shouldTruncate: true,
        isSortable: false,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'loadingWeight',
        content: 'Weigth capacity',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'stallHeight',
        content: 'Stall height',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'approveStatus',
        content: 'Status',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'createdAt',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const head = createHead(true);
