import React, { useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage } from '@atlaskit/form';
import Button from '@atlaskit/button';
import { Row, Col } from '@paljs/ui';
import Textfield from '@atlaskit/textfield';
import styled from 'styled-components';
import TextArea from '@atlaskit/textarea';
import DateTimePicker from './datetimePicker';
import RouteWidget from '../../route/widgets/route';
import Select from '@atlaskit/select';
import images from '../../Themes/images';
import th from 'date-fns/locale/th';

const PickUpPoint: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [pickup, setPickup] = useState<any>(null);

  const onSubmit = (formState: any) => {
    // console.log('form submitted pickup point', formState);
    if (formState?.operator?.value === 'UP') {
      setPickup({ ...pickup, from: formState });
    } else {
      let to: any[] = [];
      if (pickup?.to) to = JSON.parse(JSON.stringify(pickup?.to));
      to.push(formState);
      setPickup({ ...pickup, to });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ formProps }: any) => (
        <form {...formProps}>
          <div style={{ marginTop: -16 }}>
            <Row between="xs">
              <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                <Row between="xs" style={{ alignItems: 'flex-end' }}>
                  <Col breakPoint={{ xs: 3, md: 2.5, lg: 3 }}>
                    <Field
                      label={t('operator')}
                      name="operator"
                      defaultValue={{ label: 'ขึ้น', value: 'UP' }}
                      isRequired
                    >
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <Select
                            inputId="single-select-example"
                            className="single-select"
                            classNamePrefix="react-select"
                            options={[
                              { label: 'ขึ้น', value: 'UP' },
                              { label: 'ลง', value: 'DOWN' },
                            ]}
                            {...fieldProps}
                          />
                        </Fragment>
                      )}
                    </Field>
                  </Col>
                  <Col breakPoint={{ xs: 7, md: 6.5, lg: 7 }}>
                    <Field label={t('dateTime')} name="dateTime" isRequired>
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <DateTimePicker {...fieldProps} locale={loginStore.language} />
                        </Fragment>
                      )}
                    </Field>
                  </Col>
                </Row>
                <Row between="xs">
                  <Col breakPoint={{ xs: 7, lg: 8, xl: 9 }} style={{ paddingRight: 0 }}>
                    <Field label={t('Address')} name="name" isRequired>
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <TextArea resize="auto" style={{ height: 100 }} {...fieldProps} />
                        </Fragment>
                      )}
                    </Field>
                  </Col>
                  <Col
                    breakPoint={{ xs: 3, lg: 3, xl: 2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 0 }}
                  >
                    <Button type="button" style={{ backgroundColor: 'white', marginTop: 16 }}>
                      <img src={images.homeSearch} style={{ width: 50, height: 50 }} />
                    </Button>
                  </Col>
                </Row>
                <Row between="xs">
                  <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                    <Field label={t('consigneeName')} name="contactName">
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <Textfield placeholder="" {...fieldProps} />
                        </Fragment>
                      )}
                    </Field>
                  </Col>
                  <Col breakPoint={{ xs: 5, md: 4.5, lg: 5 }}>
                    <Field label={t('contactNumber')} name="contactMobileNo">
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <Textfield placeholder="" {...fieldProps} />
                        </Fragment>
                      )}
                    </Field>
                  </Col>
                </Row>
                <FormFooter>
                  <SubmitButton type="submit">เพิ่ม</SubmitButton>
                </FormFooter>
              </Col>
              <Col breakPoint={{ xs: 12, md: 5, lg: 5.5 }}>
                <RouteWidget from={pickup?.from} to={pickup?.to} status="NEW" />
              </Col>
            </Row>
          </div>
        </form>
      )}
    </Form>
  );
});

export default PickUpPoint;

const SubmitButton = styled(Button)`
  border: 1px solid #fbbc12;
  background-color: #fbbc12;
  color: black;
`;
