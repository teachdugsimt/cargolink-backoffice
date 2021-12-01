import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class BookingApi {
  bookingPost = async (params: IBookingParams) => {
    const response: any = await ExcuteApi(`/api/v1/booking/line-booking`, params, 'post', 6e5, true, true);
    return response;
  };
}

export default new BookingApi();

export interface IBookingParams {
  jobId: string
  truckId?: string
  accepterUserId: string
  requesterType: 'JOB_OWNER' | 'TRUCK_OWNER'
  requesterUserId: string
}
