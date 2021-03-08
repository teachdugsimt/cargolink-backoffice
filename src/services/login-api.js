import ExcuteApi from './api-integrations/excute-api';
class LoginApi {
  LoginApi = async (params) => {
    const response = await ExcuteApi('/api/login', params, 'post', 300000, false, true);
    return response;
  };
}
export default new LoginApi();
