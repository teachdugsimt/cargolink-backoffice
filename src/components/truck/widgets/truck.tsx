import React from 'react'
import { observer } from 'mobx-react-lite';
// import { Icon } from 'react-icons-kit'
// import { truck } from 'react-icons-kit/fa/truck'

import styled from 'styled-components'
import images from '../../Themes/images'
import TruckTypeWidget from './truck-type'
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import Select, { ValueType } from '@atlaskit/select';

interface TruckWidgetProps {
  title?: boolean | string | null | undefined
  truckType: string | number | null | undefined
  tipper: boolean | null | undefined
  truckAmount?: string | number | null | undefined
  loadingWeight?: string | number | null | undefined
  registrationNumber?: Array<string> | null | undefined
  stallHeight?: string | null | undefined
  onSubmit: (data: any) => void
}

interface EditableProps {
  label?: string
  value?: string | null
  unit?: any
  type?: 'text' | 'number'
  onConfirm: (data: any) => void
}

interface EditableSelectProps extends EditableProps {
  options?: {
    label: string
    value: string
  }[]
}

const EditableTextfield = ({ label, value, unit, type, onConfirm }: EditableProps) => (
  <>
    <Label>{label}</Label>
    <RowInline>
      <InlineEdit
        defaultValue={type === 'number' ? value?.replaceAll(',', '') : value}
        editView={({ errorMessage, ...fieldProps }) => (
          // <EditViewContainer>
          <Textfield {...fieldProps} css={{ width: '100%' }} autoFocus type={type} step={type === 'number' ? 0.01 : undefined} />
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

const TruckWidget = observer((props: TruckWidgetProps) => {
  const {
    title, truckType, tipper,
    truckAmount, loadingWeight,
    stallHeight, registrationNumber,
    onSubmit
  } = props

  const tipperOptions = [
    {
      value: '1',
      label: 'ดั้มพ์'
    },
    {
      value: '0',
      label: 'ไม่ดั้มพ์'
    }
  ]

  return (
    <>
      <Row>
        {/* <Icon icon={truck} size={30} /> */}
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
          <Value><TruckTypeWidget truckTypeId={truckType || ''} onSubmit={onSubmit} /></Value>
          {/* <Value>{truckType || '-'}</Value> */}
        </Col>
        <Col flex={1}>
          <Label>คอก</Label>
          <Value>{stallHeight || '-'}</Value>
        </Col>
      </Row>

      <Row>
        {props.hasOwnProperty('truckAmount') && <Col flex={1}>
          <EditableTextfield
            label={'จำนวนรถที่ต้องการ'}
            value={truckAmount?.toString() || '-'}
            unit={'คัน'}
            type={'number'}
            onConfirm={(val) => {
              if (!val || +val === truckAmount) return;
              onSubmit({ truckAmount: +val })
            }}
          />
        </Col>}

        {props.hasOwnProperty('loadingWeight') && <Col flex={1}>
          <EditableTextfield
            label={'น้ำหนักบรรทุก'}
            value={loadingWeight?.toString() || '-'}
            unit={'ตัน'}
            onConfirm={(val) => {
              if (!val || val.toString() === loadingWeight?.toString()) return;
              onSubmit({ loadingWeight: val })
            }}
          />
        </Col>}

        <Col flex={1}>
          <EditableSelect
            label={'การลงสินค้า'}
            value={tipper ? 'ดั้มพ์' : 'ไม่ดั้มพ์'}
            options={tipperOptions}
            onConfirm={(val) => {
              if (!val.value || !!(+val.value) === tipper) return;
              onSubmit({ tipper: val.value === '1' ? true : false })
            }}
          />
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

export default TruckWidget

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
