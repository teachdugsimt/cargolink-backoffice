import { types, flow } from 'mobx-state-tree';
import { ShipperApi } from '../services';

const objectWorking = types.model({
  region: types.maybeNull(types.string),
  province: types.maybeNull(types.string),
});

const jobs = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  registrationNumber: types.array(types.maybeNull(types.string)),
  workingZones: types.map(objectWorking),
  vehicleRegistrationYear: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  approveStatus: types.maybeNull(types.string),
  vehiculeRegCertExpDate: types.maybeNull(types.string),
  logBookExpDate: types.maybeNull(types.string),
  insurancePolicyExpDate: types.maybeNull(types.string),
  dltStickerExpiredDate: types.maybeNull(types.string),
});

export const ShipperStore = types
  .model('ShipperStore', {
    jobs_shipper: types.maybeNull(types.array(jobs)),
  })
  .actions((self) => {
    return {
      getAllJobsByShipper: flow(function* getAllJobsByShipper() {
        try {
          // ... yield can be used in async/await style
          const response = yield ShipperApi.getAllJobs();
          console.log('getAllJobsByShipper response :> ', response);
          if (response && response.ok) {
            self.jobs_shipper = response.data;
          } else {
            self.jobs_shipper = null;
          }
        } catch (error) {
          // ... including try/catch error handling
          console.error('Failed to getAllJobsByShipper :> ', error);
          self.jobs_shipper = null;
        }
      }),
    };
  })
  .views((self) => ({}));
