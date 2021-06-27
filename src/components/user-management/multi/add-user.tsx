import React, { useState, Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CardBody } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { useTranslation } from 'react-i18next';
// import { Button } from '@paljs/ui/Button';
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
import { OptionsPropType } from '@atlaskit/radio/types';
import UploadButton from '../../UploadButton';
import userApi, { CreateUserPayload, CreateUserResponse } from '../../../services/user-api';
import { UploadFileStore } from '../../../stores/upload-file-store';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';

interface Props { }
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
  // userType: string;
}

const ButtonStyled = styled.div`
  display: flex;
  justifycontent: flex-end;
`;

const UploadStyled = styled.span`
  display: flex;
  align-item: center;
  justify-content: center;
`;

const TextUpload = styled.span`
  padding-left: 6px;
  padding-top: 2px;
`;

const ShowFileName = styled.p`
  padding-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ValidatePassword = styled.p`
  margin: 0;
  color: red;
`;

const BackText = styled.span`
  color: #fbbc12;
`;

const SubmitText = styled.span`
  color: #000;
`;

const RowStyled = {
  padding: '8px 8px 12px 8px',
};

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

const FormStyled = {
  paddingLeft: 15,
  paddingRight: 15,
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

const validate = (value: unknown) => {
  if (value !== 'open sesame') {
    return 'INCORRECT_PHRASE';
  }
  return undefined;
};

const AddUser: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  // const { control, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [file, setFile] = useState<FileProps>({});
  const [validatePassword, setValidatePassword] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [legalType, setLegalType] = useState<'INDIVIDUAL' | 'JURISTIC'>('INDIVIDUAL');

  // const onSubmit = data => console.log(data);

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/user-management')} text={t('userManagement')} key="user-management" />
      <BreadcrumbsItem text={t('addNewAccount')} key="user-info" />
    </Breadcrumbs>
  );

  const legalTypeOptions: OptionsPropType = [
    { name: 'legalType', value: 'INDIVIDUAL', label: t('individual') },
    { name: 'legalType', value: 'JURISTIC', label: t('company') },
  ];

  useEffect(() => {
    return () => {
      setShowPassword(false);
      setPassword('');
      setConfirmPassword('');
      setFile({});
      setValidatePassword(false);
      setPhoneError(false);
      setPhoneNumber('');
    };
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleValidatePassword = () => {
    if (password !== confirmPassword && password && confirmPassword) {
      setValidatePassword(true);
    } else {
      setValidatePassword(false);
    }
  };

  const handleSubmit = (formState: InputData) => {
    const payload: CreateUserPayload = {
      ...formState,
      userType: 0,
      phoneNumber: `+66${phoneNumber.substr(1)}`,
    };
    userApi
      .createUser(payload)
      .then((response) => {
        if (response && response.status < 300) {
          const data = (response as AxiosResponse<CreateUserResponse>).data;
          console.log('edit user response', data);
          return navigate('/user-management');
        } else console.error('Unexpected error while loading user', response);
      })
      .catch((error) => {
        console.error('Error while create the user', error);
        Swal.fire({
          icon: 'error',
          text: 'Error while create this user',
        });
      });
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) UploadFileStore.uploadFile();
  };

  const validatePhoneNumber = (value?: string) => {
    if (value && value.startsWith('0')) value = `+66${value.substr(1)}`;
    const regex = /^\+?([0-9]{2})\)??([0-9]{9})$/;
    return value ? (regex.test(value) ? undefined : 'INVALID_PHONE_NUMBER') : undefined;
  };

  const isDisabled = phoneError ? true : false;

  useEffect(() => {
    if (phoneNumber) {
      const isInvalid = validatePhoneNumber(`+66${phoneNumber.substr(1)}`);
      setPhoneError(isInvalid ? true : false);
    }
  }, [phoneNumber]);
  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('addNewAccount')}</PageHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps} name="add-user" style={FormStyled}>
              <Row style={RowStyled}>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
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
                </Col>
              </Row>
              <Row style={RowStyled}>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
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
                        />
                        {error === 'INCORRECT_PHRASE' && (
                          <ErrorMessage>Incorrect, try &lsquo;open sesame&rsquo;</ErrorMessage>
                        )}
                      </Fragment>
                    )}
                  </Field>
                </Col>

                <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
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
                        />
                        {phoneError && <ErrorMessage>{t('invalidPhoneNumber')}</ErrorMessage>}
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>

              <Row style={RowStyled}>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
                  <Field
                    label={t('email')}
                    name="email"
                  >
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <div style={{ display: 'flex' }}>
                        <Textfield
                          {...fieldProps}
                          elemBeforeInput={startAdornmentIcon('email')}
                          placeholder={t('email')}
                        />
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>

              {validatePassword && (
                <Row>
                  <Col style={{ textAlign: 'right' }}>
                    <ValidatePassword>{`** ${t('passwordNotMatch')}`}</ValidatePassword>
                  </Col>
                </Row>
              )}

              <Row style={RowStyled}>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
                  <Field
                    label={`${t('citizenId')} / ${t('companyCertificate')}`}
                    name="uploadFile"
                    // validate={validate}
                    defaultValue=""
                  >
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <UploadButton
                          accept=".pdf"
                          onChange={handleUploadFile} />
                        <ShowFileName>{file?.name || ''}</ShowFileName>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>

              <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Col>
                  <FormFooter>
                    <Button type="button" style={BottomBackStyled} onClick={() => navigate('/user-management')}>
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
                    >
                      <SubmitText>{t('confirm')}</SubmitText>
                    </Button>
                  </FormFooter>
                </Col>
              </Row>
            </form>
          )}
        </Form>
      </CardBody>
    </div>
  );
});

export default AddUser;
