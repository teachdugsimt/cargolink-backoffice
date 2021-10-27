import { types, flow, cast } from 'mobx-state-tree';
import TransportationApi, {
  TransportationResponse,
  TransportationParams,
  SearchJobParams,
  ITripDetailProps,
} from '../services/transportation-api';

const ImageModel = types.model({
  object: types.maybeNull(types.string),
});
const TruckModel = types.model({
  id: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  stallHeight: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.maybeNull(types.string))),
  tipper: types.maybeNull(types.boolean),
  carrierId: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  isLiked: types.maybeNull(types.boolean),
  workZones: types.maybeNull(
    types.optional(
      types.array(
        types.model({
          region: types.maybeNull(types.number),
          province: types.maybeNull(types.number),
        }),
      ),
      [],
    ),
  ),
  owner: types.maybeNull(
    types.model({
      id: types.maybeNull(types.number),
      userId: types.maybeNull(types.string),
      companyName: types.maybeNull(types.string),
      fullName: types.maybeNull(types.string),
      mobileNo: types.maybeNull(types.string),
      email: types.maybeNull(types.string),
      avatar: types.maybeNull(
        types.model({
          object: types.maybeNull(types.string),
          token: types.maybeNull(types.string),
        }),
      ),
    }),
  ),
  truckPhotos: types.maybeNull(
    types.model({
      front: types.maybeNull(types.string),
      back: types.maybeNull(types.string),
      left: types.maybeNull(types.string),
      right: types.maybeNull(types.string),
    }),
  ),
});

const Trips = types.model({
  id: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  status: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  createdAt: types.maybeNull(types.string),
  createdUser: types.maybeNull(types.string),
  jobCarrierId: types.maybeNull(types.number),
  truck: types.maybeNull(TruckModel),
  startDate: types.maybeNull(types.string),
  isDeleted: types.maybeNull(types.boolean),
});

const JobModel = {
  id: types.maybeNull(types.string),
  userId: types.maybeNull(types.number),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  weight: types.maybeNull(types.string),
  requiredTruckAmount: types.maybeNull(types.number),
  loadingDatetime: types.maybeNull(types.string),
  from: types.maybeNull(
    types.model({
      name: types.maybeNull(types.string),
      dateTime: types.maybeNull(types.string),
      contactName: types.maybeNull(types.string),
      contactMobileNo: types.maybeNull(types.string),
      lat: types.maybeNull(types.number),
      lng: types.maybeNull(types.number),
    }),
  ),
  to: types.maybeNull(
    types.array(
      types.model({
        name: types.maybeNull(types.string),
        dateTime: types.maybeNull(types.string),
        contactName: types.maybeNull(types.string),
        contactMobileNo: types.maybeNull(types.string),
        lat: types.maybeNull(types.string),
        lng: types.maybeNull(types.string),
      }),
    ),
  ),
  owner: types.maybeNull(
    types.model({
      id: types.maybeNull(types.number),
      userId: types.maybeNull(types.string),
      companyName: types.maybeNull(types.string),
      fullName: types.maybeNull(types.string),
      mobileNo: types.maybeNull(types.string),
      email: types.maybeNull(types.string),
      avatar: types.maybeNull(
        types.model({
          object: types.maybeNull(types.string),
          token: types.maybeNull(types.string),
        }),
      ),
    }),
  ),
  price: types.maybeNull(types.string),
  priceType: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  createdAt: types.maybeNull(types.string),
};

const MinimalJobModel = types.model({
  id: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.string),
  requiredTruckAmount: types.maybeNull(types.number),
  status: types.maybeNull(types.string),
  price: types.maybeNull(types.string),
  priceType: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  isDeleted: types.maybeNull(types.boolean),
  publicAsCgl: types.maybeNull(types.boolean),
  family: types.maybeNull(types.model({
    parent: types.maybeNull(types.number),
    child: types.maybeNull(types.array(types.maybeNull(types.number)))
  })),
  createdAt: types.maybeNull(types.string),
  from: types.maybeNull(
    types.model({
      name: types.maybeNull(types.string),
      dateTime: types.maybeNull(types.string),
      contactName: types.maybeNull(types.string),
      contactMobileNo: types.maybeNull(types.string),
      lat: types.maybeNull(types.number),
      lng: types.maybeNull(types.number),
    }),
  ),
  to: types.maybeNull(
    types.array(
      types.model({
        name: types.maybeNull(types.string),
        dateTime: types.maybeNull(types.string),
        contactName: types.maybeNull(types.string),
        contactMobileNo: types.maybeNull(types.string),
        lat: types.maybeNull(types.string),
        lng: types.maybeNull(types.string),
      }),
    ),
  ),
})

const ShipperJob = types.maybeNull(
  types.model({
    ...JobModel,
    trips: types.maybeNull(types.array(types.maybeNull(Trips))),
    updatedAt: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
  }),
);

const PaginationModel = types.model({
  size: types.maybeNull(types.number),
  totalElements: types.maybeNull(types.number),
  totalPages: types.maybeNull(types.number),
  currentPage: types.maybeNull(types.number),
});

