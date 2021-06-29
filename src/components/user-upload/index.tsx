import React, { useState, useEffect } from 'react';
import UploadButton from '../UploadButton';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../stores/root-store';
import uploadApi, { UploadFilePath } from '../../services/upload-api';
import { breakPoints, extractJwtToken } from '../../utils';
import Swal from 'sweetalert2';
import { AxiosResponse } from 'axios';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  & > div {
    display: flex;
    flex-direction: column;
    padding: 3rem;
    flex: 1;

    @media (min-width: ${breakPoints.sm + 1}px) {
      flex: 0 0 ${breakPoints.sm}px;
    }
  }

  h1 {
    padding: 0;
    font-size: 1em;
  }
`;
const FileNameSpan = styled.p`
  padding-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
interface IUploadPageProps {
  token: string | null;
}
const UploadPageComponent: React.FC<IUploadPageProps> = ({ token }: IUploadPageProps) => {
  if (!token) return <h1>Forbidden</h1>;
  const { t } = useTranslation();
  const { uploadFileStore } = useMst();

  const [citizenIdFile, setCitizenIdFile] = useState<File>();
  const [isCitizenIdLoading, setIsCitizenIdLoading] = useState(false);
  const [companyCertificateFile, setCompanyCertificateFile] = useState<File>();
  const [isCompanyCertificateLoading, setIsCompanyCertificateLoading] = useState(false);
  const [attachCodes, setAttachCodes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!userId) return false;
    const payload = {
      url: attachCodes,
      token,
    };
    console.log('prepping to upload', userId, payload);
    uploadApi
      .uploadByUser(userId, payload)
      .then((response: AxiosResponse<{ message: string }>) => {
        console.log('upload file(s) completed', response);
      })
      .catch((error) => {
        console.error('upload by user error', error);
        Swal.fire({
          icon: 'error',
          text: 'Error while upload user file(s).',
        });
      });
  };

  const extractTokenData = () => {
    try {
      const tokenData = extractJwtToken(token);
      if (Object.keys(tokenData).includes('userId')) return setUserId(tokenData.userId);
    } catch (e) {
      console.error('token error', e);
    }
    return Swal.fire({
      title: 'Error',
      text: 'invalid token',
      icon: 'error',
    });
  };

  const uploadFile = (file: File) => {
    uploadFileStore.uploadFile(UploadFilePath.USER_DOC, file);
  };

  const handleUploadCitizenIdCard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      uploadFile(file);
      setCitizenIdFile(file);
      setIsCitizenIdLoading(true);
    }
  };
  const handleUploadCompanyCertificate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      uploadFile(file);
      setCompanyCertificateFile(file);
      setIsCompanyCertificateLoading(true);
    }
  };

  const clearFiles = () => {
    uploadFileStore.clear();
  };

  useEffect(() => {
    const newFile = JSON.parse(JSON.stringify(uploadFileStore.file));
    const isNoFile = newFile == null || Object.keys(newFile).every((key) => newFile[key] == null);
    if (!isNoFile) {
      setAttachCodes([...attachCodes, newFile.attachCode]);
      setIsCitizenIdLoading(false);
      setIsCompanyCertificateLoading(false);
      clearFiles();
    }
  }, [uploadFileStore.file]);
  useEffect(() => {
    clearFiles();
    extractTokenData();
  }, []);
  useEffect(() => console.log('citizen id', citizenIdFile), [citizenIdFile]);
  useEffect(() => console.log('comp cert id', companyCertificateFile), [companyCertificateFile]);
  return (
    <Wrapper>
      <div>
        <h1>{t('userUploadTitle')}</h1>
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps} name="user upload">
              <Row>
                <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
                  <Field label={t('citizenId')} name="citizenIdCard" defaultValue="">
                    {({ fieldProps, error, meta: { valid } }) => (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <UploadButton
                          accept=".pdf"
                          onChange={handleUploadCitizenIdCard}
                          disabled={isCitizenIdLoading}
                          isLoading={isCitizenIdLoading}
                        />
                        <FileNameSpan>
                          {!isCitizenIdLoading && citizenIdFile?.name ? citizenIdFile?.name : ''}
                        </FileNameSpan>
                      </div>
                    )}
                  </Field>
                </Col>
                <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
                  <Field label={t('companyCertificate')} name="companyCertificate" defaultValue="">
                    {({ fieldProps, error, meta: { valid } }) => (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <UploadButton
                          accept=".pdf"
                          onChange={handleUploadCompanyCertificate}
                          disabled={isCompanyCertificateLoading}
                          isLoading={isCompanyCertificateLoading}
                        />
                        <FileNameSpan>
                          {!isCompanyCertificateLoading && companyCertificateFile?.name
                            ? companyCertificateFile?.name
                            : ''}
                        </FileNameSpan>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>
              <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
                  <FormFooter>
                    <Button
                      type="submit"
                      style={{
                        border: `1px solid ${attachCodes.length ? '#FBBC12' : '#D8D8D8'}`,
                        backgroundColor: `${attachCodes.length ? '#FBBC12' : '#D8D8D8'}`,
                        margin: '0 6px',
                      }}
                      isDisabled={!attachCodes.length}
                    >
                      <span style={{ color: '#000' }}>{t('confirm')}</span>
                    </Button>
                  </FormFooter>
                </Col>
              </Row>
            </form>
          )}
        </Form>
      </div>
    </Wrapper>
  );
};

export default observer(UploadPageComponent);
