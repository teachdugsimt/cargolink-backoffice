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

import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

interface PickUpPointProp {
  pickup: { from: any; to: any[] };
  setPickup: (value: { from: any; to: any[] }) => void;
  disableOperator?: boolean;
  transportData?: {
    operator: {
      label: string;
      value: string;
    },
    location?: {
      lat?: number;
      lng?: number;
    },
    dateTime?: string;
    name?: string;
    contactName?: string;
    contactMobileNo?: string;
  }
}

const PickUpPoint: React.FC<PickUpPointProp> = observer(({ pickup, disableOperator, transportData, setPickup }) => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [transport, setTransport] = useState<any>({
    operator: { label: 'ขึ้น', value: 'UP' },
    location: { lat: 0, lng: 0 },
  });
  const [isAdd, setIsAdd] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressLocation, setAddressLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isReload, setIsReload] = useState<boolean>(false);

  useEffect(() => {
    if (transportData) {
      setTransport(transportData);
    }
  }, [])

  useEffect(() => {
    if (transportData) {
      setIsReload(true);
    }
  }, [transportData])

  const onSubmit = () => {
    // console.log('form submitted pickup point', transport);
    setIsAdd(true);
    if (transport?.operator?.value === 'UP') {
      setPickup({ ...pickup, from: transport });
    } else {
      let to: any[] = [];
      if (pickup?.to) to = JSON.parse(JSON.stringify(pickup?.to));
      to.push(transport);
      setPickup({ ...pickup, to });
    }
  };

  const isDisabled = false;

  return (
    // <Form onSubmit={onSubmit}>
    //   {({ formProps }: any) => (
    //     <form {...formProps}>
    <GroupItem>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <Field label={t('operator')} name="operator" defaultValue={{ label: 'ขึ้น', value: 'UP' }} isRequired>
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
                  isDisabled={disableOperator}
                  defaultValue={{ label: 'ขึ้น', value: 'UP' }}
                  value={transport?.operator}
                  onChange={(e: any) => setTransport({ ...transport, operator: e })}
                />
              </Fragment>
            )}
          </Field>
        </div>
        <div style={{ flex: 2, marginLeft: 10 }}>
          <Field label={t('dateTime')} name="dateTime" isRequired>
            {({ fieldProps }: any) => (
              <Fragment>
                {isReload && <DateTimePicker
                  {...fieldProps}
                  value={transport.dateTime}
                  initialValue={transport?.dateTime}
                  onChange={(e: any) => setTransport({ ...transport, dateTime: e })}
                  locale={loginStore.language}
                />}
                {!isReload && <DateTimePicker
                  {...fieldProps}
                  value={transport?.dateTime}
                  onChange={(e: any) => setTransport({ ...transport, dateTime: e })}
                  locale={loginStore.language}
                />}
              </Fragment>
            )}
          </Field>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 'auto', marginTop: 20 }}>
          <GooglePlacesAutocomplete
            apiKey={process.env.GOOGLE_API_KEY || 'AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw'}
            apiOptions={{ language: 'th' }}
            selectProps={{
              placeholder: 'ค้นหาที่อยู่ ...',
              value: null,
              styles: {
                control: (base) => ({
                  ...base,
                  border: '2px solid #f5f5f5',
                }),
              },
              onChange: (e: any) => {
                // setAddressLabel(e.label)
                // setTransport({ ...transport, name: e.label })
                geocodeByAddress(e.label)
                  .then((results) => getLatLng(results[0]))
                  .then(({ lat, lng }) => {
                    // setAddressLocation({ lat, lng })
                    setTransport({ ...transport, name: e.label, location: { lat, lng } });
                    // console.log('Successfully got latitude and longitude', { lat, lng });
                  });
              },
            }}
          />

          <Field label={t('Address')} name="name">
            {({ fieldProps }: any) => (
              <Fragment>
                <TextArea
                  resize="auto"
                  style={{ height: 100 }}
                  {...fieldProps}
                  value={transport?.name}
                  onChange={(e: any) => setTransport({ ...transport, name: e.target.value })}
                  isInvalid={isAdd && !transport?.name}
                />
                {isAdd && !transport?.name && <ErrorMessage>{t('fieldCarOwner')}</ErrorMessage>}
              </Fragment>
            )}
          </Field>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <Field name="lat">
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Textfield
                      placeholder={'latitude'}
                      {...fieldProps}
                      value={transport?.location?.lat}
                      onChange={(e: any) => setTransport({ ...transport, contactName: e.target.value })}
                    />
                  </Fragment>
                )}
              </Field>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <Field name="lng">
                {({ fieldProps }: any) => (
                  <Fragment>
                    <Textfield
                      placeholder={'longitude'}
                      {...fieldProps}
                      value={transport?.location?.lng}
                      onChange={(e: any) => setTransport({ ...transport, contactMobileNo: e.target.value })}
                    />
                  </Fragment>
                )}
              </Field>
            </div>
          </div>
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 27 }}>
          <Button type="button" style={{ backgroundColor: 'white' }}>
            <img src={images.homeSearch} style={{ width: 50, height: 50 }} />
          </Button>
        </div> */}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <Field label={t('consigneeName')} name="contactMobileName">
            {({ fieldProps }: any) => (
              <Fragment>
                <Textfield
                  placeholder={t('consigneeName')}
                  {...fieldProps}
                  value={transport?.contactName}
                  onChange={(e: any) => setTransport({ ...transport, contactName: e.target.value })}
                />
              </Fragment>
            )}
          </Field>
        </div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          <Field label={t('contactNumber')} name="contactMobileNo">
            {({ fieldProps }: any) => (
              <Fragment>
                <Textfield
                  placeholder={t('contactNumber')}
                  {...fieldProps}
                  value={transport?.contactMobileNo}
                  onChange={(e: any) => setTransport({ ...transport, contactMobileNo: e.target.value })}
                />
              </Fragment>
            )}
          </Field>
        </div>
      </div>
      <FormFooter>
        <Button
          type="button"
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
          onClick={onSubmit}
        >
          <SubmitText>{t('add')}</SubmitText>
        </Button>
      </FormFooter>
    </GroupItem>
    //     </form>
    //   )}
    // </Form>
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
