import React from 'react';
import { useTranslation } from 'react-i18next';
import AddUser from '../../components/user-management/multi/add-user';

const User = (props: any) => {
  console.log('props :>> ', props);
  const { t } = useTranslation();
  return <AddUser />;
};

export default User;
