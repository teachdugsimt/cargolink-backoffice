import React, { useState, useEffect, CSSProperties, useCallback, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Button as MaterialButton } from '@material-ui/core';
// import { Button } from '@paljs/ui/Button';
import Button from '@atlaskit/button/standard-button';
import { navigate } from 'gatsby';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
// import { upload } from 'react-icons-kit/ikons/upload';
import { ic_person } from 'react-icons-kit/md/ic_person';
import Form, { Field, FormFooter } from '@atlaskit/form';
// import { FormEdit } from '../../form-edit/form-edit';
import { ListFile } from '../list-file/list-file';
import AutoCompleteTypeahead from '../auto-complete-typeahead/auto-complete-typeahead';
import { save } from 'react-icons-kit/fa/save';
import { camera } from 'react-icons-kit/fa/camera';

// import { close } from 'react-icons-kit/fa/close';
// import { pencil } from 'react-icons-kit/fa/pencil';
import UploadButton from '../UploadButton';
import Swal from 'sweetalert2';
import { IUserDTO, DocumentStatus } from '../../stores/user-store';
import { useMst } from '../../stores/root-store';
import { DateFormat } from '../simple-data';
import { UserApi } from '../../services';
import { UploadFileResponse } from '../../services/upload-api';
import { EditUserPayload, EditUserResponse } from '../../services/user-api';
import { AxiosResponse } from 'axios';
import { breakPoints, useWindowSize } from '../../utils';
import { Property } from 'csstype';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
// import { Checkbox } from '@atlaskit/checkbox';
import Textfield from '@atlaskit/textfield';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import InlineEdit from '@atlaskit/inline-edit';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Select, { ValueType } from '@atlaskit/select';

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
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ImagePreview = styled.div`
  width: 80px;
  height: 80px;
  background-color: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
`;

interface FullNameProps {
  isNoData?: boolean;
}
const Name = styled.p<FullNameProps>`
  color: ${({ isNoData }) => (isNoData ? '#AAA' : 'inherit')};
  margin: 0 0 10px 0;
  font-size: 1.125rem;
  font-weight: 700;

  :first-letter {
    text-transform: capitalize;
  }
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

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  // padding: ${gridSize()}px ${gridSize()}px ${gridSize() * 6}px;
`;

const ReadViewContainer = styled.div`
  display: flex;
  // font-size: ${fontSize()}px;
  // line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  // min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: 5px ${gridSize() - 2}px;
  word-break: break-word;
`;

const EditViewContainer = styled.div`
  z-index: 300;
  position: relative;
  width: 200px;
`;

const DetailLabel = styled.div`
  margin-top: 8px;
  color: #AAA;
`;

