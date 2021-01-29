import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@paljs/ui/Input';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button, ButtonLink } from '@paljs/ui/Button';
import { caption, head, rows } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import { search } from 'react-icons-kit/icomoon/search';
import styled from 'styled-components';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

const JobContainer = (props: any) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [rowData, setRowData] = useState(rows);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);
  const [submit, setSubmit] = useState(false);

  const onClickSearch = () => {
    const lowercasedValue = searchValue.toLowerCase().trim();
    if (lowercasedValue === '') setRowData(rows);
    else {
      const filteredData = rows.filter((item) => {
        const data = item.cells.filter((key) => key.key.toString().toLowerCase().includes(lowercasedValue));
        return data && data.length ? true : false;
      });
      setRowData(filteredData);
    }
  };

  const onClickPending = () => {
    setPanding(true);
    setApproved(false);
    setAll(false);
    const filteredData = rows.filter((item) => {
      const data = item.cells.filter((key) => key.key == 'Pending');
      return data && data.length ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickApproved = () => {
    setApproved(true);
    setPanding(false);
    setAll(false);
    const filteredData = rows.filter((item) => {
      const data = item.cells.filter((key) => key.key == 'Approved');
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
        <span style={{ display: 'flex', flexDirection: 'column', fontSize: 20 }}>{t('shipperaccount')}</span>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputGroup>
              <input
                type="text"
                placeholder="Enter your search here"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </InputGroup>
            <Button appearance="filled" status="Basic" onClick={() => onClickSearch()}>
              <Icon size={18} icon={search} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10, display: 'flex', justifyContent: 'space-between', minWidth: 600 }}>
          <div></div>
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
              }}
            >
              <Icon icon={ic_add} style={{ color: submit ? 'white' : '#00B132' }} /> {t('addNewAccount')}
            </Button>
          </div>
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
            onSetPage={() => console.log('onSetPage')}
          />
        </Wrapper>
      </CardBody>
    </Card>
  );
};
export default JobContainer;
