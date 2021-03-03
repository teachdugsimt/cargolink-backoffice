import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import images from '../../Themes/images';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import { ic_check_circle } from 'react-icons-kit/md/ic_check_circle';
import { defaultIcons } from '../../../Layouts/Sidebar/Icon/defaultIcons';
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
  }, []);

  useEffect(() => {
    const job = JSON.parse(JSON.stringify(shipperStore.job_detail));
    setJobDetail(job);
    if (job?.to && job?.from) {
      const data = [job.from, ...job.to];
      getGoogleApi(data);
    }
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

      arrFormat?.forEach((f: string) => {
        timeStr += `${time[f]} ${t(`${f}`)} `;
      });

      return timeStr.trim();
    };
    setDistance((summaryDistance / 1000).toFixed(2));
    setDuration(time_convert(summaryDuration * 1000, 'HHmm'));
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <span>รายละเอียดงาน</span>
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ xs: 12 }} style={{ margin: '6px 0' }}>
              <strong>จุดรับส่งสินค้า</strong>
            </Col>
            <Col breakPoint={{ xs: false, md: 1, lg: 2 }} style={{ margin: '6px 0' }} />
            <Col breakPoint={{ xs: 12, md: 7, lg: 6 }} style={{ margin: '6px 0' }}>
              <span style={{ display: 'flex', alignItems: 'center', margin: '6px 0px' }}>
                <img src={images.pinDrop2} style={{ width: 18 }} />
                <span style={{ fontWeight: 'bold', margin: '0 8px' }}>{t('from')}:</span>
                {`${jobDetail && jobDetail.from && jobDetail.from.name ? jobDetail.from.name : ''}`}
              </span>
              {jobDetail &&
                jobDetail.to &&
                jobDetail.to.map((e: any, i: number) => {
                  return (
                    <div key={i}>
                      <span style={{ display: 'flex', alignItems: 'center', margin: '6px 0px' }}>
                        {i === 0 ? <img src={images.pinDrop} style={{ width: 18 }} /> : <div style={{ width: 18 }} />}
                        <span style={{ fontWeight: 'bold', marginLeft: 8, marginRight: 14 }}>{t('to')}:</span>
                        {`${e?.name}`}
                      </span>
                    </div>
                  );
                })}
            </Col>
            <Col
              breakPoint={{ xs: 12, md: 4, lg: 4 }}
              style={{ margin: '6px 0', display: 'flex', alignItems: 'center' }}
            >
              <div style={{ borderLeft: '2px solid' }}>
                <Row style={{ margin: '6px 0' }}>
                  <span style={{ fontWeight: 'bold', marginLeft: 15, marginRight: 5 }}>{`${distance} `}</span>
                  {t('KM')}
                </Row>
                <Row style={{ margin: '6px 0' }}>
                  <span style={{ margin: '0px 15px' }}>{`${duration}`}</span>
                </Row>
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Col breakPoint={{ xs: 12 }} style={{ margin: '6px 0' }}>
              <strong>รายละเอียดงาน</strong>
            </Col>
            <Col breakPoint={{ xs: 12 }}>
              <Row>
                <Col breakPoint={{ xs: false, md: 1, lg: 2 }} style={{ margin: '6px 0' }} />
                <Col breakPoint={{ xs: 12, sm: 6, md: 5, lg: 3 }}>
                  <Row>
                    <Col breakPoint={{ xs: 2, lg: 2.5 }} style={{ margin: '6px 0px' }}>
                      <div
                        dangerouslySetInnerHTML={{ __html: defaultIcons['truck'] }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      />
                    </Col>
                    <Col breakPoint={{ xs: 10, lg: 9.5 }} style={{ margin: '6px 0px' }}>
                      <span>ประเภทรถ: {truckTypeOptions && truckTypeOptions.name ? truckTypeOptions.name : ''}</span>
                    </Col>
                    <Col breakPoint={{ xs: 2, lg: 2.5 }} />
                    <Col breakPoint={{ xs: 10, lg: 9.5 }} style={{ margin: '6px 0px' }}>
                      <span>
                        จำนวนรถ: {`${jobDetail && jobDetail.requiredTruckAmount ? jobDetail.requiredTruckAmount : ''}`}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6, lg: 7 }}>
                  <Row>
                    <Col breakPoint={{ xs: 2, lg: 1 }} style={{ margin: '6px 0px' }}>
                      <div
                        dangerouslySetInnerHTML={{ __html: defaultIcons['box'] }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      />
                    </Col>
                    <Col breakPoint={{ xs: 10, lg: 11 }} style={{ margin: '6px 0px' }}>
                      <span>ประเภทสินค้า : {productTypes ? productTypes : ''}</span>
                    </Col>
                    <Col breakPoint={{ xs: 2, lg: 1 }} />
                    <Col breakPoint={{ xs: 10, lg: 11 }} style={{ margin: '6px 0px' }}>
                      <span>ชื่อสินค้า : {`${jobDetail && jobDetail.productName ? jobDetail.productName : ''}`}</span>
                    </Col>
                    <Col breakPoint={{ xs: 2, lg: 1 }} />
                    <Col breakPoint={{ xs: 10, lg: 11 }} style={{ margin: '6px 0px' }}>
                      <span>น้ำหนัก : {`${jobDetail && jobDetail.weight ? jobDetail.weight : 0}`} ตัน</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Row>
            <Col breakPoint={{ xs: 12, sm: 6 }} style={{ margin: '6px 0px', display: 'flex', alignItems: 'center' }}>
              <p>
                ชื่อบริษัท :{' '}
                {`${jobDetail && jobDetail.owner && jobDetail.owner.companyName ? jobDetail.owner.companyName : ''}`}
              </p>
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6 }} style={{ margin: '6px 0px' }}>
              <Row end="xs" style={{ display: 'flex', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
                <span style={{ padding: '0px 8px' }}>Cargolink</span>
                <Icon icon={ic_check_circle} size={13} style={{ color: '#41AB00', padding: '0px 8px' }} />
                <img style={{ height: 60, width: 60, borderRadius: '50%', margin: '0px 8px' }} src={images.logo} />
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
});
export default TrucksDetail;
