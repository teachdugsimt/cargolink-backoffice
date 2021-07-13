import React from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';

const AddTrucks = () => {
  const { t } = useTranslation();

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('vehicle.management')} key="vehicle-management" />
      <BreadcrumbsItem text={t('vehicle.add')} key="vehicle-add" />
    </Breadcrumbs>
  );
  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('vehicle.add')}</PageHeader>
    </div>
  )
}

export default AddTrucks;
