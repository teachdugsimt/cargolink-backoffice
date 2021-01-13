import React from 'react';
import { useTranslation } from 'react-i18next';
import TruckForApproval from '../components/Carrier/Trucks/truck-for-approval';

const Trucks = () => {
  const { t } = useTranslation();
  return (
    <div>
      <TruckForApproval />
    </div>
  );
};
export default Trucks;
