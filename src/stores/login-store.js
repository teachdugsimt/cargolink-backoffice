import { types, flow, castToSnapshot } from 'mobx-state-tree';
import { LoginApi } from '../services';
import { persist } from 'mobx-persist';

const token = types.model({
  idToken: types.string,
});

export const LoginStore = types
  .model('LoginStore', {
    fetching_login: false,
    data_signin: token,
    error_login: types.string,
  })
  .actions((self) => {
    return {
      requestLogin: flow(function* requestLogin(params) {
        self.fetching_login = true;
        try {
          // ... yield can be used in async/await style
          const response = yield LoginApi.LoginApi(params);
          console.log('requestLogin response :> ', response);
          if (response && response.ok) {
            const responseHeader = response.headers.authorization;
            self.data_signin = {
              idToken: responseHeader,
            };
            self.fetching_login = false;
            self.error_login = '';
          } else {
            self.fetching_login = false;
            self.data_signin = {
              idToken: '',
            };
            self.error_login = response.data.validMsgList['']
              ? response.data.validMsgList[''][0]
              : 'Phone Number or Password is invalid';
          }
        } catch (error) {
          // ... including try/catch error handling
          console.error('Failed to request login store :> ', error);
          self.fetching_login = false;
          self.data_signin = {
            idToken: '',
          };
          self.error_login = 'Failed to request login store';
        }
      }),
    };
  })
  .views((self) => ({
    getLoginData() {
      return self;
    },
  }))
  .create({
    loading: false,
    data_signin: {
      idToken: '',
    },
    error_login: '',
  });
