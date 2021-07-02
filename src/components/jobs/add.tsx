import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../stores/root-store';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ITruckType } from '../../services/truck-type-api';
import { IProductType } from '../../services/product-type-api';
import Swal from 'sweetalert2';
import Spinner from '@atlaskit/spinner';
import { parseMobXToObject } from '../../utils';
import UserSelector from './user.selector';
import styled from 'styled-components';

import { Button } from '@paljs/ui/Button';
import { Card, CardBody, CardHeader } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';

interface IForm {
  contactMobileNo: string | null;
  contactName: string | null;
  name: string | null;
  productName: null;
  productTypeId: null;
  start: null;
  truckAmount: number | null;
  truckType: number | null;
  weight: number | null;
  items: any[];
}
const AddJobContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { loginStore, truckTypesStore, productTypesStore } = useMst();

  const [isLoading, setIsLoading] = useState(false);
  const [truckTypes, setTruckTypes] = useState<ITruckType[]>([]);
  const [productTypes, setProductTypes] = useState<IProductType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, errors } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      contactMobileNo: null,
      contactName: null,
      name: null,
      productName: null,
      productTypeId: null,
      start: null,
      truckAmount: null,
      truckType: null,
      weight: null,
      items: [],
    } as IForm,
  });

  console.log('watch', watch());

  const fireError = (title: string, text: string) => {
    Swal.fire({
      icon: 'error',
      title,
      text,
    });
  };

  const onSubmit = (data: any) => {
    console.log('submitted', data);
  };

  useEffect(() => {
    //? on product types loaded
    productTypesStore.data && setProductTypes(parseMobXToObject(productTypesStore.data));
  }, [productTypesStore.data]);

  useEffect(() => {
    //? on truck types loaded
    truckTypesStore.data && setTruckTypes(parseMobXToObject(truckTypesStore.data));
  }, [truckTypesStore.data]);

  useEffect(() => {
    type ErrorType = { title: string | null; text: string | null } | null;
    const truck: ErrorType = parseMobXToObject(truckTypesStore.error_response);
    const product: ErrorType = parseMobXToObject(productTypesStore.error_response);
    [truck, product].forEach((error) => error && fireError(error.title || '', error.text || ''));
  }, [truckTypesStore.error_response, productTypesStore.error_response]);

  useEffect(() => {
    //? check loading states
    const loadingStates = [truckTypesStore.loading, productTypesStore.loading];
    setIsLoading(loadingStates.some((loading) => loading));
  }, [truckTypesStore.loading, productTypesStore.loading]);

  useEffect(() => {
    truckTypesStore.getTruckTypes();
    productTypesStore.getProductTypes();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Spinner size="large" />
      </div>
    );
  }
  const Required = <span style={{ color: '#FF3D71' }}>*</span>;
  const Error = ({ id, message }: { id?: string; message: string }) => (
    <span id={id} style={{ color: '#ff3d71', marginLeft: 10, fontSize: '0.7375rem' }} role="alert">
      {message}
    </span>
  );
  return (
    <Wrapper className="add-job-wrapper">
      <CardHeader>
        <span>{t('addNewJob')}</span>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="form-add-data">
          <Row>
            <Col breakPoint={{ xs: 12, sm: 12, md: 4 }}>
              <p>
                {t('user')} {Required}
              </p>
              <UserSelector
                onUserSelect={(userId: string) => setUserId(userId)}
                placeholder={t('typeUserToFind')}
                noResultsMessage={t('noData')}
              />
            </Col>
            {/* <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('typeCar')} {Required}
              </p>
              <Controller
                as={
                  <Select
                    options={truckTypes.map((type) => ({
                      value: type.id + '',
                      label: type.name,
                    }))}
                    placeholder={t('pleaseselect')}
                  />
                }
                control={control}
                valueName="selected"
                rules={{ required: 'Truck type is required.' }}
                name="truckType"
                ref={register({ required: true })}
                aria-invalid={errors.truckType ? 'true' : 'false'}
              />
              {errors.truckType && <Error message={t('fieldTruckType')} />}
            </Col>
            <Col breakPoint={{ xs: 12, sm: 6, md: 4 }}>
              <p>
                {t('truckAmount')} {Required}
              </p>
              <input
                type="number"
                className="new-input-component"
                style={{ borderColor: errors.truckAmount ? '#FF3D71' : '' }}
                name="truckAmount"
                id="truckAmount"
                ref={register({ required: true })}
                aria-invalid={errors.truckAmount ? 'true' : 'false'}
              />
              {errors.truckAmount && <Error message={t('fieldTruckAmount')} />}
            </Col> */}
          </Row>
        </form>
      </CardBody>
    </Wrapper>
  );
});

export default AddJobContainer;

const Wrapper = styled.div`
  height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
`;
