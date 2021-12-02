import { types, flow } from 'mobx-state-tree';
import { JobApi } from '../services';
import { IDestination, IJob, IJobRequest, JobListParams, JobsListResponse, PostJobParams } from '../services/job-api';
import moment from 'moment';
import { convertDateTHtoGlobal } from '../utils';

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

const JobType = types.model({
  id: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  from: types.maybeNull(DestinationType),
  to: types.maybeNull(types.array(DestinationType)),
  owner: types.maybeNull(OwnerType),
  status: types.maybeNull(types.string),
  quotations: types.maybeNull(types.array(types.string)),
  price: types.maybeNull(types.number),
  priceType: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  requiredTruckAmount: types.maybeNull(types.number),
  createdAt: types.maybeNull(types.string),
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
  owner: types.maybeNull(OwnerType),
  price: types.maybeNull(types.number),
  status: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  weight: types.maybeNull(types.number),
  truckId: types.maybeNull(types.string),
  bookingId: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  priceType: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  updatedAt: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  stallHeight: types.maybeNull(types.string),
  workingZones: types.maybeNull(
    types.array(
      types.model({
        region: types.maybeNull(types.number),
        province: types.maybeNull(types.number),
      }),
    ),
  ),
  approveStatus: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.string)),
});

const JobDetailType = types.model({
  id: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  from: types.maybeNull(DestinationType),
  to: types.maybeNull(types.array(DestinationType)),
  owner: types.maybeNull(OwnerType),
  status: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  priceType: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  requiredTruckAmount: types.maybeNull(types.number),
  createdAt: types.maybeNull(types.string),
  publicAsCgl: types.maybeNull(types.boolean),
  quotations: types.maybeNull(types.array(QuotationType)),
  trips: types.maybeNull(types.array(TripType)),
});

const JobManagement = types.model({
  content: types.maybeNull(types.array(JobType)),
  reRender: types.boolean,
  lengthPerPage: types.maybeNull(types.number),
});

const JobListManagement = types.model({
  content: types.maybeNull(types.array(JobType)),
  totalPages: types.maybeNull(types.number),
});

export interface IJobsManagement {
  content: (IJob | IJobNull)[];
  reRender: boolean;
  lengthPerPage: number | null;
}

export interface IJobListManagement {
  content: (IJob | IJobNull)[];
  totalPages: number | null;
}

