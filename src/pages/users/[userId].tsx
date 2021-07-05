import React, { useEffect, useState, CSSProperties } from 'react'
import { observer } from 'mobx-react-lite';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';

import { Button as MaterialButton } from '@material-ui/core';
import { Icon } from 'react-icons-kit';
import { ic_person } from 'react-icons-kit/md/ic_person';
import { camera } from 'react-icons-kit/fa/camera';
import FilePreviewer from 'react-file-previewer';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import InlineEdit from '@atlaskit/inline-edit';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Select, { ValueType } from '@atlaskit/select';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
// import { Checkbox } from '@atlaskit/checkbox';

import { useMst } from '../../stores/root-store';
import { IUserDTO, DocumentStatus } from '../../stores/user-store';
import { DateFormat } from '../../components/simple-data';
import { EditUserPayload, EditUserResponse } from '../../services/user-api';
import { UserApi } from '../../services';
import { UploadFileResponse } from '../../services/upload-api';
import UploadButton from '../../components/UploadButton/index';
import { ListFile } from '../../components/list-file/list-file';

interface Props {
  userId?: number;
}

const IMAGE_PROFILE: CSSProperties = {
  width: 120,
  height: 'auto',
};

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

interface OptionType {
  label: string;
  value: string;
}

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

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  // padding: ${gridSize()}px ${gridSize()}px ${gridSize() * 6}px;
`;

const DetailLabel = styled.div`
  margin-top: 8px;
  color: #AAA;
`;

const EditViewContainer = styled.div`
  z-index: 300;
  position: relative;
  width: 200px;
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

const UserDetail: React.FC<Props> = observer((props: any) => {

  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [userData, setUserData] = useState<IUserDTO | null>(null);
  const { userStore, loginStore, uploadFileStore } = useMst();
  const [files, setFiles] = useState<UploadFileResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const userId = props.userId;
  type Fields = 'email' | 'legalType' | 'phoneNumber' | 'attachCode' | 'userType';

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/users')} text={t('userManagement')} key="user-management" />
      <BreadcrumbsItem text={t('userInfo')} key="user-info" />
    </Breadcrumbs>
  );

  useEffect(() => {
    console.log(userId)
    // if (!userId) navigate('/user-management');
    // else
    getUser(userId);
    uploadFileStore.clear();

    return () => {
      setFiles([]);
      uploadFileStore.clear();
    };
  }, []);

  useEffect(() => {
    console.log("LOADING", uploadFileStore.loading)
    return () => {
    }
  }, [uploadFileStore.loading])


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

  const handleChangeImage = (event: any) => {
    event.preventDefault();
    if (event.target?.files?.length) {
      const previewImg = URL.createObjectURL(event.target.files[0]);
      setPreviewImage(previewImg);
      console.log('previewImg :>> ', previewImg);
    }
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
    console.log('FILE', file)
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


  if (!userData) return <></>;
  const fullNamePlaceholder = t('fullNamePlaceholder');

  return (
    <>
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
                    onChange={(event: any) => handleChangeImage(event)}
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

                    {/* "https://d3c8ovmhhst6ne.cloudfront.net/api/v1/media/file-stream-three?attachCode=04957a62bff4edfc356e8ad85c9ff92e2ee64a868676bd5f66c80d4795d229760fd20705ba0be98c925c75ebbeec8be0233b08f1b22ca579b23654ebf9775f48" */}


                    <ListFile
                      fileName={file}
                      // date={''}
                      handlePreview={(attachCode) => {
                        // console.log(attachCode)
                        setIsOpen(true)
                      }}
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
            <ModalTransition>
              {isOpen && (
                <ModalDialog
                  actions={[
                    { text: 'Get started', onClick: close },
                    { text: 'Skip' },
                  ]}
                  onClose={() => { setIsOpen(false) }}
                  heading="Easily set up your own projects"
                  width={'x-large'}
                >
                  <FilePreviewer file={{
                    url: "https://cargolink-documents.s3.ap-southeast-1.amazonaws.com/USER_DOC/ACTIVE/USER_DOC-1625477727808.pdf"
                  }}
                  />
                </ModalDialog>
              )}
            </ModalTransition>

            <FieldWrapper>
              <DetailLabel>
                {t('status')} :
              </DetailLabel>
              <InlineEdit
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
              />
            </FieldWrapper>

            {/* </div> */}
          </GridColumn>


        </Grid>
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


      </Page>
    </>
  )
})

export default UserDetail
