import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import TruckForm from './truck-form';
import images from '../../Themes/images';
import { defaultAlertSetting, momentFormat } from '../../simple-data';
import { useTranslation } from 'react-i18next';
import Link from '@material-ui/core/Link';

const TruckForApproval: React.FC<{}> = observer(({}) => {
  const { carrierStore, loginStore, masterTypeStore } = useMst();
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

  useEffect(() => {
    carrierStore.clearCarrierStore();
    carrierStore.getAllTrucksByCarrier({ page: 0 });
    masterTypeStore.getAllRegion();
  }, []);

  useEffect(() => {
    const { loading } = carrierStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: t('LOADING'),
    });
  }, [carrierStore.loading]);

  useEffect(() => {
    const { error_response } = carrierStore;
    if (error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: error_response.title || '',
        content: error_response.content || '',
      });
    }
  }, [carrierStore.error_response]);

  useEffect(() => {
    const trucks = JSON.parse(JSON.stringify(carrierStore.trucks_carrier));
    const regions = JSON.parse(JSON.stringify(masterTypeStore.regions));
    if (trucks?.content && regions?.length) {
      const rows = trucks.content.map((truck: any, index: number) => {
        const zones =
          truck.workingZones &&
          truck.workingZones.map((z: any) => {
            const zone = regions && regions.find((r: any) => r.id === z.region);
            if (zone) return zone.name;
            return '';
          });
        return {
          key: `row-${index}-${truck.id}`,
          cells: [
            {
              key: truck.id,
              content: (
                <Link href="/truck-detail">
                  <span style={{ padding: '10px 0px', color: '#FBBC12', fontWeight: 'bold' }}>{truck.id}</span>
                </Link>
              ),
            },
            {
              key: zones ? zones.join('') : '',
              content: zones ? zones.join(', ') : '',
            },
            {
              key: truck.registrationNumber ? truck.registrationNumber.join('') : '',
              content: truck.registrationNumber ? truck.registrationNumber.join(', ') : '',
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
              key: truck.stallHeight ? truck.stallHeight : '',
              content: truck.stallHeight ? <span>{t(`${truck.stallHeight}`)}</span> : '',
            },
            {
              key: truck.approveStatus,
              content: truck.approveStatus,
            },
            {
              key: truck.createdAt ? momentFormat(truck.createdAt, loginStore.language) : '',
              content: truck.createdAt ? momentFormat(truck.createdAt, loginStore.language) : '',
            },
          ],
        };
      });
      setRowData(rows);
    }
  }, [
    carrierStore.trucks_carrier,
    carrierStore.trucks_carrier?.reRender,
    carrierStore.trucks_carrier?.content?.length,
    masterTypeStore.regions,
  ]);

  return <TruckForm rows={rowData} alertSetting={alertSetting} />;
});
export default TruckForApproval;
