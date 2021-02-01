import { useContext, createContext } from 'react';
import { types, Instance, onSnapshot } from 'mobx-state-tree';

import { LoginStore } from './login-store';
import { CarrierStore } from './carrier-store';
import { ShipperStore } from './shipper-store';
import { MasterTypeStore } from './master-type-store';

const RootModel = types.model({
  loginStore: LoginStore,
  carrierStore: CarrierStore,
  shipperStore: ShipperStore,
  masterTypeStore: MasterTypeStore,
});

let initialState = RootModel.create({
  loginStore: {
    language: 'th',
    data_signin: {
      idToken: '',
    },
    error_login: '',
  },
  carrierStore: {
    trucks_carrier: [],
  },
  shipperStore: {
    jobs_shipper: [],
    product_types: [],
  },
  masterTypeStore: {
    regions: [],
    provinces: [],
  },
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
