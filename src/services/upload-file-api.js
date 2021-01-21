import ExcuteApi from './api-integrations/excute-api';
class UploadFileApi {
  uploadPicture = async (params) => {
    const response = await ExcuteApi('/api/v1/media/upload/image', params, 'post');
    return response;
  };
}
export default new UploadFileApi();
