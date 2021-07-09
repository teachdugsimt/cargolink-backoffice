import { types, flow } from 'mobx-state-tree';
import { JobApi } from '../services';
import { IDestination, IJob, JobListParams, JobsListResponse } from '../services/job-api';

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
});

const JobManagement = types.model({
  content: types.maybeNull(types.array(JobType)),
  reRender: types.boolean,
  lengthPerPage: types.maybeNull(types.number),
});

export interface IJobsManagement {
  content: (IJob | IJobNull)[];
  reRender: boolean;
  lengthPerPage: number | null;
}

export const JobStore = types
  .model('JobStore', {
    loading: false,
    data_jobs: types.maybeNull(JobManagement),
    data_count: types.maybeNull(types.number),
    isFirstLoad: true,
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
      }),
    ),
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
              const dataaa = [data[0]];
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
                ...dataaa,
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
    };
  });

export interface IJobNull {
  [x: string]: null;
}
