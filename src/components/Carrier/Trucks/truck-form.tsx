import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, sortabled } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import SearchForm from '../../search-form';
import styled from 'styled-components';
import Alert from '../../alert';
import { navigate } from 'gatsby';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const TruckForm: React.FC<{ rows: any; alertSetting: any }> = observer(({ rows, alertSetting }) => {
  const { carrierStore, masterTypeStore } = useMst();
  const { t } = useTranslation();
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState({});
  const [sortable, setSortable] = useState(sortabled);

  useEffect(() => {
    setSearchValue({ page: 0 });
  }, []);

  const onClickPending = () => {
    setPanding(true);
    setApproved(false);
    setAll(false);
    setSearchValue({ page: 0, approveStatus: 0 });
    carrierStore.getAllTrucksByCarrier({ page: 0, approveStatus: 0 });
  };

  const onClickApproved = () => {
    setApproved(true);
    setPanding(false);
    setAll(false);
    setSearchValue({ page: 0, approveStatus: 1 });
    carrierStore.getAllTrucksByCarrier({ page: 0, approveStatus: 1 });
  };

  const onClickAll = () => {
    setAll(true);
    setPanding(false);
    setApproved(false);
    setSearchValue({ page: 0 });
    carrierStore.getAllTrucksByCarrier({ page: 0 });
  };

  const onSearch = (value: string) => {
    if (value) {
      // find region zone id
      let zoneIds: number[] = [];
      const regions = JSON.parse(JSON.stringify(masterTypeStore.regions));
      regions &&
        regions.forEach((z: any) => {
          const thereIs = z.name.includes(value.trim());
          if (thereIs) zoneIds.push(z.id);
        });

      // find stalls value
      let stalls = value;
      if (value.includes('ต่ำ')) stalls = 'LOW';
      else if (value.includes('กลาง')) stalls = 'MEDIUM';
      else if (value.includes('สูง')) stalls = 'HIGH';

      const search = {
        page: 0,
        workingZones: zoneIds,
        registrationNumber: value,
        loadingWeight: parseInt(value, 10),
        stallHeight: stalls,
      };
      setPage(1);
      setSearchValue(search);
      carrierStore.getAllTrucksByCarrier(search);
    } else {
      setPage(1);
      setSearchValue({ page: 0 });
      carrierStore.getAllTrucksByCarrier({ page: 0 });
    }
  };

  return (
    <div>
      <Alert setting={alertSetting} />
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('trucks')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm onSearch={(value: string) => onSearch(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', minWidth: 676 }}>
          <div>
            <Button
              id="all"
              size="Small"
              onClick={() => onClickAll()}
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: all ? '#FBBC12' : 'white',
                color: all ? 'white' : 'black',
              }}
            >
              {t('all')}
            </Button>
            <Button
              id="pending"
              status="Warning"
              size="Small"
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: panding ? '#FBBC12' : 'white',
                color: panding ? 'white' : 'black',
              }}
              onClick={() => onClickPending()}
            >
              {t('pending')}
            </Button>
            <Button
              id="approved"
              status="Warning"
              size="Small"
              onClick={() => onClickApproved()}
              style={{
                borderColor: '#FBBC12',
                backgroundColor: approved ? '#FBBC12' : 'white',
                color: approved ? 'white' : 'black',
              }}
            >
              {t('approved')}
            </Button>
          </div>
          <Button
            id="addNewTruck"
            appearance="outline"
            status="Success"
            size="Small"
            style={{
              display: 'flex',
              alignItems: 'center',
              borderColor: '#00B132',
              backgroundColor: submit ? '#00B132' : 'white',
              color: submit ? 'white' : '#00B132',
            }}
            onClick={() => {
              setSubmit(true);
              navigate('/add-truck');
            }}
          >
            <Icon icon={ic_add} style={{ color: submit ? 'white' : '#00B132' }} /> {t('addNewTruck')}
          </Button>
        </Row>
        <span>{`${t('resultsFound')}: ${rows.length}`}</span>
        <Wrapper>
          <DynamicTable
            // caption={caption}
            head={head}
            rows={rows}
            page={page}
            // sortKey={sortable.sortKey}
            // sortOrder={sortable.sortOrder === 'DESC' ? 'DESC' : 'ASC'}
            rowsPerPage={10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isLoading={false}
            // isFixedSize
            // defaultSortKey="id"
            defaultSortOrder="DESC"
            onSort={(sort) => {
              const descending = !sortable[sort.key];
              const search = { ...searchValue, descending, sortBy: sort.key };
              setSortable({ ...sortable, [sort.key]: descending });
              setSearchValue(search);
              carrierStore.getAllTrucksByCarrier(search);
            }}
            onSetPage={(pagination) => {
              setPage(pagination);
              let search = JSON.parse(JSON.stringify(searchValue));
              search['page'] = pagination - 1;
              setSearchValue(search);
              carrierStore.getAllTrucksByCarrier(search);
            }}
          />
        </Wrapper>
      </CardBody>
    </div>
  );
});
export default TruckForm;
