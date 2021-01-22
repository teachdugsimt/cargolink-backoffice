import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { observer } from 'mobx-react-lite';
import SearchForm from '../../search-form';
import styled from 'styled-components';
import { navigate } from 'gatsby';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const TruckForm: React.FC<{ rows: any }> = observer(({ rows }) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);

  useEffect(() => {
    setRowData(rows);
  }, [rows]);

  const onClickPending = () => {
    setPanding(true);
    setApproved(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells.filter((cell: any) => cell.key === 'อนุมัติแล้ว');
      return data && data.length ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickApproved = () => {
    setApproved(true);
    setPanding(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells.filter((cell: any) => cell.key === 'อยู่ระหว่างการดำเนินการ');
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
      <CardHeader
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', fontSize: 20 }}>{t('trucks')}</span>
        <div style={{ display: 'flex' }}>
          <SearchForm data={rows} onSearch={(value: any) => setRowData(value)} />
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Button
              appearance={all == true ? 'filled' : 'outline'}
              status="Success"
              size="Small"
              onClick={() => onClickAll()}
              style={{
                marginRight: 10,
              }}
            >
              ALL
            </Button>
            <Button
              appearance={panding == true ? 'filled' : 'outline'}
              status="Warning"
              size="Small"
              style={{
                marginRight: 10,
              }}
              onClick={() => onClickPending()}
            >
              PENDING
            </Button>
            <Button
              appearance={approved == true ? 'filled' : 'outline'}
              status="Warning"
              size="Small"
              onClick={() => onClickApproved()}
            >
              APPROVED
            </Button>
          </div>
          <div>
            <Button
              appearance="outline"
              status="Success"
              size="Small"
              style={{
                marginRight: 10,
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => navigate('/add-truck')}
            >
              <Icon icon={ic_add} /> ADD NEW TRUCK
            </Button>
          </div>
        </Row>
        <span>{`Results found: ${rowData ? rowData.length : 0}`}</span>
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
export default TruckForm;
