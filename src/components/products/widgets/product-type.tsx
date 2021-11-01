import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import Select, { ValueType } from '@atlaskit/select';
import styled from 'styled-components';

interface ProductTypeWidgetProps {
  productTypeId: number | string
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

const ProductTypeWidget = observer((props: ProductTypeWidgetProps) => {

  const { productTypesStore } = useMst()
  const [productTypeName, setProductTypeName] = useState('')
  const [productTypeOptions, setProductTypeOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    if (!productTypesStore.data?.length) {
      productTypesStore.getProductTypes();
    }
  }, []);

  useEffect(() => {
    if (productTypesStore.data?.length) {
      const productType = productTypesStore.productTypeNameById(props.productTypeId)
      setProductTypeName(productType?.name || '')
      setProductTypeOptions(productTypesStore.data?.map((prod: any) => ({
        label: prod.name,
        value: prod.id.toString()
      })))
    }
  }, [props.productTypeId, productTypesStore.data?.length])

  // useEffect(() => {
  //   const productType = productTypesStore.productTypeNameById(props.productTypeId)
  //   setProductTypeName(productType?.name || '')
  // }, [productTypesStore.data])

  // return <>{productTypeName}</>
  return (
    <InlineEdit<ValueType<any>>
      defaultValue={productTypeName}
      editView={(fieldProps) => (
        <EditViewContainer>
          <Select
            {...fieldProps}
            options={productTypeOptions}
            autoFocus
            openMenuOnFocus
            placeholder={productTypeName}
          />
        </EditViewContainer>
      )}
      readView={() => (
        // <ReadViewContainer data-testid="legalTypeField">
        <>{productTypeName}</>
        // </ReadViewContainer>
      )}
      onConfirm={(val) => {
        if (!val.value) return;
        props.onSubmit({ productTypeId: +val.value })
      }}
    />
  )
})

export default ProductTypeWidget
