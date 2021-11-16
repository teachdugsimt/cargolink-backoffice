import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class HistoryCall {
  getJobCallHistory = async (params: IJobCallHistoryProps) => {
    const response: any = await ExcuteApi(`api/v1/history/call/jobs/`, params, 'get', 6e5, true, true);
    return response;
  };
}

export default new HistoryCall();

export interface IJobCallHistoryProps {
  descending?: boolean
  page: number
  textSearch?: string
}
