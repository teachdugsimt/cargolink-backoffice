import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select, { OptionType, ValueType } from '@atlaskit/select';
import { toFirstLetterUpperCase } from '../../../utils';
import { observer } from "mobx-react-lite";
import { useMst } from '../../../stores/root-store';

interface SelectorProps {
  placeholder?: string;
  onSelect: (value: string) => any;
  maxWidth?: string;
  includeNone?: boolean;
  noResultsMessage?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
}

const ProvincesSelector = observer((props: SelectorProps) => {
  const { placeholder, includeNone, maxWidth, onSelect, noResultsMessage, isRequired, isInvalid } = props
  const [options, setoptions] = useState<Array<any>>([])
  const { versatileStore } = useMst();

  const onSelected = (selectingOption: ValueType<OptionType, false>) => {
    if (
      includeNone &&
      options.findIndex((option) => option.label === selectingOption?.label) === 0
    ) {
      return onSelect('none');
    }
    return onSelect(selectingOption?.value + '' || 'none');
  };

  useEffect(() => {
    const listDropdown = JSON.parse(JSON.stringify(versatileStore.province))
    if(listDropdown) {
      const tmpOptions = [{ label: toFirstLetterUpperCase(placeholder || 'Select'), value: 0 }, ...listDropdown]
      setoptions(tmpOptions)
    }
  }, [JSON.stringify(versatileStore.province)])

  return (
    <Selecty
      maxWidth={maxWidth}
      defaultOptions
      options={options}
      placeholder={placeholder ? toFirstLetterUpperCase(placeholder) : undefined}
      onChange={onSelected}
      noOptionsMessage={() => noResultsMessage || 'no results'}
      isRequired={isRequired}
      isInvalid={isInvalid}
    />
  );
})

interface SelectStyleProps {
  maxWidth?: string;
}
const Selecty = styled(Select) <SelectStyleProps>`
  min-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '300px')};
`;
export default ProvincesSelector
