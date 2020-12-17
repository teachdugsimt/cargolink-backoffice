import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@paljs/ui/Input';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button, ButtonLink } from '@paljs/ui/Button';
import { caption, head, rows } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
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
  console.log('props', props);

  return (
    <Card>
      <CardHeader
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', fontSize: 20 }}>{t('shipperaccount')}</span>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputGroup>
              <input placeholder="Enter your search here" />
            </InputGroup>
            <Button appearance="filled" status="Basic">
              <Icon size={18} icon={search} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Row style={{ padding: 5 }}>
          <Button
            appearance="filled"
            status="Basic"
            style={{
              marginRight: 10,
              color: 'rgb(255, 255, 255)',
              backgroundColor: 'rgb(255, 170, 0',
              borderColor: 'rgb(255, 170, 0',
            }}
          >
            PENDING
          </Button>
          <Button
            appearance="filled"
            status="Basic"
            style={{ color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(255, 170, 0', borderColor: 'rgb(255, 170, 0' }}
          >
            APPROVED
          </Button>
        </Row>
        <Wrapper>
          <DynamicTable
            //   caption={caption}
            head={head}
            rows={rows}
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
