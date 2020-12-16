import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import DriverForApproval from '../components/Carrier/Drivers/DriverForApproval/DriverForApproval';

const Drivers = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <span style={{ fontSize: 20 }}>{t('drivers')}</span>
      </CardHeader>
      <CardBody>
        <DriverForApproval />
      </CardBody>
    </Card>
  );
};
export default Drivers;
