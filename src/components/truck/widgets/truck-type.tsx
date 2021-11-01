import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import Select, { ValueType } from '@atlaskit/select';
import styled from 'styled-components';

interface TruckTypeWidgetProps {
  truckTypeId: number | string
  onSubmit: (data: any) => void
}

interface OptionType {
  label: string;
  value: string;
}

const EditViewContainer = styled.div`
  z-index: 300;
  position: relative;
  width: 300px;
`;

const TruckTypeWidget = observer((props: TruckTypeWidgetProps) => {

  const { truckTypesStore } = useMst()
  const [truckTypeName, setTruckTypeName] = useState('')
  const [truckTypeOptions, setTruckTypeOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    if (props.truckTypeId && !truckTypeName) {
      const truckType = truckTypesStore.truckTypeNameById(props.truckTypeId)
      setTruckTypeName(truckType?.name || '')
    }
  }, [props.truckTypeId])

  useEffect(() => {
    if (!truckTypesStore.data?.length) {
      truckTypesStore.getTruckTypes();
    }
    return () => {
      setTruckTypeName('')
    }
  }, []);

  useEffect(() => {
    if (truckTypesStore.data?.length) {
      const truckType = truckTypesStore.truckTypeNameById(props.truckTypeId)
      setTruckTypeName(truckType?.name || '')
      setTruckTypeOptions(truckTypesStore.data?.map((prod: any) => ({
        label: prod.name,
        value: prod.id.toString()
      })))
    }
  }, [props.truckTypeId, truckTypesStore.data?.length])

  // useEffect(() => {
  //   const truckType = truckTypesStore.truckTypeNameById(props.truckTypeId)
  //   setTruckTypeName(truckType?.name || '')
  // }, [truckTypesStore.data])

  // return <>{truckTypeName}</>
  return (
    <InlineEdit<ValueType<OptionType>>
      defaultValue={truckTypeName}
      editView={(fieldProps) => (
        <EditViewContainer>
          <Select
            {...fieldProps}
            options={truckTypeOptions}
            autoFocus
            openMenuOnFocus
            placeholder={truckTypeName}
          />
        </EditViewContainer>
      )}
      readView={() => (
        // <ReadViewContainer data-testid="legalTypeField">
        <>{truckTypeName}</>
        // </ReadViewContainer>
      )}
      onConfirm={(val) => {
        if (!val.value) return;
        props.onSubmit({ truckType: val.value })
      }}
    />
  )
})

export default TruckTypeWidget
