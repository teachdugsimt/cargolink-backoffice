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
import { HistoryCallStore } from '../../stores/history-call-store'
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
const CallHistoryContainer: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [rowData, setRowData] = useState<(RowType)[]>([]);
  const [rowLength, setRowLength] = useState(10);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [page, setPage] = useState(1);
  const [isDesc, setIsDesc] = useState(true);
  const [searchValue, setSearchValue] = useState({});
  const [sortable, setSortable] = useState(sortabled);
  const [jobId, setJobId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem text={t('callHistoryManagement')} key="call-history-management" />
    </Breadcrumbs>
  );

  const setInitialSortingAndPage = () => {
    const options = { page: 1, descending: true };
    setSearchValue(options);
    HistoryCallStore.getJobHistoryList(options);
  };

  useEffect(() => {
    setInitialSortingAndPage();
  }, []);

  useEffect(() => {
    if (HistoryCallStore.error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: HistoryCallStore.error_response.title || '',
        content: HistoryCallStore.error_response.content || '',
      });
    } else {
      setAlertSetting(defaultAlertSetting);
    }
  }, [HistoryCallStore.error_response]);

  useEffect(() => {
    const jobHistory = JSON.parse(JSON.stringify(HistoryCallStore.jobHistories));
    if (jobHistory?.content?.length) {
      const translateTel = (data: any) => {
        if (!data || !data.length) return data;
        return data.map((d: any) => {
          let { requesterPhoneNumber } = d;
          if (requesterPhoneNumber && requesterPhoneNumber.startsWith('+66')) requesterPhoneNumber = `0${requesterPhoneNumber.substr(3)}`;
          return {
            ...d,
            requesterPhoneNumber,
          };
        });
      };
      const content = translateTel(jobHistory.content);
      const rows = createRow(content, loginStore.language, t, onOpenModal);
      setRowData(rows);
      const rowLen = HistoryCallStore?.pagination?.size;
      rowLen && setRowLength(rowLen);
    }
  }, [JSON.stringify(HistoryCallStore.jobHistories)]);

  useEffect(() => {
    if (jobId) {
      openModal();
    }
  }, [jobId])

  const onSearch = (value: string) => {
    console.log('value :>> ', value);
    if (value) {
      let search = {
        page: 1,
        textSearch: value,
        descending: true,
      };
      setPage(1);
      setSearchValue(search);
      HistoryCallStore.getJobHistoryList(search);
    } else {
      setPage(1);
      setInitialSortingAndPage();
    }
  };

  const onHandlePage = (pagination: number) => {
    setPage(pagination);
    const searchParams = { ...searchValue, page: pagination };
    setSearchValue(searchParams);
    HistoryCallStore.getJobHistoryList(searchParams);
  }

  const onOpenModal = (jobId: string) => {
    setJobId(jobId);
  };

  const onCloseModal = () => {
    setJobId('');
    closeModal();
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <PageHeader breadcrumbs={breadcrumbs}>{t('callHistoryManagement')}</PageHeader>
      </div>
      {alertSetting.show && <Alert setting={alertSetting} />}

      <SearchForm onSearch={(value: any) => onSearch(value)} />

      <span>{`${t('resultsFound')}: ${HistoryCallStore.pagination?.totalElements || 0}`}</span>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={onCloseModal} width={'x-large'}>
            {/* <ModalHeader>
              <ModalTitle>{'จุดขึ้นลงสินค้า'}</ModalTitle>
            </ModalHeader> */}
            <ModalBody>
              <JobDetailScreen jobId={jobId} />
            </ModalBody>
            <ModalFooter>
              {``}
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>

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
          isLoading={HistoryCallStore.loading}
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
export default CallHistoryContainer;
