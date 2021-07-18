import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'

interface ProductTypeWidgetProps {
  productTypeId: number | string
}

const ProductTypeWidget = observer((props: ProductTypeWidgetProps) => {

  const { productTypesStore } = useMst()
  const [productTypeName, setProductTypeName] = useState('')

  useEffect(() => {
    const productType = productTypesStore.productTypeNameById(props.productTypeId)
    setProductTypeName(productType?.name || '')
  }, [props.productTypeId])

  // useEffect(() => {
  //   const productType = productTypesStore.productTypeNameById(props.productTypeId)
  //   setProductTypeName(productType?.name || '')
  // }, [productTypesStore.data])

  return <>{productTypeName}</>
})

export default ProductTypeWidget
