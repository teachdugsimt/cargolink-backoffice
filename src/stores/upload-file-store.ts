import { types, flow } from 'mobx-state-tree';
import { UploadFileApi } from '../services';

export const UploadFileStore = types
  .model('UploadFileStore', {
    loading: false,
    truckPhotos: types.model({
      front: types.string,
      back: types.string,
      left: types.string,
      right: types.string,
    }),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      uploadImage: flow(function* uploadImage(params, imageName) {
        self.loading = true;
        self.error_response = null;

        const formData = new FormData();
        formData.append('file', params);

        try {
          const response = yield UploadFileApi.uploadPicture(formData);
          console.log('uploadPicture response :> ', response);
          if (response && response.ok) {
            const { data } = response;
            self.loading = false;
            let images = JSON.parse(JSON.stringify(self.truckPhotos));
            images[`${imageName}`] = data.fileUrl;
            self.truckPhotos = images;
            self.error_response = null;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to request upload images store :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to request upload images store',
          };
        }
      }),
    };
  })
  .create({
    loading: false,
    truckPhotos: { front: '', back: '', left: '', right: '' },
    error_response: null,
  });
