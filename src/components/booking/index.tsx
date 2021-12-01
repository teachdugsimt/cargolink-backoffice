import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, createRow, sortabled } from './dynamic-table/sample-data';
import { useMst } from '../../stores/root-store';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { defaultAlertSetting } from '../simple-data';
import Alert from '../alert';
import moment from 'moment';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import SearchForm from '../search-form';
import { BookingStore } from '../../stores/booking-store'
import { RowType } from '@atlaskit/dynamic-table/dist/types/types';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import JobDetailScreen from '../../pages/jobs/[jobId]'

interface Props { }

const MAIN_COLOR: string = '#c4c4c4';
const BookingContainer: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { loginStore, productTypesStore } = useMst();
  const [rowData, setRowData] = useState<(RowType)[]>([]);
  const [rowLength, setRowLength] = useState(10);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState({});
  const [sortable, setSortable] = useState(sortabled);
  const [jobId, setJobId] = useState<string>();

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem text={t('callHistoryManagement')} key="call-history-management" />
    </Breadcrumbs>
  );

  const setInitialSortingAndPage = () => {
    const options = { page: 1, descending: true, requesterType: 'TRUCK_OWNER' };
    setSearchValue(options);
    BookingStore.getBooking(options);
  };

  useEffect(() => {
    setInitialSortingAndPage();
  }, []);

  useEffect(() => {
    if (BookingStore.error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: BookingStore.error_response.title || '',
        content: BookingStore.error_response.content || '',
      });
    } else {
      setAlertSetting(defaultAlertSetting);
    }
  }, [BookingStore.error_response]);

  useEffect(() => {
    const booking = JSON.parse(JSON.stringify(BookingStore.bookingData));
    if (booking?.content?.length) {
      const content = booking.content.map((data: any) => ({
        ...data,
        productType: productTypesStore.productTypeNameById(data?.productTypeId)?.name
      }))
      const rows = createRow(content, loginStore.language, t);
      setRowData(rows);
      const rowLen = BookingStore?.pagination?.size;
      rowLen && setRowLength(rowLen);
    }
  }, [JSON.stringify(BookingStore.bookingData)]);

  const onSearch = (value: string) => {
    console.log('value :>> ', value);
    if (value) {
      let search = {
        page: 1,
        searchText: value,
        requesterType: 'TRUCK_OWNER',
        descending: true,
      };
      setPage(1);
      setSearchValue(search);
      BookingStore.getBooking(search);
    } else {
      setPage(1);
      setInitialSortingAndPage();
    }
  };

  const onHandlePage = (pagination: number) => {
    setPage(pagination);
    const searchParams = { ...searchValue, page: pagination };
    setSearchValue(searchParams);
    BookingStore.getBooking(searchParams);
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <PageHeader breadcrumbs={breadcrumbs}>{t('callHistoryManagement')}</PageHeader>
      </div>
      {alertSetting.show && <Alert setting={alertSetting} />}

      <SearchForm onSearch={(value: any) => onSearch(value)} />

      <span>{`${t('resultsFound')}: ${BookingStore.pagination?.totalElements || 0}`}</span>

      <div className="history-call-dynamic-tbl">
        <DynamicTable
          head={head}
          rows={rowData}
          page={page}
          emptyView={<p>{t('noData')}</p>}
          testId="job-history-call"
          // sortKey={sortable.sortKey}
          // sortOrder={sortable.sortOrder === 'DESC' ? 'DESC' : 'ASC'}
          rowsPerPage={rowLength}
          defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={BookingStore.loading}
          defaultSortOrder="DESC"
          onSort={(sort) => {
            const descending = !sortable[sort.key];
            const search = { ...searchValue, descending, sortBy: sort.key };
            setSortable({ ...sortable, [sort.key]: descending });
            setSearchValue(search);
            // userStore.getUsers(search);
          }}
          onSetPage={onHandlePage}
        />
      </div>
    </div>
  );
});
export default BookingContainer;
