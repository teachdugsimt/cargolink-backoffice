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
        {/* <SEO title="Home" /> */}
        <CardHeader>
          <span style={{ fontSize: 20 }}>{t('truckstype')}</span>
        </CardHeader>
        <CardBody>
          <ChartCar />
        </CardBody>
      </Card>
      <Card size="Large">
        <CardHeader>
          <span style={{ fontSize: 20 }}>{t('truckRegion')}</span>
        </CardHeader>
        <CardBody>
          <ChartArea />
        </CardBody>
      </Card>
      <Card size="Large">
        <CardHeader>
          <span style={{ fontSize: 20 }}>{t('JobsRegion')}</span>
        </CardHeader>
        <CardBody>
          <ChartRegion />
        </CardBody>
      </Card>
    </div>
  );
};
export default Home;
