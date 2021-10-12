import { flow, types } from 'mobx-state-tree';
import { TripApi } from '../services';
import { IPostTruckProps } from '../services/trip-api';

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

export const TripStore = types
  .model('TripStore', {
    loading: false,
    data_count: types.maybeNull(types.number),
    jobDetail: types.maybeNull(JobDetailType),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      add: flow(function* addTrip(params: IPostTruckProps) {
        self.loading = true;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield TripApi.addTrip(params);
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
    };
  })
  .create({
    loading: false,
    error_response: null,
  });
