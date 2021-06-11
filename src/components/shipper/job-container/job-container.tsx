import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button } from '@paljs/ui/Button';
import { head, createRow, sortabled } from './dynamic-table/sample-data';
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
  const [productTypes, setProductTypes] = useState([]);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [submit, setSubmit] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [all, setAll] = useState(false);
  const [searchValue, setSearchValue] = useState({});
  const [sortable, setSortable] = useState(sortabled);
  const [btnStatus, setBtnStatus] = useState<any>({ 0: true });

  useEffect(() => {
    shipperStore.getProductTypes();
    shipperStore.clearShipperStore();
    setSearchValue({ page: 0 });
    shipperStore.getAllJobsByShipper({ page: 0 });

    return () => {
      setBtnStatus({ 0: true });
    };
  }, []);

  useEffect(() => {
    const { loading } = shipperStore;
    // setAlertSetting({
    //   icon: '',
    //   show: loading,
    //   type: 'loading',
    //   title: '',
    //   content: t('LOADING'),
    // });
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
    if (jobs_shipper?.content) {
      const rows = createRow(jobs_shipper.content, productTypes, loginStore.language, t, onDetail);
      setRows(rows);
    }
  }, [
    shipperStore.jobs_shipper,
    shipperStore.jobs_shipper?.reRender,
    shipperStore.jobs_shipper?.content?.length,
    productTypes,
  ]);

  const onDetail = (id: string) => {
    shipperStore.getJobDetailById(id);
    navigate('/job-detail');
  };

  const onClickOpen = () => {
    setOpen(true);
    setInProgress(false);
    setCompleted(false);
    setAll(false);
    setSearchValue({ page: 0, status: 1 });
    shipperStore.getAllJobsByShipper({ page: 0, status: 1 });
  };

  const onClickInProgress = () => {
    setOpen(false);
    setInProgress(true);
    setCompleted(false);
    setAll(false);
    setSearchValue({ page: 0, status: 3 });
    shipperStore.getAllJobsByShipper({ page: 0, status: 3 });
  };

  const onClickCompleted = () => {
    setOpen(false);
    setInProgress(false);
    setCompleted(true);
    setAll(false);
    setSearchValue({ page: 0, status: 7 });
    shipperStore.getAllJobsByShipper({ page: 0, status: 7 });
  };

  const onClickAll = () => {
    setAll(true);
    setOpen(false);
    setInProgress(false);
    setCompleted(false);
    setSearchValue({ page: 0 });
    shipperStore.getAllJobsByShipper({ page: 0 });
  };

  const onClickStatus = (jobStatus: number) => {
    setBtnStatus({
      [jobStatus]: true,
    });
    if (jobStatus === 0) {
      setSearchValue({ page: 0 });
      shipperStore.getAllJobsByShipper({ page: 0 });
    } else {
      setSearchValue({ page: 0, status: jobStatus });
      shipperStore.getAllJobsByShipper({ page: 0, status: jobStatus });
    }
  };

  const onSearch = (value: string) => {
    if (value) {
      let productIds: number[] = [];
      productTypes &&
        productTypes.forEach((e: any) => {
          const thereIs = e.name.includes(value.trim());
          if (thereIs) productIds.push(e.id);
        });
      const search = {
        page: 0,
        productName: value,
        owner: value,
        productType: productIds,
        from: value,
        to: value,
        weight: parseInt(value, 10),
      };
      setPage(1);
      setSearchValue(search);
      shipperStore.getAllJobsByShipper(search);
    } else {
      setPage(1);
      setSearchValue({ page: 0 });
      shipperStore.getAllJobsByShipper({ page: 0 });
    }
  };

  return (
    <div>
      <Alert setting={alertSetting} />
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('jobs')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm onSearch={(value: string) => onSearch(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', minWidth: 719 }}>
          <div>
            <Button
              size="Small"
              // onClick={() => onClickAll()}
              onClick={() => onClickStatus(0)}
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: btnStatus[0] ? '#FBBC12' : 'white',
                color: btnStatus[0] ? 'white' : 'black',
              }}
            >
              {t('all')}
            </Button>
            <Button
              status="Warning"
              size="Small"
              // onClick={() => onClickOpen()}
              onClick={() => onClickStatus(1)}
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: btnStatus[1] ? '#FBBC12' : 'white',
                color: btnStatus[1] ? 'white' : 'black',
              }}
            >
              {t('OPEN')}
            </Button>
            <Button
              status="Warning"
              size="Small"
              // onClick={() => onClickInProgress()}
              onClick={() => onClickStatus(3)}
              style={{
                marginRight: 10,
                borderColor: '#FBBC12',
                backgroundColor: btnStatus[3] ? '#FBBC12' : 'white',
                color: btnStatus[3] ? 'white' : 'black',
              }}
            >
              {t('IN-PROGRESS')}
            </Button>
            <Button
              status="Warning"
              size="Small"
              // onClick={() => onClickCompleted()}
              onClick={() => onClickStatus(7)}
              style={{
                borderColor: '#FBBC12',
                backgroundColor: btnStatus[7] ? '#FBBC12' : 'white',
                color: btnStatus[7] ? 'white' : 'black',
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
        <span>{`${t('resultsFound')}: ${rows.length}`}</span>
        <Wrapper>
          <DynamicTable
            //   caption={caption}
            head={head}
            rows={rows}
            page={page}
            // sortKey={sortable.sortKey}
            // sortOrder={sortable.sortOrder === 'DESC' ? 'DESC' : 'ASC'}
            rowsPerPage={10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isLoading={shipperStore.loading}
            // isFixedSize
            // defaultSortKey="id"
            defaultSortOrder="DESC"
            onSort={(sort) => {
              const descending = !sortable[sort.key];
              const search = { ...searchValue, descending, sortBy: sort.key };
              setSortable({ ...sortable, [sort.key]: descending });
              setSearchValue(search);
              shipperStore.getAllJobsByShipper(search);
            }}
            onSetPage={(pagination) => {
              setPage(pagination);
              let search = JSON.parse(JSON.stringify(searchValue));
              search['page'] = pagination - 1;
              setSearchValue(search);
              shipperStore.getAllJobsByShipper(search);
            }}
          />
        </Wrapper>
      </CardBody>
    </div>
  );
});
export default JobContainer;
