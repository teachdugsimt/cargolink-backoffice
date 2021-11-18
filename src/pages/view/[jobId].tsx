import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../stores/root-store';
import { Grid, GridColumn } from '@atlaskit/page';
import ProductShowWidget from '../../components/products/widgets/product-only-show';
import TruckWidget from '../../components/truck/widgets/truck';
import RouteWidget from '../../components/route/widgets/route';
import { useLiff } from 'react-liff';
import styled from 'styled-components';
import { LoadingButton } from '@atlaskit/button';
import { color } from '../../theme';
import { JobViewStore } from '../../stores/job-view-store';
import { Icon } from 'react-icons-kit'
import { phone } from 'react-icons-kit/icomoon/phone'
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import TruckShowWidget from '../../components/truck/widgets/truck-onlyshow';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { CreateUserLineLiff } from '../../services/user-api';
import { CSSProperties } from '@theme-ui/css';

const BUTT_CONTAINER: CSSProperties = { display: 'flex', justifyContent: 'center', marginLeft: -10 }

const TEXT_BUTT_STYLE: CSSProperties = {
  display: 'flex',
  flex: 1,
  height: 40,
  alignItems: 'center', justifyContent: 'center'
}

const BUTT_STYLE: CSSProperties = {
  width: '50%',
  backgroundColor: color.primary,
  margin: '0px 0px 20px 0px', height: 40
}

