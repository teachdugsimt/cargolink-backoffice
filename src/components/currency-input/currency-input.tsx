import React, { CSSProperties } from 'react';
import { CurrencyInputProps } from './currency-input.props';
import Textfield from '@atlaskit/textfield';

const MAIN: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const UNIT: CSSProperties = {
  position: 'absolute',
  color: '#cfcfcf',
  right: 10,
};

const CurrencyInput = function CurrencyInput(props: CurrencyInputProps) {
  const { containerStyle, unit = 'บาท' } = props;
  const textfieldProps: Omit<CurrencyInputProps, 'containerStyle' | 'unit'> = props;

  return (
    <div style={{ ...MAIN, ...containerStyle }}>
      <span style={UNIT}>{unit}</span>
      <Textfield type={'number'} {...textfieldProps} />
    </div>
  );
};

export default CurrencyInput;
