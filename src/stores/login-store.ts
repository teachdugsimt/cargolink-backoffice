import { types, flow } from 'mobx-state-tree';
import { LoginApi } from '../services';

const token = types.model({
  idToken: types.string,
});

const profile = types.model({
  id: types.maybeNull(types.number),
  loginId: types.maybeNull(types.string),
  firstName: types.maybeNull(types.string),
  lastName: types.maybeNull(types.string),
  role: types.maybeNull(types.string),
  roles: types.maybeNull(types.array(types.string)),
});

export const LoginStore = types
  .model('LoginStore', {
    language: types.string,
    fetching_login: false,
    data_signin: token,
    error_login: types.string,
    data_profile: types.maybeNull(profile),

    rememberProfile: types.boolean
  })
  .actions((self) => {
    return {
      setRememberProfile(val: boolean) {
        self.rememberProfile = val
      },

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
          const response = yield LoginApi.LoginApi(params);
          console.log('requestLogin response :> ', response);
          if (response && response.ok) {
            const responseHeader = response.headers.authorization;
            const { data } = response;
            self.fetching_login = false;
            const data_signin = {
              idToken: data.token.idToken,
            };
            self.data_signin = data_signin;
            self.error_login = '';
            self.data_profile = {
              id: data.id,
              loginId: data.loginId,
              firstName: data.firstName,
              lastName: data.lastName,
              role: data.role,
              roles: data.roles,
            };
            localStorage.setItem('profileLocal', JSON.stringify(data_signin));
          } else {
            self.fetching_login = false;
            self.data_signin = {
              idToken: '',
            };
            const { validMsgList } = response.data;
            if (validMsgList && validMsgList['']) self.error_login = validMsgList[''][0];
            else self.error_login = response.originalError.message;
          }
        } catch (error) {
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
        localStorage.removeItem('profileLocal')
        self.error_login = '';
        self.rememberProfile = false
      }),
    };
  })
  .views((self) => ({
    get loginData() {
      return self;
    },
  }));
