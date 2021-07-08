import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import ChartCar from '../components/dashboard/chart-car/chart-car';
import ChartArea from '../components/dashboard/chart-car-area/chart-area';
import ChartRegion from '../components/dashboard/chart-region/chart-region';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';

const Summary = styled.div`
  height: 100px;
  width: 220px;
  border-radius: 10px;
  background: linear-gradient(128deg,
    ${props => props.orange ? '#fad961' :
    props.purple ? '#c56cd6' :
      props.blue ? '#15f5fd' :
        props.pink ? '#f36265' : 'white'} 0%,
    ${props => props.orange ? '#f76b1c' :
    props.purple ? '#3425af' :
      props.blue ? '#036cda' :
        props.pink ? '#961276' : 'white'} 100%);
  margin-right: 20px;
  margin-bottom: 20px;
  padding: 5px 10px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Home = () => {
  const { t } = useTranslation();

  // useEffect(() => {
  //   const data = localStorage.getItem('rootState');
  //   console.log('data : >>', data);
  // }, [])
  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem text={t('dashboard')} key="user-info" />
    </Breadcrumbs>
  );

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('dashboard')}</PageHeader>
      <Row>
        <Summary pink>รถใหม่</Summary>
        <Summary purple></Summary>
        <Summary blue></Summary>
        <Summary orange></Summary>
      </Row>
      {/* <Card> */}
      {/* <CardHeader>
        <span style={{ fontSize: 20 }}>{t('dashboard')}</span>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
          <span style={{ fontSize: 20, marginBottom: 20 }}>{t('truckstype')}</span>
          <ChartArea />
          <span style={{ fontSize: 20, marginBottom: 20 }}>{t('JobsRegion')}</span>
          <ChartRegion />
        </div>
      </CardBody> */}
      {/* </Card> */}
    </div>
  );
};
export default Home;
