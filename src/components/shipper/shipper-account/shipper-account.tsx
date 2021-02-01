import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button } from '@paljs/ui/Button';
import { head, rows } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import SearchForm from '../../search-form';
import styled from 'styled-components';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const JobContainer = (props: any) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState(rows);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);
  const [submit, setSubmit] = useState(false);

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
          <span className="font-data-header">{t('shipperaccount')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm data={rows} onSearch={(value: any) => setRowData(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10, display: 'flex', justifyContent: 'flex-end', minWidth: 600 }}>
          <Button
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
            }}
          >
            <Icon icon={ic_add} style={{ color: submit ? 'white' : '#00B132' }} /> {t('addNewAccount')}
          </Button>
        </Row>
        <span>{`${t('resultsFound')}: ${rowData.length}`}</span>
        <Wrapper>
          <DynamicTable
            //   caption={caption}
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
export default JobContainer;
