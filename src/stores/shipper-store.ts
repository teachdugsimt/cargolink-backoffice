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

const jobs = types.model({
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

export const ShipperStore = types
  .model('ShipperStore', {
    jobs_shipper: types.maybeNull(types.array(jobs)),
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
            if (data?.length % 10 === 0) {
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
      clearShipperStore: flow(function* clearShipperStore() {
        self.jobs_shipper = null;
      }),
      PostJobs: flow(function* PostJobs() {
        try {
          // ... yield can be used in async/await style
          const response = yield ShipperApi.AddJobs();
          console.log('PostJobs response :> ', response);
        } catch (error) {
          // ... including try/catch error handling
          console.error('Failed to PostJobs :> ', error);
        }
      }),
    };
  });
