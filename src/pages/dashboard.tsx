import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import ChartCar from '../components/dashboard/chart-car/chart-car';
import ChartArea from '../components/dashboard/chart-car-area/chart-area';
import ChartRegion from '../components/dashboard/chart-region/chart-region';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  // useEffect(() => {
  //   const data = localStorage.getItem('rootState');
  //   console.log('data : >>', data);
  // }, [])
  return (
    <div>
      <Card size="Large">
        <CardHeader>
          <span style={{ fontSize: 20 }}>{t('dashboard')}</span>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 20, marginBottom: 20 }}>{t('truckstype')}</span>
            <ChartArea />
            <span style={{ fontSize: 20, marginBottom: 20 }}>{t('JobsRegion')}</span>
            <ChartRegion />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default Home;
