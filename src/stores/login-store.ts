import { types, flow } from 'mobx-state-tree';
import { LoginApi } from '../services';

const token = types.model({
  idToken: types.string,
});

const profile = types.model({
  id: types.maybeNull(types.number),
  avatar: types.maybeNull(types.string),
  commissionFee: types.maybeNull(types.number),
  fullName: types.maybeNull(types.string),
  loginId: types.maybeNull(types.string),
  multipleAccount: types.maybeNull(types.boolean),
  phoneNumber: types.maybeNull(types.string),
  ratingPoint: types.maybeNull(types.number),
  role: types.maybeNull(types.string),
  status: types.maybeNull(types.boolean),
  title: types.maybeNull(types.string),
});

export const LoginStore = types
  .model('LoginStore', {
    language: types.string,
    fetching_login: false,
    data_signin: token,
    error_login: types.string,
    data_profile: types.maybeNull(profile),
  })
  .actions((self) => {
    return {
      setLanguage: flow(function* setLanguage(param) {
        self.language = param;
        localStorage.setItem('profileLanguage', param);
      }),

      requestLogin: flow(function* requestLogin(params) {
        self.fetching_login = true;
        self.data_signin = {
          idToken: '',
        };
        self.error_login = '';
        self.data_profile = null;

        try {
          // ... yield can be used in async/await style
          const response = yield LoginApi.LoginApi(params);
          console.log('requestLogin response :> ', response);
          if (response && response.ok) {
            const responseHeader = response.headers.authorization;
            const { data } = response;
            self.fetching_login = false;
            const data_signin = {
              idToken: responseHeader,
            };
            self.data_signin = data_signin;
            self.error_login = '';
            self.data_profile = {
              id: data.id,
              avatar: data.avatar,
              commissionFee: data.commissionFee,
              fullName: data.fullName,
              loginId: data.loginId,
              multipleAccount: data.multipleAccount,
              phoneNumber: data.phoneNumber,
              ratingPoint: data.ratingPoint,
              role: data.role,
              status: data.status,
              title: data.title,
            };
            localStorage.setItem('profileLocal', JSON.stringify(data_signin));
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
      requestLogout: flow(function* requestLogout() {
        console.log('requestLogout response :> success');
        self.data_signin = {
          idToken: '',
        };
        self.error_login = '';
      }),
    };
  })
  .views((self) => ({
    get loginData() {
      return self;
    },
  }));
