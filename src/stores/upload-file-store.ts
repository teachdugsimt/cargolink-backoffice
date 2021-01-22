import { types, flow } from 'mobx-state-tree';
import { UploadFileApi } from '../services';

export const UploadFileStore = types
  .model('UploadFileStore', {
    loading: false,
    truckPhotos: types.model({
      front: types.maybeNull(types.string),
      back: types.maybeNull(types.string),
      left: types.maybeNull(types.string),
      right: types.maybeNull(types.string),
    }),
    error_file: types.string,
  })
  .actions((self) => {
    return {
      uploadImage: flow(function* uploadImage(params, imageName) {
        self.loading = true;

        const formData = new FormData();
        formData.append('file', params);

        try {
          const response = yield UploadFileApi.uploadPicture(formData);
          console.log('uploadPicture response :> ', response);
          if (response && response.ok) {
            const { data } = response;
            let images = JSON.parse(JSON.stringify(self.truckPhotos));
            images[`${imageName}`] = data.fileUrl;
            self.truckPhotos = images;
          } else {
            self.error_file = 'Error call api for upload images';
          }
        } catch (error) {
          console.error('Failed to request upload images store :> ', error);
          self.loading = false;
          self.error_file = 'Failed to request upload images store';
        }
      }),
    };
  })
  .create({
    loading: false,
    truckPhotos: { front: null, back: null, left: null, right: null },
    error_file: '',
  });
