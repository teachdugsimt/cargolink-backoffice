import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import TruckForm from './form-truck';
import moment from 'moment';
import images from '../../Themes/images';

import 'moment/locale/th';
moment.locale('th');

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
  return moment(input, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll');
}

const TruckForApproval: React.FC<{}> = observer(({}) => {
  const { carrierStore } = useMst();
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    carrierStore.getAllTrucksByCarrier();
  }, []);

  useEffect(() => {
    const trucks = JSON.parse(JSON.stringify(carrierStore.trucks_carrier));
    console.log('data :>>', trucks);

    const rows =
      trucks &&
      trucks.map((truck: any) => ({
        key: `row-${truck.id}`,
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
            key: truck.workingZones,
            content: (
              <div>
                <span>{truck.workingZones && truck.workingZones.region ? truck.workingZones.region : ''}</span>
                <span>{truck.workingZones && truck.workingZones.province ? truck.workingZones.province : ''}</span>
              </div>
            ),
          },
          {
            key: truck.registrationNumber.map((e) => e),
            content: truck.registrationNumber.map((e) => e),
          },
          {
            key: truck.truckType,
            content: (
              <div>
                {truck.truckType == 1 ? (
                  <img style={{ height: 30 }} src={images.Truck1} />
                ) : truck.truckType == 2 ? (
                  <img style={{ height: 30 }} src={images.Truck2} />
                ) : truck.truckType == 3 ? (
                  <img style={{ height: 30 }} src={images.Truck3} />
                ) : truck.truckType == 4 ? (
                  <img style={{ height: 30 }} src={images.Truck4} />
                ) : truck.truckType == 5 ? (
                  <img style={{ height: 30 }} src={images.Truck5} />
                ) : truck.truckType == 6 ? (
                  <img style={{ height: 30 }} src={images.Truck6} />
                ) : truck.truckType == 7 ? (
                  <img style={{ height: 30 }} src={images.Truck7} />
                ) : truck.truckType == 8 ? (
                  <img style={{ height: 30 }} src={images.Truck8} />
                ) : truck.truckType == 9 ? (
                  <img style={{ height: 30 }} src={images.Truck9} />
                ) : truck.truckType == 10 ? (
                  <img style={{ height: 30 }} src={images.Truck10} />
                ) : truck.truckType == 11 ? (
                  <img style={{ height: 30 }} src={images.Truck11} />
                ) : truck.truckType == 12 ? (
                  <img style={{ height: 30 }} src={images.Truck12} />
                ) : truck.truckType == 13 ? (
                  <img style={{ height: 30 }} src={images.Truck13} />
                ) : truck.truckType == 14 ? (
                  <img style={{ height: 30 }} src={images.Truck14} />
                ) : truck.truckType == 15 ? (
                  <img style={{ height: 30 }} src={images.Truck15} />
                ) : truck.truckType == 16 ? (
                  <img style={{ height: 30 }} src={images.Truck16} />
                ) : truck.truckType == 17 ? (
                  <img style={{ height: 30 }} src={images.Truck17} />
                ) : truck.truckType == 18 ? (
                  <img style={{ height: 30 }} src={images.Truck18} />
                ) : truck.truckType == 19 ? (
                  <img style={{ height: 30 }} src={images.Truck19} />
                ) : truck.truckType == 20 ? (
                  <img style={{ height: 30 }} src={images.Truck20} />
                ) : truck.truckType == 21 ? (
                  <img style={{ height: 30 }} src={images.Truck21} />
                ) : truck.truckType == 22 ? (
                  <img style={{ height: 30 }} src={images.Truck22} />
                ) : truck.truckType == 23 ? (
                  <img style={{ height: 30 }} src={images.Truck23} />
                ) : truck.truckType == 24 ? (
                  <img style={{ height: 30 }} src={images.Truck24} />
                ) : truck.truckType == 25 ? (
                  <img style={{ height: 30 }} src={images.Truck25} />
                ) : truck.truckType == 26 ? (
                  <img style={{ height: 30 }} src={images.Truck26} />
                ) : truck.truckType == 27 ? (
                  <img style={{ height: 30 }} src={images.Truck27} />
                ) : truck.truckType == 28 ? (
                  <img style={{ height: 30 }} src={images.Truck28} />
                ) : truck.truckType == 29 ? (
                  <img style={{ height: 30 }} src={images.Truck29} />
                ) : truck.truckType == 30 ? (
                  <img style={{ height: 30 }} src={images.Truck30} />
                ) : truck.truckType == 31 ? (
                  <img style={{ height: 30 }} src={images.Truck31} />
                ) : truck.truckType == 32 ? (
                  <img style={{ height: 30 }} src={images.Truck32} />
                ) : truck.truckType == 33 ? (
                  <img style={{ height: 30 }} src={images.Truck33} />
                ) : truck.truckType == 34 ? (
                  <img style={{ height: 30 }} src={images.Truck34} />
                ) : truck.truckType == 35 ? (
                  <img style={{ height: 30 }} src={images.Truck35} />
                ) : truck.truckType == 36 ? (
                  <img style={{ height: 30 }} src={images.Truck36} />
                ) : (
                  <></>
                )}
              </div>
            ),
          },
          {
            key: truck.loadingWeight,
            content: truck.loadingWeight,
          },
          {
            key: truck.approveStatus,
            content: truck.approveStatus,
          },
          {
            key: sortByDate(truck.createdAt),
            content: moment(truck.createdAt, 'DD-MM-YYYY HH:mm').add(543, 'year').format('ll'),
          },
        ],
      }));
    setRowData(rows);
  }, [carrierStore.trucks_carrier]);

  return <TruckForm rows={rowData} />;
});
export default TruckForApproval;
