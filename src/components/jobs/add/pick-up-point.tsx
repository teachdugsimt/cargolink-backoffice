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
          <GroupItem>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, marginRight: 10 }}>
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
                  </div>
                  <div style={{ flex: 2, marginLeft: 10 }}>
                    <Field label={t('dateTime')} name="dateTime" isRequired>
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <DateTimePicker {...fieldProps} locale={loginStore.language} />
                        </Fragment>
                      )}
                    </Field>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 'auto', marginRight: 10 }}>
                    <Field label={t('Address')} name="name" isRequired>
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <TextArea resize="auto" style={{ height: 100 }} {...fieldProps} />
                        </Fragment>
                      )}
                    </Field>
                  </div>
                  <div
                    style={{
                      flex: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 27,
                    }}
                  >
                    <Button type="button" style={{ backgroundColor: 'white' }}>
                      <img src={images.homeSearch} style={{ width: 50, height: 50 }} />
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 1, marginRight: 10 }}>
                    <Field label={t('consigneeName')} name="contactName">
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <Textfield placeholder="" {...fieldProps} />
                        </Fragment>
                      )}
                    </Field>
                  </div>
                  <div style={{ flex: 1, marginLeft: 10 }}>
                    <Field label={t('contactNumber')} name="contactMobileNo">
                      {({ fieldProps }: any) => (
                        <Fragment>
                          <Textfield placeholder="" {...fieldProps} />
                        </Fragment>
                      )}
                    </Field>
                  </div>
                </div>
                <FormFooter>
                  <SubmitButton type="submit">{t('add')}</SubmitButton>
                </FormFooter>
              </div>
              <div style={{ flex: 1, marginLeft: 10 }}>
                <RouteWidget from={pickup?.from} to={pickup?.to} status="NEW" />
              </div>
            </div>
          </GroupItem>
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

const GroupItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -8px;
`;
