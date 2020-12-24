import React from 'react';
import SEO from '../components/seo';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import ChartCar from '../components/dashboard/chart-car/chart-car';
import ChartArea from '../components/dashboard/chart-car-area/chart-area';
import ChartRegion from '../components/dashboard/chart-region/chart-region';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Card size="Large">
        <CardHeader>
          <span style={{ fontSize: 20 }}>{t('dashboard')}</span>
        </CardHeader>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <CardBody>
            <span style={{ fontSize: 20, marginBottom: 20 }}>{t('truckstype')}</span>
            <ChartArea />
          </CardBody>
          <CardBody>
            <span style={{ fontSize: 20, marginBottom: 20 }}>{t('JobsRegion')}</span>
            <ChartRegion />
          </CardBody>
        </div>
      </Card>
    </div>
  );
};
export default Home;
