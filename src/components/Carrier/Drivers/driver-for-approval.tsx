import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@paljs/ui/Input';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, rows } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { useMst } from '../../../stores/root-store';
import { observer } from 'mobx-react-lite';

const Wrapper = styled.div`
  margin-top: 10px;
  min-width: 600px;
`;

import styled from 'styled-components';

const Input = styled(InputGroup)`
  margin-bottom: 0px;
`;

const DriverForApproval: React.FC<{}> = observer(({}) => {
  const { carrierStore, loginStore } = useMst();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [rowData, setRowData] = useState(rows);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);

  useEffect(() => {
    carrierStore.getAllDriversByCarrier();
  }, []);

  useEffect(() => {
    carrierStore.getAllDriversByCarrier();
  }, [loginStore.language]);

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
        <span style={{ display: 'flex', flexDirection: 'column', fontSize: 20 }}>{t('drivers')}</span>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input>
              <input
                type="text"
                placeholder="Enter your search here"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Input>
            <Button appearance="filled" status="Basic" onClick={() => onClickSearch()}>
              <Icon size={18} icon={search} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10 }}>
          <Button
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
        <span>{`Results found: ${rowData.length}`}</span>
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

export default DriverForApproval;
