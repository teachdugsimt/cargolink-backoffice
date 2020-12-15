import React from 'react';
import { useTranslation } from 'react-i18next';

const Drivers = () => {
  const { t } = useTranslation();
  return (
    <div style={{ backgroundColor: '#fff', width: '100%', height: '100%', padding: 20 }}>
      <h1>{t('drivers')}</h1>
    </div>
  );
};
export default Drivers;
