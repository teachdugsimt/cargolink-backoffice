import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, createRow } from './dynamic-table/sample-data';
import SearchForm from '../../search-form';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../stores/root-store';
import moment from 'moment';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const CarrierAccount = observer((props: any) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);
  const { userStore, loginStore } = useMst();
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState({});

  useEffect(() => {
    setSearchValue({ page: 0 });
    userStore.getUsers({
      type: 2,
      page: 0,
    });
    return () => { };
  }, []);

  useEffect(() => {
    const data_user = JSON.parse(JSON.stringify(userStore.data_user));
    if (data_user?.content) {
      const rows = createRow(data_user.content, loginStore.language);
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
    search['type'] = 2;
    setSearchValue(search);
    userStore.getUsers(search);
  };

  const onSearch = (value: string) => {
    if (value) {
      const date = moment(value);
      const search = {
        type: 2,
        page: 0,
        fullname: value,
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
          <span className="font-data-header">{t('carrieraccount')}</span>
          <div style={{ display: 'flex' }}>
            <SearchForm onSearch={(value: any) => onSearch(value)} />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10, minWidth: 600 }}>
          <Button
            id="all"
            appearance={all == true ? 'filled' : 'outline'}
            status="Success"
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
            id="pending"
            appearance={panding == true ? 'filled' : 'outline'}
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
            {t('pending')}
          </Button>
          <Button
            id="approved"
            appearance={approved == true ? 'filled' : 'outline'}
            status="Warning"
            size="Small"
            style={{
              borderColor: '#FBBC12',
              backgroundColor: approved ? '#FBBC12' : 'white',
              color: approved ? 'white' : 'black',
            }}
            onClick={() => onClickApproved()}
          >
            {t('approved')}
          </Button>
        </Row>
        <span>{`${t('resultsFound')}: ${rowData.length}`}</span>
        <Wrapper>
          <DynamicTable
            // caption={caption}
            head={head}
            rows={rowData}
            rowsPerPage={10}
            page={page}
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
export default CarrierAccount;
