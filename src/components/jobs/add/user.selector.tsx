import AbstractAsyncSelector from '../../dropdowns/async.abstract';
import { UserApi } from '../../../services';

export default class UserSelectorNew extends AbstractAsyncSelector {
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
        this.setState({ options: usersOptions, items: users });
      } else console.error('search users not ok', response);
    } catch (error) {
      console.error('error when search users', error);
    }
  };

}