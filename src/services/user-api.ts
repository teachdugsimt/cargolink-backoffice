import ExcuteApi from './api-integrations/excute-api';
import { IUserDTO } from '../stores/user-store';
import { AxiosResponse } from 'axios';
class UserApi {
  getUser = async (params: GetUsersListParams) => {
    const response = await ExcuteApi('/api/v1/users', params, 'get', 600000, true, true);
    return response;
  };
  getUploadLink = async (id: string): Promise<AxiosResponse<GetUploadLinkResponse>> => {
    const response = await ExcuteApi(`/api/v1/users/${id}/gen-doc-upload-link`, {}, 'post', 6e5, true, true);
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