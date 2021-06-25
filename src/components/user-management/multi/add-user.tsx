import React, { useState, Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { useTranslation } from 'react-i18next';
import { Input, Button as MaterialButton, InputAdornment, IconButton } from '@material-ui/core';
// import { Button } from '@paljs/ui/Button';
import Button from '@atlaskit/button/standard-button';
import { navigate } from 'gatsby';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { upload } from 'react-icons-kit/ikons/upload';
import { ic_person } from 'react-icons-kit/md/ic_person';
import { ic_phone } from 'react-icons-kit/md/ic_phone';
import { ic_lock } from 'react-icons-kit/md/ic_lock';
import { ic_email } from 'react-icons-kit/md/ic_email';
import { eye } from 'react-icons-kit/fa/eye';
import { eyeSlash } from 'react-icons-kit/fa/eyeSlash';
import Form, { ErrorMessage, Field, FormFooter, ValidMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { RadioGroup } from '@atlaskit/radio';
import { OptionsPropType } from '@atlaskit/radio/types';
import UploadButton from '../../UploadButton';
import { CreateUserPayload } from '../../../services/user-api';
import { UploadFileStore } from '../../../stores/upload-image-store';

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

  // const onSubmit = data => console.log(data);

  const userTypeOptions: OptionsPropType = [
    { name: 'userType', value: 'shipper', label: t('shipper') },
    { name: 'userType', value: 'Carrier', label: t('carrier') },
    { name: 'userType', value: 'both', label: t('both') },
  ];

  const legalTypeOptions: OptionsPropType = [
    { name: 'legalType', value: 'individual', label: t('individual') },
    { name: 'legalType', value: 'company', label: t('company') },
  ];

  useEffect(() => {
    return () => {
      setShowPassword(false);
      setPassword('');
      setConfirmPassword('');
      setFile({});
      setValidatePassword(false);
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
    console.log('form state', formState);
    const payload: CreateUserPayload = {
      ...formState,
      userType: 0,
    }
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) UploadFileStore.uploadFile();
  };

  return (
    <div>
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('addNewAccount')}</span>
        </div>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps} name="add-user" style={FormStyled}>
              <Row style={RowStyled}>
                <Col breakPoint={{ xs: 12, sm: 6, md: 6 }}>
                  <Field
                    label={t('legalType')}
                    isRequired
                    name="legalType"
                    // validate={validate}
                    defaultValue=""
                  >
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <div id="create-user-legal-type" style={{ display: 'flex', flexDirection: 'row' }}>
                        <RadioGroup
                          options={legalTypeOptions}
                          // onChange={onChange}
                          onChange={(event: any) => fieldProps.onChange(event)}
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
                        />
                        {error === 'INCORRECT_PHRASE' && (
                          <ErrorMessage>Incorrect, try &lsquo;open sesame&rsquo;</ErrorMessage>
                        )}
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
                    <Button type="submit" style={BottomSubmitStyled}>
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
