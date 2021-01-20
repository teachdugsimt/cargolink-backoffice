import { types, flow } from 'mobx-state-tree';
import { ShipperApi } from '../services';

const arrayFrom = types.model({
  name: types.maybeNull(types.string),
  dateTime: types.maybeNull(types.string),
  contactName: types.maybeNull(types.string),
  contactMobileNo: types.maybeNull(types.string),
  lat: types.maybeNull(types.string),
  lng: types.maybeNull(types.string),
});

const arrayTo = types.model({
  name: types.maybeNull(types.string),
  dateTime: types.maybeNull(types.string),
  contactName: types.maybeNull(types.string),
  contactMobileNo: types.maybeNull(types.string),
  lat: types.maybeNull(types.string),
  lng: types.maybeNull(types.string),
});

const objectOwner = types.model({
  id: types.maybeNull(types.number),
  companyName: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  mobileNo: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
});

const jobs = types.model({
  id: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  requiredTruckAmount: types.maybeNull(types.number),
  from: types.map(arrayFrom),
  to: types.maybeNull(types.array(arrayTo)),
  owner: types.map(objectOwner),
});

export const ShipperStore = types
  .model('ShipperStore', {
    jobs_shipper: types.maybeNull(types.array(jobs)),
  })
  .actions((self) => {
    return {
      getAllJobsByShipper: flow(function* getAllJobsByShipper(params) {
        try {
          const response = yield ShipperApi.getAllJobs(params);
          console.log('getAllJobsByShipper response :> ', response);
          if (response && response.ok) {
            self.jobs_shipper = response.data;
          } else {
            self.jobs_shipper = null;
          }
        } catch (error) {
          console.error('Failed to getAllJobsByShipper :> ', error);
          self.jobs_shipper = null;
        }
      }),
    };
  });
