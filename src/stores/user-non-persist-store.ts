import { types, flow } from 'mobx-state-tree';
import uploadApi, { UserUploadPayload } from '../services/upload-api';
import userApi, { GetUsersListParams, GetUsersListResponse, ChangeDocStatusPayload } from '../services/user-api';
import { UploadFilePath } from '../services/upload-api';
import truckApi from '../services/truck-api';

const Profile = types.model({
  attachCodeCitizenId: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  avatar: types.maybeNull(types.string),
  id: types.maybeNull(types.number),
  userId: types.maybeNull(types.string),
  userType: types.maybeNull(types.string),
  document: types.maybeNull(types.map(types.string)),
  documentStatus: types.maybeNull(types.string),

  confirmationToken: types.maybeNull(types.string),
  enabled: types.maybeNull(types.boolean),
  deviceToken: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  createdBy: types.maybeNull(types.string),
  updatedBy: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  legalType: types.maybeNull(types.string),
  files: types.maybeNull(types.array(types.string)),
  roleName: types.maybeNull(types.array(types.string)),
});
const ProfileFully = types.model({
  attachCodeCitizenId: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  avatar: types.maybeNull(types.string),
  id: types.maybeNull(types.number),
  userId: types.maybeNull(types.string),
  userType: types.maybeNull(types.string),
  document: types.maybeNull(types.map(types.string)),
  documentStatus: types.maybeNull(types.string),

  confirmationToken: types.maybeNull(types.string),
  enabled: types.maybeNull(types.boolean),
  deviceToken: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  createdBy: types.maybeNull(types.string),
  updatedBy: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  legalType: types.maybeNull(types.string),
  files: types.maybeNull(
    types.array(
      types.model({
        fileName: types.maybeNull(types.string),
        url: types.maybeNull(types.string),
        type: types.maybeNull(types.string),
        attachCode: types.maybeNull(types.string),
      }),
    ),
  ),
  roleName: types.maybeNull(types.array(types.string)),
});

const userTypeModel = types.model({
  id: types.maybeNull(types.string),
  avatar: types.maybeNull(types.string),
  enabled: types.maybeNull(types.boolean),
  fullName: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  userType: types.maybeNull(types.string),
  userId: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  createdBy: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  updatedBy: types.maybeNull(types.string),
  confirmationToken: types.maybeNull(types.string),
  deviceToken: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  documentStatus: types.maybeNull(types.string),
  document: types.maybeNull(types.map(types.string)),
  legalType: types.maybeNull(types.string),
  attachCodeCitizenId: types.maybeNull(types.string),
});

const userManagement = types.model({
  content: types.maybeNull(types.array(types.maybeNull(userTypeModel))),
  reRender: types.boolean,
  lengthPerPage: types.maybeNull(types.number),
});

const UPLOAD_MODEL = types.maybeNull(
  types.model({
    attachCode: types.maybeNull(types.string),
    token: types.maybeNull(types.string),
    fileName: types.maybeNull(types.string),
    type: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    fileUrl: types.maybeNull(types.string),
    fileType: types.maybeNull(types.string),
    uploadedDate: types.maybeNull(types.string),
  }),
);

const ModelAttachObject = types.model({
  attach_code: types.maybeNull(types.string),
  expire: types.maybeNull(types.number),
  file_name: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  type: types.maybeNull(types.string),
  url: types.maybeNull(types.string),
});

