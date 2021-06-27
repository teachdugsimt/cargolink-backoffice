import React, { useState, Fragment, useEffect, CSSProperties, useCallback, ChangeEvent } from 'react';
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
import Form, { ErrorMessage, Field, FormFooter, ValidMessage } from '@atlaskit/form';
import { FormEdit } from '../../form-edit/form-edit';
import { ListFile } from '../../list-file/list-file';
import AutoCompleteTypeahead from '../../auto-complete-typeahead/auto-complete-typeahead';
import { save } from 'react-icons-kit/fa/save';
import Textfield from '@atlaskit/textfield';
import { camera } from 'react-icons-kit/fa/camera';
import { Checkbox } from '@atlaskit/checkbox';
import { close } from 'react-icons-kit/fa/close';
import { pencil } from 'react-icons-kit/fa/pencil';
import UploadButton from '../../UploadButton';
import Swal from 'sweetalert2';
import { IUserDTO, DocumentStatus } from '../../../stores/user-store';
import { useMst } from '../../../stores/root-store';
import { DateFormat } from '../../simple-data';
import { UserApi } from '../../../services';
import { UploadFileResponse } from '../../../services/upload-api';
import { EditUserPayload, EditUserResponse } from '../../../services/user-api';
import { AxiosResponse } from 'axios';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
interface Props {
  id?: number;
}

interface FileProps {
  lastModified?: number;
  lastModifiedDate?: string;
  name?: string;
  size?: number;
  type?: string;
  webkitRelativePath?: string;
}

interface InputData {
  confirmPassword: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  uploadFile?: string;
  userType: string;
}

interface AddressProps {
  district?: string;
  amphoe?: string;
  province?: string;
  zipcode?: number;
}

const TextUpload = styled.span`
  padding-left: 6px;
  padding-top: 2px;
`;

const ImageFram = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ImagePreview = styled.div`
  width: 120px;
  height: 120px;
  background-color: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
`;

const Name = styled.p`
  margin-bottom: 0;
  font-size: 1.125rem;
  font-weight: 700;
`;

const Address = styled.p`
  margin: 0;
  font-size: 1.025rem;
`;

const BackText = styled.span`
  color: #fbbc12;
`;

const SubmitText = styled.span`
  color: #000;
`;

const FormStyled: CSSProperties = {
  paddingLeft: 15,
  paddingRight: 15,
};

const AddressStyled: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const ADDRESS_WITH_CHECKBOX: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const ICON_STYLED: CSSProperties = {
  color: 'gray',
};

const BUTTON: CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  marginLeft: 12,
};

const BottomStyled: CSSProperties = {
  margin: '0 6px',
};

const BottomBackStyled: CSSProperties = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: 'transparent',
};

const BottomSubmitStyled: CSSProperties = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: '#FBBC12',
};

const IMAGE_PROFILE: CSSProperties = {
  width: 120,
  height: 'auto',
};

// const IMAGE_CONTAINER: CSSProperties = {
//   position: 'relative',
// }

const CAMERA: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: 'transparent',
  border: 'none',
  boxShadow: 'none',
  padding: 0,
  minWidth: 0,
};

const SPACE_ROW: CSSProperties = {
  paddingTop: 10,
  paddingBottom: 10,
};

const IMAGE_CONTAINER: CSSProperties = {
  ...SPACE_ROW,
  display: 'flex',
  justifyContent: 'center',
};

