import { LoginPayload, LoginResponse } from './../services/login-api';
import { types, flow } from 'mobx-state-tree';
import { LoginApi } from '../services';
import { AxiosResponse } from 'axios';

const token = types.model({
  accessToken: types.string,
  idToken: types.string,
});

const profile = types.model({
  id: types.string,
  companyName: types.string,
  fullname: types.string,
  email: types.string,
  avatar: types.maybeNull(types.string),
});

export const LoginStore = types
  .model('LoginStore', {
    language: types.string,
    fetching_login: false,
    data_signin: token,
    error_login: types.string,
    data_profile: types.maybeNull(profile),

    rememberProfile: types.boolean,
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

      setErrorLogin(val: string) {
        self.error_login = val
      },

      requestLogin: flow(function* requestLogin(params: LoginPayload) {
        self.fetching_login = true;
        self.data_signin = {
          accessToken: '',
          idToken: '',
        };
        self.error_login = '';
        self.data_profile = null;

        try {
          const response = yield LoginApi.LoginApi(params);
          console.log('requestLogin response :> ', response);
          if (response && response.ok) {
            const responseHeader = response.headers.authorization;
            const { data } = response as AxiosResponse<LoginResponse>;
            self.fetching_login = false;
            const data_signin = {
              idToken: data.token.idToken,
              accessToken: data.token.accessToken,
            };
            self.data_signin = data_signin;
            self.error_login = '';
            self.data_profile = data.userProfile;
            localStorage.setItem('profileLocal', JSON.stringify(data_signin));
          } else {
            self.fetching_login = false;
            self.data_signin = {
              accessToken: '',
              idToken: '',
            };
            const { validMsgList } = response.data;
            if (validMsgList && validMsgList['']) self.error_login = validMsgList[''][0];
            else self.error_login = response.originalError.message;
            if (response.data.error === 'NotAuthorizedException') {
              //? invalid email or password
              self.error_login = 'NotAuthorizedException';
            }
          }
        } catch (error) {
          console.error('Failed to request login store :> ', error);
          self.fetching_login = false;
          self.data_signin = {
            idToken: '',
            accessToken: '',
          };
          self.error_login = 'Failed to request login store';
        }
      }),
      requestLogout: flow(function* requestLogout() {
        console.log('requestLogout response :> success');
        self.data_signin = {
          idToken: '',
          accessToken: '',
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