export const UserNonPersistStore = types
  .model('UserStore', {
    loading: false,
    success_response: false,
    response_message: types.maybeNull(types.string),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
    data_user: types.maybeNull(userManagement),
    data_count: types.maybeNull(types.number),
    isFirstLoad: true,

    data_upload: UPLOAD_MODEL,
    user_link_document: types.maybeNull(types.array(ModelAttachObject)),

    data_get_user_id: types.maybeNull(Profile),

    data_delete_user_doc: types.maybeNull(types.boolean),

    data_patch_user: types.maybeNull(Profile),

    data_get_user_id_fully: types.maybeNull(ProfileFully),

    error_patch_user: types.maybeNull(types.string),
  })
  .actions((self) => {
    return {
      getUsers: flow(function* getUsers(params: GetUsersListParams) {
        self.loading = true;
        self.data_user = null;
        self.error_response = null;
        try {
          // if (!params.rowsPerPage) params.rowsPerPage = 15;
          const response = yield userApi.getUsersList(params);
          console.log('getUsers response :> ', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages }: GetUsersListResponse = response.data;
            self.loading = false;
            self.data_count = totalElements;
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
      submitUploadFile: flow(function* submitUploadFile(userId: string, payload: UserUploadPayload) {
        self.loading = true;

        try {
          const response = yield uploadApi.uploadByUser(userId, payload);
          console.log('Upload Response', response);
          if (response.ok) {
            self.success_response = true;
            self.response_message = response.data.message;
          } else {
            self.success_response = false;
            self.error_response = response.data;
          }
          self.loading = false;
        } catch (error) {
          console.error(error);
          self.loading = false;
          self.data_user = null;
          self.error_response = {
            title: '',
            content: '',
          };
        }
      }),

      uploadImage: flow(function* uploadImage(path: UploadFilePath, file: File, userId: string) {
        self.loading = true;
        self.error_response = null;

        try {
          const response = yield uploadApi.upload(path, file);
          console.log('Upload file response :> ', response);
          if (response && response.ok) {
            const { data } = response;
            yield userApi.editUser(userId, { url: [data.attachCode] });
            yield UserNonPersistStore.getFullyUserProfile(userId);
            self.loading = false;
            self.data_upload = data;
            self.error_response = null;
          } else {
            self.loading = false;
            self.error_response = {
              title: response.problem,
              content: 'POST image : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to request upload images store :> ', error);
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to request upload images store',
          };
        }
      }),
      getLinkDownLoadDoc: flow(function* getLinkDownLoadDoc(params: string[]) {
        try {
          self.loading = true;

          const response = yield truckApi.getLinkDownLoad(params);
          console.log(response);
          self.loading = false;
          if (response.ok) {
            console.log('Get User list document array : ', response);
            self.user_link_document = response.data.data;
          } else {
          }
        } catch (error) {
          self.loading = false;
          return error;
        }
      }),
      getUserById: flow(function* getUserById(params: string) {
        try {
          self.loading = true;
          const response = yield userApi.getUser(params);
          self.loading = false;
          if (response.ok) {
            console.log('Raw get user by id : ', response);
            self.data_get_user_id = response.data;
          } else {
          }
        } catch (error) {
          self.loading = false;
          return error;
        }
      }),
      deleteUserDocumnet: flow(function* deleteUserDocumnet(userId: string, attachCode: string) {
        try {
          self.loading = true;
          const response = yield userApi.deleteUserDoc(userId, attachCode);
          self.loading = false;
          if (response.ok) {
            yield UserNonPersistStore.getFullyUserProfile(userId);
            console.log('Delete document by id : ', response);
            self.data_delete_user_doc = response.data?.message;
          } else {
          }
        } catch (error) {
          self.loading = false;
          return error;
        }
      }),

      patchUser: flow(function* deleteUserDocumnet(userId: string, params: object) {
        try {
          self.loading = true;
          const response = yield userApi.editUser(userId, params);
          console.log('Patch User by id : ', response);
          self.loading = false;
          if (response.ok) {
            yield UserNonPersistStore.getFullyUserProfile(userId);
            self.data_patch_user = response.data;
          } else {
            const error = response?.data?.message || 'something went wrong';
            self.error_patch_user = error;
          }
        } catch (error) {
          self.loading = false;
          return error;
        }
      }),
      clearErrorPatchUser() {
        self.error_patch_user = null;
      },
      updateUserDocument: flow(function* updateUserDocument(userId: string, params: ChangeDocStatusPayload) {
        try {
          self.loading = true;
          const response = yield userApi.changeDocStatus(userId, params);
          console.log('Update doc status : ', response);
          self.loading = false;
          if (response.ok) {
            yield UserNonPersistStore.getFullyUserProfile(userId);
            // self.data_patch_user = response.data;
          } else {
          }
        } catch (error) {
          self.loading = false;
          return error;
        }
      }),

      getFullyUserProfile: flow(function* getFullyUserProfile(userId: string) {
        try {
          self.loading = true;
          const response: any = yield userApi.getUser(userId);
          self.loading = false;
          if (response.ok) {
            console.log('Get User by id : ', response);

            if (response.data.files && response.data.files.length > 0) {
              const responseLink = yield truckApi.getLinkDownLoad(response.data.files);
              if (responseLink.ok) {
                let tmpLinkResponse = responseLink.data.data || [];
                let tmpFileList = tmpLinkResponse.map((e: any) => {
                  return {
                    fileName: e.file_name,
                    url: e.url,
                    type: e.file_name.split('.')[1] || '',
                    attachCode: e.attach_code,
                  };
                });
                let tmpProfile = response.data;
                tmpProfile.files = tmpFileList;
                console.log('TMP FULLY PROFILE :: ', tmpProfile);
                self.data_get_user_id_fully = tmpProfile;
              }
            } else self.data_get_user_id_fully = response.data;
          } else {
          }
        } catch (error) {
          self.loading = false;
          return error;
        }
      }),
      clear() {
        self.data_upload = null;
        self.user_link_document = null;
        self.data_delete_user_doc = null;
      },
      clearUploadLinkDocument() {
        self.user_link_document = null;
      },
    };
  })
  .create({
    loading: false,
    success_response: false,
    response_message: null,
    error_response: null,
    data_user: null,
    data_count: null,
    isFirstLoad: true,
    data_upload: null,
    user_link_document: null,
    data_get_user_id: null,
    data_delete_user_doc: null,
    data_get_user_id_fully: null,
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
  userType: string;
  userId: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  confirmationToken: string;
  deviceToken: string | null;
  document: object | null;
  attachCodeCitizenId: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  documentStatus: DocumentStatus;
  legalType: 'INDIVIDUAL' | 'JURISTIC';
  files: any[];
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
  document: null;
  attachCodeCitizenId: null;
  documentStatus: null;
  legalType: null;
  files: null;
  error_patch_user: null;
}
