import { flow, types } from 'mobx-state-tree';
import { TripApi } from '../services';
import { IPostTruckProps } from '../services/trip-api';

export const TripStore = types
  .model('TripStore', {
    loading: false,
    data_count: types.maybeNull(types.number),
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
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'POST trip : ' + response.originalError.message,
            };
          }
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
