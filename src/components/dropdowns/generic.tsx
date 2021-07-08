import React from 'react';
import styled from 'styled-components';
import Select, { OptionsType, OptionType, ValueType } from '@atlaskit/select';

interface DropdownProps {
  onChange: (option: ValueType<OptionType, false>) => any;
  options: OptionsType;
  placeholder?: string;
  minWidth?: string;
}
const Dropdown = (props: DropdownProps) => {
  const { onChange, options, placeholder, minWidth = '200px' } = props;
  return (
    <Wrapper minWidth={minWidth}>
      <Select options={options} placeholder={placeholder} onChange={onChange} />
    </Wrapper>
  );
}

interface WrapperProps {
  minWidth: string;
}
const Wrapper = styled.div<WrapperProps>`
  display: flex;
  min-width: ${({ minWidth }) => minWidth};
  align-items: stretch;
  
  & > div {
    width: 100%;
  }
`;


export default Dropdown;