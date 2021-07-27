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

const PriceCalculator = observer(() => {
  const { t } = useTranslation();
  const { loginStore } = useMst();
  const [truckType, setTruckType] = useState(0)
  const [distance, setDistance] = useState(50)
  const [price, setPrice] = useState(0)
  const [cost, setCost] = useState(0)

  const breadcrumbs = (
    <Breadcrumbs>
      <BreadcrumbsItem text={t('price-calculator.index')} key="price-calculator" />
    </Breadcrumbs>
  );

  const onSubmit = (formState: any) => {
    console.log('form submitted', formState);
  };

  useEffect(() => {

    if (truckType == 3) {
      let p = 550 + Math.floor((distance - 3) / 5) * 50
      setPrice(p)
    } else {
      setPrice(0)
    }

  }, [truckType, distance])

  useEffect(() => {
    let c = price - (price * 15 / 100)
    setCost(c)
  }, [price])

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
                          <Textfield {...fieldProps} placeholder={`จุดขึ้นสินค้า`} />
                        </>
                      )}
                    </Field>
                  </Col>
                  <Col style={{ marginLeft: 10 }}>
                    <Field label={'จุดลงสินค้า'} name="to">
                      {({ fieldProps, error, meta: { valid } }: any) => (
                        <>
                          <Textfield {...fieldProps} placeholder={`จุดลงสินค้า`} />
                        </>
                      )}
                    </Field>
                  </Col>
                </Row>

                <Field label={t('distance')} name="distance" isRequired>
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
