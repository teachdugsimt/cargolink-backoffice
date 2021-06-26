import React from 'react'
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';
import LanguageMenu from '../components/language-menu';


const Settings = observer(() => {
  const { t } = useTranslation();

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem text={t('settings')} key="settings" />
    </Breadcrumbs>
  );


  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs}>
        {t('settings')}
      </PageHeader>

      <TableTree>
        <Headers>
          <Header width={300}>Items</Header>
          <Header width={100}>Value</Header>
        </Headers>
        <Rows
          items={[
            { id: '1', title: t('language') }
          ]}
          render={({ id, title }) => (
            <Row
              itemId={id}
            >
              <Cell css={{ alignItems: 'center' }}>{title}</Cell>
              <Cell><LanguageMenu /></Cell>
            </Row>
          )}
        />
      </TableTree>
    </>
  )
})

export default Settings
