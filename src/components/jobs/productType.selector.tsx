import React from 'react';
import styled from 'styled-components';
import { AsyncSelect, OptionsType, OptionType, ValueType } from '@atlaskit/select';
import { ProductTypeApi } from '../../services';
import { IProductType } from '../../services/product-type-api';

interface IProps {
  placeholder?: string;
  onSelect: (truckId: string) => any;
  language?: string;
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
        const typesOptions = types.map((type) => ({
          label: type.name,
          value: type.id,
        }));
        this.setState({ typesOptions, typesList: types });
      } else console.error('search truck types not ok', response);
    } catch (error) {
      console.error('error when search truck types', error);
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
        defaultOptions
        loadOptions={promiseOptions}
        placeholder={placeholder}
        onChange={(selectingOption) => this.onSelected(selectingOption)}
        noOptionsMessage={() => 'Error'}
      />
    );
  }
}

const Select = styled(AsyncSelect)`
  min-width: 300px;
`;
