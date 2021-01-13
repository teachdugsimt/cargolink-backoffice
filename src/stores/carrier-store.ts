import { types, flow } from 'mobx-state-tree';
import { CarrierApi } from '../services';

const trucks = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.string),
  vehicleRegistrationYear: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  approveStatus: types.maybeNull(types.number),
  vehiculeRegCertExpDate: types.maybeNull(types.string),
  logBookExpDate: types.maybeNull(types.string),
  insurancePolicyExpDate: types.maybeNull(types.string),
  dltStickerExpiredDate: types.maybeNull(types.string),
});
export const CarrierStore = types
  .model('CarrierStore', {
    trucks_carrier: types.maybeNull(types.array(trucks)),
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
    };
  })
  .views((self) => ({}));
