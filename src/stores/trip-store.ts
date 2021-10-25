import { flow, types } from 'mobx-state-tree';
import { TripApi } from '../services';
import { IPostTripProps, IUpdateTripProps, IPatchTripProps } from '../services/trip-api';

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
  id: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  mobileNo: types.maybeNull(types.string),
  avatar: types.maybeNull(AvatarType),
});

const QuotationType = types.model({
  id: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  avatar: types.maybeNull(AvatarType),
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
      truckPhotos: types.maybeNull(types.array(types.string)),
      approveStatus: types.maybeNull(types.string),
      loadingWeight: types.maybeNull(types.number),
      registrationNumber: types.maybeNull(types.array(types.string)),
      phoneNumber: types.maybeNull(types.string),
    }),
  ),
  bookingDatetime: types.maybeNull(types.string),
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
      truckPhotos: types.maybeNull(types.array(types.string)),
      approveStatus: types.maybeNull(types.string),
      loadingWeight: types.maybeNull(types.number),
      registrationNumber: types.maybeNull(types.array(types.string)),
      phoneNumber: types.maybeNull(types.string),
    }),
  ),
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

const TripDetailType = types.model({
  id: types.maybeNull(types.string),
  weightStart: types.maybeNull(types.string),
  weightEnd: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  startDate: types.maybeNull(types.string),
  bankAccount: types.array(
    types.model({
      id: types.maybeNull(types.string),
      accountName: types.maybeNull(types.string),
      accountNo: types.maybeNull(types.string),
      bankName: types.maybeNull(types.string),
    }),
  ),
  job: types.model({
    id: types.maybeNull(types.string),
    productTypeId: types.maybeNull(types.number),
    productName: types.maybeNull(types.string),
    truckType: types.maybeNull(types.number),
    weight: types.maybeNull(types.string),
    requiredTruckAmount: types.maybeNull(types.number),
    from: types.maybeNull(DestinationType),
    to: types.maybeNull(types.array(DestinationType)),
    owner: types.maybeNull(OwnerType),
    tipper: types.maybeNull(types.boolean),
    price: types.maybeNull(types.string),
    priceType: types.maybeNull(types.string),
    payment: types.maybeNull(
      types.model({
        id: types.maybeNull(types.string),
        pricePerTon: types.maybeNull(types.string),
        amount: types.maybeNull(types.string),
        feeAmount: types.maybeNull(types.string),
        feePercentage: types.maybeNull(types.string),
        netAmount: types.maybeNull(types.string),
        paymentStatus: types.maybeNull(types.string),
        billStartDate: types.maybeNull(types.string),
        paymentDate: types.maybeNull(types.string),
      }),
    ),
  }),
  truck: types.model({
    id: types.maybeNull(types.string),
    registrationNumber: types.maybeNull(types.array(types.string)),
    truckType: types.maybeNull(types.number),
    carrierId: types.maybeNull(types.string),
    owner: types.maybeNull(OwnerType),
    payment: types.maybeNull(
      types.model({
        id: types.maybeNull(types.string),
        bankAccountId: types.maybeNull(types.string),
        pricePerTon: types.maybeNull(types.string),
        amount: types.maybeNull(types.string),
        feeAmount: types.maybeNull(types.string),
        feePercentage: types.maybeNull(types.string),
        netAmount: types.maybeNull(types.string),
        paymentStatus: types.maybeNull(types.string),
        paymentDate: types.maybeNull(types.string),
      }),
    ),
  }),
});

export const TripStore = types
  .model('TripStore', {
    loading: false,
    data_count: types.maybeNull(types.number),
    jobDetail: types.maybeNull(JobDetailType),
    tripDetail: types.maybeNull(TripDetailType),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      add: flow(function* addTrip(data: IPostTripProps) {
        self.loading = true;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TripApi.addBulkTrip(data);
          console.log('add response :>', response);
          if (response && response.ok) {
            const data = response.data;
            console.log('data :>> ', data);
          } else {
            self.error_response = {
              title: response.problem,
              content: 'POST trip : ' + response.originalError.message,
            };
          }
          self.loading = false;
        } catch (error) {
          console.error('Failed to add :>', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to add',
          };
        }
      }),

      getTripDetail: flow(function* getTripDetail(tripId: string) {
        self.loading = true;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TripApi.getTripDetail(tripId);
          console.log('get detail response :>', response);
          if (response && response.ok) {
            const data = response.data;
            console.log('data :>> ', data);
            self.tripDetail = data;
          } else {
            self.error_response = {
              title: response.problem,
              content: response?.data?.message || 'GET trip detail : ' + response.originalError.message,
            };
          }
          self.loading = false;
        } catch (error) {
          console.error('Failed to add :>', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to add',
          };
        }
      }),

      update: flow(function* update(tripId: string, data: IUpdateTripProps) {
        self.loading = true;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TripApi.updateTrip(tripId, data);
          console.log('update response :>', response);
          if (response && response.ok) {
            const data = response.data;
            console.log('data :>> ', data);
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET trip detail : ' + response.originalError.message,
            };
          }
          self.loading = false;
        } catch (error) {
          console.error('Failed to add :>', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to add',
          };
        }
      }),

      updateJobTrip: flow(function* updateJobTrip(jobId: string, data: IPatchTripProps) {
        self.loading = true;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TripApi.updateJobTrip(jobId, data);
          console.log('update job trip response :>', response);
          if (response && response.ok) {
            const data = response.data;
            console.log('data :>> ', data);
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET trip detail : ' + response.originalError.message,
            };
          }
          self.loading = false;
        } catch (error) {
          console.error('Failed to add :>', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to add',
          };
        }
      }),

      delete: flow(function* deleteTrip(tripId: string) {
        self.loading = true;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TripApi.delete(tripId);
          console.log('delete response :>', response);
          if (response && response.ok) {
            const data = response.data;
            console.log('data :>> ', data);
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET trip detail : ' + response.originalError.message,
            };
          }
          self.loading = false;
        } catch (error) {
          console.error('Failed to add :>', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to add',
          };
        }
      }),

      clearTriipDetail: function () {
        self.tripDetail = null;
      },
    };
  })
  .create({
    loading: false,
    error_response: null,
  });
