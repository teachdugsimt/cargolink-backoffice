import React, { useState, useEffect, CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../stores/root-store';
import { TrucksListParams } from '../../services/truck-api';
import { ITrucksManagement } from '../../stores/truck-store';
import { createTableRows, tableHeader, Sortable } from './table.mapper';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import SearchForm from '../search-form';
import DynamicTable from '@atlaskit/dynamic-table';
import { navigate } from 'gatsby';

import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import { Button } from '@paljs/ui/Button';
import { CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';

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
  const [filterState, setFilterState] = useState(TruckFilterState.ALL);

  const [searchValue, setSearchValue] = useState<TrucksListParams>(DEFAULT_API_PARAMS);

  const onDetail = (id: string) => {
    //TODO implement detail here
  };

  const onFilterChange = (newState: TruckFilterState) => {
    setFilterState(newState);
    let searchParams = { ...DEFAULT_API_PARAMS, page };
    if (newState !== TruckFilterState.ALL) searchParams = { ...searchParams, approveStatus: newState };
    truckStore.getTrucksList(searchParams);
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
    console.log('wtf', searchParams);
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
  const selectedFilterButtonStyle: CSSProperties = {
    backgroundColor: '#FFBC12',
    color: 'white',
  };
  const submittedNewTruckButtonStyle: CSSProperties = {
    backgroundColor: '#00B132',
    color: 'white',
  };
  return (
    <div>
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('trucks')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm onSearch={onSearch} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <FilterRow>
          <div>
            <FilterButton
              id="all"
              size="Small"
              onClick={() => onFilterChange(TruckFilterState.ALL)}
              style={filterState === TruckFilterState.ALL ? selectedFilterButtonStyle : undefined}
            >
              {t('all')}
            </FilterButton>
            <FilterButton
              id="pending"
              status="Warning"
              size="Small"
              onClick={() => onFilterChange(TruckFilterState.PENDING)}
              style={filterState === TruckFilterState.PENDING ? selectedFilterButtonStyle : undefined}
            >
              {t('pending')}
            </FilterButton>
            <FilterButton
              id="approved"
              size="Small"
              onClick={() => onFilterChange(TruckFilterState.APPROVED)}
              style={filterState === TruckFilterState.APPROVED ? selectedFilterButtonStyle : undefined}
            >
              {t('approved')}
            </FilterButton>
          </div>
          <NewTruckButton
            id="addNewTrack"
            status="Success"
            size="Small"
            onClick={() => {
              setSubmit(true);
              navigate('/vehicles/add');
            }}
            style={submit ? submittedNewTruckButtonStyle : undefined}
          >
            <Icon icon={ic_add} style={{ color: submit ? 'white' : '#00B132' }} />
          </NewTruckButton>
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
      </CardBody>
    </div>
  );
});

export default TrucksListComponent;

const TableWrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const FilterRow = styled(Row)`
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  min-width: 676px;
`;

const FilterButton = styled(Button)`
  margin-right: 10px;
  border-color: #fbbc12;
  background-color: white;
  color: black;
`;

const NewTruckButton = styled(Button)`
  display: flex;
  align-items: center;
  border-color: #00b132;
  background-color: white;
  color: #00b132;
`;
