import ExcuteApi from './api-integrations/excute-api';
class CarrierApi {
  getAllTrucks = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/carriers/truck', params, 'get', 600000);
    return response;
  };

  getAllDrivers = async (params) => {
    const response = await ExcuteApi('/api/v1/carriers/getAllDriversByCarrier', params, 'get', 600000);
    return response;
  };

  listTruckTypes = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/carriers/truck/truck-type', params, 'get', 600000);
    return response;
  };

  addTruck = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/carriers/truck', params, 'post', 600000);
    return response;
  };
}
export default new CarrierApi();
