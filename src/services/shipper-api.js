import ExcuteApi from './api-integrations/excute-api';
class ShipperApi {
  getAllJobs = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/job/list', params, 'post', 600000, false);
    return response;
  };
  addJobs = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/shippers/jobs', params, 'post', 600000);
    return response;
  };
  getAllProductType = async () => {
    const response = await ExcuteApi('/api/v1/mobile/mst/product-type', {}, 'get', 600000);
    return response;
  };
}
export default new ShipperApi();
