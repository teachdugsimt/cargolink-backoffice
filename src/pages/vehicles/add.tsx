import React, { Fragment } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';
import { navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Row, Col } from '@paljs/ui';

import Button from '@atlaskit/button/standard-button';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage } from '@atlaskit/form';

import Textfield from '@atlaskit/textfield';

const AddTrucks = observer(() => {
  const { t } = useTranslation();

  const { register, control, handleSubmit, watch, errors } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      userId: null,
      contactMobileNo: null,
      contactName: null,
      name: null,
      productName: null,
      productTypeId: null,
      start: null,
      truckAmount: null,
      truckType: null,
      weight: null,
    },
  });

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
                        <Field label="เจ้าของรถ" name="example1" isRequired>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Textfield placeholder="Enter your details here" {...fieldProps} />
                              {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                    <Row style={{ marginRight: 0 }}>
                      <Col breakPoint={{ xs: 12 }}>
                        <Field label={`ประเภทรถ`} name="example1" isRequired>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Textfield placeholder="Enter your details here" {...fieldProps} />
                              {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                    <Row between="xs" style={{ marginRight: -24 }}>
                      <Col breakPoint={{ xs: 5 }}>
                        <Field label="คอก" name="example2">
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Textfield placeholder="Enter your details here" {...fieldProps} />
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                      <Col breakPoint={{ xs: 5 }}>
                        <Field label={`การลงสินค้า`} name="example1">
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Textfield placeholder="Enter your details here" {...fieldProps} />
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                    <Row style={{ marginRight: 0 }}>
                      <Col breakPoint={{ xs: 12 }}>
                        <Field label={`เลขทะเบียน`} name="example1" isRequired>
                          {({ fieldProps }: any) => (
                            <Fragment>
                              <Textfield placeholder="Enter your details here" {...fieldProps} />
                              {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                            </Fragment>
                          )}
                        </Field>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col breakPoint={{ xs: 12, md: 5 }}>
                  <Field label="Field label" name="example2">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <Textfield placeholder="Enter your details here" {...fieldProps} />
                        {/* <ErrorMessage>Help or instruction text goes here</ErrorMessage> */}
                      </Fragment>
                    )}
                  </Field>
                </Col>
              </Row>
            </div>
            <FormFooter>
              <Button type="submit" appearance="primary">
                Submit
              </Button>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
});

export default AddTrucks;
