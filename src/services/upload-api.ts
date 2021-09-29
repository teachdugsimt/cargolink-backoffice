import ExcuteApi from './api-integrations/excute-api';

class UploadApi {
  upload = async (fileType: UploadFilePath, file: File) => {
    console.log('File type : ', fileType);
    console.log('File data :: ', file);
    const path = `${fileType}/INPROGRESS/`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const options = file.type.toString().includes('pdf') ? 'pdf' : null;

    const response = await ExcuteApi('/api/v1/media/upload', formData, 'post', 6e5, true, true, options);
    return response;
  };
  uploadByUser = async (userId: string, payload: UserUploadPayload) => {
    const response = await ExcuteApi(`/api/v1/users/${userId}/update-user-profile`, payload, 'post', 6e5, true, true);
    return response;
  };
}

export default new UploadApi();

export enum UploadFilePath {
  USER_DOC = 'USER_DOC',
  VEHICLE_DOC = 'VEHICLE_DOC',
  VEHICLE_IMAGE_FRONT = 'VEHICLE_IMAGE/FRONT',
  VEHICLE_IMAGE_BACK = 'VEHICLE_IMAGE/BACK',
  VEHICLE_IMAGE_LEFT = 'VEHICLE_IMAGE/LEFT',
  VEHICLE_IMAGE_RIGHT = 'VEHICLE_IMAGE/RIGHT',
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
