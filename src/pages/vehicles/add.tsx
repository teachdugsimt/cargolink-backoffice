import React, { Fragment, useState } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import { useTranslation } from 'react-i18next';
import { navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../stores/root-store';
import styled from 'styled-components';

import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage, ErrorMessage, ValidMessage } from '@atlaskit/form';

import Textfield from '@atlaskit/textfield';
import ImageUpload from '../../components/truck/widgets/image-upload';
import TruckTypesSelector from '../../components/dropdowns/truckType.selector';
import { STALL_HEIGHT, TIPPER_DUMP } from '../../components/truck/stall-height';
import Select from '@atlaskit/select';
import MultiSelect from '@atlaskit/multi-select';

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

  const isDisabled = false;

  const selectItems = [{ items: [] }];

  const onSubmit = (formState: any) => {
    console.log('form submitted', formState);
  };

  return (
    <div>
      <PageHeader breadcrumbs={breadcrumbs}>{t('vehicle.add')}</PageHeader>
      <Form onSubmit={onSubmit}>
        {({ formProps }: any) => (
          <form {...formProps}>
            <GroupItem>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Field label={t('carOwner')} name="carOwner" isRequired>
                    {({ fieldProps, error, meta: { valid } }: any) => (
                      <Fragment>
                        <Textfield {...fieldProps} placeholder={`${t('carOwner')}`} />
                      </Fragment>
                    )}
                  </Field>
                  <Field label={t('typeCar')} name="typeCar" isRequired>
                    {({ fieldProps, error, meta: { valid } }: any) => (
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
                        {error === 'INCORRECT_PHRASE' && (
                          <ErrorMessage>Incorrect, try &lsquo;open sesame&rsquo;</ErrorMessage>
                        )}
                      </Fragment>
                    )}
                  </Field>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1, marginRight: 10 }}>
                      <Field label={t('stall')} name="stall" defaultValue={stalls[0]}>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Select
                              inputId="vehicle-stall-height"
                              className="single-select"
                              classNamePrefix="react-select"
                              options={stalls}
                              placeholder={t('stall')}
                              {...fieldProps}
                              isDisabled={!stalls?.length || stalls?.length === 0}
                            />
                          </Fragment>
                        )}
                      </Field>
                    </div>
                    <div style={{ flex: 1, marginLeft: 10 }}>
                      <Field label={t('sale')} name="sale" defaultValue={dumps[0]}>
                        {({ fieldProps }: any) => (
                          <Fragment>
                            <Select
                              inputId="vehicle-dump"
                              className="single-select"
                              classNamePrefix="react-select"
                              options={dumps}
                              placeholder={t('sale')}
                              {...fieldProps}
                              isDisabled={!dumps?.length || dumps?.length === 0}
                            />
                          </Fragment>
                        )}
                      </Field>
                    </div>
                  </div>
                  <Field label={t(`registrationNumber`)} name="registrationNumber" isRequired>
                    {({ fieldProps }: any) => {
                      return (
                        <Fragment>
                          <MultiSelect
                            items={selectItems}
                            placeholder={`${t('registrationNumber')}`}
                            onNewItemCreated={(e: any) => console.log('onNewItemCreated', e)}
                            onSelectedChange={(e: any) => console.log('select change', e)}
                            shouldAllowCreateItem
                            shouldFitContainer
                          />
                          <HelperMessage>{t('registrationsTrailers')}</HelperMessage>
                        </Fragment>
                      );
                    }}
                  </Field>
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <Field label="" name="upload">
                    {({ fieldProps }: any) => (
                      <Fragment>
                        <ImageUpload {...fieldProps} />
                      </Fragment>
                    )}
                  </Field>
                </div>
              </div>
            </GroupItem>
            <FormFooter>
              <Button type="button" style={BottomBackStyled} onClick={() => navigate('/vehicles')} testId="backButton">
                <BackText>{t('back')}</BackText>
              </Button>
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
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
});

export default AddTrucks;

const BackText = styled.span`
  color: #fbbc12;
`;

const SubmitText = styled.span`
  color: #000;
`;

const BottomStyled = {
  margin: '0 6px',
};

const BottomBackStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: 'transparent',
};

const BottomSubmitStyled = {
  ...BottomStyled,
  border: '1px solid #FBBC12',
  backgroundColor: '#FBBC12',
};

const GroupItem = styled.div`
  display: flex;
  flex-direction: column;
`;
