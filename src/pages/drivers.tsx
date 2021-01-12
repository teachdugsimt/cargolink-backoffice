import React from 'react';
import { useTranslation } from 'react-i18next';
import DriverForApproval from '../components/carrier/drivers/driver-for-approval';

const Drivers = () => {
  const { t } = useTranslation();
  return <DriverForApproval />;
};
export default Drivers;
