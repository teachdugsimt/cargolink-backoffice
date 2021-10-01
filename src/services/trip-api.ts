import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class TripApi {
  addTrip = async (params: IPostTruckProps) => {
    const response: AxiosResponse<any> = await ExcuteApi(`/api/v1/trips/`, params, 'post', 6e5, true, true);
    return response;
  };
}

export default new TripApi();

export interface IPostTruckProps {
  jobId: string;
  truckIds: Array<string>;
}