const SUBMIT_BUTT: CSSProperties = {
  width: '90%',
  height: 40,
  marginTop: 20,
  marginBottom: 20,
  backgroundColor: color.primary
}

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

  const { error, liff, isLoggedIn, ready } = useLiff();
  const [lineProfile, setlineProfile] = useState<LineProfile>({})
  const [showForm, setShowForm] = useState<boolean>(false)
  const { register, handleSubmit, errors, control } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: null,
      phoneNumber: null,
    },
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      const profile = await liff.getProfile();
      setlineProfile(profile);
    })();
  }, [liff, isLoggedIn]);

  const getTruckTypeGroup = async () => {
    await versatileStore.find()
  }

  useEffect(() => {

    // รายละเอียดงานขนส่ง
    var node = document.querySelector('title');
    if(node){
      node.textContent = t("jobDetailTransport")
    }
    console.log("NODE TITLE :: ", node)

    console.log(props.jobId);
    if (!versatileStore.list || !versatileStore.listDropdown) getTruckTypeGroup()

    jobStore.getJobById({ jobId: props.jobId || "DLG9J8KX" });
    return () => {
      setShowForm(false)
      JobViewStore.clearCheckLine()
      JobViewStore.clearSaveUser()
      JobViewStore.clearError()
    };
  }, []);

  const telCargolink = () => {
    let cssTel: any = document.querySelector("#trigger-phone")
    if (cssTel) cssTel.click()
  }

  const _bookingJob = async () => {
    await JobViewStore.checkLineAccount({
      lineId: lineProfile?.userId || "",
      jobId: props.jobId
    })

    let dataCheckingLine = JobViewStore.checkLine
    if (dataCheckingLine?.isCall == true) {
      JobViewStore.clearCheckLine()
      telCargolink()
    } else {
      // no this line in DB
      setShowForm(true)
    }

  }
  const onSubmit = (data: { name?: string | null, phoneNumber?: string | null }) => {
    console.log("ON submit data :: ", data)

    let input: any = document.querySelector("#name")
    let phone: any = document.querySelector("#phoneNumber")
    if (input) input.blur();
    if (phone) phone.blur();



    let finalData: CreateUserLineLiff = {
      fullName: data?.name || "-",
      phoneNumber: (data?.phoneNumber ? ("+66" + data?.phoneNumber.substring(1)) : "-") || "-",
      jobId: props.jobId,
      lineId: lineProfile?.userId || "-"
    }
    JobViewStore.createUserWithLine(finalData)
  }

  useEffect(() => {
    let tmpSaveUser = JobViewStore.saveUser
    if (tmpSaveUser) {
      JobViewStore.clearSaveUser()
      setShowForm(false)
      telCargolink()
    }
  }, [JSON.stringify(JobViewStore.saveUser)])

  console.log('currentJob :> ', JSON.parse(JSON.stringify(currentJob)));

  const Required = <span style={{ color: '#FF3D71' }}>*</span>;

  const formValue = control.getValues()

  return (
    <>
      {/* <PageHeader breadcrumbs={breadcrumbs}>{t('job.info')}</PageHeader> */}
      {/* {lineProfile?.pictureUrl && <img src={lineProfile?.pictureUrl} style={{ width: 50, height: 50, borderRadius: 25 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: 20 }}>
        <span>userId : {lineProfile?.userId || "-"}</span>
        <span>displayName : {lineProfile?.displayName || "-"}</span>
        <span>statusMessage : {lineProfile?.statusMessage || "-"}</span>
        <span>email : {lineProfile?.email || '-'}</span>
        <span>Full profile : {lineProfile ? JSON.stringify(lineProfile) : "-"}</span>
        <span>jobId : {props.jobId || "-"}</span>
      </div> */}

      <Grid layout="fluid" spacing="compact">

        {lineProfile && lineProfile?.userId && <GridColumn medium={12}>
          {!showForm && <Col breakPoint={{ xs: 12, lg: 12 }} style={BUTT_CONTAINER}><LoadingButton
            style={BUTT_STYLE}
            spacing="compact"
            testId="uploadButton"
            isLoading={JobViewStore.loading}
            appearance="primary"
            iconBefore={<Icon size={22} icon={phone} style={{ color: color.black }} />}
            isDisabled={lineProfile?.userId && props.jobId ? false : true}
            onClick={_bookingJob}
          >
            <div style={TEXT_BUTT_STYLE}>
              <span style={{ color: color.black }}>{t("job.bookJob")}</span>
            </div>
          </LoadingButton>
            <a id="trigger-phone" href={`tel:${JobViewStore.phoneNumber}`}></a>
          </Col>}
          {showForm && <>
            <form onSubmit={handleSubmit(onSubmit)} className="form-add-data" style={{ marginLeft: -12.5 }}>
              <Row>
                <Col breakPoint={{ xs: 12, lg: 12 }}>
                  <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
                    <p>
                      {t('fullName')} {Required}
                    </p>
                    <input
                      id="name"
                      className="new-input-component"
                      name="name"
                      type="text"
                      style={{
                        borderColor: errors.name ? '#ff3d71' : '', width: '90%'
                      }}
                      ref={register({ required: true })}
                      aria-invalid={errors.name ? 'true' : 'false'}
                    />
                    {errors.name && (
                      <span id="fieldName" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                        {t('errorProfile.inputName')}
                      </span>
                    )}
                  </Col>

                  <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
                    <p>
                      {t('contactNumber')} {Required}
                    </p>
                    <input
                      id="phoneNumber"
                      className="new-input-component"
                      name="phoneNumber"
                      type="text"
                      style={{
                        borderColor: errors.phoneNumber ? '#ff3d71' : '', width: '90%'
                      }}
                      ref={register({ required: true, pattern: /^\(?([0]{1})\)?([0-9]{8,10})$/ })}
                      aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                    />
                    {errors.phoneNumber && (
                      <span id="fieldPhoneNumber" style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
                        {t('errorProfile.inputPhoneNumber')}
                      </span>
                    )}
                  </Col>
                  <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
                    <LoadingButton
                      style={SUBMIT_BUTT}
                      spacing="compact"
                      testId="submit-form-line"
                      isLoading={JobViewStore.loading}
                      appearance="primary"
                      isDisabled={formValue?.name && formValue?.phoneNumber ? false : true}
                      onClick={handleSubmit(onSubmit)}
                    >
                      <div style={TEXT_BUTT_STYLE}>
                        <span style={{ color: color.black }}>{t("submit")}</span>
                      </div>
                    </LoadingButton>
                    <a id="trigger-phone" href={`tel:${JobViewStore.phoneNumber}`}></a>
                  </Col>
                </Col>
              </Row>
            </form>
          </>}
        </GridColumn>}

        <GridColumn medium={12}>
          {/* <UserProfile
            fullname={currentJob?.owner?.fullName}
            telno={currentJob?.owner?.mobileNo}
            email={currentJob?.owner?.email}
          /> */}
          {/* <hr /> */}
          <ProductShowWidget
            productName={currentJob?.productName}
            productType={currentJob?.productTypeId}
            price={currentJob?.price}
            priceType={currentJob?.priceType}
            weight={currentJob?.weight}
          />
          <hr />
          <TruckShowWidget
            title={'รถที่ต้องการ'}
            truckType={currentJob?.truckType}
            tipper={currentJob?.tipper}
            truckAmount={currentJob?.requiredTruckAmount}
          />
        </GridColumn>

        <GridColumn medium={12}>
          <RouteWidget from={currentJob?.from} to={currentJob?.to} status={currentJob?.status} disabled={true} />
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








































