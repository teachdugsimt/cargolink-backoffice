import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import TrucksPosted from '../components/Carrier/Trucks/TrucksPosted/TrucksPosted';
import TruckForApproval from '../components/Carrier/Trucks/TruckForApproval/TruckForApproval';

const Trucks = () => {
  const { t } = useTranslation();
  return (
    <div>
      <TrucksPosted />
      <TruckForApproval />
    </div>
  );
};
export default Trucks;
