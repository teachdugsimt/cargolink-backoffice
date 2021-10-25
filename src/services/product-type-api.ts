import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class ProductTypeApi {
  getProductTypes = async () => {
    const response: AxiosResponse<ProductTypesResponse> = await ExcuteApi(
      `/api/v1/master-data/product-type`,
      {},
      'get',
      6e5,
      false,
      true,
    );
    return response;
  };
}

export default new ProductTypeApi();

export interface IProductType {
  id: number;
  image: string;
  name: string;
}

export type ProductTypesResponse = IProductType[];
