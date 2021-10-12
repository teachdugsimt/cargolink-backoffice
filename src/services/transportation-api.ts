import types from '@atlaskit/dropdown-menu';
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

  getTransportationDetailByJobId = async (jobId: string) => {
    const response: AxiosResponse<IJob> = await ExcuteApi(
      `/api/v1/booking/transportation/${jobId}`,
      {},
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
  trips: ITrips[];
  status: 'NEW' | 'INPROGRESS' | 'CANCELLED' | 'DONE' | 'EXPIRED';
  tipper: boolean;
  price: number | string;
  priceType: 'PER_TRIP' | 'PER_TON';
  createdAt: string | null;
  component?: any;
  children?: any;
  index?: number;
}

export interface ITrips {
  id: string;
  price: number | null;
  truck: ITruck2;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'REJECTED';
  weight: number | null;
  createdAt: string | null;
  createdUser: string | null;
  jobCarrierId: number | null;
}

export interface ITruck2 {
  id: string | null;
  owner: {
    id: number;
    email: string | null;
    avatar: {
      object: string | null;
    } | null;
    fullName: string | null;
    mobileNo: string | null;
    companyName: string | null;
    userId: string | null;
  } | null;
  tipper: boolean;
  carrierId: string | null;
  createdAt: string | null;
  truckType: number | null;
  updatedAt: string | null;
  workZones: Array<{
    region: number;
    province?: number | null;
  }> | null;
  stallHeight: string | null;
  truckPhotos: {
    front?: { object?: string | null } | null;
    back?: { object?: string | null } | null;
    left?: { object?: string | null } | null;
    right?: { object?: string | null } | null;
  } | null;
  approveStatus: 'INACTIVE' | 'ACTIVE';
  loadingWeight: number | null;
  registrationNumber: string[] | null;
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
  where?: {
    truckType?: string;
    fullTextSearch?: string;
    trips?: 'NULL' | 'NOT_NULL';
    id?: string;
  };
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
  dateTime: string | null;
  contactName: string | null;
  contactMobileNo: string | null;
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

export interface TransportationFilter {
  page: number;
  rowsPerPage?: number;
  descending?: boolean;
  sortBy?: string;
  where?: {
    trips?: 'NULL' | 'NOT_NULL';
    id?: string;
    fullTextSearch?: string;
  };
}
