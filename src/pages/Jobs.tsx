import React from 'react';
import { useTranslation } from 'react-i18next';
import TableTree, { Headers, Header, Rows, Row, Cell } from '@atlaskit/table-tree';
import staticData from './data.json';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';

const Jobs = (props) => {
  const { t } = useTranslation();
  console.log('props', props);
  return (
    <Card>
      <h1>{t('jobs')}</h1>
      <TableTree>
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
      </TableTree>
    </Card>
  );
};
export default Jobs;
