import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button } from '@paljs/ui/Button';
import { head, createRow } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import SearchForm from '../../search-form';
import styled from 'styled-components';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { useMst } from '../../../stores/root-store';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const JobContainer = observer((props: any) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { userStore, loginStore } = useMst();
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState({});

  useEffect(() => {
    setSearchValue({ page: 0 });
    userStore.getUsers({
      type: 1,
      page: 0,
    });
    return () => {};
  }, []);

  useEffect(() => {
    const dataUser = JSON.parse(JSON.stringify(userStore.data_user));
    if (dataUser?.content) {
      const rows = createRow(dataUser.content, loginStore.language);
      setRowData(rows);
    }
  }, [JSON.stringify(userStore.data_user)]);

  const onClickPending = () => {
    // setPanding(true);
    // setApproved(false);
    // setAll(false);
    // const filteredData = rows.filter((item) => {
    //   const data = item.cells.filter((key) => key.key == 'Pending');
    //   return data && data.length ? true : false;
    // });
    // setRowData(filteredData);
  };

  const onClickApproved = () => {
    // setApproved(true);
    // setPanding(false);
    // setAll(false);
    // const filteredData = rows.filter((item) => {
    //   const data = item.cells.filter((key) => key.key == 'Approved');
    //   return data && data.length ? true : false;
    // });
    // setRowData(filteredData);
  };

  const onClickAll = () => {
    // setAll(true);
    // setPanding(false);
    // setApproved(false);
    // setRowData(rows);
  };

  const onSetPage = (page: number) => {
    setPage(page);
    let search = JSON.parse(JSON.stringify(searchValue));
    search['page'] = page - 1;
    search['type'] = 1;
    setSearchValue(search);
    userStore.getUsers(search);
  };

  const onSearch = (value: string) => {
    if (value) {
      const date = moment(value);
      const search = {
        type: 1,
        page: 0,
        fullName: value,
        email: value,
        phoneNumber: value,
        registerDate: date.isValid() ? moment(value).format('YYYY-MM-DD') : '',
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
    <div>
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('shipperaccount')}</span>
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
            page={page}
            rowsPerPage={10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isLoading={false}
            // isFixedSize
            // defaultSortKey="term"
            defaultSortOrder="ASC"
            onSort={() => console.log('onSort')}
            onSetPage={(pagination: number) => onSetPage(pagination)}
          />
        </Wrapper>
      </CardBody>
    </div>
  );
});
export default JobContainer;
