import React from 'react';
import styled from 'styled-components';
import { AsyncSelect, OptionsType, OptionType, ValueType } from '@atlaskit/select';
import { toFirstLetterUpperCase } from '../../utils';

interface SelectorProps {
  placeholder?: string;
  onSelect: (value: string) => any;
  maxWidth?: string;
  includeNone?: boolean;
  noResultsMessage?: string;
  isRequired?: boolean;
}
interface SelectorState {
  options: OptionsType;
  items: any[];
  inputValue: string;
}

export default abstract class AsyncSelector extends React.Component<SelectorProps, SelectorState> {
  state: SelectorState = { items: [], options: [], inputValue: '' };

  onSelected = (selectingOption: ValueType<OptionType, false>) => {
    if (
      this.props.includeNone &&
      this.state.options.findIndex((option) => option.label === selectingOption?.label) === 0
    ) {
      return this.props.onSelect('none');
    }
    return this.props.onSelect(selectingOption?.value + '' || 'none');
  };

  abstract fetch(params?: string): any;

  handleInputChange = (search: string) => {
    const inputValue = search.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  insertPlaceholderIfRequired = () => {
    const { options } = this.state;
    if (this.props.includeNone)
      this.setState({
        options: [{ label: toFirstLetterUpperCase(this.props.placeholder || 'Select'), value: 0 }, ...options],
      });
  };

  render() {
    const { placeholder } = this.props;

    const filterTypes = async (inputValue: string) => {
      await this.fetch(inputValue);
      this.insertPlaceholderIfRequired();
      return this.state.options.filter(({ label }) => label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const promiseOptions = (inputValue: string) => new Promise((resolve) => resolve(filterTypes(inputValue)));

    return (
      <Select
        maxWidth={this.props.maxWidth}
        defaultOptions
        loadOptions={promiseOptions}
        placeholder={placeholder ? toFirstLetterUpperCase(placeholder) : undefined}
        onChange={this.onSelected}
        noOptionsMessage={() => this.props.noResultsMessage || 'no results'}
        isRequired={this.props.isRequired}
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
