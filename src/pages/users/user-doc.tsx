import React, { useState } from 'react'
import { SectionHeader } from '../../theme/typography'
import { useTranslation } from 'react-i18next';
import UploadButton from '../../components/UploadButton';
import { ListFile } from '../../components/list-file/list-file';
import Swal from 'sweetalert2';
import { Row, Col } from '../../Layouts/Controller/controller';
import styled from 'styled-components'
import InlineEdit from '@atlaskit/inline-edit';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import Select, { ValueType } from '@atlaskit/select';
import { DocumentStatus } from '../../stores/user-store';
import { UserApi } from '../../services';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import FilePreviewer from 'react-file-previewer';

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  max-width: 100%;
  padding: 5px ${gridSize() - 2}px;
  word-break: break-word;
`;



function UserDoc(props: any) {

  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation()
  const { userData, handleDeleteFile } = props

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
    UserApi.changeDocStatus(userData.id, { status })
      .then((response: any) => {
        if (response && response.ok) {
          console.log('change doc status result', response);
          // return getUser(userId);
        }
      })
      .catch((error) => console.error('change doc status result', error));
  };


  return (
    <Col>

      <SectionHeader>{t('userDoc')}</SectionHeader>


      {userData?.files?.length ? (
        userData.files.map((file: any) => {
          const fileName = typeof file != 'string' ? file.fileName : file
          const date = typeof file != 'string' ? file.uploadedDate : ''

          return <div key={file}>

            {/* "https://d3c8ovmhhst6ne.cloudfront.net/api/v1/media/file-stream-three?attachCode=04957a62bff4edfc356e8ad85c9ff92e2ee64a868676bd5f66c80d4795d229760fd20705ba0be98c925c75ebbeec8be0233b08f1b22ca579b23654ebf9775f48" */}


            <ListFile
              fileName={fileName}
              date={date}
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

        })
      ) : (
        <span>{t('noDocuments')}</span>
      )}

      <Row justifyContent={'space-between'} alignItems={'center'}>
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

        <UploadButton isLoading={false} accept=".pdf,.png,.jpg,.jpeg" onChange={() => { }} />
      </Row>

      <ModalTransition>
        {isOpen && (
          <ModalDialog
            actions={[
              { text: 'ปิด', onClick: () => setIsOpen(false) },
              // { text: 'Skip' },
            ]}
            onClose={() => { setIsOpen(false) }}
            heading="แสดงตัวอย่างไฟล์"
            width={'x-large'}
          >
            <FilePreviewer file={{
              mimeType: 'application/pdf',
              url: "https://cargolink-documents.s3.ap-southeast-1.amazonaws.com/USER_DOC/ACTIVE/USER_DOC-1625477727808.pdf"
            }}
            />
          </ModalDialog>
        )}
      </ModalTransition>

    </Col>
  )
}

export default UserDoc
