import ExcuteApi from './api-integrations/excute-api';
class CarrierApi {
  getAllTrucks = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/truck/list', params, 'post', 600000, false);
    return response;
  };

  getAllDrivers = async (params) => {
    const response = await ExcuteApi('/api/v1/carriers/getAllDriversByCarrier', params, 'get', 600000);
    return response;
  };

  listTruckTypes = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/mst/truck/truck-type', params, 'get', 600000);
    return response;
  };

  addTruck = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/carriers/truck', params, 'post', 600000);
    return response;
  };
}
export default new CarrierApi();
