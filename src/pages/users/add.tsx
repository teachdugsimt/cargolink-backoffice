import React, { useState, Fragment, useEffect, CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { CardBody } from '@paljs/ui/Card';
import { useTranslation } from 'react-i18next';
import Button from '@atlaskit/button/standard-button';
import { navigate } from 'gatsby';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { ic_person } from 'react-icons-kit/md/ic_person';
import { ic_phone } from 'react-icons-kit/md/ic_phone';
import { ic_lock } from 'react-icons-kit/md/ic_lock';
import { ic_email } from 'react-icons-kit/md/ic_email';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { RadioGroup } from '@atlaskit/radio';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { OptionsPropType } from '@atlaskit/radio/types';

import UploadButton from '../../components/UploadButton';
import userApi, { CreateUserPayload, CreateUserResponse } from '../../services/user-api';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import { useWindowSize, breakPoints } from '../../utils';
import { Property } from 'csstype';
import { useMst } from '../../stores/root-store';
import { UploadFilePath } from '../../services/upload-api';

interface Props {}
interface FileProps {
  lastModified?: number;
  lastModifiedDate?: string;
  name?: string;
  size?: number;
  type?: string;
  webkitRelativePath?: string;
}

interface InputData {
  // confirmPassword: string;
  fullName: string;
  // password: string;
  phoneNumber: string;
  uploadFile?: string;
  email?: string;
  userType?: string;
}

const ShowFileName = styled.p`
  padding-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BackText = styled.span`
  color: #fbbc12;
`;

const SubmitText = styled.span`
  color: #000;
`;

const BottomStyled = {
  margin: '0 6px',
};

const BottomBackStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: 'transparent',
};

const BottomSubmitStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: '#FBBC12',
};

const startAdornmentIcon = (iconName: 'user' | 'phone' | 'password' | 'email') => {
  let icon = '';
  if (iconName === 'user') {
    icon = ic_person;
  } else if (iconName === 'phone') {
    icon = ic_phone;
  } else if (iconName === 'email') {
    icon = ic_email;
  } else {
    icon = ic_lock;
  }
  return <Icon icon={icon} style={{ paddingLeft: 6, color: 'gray' }} size={22} />;
};

const AddUser: React.FC<Props> = observer(() => {
  const { uploadFileStore } = useMst();
  const { t } = useTranslation();

  const [file, setFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [legalType, setLegalType] = useState<'INDIVIDUAL' | 'JURISTIC'>('INDIVIDUAL');
  const [userType, setUserType] = useState<'SHIPPER' | 'CARRIER' | 'BOTH'>('SHIPPER');
  const [attachCodes, setAttachCodes] = useState<string[]>([]);
  const [width] = useWindowSize();

  // const onSubmit = data => console.log(data);

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => {}}>
      <BreadcrumbsItem onClick={() => navigate('/user-management')} text={t('userManagement')} key="user-management" />
      <BreadcrumbsItem text={t('addNewAccount')} key="user-info" />
    </Breadcrumbs>
  );

  const legalTypeOptions: OptionsPropType = [
    { name: 'legalType', value: 'INDIVIDUAL', label: t('individualShort'), testId: 'individualItem' },
    { name: 'legalType', value: 'JURISTIC', label: t('juristic'), testId: 'juristicItem' },
  ];

  const userTypeOptions: any = [
    {
      label: t('userTypeGroup.SHIPPER'),
      value: 'SHIPPER',
      testId: 'shipperItem',
      name: 'shipper',
    },
    {
      label: t('userTypeGroup.CARRIER'),
      value: 'CARRIER',
      testId: 'carrierItem',
      name: 'carrier',
    },
    {
      label: t('userTypeGroup.BOTH'),
      value: 'BOTH',
      testId: 'bothItem',
      name: 'both',
    },
  ];

  useEffect(() => {
    uploadFileStore.clear();
    return () => {
      setPhoneError(false);
      setPhoneNumber('');
    };
  }, []);

  const handleSubmit = (formState: InputData) => {
    const payload: CreateUserPayload = {
      fullName: formState.fullName,
      email: formState.email,
      userType,
      phoneNumber: `+66${phoneNumber.substr(1)}`,
      legalType,
      url: attachCodes,
    };
    console.log('Payload :: ', payload);
    const MODAL_TIMEOUT = 1000;
    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
        userApi
          .createUser(payload)
          .then((response) => {
            if (response && response.status < 300) {
              Swal.hideLoading();
              const data = (response as AxiosResponse<CreateUserResponse>).data;
              console.log('edit user response', data);
              Swal.update({
                icon: 'success',
                titleText: '',
                text: t('createUserSuccess'),
                showConfirmButton: false,
              });
              return setTimeout(() => {
                Swal.close();
                navigate('/user-management');
              }, MODAL_TIMEOUT);
            } else {
              Swal.fire({
                icon: 'error',
                text: t('createUserErrorByUser'),
              });
              console.error('create user: user error', response);
            }
          })
          .catch((error) => {
            console.error('Error while create the user', error);
            Swal.fire({
              icon: 'error',
              text: 'Error while create this user',
            });
          });
      },
    });
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setIsUploading(true);
      uploadFileStore.uploadFile(UploadFilePath.USER_DOC, file);
    }
  };

  const validatePhoneNumber = (value?: string) => {
    if (value && value.startsWith('0')) value = `+66${value.substr(1)}`;
    const regex = /^\+?([0-9]{2})\)??([0-9]{9})$/;
    return value ? (regex.test(value) ? undefined : 'INVALID_PHONE_NUMBER') : undefined;
  };

  const isDisabled = phoneError || !phoneNumber.length ? true : false || isUploading;

  useEffect(() => {
    if (phoneNumber) {
      const isInvalid = validatePhoneNumber(`+66${phoneNumber.substr(1)}`);
      setPhoneError(isInvalid ? true : false);
    }
  }, [phoneNumber]);
  useEffect(() => {
    const newFile = JSON.parse(JSON.stringify(uploadFileStore.file));
    const isNoFile = newFile == null || Object.keys(newFile).every((key) => newFile[key] == null);
    if (!isNoFile) {
      setAttachCodes([...attachCodes, newFile.attachCode]);
      setIsUploading(false);
      uploadFileStore.clear();
    }
  }, [uploadFileStore.file]);
  const windowMode = width > breakPoints.md ? 'lg' : 'sm';
  const fieldItemStyle = (size: 'full' | 'half'): CSSProperties => {
    let width: Property.Width = 'calc(100% - 1rem)';
    if (windowMode === 'lg') {
      if (size === 'half') width = 'calc(50% - 1rem)';
    }
    return {
      display: 'flex',
      justifyContent: 'flex-start',
      width,
      margin: '0 .5rem',
    };
  };
  const groupItemsStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    // flexWrap: 'wrap',
    // margin: '0 -.5rem',
  };
  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('addNewAccount')}</PageHeader>

      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps} name="add-user" style={{ overflow: 'hidden' }}>
            <div style={groupItemsStyle}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <Field label={t('legalType')} isRequired name="legalType">
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <div id="create-user-legal-type" style={{ display: 'flex', flexDirection: 'row' }}>
                        <RadioGroup
                          value={legalType}
                          options={legalTypeOptions}
                          onChange={(event: any) => setLegalType(event.target.value)}
                        />
                      </div>
                    )}
                  </Field>
                </div>

                <div style={{ paddingLeft: 20 }}>
                  <Field label={t('userType')} isRequired name="userType">
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <div id="create-user-type" style={{ display: 'flex', flexDirection: 'row' }}>
                        <RadioGroup
                          value={userType}
                          options={userTypeOptions}
                          onChange={(event: any) => setUserType(event.target.value)}
                        />
                      </div>
                    )}
                  </Field>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Field
                    label={`${t('fullName')} / ${t('companyName')}`}
                    isRequired
                    name="fullName"
                    // validate={validate}
                    defaultValue=""
                  >
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <Fragment>
                        <Textfield
                          {...fieldProps}
                          elemBeforeInput={startAdornmentIcon('user')}
                          placeholder={`${t('fullName')} / ${t('companyName')}`}
                          testId="nameField"
                        />
                        {error === 'INCORRECT_PHRASE' && (
                          <ErrorMessage>Incorrect, try &lsquo;open sesame&rsquo;</ErrorMessage>
                        )}
                      </Fragment>
                    )}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <Field
                    label={t('phoneNumber')}
                    isRequired
                    name="phoneNumber"
                    // validate={validate}
                    defaultValue=""
                  >
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <Fragment>
                        <Textfield
                          {...fieldProps}
                          elemBeforeInput={startAdornmentIcon('phone')}
                          placeholder={t('phoneNumber')}
                          value={phoneNumber}
                          onChange={(e: any) => setPhoneNumber(e.target.value)}
                          style={{ width: '100%' }}
                          testId="phoneNumberField"
                        />
                        {phoneError && <ErrorMessage>{t('invalidPhoneNumber')}</ErrorMessage>}
                      </Fragment>
                    )}
                  </Field>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Field label={t('email')} name="email">
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <div style={{ display: 'flex' }}>
                        <Textfield
                          {...fieldProps}
                          elemBeforeInput={startAdornmentIcon('email')}
                          placeholder={t('email')}
                          testId="emailField"
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}></div>
              </div>
              {/* </div> */}

              <div
                style={{
                  marginTop: 20,

                  // borderTop: '1px solid #D8D8D8',
                }}
              >
                <Field
                  label={`${t('citizenId')} / ${t('companyCertificate')}`}
                  name="uploadFile"
                  // validate={validate}
                  defaultValue=""
                >
                  {({ fieldProps, error, meta: { valid } }: any) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <UploadButton accept=".pdf" onChange={handleUploadFile} isLoading={uploadFileStore.loading} />
                      <ShowFileName>{(!isUploading && file?.name) || ''}</ShowFileName>
                    </div>
                  )}
                </Field>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 -.5rem', marginTop: '2rem' }}></div>
              <FormFooter>
                <Button type="button" style={BottomBackStyled} onClick={() => navigate('/users')} testId="backButton">
                  <BackText>{t('back')}</BackText>
                </Button>
                <Button
                  type="submit"
                  isDisabled={isDisabled}
                  style={
                    isDisabled
                      ? {
                          ...BottomSubmitStyled,
                          backgroundColor: '#D8D8D8',
                          border: 'none',
                        }
                      : BottomSubmitStyled
                  }
                  testId="submitButton"
                >
                  <SubmitText>{t('confirm')}</SubmitText>
                </Button>
              </FormFooter>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
});

export default AddUser;
