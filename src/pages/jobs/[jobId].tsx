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
import RouteEditWidget from '../../components/route/widgets/route-edit';
import { LoadingButton } from '@atlaskit/button';
import styled from 'styled-components';
import { PostJobParams } from '../../services/job-api';

const JobItem = observer((props: any) => {
  const { t } = useTranslation();
  const { jobStore } = useMst();

  const { currentJob } = jobStore;

  useEffect(() => {
    console.log(props.jobId);

    jobStore.getJobById({ jobId: props.jobId });
    return () => {
      jobStore.clearJobDetail();
    };
  }, []);

  const onSubmit = (data: Partial<PostJobParams | any>): void => {
    console.log('data :>> ', data);
    jobStore.updateJob(props.jobId, data);
  }

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
        <GridColumn medium={12}>
          <LoadingButton
            style={{ width: '20%', marginBottom: 20 }}
            spacing="compact"
            testId="sendNotiButton"
            isLoading={jobStore.tmpNotificationJobId == props.jobId && jobStore.notificationLoading}
            appearance="primary"
            onClick={() => jobStore.sendNotification(props.jobId)} sizes={'small'}>
            {t("sendNotification")}
          </LoadingButton>
        </GridColumn>
      </Grid>

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
            onSubmit={onSubmit}
          />
          <hr />
          <TruckWidget
            title={'รถที่ต้องการ'}
            truckType={currentJob?.truckType}
            tipper={currentJob?.tipper}
            truckAmount={currentJob?.requiredTruckAmount}
            onSubmit={onSubmit}
          />
        </GridColumn>

        <GridColumn medium={6}>
          <RouteEditWidget
            from={currentJob?.from}
            to={currentJob?.to}
            status={currentJob?.status}
            onSubmit={onSubmit}
          />
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
