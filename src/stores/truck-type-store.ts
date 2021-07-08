import { types, flow } from 'mobx-state-tree';
import { TruckTypeApi } from '../services';
import { ITruckType } from '../services/truck-type-api';

const TruckTypeType = types.model({
  id: types.number,
  groupId: types.number,
  image: types.string,
  name: types.string,
});

export const TruckTypeStore = types
  .model('TruckTypeStore', {
    loading: false,
    data: types.maybeNull(types.array(TruckTypeType)),
    count: types.maybeNull(types.number),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        text: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      getTruckTypes: flow(function* getTruckTypes() {
        self.loading = true;
        self.data = null;
        self.count = null;
        self.error_response = null;
        try {
          const response = yield TruckTypeApi.getTruckTypes();
          console.log('getTruckTypes response :>', response);
          if (response && response.ok) {
            const truckTypesList: ITruckType[] = response.data;
            self.data = truckTypesList;
            self.count = truckTypesList.length;
            self.error_response = null;
          } else {
            self.data = null;
            self.count = null;
            self.error_response = {
              title: response.problem,
              text: 'GET truck types :' + response.originalError.message,
            }
          }
        } catch (error) {
          console.error('Failed to getTruckTypes :>', error);
          self.data = null;
          self.error_response = {
            title: '',
            text: 'Failed to getTruckTypes',
          }
        }
        self.loading = false;
      }),
    };
  });
