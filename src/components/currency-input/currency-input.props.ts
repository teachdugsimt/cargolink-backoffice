import { CSSProperties, ReactNode } from 'react';

export interface CurrencyInputProps {
  containerStyle?: CSSProperties;

  value?: string;

  placeholder?: string;

  min?: string;

  max?: string;

  unit?: ReactNode;

  onChange?: (e: any) => void;
}
