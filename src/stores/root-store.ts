import { useContext, createContext } from 'react';
import { types, Instance, onSnapshot } from 'mobx-state-tree';

import { LoginStore } from './login-store';
import { CarrierStore } from './carrier-store';
import { ShipperStore } from './shipper-store';
import { MasterTypeStore } from './master-type-store';
import { UserStore } from './user-store';
import { PasswordResetStore } from './password-reset-store';
import { PasswordChangeStore } from './password-change-store';
import { UploadFileStore } from './upload-file-store';
import { JobStore } from './job-store';
import { TruckStore } from './truck-store';
import { TruckTypeStore } from './truck-type-store';
import { ProductTypeStore } from './product-type-store';
import { VersatileStore } from './versatile-store';

const RootModel = types.model({
  loginStore: LoginStore,
  carrierStore: CarrierStore,
  shipperStore: ShipperStore,
  masterTypeStore: MasterTypeStore,
  userStore: UserStore,
  passwordResetStore: PasswordResetStore,
  passwordChangeStore: PasswordChangeStore,
  uploadFileStore: UploadFileStore,
  jobStore: JobStore,
  truckStore: TruckStore,
  truckTypesStore: TruckTypeStore,
  productTypesStore: ProductTypeStore,
  versatileStore: VersatileStore
});

let initialState = RootModel.create({
  loginStore: {
    language: 'th',
    data_signin: {
      idToken: '',
      accessToken: '',
    },
    error_login: '',
    data_profile: null,
    rememberProfile: false,
  },
  carrierStore: {
    trucks_carrier: null,
  },
  shipperStore: {
    jobs_shipper: null,
    product_types: [],
  },
  masterTypeStore: {
    regions: [],
    provinces: [],
  },
  userStore: {
    data_user: {
      content: [],
      reRender: false,
      lengthPerPage: 10,
    },
    data_upload: {},
  },
  passwordResetStore: {
    data_password: {
      message: null,
      alreadySent: null,
    },
    error_password: null,
  },
  passwordChangeStore: {
    response: { message: null },
    error: null,
  },
  uploadFileStore: {
    loading: false,
    file: null,
    error_response: null,
  },
  jobStore: {
    loading: false,
    error_response: null,
    tmpNotificationJobId: null,
    notificationLoading: false,
    notificationData: false,
    errorNotification: null
  },
  truckStore: {
    loading: false,
    userTrucks_loading: false,
    error_response: null,
  },
  truckTypesStore: {
    loading: false,
    error_response: null,
  },
  productTypesStore: {
    loading: false,
    error_response: null,
  },
  versatileStore: {
    list: null,
    list_loading: false,
    error: '',

    region: null,
    loading_region: false,
    error_region: '',

    province: null,
    loading_province: false,
    error_province: '',

    list_product_type: null,
    list_product_type_pure: null,
    product_type_loading: false,
    product_type_error: '',
  }
});

if (typeof window !== 'undefined') {
  console.log('we are running on the client');
  const data = localStorage.getItem('rootState');
  if (data) {
    const json = JSON.parse(data);
    if (RootModel.is(json)) {
      initialState = RootModel.create(json);
    }
  }
} else {
  console.log('we are running on the server');
}

export const rootStore = initialState;

onSnapshot(rootStore, (snapshot) => {
  console.log('Snapshot: ', snapshot);
  localStorage.setItem('rootState', JSON.stringify(snapshot));
});

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}
