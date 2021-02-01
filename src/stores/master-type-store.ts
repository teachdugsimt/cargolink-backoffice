import { types, flow } from 'mobx-state-tree';
import { MasterTypeApi } from '../services';

const Regions = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
});

const Provinces = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
});

export const MasterTypeStore = types
  .model('MasterTypeStore', {
    loading: false,
    regions: types.maybeNull(types.array(Regions)),
    provinces: types.maybeNull(types.array(Provinces)),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      getAllRegion: flow(function* getAllRegion() {
        self.loading = true;
        self.regions = null;
        self.error_response = null;
        try {
          const response = yield MasterTypeApi.getRegions();
          console.log('getAllRegion response :> ', response);

          if (response && response.ok) {
            self.loading = false;
            self.regions = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'GET regions : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getAllRegion :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all region',
          };
        }
      }),

      getAllProvince: flow(function* getAllProvince(params) {
        self.loading = true;
        self.provinces = null;
        self.error_response = null;
        try {
          const response = yield MasterTypeApi.getProvinces(params);
          console.log('getAllProvince response :> ', response);

          if (response && response.ok) {
            self.loading = false;
            self.provinces = response.data;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'GET provinces : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getAllProvince :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to get all province',
          };
        }
      }),
    };
  });
