import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../../theme/typography';
import { useTranslation } from 'react-i18next';
import UploadButton from '../../components/UploadButton';
import { ListFile } from '../../components/list-file/list-file';
import Swal from 'sweetalert2';
import { Row, Col } from '../../Layouts/Controller/controller';
import styled from 'styled-components';
import InlineEdit from '@atlaskit/inline-edit';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import Select, { ValueType } from '@atlaskit/select';
import { DocumentStatus, UserStore } from '../../stores/user-store';
import { UserApi } from '../../services';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import FilePreviewer from 'react-file-previewer';
import { useMst } from '../../stores/root-store';
import { observer } from 'mobx-react-lite';

export interface UploadData {
  attachCode: string | null;
  token: string | null;
  fileName: string | null;
  type: string | null;
  status: string | null;
  fileUrl: string | null;
  fileType: string | null;
  uploadedDate: string | null;
}

export interface StateFileObject {
  fileName: string | null;
  url: string | null;
  type: string | null;
  attachCode?: string | null;
}

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  max-width: 100%;
  padding: 5px ${gridSize() - 2}px;
  word-break: break-word;
`;

const UserDoc = observer((props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userStore, loginStore } = useMst();

  const { t } = useTranslation();
  const { userData, handleDeleteFile, onUploadDocument } = props;

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

  // const getUser = async (uId: string) => {
  //   UserApi.getUser(uId)
  //     .then((response: any) => {
  //       if (response && response.ok) {
  //         const user: IUserDTO = {
  //           ...response.data,
  //           phoneNumber: response.data.phoneNumber ? `0${response.data.phoneNumber.substr(3)}` : null,
  //         };
  //         setUserData(user);
  //       } else {
  //         console.error('Unexpected error while loading user', response);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error while loading this user', error);
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Error while loading this user',
  //       });
  //     });
  // };

  const handleChangeDocStatus = (status: DocumentStatus) => {
    UserApi.changeDocStatus(userData.userId, { status })
      .then((response: any) => {
        if (response && response.ok) {
          console.log('change doc status result', response);
          // return getUser(userId);
        }
      })
      .catch((error) => console.error('change doc status result', error));
  };

  const [listUpload, setlistUpload] = useState<Array<StateFileObject>>([]);

  console.log('User data sub-level :: ', userData);
  console.log('List upload object :: ', listUpload);

  return (
    <Col>
      <SectionHeader>{t('userDoc')}</SectionHeader>

      {userData.files.length ? (
        userData.files.map((file: StateFileObject) => {
          const fileName = typeof file != 'string' ? file.fileName : file;
          const date = '';
          return (
            <div key={fileName}>
              <ListFile
                fileName={fileName || ''}
                date={date}
                handlePreview={(attachCode) => {
                  // console.log(attachCode)
                  setIsOpen(true);
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
                    .then(({ isConfirmed }) => isConfirmed && handleDeleteFile(userData.userId, file.attachCode));
                }}
              />
            </div>
          );
        })
      ) : (
        <span>{t('noDocuments')}</span>
      )}

      <Row justifyContent={'space-between'} alignItem={'center'}>
        {userData && userData.documentStatus && (
          <FieldWrapper>
            <DetailLabel>{t('status')} :</DetailLabel>
            <InlineEdit
              defaultValue={userData.documentStatus}
              editView={({ errorMessage, ...fieldProps }) => (
                <EditViewContainer>
                  <Select {...fieldProps} options={statusOptions} autoFocus openMenuOnFocus />
                </EditViewContainer>
              )}
              readView={() => (
                <ReadViewContainer data-testid="docStatusField">
                  {statusOptions.filter((e) => e.value == userData.documentStatus)[0].label}
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
        )}

        <UploadButton isLoading={false} accept=".pdf,.png,.jpg,.jpeg" onChange={onUploadDocument} />
      </Row>

      <ModalTransition>
        {isOpen && (
          <ModalDialog
            actions={[
              { text: 'ปิด', onClick: () => setIsOpen(false) },
              // { text: 'Skip' },
            ]}
            onClose={() => {
              setIsOpen(false);
            }}
            heading="แสดงตัวอย่างไฟล์"
            width={'x-large'}
          >
            <FilePreviewer
              file={{
                mimeType: 'application/pdf',
                url:
                  'https://cargolink-documents.s3.ap-southeast-1.amazonaws.com/USER_DOC/ACTIVE/USER_DOC-1625477727808.pdf',
              }}
            />
          </ModalDialog>
        )}
      </ModalTransition>
    </Col>
  );
});

export default UserDoc;
