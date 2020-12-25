import React from 'react';
import About from '../components/new-profile/about';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t('profile')}</h1>
      <About />
    </>
  );
};
export default Profile;