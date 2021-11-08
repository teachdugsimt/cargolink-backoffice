import React, { useEffect, useState } from 'react';
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
import { LoadingButton } from '@atlaskit/button';
import liff from "@line/liff"
import styled from 'styled-components';

interface LineProfile {
  userId?: string | undefined
  displayName?: string | undefined
  // phoneNumber?: string | undefined
  pictureUrl?: string | undefined
  statusMessage?: string | undefined
  email?: string | undefined
}

const JobView = observer((props: any) => {
  const { t } = useTranslation();
  const { jobStore, versatileStore } = useMst();

  const { currentJob } = jobStore;

  const [lineProfile, setlineProfile] = useState<LineProfile>({})

  const getUserProfile = async () => {
    const profile = await liff.getProfile()
    setlineProfile(profile)
    console.log("Line profile :: ", profile)
  }

  const InitialLineLiff = async () => {
    liff.ready.then(() => {
      if (liff.isInClient()) {
        getUserProfile()
      }
    })
    await liff.init({ liffId: "1656270808-MA5RQ8gL" })
  }

  useEffect(() => {
    console.log(props.jobId);
    if (!versatileStore.list || !versatileStore.listDropdown) versatileStore.find()
    InitialLineLiff()
    jobStore.getJobById({ jobId: props.jobId || "DLG9J8KX" });
    return () => { };
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
      <h1>JOB VIEW</h1>
      {lineProfile?.pictureUrl && <img src={lineProfile?.pictureUrl} style={{ width: 50, height: 50, borderRadius: 25 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: 20 }}>
        <span>userId : {lineProfile?.userId || "-"}</span>
        <span>displayName : {lineProfile?.displayName || "-"}</span>
        <span>statusMessage : {lineProfile?.statusMessage || "-"}</span>
        <span>email : {lineProfile?.email || '-'}</span>
        <span>Full profile : {lineProfile ? JSON.stringify(lineProfile) : "-"}</span>
      </div>

      <Grid layout="fluid" spacing="compact">
        <GridColumn medium={12}>
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
            title={'รถที่ต้องการ'}
            truckType={currentJob?.truckType}
            tipper={currentJob?.tipper}
            truckAmount={currentJob?.requiredTruckAmount}
          />
        </GridColumn>

        <GridColumn medium={12}>
          <RouteWidget from={currentJob?.from} to={currentJob?.to} status={currentJob?.status} />
        </GridColumn>
      </Grid>
    </>
  );
});

export default JobView;

const Box = styled.div`
      background-color: #eee;
      padding: 15px;
      margin-bottom: 20px;
      `;
