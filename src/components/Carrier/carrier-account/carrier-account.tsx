import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, rows } from './dynamic-table/sample-data';
import SearchForm from '../../search-form';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const CarrierAccount = (props: any) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState(rows);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);

  const onClickPending = () => {
    setPanding(true);
    setApproved(false);
    setAll(false);
    const filteredData = rows.filter((item) => {
      const data = item.cells.filter((key) => key.key == 'Pending');
      return data && data.length ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickApproved = () => {
    setApproved(true);
    setPanding(false);
    setAll(false);
    const filteredData = rows.filter((item) => {
      const data = item.cells.filter((key) => key.key == 'Approved');
      return data && data.length ? true : false;
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
          <span className="font-data-header">{t('carrieraccount')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm data={rows} onSearch={(value: any) => setRowData(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10, minWidth: 600 }}>
          <Button
            id="all"
            appearance={all == true ? 'filled' : 'outline'}
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
            id="pending"
            appearance={panding == true ? 'filled' : 'outline'}
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
            appearance={approved == true ? 'filled' : 'outline'}
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
        <span>{`${t('resultsFound')}: ${rowData.length}`}</span>
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
            // defaultSortKey="term"
            defaultSortOrder="ASC"
            onSort={() => console.log('onSort')}
            onSetPage={() => console.log('onSetPage')}
          />
        </Wrapper>
      </CardBody>
    </Card>
  );
};
export default CarrierAccount;
