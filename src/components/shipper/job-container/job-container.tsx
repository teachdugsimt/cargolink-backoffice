import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@paljs/ui/Input';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button, ButtonLink } from '@paljs/ui/Button';
import { caption, head, createRow } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';
import { search } from 'react-icons-kit/icomoon/search';
import { ic_access_time } from 'react-icons-kit/md/ic_access_time';
import styled from 'styled-components';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { useMst } from '../../../stores/root-store';
import moment from 'moment';
import 'moment/locale/th';
import { navigate } from 'gatsby';
import SearchForm from '../../search-form';
moment.locale('th');

const Wrapper = styled.div`
  margin-top: 10px;
  text-align: center;
  min-width: 600px;
`;

const CardHeaderStyled = styled(CardHeader)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface Props {}
const JobContainer: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { shipperStore } = useMst();
  const [searchValue, setSearchValue] = useState('');
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [panding, setPanding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [all, setAll] = useState(false);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    shipperStore.getProductTypes();
    shipperStore.clearShipperStore();
    shipperStore.getAllJobsByShipper({
      descending: true,
      page: 0,
    });
  }, []);

  useEffect(() => {
    const jobs_shipper = JSON.parse(JSON.stringify(shipperStore.jobs_shipper));
    if (jobs_shipper?.length) {
      const rows = createRow(jobs_shipper, productTypes);
      setRows(rows);
      setRowData(rows);
    }
  }, [shipperStore.jobs_shipper?.length, productTypes]);

  useEffect(() => {
    const product_types = JSON.parse(JSON.stringify(shipperStore.product_types));
    if (product_types?.length) setProductTypes(product_types);
  }, [shipperStore.product_types]);

  const onClickPending = () => {
    setPanding(true);
    setApproved(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells.filter((key: any) => key.key.toString().toLowerCase() == 'pending');
      return data && data.length ? true : false;
    });
    setRowData(filteredData);
  };

  const onClickApproved = () => {
    setApproved(true);
    setPanding(false);
    setAll(false);
    const filteredData = rows.filter((item: any) => {
      const data = item.cells.filter((key: any) => key.key.toString().toLowerCase() == 'approved');
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
      <CardHeaderStyled>
        <span style={{ display: 'flex', flexDirection: 'column', fontSize: 20 }}>{t('jobs')}</span>
        <div style={{ display: 'flex' }}>
          <SearchForm data={rows} onSearch={(value: any) => setRowData(value)} />
        </div>
      </CardHeaderStyled>
      <CardBody>
        <Row style={{ padding: 5, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Button
              appearance={all == true ? 'filled' : 'outline'}
              status="Success"
              size="Small"
              onClick={() => onClickAll()}
              style={{
                marginRight: 10,
              }}
            >
              ALL
            </Button>
            <Button
              appearance={panding == true ? 'filled' : 'outline'}
              status="Warning"
              size="Small"
              style={{
                marginRight: 10,
              }}
              onClick={() => onClickPending()}
            >
              PENDING
            </Button>
            <Button
              appearance={approved == true ? 'filled' : 'outline'}
              status="Warning"
              size="Small"
              onClick={() => onClickApproved()}
            >
              APPROVED
            </Button>
          </div>
          <div>
            <Button
              appearance="outline"
              status="Success"
              size="Small"
              style={{
                marginRight: 10,
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => navigate('/add-job')}
            >
              <Icon icon={ic_add} /> ADD NEW JOB
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
            onSetPage={(pagination) => {
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
