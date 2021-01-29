import React from 'react';
import { momentFormat } from '../../../simple-data';

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
        key: 'driver_licens_number',
        content: "Driver's license number",
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

export const createRow = (drivers: any, language: string) => {
  return drivers.map((driver: any, index: number) => {
    let status = 'Pending';
    if (driver.approveStatus === 1) {
      if (language === 'en') status = 'Approved';
      else status = 'อนุมัติแล้ว';
    } else {
      if (language === 'th') status = 'อยู่ระหว่างการดำเนินการ';
    }
    return {
      key: `row-${index}-${driver.id}`,
      cells: [
        {
          key: driver.id,
          content: <span style={{ padding: '10px 0px', color: '#FBBC12', fontWeight: 'bold' }}>{driver.id}</span>,
        },
        {
          key: driver.phoneNumber,
          content: driver.phoneNumber,
        },
        {
          key: driver.fullname,
          content: driver.fullname,
        },
        {
          key: driver.driverLicenseNumber,
          content: driver.driverLicenseNumber,
        },
        {
          key: status,
          content: status,
        },
        {
          key: momentFormat(driver.createdAt, language),
          content: momentFormat(driver.createdAt, language),
        },
      ],
    };
  });
};
