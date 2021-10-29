import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../stores/root-store';
import { Grid, GridColumn } from '@atlaskit/page';
import TruckTypeWidget from '../../components/truck/widgets/truck-type';
import TruckWidget from '../../components/truck/widgets/truck';

import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import TruckGalleryWidget from '../../components/truck/widgets/truck-gallery';

const TruckInfo = observer((props: any) => {
  const { t } = useTranslation();
  const { truckStore } = useMst();
  const { currentTruck } = truckStore;

  useEffect(() => {
    truckStore.getTruckById({ truckId: props.truckId });
  }, []);

  useEffect(() => {
    let tmpCurrentTruck = JSON.parse(JSON.stringify(truckStore.currentTruck))
    console.log(`🚀  ->  tmpCurrentTruck`, tmpCurrentTruck);
  }, [truckStore.currentTruck])


  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem onClick={() => navigate('/vehicles')} text={t('vehicle.management')} key="vehicle-management" />
      <BreadcrumbsItem text={t('vehicle.info')} key="vehicle-info" />
    </Breadcrumbs>
  );
  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs}>{t('vehicle.info')}</PageHeader>
      <Grid layout="fluid" spacing="compact">
        <GridColumn medium={6}>
          <TruckWidget
            title={currentTruck?.id}
            truckType={currentTruck?.truckType}
            tipper={currentTruck?.tipper}
            stallHeight={currentTruck?.stallHeight}
            // truckAmount={currentTruck?.requiredTruckAmount}
            loadingWeight={currentTruck?.loadingWeight}
            registrationNumber={currentTruck?.registrationNumber}
          />
        </GridColumn>

        <GridColumn medium={6}>
          <TruckGalleryWidget truckPhotos={currentTruck?.truckPhotos} id={currentTruck?.id}/>
        </GridColumn>
      </Grid>
    </>
  );
});

export default TruckInfo;
