import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class RegionApi {
  getProvincesList = async (params: ParamsProvince) => {
    const response: AxiosResponse<ProvincesListResponse> = await ExcuteApi(
      `/api/v1/master-data/province`,
      params ?? {},
      'get',
      6e5,
      false,
      true,
    );
    return response;
  };
  getRegionList = async () => {
    const response: AxiosResponse<ProvincesListResponse> = await ExcuteApi(
      `/api/v1/master-data/zone`,
      {},
      'get',
      6e5,
      false,
      true,
    );
    return response;
  };
}

export default new RegionApi();

export interface Province {
  id: number;
  groupId: number;
  image: string | null;
  name: string;
}

export type ProvincesListResponse = Province[];

export interface ParamsProvince {
  regionId?: number
  descending?: boolean
}
