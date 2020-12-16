import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@paljs/ui/Input';
import DynamicTable from '@atlaskit/dynamic-table';
import { Button, ButtonLink } from '@paljs/ui/Button';
import { caption, head, rows } from './dynamic-table/sample-data';
import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';

const Wrapper = styled.div`
  min-width: 600px;
`;
import styled from 'styled-components';

const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

const JobContainer = (props: any) => {
  const { t } = useTranslation();
  console.log('props', props);

  return (
    <div style={{ backgroundColor: '#fff', width: '100%', height: '100%', padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <h1 style={{ display: 'flex', flexDirection: 'column' }}>{t('jobs')}</h1>
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
      </div>
      <Wrapper>
        <DynamicTable
          //   caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={10}
          defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          defaultSortKey="term"
          defaultSortOrder="ASC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    </div>
  );
};
export default JobContainer;
