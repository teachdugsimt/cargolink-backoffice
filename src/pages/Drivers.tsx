import React from 'react';
import { useTranslation } from 'react-i18next';
import DriverForApproval from '../components/Carrier/Drivers/DriverForApproval/DriverForApproval';

const Drivers = () => {
  const { t } = useTranslation();
  return (
    <>
      <DriverForApproval />
    </>
  );
};
export default Drivers;
