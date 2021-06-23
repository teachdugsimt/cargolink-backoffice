import React, { useState, useEffect, useRef } from 'react';
import { InputGroup } from '@paljs/ui/Input';
import { Link, navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../stores/root-store';
import Swal from 'sweetalert2';
import { LoadingButton } from '@atlaskit/button';
import { useTranslation } from 'react-i18next';

import SEO from '../../components/SEO';
import Auth, { Group } from '../../components/Auth';

const RequestPassword = () => {
  const { passwordResetStore } = useMst();
  const { t } = useTranslation('resetPassword');
  const { t: generalT } = useTranslation();
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => submitRef?.current?.click();
  const submitResetPassword = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (email.length) {
      passwordResetStore.resetPassword(email);
      setSubmitted(true);
    }
    return false;
  }
  const handleKeyPress = (event: KeyboardEvent) => {
    const isEnterPressed = event.key === 'Enter';
    if (isEnterPressed && submitRef) submitRef.current?.click();
  }

  const onApiError = (message: string) => {
    Swal.fire({
      icon: 'error',
      text: message,
    });
  }

  const onSuccess = () => {
    Swal.fire({
      icon: 'success',
      text: `Reset password link was sent to ${email}`,
    }).then(({ isConfirmed }) => {
      isConfirmed && navigate('/');
    });
  }

  const onStoreUpdated = () => {
    const { fetching, data_password, error_password } = passwordResetStore;
    const { message, alreadySent } = data_password;
    const isOK = message != null && alreadySent != null;
    const isError = error_password != null && error_password.length;
    const isApiResponse = !fetching && (isOK || isError) && submitted;
    if (isApiResponse) {
      if (isError) onApiError(error_password as string);
      else onSuccess();
    }
  }

  useEffect(onStoreUpdated, [
    passwordResetStore.fetching,
    passwordResetStore.error_password,
    passwordResetStore.data_password,
  ]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    }
  }, []);

  const titleText = t('title');
  const subtitle = t('subtitle');
  return (
    <Auth title={titleText} subTitle={subtitle}>
      <SEO title={titleText} />
      <form onSubmit={submitResetPassword}>
        <InputGroup fullWidth>
          <input
            autoFocus={true}
            type="email"
            placeholder={generalT('email')}
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadingButton appearance="warning" isLoading={passwordResetStore.fetching} onClick={submit}>
            {t('requestPassword')}
          </LoadingButton>
        </div>
        <button style={{ display: 'none' }} ref={submitRef} type="submit" disabled={passwordResetStore.fetching} />
      </form>
      <Group>
        <Link to="/auth/login">{generalT('backToLogin')}</Link>
        <Link to="/auth/register">{generalT('register')}</Link>
      </Group>
    </Auth>
  );
}

export default observer(RequestPassword)