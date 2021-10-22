import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class TruckTypeApi {
  getTruckTypes = async () => {
    const response: AxiosResponse<TruckTypesResponse> = await ExcuteApi(
      `/api/v1/master-data/truck-type`,
      {},
      'get',
      6e5,
      false,
      true,
    );
    return response;
  };
}

export default new TruckTypeApi();

export interface ITruckType {
  id: number;
  groupId: number;
  image: string;
  name: string;
}

export type TruckTypesResponse = ITruckType[];
