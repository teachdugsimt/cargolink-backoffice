import truckApi, { ITruck, TrucksByCarrierParams, ChangeDocStatusPayload, PatchTruckImgParams } from '../services/truck-api';
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

const defaultTruck = {
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
};

const TruckWithDocument = types.model({
  ...defaultTruck,
  document: types.array(
    types.maybeNull(
      types.model({
        attach_code: types.maybeNull(types.string),
        expire: types.maybeNull(types.number),
        file_name: types.maybeNull(types.string),
        status: types.maybeNull(types.string),
        type: types.maybeNull(types.string),
        url: types.maybeNull(types.string),
      }),
    ),
  ),
  document_status: types.maybeNull(types.string),
});

const modelError = types.maybeNull(
  types.model({
    title: types.maybeNull(types.string),
    content: types.maybeNull(types.string),
  }),
)

export const TruckNonPersistStore = types
  .model('TruckStore', {
    loading: false,
    data_patch_truck: types.maybeNull(types.model({})),
    error_response: modelError,

    loading_truck: false,
    data_truck_user: types.maybeNull(TruckManagementType),
    data_count: types.maybeNull(types.number),
    isFirstLoad: true,

    userTrucks_loading: types.boolean,
    data_truck_carrier: types.maybeNull(types.array(TruckWithDocument)),
    tmp_truck_id: types.maybeNull(types.string),

    loading_img: types.boolean,
    data_patch_img: types.boolean,
    error_patch_img: modelError,
    tmp_position_upload: types.maybeNull(types.string)
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
              documentStatus: 'WAIT_FOR_VERIFIED',
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

      setTmpTruckIdForLoadingButt(truckId: string) {
        self.tmp_truck_id = truckId;
      },
      updateDocumentStatus: flow(function* updateDocumentStatus(
        truckId: string,
        params: ChangeDocStatusPayload,
        carrierId: string,
      ) {
        try {
          self.loading = true;
          const response = yield truckApi.changeDocStatus(truckId, params);
          console.log('Response update truck doc status : ', response);
          if (response.ok) {
            let tmpTruckSlot = JSON.parse(JSON.stringify(self.data_truck_carrier));
            tmpTruckSlot = tmpTruckSlot.map((e: any) => {
              const slotItem: any = e;
              if (e.id == truckId) slotItem.document_status = params.status;
              return slotItem;
            });
            console.log('Tmp Update Truck Carrier Doc :: ', tmpTruckSlot);
            self.data_truck_carrier = tmpTruckSlot;
          }
          self.loading = false;
        } catch (error) {
          self.loading = false;
        }
      }),

      getTrucksListByCarrierId: flow(function* getTrucksListByCarrierId(params: TrucksByCarrierParams) {
        try {
          self.userTrucks_loading = true;

          const response = yield truckApi.getTruckByCarrierId(params);
          console.log(response);

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
                  } else {
                    let slot = item;
                    slot.document = [];
                    return item;
                  }
                }),
              );
            }

            console.log('TMP IMPORTATNT !! :: ', tmp);

            self.data_truck_carrier = tmp;
          } else {
          }
          self.userTrucks_loading = false;
        } catch (error) {
          self.userTrucks_loading = false;
          return error;
        }
      }),
      clearListTruckCarrier() {
        self.data_truck_carrier = null;
      },






      uploadVehicleImage: flow(function* uploadVehicleImage(path: UploadFilePath | null, file: File | null,
        position: 'front' | 'back' | 'left' | 'right',
        status: 'REPLACE' | 'NEW' | 'NO_CHANGE' | 'DELETE',
        truckId: string) {

        self.tmp_position_upload = position
        self.loading_img = true;
        self.error_patch_img = null;
        try {

          const response = path && file ? yield uploadApi.upload(path, file) : { ok: true, data: null };
          console.log('Upload file response :> ', response);
          if (response && response.ok) {
            const { data } = response;
            let updateObject: any = {
              truckPhotos: {}
            };
            updateObject.truckPhotos[position] = {
              url: data && data.attachCode ? data.attachCode : null,
              action: status
            }
            console.log("Update Img object :: ", updateObject)

            const responseUpdateTruck = yield truckApi.patchTruck(updateObject, truckId);
            console.log('Response put truck :: ', responseUpdateTruck);
            if (responseUpdateTruck.ok) {
              self.data_patch_img = responseUpdateTruck.data;
            } else {
              self.loading_img = false;
              self.error_patch_img = {
                title: responseUpdateTruck.problem,
                content: 'Update truck : ' + responseUpdateTruck.originalError.message,
              };
            }

            self.loading_img = false;
            self.error_patch_img = null;
          } else {
            self.loading_img = false;
            self.error_patch_img = {
              title: response.problem,
              content: 'POST image : ' + response.originalError.message,
            };
          }


        } catch (error) {
          console.error('Failed to request upload images store :> ', error);
          self.loading_img = false;
          self.error_patch_img = {
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
    data_truck_user: null,
    data_count: null,
    isFirstLoad: true,
    userTrucks_loading: false,
    data_truck_carrier: null,
    tmp_truck_id: null,

    loading_img: false,
    data_patch_img: false,
    error_patch_img: null,
    tmp_position_upload: null,
  });

export interface ITrucksManagement {
  content: (ITruck | ITruckNull)[];
  reRender: boolean;
  lengthPerPage: number | null;
}
export interface ITruckNull {
  [x: string]: null;
}
