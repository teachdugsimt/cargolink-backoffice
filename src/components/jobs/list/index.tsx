import React, { useState, useEffect, CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import { sortable as Sortable, tableHeaders, createTableRows } from './table.mapper';
import Swal from 'sweetalert2';
import { IJobsManagement } from '../../../stores/job-store';
import { JobListParams } from '../../../services/job-api';
import SearchForm from '../../search-form';
import { navigate } from 'gatsby';
import DynamicTable from '@atlaskit/dynamic-table';
import JobStatusFilter, { JobStatus } from './status.filter';
import AddJobButton from '../../buttons/add';

import { CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';

const INITIAL_API_PARAMS = {
  page: 1,
  descending: true,
};

const JobContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { jobStore, loginStore } = useMst();
  const [rows, setRows] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [submit, setSubmit] = useState(false);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState<JobListParams>(INITIAL_API_PARAMS);
  const [sortable, setSortable] = useState(Sortable);

  const onDetail = (id: string) => {
    //TODO implement details navigate here
  };

  const onStatusButtonClick = (jobStatus: JobStatus | null) => {
    if (jobStatus == null) return;
    const params = jobStatus == 0 ? INITIAL_API_PARAMS : { ...INITIAL_API_PARAMS, status: jobStatus };
    setSearchValue(params);
    jobStore.getJobsList(params);
  };

  const onSearch = (value: string) => {
    let searchParams: JobListParams = INITIAL_API_PARAMS;
    if (value) {
      const productIds: number[] = productTypes
        ? productTypes.reduce((result, type) => {
            const thereIs = type.name.includes(value.trim());
            thereIs ? [...result, type.id] : result;
          }, [])
        : [];
      searchParams = {
        ...searchParams,
        productName: value,
        owner: value,
        productType: productIds,
        from: value,
        to: value,
      };
      if (!isNaN(+value)) {
        searchParams = {
          ...searchParams,
          weight: +value,
        };
      }
    }
    setPage(searchParams.page);
    setSearchValue(searchParams);
    jobStore.getJobsList(searchParams);
  };

  const onSort = (sort: any) => {
    const descending = !sortable[sort.key];
    const searchParams: JobListParams = { ...searchValue, descending, sortBy: sort.key };
    setSortable({ ...sortable, [sort.key]: descending });
    setSearchValue(searchParams);
    jobStore.getJobsList(searchParams);
  };

  const onPageChange = (destinationPage: number) => {
    setPage(destinationPage);
    const searchParams = { ...searchValue, page: destinationPage };
    setSearchValue(searchParams);
    jobStore.getJobsList(searchParams);
  };

  useEffect(() => {
    jobStore.getJobsList(INITIAL_API_PARAMS);
    setSearchValue(INITIAL_API_PARAMS);
  }, []);

  useEffect(() => {
    if (jobStore.error_response) {
      const { title, content } = jobStore.error_response;
      Swal.fire({
        icon: 'error',
        title: title || '',
        text: content || '',
      });
    }
  }, [jobStore.error_response]);

  useEffect(() => {
    const jobsData: IJobsManagement | null = JSON.parse(JSON.stringify(jobStore.data_jobs));
    if (jobsData?.content) {
      const rows = createTableRows(jobsData.content, productTypes, loginStore.language, t, onDetail);
      setRows(rows);
    }
  }, [jobStore.data_jobs, jobStore.data_jobs?.reRender, jobStore.data_jobs?.content?.length, productTypes]);

  return (
    <div>
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('jobs')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm onSearch={(value) => onSearch(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <StatusButtonsRow>
          <div>
            <JobStatusFilter t={t} onChange={(option) => onStatusButtonClick(option?.value as JobStatus | null)} />
          </div>
          <AddJobButton
            onClick={() => {
              setSubmit(true);
              navigate('/jobs/add');
            }}
          >
            {t('addNewJob')}
          </AddJobButton>
        </StatusButtonsRow>
        <span>{`${t('resultsFound')}: ${jobStore.data_count || 0}`}</span>
        <TableWrapper>
          <DynamicTable
            head={tableHeaders}
            rows={rows}
            page={page}
            emptyView={<p>{t('noData')}</p>}
            rowsPerPage={jobStore.data_jobs?.lengthPerPage || 10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isLoading={jobStore.loading}
            onSort={onSort}
            onSetPage={onPageChange}
          />
        </TableWrapper>
      </CardBody>
    </div>
  );
});

export default JobContainer;

const TableWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
  min-width: 600px;
`;

const StatusButtonsRow = styled(Row)`
  padding: 10px 13px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  min-width: 719px;
`;