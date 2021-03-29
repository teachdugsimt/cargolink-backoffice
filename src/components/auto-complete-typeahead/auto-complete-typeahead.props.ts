export interface AutoCompleteTypeaheadProps {
  data: Array<{
    type: 'district' | 'amphoe' | 'province' | 'zipcode';

    label: string;

    isRequired?: boolean;

    breakPoint?: {
      xs?: number;

      sm?: number;

      md?: number;

      lg?: number;
    };
  }>;

  numberOfRow?: number; // number of result address

  handleValue: (value: any) => void;
}
