import { types, flow } from 'mobx-state-tree';
import { ShipperApi } from '../services';

const arrayTo = types.model({
  contactMobileNo: types.maybeNull(types.string),
  contactName: types.maybeNull(types.string),
  dateTime: types.maybeNull(types.string),
  lat: types.maybeNull(types.string),
  lng: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
});

const arrayFrom = types.model({
  contactMobileNo: types.maybeNull(types.string),
  contactName: types.maybeNull(types.string),
  dateTime: types.maybeNull(types.string),
  lat: types.maybeNull(types.string),
  lng: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
});

const objectOwner = types.model({
  companyName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  id: types.maybeNull(types.number),
  mobileNo: types.maybeNull(types.string),
});

const jobs = types.model({
  from: types.map(arrayFrom),
  id: types.maybeNull(types.string),
  owner: types.map(objectOwner),
  productName: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  requiredTruckAmount: types.maybeNull(types.number),
  to: types.maybeNull(types.array(arrayTo)),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
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
