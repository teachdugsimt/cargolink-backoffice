import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite';
import InlineEdit from '@atlaskit/inline-edit';
import styled from 'styled-components'
import images from '../../Themes/images'
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import Select, { ValueType } from '@atlaskit/select';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { PostTruckParams } from '../../../services/truck-api';
import Textfield from '@atlaskit/textfield';
import RadioButton, { ObjectRoundButton } from './radio-button'


interface TruckWidgetProps {
  title?: boolean | string | null | undefined
  truckType: string | number | null | undefined
  tipper: boolean | null | undefined
  truckAmount?: string | number | null | undefined
  loadingWeight?: string | number | null | undefined
  registrationNumber?: Array<string> | null | undefined
  stallHeight?: string | null | undefined
}

interface OptionType {
  label: string;
  value: string;
}

const TruckWidget = observer((props: TruckWidgetProps) => {
  const {
    title, truckType, tipper,
    truckAmount, loadingWeight,
    stallHeight, registrationNumber } = props
  type Fields = 'truckType' | 'stallHeight' | 'loadingWeight' | 'tipper' | 'registrationNumber' | 'image';
  const { t } = useTranslation();
  const { versatileStore, truckTypesStore, truckStore } = useMst();
  const [optionsTruckTypes, setOptionsTruckTypes] = useState<Array<any>>([])
  const truckReqHeight: Array<number> = [9, 15, 24, 23, 3]
  const [reqHeight, setreqHeight] = useState<boolean>(false)
  const [dumpy, setdumpy] = useState<Array<ObjectRoundButton>>([{ label: t("DUMP"), value: true, active: tipper == true ? true : false },
  { label: t("NO_DUMP"), value: false, active: tipper == true ? false : true }])

  const _getStallHeightList = (truckType: string | number | null | undefined, outputType: 'boolean' | 'array' = 'boolean') => {
    let plzSelect = { label: t('pleaseselect'), value: 'Please select' }
    let low = { label: t("LOW"), value: "LOW" }
    let medium = { label: t("MEDIUM"), value: "MEDIUM" }
    let height = { label: t("HIGH"), value: "HIGH" }
    let res = [plzSelect]
    let default_height = [plzSelect, low, medium, height]

    if (!truckType) {
      if (outputType == 'boolean')
        setreqHeight(false)
      else
        return default_height
    }

    let slotTruck = JSON.parse(JSON.stringify(versatileStore.list)).find((e: any) => e.id == truckType)
    let requiredStallHeight = false
    if (slotTruck) {
      let tmpTruckType = slotTruck.name.replace(/\s+/g, '').toLowerCase();
      if (tmpTruckType.includes("trailer") || tmpTruckType.includes("เทรเลอร์") || tmpTruckType.includes("18ล้อ")
        || tmpTruckType.includes("หัวลาก") || tmpTruckType.includes("รถพ่วง")) {
        if (Number(truckType) == 23) requiredStallHeight = true
        let lowTrailer = " (1.50 - 1.80 m)"
        let mediumTrailer = " (1.80 - 2.00 m)"
        let heightTrailer = " (2.20 - 2.50 m)"
        low.label = low.label + lowTrailer
        medium.label = medium.label + mediumTrailer
        height.label = height.label + heightTrailer
        res.push(low, medium, height)
      }
      else if (tmpTruckType.includes("4wheels") || tmpTruckType.includes("4ล้อ")) {
        if (Number(truckType) == 3) requiredStallHeight = true
        let low4Wheels = " (~ 1.4 m)"
        let height4Wheels = " (~ 2.1 m)"
        low.label = low.label + low4Wheels
        height.label = height.label + height4Wheels
        res.push(low, height)
      } else if (tmpTruckType.includes("6wheels") || tmpTruckType.includes("6ล้อ")) {
        if (Number(truckType) == 9) requiredStallHeight = true
        let low6Wheels = " (~ 2.0 m)"
        let height6Wheels = " (~ 3.0 m)"
        low.label = low.label + low6Wheels
        height.label = height.label + height6Wheels
        res.push(low, height)
      } else if (tmpTruckType.includes("10wheels") || tmpTruckType.includes("10ล้อ")) {
        if (Number(truckType) == 15 || Number(truckType) == 24) requiredStallHeight = true
        let medium10Wheels = " (~ 2.5 m)"
        medium.label = medium.label + medium10Wheels
        res.push(medium)
      }
      else {
        res.push(low, medium, height)
      }

      if (outputType == 'boolean')
        setreqHeight(requiredStallHeight)
      else
        return res

    } else {

      if (outputType == 'boolean')
        setreqHeight(requiredStallHeight)
      else
        return default_height
    }
  }



  useEffect(() => {
    if (typeof truckType == 'string' || typeof truckType == 'number')
      _getStallHeightList(truckType, 'boolean')
    if (!versatileStore.list || !versatileStore.listDropdown) versatileStore.find()
  }, []);

  console.log("Tipper props :: ", tipper)
  console.log("Dumpy state :: ", dumpy)

  useEffect(() => {
    let tmpDumpy = dumpy
    tmpDumpy.forEach((e: ObjectRoundButton) => {
      if (e.value == tipper) e.active = true
      else e.active = false
    })
    console.log("TMP DUMPY :: ", tmpDumpy)
    setdumpy(tmpDumpy)
  }, [tipper])

  useEffect(() => {
    let tmpTruckOptions = JSON.parse(JSON.stringify(versatileStore.listDropdown))
    if (tmpTruckOptions) setOptionsTruckTypes(tmpTruckOptions)
  }, [JSON.stringify(versatileStore.listDropdown)])

  const handleSave = async (field: Fields, value: any) => {
    console.log("FIELD :: ", field)
    console.log("Value select :; ", value)
    const payload: Partial<PostTruckParams> = {
      [field]: field == "registrationNumber" ?
        value.split(',') : value
    };
    if (typeof title == 'string') {
      await truckStore.patchTruck(payload, title)
      truckStore.getTruckById({ truckId: title })
    }
  };
  let truckName: any
  if (truckType)
    truckName = truckTypesStore.truckTypeNameById(truckType)


  let stallHeightList: any = truckType ? null : _getStallHeightList(truckType, 'array')
  if (typeof truckType == 'number' || typeof truckType == 'string') {
    console.log("Can select stall height :: ", truckReqHeight.includes(+truckType))
    stallHeightList = _getStallHeightList(truckType, 'array')
  }
  console.log("Stall height :: ", stallHeight)
  console.log("Stall height options :: ", stallHeightList)
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
          <InlineEdit<ValueType<OptionType, true>>
            defaultValue={truckType}
            editView={(fieldProps) => (
              <EditViewContainer>
                <Select {...fieldProps} options={optionsTruckTypes} autoFocus openMenuOnFocus />
              </EditViewContainer>
            )}
            readView={() => (
              <ReadViewContainer data-testid="truckTypeField">
                {truckName?.name || ''}
              </ReadViewContainer>
            )}
            onConfirm={(value) => {
              if (value?.value)
                return handleSave('truckType', value.value);
            }}
          />
        </Col>
        <Col flex={1}>
          <Label>คอก</Label>
          {/* <Value>{stallHeight || '-'}</Value> */}
          <InlineEdit<ValueType<OptionType, true>>
            defaultValue={stallHeight}
            editView={(fieldProps) => (
              <EditViewContainer>
                <Select {...fieldProps} isDisabled={typeof truckType == 'string' || typeof truckType == 'number' ?
                  (!truckReqHeight.includes(+truckType) ? true : false) : false} options={stallHeightList} autoFocus openMenuOnFocus />
              </EditViewContainer>
            )}
            readView={() => (
              <ReadViewContainer data-testid="stallHeightField">
                {stallHeight || 'Please select'}
              </ReadViewContainer>
            )}
            onConfirm={(value) => {
              if (value?.value)
                return handleSave('stallHeight', value.value);
            }}
          />
        </Col>
      </Row>

      <Row>
        {props.hasOwnProperty('truckAmount') && <Col flex={1}>
          <Label>จำนวนรถที่ต้องการ</Label>
          <Value>{truckAmount || '-'}{' คัน'}</Value>
        </Col>}

        {props.hasOwnProperty('loadingWeight') && <Col flex={1}>
          <Label>น้ำหนักบรรทุก</Label>
          <InlineEdit
            defaultValue={loadingWeight}
            editView={({ errorMessage, ...fieldProps }) => (
              <Textfield {...fieldProps} css={{ width: '100%' }} autoFocus />
            )}
            readView={() => (
              <ReadViewContainer data-testid="userFullname">
                <WeightT isNoData={!loadingWeight}>{loadingWeight || "-"}{" " + t("ton")}</WeightT>
              </ReadViewContainer>
            )}
            onConfirm={(value) => {
              if (!value) return;
              return handleSave('loadingWeight', value);
            }}
          />
        </Col>}

        <Col flex={1}>
          <Label>การลงสินค้า</Label>
          <RadioButton list={dumpy} onPress={(items: ObjectRoundButton) => handleSave('tipper', items.value)} />
        </Col>
      </Row>

      <Row>
        {registrationNumber && <Col flex={1}>
          <Label>เลขทะเบียน</Label>
          {/* <Value>{registrationNumber.join(', ')}</Value> */}
          <InlineEdit
            defaultValue={registrationNumber.join(', ')}
            editView={({ errorMessage, ...fieldProps }) => (
              <Textfield {...fieldProps} css={{ width: '100%' }} autoFocus />
            )}
            readView={() => (
              <ReadViewContainer data-testid="userFullname">
                <WeightT isNoData={!registrationNumber}>{registrationNumber.join(', ') || "-"}</WeightT>
              </ReadViewContainer>
            )}
            onConfirm={(value) => {
              console.log("Vlaue REGISTRATION NUMBER :: => ", value)
              if (!value) return;
              return handleSave('registrationNumber', value);
            }}
          />
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


const EditViewContainer = styled.div`
  z-index: 300;
  position: relative;
  width: 200px;
`;

const ReadViewContainer = styled.div`
  display: flex;
  // font-size: ${fontSize()}px;
  // line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  // min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: 5px ${gridSize() - 2}px;
  word-break: break-word;
`;


interface TextWeightProps {
  isNoData?: boolean;
}
const WeightT = styled.p<TextWeightProps>`
  color: ${({ isNoData }) => (isNoData ? '#AAA' : 'inherit')};
  margin: 0 0 10px 0;
  font-size: 1.125rem;
  font-weight: 700;

  :first-letter {
    text-transform: capitalize;
  }
`;
