import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, createRow, sortabled } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import SearchForm from '../../search-form';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import styled from 'styled-components';
import { useMst } from '../../../stores/root-store';
import { observer } from 'mobx-react-lite';
import { defaultAlertSetting } from '../../simple-data';
import Alert from '../../alert';
import moment from 'moment';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
  background-color: '#5E6C84';
`;

interface Props {}

const MultipleRole: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { userStore } = useMst();
  const [rowData, setRowData] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState({});
  const [sortable, setSortable] = useState(sortabled);

  useEffect(() => {
    setSearchValue({ page: 0 });
    userStore.getUsers({ page: 0 });
  }, []);

  useEffect(() => {
    const { loading } = userStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: t('LOADING'),
    });
  }, [userStore.loading]);

  useEffect(() => {
    const { error_response } = userStore;
    if (error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: error_response.title || '',
        content: error_response.content || '',
      });
    } else {
      setAlertSetting(defaultAlertSetting);
    }
  }, [userStore.error_response]);

  useEffect(() => {
    const data_user = JSON.parse(JSON.stringify(userStore.data_user));
    if (data_user?.content) {
      const rows = createRow(data_user.content, t);
      setRowData(rows);
    }
  }, [userStore.data_user, userStore.data_user?.reRender, userStore.data_user?.content?.length]);

  const onSearch = (value: string) => {
    if (value) {
      const search = {
        type: 0,
        page: 0,
        fullName: value,
        phoneNumber: value,
        registerDate: moment(value).format('YYYY-MM-DD'),
        jobCount: parseInt(value, 10),
        truckCount: parseInt(value, 10),
      };
      setPage(1);
      setSearchValue(search);
      userStore.getUsers(search);
    } else {
      setPage(1);
      setSearchValue({ page: 0 });
      userStore.getUsers({ page: 0 });
    }
  };

  return (
    <Card>
      <CardHeader>
        {alertSetting.show && <Alert setting={alertSetting} />}
        <div className="block-data-header">
          <span className="font-data-header">{t('userManagement')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm onSearch={(value: any) => onSearch(value)} />
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
            onClick={() => setSubmit(true)}
          >
            <Icon icon={ic_add} /> {t('addNewAccount')}
          </Button>
        </Row>
        <span>{`${t('resultsFound')}: ${rowData.length}`}</span>
        <Wrapper>
          <DynamicTable
            //   caption={caption}
            head={head}
            rows={rowData}
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
              userStore.getUsers(search);
            }}
            onSetPage={(pagination) => {
              setPage(pagination);
              let search = JSON.parse(JSON.stringify(searchValue));
              search['page'] = pagination - 1;
              setSearchValue(search);
              userStore.getUsers(search);
            }}
          />
        </Wrapper>
      </CardBody>
    </Card>
  );
});
export default MultipleRole;
