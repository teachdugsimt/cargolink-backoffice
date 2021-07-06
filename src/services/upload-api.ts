import ExcuteApi from './api-integrations/excute-api';

class UploadApi {
  upload = async (fileType: UploadFilePath, file: File) => {
    const path = `${fileType}/INPROGRESS/`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await ExcuteApi('/api/v1/media/upload', formData, 'post', 6e5, true, true);
    return response;
  };
  uploadByUser = async (userId: string, payload: UserUploadPayload) => {
    const response = await ExcuteApi(`/api/v1/users/${userId}/update-user-profile`, payload, 'post', 6e5, true, true);
    return response;
  }
}

export default new UploadApi();

export enum UploadFilePath {
  USER_DOC = 'USER_DOC',
}

export interface UploadFilePayload {
  userId: string;
  path: string;
  file: File;
}

export interface UploadFileResponse {
  attachCode: string;
  token: string;
  fileName: string;
  userId: string;
  type: string;
  status: string;
  fileUrl: string;
  fileType: string;
  uploadedDate: string;
}

export interface UserUploadPayload {
  url: string[];
  token: string;
}
