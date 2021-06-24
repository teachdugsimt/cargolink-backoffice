import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

export interface IResetPasswordDTO {
  message: 'REQUEST_FAILURE' | 'REQUEST_SUCCESS';
  alreadySent: boolean;
}

export interface IChangePasswordDTO {
  message: 'TOKEN_DOES_NOT_EXIST' | 'PASSWORD_DO_NOT_MATCH' | 'REQUEST_SUCCESS';
}

export interface ChangePasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

class PasswordApi {
  ResetPasswordApi = async (email: string): Promise<AxiosResponse<IResetPasswordDTO>> => (
    await ExcuteApi('/api/v1/password/reset-request', { email }, 'post', 3e5, false, true)
  )
  ChangePassword = async (payload: ChangePasswordPayload): Promise<AxiosResponse<IChangePasswordDTO>> => (
    await ExcuteApi('/api/v1/password/reset', payload, 'post', 3e5, false, true)
  )
}

export default new PasswordApi();