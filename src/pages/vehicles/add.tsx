import React, { Fragment, useState } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';
import { navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import { Row, Col } from '@paljs/ui';
import { useMst } from '../../stores/root-store';
import styled from 'styled-components';

import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage } from '@atlaskit/form';

import Textfield from '@atlaskit/textfield';
import ImageUpload from '../../components/truck/widgets/image-upload';
import TruckTypesSelector from '../../components/dropdowns/truckType.selector';
import { STALL_HEIGHT, TIPPER_DUMP } from '../../components/truck/stall-height';
import Select from '@atlaskit/select';

interface SelectValue {
  labal: any;
  value: string;
}

const AddTrucks = observer(() => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [stalls, setStalls] = useState<SelectValue[]>([]);
  const [dumps, setDumps] = useState<SelectValue[]>([]);

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem onClick={() => navigate('/vehicles')} text={t('vehicle.management')} key="vehicle-management" />
      <BreadcrumbsItem text={t('vehicle.add')} key="vehicle-add" />
    </Breadcrumbs>
  );

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('vehicle.add')}</PageHeader>
      <Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
        {({ formProps }: any) => (
          <form {...formProps}>
            <div>
              <Row between="xs">
                <Col breakPoint={{ xs: 12, md: 5 }}>
                  <div>
                    <Row style={{ marginRight: 0 }}>
                      <Col breakPoint={{ xs: 12 }}>
                        <Field label={t('carOwner')} name="carOwner" isRequired>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Textfield {...fieldProps} />
                              {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                    <Row style={{ marginRight: 0 }}>
                      <Col breakPoint={{ xs: 12 }}>
                        <Field label={t('typeCar')} name="typeCar" isRequired>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <TruckTypesSelector
                                {...fieldProps}
                                maxWidth="100%"
                                onSelect={(e: any) => {
                                  fieldProps.onChange(e);

                                  const stallOptions = STALL_HEIGHT(t, e);
                                  setStalls(stallOptions);

                                  const dumpOptions = TIPPER_DUMP(t, e);
                                  setDumps(dumpOptions);
                                }}
                                placeholder={t('pleaseselect')}
                                language={loginStore.language}
                              />
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                    <Row between="xs" style={{ marginRight: -24 }}>
                      <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                        <Field label={t('stall')} name="stall" defaultValue={stalls[0]}>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Select
                                inputId="vehicle-stall-height"
                                className="single-select"
                                classNamePrefix="react-select"
                                options={stalls}
                                placeholder=""
                                {...fieldProps}
                                isDisabled={!stalls?.length || stalls?.length === 0}
                              />
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                      <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                        <Field label={t('sale')} name="sale" defaultValue={dumps[0]}>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Select
                                inputId="vehicle-dump"
                                className="single-select"
                                classNamePrefix="react-select"
                                options={dumps}
                                placeholder=""
                                {...fieldProps}
                                isDisabled={!dumps?.length || dumps?.length === 0}
                              />
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                    <Row style={{ marginRight: 0 }}>
                      <Col breakPoint={{ xs: 12 }}>
                        <Field label={t(`registrationNumber`)} name="registrationNumber" isRequired>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Textfield {...fieldProps} />
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5 }}>
                  <Field label="" name="upload">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <ImageUpload {...fieldProps} />
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
            </div>
            <FormFooter>
              <SubmitButton type="submit">Submit</SubmitButton>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
});

export default AddTrucks;

const SubmitButton = styled(Button)`
  border: 1px solid #fbbc12;
  background-color: #fbbc12;
  color: black;
`;
