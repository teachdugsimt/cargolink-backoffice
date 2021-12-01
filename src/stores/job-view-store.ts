import { types, flow } from 'mobx-state-tree';
import { UserApi, BookingApi } from '../services';
import { IBookingParams } from '../services/booking-api';
import { CreateOrUpdateLineOaAndBooking, CreateUserLineLiff, ParamsCheckLineProfile, ParamsCheckLineProfileV2 } from '../services/user-api';

const SaveUser = types.maybeNull(types.model({
  isCall: types.boolean
}))

export const JobViewStore = types
  .model('JobViewStore', {
    phoneNumber: process.env.PHONE_NUMBER_CARGOLINK || '021065312',
    loading: false,
    checkLine: SaveUser,
    saveUser: SaveUser,
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),

    checkLineBooking: types.maybeNull(types.model({
      userId: types.maybeNull(types.string)
    })),
    bookingLine: types.maybeNull(types.number)
  })
  .actions((self) => {
    return {


      checkLineAccount: flow(function* checkLineAccount(params: ParamsCheckLineProfile) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield UserApi.checkLineProfile(params);
          console.log('Check line profile response :> ', response);

          self.loading = false;
          if (response && response.ok) {
            self.checkLine = response.data;
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET check user line : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to Check line profile :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to check line user',
          };
        }
      }),

      checkLineAccountV2: flow(function* checkLineAccountV2(params: ParamsCheckLineProfileV2) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield UserApi.checkLineProfileV2(params);
          console.log('Check line profile response :> ', response);

          self.loading = false;
          if (response && response.ok) {
            self.checkLineBooking = response.data;
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET check user line : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to Check line profile :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to check line user',
          };
        }
      }),
      bookingJobInLine: flow(function* bookingJobInLine(params: IBookingParams) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield BookingApi.bookingPost(params);
          console.log('Check line profile response :> ', response);

          self.loading = false;
          if (response && response.ok) {
            self.bookingLine = response.data;
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET check user line : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to Check line profile :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to check line user',
          };
        }
      }),
      createOrUpdateLineOaBooking: flow(function* createOrUpdateLineOaBooking(params: CreateOrUpdateLineOaAndBooking) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield UserApi.createOrUpdateLineOaBooking(params);
          console.log('Check line profile response :> ', response);

          self.loading = false;
          if (response && response.ok) {
            self.bookingLine = response.data;
          } else {
            self.error_response = {
              title: response.problem,
              content: 'GET check user line : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to Check line profile :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to check line user',
          };
        }
      }),



      createUserWithLine: flow(function* createUserWithLine(params: CreateUserLineLiff) {
        self.loading = true;
        self.error_response = null;
        try {
          const response = yield UserApi.createUserWithLine(params);
          console.log('Save user line liff response :> ', response);

          self.loading = false;
          if (response && response.ok) {
            self.saveUser = response.data;
          } else {
            self.error_response = {
              title: response.problem,
              content: 'POST save user line liff : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to Save user line liff :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to save user line liff',
          };
        }
      }),
      clearSaveUser() {
        self.saveUser = null
      },
      clearCheckLine() {
        self.checkLine = null
      },
      clearError() {
        self.error_response = null
      },
      clearCreateOrUpdateLineOA() {
        self.checkLineBooking = null
      }


    };
  }).create({
    loading: false,
    checkLine: null,
    saveUser: null,
    error_response: null,
    checkLineBooking: null,
    bookingLine: null,
  })
