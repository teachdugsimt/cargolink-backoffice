import ExcuteApi from './api-integrations/excute-api';
class MasterTypeApi {
  getRegions = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/multi-roles/zone', params, 'get');
    return response;
  };
  getProvinces = async (params) => {
    const response = await ExcuteApi('/api/v1/mobile/multi-roles/province', params, 'post', 600000);
    return response;
  };
}
export default new MasterTypeApi();
