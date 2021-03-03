import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import images from '../../Themes/images';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import { ic_check_circle } from 'react-icons-kit/md/ic_check_circle';
import Icon from 'react-icons-kit';

const TrucksDetail: React.FC<{}> = observer(({}) => {
  const { t } = useTranslation();
  const { shipperStore, carrierStore } = useMst();
  const [truckTypeOptions, setTruckTypeOptions] = useState({ groupId: null, id: null, image: null, name: null });
  const [jobDetail, setJobDetail] = useState({
    productName: '',
    weight: 0,
    owner: { companyName: ' ' },
    requiredTruckAmount: 0,
    to: [],
    from: { name: '' },
  });
  const [productTypes, setProductTypes] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    shipperStore.getProductTypes();
    const job = JSON.parse(JSON.stringify(shipperStore.job_detail));
    if (job?.to && job?.from) {
      const data = [job?.from, ...job.to];
      getGoogleApi(data);
    }
  }, [shipperStore.job_detail]);

  useEffect(() => {
    const job = JSON.parse(JSON.stringify(shipperStore.job_detail));
    setJobDetail(job);
  }, [shipperStore.job_detail]);

  useEffect(() => {
    const job = JSON.parse(JSON.stringify(shipperStore.job_detail));
    const product_types = JSON.parse(JSON.stringify(shipperStore.product_types));
    if (product_types?.length && job?.productTypeId) {
      const productType = product_types.find((e: any) => e.id === job.productTypeId);
      const typeName = productType ? productType.name : '';
      setProductTypes(typeName);
    }
  }, [shipperStore.job_detail, shipperStore.product_types, shipperStore.product_types?.length]);

  useEffect(() => {
    const job = JSON.parse(JSON.stringify(shipperStore.job_detail));
    const trucks_types = JSON.parse(JSON.stringify(carrierStore.trucks_types));
    if (trucks_types?.length && job?.truckType) {
      const array = trucks_types.find((truck: any) => truck.id === parseInt(job.truckType, 10));
      setTruckTypeOptions(array);
    }
  }, [shipperStore.job_detail, carrierStore.trucks_types, carrierStore.trucks_types?.length]);

  const getGoogleApi = async (coordinates: any) => {
    // console.log("coordinates:>>", coordinates)
    let arrDistances = [];
    let summaryDistance = 0;
    let summaryDuration = 0;
    let province = {};
    for (let index = 0; index < coordinates.length; index++) {
      if (index + 1 < coordinates.length) {
        const startLoc = `${coordinates[index].lat},${coordinates[index].lng}`;
        const destinationLoc = `${coordinates[index + 1].lat},${coordinates[index + 1].lng}`;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&result_type=country&key=AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw`,
          {
            method: 'GET',
          },
        );
        const responseJson = await response.json();
        // console.log('response :> ', responseJson);
        if (responseJson.status === 'OK') {
          const mapData = responseJson.routes[0];
          const distanceValue = mapData?.legs[0]?.distance?.value || 0;
          const durationValue = mapData?.legs[0]?.duration?.value || 0;

          summaryDistance += distanceValue;
          summaryDuration += durationValue;

          province = {
            ...province,
            [startLoc]: mapData?.legs[0]?.start_address || '',
            [destinationLoc]: mapData?.legs[0]?.end_address || '',
          };

          arrDistances.push({
            from: startLoc,
            to: destinationLoc,
            distance: distanceValue,
            duration: durationValue,
          });
        }
      }
    }

    const time_convert = (
      duration: number,
      format: 'HHmmssms' | 'HHmmss' | 'HHmm' | 'HH' | 'mmssms' | 'mmss' | 'mm' | 'ssms' | 'ss' | 'ms',
    ) => {
      const time = {
        ms: (duration % 1000) / 100,
        ss: Math.floor((duration / 1000) % 60),
        mm: Math.floor((duration / (1000 * 60)) % 60),
        HH: Math.floor((duration / (1000 * 60 * 60)) % 24),
      };

      let timeStr = '';
      const arrFormat = format.match(/.{1,2}/g);

      arrFormat?.forEach((f) => {
        timeStr += `${time[f]} ${t(`${f}`)} `;
      });

      return timeStr.trim();
    };
    // console.log('arrDistances :> ', arrDistances);
    setDistance((summaryDistance / 1000).toFixed(2));
    setDuration(time_convert(summaryDuration * 1000, 'HHmm'));
    // console.log('summaryDistance :> ', summaryDistance / 1000);
    // console.log('summaryDuration :> ', time_convert(summaryDuration * 1000, 'HHmm'));
  };

  // console.log('distance:>>', distance);
  // console.log('duration:>>', duration);
  // console.log('jobDetail:>>', jobDetail);

  return (
    <div>
      <Card>
        <CardHeader>
          <span>รายละเอียดงาน</span>
        </CardHeader>
        <CardBody>
          <p>จุดรับส่งสินค้า</p>
          <Row style={{ justifyContent: 'center' }}>
            <div style={{ justifyContent: 'left' }}>
              <Col>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                  <img src={images.pinDrop2} style={{ width: 18 }} />
                  <span style={{ fontWeight: 'bold', margin: '0 5px' }}>{t('from')}:</span>
                  {`${jobDetail && jobDetail.from && jobDetail.from.name ? jobDetail.from.name : ''}`}
                </span>
                {jobDetail &&
                  jobDetail.to &&
                  jobDetail.to.map((e: any, i: number) => {
                    return (
                      <div key={i}>
                        <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                          {i === 0 ? <img src={images.pinDrop} style={{ width: 18 }} /> : <div style={{ width: 18 }} />}
                          <span style={{ fontWeight: 'bold', margin: '0 5px' }}>To:</span>
                          {`${e?.name}`}
                        </span>
                      </div>
                    );
                  })}
              </Col>
            </div>
            <div style={{ justifyContent: 'left', marginLeft: 50, borderLeft: '2px solid black' }}>
              <Col>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', margin: '0 5px' }}>{distance}</span>
                  KM
                </span>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>{duration}</span>
              </Col>
            </div>
          </Row>
          <p>รายละเอียดงาน</p>
          <Row style={{ justifyContent: 'center' }}>
            <div style={{ justifyContent: 'left', marginLeft: 50 }}>
              <Col>
                <span>
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20.6667 4.66667H17.7778V1.05556C17.7778 0.864013 17.7017 0.680313 17.5663 0.54487C17.4308 0.409427 17.2471 0.333336 17.0556 0.333336H1.16668C0.975135 0.333336 0.791435 0.409427 0.655992 0.54487C0.520549 0.680313 0.444458 0.864013 0.444458 1.05556V14.0556C0.444458 14.2471 0.520549 14.4308 0.655992 14.5662C0.791435 14.7017 0.975135 14.7778 1.16668 14.7778H1.8889V1.77778H16.3333V10.2278C16.7016 10.1339 17.08 10.0853 17.46 10.0833H17.7778V6.11111H20.6667C21.0498 6.11111 21.4172 6.2633 21.6881 6.53418C21.9589 6.80507 22.1111 7.17247 22.1111 7.55556V8.27778H19.2222V9.72222H22.1111V13.3333H20.3778C20.1244 12.7448 19.7041 12.2434 19.1689 11.891C18.6337 11.5387 18.0069 11.351 17.3661 11.351C16.7253 11.351 16.0986 11.5387 15.5634 11.891C15.0281 12.2434 14.6078 12.7448 14.3545 13.3333H9.42168C9.17311 12.7405 8.7543 12.2346 8.21822 11.8798C7.68214 11.525 7.05287 11.3371 6.41001 11.34C5.79921 11.3535 5.20538 11.5435 4.70027 11.8872C4.19516 12.2309 3.80037 12.7135 3.56362 13.2767C3.32687 13.8399 3.25828 14.4597 3.36614 15.061C3.47399 15.6624 3.75368 16.2196 4.17141 16.6655C4.58914 17.1113 5.12704 17.4266 5.72011 17.5733C6.31318 17.72 6.93605 17.6919 7.51346 17.4922C8.09087 17.2926 8.59812 16.93 8.97391 16.4483C9.34971 15.9666 9.57797 15.3864 9.63112 14.7778H14.1667C14.2585 15.5677 14.6373 16.2964 15.2312 16.8252C15.825 17.3541 16.5926 17.6463 17.3878 17.6463C18.183 17.6463 18.9505 17.3541 19.5444 16.8252C20.1383 16.2964 20.5171 15.5677 20.6089 14.7778H22.8333C23.0249 14.7778 23.2086 14.7017 23.344 14.5662C23.4795 14.4308 23.5556 14.2471 23.5556 14.0556V7.55556C23.5556 6.78938 23.2512 6.05458 22.7094 5.5128C22.1677 4.97103 21.4329 4.66667 20.6667 4.66667ZM6.41001 16.2222C6.1754 16.2375 5.94015 16.2044 5.71883 16.1251C5.4975 16.0458 5.29479 15.9219 5.12325 15.7611C4.9517 15.6004 4.81496 15.4061 4.72148 15.1904C4.628 14.9747 4.57976 14.7421 4.57976 14.5069C4.57976 14.2718 4.628 14.0392 4.72148 13.8235C4.81496 13.6078 4.9517 13.4135 5.12325 13.2528C5.29479 13.092 5.4975 12.9681 5.71883 12.8888C5.94015 12.8095 6.1754 12.7764 6.41001 12.7917C6.64463 12.7764 6.87987 12.8095 7.1012 12.8888C7.32253 12.9681 7.52523 13.092 7.69678 13.2528C7.86833 13.4135 8.00507 13.6078 8.09855 13.8235C8.19203 14.0392 8.24026 14.2718 8.24026 14.5069C8.24026 14.7421 8.19203 14.9747 8.09855 15.1904C8.00507 15.4061 7.86833 15.6004 7.69678 15.7611C7.52523 15.9219 7.32253 16.0458 7.1012 16.1251C6.87987 16.2044 6.64463 16.2375 6.41001 16.2222ZM17.3661 16.2222C17.0301 16.2053 16.7064 16.09 16.4352 15.8908C16.164 15.6916 15.9573 15.4172 15.8406 15.1016C15.7239 14.786 15.7024 14.4431 15.7788 14.1154C15.8552 13.7877 16.026 13.4896 16.2702 13.2581C16.5144 13.0266 16.8212 12.8719 17.1525 12.8131C17.4838 12.7543 17.8251 12.794 18.134 12.9274C18.443 13.0607 18.706 13.2818 18.8904 13.5633C19.0749 13.8447 19.1727 14.1741 19.1717 14.5106C19.1584 14.9767 18.961 15.4186 18.6226 15.7394C18.2841 16.0603 17.8323 16.2339 17.3661 16.2222Z"
                      fill="#FBBC12"
                    />
                  </svg>{' '}
                  ประเภทรถ : {truckTypeOptions && truckTypeOptions.name ? truckTypeOptions.name : ''}
                </span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>
                  จำนวนรถ : {`${jobDetail && jobDetail.requiredTruckAmount ? jobDetail.requiredTruckAmount : ''}`}
                </span>
              </Col>
            </div>
            <div style={{ justifyContent: 'left', marginLeft: 50 }}>
              <Col>
                <span>
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.1711 5.828C19.1682 5.82247 19.1658 5.81685 19.1627 5.81141C19.1602 5.807 19.1571 5.80297 19.1545 5.79866C19.0211 5.57288 18.8308 5.38604 18.6026 5.25678L10.7276 0.805721C10.5021 0.67915 10.248 0.612671 9.98943 0.612671C9.7309 0.612671 9.47671 0.67915 9.25129 0.805721L1.37629 5.25678C1.14416 5.38814 0.951278 5.57905 0.817536 5.80982C0.81613 5.81225 0.814442 5.8145 0.81313 5.81694C0.810692 5.82125 0.808911 5.82585 0.806568 5.83016C0.680856 6.05384 0.614681 6.30604 0.61438 6.56263V15.4374C0.614633 15.703 0.685277 15.9637 0.819116 16.1932C0.952954 16.4226 1.14521 16.6124 1.37629 16.7433L9.25129 21.1943C9.46103 21.3122 9.6961 21.3779 9.9366 21.3857C9.9516 21.3868 9.96641 21.3883 9.9816 21.3884H9.98966C10.01 21.3884 10.03 21.387 10.0499 21.3854C10.2878 21.3765 10.5201 21.311 10.7276 21.1944L18.6026 16.7431C18.8336 16.6122 19.0259 16.4224 19.1597 16.1931C19.2936 15.9637 19.3642 15.7029 19.3645 15.4374V6.56263C19.3642 6.30521 19.2976 6.0522 19.1711 5.828ZM9.98938 2.11147L17.0969 6.12885L14.5916 7.56135L7.4286 3.55897L9.98938 2.11147ZM10.0846 10.1385L2.89522 6.12125L5.89991 4.42297L13.0718 8.43041L10.0846 10.1385ZM2.11438 7.40319L9.33435 11.4375L9.25138 19.4713L2.11438 15.4374V7.40319ZM10.7517 19.4576L10.8345 11.4376L13.8458 9.71572V12.9229C13.8458 13.1218 13.9248 13.3126 14.0655 13.4532C14.2061 13.5939 14.3969 13.6729 14.5958 13.6729C14.7947 13.6729 14.9855 13.5939 15.1261 13.4532C15.2668 13.3126 15.3458 13.1218 15.3458 12.9229V8.85791L17.8644 7.41782V15.4374L10.7517 19.4576Z"
                      fill="#FBBC12"
                    />
                  </svg>{' '}
                  ประเภทสินค้า : {productTypes ? productTypes : ''}
                </span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>ชื่อสินค้า : {`${jobDetail && jobDetail.productName ? jobDetail.productName : ''}`}</span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>น้ำหนัก : {`${jobDetail && jobDetail.weight ? jobDetail.weight : 0}`} ตัน</span>
              </Col>
            </div>
          </Row>
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
                ชื่อบริษัท :{' '}
                {`${jobDetail && jobDetail.owner && jobDetail.owner.companyName ? jobDetail.owner.companyName : ''}`}
              </p>
            </div>
            <Row style={{ marginRight: 5 }}>
              <span style={{ fontWeight: 5, padding: 15 }}>Cargolink</span>
              <Icon icon={ic_check_circle} size={13} style={{ marginTop: 15, marginRight: 10, color: '#41AB00' }} />
              <img style={{ height: 60, width: 60, borderRadius: '50%' }} src={images.logo} />
            </Row>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
});
export default TrucksDetail;
