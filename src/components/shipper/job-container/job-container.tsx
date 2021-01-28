import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button } from '@paljs/ui/Button';
import { head, createRow } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import styled from 'styled-components';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { useMst } from '../../../stores/root-store';
import moment from 'moment';
import 'moment/locale/th';
import { navigate } from 'gatsby';
import SearchForm from '../../search-form';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
moment.locale('th');

const Wrapper = styled.div`
  margin-top: 10px;
  text-align: center;
  min-width: 600px;
`;

interface Props {}
const JobContainer: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { shipperStore, loginStore } = useMst();
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [submit, setSubmit] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    shipperStore.getProductTypes();
    shipperStore.clearShipperStore();
    shipperStore.getAllJobsByShipper({
      descending: true,
      page: 0,
    });
  }, []);

  useEffect(() => {
    shipperStore.getProductTypes();
    shipperStore.clearShipperStore();
    shipperStore.getAllJobsByShipper({
      descending: true,
      page: 0,
    });
  }, [loginStore.language]);

  useEffect(() => {
    const { loading } = shipperStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: 'Loading',
    });
  }, [shipperStore.loading]);

  useEffect(() => {
    const { error_response } = shipperStore;
    if (error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: error_response.title || '',
        content: error_response.content || '',
      });
    }
  }, [shipperStore.error_response]);

  useEffect(() => {
    const jobs_shipper = JSON.parse(JSON.stringify(shipperStore.jobs_shipper));
    if (jobs_shipper?.length) {
      const rows = createRow(jobs_shipper, productTypes, loginStore.language);
      setRows(rows);
      setRowData(rows);
    }
  }, [shipperStore.jobs_shipper?.length, productTypes, loginStore.language]);

  useEffect(() => {
    const product_types = JSON.parse(JSON.stringify(shipperStore.product_types));
    if (product_types?.length) setProductTypes(product_types);
  }, [shipperStore.product_types]);

  return (
    <Card>
      <Alert setting={alertSetting} />
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('jobs')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm data={rows} onSearch={(value: any) => setRowData(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 10, marginBottom: 10, display: 'flex', justifyContent: 'flex-end', minWidth: 600 }}>
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
              navigate('/add-job');
            }}
          >
            <Icon icon={ic_add} /> {t('AddNewJob')}
          </Button>
        </Row>
        <span>{`Results found: ${rowData.length}`}</span>
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
            defaultSortKey="term"
            defaultSortOrder="ASC"
            onSort={() => console.log('onSort')}
            page={page}
            onSetPage={(pagination) => {
              setPage(pagination);
              if (rowData.length % 10 === 0 && pagination % 2 === 0 && rowData.length === rows.length) {
                shipperStore.getAllJobsByShipper({
                  descending: true,
                  page: rowData.length,
                });
              }
            }}
          />
        </Wrapper>
      </CardBody>
    </Card>
  );
});
export default JobContainer;