const EditUser: React.FC<Props> = observer((props: any) => {
  const { t } = useTranslation();
  const { userStore, loginStore, uploadFileStore } = useMst();
  // const { control, handleSubmit } = useForm();
  const [files, setFiles] = useState<UploadFileResponse[]>([]);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isOpenGeneralAddress, setIsOpenGeneralAddress] = useState<boolean>(false);
  const [isOpenDocumentAddress, setIsOpenDocumentAddress] = useState<boolean>(false);
  const [address, setAddress] = useState<AddressProps>({});
  const [userData, setUserData] = useState<IUserDTO | null>(null);

  // const onSubmit = data => console.log(data);
  const userId = props.id;
  type Fields = 'email' | 'legalType' | 'phoneNumber' | 'attachCode' | 'userType';

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/user-management')} text={t('userManagement')} key="user-management" />
      <BreadcrumbsItem text={t('userInfo')} key="user-info" />
    </Breadcrumbs>
  );

  const getUser = async (userId: string) => {
    UserApi.getUser(userId)
      .then((response) => {
        if (response && response.ok) {
          const user: IUserDTO = {
            ...response.data,
            phoneNumber: response.data.phoneNumber ? `0${response.data.phoneNumber.substr(3)}` : null,
          };
          setUserData(user);
        } else {
          console.error('Unexpected error while loading user', response);
        }
      })
      .catch((error) => {
        console.error('Error while loading this user', error);
        Swal.fire({
          icon: 'error',
          text: 'Error while loading this user',
        });
      });
  };

  useEffect(() => {
    if (!userId) navigate('/user-management');
    else getUser(userId);
    uploadFileStore.clear();

    return () => {
      setFiles([]);
      uploadFileStore.clear();
    };
  }, []);

  useEffect(() => {
    const newFile = JSON.parse(JSON.stringify(uploadFileStore.file));
    const isNoFile = newFile == null || Object.keys(newFile).every((key) => newFile[key] == null);
    if (!isNoFile) setFiles([...files, newFile]);
  }, [uploadFileStore.file]);

  useEffect(() => {
    const filesPayload = files
      .filter((file) => file && !Object.keys(file).every((key) => file[key] == null))
      .map((file) => file.attachCode);
    if (files.length && files != userData?.files) handleSave('attachCode', filesPayload);
  }, [files]);

  useEffect(() => {
    console.log('isChecked :>> ', isChecked);
  }, [isChecked]);

  const handleSubmit = (formState: InputData) => {
    console.log('form state', formState);
  };

  const handleSave = (field: Fields, value: any) => {
    console.log(field, ':>> ', value);
    const payload: Partial<EditUserPayload> = { [field]: value };
    UserApi.editUser(userId, payload)
      .then((response) => {
        if (response && response.ok) {
          const data = (response as AxiosResponse<EditUserResponse>).data;
          console.log('edit user response', data);
          return getUser(userId);
        } else console.error('Unexpected error while loading user', response);
      })
      .catch((error) => {
        console.error('Error while edit this user', error);
        Swal.fire({
          icon: 'error',
          text: 'Error while edit this user',
        });
      });
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    file && uploadFileStore.uploadFile('USER_DOC', file);
  };

  const handleDeleteFile = (id: number | string) => {
    console.log('file id :>> ', id);
  };

  // const handleAddress = () => {
  //   setIsOpenFormAddress(currentValue => !currentValue)
  // };

  const handleAddressValue = ({ district, amphoe, province, zipcode }: any) => {
    setAddress({
      district,
      amphoe,
      province,
      zipcode,
    });
  };

  const handleChaneImage = (event: any) => {
    event.preventDefault();
    if (event.target?.files?.length) {
      const previewImg = URL.createObjectURL(event.target.files[0]);
      setPreviewImage(previewImg);
      console.log('previewImg :>> ', previewImg);
    }
  };

  const handleCheckBox = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked((current) => !current);
  }, []);

  const handleConfirmAddress = () => {
    console.log('address :>> ', address);
  };

  const validateEmail = (value: any) => {
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value,
      )
    ) {
      return undefined;
    }
    return 'INVALID_EMAIL';
  };

  const validatePhoneNumber = (value?: string) => {
    if (value && value.startsWith('0')) value = `+66${value.substr(1)}`;
    const regex = /^\+?([0-9]{2})\)??([0-9]{9})$/;
    return regex.test(value) ? undefined : 'INVALID_PHONE_NUMBER';
  }

  const filesMock: any = [
    {
      id: 1,
      name: 'filename1.pdf',
      date: 'Jan 1, 2021 00:00:00',
    },
    {
      id: 2,
      name: 'filename2.pdf',
      date: 'Jan 1, 2021 00:00:00',
    },
  ];

  const statusOptions = [
    {
      label: t('docStatus:noDocument'),
      value: DocumentStatus.NO_DOCUMENT,
    },
    {
      label: t('docStatus:waitForVerify'),
      value: DocumentStatus.WAIT_FOR_VERIFIED,
    },
    {
      label: t('docStatus:verified'),
      value: DocumentStatus.VERIFIED,
    },
    {
      label: t('docStatus:rejected'),
      value: DocumentStatus.REJECTED,
    },
  ];

  const legalTypeOptions: any = [
    {
      label: t('individual'),
      value: 'INDIVIDUAL',
    },
    {
      label: t('company'),
      value: 'JURISTIC',
      isSelected: true,
    },
  ];

  const userTypeOptions: any = [
    {
      label: t('shipper'),
      value: 0,
    },
    {
      label: t('carrier'),
      value: 1,
    },
    {
      label: t('both'),
      value: 2,
      isSelected: true,
    },
  ];

  const addressOptions: any = [
    {
      type: 'DISTRICT',
      label: t('subDistrict'),
      isRequired: true,
      breakPoint: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      type: 'AMPHOE',
      label: t('district'),
      isRequired: true,
      breakPoint: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      type: 'PROVINCE',
      label: t('province'),
      isRequired: true,
      breakPoint: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
    {
      type: 'ZIPCODE',
      label: t('postcode'),
      isRequired: true,
      breakPoint: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
      },
    },
  ];

  const AddressForm = ({ onDismiss }: { onDismiss: () => any }) => {
    return (
      <>
        <Row style={{ margin: 0, width: '100%' }}>
          <Col breakPoint={{ md: 6 }}>
            <Field label={t('addressNo')} name={'addressNo'} defaultValue={''}>
              {({ fieldProps, error, meta: { valid } }: any) => <Textfield {...fieldProps} />}
            </Field>
          </Col>
          <Col breakPoint={{ md: 3 }}>
            <Field label={t('alley')} name={'alley'} defaultValue={''}>
              {({ fieldProps, error, meta: { valid } }: any) => <Textfield {...fieldProps} />}
            </Field>
          </Col>
          <Col breakPoint={{ md: 3 }}>
            <Field label={t('street')} name={'street'} defaultValue={''}>
              {({ fieldProps, error, meta: { valid } }: any) => <Textfield {...fieldProps} />}
            </Field>
          </Col>
        </Row>

        <AutoCompleteTypeahead data={addressOptions} handleValue={(data: any) => handleAddressValue(data)} />

        <Row style={{ margin: 0, width: '100%' }}>
          <Col>
            <FormFooter>
              <Button type="button" style={BottomBackStyled} onClick={onDismiss}>
                <BackText>{t('cancel')}</BackText>
              </Button>
              <Button type="button" style={BottomSubmitStyled} onClick={() => handleConfirmAddress()}>
                <SubmitText>
                  <Icon icon={save} size={20} style={{ paddingRight: 5, color: '#000' }} />
                  {t('confirm')}
                </SubmitText>
              </Button>
            </FormFooter>
          </Col>
        </Row>
      </>
    );
  };

  if (!userData) return <></>;

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>
        {t('userInfo')}
      </PageHeader>

      <CardBody>
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps} name="add-user" style={FormStyled}>
              <Row>
                <Col breakPoint={{ xs: 12, sm: 4, md: 2 }} style={IMAGE_CONTAINER}>
                  <ImageFram>
                    <ImagePreview>
                      {previewImage ? (
                        <img src={previewImage} alt="" style={IMAGE_PROFILE} />
                      ) : (
                        <Icon icon={ic_person} size={50} />
                      )}
                    </ImagePreview>
                    <Field label="" name="imageProfile" defaultValue="">
                      {({ fieldProps, error, meta: { valid } }: any) => (
                        <MaterialButton
                          variant="contained"
                          component="label"
                          style={CAMERA}
                          onChange={(event: any) => handleChaneImage(event)}
                        >
                          <input type={'file'} accept={'image/*'} />
                          <Icon icon={camera} size={25} />
                        </MaterialButton>
                      )}
                    </Field>
                  </ImageFram>
                </Col>
                <Col breakPoint={{ xs: 12, sm: 8, md: 5 }} style={SPACE_ROW}>
                  <div>
                    <Name>{userData?.fullname || 'Unnamed user'}</Name>
                  </div>

                  <FormEdit
                    label={`${t('memberSince')} :`}
                    value={DateFormat(userData.createdAt as string, loginStore.language)}
                    showEditIcon={false}
                    containerStyle={{ marginBottom: 12 }}
                    valueStyle={{ fontWeight: 0 }}
                  />
                  <FormEdit
                    label={`${t('legalType')} :`}
                    value={userData?.legalType === 'INDIVIDUAL' ? t('individual') : t('company')}
                    type={'dropdown'}
                    dropDownOption={legalTypeOptions}
                    handleSave={(value) => handleSave('legalType', value)}
                  />
                  <FormEdit
                    label={`${t('phoneNumber')} :`}
                    value={userData.phoneNumber || '-'}
                    validateMessage={t('invalidPhoneNumber')}
                    validateForm={validatePhoneNumber}
                    messageForCheck={'INVALID_PHONE_NUMBER'}
                    handleSave={(value) => {
                      if (!value) return;
                      if (value.startsWith('0')) value = `+66${value.substr(1)}`;
                      handleSave('phoneNumber', value);
                    }}
                  />
                  <FormEdit
                    label={`${t('email')} :`}
                    value={userData.email}
                    handleSave={(value) => handleSave('email', value)}
                    validateForm={validateEmail}
                    validateMessage={t('invalidEmail')}
                    messageForCheck={'INVALID_EMAIL'}
                  />
                </Col>
                <Col breakPoint={{ xs: 12, sm: 12, md: 5 }} style={SPACE_ROW}>
                  <Row style={{ marginBottom: 12 }}>
                    <Col breakPoint={{ xs: 5, sm: 5, md: 6 }}>
                      <Name>{t('userDoc')}</Name>
                    </Col>
                    <Col breakPoint={{ xs: 7, sm: 7, md: 6 }}>
                      <Field label="" name="uploadFile" defaultValue="">
                        {({ fieldProps, error, meta: { valid } }: any) => (
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <UploadButton accept=".pdf" onChange={handleUploadFile} />
                            {/* <MaterialButton
                              variant="contained"
                              component="label"
                              onChange={(event: any) => handleUploadFile(event)}
                            >
                              <input type={'file'} accept={'.pdf'} />
                              <Icon icon={upload} size={20} />
                              <TextUpload>{t('upload')}</TextUpload>
                            </MaterialButton> */}
                            {/* <ShowFileName>{file?.name || ''}</ShowFileName> */}
                          </div>
                        )}
                      </Field>
                    </Col>
                  </Row>

                  <Row>
                    {files.length ? files.map((file: UploadFileResponse) => {
                      return (
                        <Col key={file.attachCode}>
                          <ListFile
                            fileName={file.fileName}
                            date={file.uploadedDate}
                            handleDelete={() => {
                              const red = '#E03616';
                              const blue = '#3085D6';
                              Swal.mixin({
                                iconColor: red,
                                confirmButtonColor: red,
                                cancelButtonColor: blue,
                                confirmButtonText: t('delete'),
                                cancelButtonText: t('cancel'),
                              })
                                .fire({
                                  title: t('deleteConfirmAlertTitle'),
                                  titleText: t('deleteConfirmAlertText'),
                                  icon: 'warning',
                                  showCancelButton: true,
                                })
                                .then(({ isConfirmed }) => isConfirmed && handleDeleteFile(file.attachCode));
                            }}
                          />
                        </Col>
                      );
                    }) : (
                      <Col>
                        <span>{t('noDocuments')}</span>
                      </Col>
                    )}

                    <Col style={{ marginTop: 20 }}>
                      <FormEdit
                        label={`${t('status')} :`}
                        value={userData?.documentStatus || t('docStatus:waitForVerify')}
                        valueStyle={{ color: 'orangered' }}
                        type={'dropdown'}
                        dropDownOption={statusOptions.map((option) => ({
                          ...option,
                          isSelected: option.value === userData?.documentStatus,
                        }))}
                        handleSave={(value) => {console.log('options status', value)}}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col style={SPACE_ROW}>
                  <Name style={{ marginBottom: 12 }}>{t('generalAddr')}</Name>
                  <div style={AddressStyled}>
                    <Address>
                      {'91/1 Songphol Soi 9, Tambon Lam Phaya, Mueang Nakhon Pathom District, Nakhon Pathom 73000'}
                    </Address>
                    <button
                      style={BUTTON}
                      onClick={() => {
                        setIsOpenGeneralAddress((currentValue) => !currentValue);
                        setIsOpenDocumentAddress(false);
                      }}
                    >
                      <Icon icon={isOpenGeneralAddress ? close : pencil} style={ICON_STYLED} size={22} />
                    </button>
                  </div>
                </Col>

                {isOpenGeneralAddress && <AddressForm onDismiss={() => setIsOpenGeneralAddress(false)} />}

                <Col style={SPACE_ROW}>
                  <Name style={{ marginBottom: 12 }}>{t('documentDeliverAddr')}</Name>
                  <div style={ADDRESS_WITH_CHECKBOX}>
                    <div style={{ paddingBottom: 8 }}>
                      <Checkbox
                        value={1}
                        isChecked={isChecked}
                        isDisabled={isOpenDocumentAddress || isOpenGeneralAddress}
                        label={t('sameGeneralAddress').toString()}
                        onChange={handleCheckBox}
                        name="checkbox-default"
                        testId="same-general-address"
                        size={'large'}
                      />
                    </div>
                    {!isChecked && (
                      <div style={AddressStyled}>
                        <Address>
                          {'91/1 Songphol Soi 9, Tambon Lam Phaya, Mueang Nakhon Pathom District, Nakhon Pathom 73000'}
                        </Address>
                        <button
                          style={BUTTON}
                          onClick={() => {
                            setIsOpenDocumentAddress((currentValue) => !currentValue);
                            setIsOpenGeneralAddress(false);
                          }}
                        >
                          <Icon icon={isOpenDocumentAddress ? close : pencil} style={ICON_STYLED} size={22} />
                        </button>
                      </div>
                    )}
                  </div>
                </Col>
                {isOpenDocumentAddress && <AddressForm onDismiss={() => setIsOpenDocumentAddress(false)} />}
              </Row>
            </form>
          )}
        </Form>
      </CardBody>
    </div>
  );
});

export default EditUser;
