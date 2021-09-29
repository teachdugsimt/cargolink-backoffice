import React from 'react';
import { ITruck } from '../../services/truck-api';
import { ITruckNull } from '../../stores/truck-store';
import images from '../Themes/images';
import moment from 'moment';
import 'moment/locale/th';
moment.locale('th');

import { Button } from '@paljs/ui/Button';
import { momentFormat } from '../simple-data';
import { TFunction } from 'i18next';
import { ITruckType } from '../../services/truck-type-api';
import { TruckTypeApi } from '../../services';

export const Sortable = {
  id: true, //! Note that: DESC = true, ASC = false
  workingZones: true,
  registrationNumber: true,
  truckType: true,
  loadingWeight: true,
  stallHeight: true,
  approveStatus: true,
  createdAt: true,
};

export const createTableHeader = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'mobileNo',
        content: 'Phone No.',
        isSortable: true,
        width: '150px',
      },
      {
        owner: 'owner',
        content: 'Owner',
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
        key: 'stallHeight',
        content: 'Stall height',
        shouldTruncate: true,
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
        key: 'createdAt',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'id-encode',
        content: 'ID',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const tableHeader = createTableHeader(true);

function formatPhoneNumber(phoneNumberString: string) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(66|)?(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? '+66 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return phoneNumberString;
}

export const createTableRows = async (
  trucks: (ITruck | ITruckNull)[],
  regions: any[],
  t: TFunction,
  loginStore: any,
  onDetail: (id: string) => any,
) => {
  let truckTypes: ITruckType[] = [];
  try {
    truckTypes = (await TruckTypeApi.getTruckTypes()).data;
  } catch (error) {
    console.error('get truck types error', error);
  }
  const rows = trucks.map((truck, index) => {
    const zones =
      truck.workingZones &&
      truck.workingZones.map((zone) => {
        const zoneFromRegion = regions && regions.find((region) => region.id === zone.region);
        if (zoneFromRegion) return zoneFromRegion.name;
        return '';
      });
    const truckType = truckTypes.find((type) => type.id == (truck as ITruck)?.truckType);
    const stallHeight = ((stallHeight: string | null) => {
      switch (stallHeight) {
        case 'HEIGHT':
          return t('HIGH');
        case 'MEDIUM':
          return t('MEDIUM');
        case 'LOW':
          return t('LOW');
        default:
          return '-';
      }
    })(truck.stallHeight);
    return {
      key: `row-${index}-${truck.id}`,
      cells: [
        {
          key: truck.owner?.mobileNo,
          content: formatPhoneNumber(truck.owner?.mobileNo),
        },
        {
          key: truck.owner?.fullName,
          content: truck.owner?.fullName || '-',
        },
        {
          key: truckType?.id || '-',
          content: truckType?.name || '-',
        },
        {
          key: truck.stallHeight ? truck.stallHeight : '',
          content: stallHeight,
        },
        {
          key: zones ? zones.join('') : '',
          content: zones ? zones.join(', ') : '-',
        },
        {
          key: truck.registrationNumber ? truck.registrationNumber.join('') : '',
          content: truck.registrationNumber ? truck.registrationNumber.join(', ') : '',
        },
        {
          key: truck.createdAt ? momentFormat(truck.createdAt, loginStore.language) : '',
          content: truck.createdAt ? momentFormat(truck.createdAt, loginStore.language) : '',
        },
        {
          key: 'id-encode',
          content: truck.id || '',
          width: 0,
          colSpan: 0,
        },
      ],
    };
  });
  return rows;
};
