import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import { TrucksListParams } from '../../../services/truck-api';
import { ITrucksManagement } from '../../../stores/truck-store';
import { createTableRows, tableHeader, Sortable } from '../table.mapper';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import SearchForm from '../../search-form';
import DynamicTable from '@atlaskit/dynamic-table';
import { navigate } from 'gatsby';
import AddTruckButton from '../../buttons/add';
import TruckStatusFilter, { TruckStatus } from './status.filter';
import TruckTypesSelector from '../../dropdowns/truckType.selector';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import ProvincesSelector from '../../dropdowns/province';

const DEFAULT_API_PARAMS: TrucksListParams = {
  page: 1,
  descending: true,
};
enum TruckFilterState {
  PENDING = 0,
  APPROVED = 1,
  ALL = -1,
}

const TrucksListComponent: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore, truckStore } = useMst();
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState(DEFAULT_API_PARAMS.page);
  const [submit, setSubmit] = useState(false);

  const [searchValue, setSearchValue] = useState<TrucksListParams>(DEFAULT_API_PARAMS);

  const onDetail = (id: string) => {
    //TODO implement detail here
  };

  const onSearch = (value: string) => {
    let searchParams = searchValue;
    if (value) {
      const regions = []; //? No regions API to joint yet.
      const zoneIds: string[] = regions
        ? regions.reduce((ids: string[], region: any) => {
            region.name.includes(value.trim()) && ids.push(region.id);
            return ids + '';
          }, [])
        : [];
      const getStallsValue = (value: string) => {
        if (value.includes('ต่ำ')) return 'LOW';
        else if (value.includes('กลาง')) return 'MEDIUM';
        else if (value.includes('สูง')) return 'HEIGHT';
        return value;
      };
      const stallHeight = getStallsValue(value);
      searchParams = {
        ...searchParams,
        workingZones: zoneIds,
        registrationNumber: value,
        stallHeight,
      };
      if (!isNaN(+value)) searchParams = { ...searchParams, loadingWeight: +value };
    }
    fireSearch(searchParams);
  };

  const onTruckStatusChange = (status: TruckStatus) => {
    fireSearch({
      ...searchValue,
      status: status === TruckStatus.ALL ? undefined : status,
    });
  };

  const onTruckTypeFilterChange = (truckTypeId: string) => {
    const value = isNaN(+truckTypeId) ? undefined : JSON.stringify([+truckTypeId]);
    fireSearch({
      ...searchValue,
      truckTypes: value,
    });
  };

  const onProvinceFilterChange = (provinceId: string) => {
    fireSearch({
      ...searchValue,
      workingZones: isNaN(+provinceId) ? undefined : JSON.stringify([+provinceId]),
    });
  };

  const fireSearch = (searchParams: TrucksListParams) => {
    setPage(searchParams.page);
    setSearchValue(searchParams);
    truckStore.getTrucksList(searchParams);
  };

  const onSort = (sort: any) => {
    const descending = !Sortable[sort.key];
    const searchParams: TrucksListParams = {
      ...DEFAULT_API_PARAMS,
      sortBy: sort.key,
      descending,
    };
    setSearchValue(searchParams);
    truckStore.getTrucksList(searchParams);
  };

  const onPageChange = (newPage: number) => {
    const searchParams: TrucksListParams = {
      ...searchValue,
      page: newPage,
    };
    setPage(searchParams.page);
    truckStore.getTrucksList(searchParams);
  };

  useEffect(() => {
    truckStore.getTrucksList(searchValue);
    setSearchValue(DEFAULT_API_PARAMS);
  }, []);

  useEffect(() => {
    const { error_response } = truckStore;
    if (error_response) {
      Swal.fire({
        icon: 'error',
        title: error_response?.title || '',
        text: error_response?.content || '',
      });
    }
  }, [truckStore.error_response]);

  useEffect(() => {
    const trucks: ITrucksManagement = JSON.parse(JSON.stringify(truckStore.data_trucks));
    if (trucks?.content) {
      const rows = createTableRows(trucks.content, [], t, loginStore, onDetail);
      setRowData(rows);
    }
  }, [truckStore.data_trucks, truckStore.data_trucks?.reRender, truckStore.data_trucks?.content?.length]);

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('trucksManagement')} key="trucks-management" />
    </Breadcrumbs>
  );
  return (
    <div>
      <HeaderGroup>
        <PageHeader breadcrumbs={breadcrumbs}>{t('trucks')}</PageHeader>
        <SearchForm onSearch={onSearch} />
      </HeaderGroup>
      <div>
        <FilterRow>
          <FilterGroup>
            <TruckStatusFilter t={t} onChange={(option) => onTruckStatusChange(option?.value as number)} />
            <TruckTypesSelector
              placeholder={t('truckstype')}
              includeNone={true}
              maxWidth="200px"
              onSelect={onTruckTypeFilterChange}
            />
            <ProvincesSelector
              maxWidth="200px"
              includeNone
              placeholder={t('province')}
              onSelect={(value) => onProvinceFilterChange(value)}
            />
          </FilterGroup>
          <AddTruckButton
            onClick={() => {
              setSubmit(true);
              navigate('/vehicles/add');
            }}
          >
            {t('addNewTruck')}
          </AddTruckButton>
        </FilterRow>
        <span>{`${t('resultsFound')}: ${truckStore.data_count || 0}`}</span>
        <TableWrapper>
          <DynamicTable
            head={tableHeader}
            rows={rowData}
            page={page}
            rowsPerPage={truckStore.data_trucks?.lengthPerPage || 10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isLoading={truckStore.loading}
            emptyView={<p>{t('noData')}</p>}
            onSort={onSort}
            onSetPage={onPageChange}
          />
        </TableWrapper>
      </div>
    </div>
  );
});

export default TrucksListComponent;

const TableWrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const FilterRow = styled.div`
  padding: 10px 0;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  min-width: 719px;
`;

const FilterGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 200px);
  gap: 10px;
`;

const HeaderGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  & > :last-child {
    max-width: 250px;
    margin-top: 53px;
  }
`;
