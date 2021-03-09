import { types, flow } from 'mobx-state-tree';
import userApi from '../services/user-api';

const user = types.model({
  fullName: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  registerDate: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  jobCount: types.maybeNull(types.number),
  truckCount: types.maybeNull(types.number),
});

const userManagement = types.model({
  content: types.maybeNull(types.array(user)),
  reRender: types.boolean,
});

export const UserStore = types
  .model('UserStore', {
    loading: false,
    success_response: false,
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
    data_user: types.maybeNull(userManagement),
  })
  .actions((self) => {
    return {
      getUsers: flow(function* getUsers(params) {
        self.loading = true;
        self.data_user = null;
        self.error_response = null;
        try {
          const response = yield userApi.User(params);
          console.log('getUsers response :> ', response);
          if (response && response.ok) {
            const { data } = response;
            self.loading = false;
            const pageNumber = data.pageable.pageNumber * 10;
            const content = data.content;
            let user: { content: any; reRender: boolean } = { content: [], reRender: true };
            const ct = {
              fullName: null,
              phoneNumber: null,
              registerDate: null,
              email: null,
              jobCount: null,
              truckCount: null,
            };
            if (pageNumber == 0) {
              //? in th first time, we get user
              user.content = [...content, ...Array(data.totalElements - content.length).fill(ct)];
            } else {
              user.content = Array(data.totalElements).fill(ct);
              const pageSize = data.numberOfElements;
              for (let i = pageNumber, j = 0; i < pageNumber + pageSize; i++, j++) {
                user.content[i] = content[j];
              }
              user.reRender = !!!self.data_user?.reRender;
            }
            self.data_user = user;
          } else {
            self.loading = false;
            self.data_user = null;
            self.error_response = {
              title: response.problem,
              content: 'GET users : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getUsers :> ', error);
          self.loading = false;
          self.data_user = null;
          self.error_response = {
            title: '',
            content: 'Failed to get all user-management',
          };
        }
      }),
    };
  });
