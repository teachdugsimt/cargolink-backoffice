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
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';

const TrucksDetail: React.FC<{}> = observer(({}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Card>
        <CardHeader>
          <span>รายละเอียดรถ</span>
        </CardHeader>
        <CardBody>
          <p>จุดรับส่งสินค้า</p>
          <Row style={{ justifyContent: 'center' }}>
            <div style={{ justifyContent: 'left' }}>
              <Col>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                  <img src={images.pinDrop2} style={{ width: 18 }} />
                  <span style={{ fontWeight: 'bold', margin: '0 5px' }}>{t('from')}:</span>
                  กรุงเทพมหานคร
                </span>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                  <img src={images.pinDrop} style={{ width: 18 }} />
                  <span style={{ fontWeight: 'bold', margin: '0 5px' }}>{t('to')}:</span>
                  นครราชศรีธรรมราช
                </span>
              </Col>
            </div>
            <div style={{ justifyContent: 'left', marginLeft: 50, borderLeft: '2px solid black' }}>
              <Col>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', margin: '0 5px' }}>435.45</span>
                  KM
                </span>
                <span style={{ padding: 2, display: 'flex', alignItems: 'center' }}>3 ชั่วโมง 45 นาที</span>
              </Col>
            </div>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p style={{ color: '#FBBC12' }}>รายละเอียดรถ</p>
          <Row style={{ justifyContent: 'center' }}>
            <div style={{ justifyContent: 'left', marginLeft: 50 }}>
              <Col>
                <span>
                  <EvaIcon status="Warning" name="car-outline" /> ประเภทรถ : รถ 6 ล้อตู้คอก
                </span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>จำนวน: 2 คัน</span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>มีที่ดั้ม: มี</span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>ความสูงของคอก: 2 เมตร</span>
              </Col>
            </div>
            <div style={{ justifyContent: 'left', marginLeft: 50, borderLeft: '2px solid black' }}>
              <Col>
                <span>
                  <EvaIcon status="Warning" name="car-outline" /> ประเภทรถ : รถ 6 ล้อตู้คอก
                </span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>จำนวน: 2 คัน</span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>มีที่ดั้ม: มี</span>
              </Col>
              <Col style={{ marginLeft: 25 }}>
                <span>ความสูงของคอก: 2 เมตร</span>
              </Col>
            </div>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Row style={{ justifyContent: 'space-between' }}>
            <div>
              <p>ทะเบียนรถ</p>
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
