import { types, flow, cast } from 'mobx-state-tree';
import BookingCallApi, {
  IBookingProps
} from '../services/booking';

const PaginationModel = types.model({
  size: types.maybeNull(types.number),
  totalElements: types.maybeNull(types.number),
  totalPages: types.maybeNull(types.number),
  currentPage: types.maybeNull(types.number),
});

const OwnerType = types.model({
  id: types.maybeNull(types.number),
  email: types.maybeNull(types.string),
  avatar: types.maybeNull(types.model({
    object: types.maybeNull(types.string),
  })),
  fullName: types.maybeNull(types.string),
  mobileNo: types.maybeNull(types.string),
  userId: types.maybeNull(types.string)
})

const BookingJobType = types.model({
  id: types.maybeNull(types.string),
  jobId: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  accepterProfile: types.maybeNull(OwnerType),
  requesterProfile: types.maybeNull(OwnerType),
  status: types.maybeNull(types.string),
  requestStatus: types.maybeNull(types.string),
  requesterUserId: types.maybeNull(types.string),
  accepterUserId: types.maybeNull(types.string),
});

const JobHistoryCallPaginationType = types.model({
  content: types.maybeNull(types.array(BookingJobType)),
  reRender: types.boolean,
  lengthPerPage: types.maybeNull(types.number),
});

export const BookingStore = types
  .model('BookingStore', {
    list: types.maybeNull(types.array(types.maybeNull(BookingJobType))),
    bookingData: types.maybeNull(JobHistoryCallPaginationType),
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
      getBooking: flow(function* getBooking(params: IBookingProps) {
        self.loading = true;
        try {
          const response = yield BookingCallApi.getJobCallHistory(params);
          console.log('get Transportation list response :> ', response);
          if (response && response.ok) {
            const { data, size, totalElements, totalPages } = response.data;
            const currentPage = params?.page || 1;
            const bookingData: any = {
              content: [],
              reRender: true,
              lengthPerPage: size,
            };
            if (!self.isFirstLoad) bookingData.reRender = !!!self.bookingData?.reRender;

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
              bookingData.content = [
                ...Array(emptyContentsBeforeFirstItem).fill(emptyContent),
                ...data,
                ...Array(emptyContentsAfterLastItem).fill(emptyContent),
              ];
            }
            self.bookingData = bookingData

            if (totalElements && totalPages) {
              const tmpPagination: Pagination = JSON.parse(JSON.stringify(self.pagination));
              tmpPagination.totalElements = totalElements;
              tmpPagination.totalPages = totalPages;
              tmpPagination.size = size;
              self.pagination = tmpPagination;
            }
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
