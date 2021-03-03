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
  const { carrierStore, masterTypeStore } = useMst();
  const { t } = useTranslation();
  const [truckTypeOptions, setTruckTypeOptions] = useState({ groupId: null, id: null, image: null, name: null });
  const [filterRegion, setFilterRegion] = useState([]);
  const [trucks, setTrucks] = useState({
    approveStatus: null,
    createdAt: null,
    id: null,
    loadingWeight: null,
    owner: null,
    phoneNumber: null,
    registrationNumber: [],
    stallHeight: null,
    tipper: true,
    truckPhotos: {
      front: { object: '', token: '' },
      back: { object: '', token: '' },
      left: { object: '', token: '' },
      rigth: { object: '', token: '' },
    },
    truckType: null,
    updatedAt: null,
    workingZones: [],
  });

  useEffect(() => {
    carrierStore.getAllTruckTypes();
  }, []);

  useEffect(() => {
    const trucks_detail = JSON.parse(JSON.stringify(carrierStore.trucks_detail));
    setTrucks(trucks_detail);
    if (trucks_detail?.truckPhotos) {
      imageResponse(trucks_detail?.truckPhotos);
    }
  }, [carrierStore.trucks_detail]);

  useEffect(() => {
    const trucks_detail = JSON.parse(JSON.stringify(carrierStore.trucks_detail));
    const regions = JSON.parse(JSON.stringify(masterTypeStore.regions));
    if (trucks_detail?.workingZones) {
      const zones = trucks_detail.workingZones.map((z: any) => {
        const zone = regions && regions.find((r: any) => r.id === z.region);
        if (zone) return zone.name;
        return '';
      });
      setFilterRegion(zones);
    }
  }, [carrierStore.trucks_detail, masterTypeStore.regions]);

  useEffect(() => {
    const trucks_detail = JSON.parse(JSON.stringify(carrierStore.trucks_detail));
    const trucks_types = JSON.parse(JSON.stringify(carrierStore.trucks_types));
    if (trucks_types?.length && trucks_detail?.truckType) {
      const object = trucks_types.find((truck: any) => truck.id === trucks_detail.truckType);
      setTruckTypeOptions(object);
    }
  }, [carrierStore.trucks_detail, carrierStore.trucks_types, carrierStore.trucks_types?.length]);

  const arrayBufferToBase64 = (buffer: any) => {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  const getImageApi = async (api: string, token: string, imageId: string) => {
    const response = await fetch(api, {
      method: 'GET',
      headers: {
        adminAuth: token,
      },
    });
    await response.arrayBuffer().then((buffer) => {
      const base64Flag = 'data:image/jpeg;base64,';
      const imageStr = arrayBufferToBase64(buffer);
      // return base64Flag + imageStr;
      document.getElementById(imageId).src = base64Flag + imageStr;
    });
  };

  const imageResponse = (photoObject: any) => {
    const { front, back, left, right } = photoObject;
    if (front?.object && front?.token) {
      getImageApi(front.object, front.token, 'truckFrontPhoto');
    }
    if (back?.object && back?.token) {
      getImageApi(back.object, back.token, 'truckBackPhoto');
    }
    if (left?.object && left?.token) {
      getImageApi(left.object, left.token, 'truckLeftPhoto');
    }
    if (right?.object && right?.token) {
      getImageApi(right.object, right.token, 'truckRightPhoto');
    }
    // fetch(api, {
    //   method: 'GET',
    //   headers: {
    //     adminAuth: front?.token,
    //   },
    // }).then((response) => {
    //   return response.arrayBuffer().then((buffer) => {
    //     var base64Flag = 'data:image/jpeg;base64,';
    //     var binary = '';
    //     var bytes = [].slice.call(new Uint8Array(buffer));
    //     bytes.forEach((b) => (binary += String.fromCharCode(b)));
    //     var imageStr = window.btoa(binary);
    //     const src = base64Flag + imageStr;
    //     document.getElementById('authImage').src = src;
    //   });
    // });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <span>รายละเอียดรถ</span>
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ xs: 12, lg: 7 }}>
              <Row>
                <Col breakPoint={{ xs: 12 }} style={{ margin: '6px 0px' }}>
                  <strong>รูปภาพรถ</strong>
                </Col>
                <Col
                  breakPoint={{ xs: 12, sm: 6 }}
                  style={{ margin: '6px 0px', display: 'grid', justifyContent: 'flex-end' }}
                >
                  <img
                    id="truckFrontPhoto"
                    style={{ maxWidth: 235, maxHeight: '100%', height: 'auto' }}
                    src={images.frontTruck}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, sm: 6 }} style={{ margin: '6px 0px' }}>
                  <img
                    id="truckBackPhoto"
                    style={{ maxWidth: 235, maxHeight: '100%', height: 'auto' }}
                    src={images.backTruck}
                  />
                </Col>
                <Col
                  breakPoint={{ xs: 12, sm: 6 }}
                  style={{ margin: '6px 0px', display: 'grid', justifyContent: 'flex-end' }}
                >
                  <img
                    id="truckLeftPhoto"
                    style={{ maxWidth: 235, maxHeight: '100%', height: 'auto' }}
                    src={images.leftTruck}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, sm: 6 }} style={{ margin: '6px 0px' }}>
                  <img
                    id="truckRightPhoto"
                    style={{ maxWidth: 235, maxHeight: '100%', height: 'auto' }}
                    src={images.rightTruck}
                  />
                </Col>
              </Row>
            </Col>
            <Col breakPoint={{ xs: 12, lg: 5 }}>
              <Row>
                <Col breakPoint={{ xs: 12 }} style={{ margin: '6px 0px' }}>
                  <strong>รายละเอียดรถ</strong>
                </Col>
                <Col breakPoint={{ xs: 2, sm: 1 }} style={{ margin: '6px 0px' }}>
                  <div
                    dangerouslySetInnerHTML={{ __html: defaultIcons['truck'] }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  />
                </Col>
                <Col breakPoint={{ xs: 10, sm: 11 }} style={{ margin: '6px 0px' }}>
                  <span>โซนวิ่งงาน: {filterRegion && filterRegion.join(', ')}</span>
                </Col>
                <Col breakPoint={{ xs: 2, sm: 1 }} />
                <Col breakPoint={{ xs: 10, sm: 11 }} style={{ margin: '6px 0px' }}>
                  <span>ประเภทรถ: {truckTypeOptions && truckTypeOptions.name ? truckTypeOptions.name : ''}</span>
                </Col>
                <Col breakPoint={{ xs: 2, sm: 1 }} />
                <Col breakPoint={{ xs: 10, sm: 11 }} style={{ margin: '6px 0px' }}>
                  <span>มีที่ดั้ม: {trucks && trucks.tipper ? 'มี' : 'ไม่มี'}</span>
                </Col>
                <Col breakPoint={{ xs: 2, sm: 1 }} />
                <Col breakPoint={{ xs: 10, sm: 11 }} style={{ margin: '6px 0px' }}>
                  <span>ความสูงของคอก: {t(`${trucks && trucks.stallHeight}`)}</span>
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
              <p>ทะเบียนรถ : {trucks && trucks.registrationNumber && trucks.registrationNumber.join(' ')}</p>
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
