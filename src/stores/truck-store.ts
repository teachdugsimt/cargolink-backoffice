import { flow, types } from 'mobx-state-tree';
import { TruckApi } from '../services';
import truckApi, {
  ITruck,
  TruckRequestParams,
  TrucksByCarrierParams,
  TrucksListParams,
  TrucksListResponse,
} from '../services/truck-api';

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

const TruckListManagementType = types.model({
  content: types.maybeNull(types.array(TruckType)),
  totalPages: types.maybeNull(types.number),
});

export interface ITrucksManagement {
  content: (ITruck | ITruckNull)[];
  reRender: boolean;
  lengthPerPage: number | null;
}

export interface ITruckListManagement {
  content: (ITruck | ITruckNull)[];
  totalPages: number | null;
}

export const TruckStore = types
  .model('TruckStore', {
    loading: false,
    userTrucks_loading: false,
    data_count: types.maybeNull(types.number),
    data_trucks: types.maybeNull(TruckManagementType),
    truckList: types.maybeNull(TruckListManagementType),
    currentTruck: types.maybeNull(TruckType),
    isFirstLoad: true,
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      getTrucksList: flow(function* getTrucksList(params: TrucksListParams) {
        self.loading = true;
        self.data_trucks = null;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TruckApi.getTrucksList(params);
          console.log('getTrucks response :>', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages }: TrucksListResponse = response.data;
            self.loading = false;
            self.data_count = totalElements;
            const currentPage = params?.page || 1;
            const trucks: ITrucksManagement = {
              content: [],
              reRender: true,
              lengthPerPage: size,
            };
            if (!self.isFirstLoad) trucks.reRender = !!!self.data_trucks?.reRender;
            if (data.length) {
              const parsedData: ITruck[] = data.map((truck) => {
                const { loadingWeight, quotationNumber, truckType } = truck;
                const toNumber = (x: any) => {
                  if (x == null) return x;
                  if (isNaN(+x)) throw new Error('this should not be NaN: ' + x);
                  return +x;
                };
                const owner = {
                  ...truck.owner,
                  id: toNumber(truck.owner.id),
                };
                const result: ITruck = {
                  ...truck,
                  loadingWeight: toNumber(loadingWeight),
                  quotationNumber: toNumber(quotationNumber),
                  truckType: toNumber(truckType),
                  owner,
                };
                return result;
              });
              const emptyContent: ITruckNull = Object.keys(data[0]).reduce(
                (object: ITruckNull, curr: string) => ({
                  ...object,
                  [curr]: null,
                }),
                {},
              );
              if (self.isFirstLoad) self.isFirstLoad = false;
              const pagesBeforeContent = currentPage - 1;
              const emptyContentsBeforeFirstItem = pagesBeforeContent * size;
              const pagesAfterContent = totalPages - currentPage;
              const emptyContentsAfterLastItem = pagesAfterContent * size;
              trucks.content = [
                ...Array(emptyContentsBeforeFirstItem).fill(emptyContent),
                ...parsedData,
                ...Array(emptyContentsAfterLastItem).fill(emptyContent),
              ];
            } else trucks.content = [];
            self.data_trucks = trucks;
          } else {
            self.loading = false;
            self.data_trucks = null;
            self.error_response = {
              title: response.problem,
              content: 'GET trucks : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getTrucks :>', error);
          self.loading = false;
          self.data_trucks = null;
          self.error_response = {
            title: '',
            content: 'Failed to getTrucks',
          };
        }
      }),

      getTruckById: flow(function* getTruckById(params: TruckRequestParams) {
        try {
          self.loading = true;
          self.currentTruck = null;
          const response = yield truckApi.getTruckById(params);
          console.log(response);
          if (response.ok) {
            self.currentTruck = response.data.data;
          } else {
            self.error_response = {
              title: '',
              content: 'Failed to get truck ' + params.truckId,
            };
          }
          self.loading = false;
        } catch (error) {
          self.error_response = {
            title: '',
            content: 'Failed to get truck ' + params.truckId,
          };
        }
      }),

      getTrucksListByCarrierId: flow(function* getTrucksListByCarrierId(params: TrucksByCarrierParams) {
        try {
          self.userTrucks_loading = true;

          const response = yield truckApi.getTruckByCarrierId(params);
          console.log(response);
          self.userTrucks_loading = false;
          if (response.ok) {
            // const { data, size, totalElements, totalPages }: TrucksListResponse = response.data;
            // console.log(response.data)
            console.log('Get Truck list by carrier id : ', response);
            return response.data;
          } else {
          }
        } catch (error) {
          return error;
        }
      }),
      getLinkDownLoad: flow(function* getLinkDownLoad(params: string[]) {
        try {
          self.userTrucks_loading = true;

          const response = yield truckApi.getLinkDownLoad(params);
          console.log(response);
          self.userTrucks_loading = false;
          if (response.ok) {
            // const { data, size, totalElements, totalPages }: TrucksListResponse = response.data;
            // console.log(response.data)
            console.log('Get Truck list by carrier id : ', response);
            return response.data;
          } else {
          }
        } catch (error) {
          return error;
        }
      }),

      getTrucksListWithoutEmptyContent: flow(function* getTrucksList(params: TrucksListParams) {
        self.loading = true;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TruckApi.getTrucksList(params);
          console.log('getTrucks response :>', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages }: TrucksListResponse = response.data;
            self.data_count = totalElements;
            const trucks: ITruckListManagement = {
              content: [],
              totalPages: totalPages,
            };
            if (data.length) {
              const parsedData: ITruck[] = data.map((truck) => {
                const { loadingWeight, quotationNumber, truckType } = truck;
                const toNumber = (x: any) => {
                  if (x == null) return x;
                  if (isNaN(+x)) throw new Error('this should not be NaN: ' + x);
                  return +x;
                };
                const owner = {
                  ...truck.owner,
                  id: toNumber(truck.owner.id),
                };
                return {
                  ...truck,
                  loadingWeight: toNumber(loadingWeight),
                  quotationNumber: toNumber(quotationNumber),
                  truckType: toNumber(truckType),
                  owner,
                };
              });
              if (self.truckList?.content?.length) {
                trucks.content = [...JSON.parse(JSON.stringify(self.truckList.content)), ...parsedData];
              } else {
                trucks.content = parsedData;
              }
            } else {
              trucks.content = [];
            }
            self.loading = false;
            self.truckList = trucks;
          } else {
            self.loading = false;
            self.truckList = null;
            self.error_response = {
              title: response.problem,
              content: 'GET trucks : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getTrucks :>', error);
          self.loading = false;
          self.truckList = null;
          self.error_response = {
            title: '',
            content: 'Failed to getTrucks',
          };
        }
      }),

      clearTrucks: function () {
        self.truckList = null;
      },
    };
  });

export interface ITruckNull {
  [x: string]: null;
}
