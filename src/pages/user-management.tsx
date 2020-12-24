import React from 'react';
import { useTranslation } from 'react-i18next';
import MultipleRole from '../components/user-management/multi/multiple-role';

const UserManagement = () => {
  const { t } = useTranslation();
  return <MultipleRole />;
};
export default UserManagement;
