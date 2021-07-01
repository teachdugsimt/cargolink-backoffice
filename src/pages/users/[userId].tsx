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

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import InlineEdit from '@atlaskit/inline-edit';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Select, { ValueType } from '@atlaskit/select';
// import { Checkbox } from '@atlaskit/checkbox';

import { useMst } from '../../stores/root-store';
import { IUserDTO, DocumentStatus } from '../../stores/user-store';
import { DateFormat } from '../../components/simple-data';
import { EditUserPayload, EditUserResponse } from '../../services/user-api';
import { UserApi } from '../../services';
import { UploadFileResponse } from '../../services/upload-api';

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

        </Grid>
      </Page>
    </>
  )
})

export default UserDetail