interface OptionType {
  label: string;
  value: string;
}


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
  margin: '0 .5rem',
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
  const [width] = useWindowSize();

  const userId = props.id;
  type Fields = 'email' | 'legalType' | 'phoneNumber' | 'attachCode' | 'userType';

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/user-management')} text={t('userManagement')} key="user-management" />
      <BreadcrumbsItem text={t('userInfo')} key="user-info" />
    </Breadcrumbs>
  );

  const getUser = async (uId: string) => {
    UserApi.getUser(uId)
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

  useEffect(() => {
    console.log(uploadFileStore.loading)
    return () => {

    }
  }, [uploadFileStore.loading])

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    file && uploadFileStore.uploadFile('USER_DOC', file);
  };

  const handleDeleteFile = (id: number | string) => {
    console.log('file id :>> ', id);
  };

  const handleChangeDocStatus = (status: DocumentStatus) => {
    UserApi.changeDocStatus(userId, { status })
      .then((response: any) => {
        if (response && response.ok) {
          console.log('change doc status result', response);
          return getUser(userId);
        }
      })
      .catch((error) => console.error('change doc status result', error));
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
  };

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
        <div
          style={{
            ...groupItemsStyle,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ ...fieldItemStyle('half') }}>
            <Field label={t('addressNo')} name={'addressNo'} defaultValue={''}>
              {({ fieldProps, error, meta: { valid } }: any) => <Textfield {...fieldProps} />}
            </Field>
          </div>
          <div style={{ ...fieldItemStyle('quart') }}>
            <Field label={t('alley')} name={'alley'} defaultValue={''}>
              {({ fieldProps, error, meta: { valid } }: any) => <Textfield {...fieldProps} />}
            </Field>
          </div>
          <div style={{ ...fieldItemStyle('quart') }}>
            <Field label={t('street')} name={'street'} defaultValue={''}>
              {({ fieldProps, error, meta: { valid } }: any) => <Textfield {...fieldProps} />}
            </Field>
          </div>
          <AutoCompleteTypeahead data={addressOptions} handleValue={(data: any) => handleAddressValue(data)} fieldStyle={fieldItemStyle('half')} />
        </div>
        <FormFooter>
          <div style={{
            ...groupItemsStyle,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Button type="button" style={BottomBackStyled} onClick={onDismiss}>
              <BackText>{t('cancel')}</BackText>
            </Button>
            <Button type="button" style={BottomSubmitStyled} onClick={() => handleConfirmAddress()}>
              <SubmitText>
                <Icon icon={save} size={20} style={{ paddingRight: 5, color: '#000' }} />
                {t('confirm')}
              </SubmitText>
            </Button>
          </div>
        </FormFooter>
      </>
    );
  };

  if (!userData) return <></>;
  const fullNamePlaceholder = t('fullNamePlaceholder');
  const windowMode = width > breakPoints.md ? 'lg' : 'sm';
  const fieldItemStyle = (size: 'full' | 'half' | 'quart'): CSSProperties => {
    let wid: Property.Width = 'calc(100% - 1rem)';
    if (windowMode === 'lg') {
      if (size === 'half') wid = 'calc(50% - 1rem)';
      else if (size === 'quart') wid = 'calc(25% - 1rem)';
    }
    return {
      display: 'flex',
      justifyContent: 'flex-start',
      wid,
      margin: '0 .5rem',
      flexDirection: 'column',
    };
  };
  const groupItemsStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -.5rem',
  };

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('userInfo')}</PageHeader>
      <Page>
        <Grid>
          <GridColumn medium={2}>
            <ImageFram
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
              }}
            >
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
          </GridColumn>

          <GridColumn medium={6}>
            <Name isNoData={!userData?.fullName}>{userData?.fullName || fullNamePlaceholder}</Name>
            <FieldWrapper>
              <DetailLabel>
                {t('memberSince')} :
              </DetailLabel>
              <div style={{ marginTop: 8, marginLeft: 5 }}>
                {DateFormat(userData.createdAt as string, loginStore.language)}
              </div>
            </FieldWrapper>

            <FieldWrapper>
              <DetailLabel>
                {t('legalType')} :
              </DetailLabel>
              <InlineEdit<ValueType<OptionType, true>>
                defaultValue={userData?.legalType === 'INDIVIDUAL' ? t('individual') : t('company')}
                editView={(fieldProps) => (
                  <EditViewContainer>
                    <Select
                      {...fieldProps}
                      options={legalTypeOptions}
                      autoFocus
                      openMenuOnFocus
                    />
                  </EditViewContainer>
                )}
                readView={() => (
                  <ReadViewContainer data-testid="legalTypeField">
                    {userData?.legalType === 'INDIVIDUAL' ? t('individual') : t('company')}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  console.log('LEGAL VALUE', value)
                  return handleSave('legalType', value.value)
                }}
              />
            </FieldWrapper>

            <FieldWrapper>
              <DetailLabel>
                {t('phoneNumber')} :
              </DetailLabel>
              <InlineEdit
                defaultValue={userData.phoneNumber}
                editView={({ errorMessage, ...fieldProps }) => (
                  <Textfield {...fieldProps} css={{ width: '100%' }} autoFocus />
                )}
                readView={() => (
                  <ReadViewContainer data-testid="phoneNumberField">
                    {userData.phoneNumber || <div style={{ color: '#aaa' }}>{t('clickToEnterValue')}</div>}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  if (!value) return;
                  if (value.startsWith('0')) value = `+66${value.substr(1)}`;
                  return handleSave('phoneNumber', value)
                }}
              />
            </FieldWrapper>

            <FieldWrapper>
              <DetailLabel>
                {t('email')} :
              </DetailLabel>
              <InlineEdit
                defaultValue={userData.email}
                // label={t('email')}
                editView={({ errorMessage, ...fieldProps }) => (
                  <Textfield {...fieldProps} autoFocus />
                )}
                readView={() => (
                  <ReadViewContainer data-testid="emailField">
                    {userData.email || <div style={{ color: '#aaa' }}>{t('clickToEnterValue')}</div>}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => handleSave('email', value)}
              />
            </FieldWrapper>
          </GridColumn>


          <GridColumn medium={4}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <Name>{t('userDoc')}</Name>
              <Field label="" name="uploadFile" defaultValue="">
                {({ fieldProps, error, meta: { valid } }: any) => (
                  <UploadButton isLoading={uploadFileStore.loading} accept=".pdf" onChange={handleUploadFile} />
                )}
              </Field>
            </div>
            {userData?.files?.length ? (
              userData.files.map((file: any) => {
                console.log(file)

                if (typeof file != 'string') {
                  return (
                    <div key={file.attachCode}>
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
                    </div>
                  );
                } else {
                  return <div key={file}>
                    <ListFile
                      fileName={file}
                      // date={''}
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
                          .then(({ isConfirmed }) => isConfirmed && handleDeleteFile(file));
                      }}
                    />
                  </div>
                }
              })
            ) : (
              <span>{t('noDocuments')}</span>
            )}
            {/* <div style={{ marginTop: '1rem' }}> */}

            <FieldWrapper>
              <DetailLabel>
                {t('status')} :
              </DetailLabel>
              {/* <InlineEdit
                defaultValue={userData.documentStatus}
                editView={({ errorMessage, ...fieldProps }) => (
                  <EditViewContainer>
                    <Select
                      {...fieldProps}
                      options={statusOptions}
                      autoFocus
                      openMenuOnFocus
                    />
                  </EditViewContainer>
                )}
                readView={() => (
                  <ReadViewContainer data-testid="docStatusField">
                    {statusOptions.filter(e => e.value == userData.documentStatus)[0].label}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  try {
                    const status = value;
                    handleChangeDocStatus(status.value);
                  } catch (error) {
                    console.error('Error casting document status change (maybe invalid status)', error);
                  }
                }}
              /> */}
            </FieldWrapper>

            {/* <FormEdit
                label={`${t('status')} :`}
                value={userData?.documentStatus || t('docStatus:waitForVerify')}
                valueStyle={{ color: 'orangered' }}
                type={'dropdown'}
                dropDownOption={statusOptions.map((option) => ({
                  ...option,
                  isSelected: option.value === userData?.documentStatus,
                }))}
                handleSave={(value) => {
                  try {
                    const status = value as DocumentStatus;
                    handleChangeDocStatus(status);
                  } catch (error) {
                    console.error('Error casting document status change (maybe invalid status)', error);
                  }
                }}
              /> */}
            {/* </div> */}
          </GridColumn>
        </Grid>
      </Page>


      <div style={{ borderTop: '1px solid #ddd', margin: '30px 0' }} />
      {/* <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps} name="add-user" style={FormStyled}>
            <div style={groupItemsStyle}>
              <div
                style={{
                  ...fieldItemStyle('half'),
                  flexDirection: 'row',
                }}
              >

              </div>
              <div
                style={{
                  ...fieldItemStyle('half'),
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >


              </div>
            </div>
            <div style={groupItemsStyle}>
              {'Under development'} <br /><br />
              <div style={fieldItemStyle('full')}>
                <Name style={{ marginBottom: 12 }}>{t('generalAddr')}</Name>
                <div style={AddressStyled}>
                  <Address>
                    {'-'}
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
                {isOpenGeneralAddress && <AddressForm onDismiss={() => setIsOpenGeneralAddress(false)} />}
              </div>
            </div>
            <div style={{
              ...groupItemsStyle,
              marginTop: '1rem',
            }}>
              <div style={fieldItemStyle('full')}>
                <Name style={{ marginBottom: 12 }}>{t('documentDeliverAddr')}</Name>
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
                {!isChecked && (
                  <div style={{
                    ...AddressStyled,
                    marginTop: '1rem',
                  }}>
                    <Address>
                      {'-'}
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
                {isOpenDocumentAddress && <AddressForm onDismiss={() => setIsOpenDocumentAddress(false)} />}
              </div>
            </div>
          </form>
        )}
      </Form> */}

    </div >
  );
});

export default EditUser;
