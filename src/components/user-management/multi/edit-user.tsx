import React, { useState, Fragment, useEffect, CSSProperties } from 'react';
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
import { edit } from 'react-icons-kit/fa/edit';

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

const TextUpload = styled.span`
  padding-left: 6px;
  padding-top: 2px;
`;

const ImageFram = styled.div`
  width: 90px;
  height: 90px;
  background-color: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
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

const FormStyled: CSSProperties = {
  paddingLeft: 50,
  paddingRight: 50,
};

const AddressStyled: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const ICON_STYLED: CSSProperties = {
  color: 'gray',
};

const BUTTON: CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  marginLeft: 12,
};

const EditUser: React.FC<Props> = observer((props: any) => {
  const { t } = useTranslation();
  // const { control, handleSubmit } = useForm();
  const [file, setFile] = useState<FileProps>({});

  // const onSubmit = data => console.log(data);

  useEffect(() => {
    return () => {
      setFile({});
    };
  }, []);

  const handleSubmit = (formState: InputData) => {
    console.log('form state', formState);
  };

  const handleSave = (value: any) => {
    console.log('value :>> ', value);
    // if (value !== value) {
    //   // on save
    //   console.log('newValue !== oldValue -> go to save')
    // }
  };

  const handleUploadFile = (event: any) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleDeletFile = (id: number | string) => {
    console.log('file id :>> ', id);
  };

  const handleAddress = () => {};

  const files: any = [
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

  const statusOptions: any = [
    {
      label: t('statusWaitForApproval'),
      value: 0,
    },
    {
      label: t('statusApproved'),
      value: 1,
      isSelected: true,
    },
    {
      label: t('statusRejected'),
      value: 2,
    },
  ];

  return (
    <div>
      <CardHeader>
        <div className="block-data-header">
          <span className="font-data-header">{t('userInfo')}</span>
          {/* <h3>User info</h3> */}
        </div>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps} name="add-user" style={FormStyled}>
              <Row>
                <Col breakPoint={{ xs: 3, sm: 2, md: 2 }}>
                  <ImageFram>
                    <Icon icon={ic_person} size={40} />
                  </ImageFram>
                </Col>
                <Col breakPoint={{ xs: 9, sm: 5, md: 5 }}>
                  <div>
                    <Name>{'Firstname Lastname'}</Name>
                  </div>

                  <FormEdit
                    label={`${t('memberSince')} :`}
                    value={'Jan 1, 2021 00:00:00'}
                    showEditIcon={false}
                    containerStyle={{ marginBottom: 12 }}
                    valueStyle={{ fontWeight: 0 }}
                  />
                  <FormEdit label={`${t('legalType')} :`} value={'Company'} handleSave={handleSave} />
                  <FormEdit label={`${t('userType')} :`} value={'Shipper'} handleSave={handleSave} />
                  <FormEdit label={`${t('phoneNumber')} :`} value={'+66922211112'} handleSave={handleSave} />
                  <FormEdit label={`${t('email')} :`} value={'my.mail@example.com'} handleSave={handleSave} />
                </Col>
                <Col breakPoint={{ xs: 12, sm: 5, md: 5 }}>
                  <Row style={{ marginBottom: 12 }}>
                    <Col breakPoint={{ xs: 8, sm: 8, md: 8 }}>
                      <Name>{t('userDoc')}</Name>
                    </Col>
                    <Col breakPoint={{ xs: 4, sm: 4, md: 4 }}>
                      <Field label="" name="uploadFile" defaultValue="">
                        {({ fieldProps, error, meta: { valid } }: any) => (
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <MaterialButton
                              variant="contained"
                              component="label"
                              onChange={(event: any) => handleUploadFile(event)}
                            >
                              <Input type={'file'} />
                              <Icon icon={upload} size={20} />
                              <TextUpload>{t('upload')}</TextUpload>
                            </MaterialButton>
                            {/* <ShowFileName>{file?.name || ''}</ShowFileName> */}
                          </div>
                        )}
                      </Field>
                    </Col>
                  </Row>

                  <Row>
                    {files.map((file: any) => {
                      return (
                        <Col key={file.id}>
                          <ListFile
                            fileName={file.name}
                            date={file.date}
                            handleDelete={() => handleDeletFile(file.id)}
                          />
                        </Col>
                      );
                    })}

                    <Col style={{ marginTop: 20 }}>
                      <FormEdit
                        label={`${t('status')} :`}
                        value={'Wait for Approval'}
                        valueStyle={{ color: 'orangered' }}
                        type={'dropdown'}
                        dropDownOption={statusOptions}
                        handleSave={handleSave}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col style={{ marginTop: 30 }}>
                  <Name style={{ marginBottom: 12 }}>{t('Address')}</Name>
                  <div style={AddressStyled}>
                    <Address>
                      {'91/1 Songphol Soi 9, Tambon Lam Phaya, Mueang Nakhon Pathom District, Nakhon Pathom 73000'}
                    </Address>
                    <button style={BUTTON} onClick={handleAddress}>
                      <Icon icon={edit} style={ICON_STYLED} size={22} />
                    </button>
                  </div>
                </Col>
              </Row>
            </form>
          )}
        </Form>
      </CardBody>
    </div>
  );
});

export default EditUser;
