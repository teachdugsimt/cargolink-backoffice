import React from 'react';
import { useTranslation } from 'react-i18next';
import AddUser from '../../components/user-management/multi/add-user';
// import EditUser from '../../components/user-management/edit-user';

const User = (props: any) => {
  console.log(props)
  const id = props?.location?.state?.id;
  const { t } = useTranslation();
  return <AddUser />
};

export default User;
