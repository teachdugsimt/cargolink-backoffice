import React from 'react';
import SEO from '../components/SEO';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import ChartCar from '../components/Dashboard/Chartcar/ChartCar';
import ChartArea from '../components/Dashboard/ChartCarArea/ChartArea';
import ChartRegion from '../components/Dashboard/ChartRegion/ChartRegion';
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
