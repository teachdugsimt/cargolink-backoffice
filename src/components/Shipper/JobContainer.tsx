import React from 'react';
import { useTranslation } from 'react-i18next';
import TableTree, { Headers, Header, Rows, Row, Cell } from '@atlaskit/table-tree';
import { InputGroup } from '@paljs/ui/Input';
import DynamicTable from '@atlaskit/dynamic-table';
import { caption, head, rows } from './dynamic-table/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;
import styled from 'styled-components';

const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

const JobContainer = (props) => {
  const { t } = useTranslation();
  console.log('props', props);

  return (
    <div style={{ backgroundColor: '#fff', width: '100%', height: '100%', padding: 20 }}>
      <h1>{t('jobs')}</h1>
      <Input fullWidth>
        <input placeholder="Enter your search here" />
      </Input>
      {/* <TableTree>
        <Headers>
          <Header width={200}>Chapter title</Header>
          <Header width={100}>Numbering</Header>
          <Header width={100}>Page</Header>
        </Headers>
        <Rows
          items={staticData.children}
          render={({ title, numbering, page, children }) => (
            <Row itemId={numbering} items={children} hasChildren={children.length > 0}>
              <Cell singleLine>{title}</Cell>
              <Cell>{numbering}</Cell>
              <Cell>{page}</Cell>
            </Row>
          )}
        />
      </TableTree> */}
      <Wrapper>
        <DynamicTable
          caption={caption}
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
