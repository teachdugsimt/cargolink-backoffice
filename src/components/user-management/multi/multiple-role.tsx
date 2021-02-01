import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, rows } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import SearchForm from '../../search-form';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
  background-color: '#5E6C84';
`;

const MultipleRole = () => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState(rows);
  // const [panding, setPanding] = useState(false)
  // const [approved, setApproved] = useState(false)
  const [submit, setSubmit] = useState(false);

  // const onClickPending = () => {
  //   setPanding(true)
  //   setApproved(false)
  //   const filteredData = rows.filter((item) => {
  //     const data = item.cells.filter((key) => key.key == 'Pending');
  //     return data && data.length ? true : false;
  //   });
  //   setRowData(filteredData);
  // };

  // const onClickApproved = () => {
  //   setApproved(true)
  //   setPanding(false)

  //   const filteredData = rows.filter((item) => {
  //     const data = item.cells.filter((key) => key.key == 'Approved');
  //     return data && data.length ? true : false;
  //   });
  //   setRowData(filteredData);
  // };

  return (
    <Card>
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('userManagement')}</span>
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
              marginRight: 10,
              display: 'flex',
              alignItems: 'center',
              borderColor: '#00B132',
              backgroundColor: submit ? '#00B132' : 'white',
              color: submit ? 'white' : '#00B132',
            }}
          >
            <Icon icon={ic_add} /> {t('addNewAccount')}
          </Button>
        </Row>
        <span style={{ display: 'flex', alignItems: 'center' }}>{`Results found: ${rowData.length}`}</span>
        <Wrapper>
          <DynamicTable
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
export default MultipleRole;
