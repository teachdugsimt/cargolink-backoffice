import { types, flow } from 'mobx-state-tree';
import { AxiosResponse } from 'axios';
import UploadApi, { UploadFilePath, UploadFileResponse } from '../services/upload-api';

export const fileResponse = types.model({
  attachCode: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
  fileName: types.maybeNull(types.string),
  userId: types.maybeNull(types.string),
  type: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  fileUrl: types.maybeNull(types.string),
  fileType: types.maybeNull(types.string),
  uploadedDate: types.maybeNull(types.string),
})

export const UploadFileStore = types
  .model('UploadFileStore', {
    loading: false,
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
    file: types.maybeNull(fileResponse),
  })
  .actions((self) => {
    return {
      clear: flow(function* clear() {
        self.error_response = null;
        self.file = null;
      }),
      uploadFile: flow(function* uploadFile(fileType: UploadFilePath, file: File) {
        self.loading = true;
        self.error_response = null;

        try {
          const response = yield UploadApi.upload(fileType, file);
          if (response && response.ok) {
            self.loading = false;
            const { data } = response as AxiosResponse<UploadFileResponse>;
            self.file = data;
          }
        } catch (error) {
          self.loading = false;
          console.error('Failed to request upload file store :> ', error);
          self.error_response = {
            title: '',
            content: 'Failed to request upload file store',
          }
          self.file = null;
        }
      })
    }
  })
