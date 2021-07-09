import React from 'react'
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';

function Trip() {
  const { t } = useTranslation();

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('trips.management')} key="trips-management" />
    </Breadcrumbs>
  );
  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('trips.management')}</PageHeader>
    </div>
  )
}

export default Trip
