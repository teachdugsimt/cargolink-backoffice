import React from 'react';
import { useTranslation } from 'react-i18next';
import MultipleRole from '../components/UserManagement/Multi/MultipleRole';

const UserManagement = () => {
  const { t } = useTranslation();
  return <MultipleRole />;
};
export default UserManagement;
