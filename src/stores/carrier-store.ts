import { types, flow } from 'mobx-state-tree';
import { CarrierApi } from '../services';

const objectWorking = types.model({
  region: types.maybeNull(types.number),
  province: types.maybeNull(types.number),
  truckId: types.maybeNull(types.number),
});

const trucks = types.model({
  stallHeight: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.maybeNull(types.string))),
  workingZones: types.maybeNull(types.array(objectWorking)),
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

const trucksTypes = types.model({
  groupId: types.maybeNull(types.number),
  id: types.maybeNull(types.number),
  image: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
});

const drivers = types.model({
  id: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  fullname: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  driverLicenseNumber: types.maybeNull(types.string),
  enabled: types.maybeNull(types.boolean),
  approveStatus: types.maybeNull(types.number),
  createdAt: types.maybeNull(types.string),
  drivingLicenseExpiredDate: types.maybeNull(types.string),
  driverLicenseExpDate: types.maybeNull(types.string),
});

export const CarrierStore = types
  .model('CarrierStore', {
    trucks_carrier: types.maybeNull(types.array(trucks)),
    trucks_types: types.maybeNull(types.array(trucksTypes)),
    drivers_carrier: types.maybeNull(types.array(drivers)),
  })
  .actions((self) => {
    return {
      getAllTrucksByCarrier: flow(function* getAllTrucksByCarrier() {
        try {
          // ... yield can be used in async/await style
          const response = yield CarrierApi.getAllTrucks();
          console.log('getAllTrucksByCarrier response :> ', response);
          if (response && response.ok) {
            self.trucks_carrier = response.data;
          } else {
            self.trucks_carrier = null;
          }
        } catch (error) {
          // ... including try/catch error handling
          console.error('Failed to getAllTrucksByCarrier :> ', error);
          self.trucks_carrier = null;
        }
      }),
      getAllDriversByCarrier: flow(function* getAllDriversByCarrier() {
        try {
          // ... yield can be used in async/await style
          const response = yield CarrierApi.getAllDrivers();
          console.log('getAllDriversByCarrier response :> ', response);
          if (response && response.ok) {
            self.drivers_carrier = response.data;
          } else {
            self.drivers_carrier = null;
          }
        } catch (error) {
          // ... including try/catch error handling
          console.error('Failed to getAllDriversByCarrier :> ', error);
          self.drivers_carrier = null;
        }
      }),
      getAllTruckTypes: flow(function* getAllTruckTypes() {
        try {
          // ... yield can be used in async/await style
          const response = yield CarrierApi.listTruckTypes();
          console.log('listTruckTypes response :> ', response);
          if (response && response.ok) {
            self.trucks_types = response.data;
          } else {
            self.trucks_types = null;
          }
        } catch (error) {
          // ... including try/catch error handling
          console.error('Failed to listTruckTypes :> ', error);
          self.trucks_types = null;
        }
      }),
      postTruck: flow(function* postTruck() {
        try {
          // ... yield can be used in async/await style
          const response = yield CarrierApi.addTruck();
          console.log('postTruck response :> ', response);
          // if (response && response.ok) {
          //   self.trucks_types = response.data;
          // } else {
          //   self.trucks_types = null;
          // }
        } catch (error) {
          // ... including try/catch error handling
          console.error('Failed to postTruck :> ', error);
          // self.trucks_types = null;
        }
      }),
    };
  })
  .views((self) => ({}));
