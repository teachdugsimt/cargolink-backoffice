import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';


class LoginApi {
  LoginApi = async (params: LoginPayload): Promise<AxiosResponse<LoginResponse>> => {
    const response = await ExcuteApi('/api/v1/auth/login', params, 'post', 300000, false, true);
    return response;
  };
  LogoutApi = async (idToken: string): Promise<AxiosResponse<LogoutResponse>> => {
    const response = await ExcuteApi('/api/v1/users/logout', { token: idToken }, 'post', 3e5, true, true);
    return response;
  }
}
export default new LoginApi();

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokensList {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface ITerms {
  version: string;
  accepted: boolean;
  data: string;
}

export interface LoginResponse {
  message: string;
  responseCode: number;
  userProfile: {
    id: string;
    userId: string;
    companyName: string;
    fullname: string;
    email: string;
    avatar: string | null;
  }
  token: TokensList;
  termOfService: ITerms;
}

export interface LogoutResponse {};