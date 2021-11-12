import { types, flow, cast } from 'mobx-state-tree';
import HistoryCallApi, {
  IJobCallHistoryProps
} from '../services/history-call';

const PaginationModel = types.model({
  size: types.maybeNull(types.number),
  totalElements: types.maybeNull(types.number),
  totalPages: types.maybeNull(types.number),
  currentPage: types.maybeNull(types.number),
});

const JobHistoryCallType = types.model({
  id: types.maybeNull(types.string),
  jobId: types.maybeNull(types.string),
  requesterName: types.maybeNull(types.string),
  requesterPhoneNumber: types.maybeNull(types.string),
  callTime: types.maybeNull(types.string),
  productName: types.maybeNull(types.string),
  channel: types.maybeNull(types.string),
});

const JobHistoryCallPaginationType = types.model({
  content: types.maybeNull(types.array(JobHistoryCallType)),
  reRender: types.boolean,
  lengthPerPage: types.maybeNull(types.number),
});

export const HistoryCallStore = types
  .model('HistoryCallStore', {
    list: types.maybeNull(types.array(types.maybeNull(JobHistoryCallType))),
    jobHistories: types.maybeNull(JobHistoryCallPaginationType),
    loading: types.boolean,
    error: types.maybeNull(types.string),
    pagination: PaginationModel,
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
      getJobHistoryList: flow(function* getJobHistoryList(params: IJobCallHistoryProps) {
        self.loading = true;
        try {
          const response = yield HistoryCallApi.getJobCallHistory(params);
          console.log('get Transportation list response :> ', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages } = response.data;
            const currentPage = params?.page || 1;
            const jobHistories: any = {
              content: [],
              reRender: true,
              lengthPerPage: size,
            };
            if (!self.isFirstLoad) jobHistories.reRender = !!!self.jobHistories?.reRender;

            if (data.length) {
              const emptyContent: any = Object.keys(data[0]).reduce(
                (object: any, curr: string) => ({
                  ...object,
                  [curr]: null,
                }),
                {},
              );
              const pagesBeforeContent = currentPage - 1;
              const emptyContentsBeforeFirstItem = pagesBeforeContent * size;
              const pagesAfterContent = totalPages - currentPage;
              const emptyContentsAfterLastItem = pagesAfterContent * size;
              jobHistories.content = [
                ...Array(emptyContentsBeforeFirstItem).fill(emptyContent),
                ...data,
                ...Array(emptyContentsAfterLastItem).fill(emptyContent),
              ];
            }
            self.jobHistories = jobHistories

            if (totalElements && totalPages) {
              const tmpPagination: Pagination = JSON.parse(JSON.stringify(self.pagination));
              tmpPagination.totalElements = totalElements;
              tmpPagination.totalPages = totalPages;
              tmpPagination.size = size;
              self.pagination = tmpPagination;
            }

            // self.list = data;
          } else {
            const errorMsg: string = response?.data?.message || 'something wrong';
            self.error = errorMsg;
            self.list = cast([]);
          }
          self.loading = false;
        } catch (error) {
          console.error('Failed to get Transportation list :>', error);
          self.loading = false;
          self.list = cast([]);
          self.error = JSON.stringify(error);
        }
      }),
      setPagination(params: Pagination) {
        self.pagination = params;
      },
    };
  })
  .create({
    list: [],
    loading: false,
    error: '',
    pagination: {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
    },
  });

export interface Pagination {
  size: number;
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
