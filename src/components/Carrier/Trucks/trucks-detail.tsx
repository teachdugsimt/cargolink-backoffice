import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import images from '../../Themes/images';
import { EvaIcon } from '@paljs/ui/Icon';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import { ic_check_circle } from 'react-icons-kit/md/ic_check_circle';
import Icon from 'react-icons-kit';

const TrucksDetail: React.FC<{}> = observer(({}) => {
  const { carrierStore, masterTypeStore } = useMst();
  const { t } = useTranslation();
  const [truckTypeOptions, setTruckTypeOptions] = useState({ groupId: null, id: null, image: null, name: null });
  const [filterProvince, setFilterProvince] = useState([]);
  const [filterRegion, setFilterRegion] = useState([]);
  const [trucks, setTrucks] = useState(null);

  useEffect(() => {
    const trucks = JSON.parse(JSON.stringify(carrierStore.trucks_detail));
    const regions = JSON.parse(JSON.stringify(masterTypeStore.regions));
    const trucks_types = JSON.parse(JSON.stringify(carrierStore.trucks_types));
    if (trucks_types?.length) {
      const array = trucks_types && trucks_types.find((truck: any) => truck.id == trucks?.truckType);
      setTruckTypeOptions(array);
    }
    const zones =
      trucks &&
      trucks.workingZones &&
      trucks.workingZones.map((z: any) => {
        const zone = regions && regions.find((r: any) => r.id === z.region);
        if (zone) return zone.name;
        return '';
      });
    setFilterRegion(zones);
    setTrucks(trucks);
  }, [
    carrierStore.trucks_detail,
    carrierStore.trucks_types,
    carrierStore.trucks_types?.length,
    masterTypeStore.regions,
  ]);

  // useEffect(() => {
  //   const provinces = JSON.parse(JSON.stringify(masterTypeStore.provinces));
  //   if (provinces?.length) {
  //     const provinceOptions = provinces.map((region: any) => {
  //       return { value: region.id, label: region.name };
  //     });
  //     setFilterProvince(provinceOptions);
  //   }
  // }, [masterTypeStore.provinces, masterTypeStore.provinces?.length]);

  // console.log("trucks:>>", trucks)
  // console.log("truckTypeOptions:>>", filterRegion)
  return (
    <div>
      <Card>
        <CardHeader>
          <span>รายละเอียดรถ</span>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <Row style={{ textAlign: 'center' }}>
              <p>รูปภาพรถ</p>
              <Col>
                <img style={{ maxHeight: '100%', width: 'auto', padding: 10 }} src={images.leftTruck} />
                <img style={{ maxHeight: '100%', width: 'auto', padding: 10 }} src={images.rightTruck} />
              </Col>
              <Col>
                <img style={{ maxHeight: '100%', width: 'auto', padding: 10 }} src={images.frontTruck} />
                <img style={{ maxHeight: '100%', width: 'auto', padding: 10 }} src={images.backTruck} />
              </Col>
            </Row>
            <Row style={{}}>
              <p>รายละเอียดรถ</p>
              <Col>
                <span>
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20.6667 4.66667H17.7778V1.05556C17.7778 0.864013 17.7017 0.680313 17.5663 0.54487C17.4308 0.409427 17.2471 0.333336 17.0556 0.333336H1.16668C0.975135 0.333336 0.791435 0.409427 0.655992 0.54487C0.520549 0.680313 0.444458 0.864013 0.444458 1.05556V14.0556C0.444458 14.2471 0.520549 14.4308 0.655992 14.5662C0.791435 14.7017 0.975135 14.7778 1.16668 14.7778H1.8889V1.77778H16.3333V10.2278C16.7016 10.1339 17.08 10.0853 17.46 10.0833H17.7778V6.11111H20.6667C21.0498 6.11111 21.4172 6.2633 21.6881 6.53418C21.9589 6.80507 22.1111 7.17247 22.1111 7.55556V8.27778H19.2222V9.72222H22.1111V13.3333H20.3778C20.1244 12.7448 19.7041 12.2434 19.1689 11.891C18.6337 11.5387 18.0069 11.351 17.3661 11.351C16.7253 11.351 16.0986 11.5387 15.5634 11.891C15.0281 12.2434 14.6078 12.7448 14.3545 13.3333H9.42168C9.17311 12.7405 8.7543 12.2346 8.21822 11.8798C7.68214 11.525 7.05287 11.3371 6.41001 11.34C5.79921 11.3535 5.20538 11.5435 4.70027 11.8872C4.19516 12.2309 3.80037 12.7135 3.56362 13.2767C3.32687 13.8399 3.25828 14.4597 3.36614 15.061C3.47399 15.6624 3.75368 16.2196 4.17141 16.6655C4.58914 17.1113 5.12704 17.4266 5.72011 17.5733C6.31318 17.72 6.93605 17.6919 7.51346 17.4922C8.09087 17.2926 8.59812 16.93 8.97391 16.4483C9.34971 15.9666 9.57797 15.3864 9.63112 14.7778H14.1667C14.2585 15.5677 14.6373 16.2964 15.2312 16.8252C15.825 17.3541 16.5926 17.6463 17.3878 17.6463C18.183 17.6463 18.9505 17.3541 19.5444 16.8252C20.1383 16.2964 20.5171 15.5677 20.6089 14.7778H22.8333C23.0249 14.7778 23.2086 14.7017 23.344 14.5662C23.4795 14.4308 23.5556 14.2471 23.5556 14.0556V7.55556C23.5556 6.78938 23.2512 6.05458 22.7094 5.5128C22.1677 4.97103 21.4329 4.66667 20.6667 4.66667ZM6.41001 16.2222C6.1754 16.2375 5.94015 16.2044 5.71883 16.1251C5.4975 16.0458 5.29479 15.9219 5.12325 15.7611C4.9517 15.6004 4.81496 15.4061 4.72148 15.1904C4.628 14.9747 4.57976 14.7421 4.57976 14.5069C4.57976 14.2718 4.628 14.0392 4.72148 13.8235C4.81496 13.6078 4.9517 13.4135 5.12325 13.2528C5.29479 13.092 5.4975 12.9681 5.71883 12.8888C5.94015 12.8095 6.1754 12.7764 6.41001 12.7917C6.64463 12.7764 6.87987 12.8095 7.1012 12.8888C7.32253 12.9681 7.52523 13.092 7.69678 13.2528C7.86833 13.4135 8.00507 13.6078 8.09855 13.8235C8.19203 14.0392 8.24026 14.2718 8.24026 14.5069C8.24026 14.7421 8.19203 14.9747 8.09855 15.1904C8.00507 15.4061 7.86833 15.6004 7.69678 15.7611C7.52523 15.9219 7.32253 16.0458 7.1012 16.1251C6.87987 16.2044 6.64463 16.2375 6.41001 16.2222ZM17.3661 16.2222C17.0301 16.2053 16.7064 16.09 16.4352 15.8908C16.164 15.6916 15.9573 15.4172 15.8406 15.1016C15.7239 14.786 15.7024 14.4431 15.7788 14.1154C15.8552 13.7877 16.026 13.4896 16.2702 13.2581C16.5144 13.0266 16.8212 12.8719 17.1525 12.8131C17.4838 12.7543 17.8251 12.794 18.134 12.9274C18.443 13.0607 18.706 13.2818 18.8904 13.5633C19.0749 13.8447 19.1727 14.1741 19.1717 14.5106C19.1584 14.9767 18.961 15.4186 18.6226 15.7394C18.2841 16.0603 17.8323 16.2339 17.3661 16.2222Z"
                      fill="#FBBC12"
                    />
                  </svg>{' '}
                  โซนวิ่งงาน :{' '}
                  {filterRegion &&
                    filterRegion.map((e: any) => {
                      return <span>{e} </span>;
                    })}
                </span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>ประเภทรถ : {truckTypeOptions && truckTypeOptions.name ? truckTypeOptions.name : ''}</span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>มีที่ดั้ม: {trucks && trucks.tipper ? 'มี' : 'ไม่มี'}</span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>
                  ความสูงของคอก:{' '}
                  {trucks && trucks.stallHeight == 'HIGH'
                    ? 'สูง'
                    : trucks && trucks.stallHeight == 'LOW'
                    ? 'ต่ำ'
                    : trucks && trucks.stallHeight == 'MEDIUM'
                    ? 'กลาง'
                    : 'ไม่มีระบุ'}
                </span>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
      {/* <Card>
        <CardBody>
         
        </CardBody>
      </Card> */}
      <Card>
        <CardBody>
          <Row style={{ justifyContent: 'space-between' }}>
            <div>
              <p>
                ทะเบียนรถ :{' '}
                {trucks &&
                  trucks?.registrationNumber.map((e: any) => {
                    return <span>{e} </span>;
                  })}
              </p>
            </div>
            <Row style={{ marginRight: 5 }}>
              <span style={{ fontWeight: 5, padding: 15 }}>Cargolink</span>
              <Icon icon={ic_check_circle} size={13} style={{ marginTop: 15, marginRight: 15, color: '#41AB00' }} />
              <img style={{ height: 60, width: 60, borderRadius: '50%' }} src={images.logo} />
            </Row>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
});
export default TrucksDetail;
