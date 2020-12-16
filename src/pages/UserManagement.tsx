import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import MultipleRole from '../components/UserManagement/Multi/MultipleRole';

const UserManagement = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <span style={{ fontSize: 20 }}>{t('userManagement')}</span>
      </CardHeader>
      <CardBody>
        <MultipleRole />
      </CardBody>
    </Card>
  );
};
export default UserManagement;
