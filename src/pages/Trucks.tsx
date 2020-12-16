import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import TrucksPosted from '../components/Carrier/Trucks/TrucksPosted/TrucksPosted';

const Trucks = () => {
  const { t } = useTranslation();
  return (
    <>
      <Card>
        <CardHeader>
          <span style={{ fontSize: 20 }}>{t('trucks')}</span>
        </CardHeader>
        <CardBody>
          <TrucksPosted />
        </CardBody>
      </Card>
    </>
  );
};
export default Trucks;
