import { CSSProperties, ReactNode } from 'react';

export interface FormEditProps {
  label?: string;

  value?: string;

  showEditIcon?: boolean;

  containerStyle?: CSSProperties;

  labelStyle?: CSSProperties;

  valueStyle?: CSSProperties;

  type?: 'text' | 'dropdown';

  dropDownOption?: Array<{
    label: string;
    value: string | number;
    isSelected?: boolean;
  }>;

  validateMessage?: string;

  messageForCheck?: string;

  handleSave?: (value: string | number | object) => void;

  validateForm?: (value: any) => any;
}
