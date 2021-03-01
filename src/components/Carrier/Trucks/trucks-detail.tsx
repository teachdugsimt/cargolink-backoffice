import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import images from '../../Themes/images';
import { EvaIcon } from '@paljs/ui/Icon';

const TrucksDetail = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Card>
        <CardHeader>
          <span>รายละเอียดรถ</span>
        </CardHeader>
        <CardBody>
          <p>รูปภาพรถ</p>
          <Row style={{ textAlign: 'center' }}>
            <Col>
              <img style={{ height: 100, width: 200, padding: 10 }} src={images.Truck1} />
              <img style={{ height: 100, width: 200, padding: 10 }} src={images.Truck2} />
            </Col>
            <Col>
              <img style={{ height: 100, width: 200, padding: 10 }} src={images.Truck3} />
              <img style={{ height: 100, width: 250, padding: 10 }} src={images.Truck27} />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p style={{ color: '#FBBC12' }}>รายละเอียดรถ</p>
          <Row style={{ textAlign: 'left', marginRight: 20 }}>
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
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p>เจ้าของรถ</p>
        </CardBody>
      </Card>
    </div>
  );
};
export default TrucksDetail;