const DestinationType = types.model({
  name: types.maybeNull(types.string),
  dateTime: types.maybeNull(types.string),
  contactName: types.maybeNull(types.string),
  contactMobileNo: types.maybeNull(types.string),
  lat: types.maybeNull(types.string),
  lng: types.maybeNull(types.string),
});

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

const TripType = types.model({
  id: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  truck: types.maybeNull(
    types.model({
      id: types.maybeNull(types.string),
      owner: types.maybeNull(OwnerType),
      tipper: types.maybeNull(types.boolean),
      workingZones: types.maybeNull(
        types.array(
          types.model({
            region: types.maybeNull(types.number),
            province: types.maybeNull(types.number),
          }),
        ),
      ),
      createdAt: types.maybeNull(types.string),
      updatedAt: types.maybeNull(types.string),
      truckType: types.maybeNull(types.number),
      stallHeight: types.maybeNull(types.string),
      truckPhotos: types.maybeNull(
        types.model({
          back: types.maybeNull(types.string),
          front: types.maybeNull(types.string),
          left: types.maybeNull(types.string),
          right: types.maybeNull(types.string),
        }),
      ),
      approveStatus: types.maybeNull(types.string),
      loadingWeight: types.maybeNull(types.number),
      registrationNumber: types.maybeNull(types.array(types.string)),
      phoneNumber: types.maybeNull(types.string),
    }),
  ),
  startDate: types.maybeNull(types.string),
  isDeleted: types.maybeNull(types.boolean),
  status: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  createdAt: types.maybeNull(types.string),
  createdUser: types.maybeNull(types.string),
  jobCarrierId: types.maybeNull(types.number),
});

const JobDetailType = types.model({
  id: types.maybeNull(types.string),
  userId: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  requiredTruckAmount: types.maybeNull(types.number),
  loadingDatetime: types.maybeNull(types.string),
  from: types.maybeNull(DestinationType),
  to: types.maybeNull(types.array(DestinationType)),
  owner: types.maybeNull(OwnerType),
  trips: types.maybeNull(types.array(TripType)),
  status: types.maybeNull(types.string),
  price: types.maybeNull(types.string),
  priceType: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
});

export const TransportationStore = types
  .model('TransportationStore', {
    list: types.maybeNull(types.array(types.maybeNull(ShipperJob))),
    loading: types.boolean,
    error: types.maybeNull(types.string),
    pagination: PaginationModel,
    jobDetail: types.maybeNull(JobDetailType),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
    search_list: types.maybeNull(types.array(types.maybeNull(MinimalJobModel))),
  })
  .actions((self) => {
    return {
      getTransportationList: flow(function* getTransportationList(params: TransportationParams) {
        self.loading = true;
        try {
          const response = yield TransportationApi.getTransportationList(params);
          console.log('get Transportation list response :> ', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages }: TransportationResponse = response.data;

            if (totalElements && totalPages) {
              const tmpPagination: Pagination = JSON.parse(JSON.stringify(self.pagination));
              tmpPagination.totalElements = totalElements;
              tmpPagination.totalPages = totalPages;
              self.pagination = tmpPagination;
            }

            self.list = data;
          } else {
            const errorMsg: string = response?.data?.message || 'something wrong';
            self.error = errorMsg;
            self.list = [];
            self.loading = false;
          }
        } catch (error) {
          console.error('Failed to get Transportation list :>', error);
          self.loading = false;
          self.list = [];
          self.error = JSON.stringify(error);
        }
      }),
      setPagination(params: Pagination) {
        self.pagination = params;
      },

      getJobDetail: flow(function* getJobDetail(jobId: string, filter?: ITripDetailProps) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield TransportationApi.getTransportationDetailByJobId(jobId, filter);
          console.log('getJobDetail response :>> ', response);
          if (response && response.ok) {
            const data = response.data;
            console.log('data :>> ', data);
            self.jobDetail = data;
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET job detail : ' + response.originalError.message,
            };
          }
          self.loading = false;
        } catch (err) {
          console.log('Fail to get job detail :>> ', err);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get job detail',
          };
        }
      }),

      clearJobDetail: function () {
        self.jobDetail = null;
      },


      searchJob: flow(function* searchJob(params: SearchJobParams) {
        self.loading = true;
        try {
          const response = yield TransportationApi.searchJob(params);
          console.log('get Search Job response :> ', response);
          if (response && response.ok) {
            const { data }: TransportationResponse = response.data;
            self.search_list = data || [];
          } else {
            const errorMsg: string = response?.data?.message || 'something wrong';
            self.error = errorMsg;
            self.loading = false;
          }
        } catch (error) {
          console.error('Failed to get Search Job :>', error);
          self.loading = false;
          self.error = JSON.stringify(error);
        }
      }),
    };
  })
  .create({
    list: null,
    loading: false,
    error: '',
    pagination: {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
    },
    search_list: null,
  });

export interface Pagination {
  size: number;
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
