import ExcuteApi from './api-integrations/excute-api';
class UserApi {
  User = async (params) => {
    const response = await ExcuteApi('/api/admin/mobile/v1/users', params, 'post', 600000, false, true);
    return response;
  };
}
export default new UserApi();
