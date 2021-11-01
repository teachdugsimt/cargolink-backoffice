import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class TruckApi {
  getTrucksList = async (params: TrucksListParams) => {
    const response: AxiosResponse<TrucksListResponse> = await ExcuteApi(
      `/api/v1/trucks/`,
      params,
      'get',
      6e5,
      true,
      true,
    );
    return response;
  };

  getTruckByCarrierId = async (params: TrucksByCarrierParams) => {
    const response: AxiosResponse<TrucksListResponse> = await ExcuteApi(
      `/api/v1/trucks/carrier/${params.carrierId}`,
      {},
      'get',
      6e5,
      true,
      true,
    );
    return response;
  };
  getLinkDownLoad = async (params: string[]) => {
    const response: AxiosResponse<UrlDownload> = await ExcuteApi(
      `/api/v1/media/file-by-attach-code`,
      { url: JSON.stringify(params) },
      'get',
      6e5,
      true,
      true,
    );
    return response;
  };

  getTruckById = async (params: TruckRequestParams) => {
    const response: AxiosResponse<TrucksListResponse> = await ExcuteApi(
      `/api/v1/trucks/${params.truckId}`,
      {},
      'get',
      6e5,
      true,
      true,
    );
    return response;
  };

  addTruck = async (params: PostTruckParams) => {
    const response: AxiosResponse<CreateTruckResponse> = await ExcuteApi(
      `/api/v1/trucks/`,
      params,
      'post',
      6e5,
      true,
      true,
    );
    return response;
  };
  patchTruck = async (params: PostTruckParams, id: string) => {
    const response: AxiosResponse<boolean> = await ExcuteApi(`/api/v1/trucks/${id}`, params, 'put', 6e5, true, true);
    return response;
  };
  patchTruckImg = async (params: PatchTruckImgParams, id: string) => {
    const response: AxiosResponse<boolean> = await ExcuteApi(`/api/v1/trucks/${id}`, params, 'put', 6e5, true, true);
    return response;
  };
  changeDocStatus = async (userId: string, payload: ChangeDocStatusPayload) => {
    const response = await ExcuteApi(`/api/v1/trucks/${userId}/doc-status`, payload, 'patch', 6e5, true, true);
    return response;
  };
}

export default new TruckApi();

export interface TrucksListParams {
  page: number;
  descending: boolean;
  sortBy?: string[];
  rowsPerPage?: number;
  truckTypes?: string;
  workingZones?: string;
  searchText?: string;
  registrationNumber?: string;
  stallHeight?: string;
  loadingWeight?: number;
  status?: 0 | 1;
}

export interface TrucksByCarrierParams {
  carrierId: string;
}

export interface TrucksListResponse {
  data: ITruck[];
  size: number;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}

export interface UrlDownload {
  uri: string[];
}

export interface IOwner {
  id: number | null;
  userId: string;
  fullName: string | null;
  email: string | null;
  mobileNo: string | null;
  avatar: {
    object: null;
  };
}

export interface ITruck {
  id: string;
  approveStatus: string;
  loadingWeight: number;
  truckType: number;
  registrationNumber: string[];
  stallHeight: 'LOW' | 'MEDIUM' | 'HEIGHT' | null;
  tipper: boolean;
  createdAt: string;
  updatedAt: string;
  quotationNumber: number | null;
  workingZones: IZone[];
  owner: IOwner;
  document?: object;
  documentStatus?: string;
}

export interface IZone {
  region: number;
  province: number;
}

export interface TruckRequestParams {
  truckId: string;
}

export interface PostTruckParams {
  carrierId?: string;
  truckTypes?: string;
  loadingWeight?: number;
  stallHeight?: 'LOW' | 'MEDIUM' | 'HEIGHT' | null;
  tipper?: boolean;
  registrationNumber?: string[];
  truckPhotos?: TruckPhotos;
  workingZones?: WorkingZone[];
  document?: string[] | null;
}

export interface PatchTruckImgParams {
  truckPhotos?: {
    front?: PhotoTruck | null | undefined
    back?: PhotoTruck | null | undefined
    left?: PhotoTruck | null | undefined
    right?: PhotoTruck | null | undefined
  }
}

export interface PhotoTruck {
  url?: string | null | undefined
  action?: 'REPLACE' | 'NEW' | 'NO_CHANGE' | 'DELETE'
}

export interface TruckPhotos {
  front: string | null;
  back: string | null;
  left: string | null;
  right: string | null;
}

export interface WorkingZone {
  region: number;
  province: number;
}

export interface CreateTruckResponse extends PostTruckParams {
  id: string;
}

export interface ChangeDocStatusPayload {
  status: DocumentStatus;
}

export enum DocumentStatus {
  NO_DOCUMENT = 'NO_DOCUMENT',
  WAIT_FOR_VERIFIED = 'WAIT_FOR_VERIFIED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}
