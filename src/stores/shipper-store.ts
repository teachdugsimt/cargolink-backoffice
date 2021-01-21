import { types, flow } from 'mobx-state-tree';
import { ShipperApi } from '../services';

const ArrayFrom = types.model({
  name: types.maybeNull(types.string),
  dateTime: types.maybeNull(types.string),
  contactName: types.maybeNull(types.string),
  contactMobileNo: types.maybeNull(types.string),
  lat: types.maybeNull(types.string),
  lng: types.maybeNull(types.string),
});

const ArrayTo = types.model({
  name: types.maybeNull(types.string),
  dateTime: types.maybeNull(types.string),
  contactName: types.maybeNull(types.string),
  contactMobileNo: types.maybeNull(types.string),
  lat: types.maybeNull(types.string),
  lng: types.maybeNull(types.string),
});

const OwnerObject = types.model({
  id: types.maybeNull(types.number),
  companyName: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  mobileNo: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
});

const Jobs = types.model({
  id: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  requiredTruckAmount: types.maybeNull(types.number),
  from: types.maybeNull(ArrayFrom),
  to: types.maybeNull(types.array(ArrayTo)),
  owner: types.maybeNull(OwnerObject),
});

const Products = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
});

export const ShipperStore = types
  .model('ShipperStore', {
    jobs_shipper: types.maybeNull(types.array(Jobs)),
    product_types: types.maybeNull(types.array(Products)),
  })
  .actions((self) => {
    return {
      getAllJobsByShipper: flow(function* getAllJobsByShipper(params) {
        try {
          const response = yield ShipperApi.getAllJobs(params);
          console.log('getAllJobsByShipper response :> ', response);

          if (response && response.ok) {
            const { data } = response;
            //? in th first time, we get jobs
            let jobs = JSON.parse(JSON.stringify(self.jobs_shipper));
            if (self.jobs_shipper?.length) jobs.push(...data);
            else jobs = data;

            self.jobs_shipper = jobs;

            //? in th second time, we get jobs
            if (data?.length && data?.length % 10 === 0) {
              //? change page parameter
              let newParams = JSON.parse(JSON.stringify(params));
              newParams.page = jobs?.length;

              const newResponse = yield ShipperApi.getAllJobs(newParams);
              console.log('getAllJobsByShipper newResponse :> ', newResponse);

              if (newResponse && newResponse.ok) {
                const newData = newResponse.data;
                let newJobs = JSON.parse(JSON.stringify(self.jobs_shipper));
                newJobs.push(...newData);
                self.jobs_shipper = newJobs;
              }
            }
          } else {
            self.jobs_shipper = null;
          }
        } catch (error) {
          console.error('Failed to getAllJobsByShipper :> ', error);
          self.jobs_shipper = null;
        }
      }),

      postJobs: flow(function* postJobs(params) {
        try {
          const response = yield ShipperApi.addJobs(params);
          console.log('postJobs response :> ', response);
        } catch (error) {
          console.error('Failed to post job :> ', error);
        }
      }),

      getProductTypes: flow(function* getProductTypes() {
        try {
          const response = yield ShipperApi.getAllProductType();
          console.log('getProductTypes response :> ', response);
          if (response && response.ok) {
            self.product_types = response.data;
          } else {
            self.product_types = null;
          }
        } catch (error) {
          console.error('Failed to get product types :> ', error);
          self.product_types = null;
        }
      }),

      clearShipperStore: flow(function* clearShipperStore() {
        self.jobs_shipper = null;
      }),
    };
  });
