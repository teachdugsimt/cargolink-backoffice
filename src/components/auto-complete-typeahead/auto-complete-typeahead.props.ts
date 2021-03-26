export interface AutoCompleteTypeaheadProps {
  data: Array<{
    type: 'district' | 'amphoe' | 'province' | 'zipcode';

    label: string;

    breakPoint?: {
      xs?: number;

      sm?: number;

      md?: number;

      lg?: number;
    };
  }>;

  handleValue: (value: any) => void;
}