export const JobStore = types
  .model('JobStore', {
    loading: false,
    data_jobs: types.maybeNull(JobManagement),
    jobList: types.maybeNull(JobListManagement),
    data_count: types.maybeNull(types.number),
    isFirstLoad: true,
    currentJob: types.maybeNull(JobDetailType),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
    tmpNotificationJobId: types.maybeNull(types.string),
    notificationLoading: types.boolean,
    notificationData: types.boolean,
    errorNotification: types.maybeNull(types.string),

    tmpLineboardcastJobId: types.maybeNull(types.string),
    boardcastLoading: types.boolean,
    boardcastData: types.boolean,
    errorBoardcast: types.maybeNull(types.string)
  })
  .actions((self) => {
    return {
      getJobsList: flow(function* getJobsList(params: JobListParams) {
        self.loading = true;
        self.data_jobs = null;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield JobApi.getJobsList(params);
          console.log('getJobs response :> ', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages }: JobsListResponse = response.data;
            self.loading = false;
            self.data_count = totalElements;
            const currentPage = params?.page || 1;
            const jobs: IJobsManagement = {
              content: [],
              reRender: true,
              lengthPerPage: size,
            };
            if (!self.isFirstLoad) jobs.reRender = !!!self.data_jobs?.reRender;
            if (data.length) {
              const emptyContent: any = Object.keys(data[0]).reduce(
                (object: any, curr: string) => ({
                  ...object,
                  [curr]: null,
                }),
                {},
              );
              if (self.isFirstLoad) self.isFirstLoad = false;
              const pagesBeforeContent = currentPage - 1;
              const emptyContentsBeforeFirstItem = pagesBeforeContent * size;
              const pagesAfterContent = totalPages - currentPage;
              const emptyContentsAfterLastItem = pagesAfterContent * size;
              jobs.content = [
                ...Array(emptyContentsBeforeFirstItem).fill(emptyContent),
                ...data,
                ...Array(emptyContentsAfterLastItem).fill(emptyContent),
              ];
            } else jobs.content = [];
            self.data_jobs = jobs;
          } else {
            self.loading = false;
            self.data_jobs = null;
            self.error_response = {
              title: response.problem,
              content: 'GET jobs : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getJobs :>', error);
          self.loading = false;
          self.data_jobs = null;
          self.error_response = {
            title: '',
            content: 'Failed to get all jobs list',
          };
        }
      }),
      getJobById: flow(function* getJobById(params: IJobRequest) {
        try {
          self.loading = true;
          self.currentJob = null;

          const response = yield JobApi.getJobById(params);
          self.loading = false;

          if (response.ok) {
            console.log('response.data :>> ', response.data);
            const data = response.data;
            if (data?.from?.dateTime) {
              data.from.dateTime = convertDateTHtoGlobal(data.from.dateTime);
            }
            if (data?.to?.length) {
              data.to = data.to.map((attr: any) => ({
                ...attr,
                dateTime: attr.dateTime ? convertDateTHtoGlobal(attr.dateTime) : null
              }));
            }
            self.currentJob = data;
          } else {
            self.error_response = {
              title: '',
              content: 'Failed to get job ' + params.jobId,
            };
          }
        } catch (err) { }
      }),

      getJobsListWithoutEmptyContent: flow(function* getJobsList(params: JobListParams) {
        self.loading = true;
        self.jobList = null;
        self.data_count = null;
        self.error_response = null;
        try {
          const response = yield JobApi.getJobsList(params);
          console.log('getJobs response :> ', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages }: JobsListResponse = response.data;
            self.loading = false;
            self.data_count = totalElements;
            const jobs: IJobListManagement = {
              content: [],
              totalPages: totalPages,
            };
            if (data.length) {
              jobs.content = data;
            } else {
              jobs.content = [];
            }
            self.jobList = jobs;
          } else {
            self.loading = false;
            self.jobList = null;
            self.error_response = {
              title: response.problem,
              content: 'GET jobs : ' + response.originalError.message,
            };
          }
        } catch (error) {
          console.error('Failed to getJobs :>', error);
          self.loading = false;
          self.jobList = null;
          self.error_response = {
            title: '',
            content: 'Failed to get all jobs list',
          };
        }
      }),

      clearJobs: function () {
        self.jobList = null;
      },

      sendNotification: flow(function* sendNotification(params: string) {
        try {
          self.notificationLoading = true;
          self.tmpNotificationJobId = params
          const response = yield JobApi.sendNotification(params);
          console.log("Response send Notification :: ", response)
          self.notificationLoading = false;
          if (response.ok) {
            self.notificationData = response.data;
          } else {
            self.errorNotification = 'Failed to notification job ' + params
          }
        } catch (err) {
          self.notificationLoading = false;
          self.notificationData = false;
        }
      }),

      sendLineBoardcast: flow(function* sendLineBoardcast(params: string) {
        try {
          self.boardcastLoading = true;
          self.tmpLineboardcastJobId = params
          const response = yield JobApi.sendLineBoardcast(params);
          console.log("Response send Job store :: ", response)
          self.boardcastLoading = false;
          if (response.ok) {
            self.boardcastData = response.data;
          } else {
            self.errorBoardcast = 'Failed to notification job ' + params
          }
        } catch (err) {
          self.boardcastLoading = false;
          self.boardcastData = false;
        }
      }),

      updateJob: flow(function* updateJob(id: string, data: PostJobParams) {
        try {
          self.loading = true;
          self.currentJob = { ...self.currentJob, ...data };
          const response = yield JobApi.updateJobById(id, data);
          console.log("Response send Job store :: ", response)
          self.notificationLoading = false;
          if (response.ok) {
            console.log('response.data :>> ', response.data);
          } else {
            self.error_response = {
              title: response.problem,
              content: 'Update jobs : ' + response.originalError.message,
            };
          }
          self.loading = false
        } catch (err) {
          self.loading = false;
          self.error_response = {
            title: '',
            content: 'Failed to update job',
          };
        }
      }),

      clearJobDetail: function () {
        self.currentJob = null;
      },

      setJobDetail: function (data: PostJobParams) {
        self.currentJob = { ...self.currentJob, ...data };
      },
    };
  });

export interface IJobNull {
  [x: string]: null;
}
