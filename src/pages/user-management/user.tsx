import React from 'react';
import { useTranslation } from 'react-i18next';
import AddUser from '../../components/user-management/multi/add-user';
import EditUser from '../../components/user-management/multi/edit-user';

const User = (props: any) => {
  const id = props?.location?.state?.id;
  const { t } = useTranslation();
  return !id ? <AddUser /> : <EditUser id={id} />;
};

export default User;
