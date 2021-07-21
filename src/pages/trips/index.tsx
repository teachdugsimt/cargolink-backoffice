import React from 'react'
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import DynamicTable from '@atlaskit/dynamic-table';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components'

function Trip() {
  const { t } = useTranslation();

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('trip.management')} key="trips-management" />
    </Breadcrumbs>
  );
  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('trip.management')}</PageHeader>

      {/* <TableWrapper>
        <DynamicTable
          head={tableHeaders}
          rows={extendRows(rows, onRowClick)}
          page={page}
          emptyView={<p>{t('noData')}</p>}
          rowsPerPage={jobStore.data_jobs?.lengthPerPage || 10}
          defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={jobStore.loading}
          onSort={onSort}
          onSetPage={onPageChange}
        />
      </TableWrapper> */}
    </div>
  )
}

export default Trip

const TableWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
  min-width: 600px;
`;
