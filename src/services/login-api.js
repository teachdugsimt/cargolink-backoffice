import ExcuteApi from './api-integrations/excute-api';
class LoginApi {
  LoginApi = async (params) => {
    const response = await ExcuteApi('/api/mobile/v1/auth/login', params, 'post');
    return response;
  };
}
export default new LoginApi();
