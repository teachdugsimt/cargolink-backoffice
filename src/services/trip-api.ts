import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class TripApi {
  addBulkTrip = async (params: IPostTripProps) => {
    const response: any = await ExcuteApi(`/api/v1/trips/bulk`, params, 'post', 6e5, true, true);
    return response;
  };

  getTrip = async (params: IPostTripProps) => {
    const response: any = await ExcuteApi(`/api/v1/trips/`, params, 'get', 6e5, true, true);
    return response;
  };

  getTripDetail = async (id: string) => {
    const response: any = await ExcuteApi(`/api/v1/trips/${id}`, {}, 'get', 6e5, true, true);
    return response;
  };

  updateTrip = async (id: string, data: IUpdateTripProps) => {
    const response: any = await ExcuteApi(`/api/v1/trips/${id}`, data, 'patch', 6e5, true, true);
    return response;
  };

  updateJobTrip = async (jobId: string, data: IPatchTripProps) => {
    const response: any = await ExcuteApi(`/api/v1/trips/jobs/${jobId}`, data, 'patch', 6e5, true, true);
    return response;
  };

  delete = async (id: string) => {
    const response: any = await ExcuteApi(`/api/v1/trips/${id}`, {}, 'delete', 6e5, true, true);
    return response;
  };
}

export default new TripApi();

export interface IPostTripProps {
  jobId: string;
  trucks: {
    id: string;
    startDate: string;
  };
}

export interface IPatchTripProps {
  trucks: {
    id: string;
    startDate: string;
  };
}

export interface IUpdateTripProps {
  shipperPricePerTon?: number;
  shipperPaymentStatus?: 'PAYMENT_DUE' | 'PAID' | 'VOID';
  shipperBillStartDate?: string;
  shipperPaymentDate?: string;

  weightStart?: number;
  weightEnd?: number;
  carrierPricePerTon?: number;
  bankAccountId?: string;
  carrierPaymentStatus?: 'PAID' | 'AWAITING' | 'APPROVED' | 'REJECTED' | 'ISSUED';
  carrierPaymentDate?: string;

  status?: "REJECTED" | "DONE" | "OPEN" | "IN_PROGRESS"
}
