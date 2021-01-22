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
import Alert from '../../alert';
import { navigate } from 'gatsby';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const TruckForm: React.FC<{ rows: any; alertSetting: any }> = observer(({ rows, alertSetting }) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);
  const [submit, setSubmit] = useState(false);

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
      <Alert setting={alertSetting} />
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('trucks')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm data={rows} onSearch={(value: any) => setRowData(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10, display: 'flex', justifyContent: 'space-between', minWidth: 600 }}>
          <div>
            <Button
              size="Small"
              onClick={() => onClickAll()}
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: all ? '#FBBC12' : 'white',
                color: all ? 'white' : 'black',
              }}
            >
              ALL
            </Button>
            <Button
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
              PENDING
            </Button>
            <Button
              status="Warning"
              size="Small"
              onClick={() => onClickApproved()}
              style={{
                borderColor: '#FBBC12',
                backgroundColor: approved ? '#FBBC12' : 'white',
                color: approved ? 'white' : 'black',
              }}
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
              <Icon icon={ic_add} style={{ color: submit ? 'white' : '#00B132' }} /> ADD NEW TRUCK
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
