import { useStaticRendering } from 'mobx-react';
import { create } from 'mobx-persist';
import localForage from 'localforage';
import LoginStore from './login-store';
import * as memoryDriver from 'localforage-driver-memory';
import { get } from 'lodash';
const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

let store = null;
localForage.defineDriver(memoryDriver);
localForage.setDriver([localForage.INDEXEDDB, localForage.WEBSQL, localForage.LOCALSTORAGE]);
localForage.config({
  driver: [localForage.INDEXEDDB, localForage.WEBSQL, localForage.LOCALSTORAGE],
  name: 'tcrb',
  size: 6000000,
});
const hydrate = create({
  storage: localForage,
  jsonify: false,
});

export default function InitializeStore(initialData = {}) {
  if (isServer) {
    store = {
      loginStore: new LoginStore(),
    };
  }
  if (!store) {
    store = {
      loginStore: new LoginStore(),
    };

    // เรียกใช้งาน mobx-persist
    Promise.all([hydrate('loginStore', store.loginStore)]).then(() => console.log('mobx-persist setup'));
  }

  return store;
}

export const _getItemLocalForage = async (name, type) => {
  try {
    let result = (await localForage.getItem(name))[type];
    console.log(result);
    console.log('____________ Result on New Function ____________');
    return result;
  } catch (err) {
    console.log('_______________Error On Local Forage : ', err);
    return '';
  }
};

export const _getItemLocalForageNoneKey = async (name) => {
  try {
    let result = await localForage.getItem(name);
    console.log(result);
    console.log('____________ Result on New Function ____________');
    return result;
  } catch (err) {
    console.log('_______________Error On Local Forage : ', err);
    return '';
  }
};

export const _setItemLocalForage = async (name, data) => {
  try {
    let result = await localForage.setItem(name, data);
    console.log(result);
    console.log('______________ Result on Set LocalForage _____________');
    return result;
  } catch (err) {
    console.log('________________ Error set LocalForage ________________', err);
    return '';
  }
};

export const _getTokenObject = async (type) => {
  let result;
  let profile = (await _getItemLocalForageNoneKey('loginStore')).profile;
  let tokenObj = (await _getItemLocalForageNoneKey('loginStore')).data_signin;
  profile = profile && profile.username ? profile : '';
  tokenObj =
    tokenObj && tokenObj.idToken
      ? tokenObj
      : {
          accessToken: '',
          idToken: '',
          refreshToken: '',
        };

  if (type == 'username') {
    result = get(profile, `${type}`, '');
    return result;
  } else if (type == 'accessToken' || type == 'idToken' || type == 'refreshToken') {
    result = tokenObj[type];
    return result;
  }
};
