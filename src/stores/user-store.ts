import { types, flow } from 'mobx-state-tree';
import userApi, { GetUsersListParams, GetUsersListResponse } from '../services/user-api';

const userType = types.model({
  id: types.maybeNull(types.string),
  avatar: types.maybeNull(types.string),
  enabled: types.maybeNull(types.boolean),
  fullName: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  userType: types.maybeNull(types.number),
  userId: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  createdBy: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  updatedBy: types.maybeNull(types.string),
  confirmationToken: types.maybeNull(types.string),
  deviceToken: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  documentStatus: types.maybeNull(types.string),
  legalType: types.maybeNull(types.string),
});

const userManagement = types.model({
  content: types.maybeNull(types.array(userType)),
  reRender: types.boolean,
  lengthPerPage: types.maybeNull(types.number),
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
    isFirstLoad: true,
  })
  .actions((self) => {
    return {
      getUsers: flow(function* getUsers(params: GetUsersListParams) {
        self.loading = true;
        self.data_user = null;
        self.error_response = null;
        try {
          const response = yield userApi.getUsersList(params);
          console.log('getUsers response :> ', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages }: GetUsersListResponse = response.data;
            self.loading = false;
            const currentPage = params?.page || 1;
            const content = data;
            const user: IUserManagementProps = {
              content: [],
              reRender: true,
              lengthPerPage: size,
            };
            const emptyContent = Object.keys(content).reduce(
              (object: any, curr: string) => ({
                ...object,
                [curr]: null,
              }),
              {},
            );

            if (!self.isFirstLoad) user.reRender = !!!self.data_user?.reRender;
            if (content.length) {
              if (self.isFirstLoad) {
                self.isFirstLoad = false;
                user.content = [...content, ...Array(totalElements - content.length).fill(emptyContent)];
              } else {
                const pageBeforeCurrent = currentPage - 1;
                const emptyContentBeforeFirstItem = pageBeforeCurrent * size;
                const pagesAfterCurrent = totalPages - currentPage;
                const emptyContentAfterLastItem = pagesAfterCurrent * size;
                user.content = [
                  ...Array(emptyContentBeforeFirstItem).fill(emptyContent),
                  ...content,
                  ...Array(emptyContentAfterLastItem).fill(emptyContent),
                ];
              }
            } else user.content = [];
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

interface IUserManagementProps {
  content: (IUserDTO | IUserNull)[];
  reRender: boolean;
  lengthPerPage: number | null;
}

//? User schema from API calls.
export interface IUserDTO {
  id: string;
  avatar: string | null;
  enabled: boolean;
  fullName: string | null;
  phoneNumber: string | null;
  email: string;
  userType: number;
  userId: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  confirmationToken: string;
  deviceToken: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  documentStatus: DocumentStatus;
  legalType: 'INDIVIDUAL' | 'JURISTIC';
  files?: string[];
}

export enum DocumentStatus {
  NO_DOCUMENT = 'NO_DOCUMENT',
  WAIT_FOR_VERIFIED = 'WAIT_FOR_VERIFIED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface IUserNull {
  id: null;
  avatar: null;
  enabled: null;
  fullName: null;
  phoneNumber: null;
  email: null;
  userType: null;
  userId: null;
  createdAt: null;
  createdBy: null;
  updatedAt: null;
  updatedBy: null;
  confirmationToken: null;
  deviceToken: null;
  status: null;
  documentStatus: null;
  legalType: null;
  files: null;
}
