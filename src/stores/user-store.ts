import { types, flow } from 'mobx-state-tree';
import userApi from '../services/user-api';

const user = types.model({
  fullName: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  registerDate: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  jobCount: types.maybeNull(types.number),
  truckCount: types.maybeNull(types.number),
});

export const UserStore = types
  .model('UserStore', {
    loading: false,
    success_response: false,
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
    data_user: types.maybeNull(types.array(user)),
  })
  .actions((self) => {
    return {
      getUser: flow(function* getUser(params) {
        self.loading = true;
        self.data_user = null;
        self.error_response = null;
        try {
          const response = yield userApi.User(params);
          console.log('getUser response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.data_user = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'GET user : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getUser :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all drivers by carrier',
          };
        }
      }),
    };
  });
