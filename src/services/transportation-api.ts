import { AxiosResponse } from 'axios';
import React from 'react';
import ExcuteApi from './api-integrations/excute-api';

class TransportationApi {
  getTransportationList = async (params: TransportationParams) => {
    const response: AxiosResponse<TransportationResponse> = await ExcuteApi(
      `/api/v1/booking/transportation`,
      params,
      'get',
      6e5,
      true,
      true,
    );
    return response;
  };
}

export default new TransportationApi();

export interface TransportationResponse {
  data: IJob[];
  currentPage: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IJob {
  id: string;
  userId: string;
  productTypeId: number; //? -1 is null.
  productName: string;
  truckType: string; //? should be number if mobx parse error, check here
  weight: number;
  requiredTruckAmount: number;
  loadingDatetime: string;
  from: IFromDestination;
  to: IDestination[];
  owner: IOwner;
  quotations: quotations[] | null; //? should be changed in future.
  status: 'WAITING' | 'ACCEPTED' | 'REJECTED';
  requesterType: 'TRUCK_OWNER' | 'JOB_OWNER';
  requesterUserId: null | string;
  accepterUserId: null | string;
  price: number | string;
  priceType: 'PER_TRIP' | 'PER_TON';
  tipper: boolean;
  createdAt: string;
  component?: any;
  children?: any;
}

export interface quotations {
  id: string;
  truck: TruckList;
  avatar: string | undefined;
  fullName: string | undefined;
  bookingDatetime: string | undefined;
}

export interface TruckList {
  id: string | null;
  owner: {
    id: number;
    userId: string;
    companyName: string | null;
    fullName: string | null;
    mobileNo: string | null;
    email: string | null;
    avatar?: {
      object: string;
    } | null;
  } | null;
  tipper: boolean;
  work_zone: Array<{
    region: number;
    province?: number | null;
  }>;
  created_at: string | null;
  truck_type: number | null;
  updated_at: string | null;
  stall_height: string | null;
  truck_photos: {
    front?: { object?: string | null } | null;
    back?: { object?: string | null } | null;
    left?: { object?: string | null } | null;
    right?: { object?: string | null } | null;
  } | null;
  approve_status: 'INACTIVE' | 'ACTIVE';
  loading_weight: number | null;
  registration_number: string[] | null;
}

export interface TransportationParams {
  page: number;
  rowsPerPage?: number;
  descending?: boolean;
  productName?: string;
  owner?: string;
  productType?: string;
  from?: string; //? name in Thai
  to?: string; //? name in Thai
  weight?: number;
  minWeight?: number;
  maxWeight?: number;
  sortBy?: string;
  where?: any;
  truckType?: string;
  searchText?: string;
}

export interface IDestination {
  name: string | null;
  dateTime: string | null;
  contactName: string | null;
  contactMobileNo: string | null;
  lat: string;
  lng: string;
}

export interface IFromDestination {
  name: string | null;
  datetime: string | null;
  contact_name: string | null;
  contact_mobile_no: string | null;
  lat: number;
  lng: number;
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
