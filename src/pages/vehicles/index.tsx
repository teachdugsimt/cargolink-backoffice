import React from 'react';
import { useTranslation } from 'react-i18next';
import TrucksListComponent from '../../components/truck/list';

const Trucks = () => {
  const { t } = useTranslation();
  return (
    <div>
      <TrucksListComponent />
    </div>
  );
};
export default Trucks;
