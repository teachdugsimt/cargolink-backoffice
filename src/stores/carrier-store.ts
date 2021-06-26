import { types, flow } from 'mobx-state-tree';
import { CarrierApi } from '../services';

const objectWorking = types.model({
  region: types.maybeNull(types.number),
  province: types.maybeNull(types.number),
  truckId: types.maybeNull(types.number),
});

const AvatarObject = types.model({
  object: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
});

const objectOwner = types.model({
  avatar: types.maybeNull(AvatarObject),
  companyName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  fullname: types.maybeNull(types.string),
  id: types.maybeNull(types.number),
  mobileNo: types.maybeNull(types.string),
  userId: types.maybeNull(types.string),
});

const contentArray = types.model({
  id: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  owner: types.maybeNull(objectOwner),
  stallHeight: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.maybeNull(types.string))),
  workingZones: types.maybeNull(types.array(objectWorking)),
  tipper: types.maybeNull(types.boolean),
});

const photos = types.model({
  back: types.maybeNull(AvatarObject),
  front: types.maybeNull(AvatarObject),
  left: types.maybeNull(AvatarObject),
  right: types.maybeNull(AvatarObject),
});

const TruckDetail = types.model({
  id: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  owner: types.maybeNull(objectOwner),
  stallHeight: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  truckPhotos: types.maybeNull(photos),
  registrationNumber: types.maybeNull(types.array(types.maybeNull(types.string))),
  workingZones: types.maybeNull(types.array(objectWorking)),
  tipper: types.maybeNull(types.boolean),
});

// const objectSort = types.model({
//   empty: types.maybeNull(types.boolean),
//   sorted: types.maybeNull(types.boolean),
//   unsorted: types.maybeNull(types.boolean),
// });

// const objectPageable = types.model({
//   offset: types.maybeNull(types.number),
//   pageNumber: types.maybeNull(types.number),
//   pageSize: types.maybeNull(types.number),
//   paged: types.maybeNull(types.boolean),
//   sort: types.maybeNull(objectSort),
//   unpaged: types.maybeNull(types.boolean),
// });

// const trucks = types.model({
//   content: types.maybeNull(types.array(contentArray)),
//   empty: types.maybeNull(types.boolean),
//   first: types.maybeNull(types.boolean),
//   last: types.maybeNull(types.boolean),
//   number: types.maybeNull(types.number),
//   numberOfElements: types.maybeNull(types.number),
//   pageable: types.maybeNull(objectPageable),
//   size: types.maybeNull(types.number),
//   sort: types.maybeNull(objectSort),
//   totalElements: types.maybeNull(types.number),
//   totalPages: types.maybeNull(types.number),
// });

const Trucks = types.model({
  content: types.maybeNull(types.array(contentArray)),
  reRender: types.boolean,
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

const TruckSummary = types.model({
  truckType: types.maybeNull(types.string),
  central: types.maybeNull(types.number),
  north: types.maybeNull(types.number),
  south: types.maybeNull(types.number),
  east: types.maybeNull(types.number),
  west: types.maybeNull(types.number),
  northEast: types.maybeNull(types.number),
  nationalWide: types.maybeNull(types.number),
});

export const CarrierStore = types
  .model('CarrierStore', {
    loading: false,
    trucks_summary: types.maybeNull(types.array(TruckSummary)),
    trucks_carrier: types.maybeNull(Trucks),
    trucks_detail: types.maybeNull(TruckDetail),
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
            const pageNumber = data.pageable.pageNumber * 10;
            const content = data.content;
            let trucks: { content: any; reRender: boolean } = { content: [], reRender: true };
            const ct = {
              id: null,
              truckType: null,
              loadingWeight: null,
              owner: null,
              stallHeight: null,
              createdAt: null,
              updatedAt: null,
              approveStatus: null,
              registrationNumber: null,
              workingZones: null,
              tipper: null,
            };
            if (pageNumber == 0) {
              //? in th first time, we get trucks
              trucks.content = [...content, ...Array(data.totalElements - content.length).fill(ct)];
            } else {
              trucks.content = Array(data.totalElements).fill(ct);
              const pageSize = data.numberOfElements;
              for (let i = pageNumber, j = 0; i < pageNumber + pageSize; i++, j++) {
                trucks.content[i] = content[j];
              }
              trucks.reRender = !!!self.trucks_carrier?.reRender;
            }
            self.trucks_carrier = trucks;
          } else {
            self.loading = false;
            self.trucks_carrier = null;
            self.error_response = {
              title: response.problem,
              content: 'GET trucks : ' + response.originalError.message,
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
              content: 'GET drivers : ' + response.originalError.message,
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
              content: 'GET truck-types : ' + response.originalError.message,
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
              content: 'POST truck : ' + response.originalError.message,
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

      getTruckSummary: flow(function* getTruckSummary() {
        self.loading = true;
        self.trucks_summary = null;
        self.error_response = null;
        try {
          const response = yield CarrierApi.truckSummary();
          console.log('getTruckSummary response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.trucks_summary = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'GET truck : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getTruckSummary :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all drivers by carrier',
          };
        }
      }),

      getTruckDeyailById: flow(function* getTruckDeyailById(id: string) {
        self.loading = true;
        self.trucks_detail = null;
        self.error_response = null;
        try {
          const response = yield CarrierApi.truckDetail(id);
          console.log('truckDetail response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.trucks_detail = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'GET truck : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to truckDetail :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all drivers by carrier',
          };
        }
      }),

      clearCarrierStore: flow(function* clearCarrierStore() {
        self.trucks_carrier = null;
        self.success_response = false;
        self.error_response = null;
      }),
    };
  });
