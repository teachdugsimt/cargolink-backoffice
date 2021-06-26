import React, { useEffect, useState, useRef } from 'react';
import { InputGroup } from '@paljs/ui/Input';
import { Link, navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../stores/root-store';
import { ChangePasswordPayload, IChangePasswordDTO } from '../../services/password-api';
import Swal from 'sweetalert2';
import { LoadingButton } from '@atlaskit/button';
import { useTranslation } from 'react-i18next';

import Auth, { Group } from '.';
import SEO from '../SEO';
import TextField from '@atlaskit/textfield';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  HelperMessage,
  ValidMessage,
} from '@atlaskit/form';
interface Props {
  token: string;
}
const ChangePasswordComponent = ({ token }: Props) => {
  const { passwordChangeStore } = useMst();
  const { t: generalT } = useTranslation();
  const { t } = useTranslation('changePassword');

  const submitRef = useRef<HTMLButtonElement | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => submitRef?.current?.click();

  const submitChangePassword = ({ password, passwordConfirm }) => {
    // e.preventDefault();
    if (password != passwordConfirm) return onPasswordValidateFailed();
    const payload: ChangePasswordPayload = {
      token,
      password,
      confirmPassword: passwordConfirm,
    }
    passwordChangeStore.changePassword(payload);
    setSubmitted(true);
    return false;
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    const isEnterPressed = event.key === 'Enter';
    if (isEnterPressed && submitRef) submitRef.current?.click();
  }

  const onPasswordValidateFailed = () => {
    Swal.fire({
      icon: 'error',
      text: `${generalT('passwordNotMatch')}!`
    }).then(() => {
      setPassword('');
      setPasswordConfirm('');
    });
  }

  const onApiError = (message: string) => {
    Swal.fire({
      icon: 'error',
      text: message,
    })
  }

  const onSuccess = () => {
    Swal.fire({
      icon: 'success',
      text: t('changedMessage'),
    }).then(({ isConfirmed }) => {
      isConfirmed && navigate('/');
    })
  }

  const onStoreUpdated = () => {
    const { fetching, response, error } = passwordChangeStore;
    const { message } = response as IChangePasswordDTO;
    const isOK = message != null;
    const isError = error && error.length;
    const isApiResponse = !fetching && (isOK || isError) && submitted;
    if (isApiResponse) {
      if (isError) onApiError(error as string);
      else if (message === 'PASSWORD_DO_NOT_MATCH') onPasswordValidateFailed();
      else if (message === 'REQUEST_SUCCESS') onSuccess();
    }
  }

  useEffect(onStoreUpdated, [passwordChangeStore.fetching, passwordChangeStore.response, passwordChangeStore.error]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    }
  }, []);

  const title = t('title');
  return (
    <Auth title={title} subTitle={t('subtitle')}>
      <SEO title={title} />
      <Form onSubmit={submitChangePassword}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field
              name="password"
              label={t('newPassword')}
              defaultValue=""
              isRequired
            >
              {({ fieldProps, error, valid }) => (
                <>
                  <TextField {...fieldProps} type="password" />
                </>
              )}
            </Field>

            <Field
              name="passwordConfirm"
              label={t('confirmPassword')}
              defaultValue=""
              isRequired
            >
              {({ fieldProps, error, valid }) => (
                <>
                  <TextField {...fieldProps} type="password" />
                </>
              )}
            </Field>

            <FormFooter>
              <div style={{
                display: 'flex', flex: 1, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center'
              }}>
                <Link to="/auth/login">{generalT('backToLogin')}</Link>
                <LoadingButton appearance="warning" isLoading={passwordChangeStore.fetching} type="submit">
                  {t('changePassword')}
                </LoadingButton>
              </div>
            </FormFooter>
          </form>
        )}
      </Form>
      {/* <form onSubmit={submitChangePassword}>
        <InputGroup fullWidth>
          <input
            type="password"
            required={true}
            autoFocus={true}
            placeholder={t('newPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        <InputGroup fullWidth>
          <input
            type="password"
            required={true}
            placeholder={t('confirmPassword')}
            value={passwordConfirm}

            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </InputGroup>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadingButton appearance="warning" isLoading={passwordChangeStore.fetching} onClick={submit}>
            {t('changePassword')}
          </LoadingButton>
        </div>
        <button style={{ display: 'none' }} ref={submitRef} type="submit" disabled={passwordChangeStore.fetching} />
      </form> */}
      {/* <Group> */}
      {/* <Link to="/auth/login">{generalT('backToLogin')}</Link> */}
      {/* <Link to="/auth/register">{generalT('register')}</Link> */}
      {/* </Group> */}
    </Auth>
  );
}

export default observer(ChangePasswordComponent);
