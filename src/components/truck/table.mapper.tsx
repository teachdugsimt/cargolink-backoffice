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
        key: 'id',
        content: 'ID',
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
        owner: 'owner',
        content: 'Owner',
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

export const tableHeader = createTableHeader(true);

export const createTableRows = (
  trucks: (ITruck | ITruckNull)[],
  regions: any[],
  t: TFunction,
  loginStore: any,
  onDetail: (id: string) => any,
) => {
  const rows = trucks.map((truck, index) => {
    const zones =
      truck.workingZones &&
      truck.workingZones.map((zone) => {
        const zoneFromRegion = regions && regions.find((region) => region.id === zone.region);
        if (zoneFromRegion) return zoneFromRegion.name;
        return '';
      });
    const truckType = (truck as ITruck)?.truckType ? (truck as ITruck).truckType : null;
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
          key: truck.id,
          content: (
            <Button status="Control" onClick={() => onDetail(truck.id || '')}>
              <span style={{ padding: '10px 0px', color: '#FBBC12', fontWeight: 'bold' }}>{truck.id}</span>
            </Button>
          ),
        },
        {
          key: truckType,
          content: (
            <div>
              {truckType == 1 ? (
                <img style={{ height: 30 }} src={images.Truck1} />
              ) : truckType == 2 ? (
                <img style={{ height: 30 }} src={images.Truck2} />
              ) : truckType == 3 ? (
                <img style={{ height: 30 }} src={images.Truck3} />
              ) : truckType == 4 ? (
                <img style={{ height: 30 }} src={images.Truck4} />
              ) : truckType == 5 ? (
                <img style={{ height: 30 }} src={images.Truck5} />
              ) : truckType == 6 ? (
                <img style={{ height: 30 }} src={images.Truck6} />
              ) : truckType == 7 ? (
                <img style={{ height: 30 }} src={images.Truck7} />
              ) : truckType == 8 ? (
                <img style={{ height: 30 }} src={images.Truck8} />
              ) : truckType == 9 ? (
                <img style={{ height: 30 }} src={images.Truck9} />
              ) : truckType == 10 ? (
                <img style={{ height: 30 }} src={images.Truck10} />
              ) : truckType == 11 ? (
                <img style={{ height: 30 }} src={images.Truck11} />
              ) : truckType == 12 ? (
                <img style={{ height: 30 }} src={images.Truck12} />
              ) : truckType == 13 ? (
                <img style={{ height: 30 }} src={images.Truck13} />
              ) : truckType == 14 ? (
                <img style={{ height: 30 }} src={images.Truck14} />
              ) : truckType == 15 ? (
                <img style={{ height: 30 }} src={images.Truck15} />
              ) : truckType == 16 ? (
                <img style={{ height: 30 }} src={images.Truck16} />
              ) : truckType == 17 ? (
                <img style={{ height: 30 }} src={images.Truck17} />
              ) : truckType == 18 ? (
                <img style={{ height: 30 }} src={images.Truck18} />
              ) : truckType == 19 ? (
                <img style={{ height: 30 }} src={images.Truck19} />
              ) : truckType == 20 ? (
                <img style={{ height: 30 }} src={images.Truck20} />
              ) : truckType == 21 ? (
                <img style={{ height: 30 }} src={images.Truck21} />
              ) : truckType == 22 ? (
                <img style={{ height: 30 }} src={images.Truck22} />
              ) : truckType == 23 ? (
                <img style={{ height: 30 }} src={images.Truck23} />
              ) : truckType == 24 ? (
                <img style={{ height: 30 }} src={images.Truck24} />
              ) : truckType == 25 ? (
                <img style={{ height: 30 }} src={images.Truck25} />
              ) : truckType == 26 ? (
                <img style={{ height: 30 }} src={images.Truck26} />
              ) : truckType == 27 ? (
                <img style={{ height: 30 }} src={images.Truck27} />
              ) : truckType == 28 ? (
                <img style={{ height: 30 }} src={images.Truck28} />
              ) : truckType == 29 ? (
                <img style={{ height: 30 }} src={images.Truck29} />
              ) : truckType == 30 ? (
                <img style={{ height: 30 }} src={images.Truck30} />
              ) : truckType == 31 ? (
                <img style={{ height: 30 }} src={images.Truck31} />
              ) : truckType == 32 ? (
                <img style={{ height: 30 }} src={images.Truck32} />
              ) : truckType == 33 ? (
                <img style={{ height: 30 }} src={images.Truck33} />
              ) : truckType == 34 ? (
                <img style={{ height: 30 }} src={images.Truck34} />
              ) : truckType == 35 ? (
                <img style={{ height: 30 }} src={images.Truck35} />
              ) : truckType == 36 ? (
                <img style={{ height: 30 }} src={images.Truck36} />
              ) : (
                <></>
              )}
            </div>
          ),
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
          key: truck.owner?.fullName,
          content: truck.owner?.fullName || '-',
        },
        {
          key: truck.createdAt ? momentFormat(truck.createdAt, loginStore.language) : '',
          content: truck.createdAt ? momentFormat(truck.createdAt, loginStore.language) : '',
        },
      ],
    }
  });
  return rows;
};
