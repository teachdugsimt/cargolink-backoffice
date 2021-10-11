import React, { useEffect, useState, CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button as MaterialButton } from '@material-ui/core';
import { Icon } from 'react-icons-kit';
import { ic_person } from 'react-icons-kit/md/ic_person';
import { camera } from 'react-icons-kit/fa/camera';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import InlineEdit from '@atlaskit/inline-edit';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { EditUserPayload } from '../../services/user-api';
import Select, { ValueType } from '@atlaskit/select';
import { useMst } from '../../stores/root-store';
import { IUserDTO } from '../../stores/user-non-persist-store';
import { DateFormat } from '../../components/simple-data';
import { UploadFileResponse } from '../../services/upload-api';
import TruckDoc from '../../components/truck/truck-doc';
import { Col, Row } from '../../Layouts/Controller/controller';
import UserDoc from './user-doc';
import { UserNonPersistStore } from '../../stores/user-non-persist-store';
import { UploadFilePath } from '../../services/upload-api';
import { TruckNonPersistStore } from '../../stores/truck-non-persist-store';
import Swal from 'sweetalert2';

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
  color: #aaa;
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
  const { loginStore, uploadFileStore } = useMst();
  const [files, setFiles] = useState<UploadFileResponse[]>([]);

  const userId = props.userId;
  type Fields = 'fullName' | 'email' | 'legalType' | 'phoneNumber' | 'attachCode' | 'userType';

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => {}}>
      <BreadcrumbsItem onClick={() => navigate('/users')} text={t('userManagement')} key="user-management" />
      <BreadcrumbsItem text={t('userInfo')} key="user-info" />
    </Breadcrumbs>
  );

  useEffect(() => {
    uploadFileStore.clear();
    UserNonPersistStore.getFullyUserProfile(userId);

    return () => {
      setFiles([]);
      uploadFileStore.clear();
      UserNonPersistStore.clear();
    };
  }, []);

  useEffect(() => {
    console.log('TRIGGER Patch Profile => ', JSON.parse(JSON.stringify(UserNonPersistStore.data_patch_user)));
  }, [JSON.stringify(UserNonPersistStore.data_patch_user)]);
  useEffect(() => {
    console.log('TRIGGER TruckNonPersistStore => userTrucks_loading  : ', TruckNonPersistStore.userTrucks_loading);
  }, [TruckNonPersistStore.userTrucks_loading]);

  useEffect(() => {
    const tmpProfile = JSON.parse(JSON.stringify(UserNonPersistStore.data_get_user_id_fully));
    if (tmpProfile) {
      const user: IUserDTO = {
        ...tmpProfile,
        phoneNumber: tmpProfile.phoneNumber ? `0${tmpProfile.phoneNumber.substr(3)}` : null,
      };
      if (tmpProfile?.avatar) setPreviewImage(tmpProfile.avatar);
      setUserData(user);
    }
  }, [JSON.stringify(UserNonPersistStore.data_get_user_id_fully)]);

  const onUploadDocument = (event: any) => {
    event.persist();
    setTimeout(() => {
      let fileObject = event?.target?.files[0] || undefined;
      if (fileObject) {
        UserNonPersistStore.uploadImage(UploadFilePath.USER_DOC, fileObject, userId);
      }
    }, 100);
  };

  const handleChangeImage = (event: any) => {
    event.preventDefault();
    if (event.target?.files?.length) {
      const previewImg = URL.createObjectURL(event.target.files[0]);
      console.log(`🚀  ->  previewImg`, previewImg);
      console.log('Image Pciker :: ', event.target.files[0]);
      UserNonPersistStore.uploadAvatarProfile('USER_AVATAR/INPROGRESS/', event.target.files[0], userId);
      setPreviewImage(previewImg);
    }
  };

  useEffect(() => {
    let tmpErrorPatchUser = JSON.parse(JSON.stringify(UserNonPersistStore.error_patch_user));
    if (tmpErrorPatchUser) {
      Swal.fire({
        icon: 'error',
        text: tmpErrorPatchUser.includes('Phone number')
          ? `${t('errorProfile.wrongFormatPhoneNumber')}!`
          : `${t('errorProfile.someThingWrong')}`,
      }).then(() => UserNonPersistStore.clearErrorPatchUser());
    }
  }, [JSON.stringify(UserNonPersistStore.error_patch_user)]);

  const handleSave = (field: Fields, value: any) => {
    const payload: Partial<EditUserPayload> = { [field]: value };
    UserNonPersistStore.patchUser(userId, payload);
  };

  const handleDeleteFile = (id: string, attachCode: string) => {
    UserNonPersistStore.deleteUserDocumnet(id, attachCode);
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

  const userTypeOptions: any = [
    {
      label: t('userTypeGroup.SHIPPER'),
      value: 'SHIPPER',
      isSelected: true,
    },
    {
      label: t('userTypeGroup.CARRIER'),
      value: 'CARRIER',
    },
    {
      label: t('userTypeGroup.BOTH'),
      value: 'BOTH',
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

          <GridColumn medium={5}>
            <FieldWrapper>
              <InlineEdit
                defaultValue={userData.fullName}
                editView={({ errorMessage, ...fieldProps }) => (
                  <Textfield {...fieldProps} css={{ width: '100%' }} autoFocus />
                )}
                readView={() => (
                  <ReadViewContainer data-testid="userFullname">
                    <Name isNoData={!userData?.fullName}>{userData?.fullName || fullNamePlaceholder}</Name>
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  if (!value) return;
                  return handleSave('fullName', value);
                }}
              />
            </FieldWrapper>

            <FieldWrapper>
              <DetailLabel>{t('memberSince')} :</DetailLabel>
              <div style={{ marginTop: 8, marginLeft: 5 }}>
                {DateFormat(userData.createdAt as string, loginStore.language)}
              </div>
            </FieldWrapper>

            <FieldWrapper>
              <DetailLabel>{t('legalType')} :</DetailLabel>
              <InlineEdit<ValueType<OptionType, true>>
                defaultValue={userData?.legalType === 'INDIVIDUAL' ? t('individual') : t('company')}
                editView={(fieldProps) => (
                  <EditViewContainer>
                    <Select {...fieldProps} options={legalTypeOptions} autoFocus openMenuOnFocus />
                  </EditViewContainer>
                )}
                readView={() => (
                  <ReadViewContainer data-testid="legalTypeField">
                    {userData?.legalType === 'INDIVIDUAL' ? t('individual') : t('company')}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  return handleSave('legalType', value.value);
                }}
              />
            </FieldWrapper>

            <FieldWrapper>
              <DetailLabel>{t('userType')} :</DetailLabel>
              <InlineEdit<ValueType<OptionType, true>>
                defaultValue={
                  userData?.userType ? t(`userTypeGroup.${userData?.userType}`) : t('userTypeGroup.SHIPPER')
                }
                editView={(fieldProps) => (
                  <EditViewContainer>
                    <Select {...fieldProps} options={userTypeOptions} autoFocus openMenuOnFocus />
                  </EditViewContainer>
                )}
                readView={() => (
                  <ReadViewContainer data-testid="userTypeField">
                    {userData?.userType ? t(`userTypeGroup.${userData?.userType}`) : t('userType')}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  return handleSave('userType', value.value);
                }}
              />
            </FieldWrapper>
          </GridColumn>

          <GridColumn medium={5}>
            <FieldWrapper>
              <DetailLabel>{t('phoneNumber')} :</DetailLabel>
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
                  return handleSave('phoneNumber', value);
                }}
              />
            </FieldWrapper>

            <FieldWrapper>
              <DetailLabel>{t('email')} :</DetailLabel>
              <InlineEdit
                defaultValue={userData.email}
                // label={t('email')}
                editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
                readView={() => (
                  <ReadViewContainer data-testid="emailField">
                    {userData.email || <div style={{ color: '#aaa' }}>{t('clickToEnterValue')}</div>}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => handleSave('email', value)}
              />
            </FieldWrapper>
          </GridColumn>
        </Grid>
        <div style={{ borderTop: '1px solid #ddd', margin: '30px 0 10px 0' }} />

        <Row>
          <Col>
            <UserDoc userData={userData} handleDeleteFile={handleDeleteFile} onUploadDocument={onUploadDocument} />
          </Col>
          <div
            style={{
              backgroundColor: 'lightgrey',
              height: 'auto',
              width: 1,
              marginRight: 20,
            }}
          ></div>
          <Col flex={2}>
            <TruckDoc carrierId={userId} />
          </Col>
        </Row>
      </Page>
    </>
  );
});

export default UserDetail;
