import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'

interface TruckTypeWidgetProps {
  truckTypeId: number | string
}

const TruckTypeWidget = observer((props: TruckTypeWidgetProps) => {

  const { truckTypesStore } = useMst()
  const [truckTypeName, setTruckTypeName] = useState('')

  useEffect(() => {
    const truckType = truckTypesStore.truckTypeNameById(props.truckTypeId)
    setTruckTypeName(truckType?.name || '')
  }, [props.truckTypeId])

  useEffect(() => {
    const truckType = truckTypesStore.truckTypeNameById(props.truckTypeId)
    setTruckTypeName(truckType?.name || '')
  }, [truckTypesStore.data])

  return <>{truckTypeName}</>
})

export default TruckTypeWidget
