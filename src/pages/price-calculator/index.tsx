import React, { useEffect, useState } from 'react'
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { observer } from 'mobx-react-lite';
import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage, ValidMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components'
import TruckTypesSelector from '../../components/dropdowns/truckType.selector';
import { useMst } from '../../stores/root-store';
import priceCalculator from '../../helpers/price-calculator';

import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import * as dstnc from 'google-distance-matrix'

const PriceCalculator = observer(() => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [truckType, setTruckType] = useState(0)
  const [distance, setDistance] = useState(50)
  const [price, setPrice] = useState(0)
  const [cost, setCost] = useState(0)
  const [pickupAddress, setPickupAddress] = useState('')
  const [pickupLocation, setPickupLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number, lng: number } | null>(null)

  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('price-calculator.index')} key="price-calculator" />
    </Breadcrumbs>
  );

  const onSubmit = (formState: any) => {
    console.log('form submitted', formState);
  };

  useEffect(() => {

    const p = priceCalculator(+truckType, +distance)
    setPrice(p)

  }, [truckType, distance])

  useEffect(() => {
    let c = price - (price * 15 / 100)
    setCost(c)
  }, [price])

  useEffect(() => {

    async function getDirection() {
      const result = await fetch('https://maps.googleapis.com/maps/api/directions/json?origin=13.788485,100.610133&destination=18.7883439,98.98530079&key=AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw')
      console.log(result)
    }

    getDirection()

  }, [pickupLocation, deliveryLocation])

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('price-calculator.index')}</PageHeader>

      <Form onSubmit={onSubmit}>
        {({ formProps }: any) => (
          <form {...formProps}>
            <Row>
              <Col style={{ marginRight: 10 }}>

                <Field label={t('typeCar')} name="typeCar" isRequired>
                  {({ fieldProps, error, meta: { valid } }: any) => (
                    <>
                      <TruckTypesSelector
                        {...fieldProps}
                        maxWidth="100%"
                        onSelect={(e: any) => {
                          fieldProps.onChange(e);
                          console.log(e)
                          setTruckType(e)
                        }}
                        placeholder={t('pleaseselect')}
                        language={loginStore.language}
                      />
                      {error === 'INCORRECT_PHRASE' && (
                        <ErrorMessage>Incorrect, try &lsquo;open sesame&rsquo;</ErrorMessage>
                      )}
                    </>
                  )}
                </Field>

                <Row>
                  <Col style={{ marginRight: 10 }}>
                    <Field label={'จุดขึ้นสินค้า'} name="from">
                      {({ fieldProps, error, meta: { valid } }: any) => (
                        <>
                          <GooglePlacesAutocomplete
                            apiKey={process.env.GOOGLE_API_KEY || "AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw"}
                            selectProps={{
                              value: '',
                              onChange: (e) => {
                                setPickupAddress(e.label)
                                geocodeByAddress(e.label)
                                  .then(results => getLatLng(results[0]))
                                  .then(({ lat, lng }) => {
                                    setPickupLocation({ lat, lng })
                                    console.log('Successfully got latitude and longitude', { lat, lng })
                                  });
                              }
                            }}
                          />
                          <span>{pickupAddress}<br />{pickupLocation?.lat} {pickupLocation?.lng}</span>
                          {/* <Textfield  {...fieldProps} placeholder={`จุดขึ้นสินค้า`} value={pickupAddress} /> */}
                        </>
                      )}
                    </Field>
                  </Col>
                  <Col style={{ marginLeft: 10 }}>
                    <Field label={'จุดลงสินค้า'} name="to">
                      {({ fieldProps, error, meta: { valid } }: any) => (
                        <>
                          <GooglePlacesAutocomplete
                            apiKey={process.env.GOOGLE_API_KEY || "AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw"}
                            selectProps={{
                              value: '',
                              onChange: (e) => {
                                setDeliveryAddress(e.label)
                                geocodeByAddress(e.label)
                                  .then(results => getLatLng(results[0]))
                                  .then(({ lat, lng }) => {
                                    setDeliveryLocation({ lat, lng })
                                    console.log('Successfully got latitude and longitude', { lat, lng })
                                  });
                              }
                            }}
                          />
                          <span>{deliveryAddress}<br />{deliveryLocation?.lat} {deliveryLocation?.lng}</span>
                          {/* <Textfield placeholder={`จุดลงสินค้า`} value={deliveryAddress} /> */}
                        </>
                      )}
                    </Field>
                  </Col>
                </Row>

                <Field label={t('distance') + ' (km.)'} name="distance" isRequired>
                  {({ fieldProps, error, meta: { valid } }: any) => (
                    <>
                      <Textfield {...fieldProps} placeholder={`${t('distance')}`} type="number"
                        defaultValue={distance}
                        onChange={(e) => setDistance(e.target.value)} />
                    </>
                  )}
                </Field>


              </Col>
              <Col style={{ marginLeft: 10, marginTop: 32 }}>
                <Summary pink>
                  <Row>
                    <Col style={{ display: 'flex' }}>
                      <span>ราคาค่าวิ่ง</span>
                      <Value>{price.toLocaleString()}</Value>
                      <RangeLabel>บาท</RangeLabel>
                    </Col>
                    <Col style={{ marginLeft: 50, display: 'flex', flex: 2, flexDirection: 'column' }}>
                      <div style={{ display: 'flex', height: 30, flexDirection: 'row' }}>
                        <Col style={{ flex: 2 }}><span>ต้นทุน</span></Col><Col style={{ textAlign: 'right' }}><span>{cost.toLocaleString()} บาท</span></Col>
                      </div>
                      <div style={{ display: 'flex', height: 30, flexDirection: 'row' }}>
                        <Col style={{ flex: 2 }}><span>ส่วนต่าง (15%)</span></Col><Col style={{ textAlign: 'right' }}><span>{(price - cost).toLocaleString()} บาท</span></Col>
                      </div>
                      <div style={{ display: 'flex', height: 30, flexDirection: 'row' }}>
                        <Col style={{ flex: 2 }}><span>ราคาที่ Shipper อยากจ่าย</span></Col><Col style={{ textAlign: 'right' }}><span>{price.toLocaleString()} บาท</span></Col>
                      </div>
                      <div style={{ display: 'flex', height: 30, flexDirection: 'row' }}>
                        <Col style={{ flex: 2 }}><span>ราคาที่ Carrier อยากได้</span></Col><Col style={{ textAlign: 'right' }}><span>{Math.ceil(cost * 110 / 100).toLocaleString()} บาท</span></Col>
                      </div>
                    </Col>
                  </Row>
                </Summary>
              </Col>
            </Row>
            {/* <FormFooter>
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
                testId="submitButton"
              >
                <SubmitText>{t('confirm')}</SubmitText>
              </Button>
            </FormFooter> */}
          </form>
        )}
      </Form>

      <ModalTransition>
        {showLocationPicker && (
          <Modal
            actions={[
              { text: 'Try it now', onClick: close },
              { text: 'Learn more' },
            ]}
            onClose={() => setShowLocationPicker(false)}
            heading="เลือกสถานที่"
          >

          </Modal>
        )}
      </ModalTransition>

    </div>
  )
})

export default PriceCalculator

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Col = styled.div`
  flex: 1;
  flex-direction: column;
`;

const Summary = styled.div<{
  orange?: boolean | undefined;
  purple?: boolean | undefined;
  blue?: boolean | undefined;
  pink?: boolean | undefined;
}>`
  height: 180px;
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(128deg,
    ${props => props.orange ? '#fad961' :
    props.purple ? '#c56cd6' :
      props.blue ? '#13d6dd' :
        props.pink ? '#f36265' : 'white'} 0%,
    ${props => props.orange ? '#f76b1c' :
    props.purple ? '#3425af' :
      props.blue ? '#036cda' :
        props.pink ? '#961276' : 'white'} 100%);
  margin-right: 20px;
  margin-bottom: 20px;
  padding: 5px 10px;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Value = styled.span`
  font-size: 50px;
  line-height: 50px;
  text-align: right;
  margin-right: 10px;
`;

const RangeLabel = styled.span`
  font-size: 10px;
  text-align: right;
  margin-right: 12px;
`;
