import ExcuteApi from './api-integrations/excute-api';
class CarrierApi {
  getAllTrucks = async (params) => {
    const response = await ExcuteApi('/api/v1/carriers/getAllTrucksByCarrier', params, 'get', 600000);
    return response;
  };
}
export default new CarrierApi();
