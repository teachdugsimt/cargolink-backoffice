import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, createRow } from './dynamic-table/sample-data';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { useMst } from '../../../stores/root-store';
import { observer } from 'mobx-react-lite';
import SearchForm from '../../search-form';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const DriverForApproval: React.FC<{}> = observer(({}) => {
  const { carrierStore, loginStore } = useMst();
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);

  useEffect(() => {
    carrierStore.getAllDriversByCarrier();
  }, []);

  useEffect(() => {
    const drivers_carrier = JSON.parse(JSON.stringify(carrierStore.drivers_carrier));
    if (drivers_carrier?.length) {
      const rows = createRow(drivers_carrier, loginStore.language);
      setRows(rows);
      setRowData(rows);
    }
  }, [carrierStore.drivers_carrier, carrierStore.drivers_carrier?.length]);

  const onClickPending = () => {
    setPanding(true);
    setApproved(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells[5].key.toString().toUpperCase() === t('pending');
      return data ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickApproved = () => {
    setApproved(true);
    setPanding(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells[5].key.toString().toUpperCase() === t('approved');
      return data ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickAll = () => {
    setAll(true);
    setPanding(false);
    setApproved(false);
    setRowData(rows);
  };

  return (
    <Card>
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('drivers')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm data={rows} onSearch={(value: any) => setRowData(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10 }}>
          <Button
            appearance={all ? 'filled' : 'outline'}
            status="Success"
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
            appearance={panding ? 'filled' : 'outline'}
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
            appearance={approved ? 'filled' : 'outline'}
            status="Warning"
            size="Small"
            style={{
              borderColor: '#FBBC12',
              backgroundColor: approved ? '#FBBC12' : 'white',
              color: approved ? 'white' : 'black',
            }}
            onClick={() => onClickApproved()}
          >
            {t('approved')}
          </Button>
        </Row>
        <span>{`Results found: ${rowData.length}`}</span>
        <Wrapper>
          <DynamicTable
            // caption={caption}
            head={head}
            rows={rowData}
            rowsPerPage={10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isLoading={false}
            // isFixedSize
            defaultSortKey="term"
            defaultSortOrder="ASC"
            onSort={() => console.log('onSort')}
            onSetPage={() => console.log('onSetPage')}
          />
        </Wrapper>
      </CardBody>
    </Card>
  );
});

export default DriverForApproval;
