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

const MAIN_COLOR: string = '#f4f6f9';

const extendRows = (rows: Array<RowType>, onClick: (e: React.MouseEvent, rowIndex: number) => void) => {
  setTimeout(() => {
    const cssTable: any = document.querySelector('.sc-jJMGHv');
    // console.log('Css Table :: ', cssTable);
    if (cssTable) cssTable.style.cssText += `padding: 20px !important;`;

    let cssTbody: any = document.querySelector('tbody');
    let cssTr: any
    if (cssTbody)
      cssTr = cssTbody.querySelectorAll('tr');
    // const cssTr = cssTable.querySelectorAll('.sc-carGAA');
    if (cssTr)
      cssTr.forEach((e: any, i: number) => {
        e.style.cssText += `border-bottom: 2px solid ${MAIN_COLOR}; padding: 20px !important;`;

        const cssTd: any = e.querySelectorAll('td');
        if (cssTd) {
          cssTd.forEach((td: any) => {
            td.style.cssText += `padding: 20px !important;`;
          });
        }
      });
  }, 250);

  return rows.map((row, index) => ({
    ...row,
    onClick: (e: React.MouseEvent) => onClick(e, index),
  }));
};

const TrucksListComponent: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore, truckStore, versatileStore } = useMst();
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
      const getStallsValue = (value: string) => {
        if (value.includes('ต่ำ')) return 'LOW';
        else if (value.includes('กลาง')) return 'MEDIUM';
        else if (value.includes('สูง')) return 'HEIGHT';
        return value;
      };
      const stallHeight = getStallsValue(value);
      searchParams = {
        ...searchParams,
        registrationNumber: value,
        searchText: value,
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
    console.log("Did mount versatile store :: ", JSON.parse(JSON.stringify(versatileStore)))
    if (!versatileStore.list || !versatileStore.listDropdown) versatileStore.find()
    if (!versatileStore.province) versatileStore.getProvince()
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
      createTableRows(trucks.content, [], t, loginStore, onDetail).then((rows) => setRowData(rows));
    }
  }, [truckStore.data_trucks, truckStore.data_trucks?.reRender, truckStore.data_trucks?.content?.length]);

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('vehicle.management')} key="trucks-management" />
    </Breadcrumbs>
  );

  const onRowClick = (e: React.MouseEvent, rowIndex: number) => {
    navigate('/vehicles/' + rowData[rowIndex].cells[7].content);
  };

  return (
    <div>
      <HeaderGroup>
        <PageHeader breadcrumbs={breadcrumbs}>{t('vehicle.management')}</PageHeader>
        <AddTruckButton
          onClick={() => {
            setSubmit(true);
            navigate('/vehicles/add');
          }}
        >
          {t('addNewTruck')}
        </AddTruckButton>
      </HeaderGroup>
      <div>
        <FilterGroup>
          <SearchForm onSearch={onSearch} style={{ width: 200 }} />
          <TruckStatusFilter t={t} onChange={(option) => onTruckStatusChange(option?.value as number)} />
          <TruckTypesSelector
            placeholder={t('allTrucks')}
            includeNone={true}
            maxWidth="200px"
            onSelect={onTruckTypeFilterChange}
          />
          <ProvincesSelector
            maxWidth="200px"
            includeNone
            placeholder={t('allProvinces')}
            onSelect={(value) => onProvinceFilterChange(value)}
          />
        </FilterGroup>

        <span>{`${t('resultsFound')}: ${truckStore.data_count || 0}`}</span>
        <TableWrapper>
          <DynamicTable
            head={tableHeader}
            rows={extendRows(rowData, onRowClick)}
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

const FilterGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
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
