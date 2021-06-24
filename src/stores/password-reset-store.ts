import { AxiosResponse } from 'axios';
import { types, flow } from 'mobx-state-tree';
import PasswordApi, { ChangePasswordPayload, IResetPasswordDTO } from '../services/password-api';

const password = types.model({
  message: types.maybeNull(types.string),
  alreadySent: types.maybeNull(types.boolean),
})

export const PasswordResetStore = (types
  .model('PasswordStore', {
    fetching: false,
    data_password: password,
    error_password: types.maybeNull(types.string),
  })
  .actions((self) => ({
    resetPassword: flow(function* resetPassword(email: string) {
      self.fetching = true;
      self.data_password = {
        message: null,
        alreadySent: null,
      };
      self.error_password = null;

      try {
        const response: AxiosResponse<IResetPasswordDTO> = yield PasswordApi.ResetPasswordApi(email);
        console.log('resetPassword response :>', response);
        if (response && response.status === 200) {
          self.fetching = false;
          const { message, alreadySent } = response.data;
          if (message != undefined || alreadySent != undefined) {
            self.data_password = { message, alreadySent };
            self.error_password = null;
            return;
          }
        }
      } catch (error) {
        console.error('Failed to request password store :>', error);
      }
      self.fetching = false;
      self.data_password = {
        alreadySent: null,
        message: null,
      };
      self.error_password = 'Failed to request password store';
    }),
  }))
);
