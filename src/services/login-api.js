import ExcuteApi from './api-integrations/excute-api';
class LoginApi {
  LoginApi = async (params) => {
    const response = await ExcuteApi('/api/v1/auth/login', params, 'post', 300000, false, true);
    return response;
  };
}
export default new LoginApi();
