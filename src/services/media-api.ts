import { AxiosResponse } from 'axios';
import ExcuteApi from './api-integrations/excute-api';

class MediaApi {
  getFileUrlByAttachCode = async (params: GetFileApiParams) => {
    const response = await ExcuteApi(
      `/api/v1/media/file`, {
      url: params.attached_code || ""
    }, 'get', 6e5, true, true);
    return response;
  };
}

export default new MediaApi();

export interface GetFileApiParams {
  attached_code: string | null | undefined;
}

export interface GetFileResponse {
  uri: string
}
