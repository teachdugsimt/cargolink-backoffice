import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, createRow } from './dynamic-table/sample-data';
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

  useEffect(() => {
    userStore.getUser({ type: 0 });
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
    }
  }, [userStore.error_response]);

  useEffect(() => {
    const data_user = JSON.parse(JSON.stringify(userStore.data_user));
    if (data_user) {
      const rows = createRow(data_user, t);
      setRowData(rows);
    }
  }, [userStore.data_user, userStore.data_user?.length]);

  return (
    <Card>
      <CardHeader>
        <Alert setting={alertSetting} />
        <div className="block-data-header">
          <span className="font-data-header">{t('userManagement')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm onSearch={(value: any) => setRowData(value)} />
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
        <span>{`${t('resultsFound')}: ${rowData.length}`}</span>
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
});
export default MultipleRole;
