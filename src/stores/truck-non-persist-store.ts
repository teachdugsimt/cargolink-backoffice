import truckApi from '../services/truck-api';
import { types, flow } from 'mobx-state-tree';
import uploadApi from '../services/upload-api';
import { UploadFilePath } from '../services/upload-api';

const AvatarType = types.model({
  object: types.maybeNull(types.string),
});

const OwnerType = types.model({
  id: types.maybeNull(types.number),
  userId: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  mobileNo: types.maybeNull(types.string),
  avatar: types.maybeNull(AvatarType),
});

const ZoneType = types.model({
  region: types.maybeNull(types.number),
  province: types.maybeNull(types.number),
});

const TruckPhotosType = types.model({
  front: types.maybeNull(types.string),
  back: types.maybeNull(types.string),
  left: types.maybeNull(types.string),
  right: types.maybeNull(types.string),
});

const TruckType = types.model({
  id: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  loadingWeight: types.maybeNull(types.number),
  truckType: types.maybeNull(types.number),
  registrationNumber: types.maybeNull(types.array(types.string)),
  stallHeight: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  quotationNumber: types.maybeNull(types.number),
  workingZones: types.maybeNull(types.array(ZoneType)),
  owner: types.maybeNull(OwnerType),
  truckPhotos: types.maybeNull(TruckPhotosType),
});

const TruckManagementType = types.model({
  content: types.maybeNull(types.array(TruckType)),
  reRender: types.boolean,
  lengthPerPage: types.maybeNull(types.number),
});

export const TruckNonPersistStore = types
  .model('TruckStore', {
    loading: false,
    data_patch_truck: types.maybeNull(types.model({})),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      uploadTruckDocument: flow(function* uploadTruckDocument(path: UploadFilePath, file: File, id: string) {
        self.loading = true;
        self.error_response = null;

        try {
          const response = yield uploadApi.upload(path, file);
          console.log('Upload file response :> ', response);
          if (response && response.ok) {
            const { data } = response;
            const updateObject = {
              document: [data.attachCode],
            };
            const responseUpdateTruck = yield truckApi.patchTruck(updateObject, id);
            console.log('Response put truck :: ', responseUpdateTruck);
            if (responseUpdateTruck.ok) {
              self.data_patch_truck = responseUpdateTruck;
              // yield TruckNonPersistStore.getFullyTruckList(userId);
            } else {
              self.loading = false;
              self.error_response = {
                title: responseUpdateTruck.problem,
                content: 'Update truck : ' + responseUpdateTruck.originalError.message,
              };
            }

            self.loading = false;
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
    };
  })
  .create({
    loading: false,
    data_patch_truck: null,
    error_response: null,
  });
