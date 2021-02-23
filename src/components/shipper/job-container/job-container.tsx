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
import { navigate } from 'gatsby';
import SearchForm from '../../search-form';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';

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
  const [open, setOpen] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [all, setAll] = useState(false);

  useEffect(() => {
    shipperStore.getProductTypes();
    shipperStore.clearShipperStore();
    shipperStore.getAllJobsByShipper({
      descending: true,
      page: 0,
    });
  }, []);

  useEffect(() => {
    const { loading } = shipperStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: t('LOADING'),
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
    const product_types = JSON.parse(JSON.stringify(shipperStore.product_types));
    if (product_types?.length) setProductTypes(product_types);
  }, [shipperStore.product_types, shipperStore.product_types?.length]);

  useEffect(() => {
    const jobs_shipper = JSON.parse(JSON.stringify(shipperStore.jobs_shipper));
    // console.log('jobs_shipper:>>', JSON.parse(JSON.stringify(shipperStore.jobs_shipper)));
    if (jobs_shipper?.length) {
      const rows = createRow(jobs_shipper, productTypes, loginStore.language, t);
      setRows(rows);
      setRowData(rows);
    }
  }, [shipperStore.jobs_shipper, shipperStore.jobs_shipper?.length, productTypes]);

  const onClickOpen = () => {
    setOpen(true);
    setInProgress(false);
    setCompleted(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells[6].key.toString() === t('OPEN');
      return data ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickInProgress = () => {
    setOpen(false);
    setInProgress(true);
    setCompleted(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells[6].key.toString() === t('IN-PROGRESS');
      return data ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickCompleted = () => {
    setOpen(false);
    setInProgress(false);
    setCompleted(true);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells[6].key.toString() === t('COMPLETED');
      return data ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickAll = () => {
    setAll(true);
    setOpen(false);
    setInProgress(false);
    setCompleted(false);
    setRowData(rows);
  };

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
        <Row style={{ padding: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', minWidth: 600 }}>
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
              {t('all')}
            </Button>
            <Button
              status="Warning"
              size="Small"
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: open ? '#FBBC12' : 'white',
                color: open ? 'white' : 'black',
              }}
              onClick={() => onClickOpen()}
            >
              {t('OPEN')}
            </Button>
            <Button
              status="Warning"
              size="Small"
              onClick={() => onClickInProgress()}
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: inProgress ? '#FBBC12' : 'white',
                color: inProgress ? 'white' : 'black',
              }}
            >
              {t('IN-PROGRESS')}
            </Button>
            <Button
              status="Warning"
              size="Small"
              onClick={() => onClickCompleted()}
              style={{
                borderColor: '#FBBC12',
                backgroundColor: completed ? '#FBBC12' : 'white',
                color: completed ? 'white' : 'black',
              }}
            >
              {t('COMPLETED')}
            </Button>
          </div>
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
            <Icon icon={ic_add} /> {t('addNewJob')}
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
            page={page}
            onSetPage={(pagination) => {
              setPage(pagination);
              if (rowData.length === rows.length) {
                shipperStore.getAllJobsByShipper({
                  descending: true,
                  page: pagination - 1,
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
