import truckApi, { ITruck, TrucksByCarrierParams, TrucksListParams, TrucksListResponse } from '../services/truck-api';
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

const TruckType = types.maybeNull(
  types.model({
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
    document: types.maybeNull(types.map(types.string)),
    documentStatus: types.maybeNull(types.string),
  }),
);

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

    loading_truck: false,
    data_truck_user: types.maybeNull(TruckManagementType),
    data_count: types.maybeNull(types.number),
    isFirstLoad: true,
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
      clearCacheTruckDocument() {
        self.data_patch_truck = null;
      },

      getTrucksListByCarrierId: flow(function* getTrucksListByCarrierId(
        params: TrucksListParams,
        userId: TrucksByCarrierParams,
      ) {
        try {
          self.loading_truck = true;

          const response = yield truckApi.getTruckByCarrierId(userId);
          console.log('Get Truck list by carrier id : ', response);

          if (response.ok) {
            const tmpResponse = response.data?.data || [];
            let tmp: any;
            if (tmpResponse && Array.isArray(tmpResponse) && tmpResponse.length > 0) {
              tmp = yield Promise.all(
                tmpResponse.map(async (item: any) => {
                  if (item.document && typeof item.document == 'object' && Object.keys(item.document).length > 0) {
                    const listAttachCode = Object.keys(item.document).map((e) => item.document[e]);
                    const urlList = await truckApi.getLinkDownLoad(listAttachCode);
                    let tmpItem = JSON.parse(JSON.stringify(item));
                    const listUrl = JSON.parse(JSON.stringify(urlList));
                    tmpItem.document = listUrl.data.data || null;
                    return tmpItem;
                  } else return item;
                }),
              );
            }
            console.log('TMP IMPORTATNT !! :: ', tmp);
            const newResopnse = response.data;
            newResopnse.data = tmp;

            const { data, size, totalElements, totalPages }: TrucksListResponse = newResopnse;
            self.data_count = totalElements;
            const currentPage = params?.page || 1;
            const trucks: ITrucksManagement = {
              content: [],
              reRender: true,
              lengthPerPage: size,
            };
            if (!self.isFirstLoad) trucks.reRender = !!!self.data_truck_user?.reRender;
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
            self.data_truck_user = trucks;

            self.loading_truck = false;
          } else {
          }
        } catch (error) {
          return error;
        }
      }),
    };
  })
  .create({
    loading: false,
    data_patch_truck: null,
    error_response: null,
    data_truck_user: null,
    data_count: null,
    isFirstLoad: true,
  });

export interface ITrucksManagement {
  content: (ITruck | ITruckNull)[];
  reRender: boolean;
  lengthPerPage: number | null;
}
export interface ITruckNull {
  [x: string]: null;
}
