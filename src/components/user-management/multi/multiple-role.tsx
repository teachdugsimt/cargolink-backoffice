import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, createRow, sortabled } from './dynamic-table/sample-data';
import SearchForm from '../../search-form';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';
import { useMst } from '../../../stores/root-store';
import { observer } from 'mobx-react-lite';
import { defaultAlertSetting } from '../../simple-data';
import Alert from '../../alert';
import moment from 'moment';
import { navigate } from 'gatsby';
import { IUserDTO, IUserNull } from '../../../stores/user-store';
import { UserApi } from '../../../services';
import Swal from 'sweetalert2';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Button from '@atlaskit/button'
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';

interface Props { }

const MultipleRole: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { userStore, loginStore } = useMst();
  const [rowData, setRowData] = useState<(IUserDTO | IUserNull)[]>([]);
  const [rowLength, setRowLength] = useState(10);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [page, setPage] = useState(1);
  const [isDesc, setIsDesc] = useState(true);
  const [searchValue, setSearchValue] = useState({});
  const [sortable, setSortable] = useState(sortabled);

  const deleteUser = (userId: string) => {
    console.log('attempt to delete :>', userId);
    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
        UserApi.deleteUser(userId)
          .then((response) => {
            if (response && response.ok) {
              Swal.hideLoading();
              Swal.update({
                icon: 'success',
                titleText: '',
                text: t('deleteUserSuccess'),
                showConfirmButton: true,
              });
              userStore.getUsers({ page, descending: true });
              return console.log('response delete user', response.data);
            } else throw new Error(JSON.stringify(response));
          })
          .catch((error) => {
            console.log('delete user error', error);
          });
      },
    });
  }

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem text={t('userManagement')} key="user-management" />
    </Breadcrumbs>
  );

  const setInitialSortingAndPage = () => {
    const options = {page:1, descending: true};
    setSearchValue(options);
    userStore.getUsers(options);
  }

  useEffect(() => {
    setInitialSortingAndPage();
  }, []);

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
      const translateTel = (data: any) => {
        if (!data || !data.length) return data;
        return data.map(d => {
          let { phoneNumber } = d;
          if (phoneNumber && phoneNumber.startsWith('+66')) phoneNumber = `0${phoneNumber.substr(3)}`;
          return {
            ...d,
            phoneNumber,
          }
        });
      };
      const content = translateTel(data_user.content);
      const rows = createRow(content, loginStore.language, t, deleteUser);
      setRowData(rows);
      const rowLen = data_user?.lengthPerPage;
      rowLen != null && setRowLength(rowLen);
    }
  }, [userStore.data_user, userStore.data_user?.reRender, userStore.data_user?.content?.length]);

  const onSearch = (value: string) => {
    if (value) {
      const date = moment(value);
      interface SearchParams {
        [x: string]: number | string;
      }
      let search: SearchParams = {
        type: 0,
        page: 1,
        fullName: value,
        phoneNumber: value,
        email: value,
        descending: true,
      };
      if (!isNaN(+value)) {
        search = {
          ...search,
          jobCount: parseInt(value, 10),
          truckCount: parseInt(value, 10),
        }
      }
      if (date.isValid()) {
        search = {
          ...search,
          registerDate: moment(value).format('YYYY-MM-DD'),
        }
      }
      setPage(1);
      setSearchValue(search);
      userStore.getUsers(search);
    } else {
      setPage(1);
      setInitialSortingAndPage();
    }
  };

  // const extendRows = (
  //   rows: Array<RowType>,
  //   onClick: (e: React.MouseEvent, rowIndex: number) => void,
  // ) => {
  //   return rows.map((row, index) => ({
  //     ...row,
  //     onClick: (e: React.MouseEvent) => onClick(e, index),
  //   }));
  // };

  // const onRowClick = (e: React.MouseEvent, rowIndex: number) => {
  //   console.log("Row Click", rowIndex)
  //   console.log(rowData[rowIndex])
  //   navigate('/user-management/user', {
  //     state: {
  //       id: rowData[rowIndex].cells[5].key,
  //     },
  //   })
  // };


  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>
        {t('userManagement')}
      </PageHeader>
      {alertSetting.show && <Alert setting={alertSetting} />}

      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>

        <Button
          iconBefore={<AddCircleIcon label="" />}
          onClick={() => navigate('/user-management/user')}
          appearance="warning">
          {t('addNewAccount')}
        </Button>

        <div style={{ width: 250 }}>
          <SearchForm onSearch={(value: any) => onSearch(value)} />
        </div>
      </div>


      <span>{`${t('resultsFound')}: ${userStore.data_count || 0}`}</span>
      <DynamicTable
        //   caption={caption}
        head={head}
        rows={rowData}
        page={page}
        emptyView={<p>{t('noData')}</p>}
        // sortKey={sortable.sortKey}
        // sortOrder={sortable.sortOrder === 'DESC' ? 'DESC' : 'ASC'}
        rowsPerPage={rowLength}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={userStore.loading}
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
          search['page'] = pagination;
          setSearchValue(search);
          userStore.getUsers(search);
        }}
      />
    </div >
  );
});
export default MultipleRole;
