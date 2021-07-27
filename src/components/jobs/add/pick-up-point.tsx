import React, { useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage } from '@atlaskit/form';
import Button from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import styled from 'styled-components';
import TextArea from '@atlaskit/textarea';
import DateTimePicker from './datetimePicker';
import Select from '@atlaskit/select';
import images from '../../Themes/images';
import { useForm, Controller } from 'react-hook-form';

interface PickUpPointProp {
  pickup: { from: any; to: any[] };
  setPickup: (value: { from: any; to: any[] }) => void;
}

const PickUpPoint: React.FC<PickUpPointProp> = observer(({ pickup, setPickup }) => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const { register, handleSubmit, watch, errors, setValue, control, getValues } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      operator: null,
      dateTime: null,
      name: null,
      contactNumber: null,
      consigneeName: null,
    },
  });

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

  const isDisabled = false;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GroupItem>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field label={t('operator')} name="operator" defaultValue={{ label: 'ขึ้น', value: 'UP' }} isRequired>
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Controller
                      control={control}
                      name="operator"
                      render={({ onChange, value }) => {
                        return (
                          <Select
                            inputId="single-select-example"
                            className="single-select"
                            classNamePrefix="react-select"
                            value={value}
                            onChange={onChange}
                            options={[
                              { label: 'ขึ้น', value: 'UP' },
                              { label: 'ลง', value: 'DOWN' },
                            ]}
                            {...fieldProps}
                          />
                        );
                      }}
                      rules={{ required: true }}
                    />
                  </Fragment>
                )}
              </Field>
            </div>
            <div style={{ flex: 2, marginLeft: 10 }}>
              <Field label={t('dateTime')} name="dateTime" isRequired>
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Controller
                      control={control}
                      name="dateTime"
                      render={({ onChange, value }) => {
                        return (
                          <DateTimePicker {...fieldProps} locale={loginStore.language} />
                        );
                      }}
                      rules={{ required: true }}
                    />
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
                    <TextArea
                      style={{ height: 100 }}
                      name="name"
                      ref={register({ required: true })}
                      isInvalid={!!errors.name}
                      resize="auto"
                    />
                  </Fragment>
                )}
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 27 }}>
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
                    <Textfield
                      name="consigneeName"
                      ref={register({ required: false })}
                      placeholder={t('consigneeName')} />
                  </Fragment>
                )}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Field label={t('contactNumber')} name="contactMobileNo">
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Textfield 
                    name="contactNumber"
                    ref={register({ required: false })}
                    placeholder={t('contactNumber')}  />
                  </Fragment>
                )}
              </Field>
            </div>
          </div>
          <FormFooter>
            <Button
              type="submit"
              isDisabled={isDisabled}
              style={
                isDisabled
                  ? {
                    ...BottomSubmitStyled,
                    backgroundColor: '#D8D8D8',
                    border: 'none',
                  }
                  : BottomSubmitStyled
              }
              testId="pickupSubmitButton"
            >
              <SubmitText>{t('add')}</SubmitText>
            </Button>
          </FormFooter>
        </GroupItem>
      </form>
    </div>
  );
});

export default PickUpPoint;

const SubmitText = styled.span`
  color: #000;
`;

const BottomStyled = {
  margin: '0 6px',
};

const BottomSubmitStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: '#FBBC12',
};

const GroupItem = styled.div`
  margin-top: -8px;
`;
