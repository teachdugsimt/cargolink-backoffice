import ExcuteApi from './api-integrations/excute-api';
class ShipperApi {
  getAllJobs = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/carriers/truck', params, 'get', 600000);
    return response;
  };
}
export default new ShipperApi();
