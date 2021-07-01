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
}

export default new TruckApi();

export interface TrucksListParams {
  page: number;
  descending: boolean;
  sortBy?: string[];
  rowsPerPage?: number;
  truckTypes?: string;
  workingZones?: string;
}

export interface TrucksListResponse {
  data: ITruck[];
  size: number;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
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
  registrationNumber: string[];
  stallHeight: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  tipper: boolean;
  createdAt: string;
  updatedAt: string;
  quotationNumber: null;
  workingZones: IZone[];
  owner: IOwner;
}

export interface IZone {
  region: number;
  province: number;
}
