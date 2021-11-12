import React from 'react'
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store'
import styled from 'styled-components'
import images from '../../Themes/images'

interface TruckWidgetProps {
  title?: boolean | string | null | undefined
  truckType: string | number | null | undefined
  tipper: boolean | null | undefined
  truckAmount?: string | number | null | undefined
  loadingWeight?: string | number | null | undefined
  registrationNumber?: Array<string> | null | undefined
  stallHeight?: string | null | undefined
}

const TruckShowWidget = observer((props: TruckWidgetProps) => {
  const {
    title, truckType, tipper,
    truckAmount, loadingWeight,
    stallHeight, registrationNumber } = props
    const { truckTypesStore } = useMst()
    const truckTypeName = truckTypesStore.truckTypeNameById(Number(truckType))
  return (
    <>
      <Row>
        {title &&
          <>
            <img src={images.truck} style={{ width: 34, height: 34 }} />
            <h2 style={{ margin: 0, marginLeft: 10 }}>{typeof title == 'string' ? title : 'รถที่ต้องการ'}</h2>
          </>
        }
      </Row>
      <Row>
        <Col flex={1}>
          <Label>ประเภทรถ</Label>
          <Value>{truckTypeName?.name || ''}</Value>
        </Col>
        <Col flex={1}>
          <Label>คอก</Label>
          <Value>{stallHeight || '-'}</Value>
        </Col>
      </Row>

      <Row>
        {props.hasOwnProperty('truckAmount') && <Col flex={1}>
          <Label>จำนวนรถที่ต้องการ</Label>
          <Value>{truckAmount || '-'}{' คัน'}</Value>
        </Col>}

        {props.hasOwnProperty('loadingWeight') && <Col flex={1}>
          <Label>น้ำหนักบรรทุก</Label>
          <Value>{loadingWeight || '-'}{' ตัน'}</Value>
        </Col>}

        <Col flex={1}>
          <Label>การลงสินค้า</Label>
          <Value>{tipper ? 'ดั้มพ์' : 'ไม่ดั้มพ์'}</Value>
        </Col>
      </Row>

      <Row>
        {registrationNumber && <Col flex={1}>
          <Label>เลขทะเบียน</Label>
          <Value>{registrationNumber.join(', ')}</Value>
        </Col>}
      </Row>
    </>
  )
})

export default TruckShowWidget

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Col = styled.div<{ flex: number }>`
  display: flex;
  flex: ${props => props.flex | 1};
  flex-direction: column;
`;

const Label = styled.span`
  color: #999;
  font-size: 13px;
`;

const Value = styled.span`
  font-size: 20px;
`;
