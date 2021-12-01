import ExcuteApi from './api-integrations/excute-api';
import { DocumentStatus, IUserDTO } from '../stores/user-store';
import { AxiosResponse } from 'axios';
class UserApi {
  getUsersList = async (params: GetUsersListParams): Promise<AxiosResponse<GetUsersListResponse>> => {
    const response = await ExcuteApi('/api/v1/users', params, 'get', 600000, true, true);
    return response;
  };
  getUser = async (userId: string) => {
    const response = await ExcuteApi('/api/v1/users/' + userId, null, 'get', 6e5, true, true);
    return response;
  };
  getUploadLink = async (userId: string): Promise<AxiosResponse<GetUploadLinkResponse>> => {
    const response = await ExcuteApi(`/api/v1/users/${userId}/gen-doc-upload-link`, {}, 'post', 6e5, true, true);
    return response;
  };
  createUser = async (payload: CreateUserPayload): Promise<AxiosResponse<CreateUserResponse>> => {
    const response = await ExcuteApi(`/api/v1/users`, payload, 'post', 6e5, true, true);
    return response;
  };
  editUser = async (userId: string, payload: Partial<PatchUser>) => {
    const response = await ExcuteApi(`/api/v1/users/${userId}`, payload, 'patch', 6e5, true, true);
    return response;
  };
  changeDocStatus = async (userId: string, payload: ChangeDocStatusPayload) => {
    const response = await ExcuteApi(`/api/v1/users/${userId}/doc-status`, payload, 'patch', 6e5, true, true);
    return response;
  };
  deleteUser = async (userId: string) => {
    const response = await ExcuteApi(`/api/v1/users/${userId}`, {}, 'delete', 6e5, true, true);
    return response;
  };
  deleteUserDoc = async (userId: string, attachCode: string) => {
    const response = await ExcuteApi(
      `/api/v1/users/${userId}/document`,
      { docId: attachCode },
      'delete',
      6e5,
      true,
      true,
    );
    console.log('Response delete doc : ', response);
    return response;
  };

  checkLineProfile = async (params: ParamsCheckLineProfile) => {
    const response = await ExcuteApi('/api/v2/users/check-line-oa', params, 'get', 6e5, true, true);
    return response;
  };
  checkLineProfileV2 = async (params: ParamsCheckLineProfileV2) => {
    const response = await ExcuteApi('/api/v2/users/check-line-oa-v2', params, 'get', 6e5, true, true);
    return response;
  };

  createUserWithLine = async (payload: CreateUserLineLiff): Promise<AxiosResponse<CreateUserResponse>> => {
    const response = await ExcuteApi(`/api/v2/users/add-line-oa`, payload, 'post', 6e5, true, true);
    return response;
  };

  createOrUpdateLineOaBooking = async (payload: CreateOrUpdateLineOaAndBooking): Promise<AxiosResponse<CreateUserResponse>> => {
    const response = await ExcuteApi(`/api/v2/users/add-line-oa-v2`, payload, 'post', 6e5, true, true);
    return response;
  };

}
export default new UserApi();


export interface CreateOrUpdateLineOaAndBooking {
  lineId: string
  jobId: string
  fullName: string
  phoneNumber: string

  truckId?: string
  accepterUserId: string
  requesterType: string
  requesterUserId?: string
}
export interface CreateUserLineLiff {
  lineId: string
  jobId: string
  fullName: string
  phoneNumber: string
}
export interface ParamsCheckLineProfile {
  jobId: string
  lineId: string
  saveHistory?: boolean
}

export interface ParamsCheckLineProfileV2 {
  lineId: string
}

export interface GetUsersListParams {
  page?: number; //? 0 is first
  rowsPerPage?: number;
  descending?: boolean;
  sortBy?: string; //? key to sort
  fullName?: string;
  phoneNumber?: string;
  email?: string;
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
  fullName: string;
  phoneNumber: string;
  email?: string;
  userType: 'SHIPPER' | 'CARRIER' | 'BOTH'; //? fix 0 for now
  legalType: 'INDIVIDUAL' | 'JURISTIC';
  url?: string[];
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
  userType?: 'SHIPPER' | 'CARRIER' | 'BOTH';
}

export interface PatchUser {
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  email?: string;
  legalType?: 'INDIVIDUAL' | 'JURISTIC';
  attachCode?: string[];
  url?: string[];
  documentStatus?: string;
}

export interface EditUserResponse {
  message: string;
  responseCode: number;
  data: any;
}

export interface ChangeDocStatusPayload {
  status: DocumentStatus;
}
