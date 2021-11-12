import React, { } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'
import images from '../../Themes/images'

interface ProductWidgetProps {
  productType: number | null | undefined
  productName: string | null | undefined
  price: number | null | undefined
  priceType: string | null | undefined
  weight: number | null | undefined
}

const ProductShowWidget = observer((props: ProductWidgetProps) => {
  const { productTypesStore } = useMst()
  const { productType, productName, price, priceType, weight } = props

  const productTypeName = productTypesStore.productTypeNameById(Number(productType))

  return (
    <>
      <Row>
        {/* <Icon icon={ic_dashboard} size={30} /> */}
        <img src={images.box} style={{ width: 35, height: 35 }} />
        <h2 style={{ margin: 0, marginLeft: 10 }}>สินค้า</h2>
      </Row>
      <Row>
        <Col flex={1}>
          <Label>ประเภทสินค้า</Label>
          <Value>
            <Value>{productTypeName?.name || ''}</Value>
          </Value>
        </Col>
        <Col flex={1}>
          <Label>ชื่อสินค้า</Label>
          <Value>{productName || '-'}</Value>
        </Col>
      </Row>
      <Row>
        <Col flex={1}>
          <Label>น้ำหนัก</Label>
          <Value>{weight?.toLocaleString() || '-'}{' ตัน'}</Value>
        </Col>
        <Col flex={1}>
          <Label>ราคา</Label>
          <Value>{price?.toLocaleString() || '-'} {priceType == 'PER_TON' ? 'บาท / ตัน' : 'บาท / เที่ยว'}</Value>
        </Col>
      </Row>
    </>
  )
})

export default ProductShowWidget

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
