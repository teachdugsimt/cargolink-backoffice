import React from 'react';
import styled from 'styled-components';
import { AsyncSelect, OptionsType, OptionType, ValueType } from '@atlaskit/select';
import { IUserDTO } from '../../stores/user-store';
import { UserApi } from '../../services';

interface IUserSelectorProps {
  placeholder?: string;
  noResultsMessage: string;
  onUserSelect: (userId: string) => any;
}
interface IState {
  inputValue: string;
  usersOptions: OptionsType;
  usersList: IUserDTO[];
}
export default class UserSelector extends React.Component<IUserSelectorProps, IState> {
  state: IState = { inputValue: '', usersOptions: [], usersList: [] };

  fetch = async (search: string) => {
    try {
      const response = await UserApi.getUsersList({
        rowsPerPage: 10,
        descending: true,
        fullName: search,
        phoneNumber: search,
        email: search,
      });
      if (response && response.ok) {
        const users = response.data.data;
        const usersOptions = users.map((user) => ({
          label: user.fullName || user.email || user.userId,
          value: user.userId,
        }));
        this.setState({ usersOptions, usersList: users });
      } else console.error('search users not ok', response);
    } catch (error) {
      console.error('error when search users', error);
    }
  };

  handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  onSelected = (selectingOption: ValueType<OptionType, false>) => {
    selectingOption && this.props.onUserSelect(selectingOption.value as string);
  }

  render() {
    const { placeholder, noResultsMessage } = this.props;

    const filterUsers = async (inputValue: string) => {
      await this.fetch(inputValue);
      return this.state.usersOptions.filter(({ label }) => label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const promiseOptions = (inputValue: string) =>
      new Promise((resolve) => {
        return resolve(filterUsers(inputValue))
      });

    return (
      <Select
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        placeholder={placeholder}
        onChange={(selectingOption) => this.onSelected(selectingOption)}
        noOptionsMessage={() => noResultsMessage}
      />
    );
  }
}

const Select = styled(AsyncSelect)`
  min-width: 300px;
`;