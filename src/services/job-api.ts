import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class JobApi {
  getJobsList = async (params: JobListParams) => {
    const response: AxiosResponse<JobsListResponse> = await ExcuteApi(`/api/v1/jobs`, params, 'get', 6e5, true, true);
    return response;
  };
  getJobById = async (params: IJobRequest) => {
    const response: AxiosResponse<IJob> = await ExcuteApi('/api/v1/jobs/' + params.jobId, {}, 'get', 6e5, true, true);
    return response;
  };

  createJob = async (params: PostJobParams) => {
    const response: AxiosResponse<CreateJobResponse> = await ExcuteApi(
      `/api/v1/jobs/`,
      params,
      'post',
      6e5,
      true,
      true,
    );
    return response;
  };
}

export default new JobApi();

export interface JobsListResponse {
  data: IJob[];
  currentPage: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
export interface JobListParams {
  page: number;
  descending: boolean;
  productName?: string;
  owner?: string;
  productType?: string;
  from?: string; //? name in Thai
  to?: string; //? name in Thai
  weight?: number;
  minWeight?: number;
  maxWeight?: number;
  sortBy?: string;
  rowsPerPage?: number;
  status?: string;
  truckAmountMin?: number;
  truckAmountMax?: number;
  truckType?: string;
  type?: number;
  textSearch?: string;
}

export interface IJobRequest {
  jobId: string;
}
export interface IJob {
  id: string;
  productTypeId: number; //? -1 is null.
  productName: string;
  truckType: string; //? should be number if mobx parse error, check here
  weight: number;
  from: IDestination;
  to: IDestination[];
  owner: IOwner;
  status: number;
  quotations: string[]; //? should be changed in future.
  price: number;
  priceType: 'PER_TRIP' | 'PER_TON';
  tipper: boolean;
  createdAt: string;
}

export interface IDestination {
  name: string | null;
  dateTime: string | null;
  contactName: string | null;
  contactMobileNo: string | null;
  lat: string;
  lng: string;
}

export interface IOwner {
  id: number;
  userId: string;
  fullName: string | null;
  email: string | null;
  mobileNo: string;
  avatar: {
    //? infer
    object: string | null;
  };
}

export interface PostJobParams {
  truckType?: string;
  truckAmount?: number | null;
  productTypeId?: string;
  productName?: string;
  weight?: number | null;
  price?: number | null;
  tipper?: boolean;
  priceType?: string;
  expiredTime?: string;
  note?: string;
  publicAsCgl?: boolean;
  from?: IDestination;
  to?: IDestination[];
  platform?: number;
  userId?: string;
}

export interface CreateJobResponse {
  id: string;
}
