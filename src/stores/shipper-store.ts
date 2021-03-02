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

const AvatarObject = types.model({
  object: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
});

const OwnerObject = types.model({
  id: types.maybeNull(types.number),
  companyName: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  mobileNo: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  avatar: types.maybeNull(AvatarObject),
  userId: types.maybeNull(types.string),
});

const contentData = types.model({
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

// const sortData = types.model({
//   empty: types.maybeNull(types.boolean),
//   sorted: types.maybeNull(types.boolean),
//   unsorted: types.maybeNull(types.boolean),
// });

// const pageableData = types.model({
//   offset: types.maybeNull(types.number),
//   pageNumber: types.maybeNull(types.number),
//   pageSize: types.maybeNull(types.number),
//   sort: types.maybeNull(sortData),
//   paged: types.maybeNull(types.boolean),
//   unpaged: types.maybeNull(types.boolean),
// });

// const Jobs = types.model({
//   content: types.maybeNull(types.array(contentData)),
//   empty: types.maybeNull(types.boolean),
//   first: types.maybeNull(types.boolean),
//   last: types.maybeNull(types.boolean),
//   number: types.maybeNull(types.number),
//   numberOfElements: types.maybeNull(types.number),
//   pageable: types.maybeNull(pageableData),
//   size: types.maybeNull(types.number),
//   sort: types.maybeNull(sortData),
//   totalElements: types.maybeNull(types.number),
//   totalPages: types.maybeNull(types.number),
// });

const Jobs = types.model({
  content: types.maybeNull(types.array(contentData)),
  reRender: types.boolean,
});

const Products = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
});

const Quotations = types.model({
  id: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  bookingDatetime: types.maybeNull(types.string),
  avatar: types.maybeNull(types.string),
});

const jobDetail = types.model({
  id: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  requiredTruckAmount: types.maybeNull(types.number),
  from: types.maybeNull(ObjectFrom),
  to: types.maybeNull(types.array(ArrayTo)),
  owner: types.maybeNull(OwnerObject),
  quotations: types.maybeNull(types.array(Quotations)),
});

export const ShipperStore = types
  .model('ShipperStore', {
    loading: false,
    jobs_shipper: types.maybeNull(Jobs),
    job_detail: types.maybeNull(jobDetail),
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
            const pageNumber = data.pageable.pageNumber * 10;
            const content = data.content;
            let jobs: { content: any; reRender: boolean } = { content: [], reRender: true };
            const ct = {
              id: null,
              productTypeId: null,
              productName: null,
              truckType: null,
              weight: null,
              requiredTruckAmount: null,
              from: null,
              to: null,
              owner: null,
              status: null,
            };
            if (pageNumber == 0) {
              //? in th first time, we get jobs
              jobs.content = [...content, ...Array(data.totalElements - content.length).fill(ct)];
            } else {
              jobs.content = Array(data.totalElements).fill(ct);
              const pageSize = data.numberOfElements;
              for (let i = pageNumber, j = 0; i < pageNumber + pageSize; i++, j++) {
                jobs.content[i] = content[j];
              }
              jobs.reRender = !!!self.jobs_shipper?.reRender;
            }
            self.jobs_shipper = jobs;
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

      getJobDetailById: flow(function* getJobDetailById(id: string) {
        self.loading = true;
        self.job_detail = null;
        self.error_response = null;
        try {
          const response = yield ShipperApi.jobDetail(id);
          console.log('jobDetail response :> ', response);
          if (response && response.ok) {
            self.loading = false;
            self.job_detail = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'GET truck : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to jobDetail :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all drivers by carrier',
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
