import { AxiosResponse } from 'axios';
import { types, flow } from 'mobx-state-tree';
import PasswordApi, { ChangePasswordPayload, IChangePasswordDTO } from "../services/password-api";

const responseType = types.model({
  message: types.maybeNull(types.string),
});

export const PasswordChangeStore = (types
  .model('PasswordChangeStore', {
    fetching: false,
    response: responseType,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    changePassword: flow(function* changePassword(payload: ChangePasswordPayload) {
      self.fetching = true;
      self.response = {
        message: null,
      }
      self.error = null;

      try {
        const response: AxiosResponse<IChangePasswordDTO> = yield PasswordApi.ChangePassword(payload);
        console.log('changePassword response :>', response);
        if (response && response.status === 200) {
          self.fetching = false;
          const { message } = response.data;
          if (!message) throw Error('Message field should not be null');
          if (message === 'TOKEN_DOES_NOT_EXIST') throw Error();
          self.response = { message };
          return;
        }
      } catch (error) {
        console.error('Failed to change password store :>', error);
      }
      self.response = { message: null };
      self.error = 'Failed to change password store';
      self.fetching = false;
    }),
  }))
);

