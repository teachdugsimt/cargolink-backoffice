import { types, flow } from 'mobx-state-tree';
import { ShipperApi } from '../services';

const ObjectFrom = types.model({
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
  from: types.maybeNull(ObjectFrom),
  to: types.maybeNull(types.array(ArrayTo)),
  owner: types.maybeNull(OwnerObject),
  status: types.maybeNull(types.number),
});

const Products = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
});

export const ShipperStore = types
  .model('ShipperStore', {
    loading: false,
    jobs_shipper: types.maybeNull(types.array(Jobs)),
    product_types: types.maybeNull(types.array(Products)),
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
      getAllJobsByShipper: flow(function* getAllJobsByShipper(params) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield ShipperApi.getAllJobs(params);
          console.log('getAllJobsByShipper response :> ', response);

          if (response && response.ok) {
            const { data } = response;
            self.loading = false;
            //? in th first time, we get jobs
            let jobs = JSON.parse(JSON.stringify(self.jobs_shipper));
            if (self.jobs_shipper?.length) jobs.push(...data);
            else jobs = data;

            self.jobs_shipper = jobs;

            //? in th second time, we get jobs
            if (data?.length && data?.length % 10 === 0) {
              self.loading = true;
              //? change page parameter
              let newParams = JSON.parse(JSON.stringify(params));
              newParams.page = jobs?.length;

              const newResponse = yield ShipperApi.getAllJobs(newParams);
              console.log('getAllJobsByShipper newResponse :> ', newResponse);

              if (newResponse && newResponse.ok) {
                self.loading = false;
                const newData = newResponse.data;
                let newJobs = JSON.parse(JSON.stringify(self.jobs_shipper));
                newJobs.push(...newData);
                self.jobs_shipper = newJobs;
              } else {
                self.loading = false;
              }
            }
          } else {
            self.loading = false;
            self.jobs_shipper = null;
            self.error_response = {
              title: response.problem,
              content: 'GET jobs : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getAllJobsByShipper :> ', error);
          self.loading = false;
          self.jobs_shipper = null;
          self.error_response = {
            title: '',
            content: 'Failed to get all jobs by shipper',
          };
        }
      }),

      postJobs: flow(function* postJobs(params) {
        self.loading = true;
        self.success_response = false;
        self.error_response = null;
        try {
          const response = yield ShipperApi.addJobs(params);
          console.log('postJobs response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.success_response = true;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'POST job : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to post job :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to post job ',
          };
        }
      }),

      getProductTypes: flow(function* getProductTypes() {
        // self.loading = true;
        self.product_types = null;
        self.error_response = null;
        try {
          const response = yield ShipperApi.getAllProductType();
          console.log('getProductTypes response :> ', response);
          if (response && response.ok) {
            // self.loading = false;
            self.product_types = response.data;
          } else {
            // self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'GET product-types : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to get product types :> ', error);
          // self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get product types ',
          };
        }
      }),

      clearShipperStore: flow(function* clearShipperStore() {
        self.jobs_shipper = null;
        self.success_response = false;
        self.error_response = null;
      }),
    };
  });
