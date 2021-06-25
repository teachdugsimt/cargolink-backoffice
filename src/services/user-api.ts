import ExcuteApi from './api-integrations/excute-api';
import { IUserDTO } from '../stores/user-store';
import { AxiosResponse } from 'axios';
class UserApi {
  getUsersList = async (params: GetUsersListParams) => {
    const response = await ExcuteApi('/api/v1/users', params, 'get', 600000, true, true);
    return response;
  };
  getUser = async (userId: string) => {
    const response = await ExcuteApi('/api/v1/users/' + userId, null, 'get', 6e5, true, true);
    return response;
  }
  getUploadLink = async (id: string): Promise<AxiosResponse<GetUploadLinkResponse>> => {
    const response = await ExcuteApi(`/api/v1/users/${id}/gen-doc-upload-link`, {}, 'post', 6e5, true, true);
    return response;
  };
  createUser = async (payload: CreateUserPayload): Promise<AxiosResponse<CreateUserResponse>> => {
    const response = await ExcuteApi(`/api/v1/users`, payload, 'post', 6e5, true, true);
    return response;
  };
  editUser = async (userId: string, payload: Partial<EditUserPayload>) => {
    const response = await ExcuteApi(`/api/v1/users/${userId}`, payload, 'patch', 6e5, true, true);
    return response;
  }
}
export default new UserApi();

export interface GetUsersListParams {
  page?: number; //? 0 is first
  descending?: boolean;
  sortBy?: string; //? key to sort
}

export interface GetUsersListResponse {
  data: IUserDTO[];
  size: number;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}

export interface GetUploadLinkResponse {
  id: string;
  url: string;
}

export interface CreateUserPayload {
  name: string;
  phoneNumber: string;
  email: string;
  userType: 0; //? fix 0 for now
  legalType: 'INDIVIDUAL' | 'JURISTIC';
}

export interface CreateUserResponse extends CreateUserPayload {
  id: number;
}

export interface EditUserPayload {
  name: string;
  phoneNumber: string;
  email: string;
  legalType: 'INDIVIDUAL' | 'JURISTIC';
  attachCode: string[];
}
export interface EditUserResponse {
  message: string;
  responseCode: number,
  data: any;
}