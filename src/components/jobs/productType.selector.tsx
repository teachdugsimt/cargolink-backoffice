import React from 'react';
import styled from 'styled-components';
import { AsyncSelect, OptionsType, OptionType, ValueType } from '@atlaskit/select';
import { ProductTypeApi } from '../../services';
import { IProductType } from '../../services/product-type-api';

interface IProps {
  placeholder?: string;
  onSelect: (productTypeId: string) => any;
  language?: string;
  maxWidth?: string;
  includeNone?: boolean;
}

interface IState {
  typesOptions: OptionsType;
  typesList: IProductType[];
  inputValue: string;
}

export default class ProductTypeSelector extends React.Component<IProps, IState> {
  state: IState = { typesList: [], typesOptions: [], inputValue: '' };

  onSelected = (selectingOption: ValueType<OptionType, false>) => {
    selectingOption && this.props.onSelect(selectingOption.value + '');
  };

  fetch = async () => {
    try {
      const response = await ProductTypeApi.getProductTypes(this.props.language);
      if (response && response.ok) {
        const types = response.data;
        let typesOptions = types.map((type) => ({
          label: type.name,
          value: type.id,
        }));
        if (this.props.includeNone) {
          typesOptions = [{ label: this.props.placeholder || 'Select', value: 0 }, ...typesOptions];
        }
        this.setState({ typesOptions, typesList: types });
      } else console.error('search product types not ok', response);
    } catch (error) {
      console.error('error when search product types', error);
    }
  };

  handleInputChange = (search: string) => {
    const inputValue = search.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  render() {
    const { placeholder } = this.props;

    const filterTypes = async (inputValue: string) => {
      await this.fetch();
      return this.state.typesOptions.filter(({ label }) => label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const promiseOptions = (inputValue: string) => new Promise((resolve) => resolve(filterTypes(inputValue)));

    return (
      <Select
        maxWidth={this.props.maxWidth}
        defaultOptions
        loadOptions={promiseOptions}
        placeholder={placeholder}
        onChange={(selectingOption: ValueType<OptionType, false>) => {
          if (
            this.props.includeNone &&
            this.state.typesOptions.findIndex((option) => option.label === selectingOption?.label) === 0
          ) {
            console.log('fire none')
            return this.onSelected('none');
          }
          return this.onSelected(selectingOption);
        }}
        noOptionsMessage={() => 'Error'}
      />
    );
  }
}

interface SelectStyleProps {
  maxWidth?: string;
}
const Select = styled(AsyncSelect)<SelectStyleProps>`
  min-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '300px')};
`;
