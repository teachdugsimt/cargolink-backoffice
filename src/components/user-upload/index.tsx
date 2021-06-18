import React, { useState, useEffect } from 'react';
import UploadButton from '../UploadButton';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Button from '@atlaskit/button';
import { navigate } from 'gatsby';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

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
interface InputData {
  citizenIdCard?: string;
  companyCertificate?: string;
  token?: string;
}
interface IUploadPageProps {
  token: string | null;
}
const UploadPageComponent: React.FC<IUploadPageProps> = ({ token }: IUploadPageProps) => {
  if (!token) return <h1>Forbidden</h1>;
  const { t } = useTranslation();

  const [citizenIdFile, setCitizenIdFile] = useState<File>();
  const [companyCertificateFile, setCompanyCertificateFile] = useState<File>();

  const handleSubmit = (formState: InputData) => {
    console.log('submitted', formState);
  }
  const handleUploadCitizenIdCard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    file && setCitizenIdFile(file);
  }
  const handleUploadCompanyCertificate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    file && setCompanyCertificateFile(file);
  }

  useEffect(() => console.log('citizen id', citizenIdFile), [citizenIdFile]);
  useEffect(() => console.log('comp cert id', companyCertificateFile), [companyCertificateFile]);
  return (
    <Wrapper>
      <h1>{t('userUploadTitle')}</h1>
      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps} name="user upload">
            <Row>
              <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
                <Field label={t('citizenId')} name="citizenIdCard" defaultValue="">
                  {({ fieldProps, error, meta: { valid } }) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <UploadButton accept=".pdf" onChange={handleUploadCitizenIdCard} />
                      <FileNameSpan>{citizenIdFile?.name || ''}</FileNameSpan>
                    </div>
                  )}
                </Field>
              </Col>
              <Col breakPoint={{ xs: 12, sm: 12, md: 12 }}>
                <Field label={t('companyCertificate')} name="companyCertificate" defaultValue="">
                  {({ fieldProps, error, meta: { valid } }) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <UploadButton accept=".pdf" onChange={handleUploadCompanyCertificate} />
                      <FileNameSpan>{companyCertificateFile?.name || ''}</FileNameSpan>
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
                      border: '1px solid #FBBC12',
                      backgroundColor: '#FBBC12',
                      margin: '0 6px',
                    }}
                  >
                    <span style={{ color: '#000' }}>{t('confirm')}</span>
                  </Button>
                </FormFooter>
              </Col>
            </Row>
          </form>
        )}
      </Form>
    </Wrapper>
  );
}

export default UploadPageComponent;