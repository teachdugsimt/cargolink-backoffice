import { types, flow } from 'mobx-state-tree';
import { CarrierApi } from '../services';

const objectWorking = types.model({
  region: types.maybeNull(types.number),
  province: types.maybeNull(types.number),
  truckId: types.maybeNull(types.number),
});

const trucks = types.model({
  id: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  stallHeight: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.maybeNull(types.string))),
  workingZones: types.maybeNull(types.array(objectWorking)),
  tipper: types.maybeNull(types.boolean),
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
    loading: false,
    trucks_carrier: types.maybeNull(types.array(trucks)),
    trucks_types: types.maybeNull(types.array(trucksTypes)),
    drivers_carrier: types.maybeNull(types.array(drivers)),
    success_response: false,
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      getAllTrucksByCarrier: flow(function* getAllTrucksByCarrier(params) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield CarrierApi.getAllTrucks(params);
          console.log('getAllTrucksByCarrier response :> ', response);

          if (response && response.ok) {
            const { data } = response;
            self.loading = false;
            //? in th first time, we get trucks
            let trucks = JSON.parse(JSON.stringify(self.trucks_carrier));
            if (self.trucks_carrier?.length) trucks.push(...data);
            else trucks = data;

            self.trucks_carrier = trucks;

            //? in th second time, we get trucks
            if (data?.length && data?.length % 10 === 0) {
              self.loading = true;
              //? change page parameter
              let newParams = JSON.parse(JSON.stringify(params));
              newParams.page = trucks?.length;

              const newResponse = yield CarrierApi.getAllTrucks(newParams);
              console.log('getAllTrucksByCarrier newResponse :> ', newResponse);

              if (newResponse && newResponse.ok) {
                self.loading = false;
                const newData = newResponse.data;
                let newTrucks = JSON.parse(JSON.stringify(self.trucks_carrier));
                newTrucks.push(...newData);
                self.trucks_carrier = newTrucks;
              } else {
                self.loading = false;
              }
            }
          } else {
            self.loading = false;
            self.trucks_carrier = null;
            self.error_response = {
              title: response.problem,
              content: response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getAllTrucksByCarrier :> ', error);
          self.loading = false;
          self.trucks_carrier = null;
          self.error_response = {
            title: '',
            content: 'Failed to get all trucks by carrier',
          };
        }
      }),

      getAllDriversByCarrier: flow(function* getAllDriversByCarrier() {
        self.loading = true;
        self.drivers_carrier = null;
        self.error_response = null;
        try {
          const response = yield CarrierApi.getAllDrivers();
          console.log('getAllDriversByCarrier response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.drivers_carrier = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getAllDriversByCarrier :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all drivers by carrier',
          };
        }
      }),

      getAllTruckTypes: flow(function* getAllTruckTypes() {
        self.loading = true;
        self.trucks_types = null;
        self.success_response = false;
        self.error_response = null;
        try {
          const response = yield CarrierApi.listTruckTypes();
          console.log('getAllTruckTypes response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.trucks_types = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getAllTruckTypes :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all truck types',
          };
        }
      }),

      postTruck: flow(function* postTruck(params) {
        self.loading = true;
        self.success_response = false;
        self.error_response = null;
        try {
          const response = yield CarrierApi.addTruck(params);
          console.log('postTruck response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.success_response = true;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to postTruck :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to post truck',
          };
        }
      }),
    };
  });
