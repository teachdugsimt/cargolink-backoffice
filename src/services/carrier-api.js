import ExcuteApi from './api-integrations/excute-api';

class CarrierApi {
  getDrivers = async (params) => {
    const response = await ExcuteApi('api/backoffice/v1/audit-log', params, 'get', 600000);
    return response;
  };
}
export default new CarrierApi();
