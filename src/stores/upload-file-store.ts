import { types, flow } from 'mobx-state-tree';
import { UploadFileApi } from '../services';

export const UploadFileStore = types
  .model('UploadFileStore', {
    loading: false,
    files: types.array(
      types.model({
        fileName: types.maybeNull(types.string),
        fileType: types.maybeNull(types.string),
        fileUrl: types.maybeNull(types.string),
        token: types.maybeNull(types.string),
        uploadedDate: types.maybeNull(types.string),
      }),
    ),
    error_file: types.string,
  })
  .actions((self) => {
    return {
      uploadImage: flow(function* uploadImage(params) {
        self.loading = true;

        const formData = new FormData();
        formData.append('file', params);

        try {
          const response = yield UploadFileApi.uploadPicture(formData);
          console.log('uploadPicture response :> ', response);
          if (response && response.ok) {
            const { data } = response;
            let files = JSON.parse(JSON.stringify(self.files));
            if (self.files?.length) files.push(data);
            else files = data;

            self.files = files;
          } else {
            self.error_file = 'Error call api for upload images';
          }
        } catch (error) {
          console.error('Failed to request upload files store :> ', error);
          self.loading = false;
          self.error_file = 'Failed to request upload files store';
        }
      }),
    };
  })
  .create({
    loading: false,
    files: [],
    error_file: '',
  });
