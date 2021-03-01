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
  // const { carrierStore } = useMst();
  const { t } = useTranslation();
  // const [trucks, setTrucks] = useState([])

  // useEffect(() => {
  //     const trucks = JSON.parse(JSON.stringify(carrierStore.trucks_carrier));
  //     setTrucks(trucks)
  // }, [
  //     carrierStore.trucks_carrier,
  //     carrierStore.trucks_carrier?.reRender,
  //     carrierStore.trucks_carrier?.content?.length,
  // ]);

  // console.log("trucks:>>", trucks)
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
          <Row style={{ justifyContent: 'space-between' }}>
            <div>
              <p>ทะเบียนรถ</p>
            </div>
            <Row>
              <span style={{ fontWeight: 5, padding: 15 }}>Cargolink</span>
              <Icon icon={ic_check_circle} size={13} style={{ marginTop: 15, color: '#41AB00' }} />
              <img style={{ height: 60, width: 60, borderRadius: '50%' }} src={images.logo} />
            </Row>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
});
export default TrucksDetail;
