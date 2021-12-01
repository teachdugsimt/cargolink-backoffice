import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class HistoryCall {
  getJobCallHistory = async (params: IBookingProps) => {
    const response: any = await ExcuteApi(`api/v1/booking/`, params, 'get', 6e5, true, true);
    return response;
  };
}

export default new HistoryCall();

export interface IBookingProps {
  descending?: boolean
  page: number
}
