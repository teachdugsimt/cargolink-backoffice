import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../stores/root-store';

import { navigate } from 'gatsby';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { Grid, GridColumn } from '@atlaskit/page';
import UserProfile from '../../components/user-management/widgets/profile';
import ProductWidget from '../../components/products/widgets/product';
import TruckWidget from '../../components/truck/widgets/truck';
import RouteWidget from '../../components/route/widgets/route';

import styled from 'styled-components';

const JobItem = observer((props: any) => {
  const { t } = useTranslation();
  const { jobStore } = useMst();

  const { currentJob } = jobStore;

  useEffect(() => {
    console.log(props.jobId);

    jobStore.getJobById({ jobId: props.jobId });
    return () => {};
  }, []);

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem onClick={() => navigate('/jobs')} text={t('job.management')} key="job-management" />
      <BreadcrumbsItem text={t('job.info')} key="job-info" />
    </Breadcrumbs>
  );

  console.log('currentJob :> ', JSON.parse(JSON.stringify(currentJob)));

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs}>{t('job.info')}</PageHeader>
      <Grid layout="fluid" spacing="compact">
        <GridColumn medium={6}>
          <UserProfile
            fullname={currentJob?.owner?.fullName}
            telno={currentJob?.owner?.mobileNo}
            email={currentJob?.owner?.email}
          />
          <hr />
          <ProductWidget
            productName={currentJob?.productName}
            productType={currentJob?.productTypeId}
            price={currentJob?.price}
            priceType={currentJob?.priceType}
            weight={currentJob?.weight}
          />
          <hr />
          <TruckWidget
            truckType={currentJob?.truckType}
            tipper={currentJob?.tipper}
            truckAmount={currentJob?.requiredTruckAmount}
          />
        </GridColumn>

        <GridColumn medium={6}>
          <RouteWidget from={currentJob?.from} to={currentJob?.to} status={currentJob?.status} />
        </GridColumn>
      </Grid>
    </>
  );
});

export default JobItem;

const Box = styled.div`
  background-color: #eee;
  padding: 15px;
  margin-bottom: 20px;
`;
