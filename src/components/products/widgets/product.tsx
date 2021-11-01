import React, { useEffect, ReactNode } from 'react'
import styled from 'styled-components'

import { Icon } from 'react-icons-kit'
import { ic_dashboard } from 'react-icons-kit/md/ic_dashboard'
import images from '../../Themes/images'
import ProductTypeWidget from './product-type'
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import Select, { ValueType } from '@atlaskit/select';

interface ProductWidgetProps {
  productType: number | null | undefined
  productName: string | null | undefined
  price: number | null | undefined
  priceType: string | null | undefined
  weight: number | null | undefined
  onSubmit: (data: any) => void
}

interface EditableProps {
  label?: string
  value?: string | null
  unit?: any
  type?: 'text' | 'number'
  widthVal?: number | string
  onConfirm: (data: any) => void
}

interface EditableSelectProps extends EditableProps {
  options?: {
    label: string
    value: string
  }[]
}

const EditableTextfield = ({ label, value, unit, widthVal, type, onConfirm }: EditableProps) => (
  <>
    <Label>{label}</Label>
    <RowInline>
      <InlineEdit
        defaultValue={type === 'number' ? value?.replaceAll(',', '') : value}
        editView={({ errorMessage, ...fieldProps }) => (
          // <EditViewContainer>
          <Textfield {...fieldProps} css={{ width: widthVal ?? '100%' }} autoFocus type={type} step={type === 'number' ? 0.01 : undefined} />
          // </EditViewContainer>
        )}
        readView={() => (
          <Value>{value}</Value>
        )}
        onConfirm={onConfirm}
      />
      {unit && <Unit>{unit}</Unit>}
    </RowInline>
  </>
)

const EditableSelect = ({ label, value, options, unit, onConfirm }: EditableSelectProps) => (
  <>
    <Label>{label}</Label>
    <InlineEdit<ValueType<any>>
      defaultValue={value}
      editView={(fieldProps) => (
        <EditViewContainer>
          <Select
            {...fieldProps}
            options={options}
            autoFocus
            openMenuOnFocus
            placeholder={value}
          />
        </EditViewContainer>
      )}
      readView={() => (
        <Value>{value}</Value>
      )}
      onConfirm={onConfirm}
    />
  </>
)

function ProductWidget(props: ProductWidgetProps) {
  const { productType, productName, price, priceType, weight, onSubmit } = props

  const priceTypeOptions = [
    {
      label: 'ตัน',
      value: 'PER_TON'
    },
    {
      label: 'เที่ยว',
      value: 'PER_TRIP'
    }
  ]

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
            <ProductTypeWidget productTypeId={productType || ''} onSubmit={onSubmit} />
          </Value>
        </Col>
        <Col flex={1}>
          <EditableTextfield
            label={'ชื่อสินค้า'}
            value={productName}
            widthVal={250}
            onConfirm={(val) => {
              if (!val || val === productName) return;
              onSubmit({ productName: val })
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col flex={1}>
          <EditableTextfield
            label={'น้ำหนัก'}
            value={weight?.toLocaleString() || '-'}
            type={'number'}
            unit={'ตัน'}
            onConfirm={(val) => {
              if (!val || +val === weight) return;
              onSubmit({ weight: +val })
            }}
          />
        </Col>
        <Col flex={1}>
          <Label>{'ราคา'}</Label>
          <RowInline>
            <EditableTextfield
              value={price?.toLocaleString() || '-'}
              type={'number'}
              onConfirm={(val) => {
                if (!val || +val === price) return;
                onSubmit({ price: +val })
              }}
            />
            <Unit>{'บาท /'}</Unit>
            <EditableSelect
              value={priceType === 'PER_TON' ? 'ตัน' : 'เที่ยว'}
              options={priceTypeOptions}
              onConfirm={(val) => {
                if (!val.value || val.value === priceType) return;
                onSubmit({ priceType: val.value })
              }}
            />
          </RowInline>
        </Col>
      </Row>
    </>
  )
}

export default ProductWidget

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

const RowInline = styled.div`
  display: flex;
  align-items: center;
`
const EditViewContainer = styled.div`
  z-index: 300;
  position: relative;
  min-width: 100px;
`;

const Unit = styled.span`
  margin-top: 8px;
  padding: 0 5px;
  font-size: 20px;
`
