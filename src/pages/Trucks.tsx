import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';

const Trucks = () => {
  const { t } = useTranslation();
  return (
    <>
      <Card>
        <h1>{t('trucks')}</h1>
      </Card>
    </>
  );
};
export default Trucks;
