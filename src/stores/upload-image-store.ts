import { types, flow } from 'mobx-state-tree';

export const UploadImageStore = types
  .model('UploadImageStore', {
    loading: false,
    truckPhotos: types.model({
      front: types.maybeNull(types.string),
      back: types.maybeNull(types.string),
      left: types.maybeNull(types.string),
      right: types.maybeNull(types.string),
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
              content: 'POST image : ' + response.originalError.message,
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

      removeImage: flow(function* removeImage(imageName) {
        let images = JSON.parse(JSON.stringify(self.truckPhotos));
        images[`${imageName}`] = null;
        self.truckPhotos = images;
      }),

      clearUploadFileStore: flow(function* clearUploadFileStore() {
        self.truckPhotos = { front: null, back: null, left: null, right: null };
        self.error_response = null;
      }),
    };
  })
  .create({
    loading: false,
    truckPhotos: { front: null, back: null, left: null, right: null },
    error_response: null,
  });
